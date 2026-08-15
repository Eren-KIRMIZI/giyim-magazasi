import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import { prisma } from "@/infrastructure/prisma";
import { logSecurity } from "@/lib/logger";

const VALID_ROLES = ["CUSTOMER", "ADMIN"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const role = String(body.role ?? "");
  if (!VALID_ROLES.includes(role)) {
    return NextResponse.json({ error: "Geçersiz rol." }, { status: 400 });
  }

  if (id === admin.user.id && role !== "ADMIN") {
    return NextResponse.json(
      { error: "Kendi rolünüzü düşüremezsiniz." },
      { status: 400 }
    );
  }

  if (target.role === "ADMIN" && role !== "ADMIN") {
    const otherAdmins = await prisma.user.count({
      where: { role: "ADMIN", id: { not: id } },
    });
    if (otherAdmins === 0) {
      return NextResponse.json(
        { error: "Son yönetici düşürülemez." },
        { status: 400 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role },
  });

  logSecurity("admin role change", {
    actor: admin.user.email,
    target: target.email,
    from: target.role,
    to: role,
  });

  return NextResponse.json({ id: user.id, role: user.role });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (id === admin.user.id) {
    return NextResponse.json(
      { error: "Kendi hesabınızı silemezsiniz." },
      { status: 400 }
    );
  }

  const target = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { orders: true, reviews: true } } },
  });
  if (!target) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const hasCart = await prisma.cart.findUnique({ where: { userId: id } });

  if (target._count.orders > 0) {
    return NextResponse.json(
      { error: "Bu kullanıcının siparişleri var; silinemez." },
      { status: 409 }
    );
  }
  if (target._count.reviews > 0) {
    return NextResponse.json(
      { error: "Bu kullanıcının yorumları var; silinemez." },
      { status: 409 }
    );
  }
  if (hasCart) {
    return NextResponse.json(
      { error: "Bu kullanıcının sepeti var; silinemez." },
      { status: 409 }
    );
  }

  await prisma.user.delete({ where: { id } });

  logSecurity("admin user delete", {
    actor: admin.user.email,
    target: target.email,
  });

  return NextResponse.json({ ok: true });
}
