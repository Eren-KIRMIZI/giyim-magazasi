import type { Metadata } from "next";
import { getCategoriesWithCounts } from "@/modules/admin";
import CategoryManager from "./CategoryManager";

export const metadata: Metadata = {
  title: "Kategoriler",
  description: "Kategori yönetimi.",
};

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Kategoriler
        </h1>
      </div>

      <CategoryManager categories={categories} />
    </div>
  );
}
