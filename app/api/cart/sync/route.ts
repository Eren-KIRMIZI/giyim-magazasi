import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";

const TTL_SECONDS = 30 * 24 * 60 * 60;

function cartKey(userId: string) {
  return `cart:${userId}`;
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

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  try {
    await redis.set(cartKey(session.user.id), JSON.stringify(items), "EX", TTL_SECONDS);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
