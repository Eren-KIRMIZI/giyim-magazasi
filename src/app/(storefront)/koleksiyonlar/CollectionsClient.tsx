"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import RecentlyViewedSection from "@/components/ui/RecentlyViewedSection";
import type { Product } from "@/modules/catalog";

const SIZES = ["S", "M", "L", "XL"];

type GroupKey = "category" | "size" | "price";

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
  const [openGroups, setOpenGroups] = useState<Record<GroupKey, boolean>>({
    category: true,
    size: false,
    price: false,
  });

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

  const toggleGroup = (key: GroupKey) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setMinPrice("");
    setMaxPrice("");
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

  const activeFilters = useMemo(() => {
    const chips: {
      key: string;
      label: string;
      onRemove: () => void;
    }[] = [];
    for (const c of selectedCategories) {
      const label = categories.find((x) => x.value === c)?.label ?? c;
      chips.push({ key: `cat-${c}`, label, onRemove: () => toggleCategory(c) });
    }
    for (const s of selectedSizes) {
      chips.push({
        key: `size-${s}`,
        label: `Size ${s}`,
        onRemove: () => toggleSize(s),
      });
    }
    if (minPrice !== "") {
      chips.push({
        key: "min",
        label: `Min \u20AC${minPrice}`,
        onRemove: () => setMinPrice(""),
      });
    }
    if (maxPrice !== "") {
      chips.push({
        key: "max",
        label: `Max \u20AC${maxPrice}`,
        onRemove: () => setMaxPrice(""),
      });
    }
    return chips;
  }, [selectedCategories, selectedSizes, minPrice, maxPrice, categories]);

  const groupHeader = (
    key: GroupKey,
    label: string,
    count: number,
    open: boolean
  ) => (
    <button
      type="button"
      onClick={() => toggleGroup(key)}
      className="w-full flex items-center justify-between border-b border-on-surface pb-2 mb-3 cursor-pointer"
      aria-expanded={open}
    >
      <span className="flex items-center gap-2 font-label-mono text-label-mono uppercase tracking-widest">
        {label}
        {count > 0 && (
          <span className="bg-primary text-on-primary px-1.5 text-[10px] leading-[16px]">
            {count}
          </span>
        )}
      </span>
      <span className="font-label-mono text-label-mono leading-none">
        {open ? "\u2212" : "+"}
      </span>
    </button>
  );

  const filterPanel = (
    <aside className="flex flex-col gap-stack-md">
      <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
        Filters
      </h2>
      <div>
        {groupHeader("category", "Category", selectedCategories.length, openGroups.category)}
        {openGroups.category && (
          <ul className="flex flex-col gap-2 mb-4">
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
        )}
      </div>
      <div>
        {groupHeader("size", "Size", selectedSizes.length, openGroups.size)}
        {openGroups.size && (
          <div className="flex flex-wrap gap-2 mb-4">
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
        )}
      </div>
      <div>
        {groupHeader("price", "Price", minPrice !== "" || maxPrice !== "" ? 1 : 0, openGroups.price)}
        {openGroups.price && (
          <div className="flex items-center gap-2 mb-4">
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
        )}
      </div>
      {activeFilters.length > 0 && (
        <button
          type="button"
          onClick={clearAll}
          className="font-label-mono text-label-mono uppercase underline underline-offset-4 text-on-surface-variant hover:text-on-surface text-left"
        >
          Clear all
        </button>
      )}
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

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-stack-md">
              {activeFilters.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  className="flex items-center gap-1.5 bg-on-surface text-surface font-label-mono text-label-mono uppercase px-2.5 py-1 hover:bg-primary transition-colors"
                >
                  {chip.label}
                  <span className="leading-none">&#215;</span>
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="font-label-mono text-label-mono uppercase underline underline-offset-4 text-on-surface-variant hover:text-on-surface"
              >
                Clear all
              </button>
            </div>
          )}

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="card"
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div className="py-stack-lg text-center">
              <p className="font-headline-md text-headline-md uppercase text-on-surface-variant mb-4">
                No products match your filters
              </p>
              <button
                type="button"
                onClick={clearAll}
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
