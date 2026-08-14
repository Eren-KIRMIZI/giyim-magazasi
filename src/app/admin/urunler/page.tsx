import type { Metadata } from "next";
import Link from "next/link";
import { getAdminProducts } from "@/modules/admin";
import ProductList from "./ProductList";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Ürün yönetimi.",
};

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Ürünler
        </h1>
        <Link
          href="/admin/urunler/yeni"
          className="bg-on-surface text-surface font-headline-md text-headline-md uppercase px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors"
        >
          + Yeni Ürün
        </Link>
      </div>

      <ProductList products={products} />
    </div>
  );
}
