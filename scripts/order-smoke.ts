import "dotenv/config";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  reserveStock,
  createOrderFromReservation,
  releaseReservation,
  applyOrderStatusChange,
  StockInsufficientError,
  RESERVATION_STATUS,
  generateOrderNumber,
  type ReservationLine,
} from "../lib/order";

let failures = 0;

function assert(cond: unknown, label: string) {
  if (cond) {
    console.log(`  ok  ${label}`);
  } else {
    failures++;
    console.error(`FAIL  ${label}`);
  }
}

async function main() {
  const ts = Date.now();
  const email = `order-test-${ts}@test.local`;
  const user = await prisma.user.create({
    data: { email, name: "Order Test", passwordHash: "x" },
  });

  const category = await prisma.category.create({
    data: { slug: `order-test-cat-${ts}`, name: "Test Category" },
  });

  const product = await prisma.product.create({
    data: {
      slug: `order-test-product-${ts}`,
      name: "Order Test Product",
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
      sku: `order-test-${ts}-sku`,
      stock: 3,
    },
  });

  const nameMap = new Map([[product.id, product.name]]);
  const slugMap = new Map([[product.id, product.slug]]);
  const imageMap = new Map([[product.id, null]]);
  const priceMap = new Map([[product.id, 100]]);

  const sessionId = `cs_test_${ts}`;
  const line = {
    productId: product.id,
    size: "M",
    color: "Black",
    quantity: 2,
  };

  console.log("generateOrderNumber format");
  assert(/^LD-\d{4}-[0-9A-F]{6}$/.test(generateOrderNumber()), "LD-YYYY-XXXXXX format");

  console.log("reserveStock");
  const resolved = await prisma.$transaction((tx) =>
    reserveStock(tx, [line], nameMap, slugMap, imageMap, priceMap)
  );
  assert(resolved.length === 1, "one resolved line");
  assert(resolved[0].unitPrice === 100, "unit price from DB");
  assert(resolved[0].sku === variant.sku, "sku snapshot");
  let v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 1, `variant stock 3→1 (got ${v?.stock})`);
  let p = await prisma.product.findUnique({ where: { id: product.id } });
  assert(p?.stock === 8, `product stock 10→8 (got ${p?.stock})`);

  console.log("reserveStock insufficient → rollback");
  let failed = false;
  try {
    await prisma.$transaction((tx) =>
      reserveStock(tx, [{ ...line, quantity: 99 }], nameMap, slugMap, imageMap, priceMap)
    );
  } catch (e) {
    failed = e instanceof StockInsufficientError;
  }
  assert(failed, "throws StockInsufficientError");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 1, "stock unchanged after failed reserve");

  console.log("createOrderFromReservation (PAID, snapshot)");
  const toLines = (r: typeof resolved): ReservationLine[] =>
    r.map((ri) => ({
      productId: ri.productId,
      variantId: ri.variantId,
      sku: ri.sku,
      name: ri.name,
      slug: ri.slug,
      image: ri.image,
      size: ri.size,
      color: ri.color ?? null,
      quantity: ri.quantity,
      unitPrice: ri.unitPrice,
    }));

  await prisma.orderReservation.create({
    data: {
      stripeSessionId: sessionId,
      userId: user.id,
      status: RESERVATION_STATUS.ACTIVE,
      items: toLines(resolved) as unknown as Prisma.InputJsonValue,
    },
  });

  await createOrderFromReservation(
    { userId: user.id, items: toLines(resolved) },
    "PAID",
    { stripeSessionId: sessionId, paymentIntent: "pi_test_1", stockConsumed: true }
  );

  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true },
  });
  assert(!!order, "order created");
  assert(order?.status === "PAID", "status PAID");
  assert(order?.orderNumber.startsWith("LD-"), "order number set");
  assert(order?.stockConsumed === true, "stockConsumed true");
  assert(order?.stripePaymentIntentId === "pi_test_1", "payment intent saved");
  assert(order?.customerEmail === email, "customer email snapshot");
  assert(order?.items.length === 1, "one order item");
  const oi = order?.items[0];
  assert(oi?.name === "Order Test Product", "item name snapshot");
  assert(Number(oi?.price) === 100, "item price snapshot");
  assert(oi?.size === "M" && oi?.color === "Black", "size/color snapshot");
  assert(oi?.variantId === variant.id, "variantId saved");

  const reservation1 = await prisma.orderReservation.findUnique({
    where: { stripeSessionId: sessionId },
  });
  assert(reservation1?.status === "CONSUMED", "reservation consumed");

  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 1, "stock stays reserved after order (no double decrement)");

  console.log("snapshot survives product price/name change");
  await prisma.product.update({
    where: { id: product.id },
    data: { price: 999, name: "Renamed Product" },
  });
  const orderAfter = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true },
  });
  assert(Number(orderAfter?.items[0].price) === 100, "price snapshot preserved");
  assert(orderAfter?.items[0].name === "Order Test Product", "name snapshot preserved");

  console.log("idempotency (duplicate order → unique violation)");
  let dupThrown = false;
  try {
    await createOrderFromReservation(
      { userId: user.id, items: toLines(resolved) },
      "PAID",
      { stripeSessionId: sessionId, paymentIntent: null, stockConsumed: true }
    );
  } catch {
    dupThrown = true;
  }
  assert(dupThrown, "duplicate create throws");

  console.log("releaseReservation restores stock");
  const sessionId2 = `cs_test_${ts}_2`;
  const resolved2 = await prisma.$transaction((tx) =>
    reserveStock(tx, [{ ...line, quantity: 1 }], nameMap, slugMap, imageMap, priceMap)
  );
  await prisma.orderReservation.create({
    data: {
      stripeSessionId: sessionId2,
      userId: user.id,
      status: RESERVATION_STATUS.ACTIVE,
      items: toLines(resolved2) as unknown as Prisma.InputJsonValue,
    },
  });
  await releaseReservation(sessionId2);
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 1, `release restores variant stock (got ${v?.stock})`);
  const reservation2 = await prisma.orderReservation.findUnique({
    where: { stripeSessionId: sessionId2 },
  });
  assert(reservation2?.status === "RELEASED", "reservation released");

  console.log("applyOrderStatusChange (admin cancel → restore stock)");
  const orderForTransition = (await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true },
  }))!;
  const cancelRes = await applyOrderStatusChange(orderForTransition, "CANCELLED");
  assert(cancelRes.ok && cancelRes.status === "CANCELLED", "cancel transition ok");
  const afterCancel = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });
  assert(afterCancel?.status === "CANCELLED", "status CANCELLED after cancel");
  assert(afterCancel?.stockRestored === true, "stockRestored true after cancel");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 3, `cancel restores variant stock to 3 (got ${v?.stock})`);
  p = await prisma.product.findUnique({ where: { id: product.id } });
  assert(p?.stock === 10, `cancel restores product stock to 10 (got ${p?.stock})`);

  console.log("applyOrderStatusChange (blocked: re-activate after restore)");
  const freshCanceled = (await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true },
  }))!;
  const blocked = await applyOrderStatusChange(freshCanceled, "PAID");
  assert(!blocked.ok, "reactivation blocked after restore");

  console.log("applyOrderStatusChange (CANCELLED → REFUNDED allowed)");
  const toRefunded = await applyOrderStatusChange(
    { ...freshCanceled, status: "CANCELLED", stockRestored: true },
    "REFUNDED"
  );
  assert(toRefunded.ok && toRefunded.status === "REFUNDED", "CANCELLED → REFUNDED allowed");
  const afterRefunded = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
  });
  assert(afterRefunded?.status === "REFUNDED", "status REFUNDED after transition");
  v = await prisma.productVariant.findUnique({ where: { id: variant.id } });
  assert(v?.stock === 3, "no double restore on CANCELLED → REFUNDED");

  await prisma.order.delete({ where: { id: orderForTransition.id } });
  await prisma.orderReservation.deleteMany({ where: { userId: user.id } });
  await prisma.productVariant.delete({ where: { id: variant.id } });
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.category.delete({ where: { id: category.id } });
  await prisma.user.delete({ where: { id: user.id } });

  if (failures > 0) {
    console.error(`\n${failures} test(s) FAILED`);
    process.exit(1);
  }
  console.log("\nALL ORDER TESTS PASSED");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
