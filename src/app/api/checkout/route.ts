import { NextResponse } from "next/server";
import { auth } from "@/modules/auth";
import { rateLimit } from "@/infrastructure/redis/rate-limit";
import {
  createCheckoutSession,
  CheckoutValidationError,
  ProductNotFoundError,
  StockInsufficientError,
  StripeUnavailableError,
  type CheckoutLineItem,
} from "@/modules/checkout";

const ALLOWED_ORIGINS = new Set(
  [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    ...(process.env.ALLOWED_ORIGINS?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? []),
    "http://localhost:3000",
  ].filter((v): v is string => Boolean(v))
);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Ödeme için giriş yapmalısınız." },
      { status: 401 }
    );
  }

  // Checkout oturumu + stok rezervasyonu DoS'u: kullanıcı başına 10/saat
  const limited = await rateLimit(`checkout:${session.user.id}`, 10, 3600);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla ödeme denemesi. Lütfen daha sonra tekrar deneyin." },
      { status: 429 }
    );
  }

  let items: CheckoutLineItem[];
  try {
    const body = await request.json();
    items = body.items;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Open redirect önlemi: yalnızca bilinen origin'lere yönlendir
  const origin =
    request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const safeOrigin = ALLOWED_ORIGINS.has(origin)
    ? origin
    : (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000");

  try {
    const result = await createCheckoutSession(session.user.id, items, safeOrigin);
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
