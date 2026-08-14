import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductForEdit, getCategoryOptions } from "@/modules/admin";
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
    getProductForEdit(id),
    getCategoryOptions(),
  ]);

  if (!product) notFound();

  const initial: ProductFormInitial = product;

  return (
    <div className="flex flex-col gap-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        Ürünü Düzenle
      </h1>
      <ProductForm
        categories={categories}
        initial={initial}
        mode="edit"
      />
    </div>
  );
}
