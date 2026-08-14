import "server-only";
import { prisma } from "@/lib/prisma";
import type { Product } from "@/lib/data";

const COLOR_HEX: Record<string, string> = {
  Black: "#1b1c1c",
  White: "#faf9f9",
  Red: "#dc2626",
};

type DbProduct = Awaited<
  ReturnType<typeof fetchProducts>
>[number];

async function fetchProducts() {
  return prisma.product.findMany({
    where: { status: { not: "DRAFT" } },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

function mapProduct(p: DbProduct): Product {
  const colors = Array.from(
    new Map(
      p.variants
        .filter((v) => v.color)
        .map((v) => [v.color as string, v.color as string])
    ).keys()
  );

  const sizes = Array.from(new Set(p.variants.map((v) => v.size)));
  const totalStock = p.variants.reduce((n, v) => n + v.stock, 0);
  const badge: Product["badge"] =
    totalStock <= 0
      ? "SOLD OUT"
      : ((p.badge as Product["badge"]) ?? undefined);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    description: p.description,
    price: Number(p.price),
    category: p.category.slug,
    categoryLabel: p.category.name,
    badge,
    colors: colors.map((name) => ({
      name,
      hex: COLOR_HEX[name] ?? "#1b1c1c",
    })),
    sizes,
    soldOutSizes: p.variants
      .filter((v) => v.stock === 0)
      .map((v) => v.size),
    images: p.images.map((img) => ({ src: img.url, alt: img.alt ?? "" })),
    variantStock: p.variants.map((v) => ({
      size: v.size,
      color: v.color,
      stock: v.stock,
    })),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await fetchProducts();
  return rows.map(mapProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
  });
  return row ? mapProduct(row) : null;
}

export async function getAllSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { status: { not: "DRAFT" } },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getNewArrivals(limit = 3): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: { not: "DRAFT" } },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapProduct);
}

export async function getRecommendedProducts(
  excludeSlug: string,
  limit = 3
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { status: { not: "DRAFT" }, slug: { not: excludeSlug } },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapProduct);
}
