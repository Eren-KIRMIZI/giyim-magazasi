import { prisma } from "@/infrastructure/prisma";

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  badge: string | null;
  category: string;
  image: string | null;
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  const products = await prisma.product.findMany({
    include: { category: true, images: { take: 1, orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    status: p.status,
    badge: p.badge,
    category: p.category.name,
    image: p.images[0]?.url ?? null,
  }));
}

export interface CategoryOption {
  id: string;
  slug: string;
  name: string;
}

export async function getCategoryOptions(): Promise<CategoryOption[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
  return categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
}

export interface ProductEditData {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  status: string;
  badge: string | null;
  categoryId: string;
  images: { url: string; alt: string | null; position: number }[];
  variants: { size: string; color: string | null; stock: number }[];
}

export async function getProductForEdit(
  id: string
): Promise<ProductEditData | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, variants: true },
  });
  if (!product) return null;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    subtitle: product.subtitle,
    description: product.description,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
    stock: product.stock,
    status: product.status,
    badge: product.badge,
    categoryId: product.categoryId,
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      position: img.position,
    })),
    variants: product.variants.map((v) => ({
      size: v.size,
      color: v.color,
      stock: v.stock,
    })),
  };
}
