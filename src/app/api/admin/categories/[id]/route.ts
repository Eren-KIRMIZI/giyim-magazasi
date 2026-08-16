import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import { slugify } from "@/lib/utils";
import { prisma } from "@/infrastructure/prisma";
import { logSecurity } from "@/lib/logger";
import { revalidateStorefront } from "@/lib/revalidate";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json(
      { error: "Kategori adı gereklidir." },
      { status: 400 }
    );
  }

  const slug = String(body.slug ?? "").trim() || slugify(name);
  const clash = await prisma.category.findFirst({
    where: { slug, id: { not: id } },
  });
  if (clash) {
    return NextResponse.json(
      { error: `"${slug}" slug'u zaten kullanımda.` },
      { status: 409 }
    );
  }

  const category = await prisma.category.update({
    where: { id },
    data: { slug, name },
  });
  logSecurity("admin category update", { id, slug, admin: admin.user.id });
  revalidateStorefront();

  return NextResponse.json({ category });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
  if (!existing) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  }

  if (existing._count.products > 0) {
    return NextResponse.json(
      { error: "Bu kategoride ürünler var; önce taşıyın veya silin." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });
  logSecurity("admin category delete", { id, admin: admin.user.id });
  revalidateStorefront();

  return NextResponse.json({ ok: true });
}
