import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma";

export const RESERVATION_STATUS = {
  ACTIVE: "ACTIVE",
  CONSUMED: "CONSUMED",
  RELEASED: "RELEASED",
} as const;

export const RESERVATION_TTL_MS = 24 * 60 * 60 * 1000; // 24 saat

export function reservationExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + RESERVATION_TTL_MS);
}

export interface StockLine {
  productId: string;
  size: string;
  color?: string | null;
  quantity: number;
}

export interface StockLineResolved extends StockLine {
  variantId: string;
  sku: string;
  name: string;
  slug: string;
  image: string | null;
  unitPrice: number;
}

export class StockInsufficientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StockInsufficientError";
  }
}

type Tx = Prisma.TransactionClient;

/**
 * Product.stock, varyant stoklarının denormalize toplamıdır.
 * Aggregate ile yeniden hesaplamak yerine işlem delta'sını (decrement/increment)
 * doğrudan uyguluyoruz — böylece aynı ürünün farklı varyantlarına eşzamanlı
 * dokunan transaction'lar (READ COMMITTED) birbirinin güncellemesini ezmez.
 */
async function applyProductStockDelta(
  tx: Tx,
  delta: Map<string, number>
) {
  for (const [productId, amount] of delta) {
    if (amount === 0) continue;
    await tx.product.update({
      where: { id: productId },
      data:
        amount > 0
          ? { stock: { increment: amount } }
          : { stock: { decrement: -amount } },
    });
  }
}

export async function resolveVariant(
  tx: Tx,
  productId: string,
  size: string,
  color?: string | null
) {
  if (color) {
    return tx.productVariant.findFirst({
      where: { productId, size, color },
    });
  }
  return (
    (await tx.productVariant.findFirst({
      where: { productId, size, color: null },
    })) ??
    (await tx.productVariant.findFirst({
      where: { productId, size },
      orderBy: { stock: "desc" },
    }))
  );
}

export async function reserveStock(
  tx: Tx,
  lines: StockLine[],
  productNames: Map<string, string>,
  productSlugs: Map<string, string>,
  productImages: Map<string, string | null>,
  productPrices: Map<string, number>
): Promise<StockLineResolved[]> {
  const resolved: StockLineResolved[] = [];
  const touchedProducts = new Map<string, number>();

  for (const line of lines) {
    const variant = await resolveVariant(
      tx,
      line.productId,
      line.size,
      line.color
    );
    if (!variant) {
      throw new StockInsufficientError(
        `Stokta yok: ${productNames.get(line.productId) ?? "Ürün"} (${line.size})`
      );
    }

    const updated = await tx.productVariant.updateMany({
      where: { id: variant.id, stock: { gte: line.quantity } },
      data: { stock: { decrement: line.quantity } },
    });
    if (updated.count !== 1) {
      throw new StockInsufficientError(
        `Yetersiz stok: ${productNames.get(line.productId) ?? "Ürün"} (${line.size})`
      );
    }

    touchedProducts.set(
      line.productId,
      (touchedProducts.get(line.productId) ?? 0) - line.quantity
    );

    resolved.push({
      ...line,
      variantId: variant.id,
      sku: variant.sku,
      name: productNames.get(line.productId) ?? "Ürün",
      slug: productSlugs.get(line.productId) ?? "",
      image: productImages.get(line.productId) ?? null,
      unitPrice:
        variant.price != null ? Number(variant.price) : (productPrices.get(line.productId) ?? 0),
    });
  }

  await applyProductStockDelta(tx, touchedProducts);

  return resolved;
}

export interface StockReleaseLine {
  variantId: string;
  productId: string;
  quantity: number;
}

export async function releaseStock(tx: Tx, lines: StockReleaseLine[]) {
  const touchedProducts = new Map<string, number>();

  for (const line of lines) {
    if (!line.variantId || !line.productId) continue;
    const updated = await tx.productVariant.updateMany({
      where: { id: line.variantId },
      data: { stock: { increment: line.quantity } },
    });
    if (updated.count === 1) {
      touchedProducts.set(
        line.productId,
        (touchedProducts.get(line.productId) ?? 0) + line.quantity
      );
    }
  }

  await applyProductStockDelta(tx, touchedProducts);
}

/**
 * Rezervasyonu süresi dolup iade edilmiş (RELEASED) stoku, ödeme sonrası
 * yeniden tüketir. Variant bazlı gte guard ile oversell engellenir.
 */
export async function consumeOrderStock(tx: Tx, lines: StockReleaseLine[]) {
  const touchedProducts = new Map<string, number>();

  for (const line of lines) {
    if (!line.variantId || !line.productId) continue;
    const updated = await tx.productVariant.updateMany({
      where: { id: line.variantId, stock: { gte: line.quantity } },
      data: { stock: { decrement: line.quantity } },
    });
    if (updated.count !== 1) {
      throw new StockInsufficientError(
        `Rezervasyon süresi dolmuş ürün artık stokta yok (${line.variantId})`
      );
    }
    touchedProducts.set(
      line.productId,
      (touchedProducts.get(line.productId) ?? 0) - line.quantity
    );
  }

  await applyProductStockDelta(tx, touchedProducts);
}

export interface ReservationLine {
  productId: string;
  variantId: string;
  sku: string;
  name: string;
  slug: string;
  image: string | null;
  size: string;
  color: string | null;
  quantity: number;
  unitPrice: number;
}

export interface ReservationRecord {
  userId: string;
  items: unknown;
}

export async function releaseReservation(stripeSessionId: string) {
  const reservation = await prisma.orderReservation.findUnique({
    where: { stripeSessionId },
  });
  if (!reservation || reservation.status !== RESERVATION_STATUS.ACTIVE) {
    return;
  }
  const lines = (Array.isArray(reservation.items)
    ? reservation.items
    : []) as unknown as ReservationLine[];
  await prisma.$transaction(async (tx) => {
    const updated = await tx.orderReservation.updateMany({
      where: { stripeSessionId, status: RESERVATION_STATUS.ACTIVE },
      data: { status: RESERVATION_STATUS.RELEASED },
    });
    if (updated.count === 1) {
      await releaseStock(
        tx,
        lines.map((l) => ({
          variantId: l.variantId,
          productId: l.productId,
          quantity: l.quantity,
        }))
      );
    }
  });
}

export async function releaseExpiredReservations(
  now = new Date()
): Promise<number> {
  const expired = await prisma.orderReservation.findMany({
    where: {
      status: RESERVATION_STATUS.ACTIVE,
      OR: [
        { expiresAt: { lt: now } },
        // TTL öncesi kayıtlar için geriye dönük fallback (migration backfill'iyle birebir)
        {
          expiresAt: null,
          createdAt: { lt: new Date(now.getTime() - RESERVATION_TTL_MS) },
        },
      ],
    },
    select: { stripeSessionId: true },
  });

  for (const reservation of expired) {
    await releaseReservation(reservation.stripeSessionId);
  }
  return expired.length;
}
