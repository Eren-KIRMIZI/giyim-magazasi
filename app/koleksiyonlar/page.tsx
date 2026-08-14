import type { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";
import { getAllProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse the LAST DANCE archive — hoodies, tees, bottoms, footwear and accessories.",
  alternates: { canonical: `${SITE_URL}/koleksiyonlar` },
  openGraph: {
    title: "Collections | LAST DANCE",
    description:
      "Browse the LAST DANCE archive — hoodies, tees, bottoms, footwear and accessories.",
    url: `${SITE_URL}/koleksiyonlar`,
    siteName: "LAST DANCE",
    type: "website",
  },
};

export default async function CollectionsPage() {
  const products = await getAllProducts();
  return <CollectionsClient products={products} />;
}
