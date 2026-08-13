import Link from "next/link";
import ProductCard from "@/components/store/ProductCard";
import Reveal from "@/components/animations/Reveal";
import { getNewArrivals } from "@/lib/catalog";

export default async function NewArrivalsSection() {
  const featured = await getNewArrivals(3);

  return (
    <section
      id="yeni-gelenler"
      className="w-full px-margin-mobile md:px-margin-desktop mb-stack-lg"
    >
      <Reveal>
        <div className="flex justify-between items-end mb-stack-md border-b border-on-surface pb-stack-sm">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            New Arrivals
          </h2>
          <Link
            href="/koleksiyonlar"
            className="font-label-mono text-label-mono uppercase text-on-surface hover:text-primary transition-colors"
          >
            View All
          </Link>
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-on-surface">
        {featured.map((product, i) => (
          <Reveal key={product.id} delay={(i % 3) * 0.1} className="h-full">
            <ProductCard product={product} variant="tile" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
