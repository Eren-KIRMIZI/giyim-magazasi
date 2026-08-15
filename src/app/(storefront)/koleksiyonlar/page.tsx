import type { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";
import { getAllProducts } from "@/modules/catalog";
import { SITE_URL } from "@/lib/site";

export const revalidate = 60;

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
  return (
    <>
      <header className="bg-on-surface text-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
          <p className="font-label-mono text-label-mono uppercase tracking-widest text-surface-variant mb-stack-md">
            Archive // Campaign 001
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-stack-md">
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase leading-none">
              The Final
              <br />
              Drop
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant max-w-md md:text-right">
              Brutalist streetwear. Limited objects. When it&apos;s gone,
              it&apos;s gone — secured for the archive.
            </p>
          </div>
        </div>
      </header>
      <CollectionsClient products={products} />
    </>
  );
}
