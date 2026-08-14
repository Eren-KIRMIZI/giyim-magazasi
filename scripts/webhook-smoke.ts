import "dotenv/config";
import Stripe from "stripe";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { RESERVATION_STATUS, reserveStock, type ReservationLine } from "../lib/order";
import { POST } from "../app/api/webhooks/stripe/route";

process.env.STRIPE_SECRET_KEY = "sk_test_webhook_valid";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_testsecret123";

let failures = 0;

function assert(cond: unknown, label: string) {
  if (cond) {
    console.log(`  ok  ${label}`);
  } else {
    failures++;
    console.error(`FAIL  ${label}`);
  }
}

const stripe = new Stripe("sk_test_webhook_valid");
const WEBHOOK_SECRET = "whsec_testsecret123";

function signatureFor(payload: string) {
  return stripe.webhooks.generateTestHeaderString({
    payload,
    secret: WEBHOOK_SECRET,
  });
}

async function callWebhook(
  payload: string,
  sig?: string,
  secret?: string
): Promise<{ status: number }> {
  const prev = process.env.STRIPE_WEBHOOK_SECRET;
  if (secret) process.env.STRIPE_WEBHOOK_SECRET = secret;
  try {
    const headers: Record<string, string> = {};
    if (sig) headers["stripe-signature"] = sig;
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: payload,
      headers,
    });
    return await POST(req);
  } finally {
    process.env.STRIPE_WEBHOOK_SECRET = prev;
  }
}

const completedEvent = (sessionId: string, extra: Record<string, unknown> = {}) =>
  JSON.stringify({
    id: `evt_${sessionId}_completed`,
    type: "checkout.session.completed",
    data: {
      object: { id: sessionId, amount_total: 20000, payment_intent: "pi_webhook" },
      ...extra,
    },
  });

