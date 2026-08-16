import type Stripe from "stripe";
import { prisma } from "@/infrastructure/prisma";
import {
  releaseReservation,
  releaseStock,
  RESERVATION_STATUS,
  type ReservationLine,
} from "./reservation";
import { createOrderFromReservation, revivePaidOrder } from "@/modules/orders";
import { lineTotalCents, fromCents } from "@/lib/money";
import { sendOrderConfirmationEmail } from "@/infrastructure/email/resend";

function isUniqueViolation(err: unknown): boolean {
  return (err as { code?: string } | null)?.code === "P2002";
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const stripeSessionId = session.id;

      // Async ödeme yöntemleri için "completed" henüz ödemenin alındığı anlamına
      // gelmez; yalnızca gerçekten ödenmiş oturumları işleyelim.
      if (session.payment_status !== "paid") {
        console.log("Checkout completed without paid status:", stripeSessionId);
        break;
      }

      const existing = await prisma.order.findUnique({
        where: { stripeSessionId },
        include: { items: true },
      });
      if (existing) {
        // "expired" webhook'u önce işlendiyse sipariş CANCELLED/FAILED'tır ve
        // müşteri ödemiştir → PAID'e çevir + stoku yeniden tüket.
        if (existing.status !== "PAID") {
          await revivePaidOrder(existing);
        }
        break;
      }

      const reservation = await prisma.orderReservation.findUnique({
        where: { stripeSessionId },
      });
      if (!reservation) {
        console.log("No reservation for session:", stripeSessionId);
        break;
      }

      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      const totalCents = (
        reservation.items as unknown as ReservationLine[]
      ).reduce((sum, l) => sum + lineTotalCents(l.unitPrice, l.quantity), 0);
      const expectedTotalCents = session.amount_total ?? null;
      if (
        expectedTotalCents !== null &&
        expectedTotalCents !== totalCents
      ) {
        console.error(
          `Amount mismatch for ${stripeSessionId}: stripe=${expectedTotalCents} reservation=${totalCents}`
        );
      }

      if (reservation.status === RESERVATION_STATUS.RELEASED) {
        // Rezervasyon süresi dolup stok iade edilmiş; siparişi kur, stoku yeniden tüket.
        try {
          await createOrderFromReservation(reservation, "PAID", {
            stripeSessionId,
            paymentIntent,
            customerEmail: session.customer_details?.email ?? null,
            customerName: session.customer_details?.name ?? null,
            stockConsumed: true,
            reconsumeStock: true,
          });
        } catch (err) {
          // Eşzamanlı teslimat: sipariş zaten kurulmuş — retry'da break edilecek.
          if (isUniqueViolation(err)) break;
          throw err;
        }
        console.log("Order created (after released) for session:", stripeSessionId);
        break;
      }

      try {
        await createOrderFromReservation(reservation, "PAID", {
          stripeSessionId,
          paymentIntent,
          customerEmail: session.customer_details?.email ?? null,
          customerName: session.customer_details?.name ?? null,
          stockConsumed: true,
        });
      } catch (err) {
        if (isUniqueViolation(err)) break;
        throw err;
      }
      
      const order = await prisma.order.findUnique({
        where: { stripeSessionId },
        include: { items: true },
      });

      if (order && order.customerEmail) {
        await sendOrderConfirmationEmail(
          order.customerEmail,
          order.customerName || "Değerli Müşterimiz",
          order.orderNumber,
          `${order.total.toString()} EUR`,
          order.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            size: i.size,
          }))
        );
      }
      
      console.log("Order created for session:", stripeSessionId);
      break;
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const stripeSessionId = session.id;
      const status =
        event.type === "checkout.session.expired" ? "CANCELLED" : "FAILED";

      const existing = await prisma.order.findUnique({
        where: { stripeSessionId },
      });
      if (existing) break;

      await releaseReservation(stripeSessionId);

      const reservation = await prisma.orderReservation.findUnique({
        where: { stripeSessionId },
      });
      if (!reservation || reservation.status !== RESERVATION_STATUS.RELEASED) {
        break;
      }

      try {
        await createOrderFromReservation(reservation, status, {
          stripeSessionId,
          paymentIntent: null,
          stockConsumed: false,
        });
      } catch (err) {
        if (isUniqueViolation(err)) break;
        throw err;
      }
      console.log(`Order marked ${status} for session:`, stripeSessionId);
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const pi = charge.payment_intent;
      const paymentIntentId =
        typeof pi === "string" ? pi : pi && typeof pi === "object" ? pi.id : null;
      if (!paymentIntentId) break;

      const order = await prisma.order.findUnique({
        where: { stripePaymentIntentId: paymentIntentId },
        include: { items: true },
      });
      if (!order || order.stockRestored) break;

      await prisma.$transaction(async (tx) => {
        const updated = await tx.order.updateMany({
          where: { id: order.id, stockRestored: false },
          data: { stockRestored: true, status: "REFUNDED" },
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
      console.log("Refund handled for order:", order.orderNumber);
      break;
    }

    default:
      break;
  }
}
