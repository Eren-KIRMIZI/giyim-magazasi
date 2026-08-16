import { randomBytes } from "crypto";
import type { Order, OrderItem } from "@prisma/client";
import { prisma } from "@/infrastructure/prisma";
import { logSecurity } from "@/lib/logger";
import {
  RESERVATION_STATUS,
  consumeOrderStock,
  releaseStock,
  type ReservationLine,
  type ReservationRecord,
} from "@/modules/checkout";
import { fromCents, lineTotalCents } from "@/lib/money";

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
    customerEmail?: string | null;
    customerName?: string | null;
    stockConsumed: boolean;
    reconsumeStock?: boolean;
  }
) {
  const lines = (Array.isArray(reservation.items)
    ? reservation.items
    : []) as unknown as ReservationLine[];
  if (lines.length === 0) return;

  let user = null;
  if (reservation.userId) {
    user = await prisma.user.findUnique({
      where: { id: reservation.userId },
      select: { email: true, name: true },
    });
  }

  const total = fromCents(
    lines.reduce((sum, l) => sum + lineTotalCents(l.unitPrice, l.quantity), 0)
  );

  await prisma.$transaction(async (tx) => {
    await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: reservation.userId,
        status,
        total,
        stripeSessionId: data.stripeSessionId,
        stripePaymentIntentId: data.paymentIntent ?? null,
        customerEmail: data.customerEmail ?? user?.email ?? null,
        customerName: data.customerName ?? user?.name ?? null,
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

    // Rezervasyon süresi dolup stok iade edilmişse (RELEASED), ödeme geldiği için
    // stoku yeniden tüket. Stok yetmezse siparişi yine de PAID tut ve kritik log at.
    if (data.reconsumeStock) {
      try {
        await consumeOrderStock(
          tx,
          lines.map((l) => ({
            variantId: l.variantId,
            productId: l.productId,
            quantity: l.quantity,
          }))
        );
      } catch (err) {
        await tx.order.update({
          where: { stripeSessionId: data.stripeSessionId },
          data: { stockConsumed: false, stockRestored: true },
        });
        logSecurity("checkout stock shortfall after paid", {
          stripeSessionId: data.stripeSessionId,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  });
}

/**
 * "expired" webhook'u önce işlenip siparişi CANCELLED/FAILED yapmış ama müşteri
 * ödemişse, geciken "completed" olayı siparişi PAID'e çevirir ve stoku yeniden tüketir.
 */
export async function revivePaidOrder(order: OrderWithItems): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: {
        id: order.id,
        status: { in: ["CANCELLED", "FAILED"] },
      },
      data: { status: "PAID", stockConsumed: true, stockRestored: false },
    });
    if (updated.count !== 1) return;

    try {
      await consumeOrderStock(
        tx,
        order.items.map((i) => ({
          variantId: i.variantId ?? "",
          productId: i.productId ?? "",
          quantity: i.quantity,
        }))
      );
    } catch (err) {
      await tx.order.update({
        where: { id: order.id },
        data: { stockConsumed: false, stockRestored: true },
      });
      logSecurity("paid order stock shortfall", {
        orderId: order.id,
        error: err instanceof Error ? err.message : String(err),
      });
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
