import type { Prisma } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma";

export const RESERVATION_STATUS = {
  ACTIVE: "ACTIVE",
  CONSUMED: "CONSUMED",
  RELEASED: "RELEASED",
} as const;

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

    const productUpdated = await tx.product.updateMany({
      where: { id: line.productId, stock: { gte: line.quantity } },
      data: { stock: { decrement: line.quantity } },
    });
    if (productUpdated.count !== 1) {
      throw new StockInsufficientError(
        `Yetersiz stok: ${productNames.get(line.productId) ?? "Ürün"}`
      );
    }

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

  return resolved;
}

export interface StockReleaseLine {
  variantId: string;
  productId: string;
  quantity: number;
}

export async function releaseStock(tx: Tx, lines: StockReleaseLine[]) {
  for (const line of lines) {
    await tx.productVariant.updateMany({
      where: { id: line.variantId },
      data: { stock: { increment: line.quantity } },
    });
    await tx.product.updateMany({
      where: { id: line.productId },
      data: { stock: { increment: line.quantity } },
    });
  }
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
