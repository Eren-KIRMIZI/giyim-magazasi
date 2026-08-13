import { NextResponse } from "next/server";
import { requireAdmin, ORDER_STATUSES } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

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

  const order = await prisma.order.update({
    where: { id },
    data: { status: body.status },
  });

  return NextResponse.json({ order });
}
