import type { Metadata } from "next";
import { getAllCategories, searchProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import SearchClient from "./SearchClient";
import { parseSearchParams } from "./searchParams";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the LAST DANCE archive by name, category, size and color.",
  alternates: { canonical: `${SITE_URL}/search` },
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const state = parseSearchParams(sp);

  const [products, categories] = await Promise.all([
    searchProducts({
      q: state.q || undefined,
      categories: state.categories,
      sizes: state.sizes,
      colors: state.colors,
      minPrice: state.minPrice ?? undefined,
      maxPrice: state.maxPrice ?? undefined,
      inStockOnly: state.inStockOnly || undefined,
      sort: state.sort,
    }),
    getAllCategories(),
  ]);

  return (
    <SearchClient
      initial={state}
      products={products}
      categories={categories}
    />
  );
}
