import { prisma } from "@/infrastructure/prisma";
import { slugify } from "@/lib/utils";

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
  objectNumber: string | null;
  campaign: string | null;
  material: string | null;
  weight: string | null;
  fit: string | null;
  releaseDate: string | null;
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
    objectNumber: product.objectNumber,
    campaign: product.campaign,
    material: product.material,
    weight: product.weight,
    fit: product.fit,
    releaseDate: product.releaseDate ? product.releaseDate.toISOString() : null,
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

export class AdminProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminProductValidationError";
  }
}

export class AdminProductSlugConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminProductSlugConflictError";
  }
}

export class AdminProductCategoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminProductCategoryError";
  }
}

export class AdminProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminProductNotFoundError";
  }
}

export class AdminProductInUseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminProductInUseError";
  }
}

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

function productDataFromBody(body: Record<string, unknown>, slug: string) {
  return {
    slug,
    name: String(body.name ?? "").trim(),
    subtitle: String(body.subtitle ?? ""),
    description: String(body.description ?? ""),
    price: Number(body.price),
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
    objectNumber: String(body.objectNumber ?? "").trim() || null,
    campaign: String(body.campaign ?? "").trim() || null,
    material: String(body.material ?? "").trim() || null,
    weight: String(body.weight ?? "").trim() || null,
    fit: String(body.fit ?? "").trim() || null,
    releaseDate: (() => {
      const raw = String(body.releaseDate ?? "");
      const d = new Date(raw);
      return raw && !isNaN(d.getTime()) ? d.toISOString() : null;
    })(),
  };
}

export async function createProduct(body: Record<string, unknown>) {
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  if (!name || !Number.isFinite(price) || price <= 0) {
    throw new AdminProductValidationError(
      "Ürün adı ve geçerli bir fiyat gereklidir."
    );
  }

  const slug = String(body.slug ?? "").trim() || slugify(name);
  const categoryId = String(body.categoryId ?? "");

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) {
    throw new AdminProductSlugConflictError(`"${slug}" slug'u zaten kullanımda.`);
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new AdminProductCategoryError("Kategori bulunamadı.");
  }

  const images = parseImageLines(
    Array.isArray(body.images) ? body.images.map(String) : []
  );
  const variants = parseVariantLines(
    Array.isArray(body.variants) ? body.variants.map(String) : []
  );
  const base = productDataFromBody(body, slug);

  return prisma.product.create({
    data: {
      ...base,
      stock: variants.length
        ? variants.reduce((n, v) => n + v.stock, 0)
        : base.stock,
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
}

export async function updateProduct(id: string, body: Record<string, unknown>) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    throw new AdminProductNotFoundError("Ürün bulunamadı.");
  }

  const name = String(body.name ?? "").trim();
  const price = Number(body.price);
  if (!name || !Number.isFinite(price) || price <= 0) {
    throw new AdminProductValidationError(
      "Ürün adı ve geçerli bir fiyat gereklidir."
    );
  }

  const slug = String(body.slug ?? "").trim() || slugify(name);
  if (slug !== product.slug) {
    const taken = await prisma.product.findUnique({ where: { slug } });
    if (taken) {
      throw new AdminProductSlugConflictError(`"${slug}" slug'u zaten kullanımda.`);
    }
  }

  const categoryId = String(body.categoryId ?? product.categoryId);
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!category) {
    throw new AdminProductCategoryError("Kategori bulunamadı.");
  }

  const images = parseImageLines(
    Array.isArray(body.images) ? body.images.map(String) : []
  );
  const variants = parseVariantLines(
    Array.isArray(body.variants) ? body.variants.map(String) : []
  );
  const base = productDataFromBody(body, slug);

  return prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productVariant.deleteMany({ where: { productId: id } });

    return tx.product.update({
      where: { id },
      data: {
        ...base,
        stock: variants.length
          ? variants.reduce((n, v) => n + v.stock, 0)
          : base.stock,
        status: ["ACTIVE", "DRAFT", "SOLD_OUT"].includes(String(body.status))
          ? String(body.status)
          : product.status,
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
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true, cartItems: true } } },
  });
  if (!product) {
    throw new AdminProductNotFoundError("Ürün bulunamadı.");
  }
  if (product._count.orderItems > 0 || product._count.cartItems > 0) {
    throw new AdminProductInUseError(
      "Bu ürün sipariş/sepette kullanıldığı için silinemez. Status'ü DRAFT yapın."
    );
  }

  await prisma.product.delete({ where: { id } });
}
