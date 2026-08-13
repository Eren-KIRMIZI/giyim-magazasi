import { randomBytes } from "crypto";
import type { Prisma, Order, OrderItem } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Beklemede",
  PAID: "Ödendi",
  SHIPPED: "Kargolandı",
  DELIVERED: "Teslim Edildi",
  CANCELLED: "İptal Edildi",
  REFUNDED: "İade Edildi",
  FAILED: "Başarısız",
};

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

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const suffix = randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
  return `LD-${year}-${suffix}`;
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

export async function createOrderFromReservation(
  reservation: ReservationRecord,
  status: string,
  data: {
    stripeSessionId: string;
    paymentIntent?: string | null;
    stockConsumed: boolean;
  }
) {
  const lines = (Array.isArray(reservation.items)
    ? reservation.items
    : []) as unknown as ReservationLine[];
  if (lines.length === 0) return;

  const user = await prisma.user.findUnique({
    where: { id: reservation.userId },
    select: { email: true, name: true },
  });

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: reservation.userId,
        status,
        total,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.paymentIntent ?? null,
        customerEmail: user?.email ?? null,
        customerName: user?.name ?? null,
        stockConsumed: data.stockConsumed,
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            name: l.name,
            slug: l.slug,
            sku: l.sku,
            image: l.image,
            quantity: l.quantity,
            price: l.unitPrice,
            size: l.size,
            color: l.color,
          })),
        },
      },
    });
    await tx.orderReservation.updateMany({
      where: { stripeSessionId: data.stripeSessionId, status: RESERVATION_STATUS.ACTIVE },
      data: { status: RESERVATION_STATUS.CONSUMED },
    });
  });
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

type OrderWithItems = Order & { items: OrderItem[] };

const STOCK_RELEASING_STATUSES = new Set(["CANCELLED", "REFUNDED"]);

export type StatusChangeResult =
  | { ok: true; status: string }
  | { ok: false; error: string };

export async function applyOrderStatusChange(
  order: OrderWithItems,
  next: string
): Promise<StatusChangeResult> {
  const current = order.status;
  if (next === current) return { ok: true, status: current };

  if (order.stockRestored && !STOCK_RELEASING_STATUSES.has(next)) {
    return {
      ok: false,
      error:
        "İptal/iade edilmiş sipariş stok durumu korunmalıdır. Önce yeni stok girişi yapın.",
    };
  }

  if (STOCK_RELEASING_STATUSES.has(next)) {
    if (order.stockConsumed && !order.stockRestored) {
      await prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: { id: order.id, stockRestored: false },
          data: { status: next, stockRestored: true },
        });
        if (updated.count === 1) {
          await releaseStock(
            tx,
            order.items.map((i) => ({
              variantId: i.variantId ?? "",
              productId: i.productId ?? "",
              quantity: i.quantity,
            }))
          );
        }
      });
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: next },
      });
    }
    return { ok: true, status: next };
  }

  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: next },
  });
  return { ok: true, status: updated.status };
}
