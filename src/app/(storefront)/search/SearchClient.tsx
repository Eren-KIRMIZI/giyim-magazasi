"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";
import { Icon } from "@/components/icons";
import type { Product } from "@/modules/catalog";
import { buildSearchUrl, type SearchQueryState } from "./searchParams";

const SIZES = ["S", "M", "L", "XL", "XXL", "39", "40", "41", "42", "43", "44"];

const COLORS: { name: string; hex: string }[] = [
  { name: "Black", hex: "#1b1c1c" },
  { name: "White", hex: "#faf9f9" },
  { name: "Red", hex: "#dc2626" },
];

const SORTS: { value: SearchQueryState["sort"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

interface SearchClientProps {
  initial: SearchQueryState;
  products: Product[];
  categories: { value: string; label: string }[];
}

export default function SearchClient({
  initial,
  products,
  categories,
}: SearchClientProps) {
  const router = useRouter();
  const [state, setState] = useState<SearchQueryState>(initial);
  const [queryDraft, setQueryDraft] = useState(initial.q);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const apply = (next: SearchQueryState) => {
    setState(next);
    router.replace(buildSearchUrl(next), { scroll: false });
  };

  const toggle = (
    key: "categories" | "sizes" | "colors",
    value: string
  ) => {
    const current = state[key];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    apply({ ...state, [key]: next });
  };

  const clearAll = () => {
    setQueryDraft("");
    apply({
      q: "",
      categories: [],
      sizes: [],
      colors: [],
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
      sort: "newest",
    });
  };

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
                  checked={state.categories.includes(cat.value)}
                  onChange={() => toggle("categories", cat.value)}
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
              onClick={() => toggle("sizes", size)}
              className={`px-3 py-1 font-label-mono text-label-mono border border-on-surface transition-colors ${
                state.sizes.includes(size)
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
        <h3 className="font-label-mono text-label-mono uppercase mb-3">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color.name}
              type="button"
              title={color.name}
              onClick={() => toggle("colors", color.name)}
              className={`w-9 h-9 border flex items-center justify-center transition-colors ${
                state.colors.includes(color.name)
                  ? "border-on-surface ring-2 ring-primary"
                  : "border-outline hover:border-on-surface"
              }`}
            >
              <span
                className="w-5 h-5"
                style={{ backgroundColor: color.hex }}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-label-mono text-label-mono uppercase mb-3">Price</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={state.minPrice ?? ""}
            onChange={(e) =>
              setState({ ...state, minPrice: e.target.value ? Number(e.target.value) : null })
            }
            onBlur={() => apply(state)}
            onKeyDown={(e) => e.key === "Enter" && apply(state)}
            className="w-full bg-transparent border border-on-surface px-2 py-1 font-label-mono text-label-mono focus:outline-none placeholder:text-on-surface-variant"
          />
          <span className="font-label-mono text-label-mono">-</span>
          <input
            type="number"
            placeholder="Max"
            value={state.maxPrice ?? ""}
            onChange={(e) =>
              setState({ ...state, maxPrice: e.target.value ? Number(e.target.value) : null })
            }
            onBlur={() => apply(state)}
            onKeyDown={(e) => e.key === "Enter" && apply(state)}
            className="w-full bg-transparent border border-on-surface px-2 py-1 font-label-mono text-label-mono focus:outline-none placeholder:text-on-surface-variant"
          />
        </div>
      </div>
      <div>
        <label className="flex items-center gap-2 cursor-pointer font-label-mono text-label-mono uppercase">
          <input
            type="checkbox"
            checked={state.inStockOnly}
            onChange={() => apply({ ...state, inStockOnly: !state.inStockOnly })}
            className="h-4 w-4 accent-primary rounded-none border-on-surface bg-transparent focus:ring-primary"
          />
          In Stock Only
        </label>
      </div>
    </aside>
  );

  const activeFilterCount = useMemo(
    () =>
      state.categories.length +
      state.sizes.length +
      state.colors.length +
      (state.minPrice != null || state.maxPrice != null ? 1 : 0) +
      (state.inStockOnly ? 1 : 0),
    [state]
  );

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  state.categories.forEach((c) => {
    const cat = categories.find((x) => x.value === c);
    chips.push({
      key: `cat-${c}`,
      label: cat?.label ?? c,
      onRemove: () => toggle("categories", c),
    });
  });
  state.sizes.forEach((s) =>
    chips.push({ key: `size-${s}`, label: s, onRemove: () => toggle("sizes", s) })
  );
  state.colors.forEach((c) =>
    chips.push({ key: `color-${c}`, label: c, onRemove: () => toggle("colors", c) })
  );
  if (state.minPrice != null || state.maxPrice != null) {
    chips.push({
      key: "price",
      label: `€${state.minPrice ?? 0}–€${state.maxPrice ?? "∞"}`,
      onRemove: () => apply({ ...state, minPrice: null, maxPrice: null }),
    });
  }
  if (state.inStockOnly) {
    chips.push({
      key: "stock",
      label: "In Stock",
      onRemove: () => apply({ ...state, inStockOnly: false }),
    });
  }

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex flex-col md:flex-row gap-gutter">
        <div className="hidden md:block w-64 flex-shrink-0">{filterPanel}</div>

        <section className="flex-1 w-full">
          <form
            action="/search"
            method="get"
            className="mb-stack-md border border-on-surface flex"
            role="search"
          >
            <input
              type="search"
              name="q"
              value={queryDraft}
              onChange={(e) => setQueryDraft(e.target.value)}
              placeholder="Search the archive…"
              aria-label="Search products"
              className="flex-1 bg-transparent px-4 py-3 font-body-md text-body-md focus:outline-none placeholder:text-on-surface-variant"
            />
            <button
              type="submit"
              className="font-label-mono text-label-mono uppercase border-l border-on-surface px-4 hover:bg-on-surface hover:text-surface transition-colors"
            >
              Search
            </button>
          </form>

          <div className="md:hidden mb-stack-md flex justify-between items-center border-b border-on-surface pb-stack-sm">
            <h1 className="font-headline-md text-headline-md uppercase">Search</h1>
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              className="flex items-center gap-1 font-label-mono text-label-mono uppercase border border-on-surface px-3 py-1"
            >
              Filters
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
              <Icon name="tune" className="w-4 h-4" />
            </button>
          </div>

          {filtersOpen && (
            <div className="md:hidden mb-stack-md border border-on-surface p-stack-md">
              {filterPanel}
            </div>
          )}

          <div className="mb-stack-md flex justify-between items-center border-b border-on-surface pb-stack-sm gap-4">
            <div className="flex items-baseline gap-3 min-w-0">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
                {state.q ? `“${state.q}”` : "Results"}
              </h2>
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant whitespace-nowrap">
                {products.length} item{products.length === 1 ? "" : "s"}
              </span>
            </div>
            <label className="flex items-center gap-2 shrink-0">
              <span className="hidden md:inline font-label-mono text-label-mono uppercase text-on-surface-variant">
                Sort
              </span>
              <select
                value={state.sort}
                onChange={(e) =>
                  apply({ ...state, sort: e.target.value as SearchQueryState["sort"] })
                }
                className="bg-transparent border border-on-surface px-2 py-1 font-label-mono text-label-mono uppercase focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-stack-md">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.onRemove}
                  aria-label={`Remove filter ${chip.label}`}
                  className="group flex items-center gap-1.5 border border-on-surface px-2.5 py-1 font-label-mono text-label-mono uppercase text-on-surface hover:bg-on-surface hover:text-surface active:scale-95 transition-all duration-150"
                >
                  {chip.label}
                  <Icon
                    name="close"
                    className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </button>
              ))}
              <button
                type="button"
                onClick={clearAll}
                className="link-sweep font-label-mono text-label-mono uppercase text-on-surface-variant hover:text-primary transition-colors ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} variant="card" />
              ))}
            </div>
          ) : (
            <div className="py-stack-lg text-center">
              <p className="font-headline-md text-headline-md uppercase text-on-surface-variant mb-4">
                No products found
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="font-label-mono text-label-mono uppercase border border-on-surface px-6 py-2 hover:bg-on-surface hover:text-surface transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
