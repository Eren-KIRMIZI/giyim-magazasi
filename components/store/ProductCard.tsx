import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/data";
import { formatPrice } from "@/lib/data";

interface ProductCardProps {
  product: Product;
  variant?: "tile" | "card";
  className?: string;
}

export default function ProductCard({
  product,
  variant = "tile",
  className = "",
}: ProductCardProps) {
  const soldOut = product.badge === "SOLD OUT";
  const borderClasses =
    variant === "tile"
      ? "border-r border-b border-on-surface"
      : "border border-on-surface";

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className={`group h-full flex flex-col bg-surface hover:bg-surface-container transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${borderClasses} ${className}`}
    >
      <div className="w-full aspect-[4/5] relative overflow-hidden bg-surface-container">
        <Image
          src={product.images[0].src}
          alt={product.images[0].alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
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
              Sold Out
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 relative">
        <h3 className="font-label-mono text-label-mono uppercase text-on-surface tracking-widest">
          {product.name}
        </h3>
        <div className="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-2 py-1 self-start">
          {formatPrice(product.price)}
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-2 mt-2">
            {product.colors.map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="w-4 h-4 rounded-full border border-outline"
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
