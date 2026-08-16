import { getStripe } from "@/infrastructure/stripe";
import { prisma } from "@/infrastructure/prisma";
import {
  reserveStock,
  releaseStock,
  releaseExpiredReservations,
  reservationExpiresAt,
  RESERVATION_STATUS,
  type StockLine,
} from "./reservation";
import { toCents } from "@/lib/money";

export interface CheckoutLineItem {
  slug: string;
  size: string;
  color?: string | null;
  quantity: number;
}

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

export class ProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductNotFoundError";
  }
}

export class StripeUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StripeUnavailableError";
  }
}

export async function createCheckoutSession(
  userId: string | null,
  items: CheckoutLineItem[],
  origin: string
): Promise<{ url: string | null }> {
  const stripe = getStripe();
  if (!stripe) {
    throw new StripeUnavailableError(
      "Stripe is not configured. Add a valid STRIPE_SECRET_KEY to .env"
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new CheckoutValidationError("Sepet boş.");
  }
  if (items.length > 50) {
    throw new CheckoutValidationError("Sepette çok fazla ürün var.");
  }

  // Lazy cleanup: süresi dolmuş ACTIVE rezervasyonları önce iade et
  // (cron'a ek olarak checkout öncesi koruma — stok kilitlenmesini önler)
  try {
    await releaseExpiredReservations();
  } catch (err) {
    console.error("Expired reservation cleanup failed:", err);
  }

  const normalized: CheckoutLineItem[] = items.map((i) => ({
    slug: String(i?.slug ?? ""),
    size: String(i?.size ?? ""),
    color: i?.color ? String(i.color) : null,
    quantity: Math.floor(Number(i?.quantity)),
  }));

  if (
    normalized.some(
      (i) =>
        !i.slug ||
        !i.size ||
        !Number.isInteger(i.quantity) ||
        i.quantity < 1 ||
        i.quantity > 99
    )
  ) {
    throw new CheckoutValidationError("Geçersiz sepet içeriği.");
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
    if (!product || product.status === "DRAFT" || product.status === "SOLD_OUT") {
      throw new ProductNotFoundError(
        `Ürün satışta değil: ${item.slug}`
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

  const resolved = await prisma.$transaction(async (tx) =>
    reserveStock(tx, lines, nameMap, slugMap, imageMap, priceMap)
  );

  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      metadata: userId ? { userId } : {},
      line_items: resolved.map((ri) => ({
        quantity: ri.quantity,
        price_data: {
          currency: "eur",
          unit_amount: toCents(ri.unitPrice),
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
    throw new StripeUnavailableError(
      "Ödeme oturumu oluşturulamadı. Lütfen tekrar deneyin."
    );
  }

  try {
    await prisma.orderReservation.create({
      data: {
        stripeSessionId: checkoutSession.id,
        userId: userId ?? null,
        status: RESERVATION_STATUS.ACTIVE,
        expiresAt: reservationExpiresAt(),
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
    throw new StripeUnavailableError(
      "Sipariş kaydı oluşturulamadı. Lütfen tekrar deneyin."
    );
  }

  return { url: checkoutSession.url };
}
