import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/modules/catalog";
import { formatPrice } from "@/lib/data";
import WishlistButton from "@/components/ui/WishlistButton";

interface ProductCardProps {
  product: Product;
  variant?: "tile" | "card";
  className?: string;
  index?: number;
}

const IMAGE_SIZES = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

export default function ProductCard({
  product,
  variant = "tile",
  className = "",
  index,
}: ProductCardProps) {
  const soldOut = product.badge === "SOLD OUT";
  const firstImage = product.images[0];
  const alternateImage = product.images[1];
  const hasAlternate = product.images.length > 1;
  const borderClasses =
    variant === "tile"
      ? "border-r border-b border-on-surface"
      : "border border-on-surface";
  const objectNo =
    index !== undefined
      ? `No. ${String(index + 1).padStart(3, "0")}`
      : null;

  return (
    <div
      className={`group relative h-full flex flex-col bg-surface hover:bg-surface-container transition-colors duration-300 ${borderClasses} ${className}`}
    >
      <Link
        href={`/urunler/${product.slug}`}
        aria-label={product.name}
        className="relative w-full aspect-[4/5] block overflow-hidden bg-surface-container"
      >
        {firstImage ? (
          <Image
            src={firstImage.src}
            alt={firstImage.alt}
            fill
            sizes={IMAGE_SIZES}
            className={`object-cover object-center transition-all duration-700 ease-out ${
              hasAlternate
                ? "group-hover:opacity-0 group-hover:scale-110"
                : "group-hover:scale-105"
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-label-mono text-label-mono uppercase text-on-surface-variant">
            NO IMAGE
          </div>
        )}
        {firstImage && hasAlternate && alternateImage && (
          <Image
            src={alternateImage.src}
            alt={alternateImage.alt}
            fill
            loading="lazy"
            sizes={IMAGE_SIZES}
            className="object-cover object-center opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-out"
          />
        )}
        {product.badge && product.badge !== "SOLD OUT" && (
          <div
            className={`absolute top-4 left-4 font-label-mono text-label-mono px-2 py-1 ${
              product.badge === "NEW"
                ? "bg-primary text-on-primary"
                : "bg-tertiary text-on-tertiary"
            }`}
          >
            {product.badge}
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center">
            <span className="bg-secondary text-on-secondary px-2 py-1 font-label-mono text-label-mono uppercase">
              SOLD OUT
            </span>
          </div>
        )}
        {!soldOut && (
          <div className="absolute inset-x-0 bottom-0 bg-on-surface text-surface font-label-mono text-label-mono uppercase py-3 text-center flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 group-hover:bg-primary transition-all duration-300">
            VIEW OBJECT
            <span className="text-[10px] leading-none transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              &#8599;
            </span>
          </div>
        )}
      </Link>
      <div className="absolute top-2 right-2 bg-surface/80 backdrop-blur-sm border border-on-surface/20">
        <WishlistButton
          item={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            image: firstImage?.src ?? "",
            imageAlt: firstImage?.alt ?? product.name,
            badge: product.badge,
          }}
          className="w-9 h-9 text-on-surface hover:text-primary hover:bg-surface active:scale-90"
        />
      </div>
      <Link href={`/urunler/${product.slug}`} className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center justify-between gap-2">
          {product.categoryLabel ? (
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
              {product.categoryLabel}
            </span>
          ) : (
            <span />
          )}
          {objectNo && (
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {objectNo}
            </span>
          )}
        </div>
        <h3 className="font-headline-md text-headline-md uppercase text-on-surface leading-tight mt-1">
          {product.name}
        </h3>
        <div className="flex items-end justify-between gap-2 mt-auto pt-2">
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex -space-x-1 flex-shrink-0">
                {product.colors.map((color) => (
                  <span
                    key={color.name}
                    title={color.name}
                    className="w-4 h-4 rounded-full border border-outline"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant truncate">
                {product.colors.map((c) => c.name).join(" · ")}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="font-label-mono text-label-mono line-through text-on-surface-variant">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className={`font-label-mono text-label-mono px-2 py-1 flex-shrink-0 transition-colors duration-300 ${
              product.compareAtPrice && product.compareAtPrice > product.price
                ? "bg-error text-on-error group-hover:bg-primary group-hover:text-on-primary"
                : "bg-on-surface text-surface group-hover:bg-primary"
            }`}>
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
