"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlist";
import { formatPrice } from "@/lib/data";
import WishlistButton from "@/components/store/WishlistButton";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="mb-stack-lg border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tight">
          Wishlist
        </h1>
        <p className="font-label-mono text-label-mono uppercase text-on-surface-variant mt-2">
          {items.length} item{items.length === 1 ? "" : "s"} saved
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-stack-lg text-center border border-on-surface">
          <p className="font-headline-md text-headline-md uppercase text-on-surface-variant mb-stack-md">
            Your wishlist is empty
          </p>
          <Link
            href="/koleksiyonlar"
            className="font-label-mono text-label-mono uppercase border border-on-surface px-6 py-2 hover:bg-on-surface hover:text-surface transition-colors inline-block"
          >
            Browse Collections
          </Link>
        </div>
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
                <div className="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">
                  {formatPrice(item.price)}
                </div>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <Link
                    href={`/urunler/${item.slug}`}
                    className="font-label-mono text-label-mono uppercase text-primary hover:text-on-surface transition-colors"
                  >
                    View
                  </Link>
                  <WishlistButton item={item} className="w-8 h-8 text-on-surface hover:text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
