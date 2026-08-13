import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

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
      // TODO: Prisma bağlantısıyla Order oluştur ve sepeti temizle.
      // Sipariş: status="PAID", stripeSessionId=session.id,
      // ürünler session.metadata veya line_items üzerinden alınabilir.
      console.log("Checkout completed for session:", session.id);
      break;
    }
    case "checkout.session.expired": {
      console.log("Checkout session expired:", event.data.object.id);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
