import { NextResponse } from "next/server";
import { auth } from "@/modules/auth";
import { redis } from "@/infrastructure/redis";

const TTL_SECONDS = 30 * 24 * 60 * 60;
const MAX_ITEMS = 100;

function cartKey(userId: string) {
  return `cart:${userId}`;
}

function isValidCartItem(item: unknown): boolean {
  if (!item || typeof item !== "object") return false;
  const it = item as Record<string, unknown>;
  const validString = (v: unknown, max: number) =>
    typeof v === "string" && v.length > 0 && v.length <= max;
  const validNumber = (v: unknown, min: number, max: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;

  return (
    validString(it.productId, 100) &&
    validString(it.slug, 200) &&
    validString(it.name, 200) &&
    validNumber(it.price, 0, 1_000_000) &&
    validString(it.size, 20) &&
    (it.color === undefined || validString(it.color, 50)) &&
    validNumber(it.quantity, 1, 99) &&
    (it.maxQuantity === undefined || validNumber(it.maxQuantity, 0, 999))
  );
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ items: [] }, { status: 401 });
  }

  try {
    const raw = await redis.get(cartKey(session.user.id));
    const items = raw ? JSON.parse(raw) : [];
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let items: unknown;
  try {
    const body = await request.json();
    items = body.items;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: "items must be an array (max 100)" },
      { status: 400 }
    );
  }

  if (!items.every(isValidCartItem)) {
    return NextResponse.json(
      { error: "Geçersiz sepet öğesi." },
      { status: 400 }
    );
  }

  try {
    await redis.set(cartKey(session.user.id), JSON.stringify(items), "EX", TTL_SECONDS);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
