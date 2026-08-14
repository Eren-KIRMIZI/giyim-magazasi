import type { SearchSort } from "@/lib/catalog";

export interface SearchQueryState {
  q: string;
  categories: string[];
  sizes: string[];
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
  sort: SearchSort;
}

function toArr(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toNum(value: string | string[] | undefined): number | null {
  if (Array.isArray(value)) value = value[0];
  if (!value || !value.trim()) return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export function parseSearchParams(
  sp: Record<string, string | string[] | undefined>
): SearchQueryState {
  const sortRaw = Array.isArray(sp.sirala) ? sp.sirala[0] : sp.sirala;
  const sort: SearchSort =
    sortRaw === "price_asc" ||
    sortRaw === "price_desc" ||
    sortRaw === "popular"
      ? sortRaw
      : "newest";

  return {
    q: (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").trim(),
    categories: toArr(sp.kategori),
    sizes: toArr(sp.beden),
    colors: toArr(sp.renk),
    minPrice: toNum(sp.fiyatmin),
    maxPrice: toNum(sp.fiyatmax),
    inStockOnly: toArr(sp.stok).includes("1"),
    sort,
  };
}

export function buildSearchUrl(state: SearchQueryState): string {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  for (const c of state.categories) params.append("kategori", c);
  for (const s of state.sizes) params.append("beden", s);
  for (const c of state.colors) params.append("renk", c);
  if (state.minPrice != null) params.set("fiyatmin", String(state.minPrice));
  if (state.maxPrice != null) params.set("fiyatmax", String(state.maxPrice));
  if (state.inStockOnly) params.set("stok", "1");
  if (state.sort !== "newest") params.set("sirala", state.sort);
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}
