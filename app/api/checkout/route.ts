import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  reserveStock,
  releaseStock,
  StockInsufficientError,
  RESERVATION_STATUS,
  type StockLine,
} from "@/lib/order";

interface CheckoutLineItem {
  slug: string;
  size: string;
  color?: string | null;
  quantity: number;
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Ödeme için giriş yapmalısınız." },
      { status: 401 }
    );
  }

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
    return NextResponse.json({ error: "Sepet boş." }, { status: 400 });
  }

  const normalized: CheckoutLineItem[] = items.map((i) => ({
    slug: String(i?.slug ?? ""),
    size: String(i?.size ?? ""),
    color: i?.color ? String(i.color) : null,
    quantity: Math.floor(Number(i?.quantity)),
  }));

  if (
    normalized.some(
      (i) => !i.slug || !i.size || !Number.isInteger(i.quantity) || i.quantity < 1
    )
  ) {
    return NextResponse.json(
      { error: "Geçersiz sepet içeriği." },
      { status: 400 }
    );
  }

  const slugs = Array.from(new Set(normalized.map((i) => i.slug)));
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: { images: { orderBy: { position: "asc" } } },
  });
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  const lines: StockLine[] = [];
  for (const item of normalized) {
    const product = productBySlug.get(item.slug);
    if (!product || product.status === "DRAFT") {
      return NextResponse.json(
        { error: `Ürün bulunamadı: ${item.slug}` },
        { status: 404 }
      );
    }
    lines.push({
      productId: product.id,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    });
  }

  const nameMap = new Map(products.map((p) => [p.id, p.name]));
  const slugMap = new Map(products.map((p) => [p.id, p.slug]));
  const imageMap = new Map(
    products.map((p) => [p.id, p.images?.[0]?.url ?? null])
  );
  const priceMap = new Map(products.map((p) => [p.id, Number(p.price)]));

  let resolved;
  try {
    resolved = await prisma.$transaction(async (tx) =>
      reserveStock(tx, lines, nameMap, slugMap, imageMap, priceMap)
    );
  } catch (err) {
    if (err instanceof StockInsufficientError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    throw err;
  }

  const origin =
    request.headers.get("origin") ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000";

  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: { userId: session.user.id },
      line_items: resolved.map((ri) => ({
        quantity: ri.quantity,
        price_data: {
          currency: "eur",
          unit_amount: Math.round(ri.unitPrice * 100),
          product_data: {
            name: ri.color
              ? `${ri.name} (${ri.size} · ${ri.color})`
              : `${ri.name} (${ri.size})`,
          },
        },
      })),
      success_url: `${origin}/sepet?success=1`,
      cancel_url: `${origin}/sepet?cancelled=1`,
    });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    await prisma.$transaction(async (tx) => releaseStock(tx, resolved));
    return NextResponse.json(
      { error: "Ödeme oturumu oluşturulamadı. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  try {
    await prisma.orderReservation.create({
      data: {
        stripeSessionId: checkoutSession.id,
        userId: session.user.id,
        status: RESERVATION_STATUS.ACTIVE,
        items: resolved.map((ri) => ({
          productId: ri.productId,
          variantId: ri.variantId,
          sku: ri.sku,
          name: ri.name,
          slug: ri.slug,
          image: ri.image,
          size: ri.size,
          color: ri.color,
          quantity: ri.quantity,
          unitPrice: ri.unitPrice,
        })),
      },
    });
  } catch (err) {
    console.error("Reservation persist failed:", err);
    await prisma.$transaction(async (tx) => releaseStock(tx, resolved));
    return NextResponse.json(
      { error: "Sipariş kaydı oluşturulamadı. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: checkoutSession.url });
}
