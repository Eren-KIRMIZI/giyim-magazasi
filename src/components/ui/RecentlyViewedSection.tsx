"use client";

import ProductCard from "@/components/ui/ProductCard";
import {
  useRecentlyViewedStore,
  type RecentlyViewedItem,
} from "@/modules/catalog/client";
import type { Product } from "@/modules/catalog";

function toProduct(item: RecentlyViewedItem): Product {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    subtitle: item.subtitle ?? "",
    description: "",
    price: item.price,
    category: "",
    categoryLabel: "",
    badge: item.badge as Product["badge"],
    images: [{ src: item.image, alt: item.imageAlt ?? item.name }],
    sizes: [],
  };
}

export default function RecentlyViewedSection() {
  const items = useRecentlyViewedStore((s) => s.items);

  if (items.length === 0) return null;

  return (
    <section className="mt-stack-lg pt-stack-lg border-t border-on-surface">
      <div className="flex justify-between items-end mb-stack-md border-b border-on-surface pb-stack-sm">
        <h2 className="font-headline-md text-headline-md uppercase tracking-tight">
          Recently Viewed
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {items.map((item) => (
          <ProductCard key={item.id} product={toProduct(item)} variant="card" />
        ))}
      </div>
    </section>
  );
}
