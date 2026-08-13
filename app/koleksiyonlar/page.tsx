import type { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse the LAST DANCE archive — hoodies, tees, bottoms, footwear and accessories.",
};

export default async function CollectionsPage() {
  const products = await getAllProducts();
  return <CollectionsClient products={products} />;
}
