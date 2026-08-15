import "server-only";
import { prisma } from "@/infrastructure/prisma";
import { Prisma } from "@prisma/client";
import type { Product } from "./types";

const COLOR_HEX: Record<string, string> = {
  Black: "#1b1c1c",
  White: "#faf9f9",
  Red: "#dc2626",
};

const PRODUCT_INCLUDE = {
  category: true,
  images: { orderBy: { position: "asc" } },
  variants: true,
} as const satisfies Prisma.ProductInclude;

export type DbProduct = Prisma.ProductGetPayload<{
  include: typeof PRODUCT_INCLUDE;
}>;

export function mapProduct(p: DbProduct): Product {
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
    objectNumber: p.objectNumber,
    campaign: p.campaign,
    material: p.material,
    weight: p.weight,
    fit: p.fit,
    releaseDate: p.releaseDate ? p.releaseDate.toISOString() : null,
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

const CARD_SELECT = {
  id: true,
  slug: true,
  name: true,
  subtitle: true,
  price: true,
  badge: true,
  status: true,
  objectNumber: true,
  campaign: true,
  material: true,
  weight: true,
  fit: true,
  releaseDate: true,
  category: { select: { name: true, slug: true } },
  images: {
    orderBy: { position: "asc" as const },
    take: 2,
    select: { url: true, alt: true },
  },
  variants: {
    select: { size: true, color: true, stock: true },
  },
} as const satisfies Prisma.ProductSelect;

export type DbCardProduct = Awaited<
  ReturnType<typeof fetchCardRows>
>[number];

async function fetchCardRows(
  where: Prisma.ProductWhereInput,
  opts: {
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  } = {}
) {
  return prisma.product.findMany({
    where,
    select: CARD_SELECT,
    orderBy: opts.orderBy ?? { createdAt: "desc" },
    take: opts.take,
  });
}

export function mapCardProduct(p: DbCardProduct): Product {
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
    p.status === "SOLD_OUT" || totalStock <= 0
      ? "SOLD OUT"
      : ((p.badge as Product["badge"]) ?? undefined);

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle,
    price: Number(p.price),
    category: p.category.slug,
    categoryLabel: p.category.name,
    badge,
    objectNumber: p.objectNumber,
    campaign: p.campaign,
    material: p.material,
    weight: p.weight,
    fit: p.fit,
    releaseDate: p.releaseDate ? p.releaseDate.toISOString() : null,
    colors: colors.map((name) => ({
      name,
      hex: COLOR_HEX[name] ?? "#1b1c1c",
    })),
    sizes,
    soldOutSizes: p.variants
      .filter((v) => v.stock === 0)
      .map((v) => v.size),
    images: p.images.map((img) => ({ src: img.url, alt: img.alt ?? "" })),
  };
}

export async function getCardProducts(
  where: Prisma.ProductWhereInput,
  opts: {
    take?: number;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
  } = {}
): Promise<Product[]> {
  const rows = await fetchCardRows(where, opts);
  return rows.map(mapCardProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  return getCardProducts({ status: { not: "DRAFT" } });
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: PRODUCT_INCLUDE,
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
  return getCardProducts({ status: { not: "DRAFT" } }, { take: limit });
}

export async function getSitemapProducts(): Promise<
  { slug: string; updatedAt: Date }[]
> {
  return prisma.product.findMany({
    where: { status: { not: "DRAFT" } },
    select: { slug: true, updatedAt: true },
  });
}

export type SearchSort = "newest" | "price_asc" | "price_desc" | "popular";

export interface SearchFilters {
  q?: string;
  categories?: string[];
  sizes?: string[];
  colors?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sort?: SearchSort;
}

export async function searchProducts(
  filters: SearchFilters
): Promise<Product[]> {
  const where: Prisma.ProductWhereInput = { status: { not: "DRAFT" } };

  const terms = filters.q?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (terms.length) {
    where.OR = terms.map((term) => ({
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { subtitle: { contains: term, mode: "insensitive" } },
        { description: { contains: term, mode: "insensitive" } },
      ],
    }));
  }

  if (filters.categories?.length) {
    where.category = { slug: { in: filters.categories } };
  }

  const variantWhere: Prisma.ProductVariantWhereInput = {};
  if (filters.sizes?.length) variantWhere.size = { in: filters.sizes };
  if (filters.colors?.length) variantWhere.color = { in: filters.colors };

  const variantConditions: Prisma.ProductVariantWhereInput[] = [];
  if (Object.keys(variantWhere).length) {
    variantConditions.push(variantWhere);
  }
  if (filters.inStockOnly) {
    variantConditions.push({ stock: { gt: 0 } });
  }
  if (variantConditions.length) {
    where.variants = {
      some:
        variantConditions.length === 1
          ? variantConditions[0]
          : { AND: variantConditions },
    };
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    where.price = {
      ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
    };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price_asc"
      ? { price: "asc" }
      : filters.sort === "price_desc"
        ? { price: "desc" }
        : { createdAt: "desc" };

  const rows = await prisma.product.findMany({
    where,
    select: CARD_SELECT,
    orderBy,
    take: 200,
  });

  if (filters.sort === "popular") {
    const counts = await prisma.orderItem.groupBy({
      by: ["productId"],
      where: { productId: { not: null } },
      _sum: { quantity: true },
    });
    const sold = new Map(
      counts.map((c) => [c.productId, c._sum.quantity ?? 0])
    );
    rows.sort((a, b) => (sold.get(b.id) ?? 0) - (sold.get(a.id) ?? 0));
  }

  return rows.map(mapCardProduct);
}

export async function getAllCategories(): Promise<
  { value: string; label: string }[]
> {
  const rows = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return rows.map((c) => ({ value: c.slug, label: c.name }));
}
