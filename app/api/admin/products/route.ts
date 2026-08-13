import { NextResponse } from "next/server";
import { requireAdmin, slugify } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

interface VariantInput {
  size: string;
  color?: string | null;
  stock: number;
}

interface ImageInput {
  url: string;
  alt?: string | null;
}

function parseVariantLines(lines: string[]): VariantInput[] {
  const variants: VariantInput[] = [];
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

function parseImageLines(lines: string[]): ImageInput[] {
  const images: ImageInput[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const [url, alt] = line.split("|").map((s) => s.trim());
    if (url) images.push({ url, alt: alt || null });
  }
  return images;
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
  const price = Number(body.price);
  if (!name || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "Ürün adı ve geçerli bir fiyat gereklidir." },
      { status: 400 }
    );
  }

  const slug = String(body.slug ?? "").trim() || slugify(name);
  const categoryId = String(body.categoryId ?? "");

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(
      { error: `"${slug}" slug'u zaten kullanımda.` },
      { status: 409 }
    );
  }

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

  const product = await prisma.product.create({
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
        : "DRAFT",
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

  return NextResponse.json({ product }, { status: 201 });
}
