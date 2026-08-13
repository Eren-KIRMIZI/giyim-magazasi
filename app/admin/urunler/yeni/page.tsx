import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = {
  title: "Yeni Ürün",
  description: "Yeni ürün oluştur.",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        Yeni Ürün
      </h1>
      <ProductForm
        categories={categories.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
        mode="create"
      />
    </div>
  );
}
