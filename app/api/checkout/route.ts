import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

interface CheckoutLineItem {
  slug: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export async function POST(request: Request) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      {
        error:
          "Stripe is not configured. Add a valid STRIPE_SECRET_KEY to .env",
      },
      { status: 500 }
    );
  }

  let items: CheckoutLineItem[];
  try {
    const body = await request.json();
    items = body.items;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  const authSession = await auth();
  const metadata: Record<string, string> = {};
  if (authSession?.user?.id) {
    metadata.userId = authSession.user.id;
    metadata.items = JSON.stringify(
      items.map((i) => ({ s: i.slug, z: i.size ?? null, q: i.quantity }))
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: item.size ? `${item.name} (${item.size})` : item.name,
          },
        },
      })),
      success_url: `${origin}/sepet?success=1`,
      cancel_url: `${origin}/sepet?cancelled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}
