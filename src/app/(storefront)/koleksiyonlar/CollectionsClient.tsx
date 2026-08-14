"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import RecentlyViewedSection from "@/components/ui/RecentlyViewedSection";
import type { Product } from "@/modules/catalog";

const SIZES = ["S", "M", "L", "XL"];

export default function CollectionsClient({ products }: { products: Product[] }) {
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of products) {
      if (!seen.has(p.category)) seen.set(p.category, p.categoryLabel);
    }
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [products]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  };

  const toggleSize = (value: string) => {
    setSelectedSizes((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (
        selectedCategories.length &&
        !selectedCategories.includes(p.category)
      ) {
        return false;
      }
      if (
        selectedSizes.length &&
        !p.sizes.some((s) => selectedSizes.includes(s))
      ) {
        return false;
      }
      if (minPrice !== "" && p.price < Number(minPrice)) return false;
      if (maxPrice !== "" && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [selectedCategories, selectedSizes, minPrice, maxPrice, products]);

  const filterPanel = (
    <aside className="flex flex-col gap-stack-md">
      <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
        Filters
      </h2>
      <div>
        <h3 className="font-label-mono text-label-mono uppercase mb-3">
          Category
        </h3>
        <ul className="flex flex-col gap-2">
          {categories.map((cat) => (
            <li key={cat.value}>
              <label className="flex items-center gap-2 cursor-pointer font-body-md text-body-md">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.value)}
                  onChange={() => toggleCategory(cat.value)}
                  className="h-4 w-4 accent-primary rounded-none border-on-surface bg-transparent focus:ring-primary"
                />
                {cat.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-label-mono text-label-mono uppercase mb-3">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              className={`px-3 py-1 font-label-mono text-label-mono border border-on-surface transition-colors ${
                selectedSizes.includes(size)
                  ? "bg-on-surface text-surface"
                  : "hover:bg-on-surface hover:text-surface"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-label-mono text-label-mono uppercase mb-3">
          Price
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full bg-transparent border border-on-surface px-2 py-1 font-label-mono text-label-mono focus:outline-none placeholder:text-on-surface-variant"
          />
          <span className="font-label-mono text-label-mono">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full bg-transparent border border-on-surface px-2 py-1 font-label-mono text-label-mono focus:outline-none placeholder:text-on-surface-variant"
          />
        </div>
      </div>
    </aside>
  );

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row gap-gutter">
        <div className="hidden md:block w-64 flex-shrink-0">{filterPanel}</div>

      <section className="flex-1 w-full">
        <div className="md:hidden mb-stack-md flex justify-between items-center border-b border-on-surface pb-stack-sm">
          <h1 className="font-headline-md text-headline-md uppercase">
            Collections
          </h1>
          <button
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex items-center gap-1 font-label-mono text-label-mono uppercase border border-on-surface px-3 py-1"
          >
            Filters
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>
        </div>

        {filtersOpen && (
          <div className="md:hidden mb-stack-md border border-on-surface p-stack-md">
            {filterPanel}
          </div>
        )}

        <div className="mb-stack-md flex justify-between items-center border-b border-on-surface pb-stack-sm">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            All Products
          </h2>
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} variant="card" />
            ))}
          </div>
        ) : (
          <div className="py-stack-lg text-center">
            <p className="font-headline-md text-headline-md uppercase text-on-surface-variant mb-4">
              No products match your filters
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategories([]);
                setSelectedSizes([]);
                setMinPrice("");
                setMaxPrice("");
              }}
              className="font-label-mono text-label-mono uppercase border border-on-surface px-6 py-2 hover:bg-on-surface hover:text-surface transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>
      </div>
      <RecentlyViewedSection />
    </main>
  );
}
