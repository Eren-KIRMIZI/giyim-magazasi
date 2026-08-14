import { NextResponse } from "next/server";
import { auth } from "@/modules/auth";
import {
  createCheckoutSession,
  CheckoutValidationError,
  ProductNotFoundError,
  StockInsufficientError,
  StripeUnavailableError,
  type CheckoutLineItem,
} from "@/modules/checkout";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Ödeme için giriş yapmalısınız." },
      { status: 401 }
    );
  }

  let items: CheckoutLineItem[];
  try {
    const body = await request.json();
    items = body.items;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  try {
    const result = await createCheckoutSession(session.user.id, items, origin);
    return NextResponse.json({ url: result.url });
  } catch (err) {
    if (err instanceof CheckoutValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    if (err instanceof ProductNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof StockInsufficientError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    if (err instanceof StripeUnavailableError) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    throw err;
  }
}
