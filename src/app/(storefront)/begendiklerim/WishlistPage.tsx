"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/modules/wishlist";
import { formatPrice } from "@/lib/data";
import WishlistButton from "@/components/ui/WishlistButton";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="mb-stack-lg border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tight">
          Wishlist
        </h1>
        <p className="font-label-mono text-label-mono uppercase text-on-surface-variant mt-2">
          {items.length} item{items.length === 1 ? "" : "s"} saved
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon="favorite"
          title="Your wishlist is empty"
          description="Save the objects you can't stop thinking about — before they're gone."
          actionLabel="Browse Collections"
          actionHref="/koleksiyonlar"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col bg-surface border border-on-surface hover:shadow-lg transition-all duration-300"
            >
              <Link
                href={`/urunler/${item.slug}`}
                className="relative w-full aspect-[4/5] bg-surface-container overflow-hidden"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt ?? item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {item.badge === "SOLD OUT" && (
                  <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
                    <span className="bg-secondary text-on-secondary px-2 py-1 font-label-mono text-label-mono uppercase">
                      Sold Out
                    </span>
                  </div>
                )}
              </Link>
              <div className="p-4 flex flex-col gap-2 flex-grow">
                <h3 className="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">
                  {item.name}
                </h3>
                <div className="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start transition-colors duration-300 group-hover:bg-primary">
                  {formatPrice(item.price)}
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <Link
                    href={`/urunler/${item.slug}`}
                    className="link-sweep font-label-mono text-label-mono uppercase text-primary hover:text-on-surface transition-colors"
                  >
                    View
                  </Link>
                  <WishlistButton item={item} className="w-8 h-8 text-on-surface hover:text-primary active:scale-90 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
