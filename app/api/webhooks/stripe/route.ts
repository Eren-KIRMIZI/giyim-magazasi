import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  createOrderFromReservation,
  releaseReservation,
  releaseStock,
  RESERVATION_STATUS,
  type ReservationLine,
} from "@/lib/order";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret || webhookSecret.includes("xxx")) {
    return NextResponse.json(
      { error: "Stripe webhook not configured (STRIPE_WEBHOOK_SECRET)" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const stripeSessionId = session.id;

      const existing = await prisma.order.findUnique({
        where: { stripeSessionId },
      });
      if (existing) break;

      const reservation = await prisma.orderReservation.findUnique({
        where: { stripeSessionId },
      });
      if (!reservation) {
        console.log("No reservation for session:", stripeSessionId);
        break;
      }
      if (reservation.status === RESERVATION_STATUS.RELEASED) {
        console.log(
          "Payment completed after reservation released:",
          stripeSessionId
        );
        break;
      }

      const paymentIntent =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null;

      const total = (reservation.items as unknown as ReservationLine[]).reduce(
        (sum, l) => sum + l.unitPrice * l.quantity,
        0
      );
      const expectedTotal = session.amount_total ? session.amount_total / 100 : null;
      if (expectedTotal !== null && Math.abs(expectedTotal - total) > 0.01) {
        console.error(
          `Amount mismatch for ${stripeSessionId}: stripe=${expectedTotal} reservation=${total}`
        );
      }

      try {
        await createOrderFromReservation(reservation, "PAID", {
          stripeSessionId,
          paymentIntent,
          stockConsumed: true,
        });
        console.log("Order created for session:", stripeSessionId);
      } catch (err) {
        console.error("Order creation failed:", err);
        return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
      }
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
        console.log(`Order marked ${status} for session:`, stripeSessionId);
      } catch (err) {
        console.error(`Order ${status} creation failed:`, err);
        return NextResponse.json({ error: "Order status record failed" }, { status: 500 });
      }
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

      try {
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
      } catch (err) {
        console.error("Refund handling failed:", err);
        return NextResponse.json({ error: "Refund handling failed" }, { status: 500 });
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
