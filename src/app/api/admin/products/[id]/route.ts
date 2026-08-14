import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import { slugify } from "@/lib/utils";
import { prisma } from "@/infrastructure/prisma";

function parseVariantLines(lines: string[]) {
  const variants: { size: string; color: string | null; stock: number }[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const [size, color, stockRaw] = line.split("|").map((s) => s.trim());
    if (!size) continue;
    variants.push({
      size,
      color: color || null,
      stock: Number(stockRaw) > 0 ? Number(stockRaw) : 0,
    });
  }
  return variants;
}

function parseImageLines(lines: string[]) {
  const images: { url: string; alt: string | null }[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const [url, alt] = line.split("|").map((s) => s.trim());
    if (url) images.push({ url, alt: alt || null });
  }
  return images;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  if (!name || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "Ürün adı ve geçerli bir fiyat gereklidir." },
      { status: 400 }
    );
  }

  const slug = String(body.slug ?? "").trim() || slugify(name);
  if (slug !== product.slug) {
    const taken = await prisma.product.findUnique({ where: { slug } });
    if (taken) {
      return NextResponse.json(
        { error: `"${slug}" slug'u zaten kullanımda.` },
        { status: 409 }
      );
    }
  }

  const categoryId = String(body.categoryId ?? product.categoryId);
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 400 });
  }

  const images = parseImageLines(
    Array.isArray(body.images) ? body.images.map(String) : []
  );
  const variants = parseVariantLines(
    Array.isArray(body.variants) ? body.variants.map(String) : []
  );

  const updated = await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productVariant.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        slug,
        name,
        subtitle: String(body.subtitle ?? ""),
        description: String(body.description ?? ""),
        price,
        compareAtPrice:
          body.compareAtPrice !== undefined && Number(body.compareAtPrice) > 0
            ? Number(body.compareAtPrice)
            : null,
        stock: Number(body.stock) > 0 ? Number(body.stock) : 0,
        status: ["ACTIVE", "DRAFT", "SOLD_OUT"].includes(String(body.status))
          ? String(body.status)
          : product.status,
        badge: ["NEW", "LIMITED", "SOLD OUT"].includes(String(body.badge))
          ? String(body.badge)
          : null,
        categoryId: category.id,
        images: {
          create: images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            position: i,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            size: v.size,
            color: v.color,
            sku: `${slug}-${v.size}-${(v.color ?? "default").toLowerCase()}`,
            stock: v.stock,
          })),
        },
      },
      include: { category: true, images: true, variants: true },
    });
  });

  return NextResponse.json({ product: updated });
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
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true, cartItems: true } } },
  });
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }
  if (product._count.orderItems > 0 || product._count.cartItems > 0) {
    return NextResponse.json(
      { error: "Bu ürün sipariş/sepette kullanıldığı için silinemez. Status'ü DRAFT yapın." },
      { status: 409 }
    );
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
