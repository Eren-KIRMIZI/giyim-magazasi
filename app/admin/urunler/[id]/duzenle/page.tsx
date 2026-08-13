import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm, {
  type ProductFormInitial,
} from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Ürün Düzenle",
  description: "Ürünü düzenle.",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { position: "asc" } }, variants: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const initial: ProductFormInitial = {
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

  return (
    <div className="flex flex-col gap-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        Ürünü Düzenle
      </h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
        initial={initial}
        mode="edit"
      />
    </div>
  );
}
