"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/store/cart";
import { formatPrice, type Product } from "@/lib/data";
import ProductCard from "@/components/store/ProductCard";

interface ProductDetailProps {
  product: Product;
  recommended: Product[];
}

export default function ProductDetail({
  product,
  recommended,
}: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [imageChanging, setImageChanging] = useState(false);
  const [activeSize, setActiveSize] = useState<string | null>(
    product.soldOutSizes?.includes(product.sizes[0] as string)
      ? null
      : (product.sizes[0] ?? null)
  );
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const soldOut = product.badge === "SOLD OUT";

  const handleThumbClick = (index: number) => {
    if (index === activeImage) return;
    setImageChanging(true);
    setTimeout(() => {
      setActiveImage(index);
      setImageChanging(false);
    }, 200);
  };

  const handleAddToBag = () => {
    if (!activeSize || soldOut) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0].src,
      size: activeSize,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg border border-on-surface">
        <div className="md:col-span-7 border-b md:border-b-0 md:border-r border-on-surface flex flex-col">
          <div className="w-full relative bg-surface-container aspect-square overflow-hidden">
            <Image
              id="main-image"
              src={product.images[activeImage].src}
              alt={product.images[activeImage].alt}
              fill
              sizes="(max-width: 768px) 100vw, 58vw"
              className={`origin-center object-cover ${
                imageChanging ? "image-changing" : ""
              }`}
            />
            {product.badge && (
              <div className="absolute top-stack-sm left-stack-sm bg-primary text-on-primary font-label-mono text-label-mono px-2 py-1">
                {product.badge}
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-3 border-t border-on-surface">
              {product.images.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => handleThumbClick(i)}
                  className={`aspect-square border-r border-on-surface last:border-r-0 cursor-pointer hover:opacity-80 transition-opacity bg-surface-container ${
                    activeImage === i ? "opacity-100" : "opacity-60"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 33vw, 19vw"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-5 flex flex-col p-stack-md md:p-stack-lg justify-between">
          <div>
            <div className="font-label-mono text-label-mono text-outline uppercase mb-2">
              {product.subtitle}
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase leading-none mb-stack-sm tracking-tight">
              {product.name}
            </h1>
            <div className="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 mb-stack-md">
              {formatPrice(product.price)}
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">
              {product.description}
            </p>

            <div className="mb-stack-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-mono text-label-mono uppercase">
                  Size
                </span>
                <a className="font-label-mono text-label-mono text-primary hover:underline">
                  Size Guide
                </a>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => {
                  const isSoldOut = product.soldOutSizes?.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={isSoldOut}
                      onClick={() => setActiveSize(size)}
                      className={`size-btn ${
                        activeSize === size ? "active" : ""
                      } w-12 h-12 border border-on-surface flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface transition-colors ${
                        isSoldOut
                          ? "text-outline line-through cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <button
              type="button"
              onClick={handleAddToBag}
              disabled={soldOut || !activeSize}
              className={`${
                added
                  ? "bg-primary text-on-primary"
                  : "bg-on-surface text-surface hover:bg-primary hover:text-on-primary"
              } w-full font-headline-md text-headline-md uppercase py-4 transition-colors flex items-center justify-center gap-2 ${
                added ? "animate-pop" : ""
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <span>{added ? "Added" : soldOut ? "Sold Out" : "Add to Bag"}</span>
              <span className="material-symbols-outlined icon-fill text-[24px]">
                {added ? "check" : "shopping_bag"}
              </span>
            </button>
            <button
              type="button"
              className="w-full border border-on-surface bg-transparent text-on-surface font-headline-md text-headline-md uppercase py-4 hover:bg-surface-variant transition-colors flex items-center justify-center gap-2"
            >
              Mit <span className="font-bold text-primary">shop</span> kaufen
            </button>
            <div className="text-center mt-2">
              <a className="font-label-mono text-label-mono underline text-outline hover:text-on-surface cursor-pointer">
                Weitere Bezahlmöglichkeiten
              </a>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-stack-lg pt-stack-lg border-t border-on-surface">
        <h2 className="font-headline-md text-headline-md uppercase mb-stack-md tracking-tight">
          Complete the Look
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {recommended.map((rec) => (
            <ProductCard key={rec.id} product={rec} variant="card" />
          ))}
        </div>
      </section>
    </div>
  );
}