async function main() {
  const ts = Date.now();
  const email = `webhook-test-${ts}@test.local`;
  const user = await prisma.user.create({
    data: { email, name: "Webhook Test", passwordHash: "x" },
  });
  const category = await prisma.category.create({
    data: { slug: `webhook-test-cat-${ts}`, name: "Webhook Test Cat" },
  });
  const product = await prisma.product.create({
    data: {
      slug: `webhook-test-product-${ts}`,
      name: "Webhook Test Product",
      description: "test",
      subtitle: "TEST",
      price: 100,
      stock: 10,
      status: "ACTIVE",
      categoryId: category.id,
    },
  });
  const variant = await prisma.productVariant.create({
    data: {
      productId: product.id,
      size: "M",
      color: "Black",
      sku: `webhook-${ts}-sku`,
      stock: 5,
    },
  });

  const reservationLines = (quantity: number): ReservationLine[] => [
    {
      productId: product.id,
      variantId: variant.id,
      sku: variant.sku,
      name: product.name,
      slug: product.slug,
      image: null,
      size: "M",
      color: "Black",
      quantity,
      unitPrice: 100,
    },
  ];

  const makeReservation = async (sessionId: string, quantity: number) => {
    const nameMap = new Map([[product.id, product.name]]);
    const slugMap = new Map([[product.id, product.slug]]);
    const imageMap = new Map([[product.id, null]]);
    const priceMap = new Map([[product.id, 100]]);
    await prisma.$transaction(async (tx) => {
      const resolved = await reserveStock(
        tx,
        [{ productId: product.id, size: "M", color: "Black", quantity }],
        nameMap,
        slugMap,
        imageMap,
        priceMap
      );
      await tx.orderReservation.create({
        data: {
          stripeSessionId: sessionId,
          userId: user.id,
          status: RESERVATION_STATUS.ACTIVE,
          items: reservationLines(quantity) as unknown as Prisma.InputJsonValue,
        },
      });
      return resolved;
    });
  };

  console.log("unconfigured webhook secret");
  const unconfigured = await callWebhook(
    completedEvent("cs_unknown_unconfigured"),
    signatureFor(completedEvent("cs_unknown_unconfigured")),
    "whsec_xxx"
  );
  assert(unconfigured.status === 500, "returns 500 when secret unconfigured");

  console.log("signature validation");
  const missing = await callWebhook(completedEvent("cs_missing_sig"));
  assert(missing.status === 400, "missing signature header → 400");

  const bad = await callWebhook(
    completedEvent("cs_bad_sig"),
    "t=1,v1=deadbeef"
  );
  assert(bad.status === 400, "invalid signature → 400");

  console.log("valid signature, unknown session (idempotent no-op)");
  const unknown = await callWebhook(
    completedEvent("cs_unknown_session"),
    signatureFor(completedEvent("cs_unknown_session"))
  );
  assert(unknown.status === 200, "unknown session → 200 received");
  const noneOrder = await prisma.order.findUnique({
    where: { stripeSessionId: "cs_unknown_session" },
  });
  assert(!noneOrder, "no order created for unknown session");

  console.log("checkout.session.expired → stock restore + CANCELLED");
  const expiredId = `cs_expired_${ts}`;
  await makeReservation(expiredId, 2);
  const expiredPayload = JSON.stringify({
    id: `evt_${expiredId}_expired`,
    type: "checkout.session.expired",
    data: { object: { id: expiredId } },
  });
  const expiredRes = await callWebhook(expiredPayload, signatureFor(expiredPayload));
  assert(expiredRes.status === 200, "expired → 200");
  const expiredReservation = await prisma.orderReservation.findUnique({
    where: { stripeSessionId: expiredId },
  });
  assert(
    expiredReservation?.status === "RELEASED",
    "reservation released on expired"
  );
  let v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 5, `stock restored after expired (got ${v?.stock})`);
  const cancelledOrder = await prisma.order.findUnique({
    where: { stripeSessionId: expiredId },
    include: { items: true },
  });
  assert(cancelledOrder?.status === "CANCELLED", "CANCELLED order recorded");
  assert(cancelledOrder?.orderNumber.startsWith("LD-"), "order number set");
  assert(cancelledOrder?.items[0]?.name === product.name, "item snapshot stored");

  console.log("webhook idempotency (expired replay)");
  await callWebhook(expiredPayload, signatureFor(expiredPayload));
  const cancelledCount = await prisma.order.count({
    where: { stripeSessionId: expiredId },
  });
  assert(cancelledCount === 1, "replayed expired event creates no duplicate");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 5, "no double stock restore on replay");

  console.log("checkout.session.completed → PAID order with snapshot");
  const paidId = `cs_paid_${ts}`;
  await makeReservation(paidId, 2);
  const paidPayload = completedEvent(paidId);
  const paidRes = await callWebhook(paidPayload, signatureFor(paidPayload));
  assert(paidRes.status === 200, "completed → 200");
  const paidOrder = await prisma.order.findUnique({
    where: { stripeSessionId: paidId },
    include: { items: true },
  });
  assert(paidOrder?.status === "PAID", "status PAID");
  assert(paidOrder?.stripePaymentIntentId === "pi_webhook", "payment intent saved");
  assert(paidOrder?.customerEmail === email, "customer email snapshot");
  assert(paidOrder?.items[0]?.quantity === 2, "item quantity snapshot");
  assert(Number(paidOrder?.items[0]?.price) === 100, "item price snapshot");
  const paidReservation = await prisma.orderReservation.findUnique({
    where: { stripeSessionId: paidId },
  });
  assert(paidReservation?.status === "CONSUMED", "reservation consumed");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 3, `stock decremented once (got ${v?.stock})`);

  console.log("webhook idempotency (completed replay)");
  await callWebhook(paidPayload, signatureFor(paidPayload));
  const paidCount = await prisma.order.count({ where: { stripeSessionId: paidId } });
  assert(paidCount === 1, "replayed completed event creates no duplicate");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 3, "no double decrement on replay");

  console.log("charge.refunded → REFUNDED + stock restore");
  const refundPayload = JSON.stringify({
    id: `evt_${paidId}_refunded`,
    type: "charge.refunded",
    data: { object: { payment_intent: "pi_webhook" } },
  });
  const refundRes = await callWebhook(refundPayload, signatureFor(refundPayload));
  assert(refundRes.status === 200, "refunded → 200");
  const refundedOrder = await prisma.order.findUnique({
    where: { stripeSessionId: paidId },
  });
  assert(refundedOrder?.status === "REFUNDED", "status REFUNDED");
  assert(refundedOrder?.stockRestored === true, "stockRestored true");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 5, `stock restored after refund (got ${v?.stock})`);

  console.log("webhook idempotency (refunded replay)");
  await callWebhook(refundPayload, signatureFor(refundPayload));
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 5, "no double restore on refund replay");

  await prisma.order.deleteMany({ where: { userId: user.id } });
  await prisma.orderReservation.deleteMany({ where: { userId: user.id } });
  await prisma.productVariant.delete({ where: { id: variant.id } });
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.category.delete({ where: { id: category.id } });
  await prisma.user.delete({ where: { id: user.id } });

  if (failures > 0) {
    console.error(`\n${failures} test(s) FAILED`);
    process.exit(1);
  }
  console.log("\nALL WEBHOOK TESTS PASSED");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
