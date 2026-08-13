import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { applyOrderStatusChange, ORDER_STATUSES } from "@/lib/order";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.status || !ORDER_STATUSES.includes(body.status as never)) {
    return NextResponse.json({ error: "Geçersiz durum." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Sipariş bulunamadı." }, { status: 404 });
  }

  const result = await applyOrderStatusChange(order, body.status);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  const updated = await prisma.order.findUnique({ where: { id } });
  return NextResponse.json({ order: updated });
}
