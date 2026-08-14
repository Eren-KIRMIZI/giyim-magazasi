import { randomBytes } from "crypto";
import type { Order, OrderItem } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma";
import {
  RESERVATION_STATUS,
  releaseStock,
  type ReservationLine,
  type ReservationRecord,
} from "@/modules/checkout";

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

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const suffix = randomBytes(4).toString("hex").toUpperCase().slice(0, 6);
  return `LD-${year}-${suffix}`;
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
