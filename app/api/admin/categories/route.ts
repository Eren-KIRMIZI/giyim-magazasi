import { NextResponse } from "next/server";
import { requireAdmin, slugify } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
  if (!slug) {
    return NextResponse.json(
      { error: "Geçerli bir slug üretilemedi." },
      { status: 400 }
    );
  }

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: `"${slug}" slug'u zaten kullanımda.` },
      { status: 409 }
    );
  }

  const category = await prisma.category.create({ data: { slug, name } });

  return NextResponse.json({ category }, { status: 201 });
}
