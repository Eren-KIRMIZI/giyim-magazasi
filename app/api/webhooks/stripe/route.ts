import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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
      const userId = session.metadata?.userId;
      const rawItems = session.metadata?.items;

      if (!userId || !rawItems) {
        console.log("Checkout completed for session:", session.id, "(no order metadata)");
        break;
      }

      try {
        const existing = await prisma.order.findUnique({
          where: { stripeSessionId: session.id },
        });
        if (existing) break;

        const items = JSON.parse(rawItems) as {
          s: string;
          z: string | null;
          q: number;
        }[];
        const products = await prisma.product.findMany({
          where: { slug: { in: items.map((i) => i.s) } },
        });
        const productBySlug = new Map(products.map((p) => [p.slug, p]));

        await prisma.order.create({
          data: {
            userId,
            stripeSessionId: session.id,
            status: "PAID",
            total: session.amount_total ? session.amount_total / 100 : 0,
            items: {
              create: items.map((i) => {
                const product = productBySlug.get(i.s);
                return {
                  productId: product?.id ?? "",
                  quantity: i.q,
                  price: product?.price ?? 0,
                  size: i.z,
                };
              }),
            },
          },
        });
        console.log("Order created for session:", session.id);
      } catch (err) {
        console.error("Order creation failed:", err);
      }
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
