import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductList from "./ProductList";

export const metadata: Metadata = {
  title: "Ürünler",
  description: "Ürün yönetimi.",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, images: { take: 1, orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

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

      <ProductList
        products={products.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          status: p.status,
          badge: p.badge,
          category: p.category.name,
          image: p.images[0]?.url,
        }))}
      />
    </div>
  );
}
