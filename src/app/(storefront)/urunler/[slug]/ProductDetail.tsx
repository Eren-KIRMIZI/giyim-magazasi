"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/modules/cart";
import { useRecentlyViewedStore } from "@/modules/catalog/client";
import type { Product } from "@/modules/catalog";
import { formatPrice } from "@/lib/data";
import { flyToCart } from "@/lib/flyToCart";
import ProductCard from "@/components/ui/ProductCard";
import WishlistButton from "@/components/ui/WishlistButton";
import ReviewsSection from "@/components/reviews/ReviewsSection";
import { Icon } from "@/components/icons";

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
  const [activeColor, setActiveColor] = useState<string | null>(
    product.colors?.[0]?.name ?? null
  );
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add);
  const router = useRouter();

  useEffect(() => {
    addRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      subtitle: product.subtitle,
      price: product.price,
      image: product.images[0].src,
      imageAlt: product.images[0].alt,
      badge: product.badge,
    });
  }, [product, addRecentlyViewed]);

  const soldOut = product.badge === "SOLD OUT";

  const totalStock = (product.variantStock ?? []).reduce(
    (n, v) => n + v.stock,
    0
  );
  const statusLabel =
    totalStock <= 0
      ? "ARCHIVED"
      : product.badge === "LIMITED"
        ? "LIMITED"
        : "AVAILABLE";
  const statusClasses =
    statusLabel === "AVAILABLE"
      ? "bg-primary text-on-primary"
      : statusLabel === "LIMITED"
        ? "bg-tertiary text-on-tertiary"
        : "bg-secondary text-on-secondary";

  const formatRelease = (iso: string): string | null => {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}.${m}.${day}`;
  };

  const colorNames = product.colors?.length
    ? product.colors.map((c) => c.name).join(", ")
    : null;
  const specRows = [
    { label: "Campaign", value: product.campaign ?? null },
    { label: "Weight", value: product.weight ?? null },
    { label: "Fabric", value: product.material ?? null },
    { label: "Fit", value: product.fit ?? null },
    {
      label: "Release",
      value: product.releaseDate ? formatRelease(product.releaseDate) : null,
    },
    { label: "Color", value: colorNames },
  ].filter((r): r is { label: string; value: string } => Boolean(r.value));

  const stockFor = (size: string, color?: string | null): number | null => {
    const variants = product.variantStock;
    if (!variants) return null;
    const bySize = variants.filter((v) => v.size === size);
    const hasColors = (product.colors?.length ?? 0) > 1;
    if (color && hasColors) {
      return bySize.find((v) => v.color === color)?.stock ?? 0;
    }
    return bySize.reduce((n, v) => n + v.stock, 0);
  };

  const selectedStock = activeSize
    ? stockFor(activeSize, activeColor)
    : null;
  const lowStock = selectedStock != null && selectedStock > 0 && selectedStock <= 5;

  const goToImage = (index: number) => {
    const total = product.images.length;
    const next = (index + total) % total;
    if (next === activeImage) return;
    setImageChanging(true);
    setTimeout(() => {
      setActiveImage(next);
      setImageChanging(false);
    }, 200);
  };

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
    if (selectedStock === 0) return;
    flyToCart(document.getElementById("main-image"));
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0].src,
      size: activeSize,
      color: activeColor ?? undefined,
      maxQuantity: selectedStock ?? undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!activeSize || soldOut) return;
    if (selectedStock === 0) return;
    setBuying(true);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0].src,
      size: activeSize,
      color: activeColor ?? undefined,
      maxQuantity: selectedStock ?? undefined,
    });
    router.push("/sepet");
  };

  return (
    <div className="animate-fade-in-up pb-20 md:pb-0">
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
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={() => goToImage(activeImage - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface/80 backdrop-blur-sm border border-on-surface/20 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface active:scale-90 transition-all duration-200"
                >
                  <Icon name="arrow_forward" className="w-5 h-5 rotate-180" />
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={() => goToImage(activeImage + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-surface/80 backdrop-blur-sm border border-on-surface/20 flex items-center justify-center text-on-surface hover:bg-on-surface hover:text-surface active:scale-90 transition-all duration-200"
                >
                  <Icon name="arrow_forward" className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 right-2 bg-surface/80 backdrop-blur-sm border border-on-surface/20 font-label-mono text-label-mono px-2 py-1">
                  {String(activeImage + 1).padStart(2, "0")} /{" "}
                  {String(product.images.length).padStart(2, "0")}
                </div>
              </>
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
            <div className="flex items-center gap-2 mb-stack-md">
              <div className={`inline-block font-label-mono text-label-mono px-3 py-1 ${
                product.compareAtPrice && product.compareAtPrice > product.price
                  ? "bg-error text-on-error"
                  : "bg-on-surface text-surface"
              }`}>
                {formatPrice(product.price)}
              </div>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="font-label-mono text-label-mono line-through text-on-surface-variant">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <span className="font-label-mono text-label-mono text-error uppercase">
                    %{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)} İNDİRİM
                  </span>
                </>
              )}
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md">
              {product.description}
            </p>

            <div className="mb-stack-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-label-mono text-label-mono uppercase">
                  Size
                </span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => {
                  const hasColors = (product.colors?.length ?? 0) > 1;
                  const isSoldOut = hasColors
                    ? (stockFor(size, activeColor) ?? 0) === 0
                    : product.soldOutSizes?.includes(size);
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
              {lowStock && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-label-mono text-label-mono uppercase text-error">
                      Son {selectedStock} adet
                    </p>
                    <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                      Stock
                    </span>
                  </div>
                  <div className="h-1 w-full bg-surface-container-highest overflow-hidden">
                    <div
                      className="h-full bg-error transition-all duration-500"
                      style={{
                        width: `${Math.min((selectedStock ?? 5) / 5, 1) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {product.colors && product.colors.length > 1 && (
              <div className="mb-stack-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-label-mono text-label-mono uppercase">
                    Color
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {activeColor ?? "—"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setActiveColor(color.name)}
                      title={color.name}
                      className={`w-9 h-9 border flex items-center justify-center active:scale-90 transition-all duration-150 cursor-pointer ${
                        activeColor === color.name
                          ? "border-on-surface ring-2 ring-primary"
                          : "border-outline hover:border-on-surface"
                      }`}
                    >
                      <span
                        className="w-5 h-5"
                        style={{ backgroundColor: color.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-stack-sm">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={soldOut || !activeSize || selectedStock === 0}
                className={`${
                  added
                    ? "bg-primary text-on-primary"
                    : "bg-on-surface text-surface hover:bg-primary hover:text-on-primary"
                } flex-1 font-headline-md text-headline-md uppercase py-4 transition-colors flex items-center justify-center gap-2 ${
                  added ? "animate-pop" : ""
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span>
                  {added
                    ? "Added"
                    : soldOut || selectedStock === 0
                      ? "Sold Out"
                      : "Add to Bag"}
                </span>
                <Icon
                  name={added ? "check" : "shopping_bag"}
                  className="w-6 h-6"
                  filled={added}
                />
              </button>
              <WishlistButton
                item={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  subtitle: product.subtitle,
                  price: product.price,
                  image: product.images[0].src,
                  imageAlt: product.images[0].alt,
                  badge: product.badge,
                }}
                className="w-14 border border-on-surface text-on-surface hover:text-primary bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={soldOut || !activeSize || selectedStock === 0 || buying}
              className="w-full border border-on-surface bg-transparent text-on-surface font-headline-md text-headline-md uppercase py-4 hover:bg-surface-variant transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{buying ? "Redirecting…" : "Buy Now"}</span>
              <Icon
                name={buying ? "progress_activity" : "flash_on"}
                className="w-6 h-6"
                filled={!buying}
              />
            </button>
          </div>
        </div>
      </div>

      <section className="border border-on-surface">
        <div className="bg-on-surface text-surface px-stack-md md:px-stack-lg py-stack-md flex flex-col md:flex-row md:items-center md:justify-between gap-stack-sm">
          <div>
            <p className="font-label-mono text-label-mono uppercase tracking-widest text-surface-variant mb-2">
              Object
            </p>
            <p className="font-headline-md text-headline-md uppercase">
              {product.objectNumber ? `No. ${product.objectNumber}` : "Object"} &mdash; {product.name}
            </p>
          </div>
          <span
            className={`font-label-mono text-label-mono uppercase px-3 py-1 self-start md:self-auto ${statusClasses}`}
          >
            {statusLabel}
          </span>
        </div>
        {specRows.length > 0 && (
          <dl className="divide-y divide-on-surface">
            {specRows.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-4 px-stack-md md:px-stack-lg py-3"
              >
                <dt className="font-label-mono text-label-mono uppercase tracking-widest text-on-surface-variant">
                  {row.label}
                </dt>
                <dd className="font-body-md text-body-md uppercase text-on-surface text-right">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <ReviewsSection productId={product.id} />

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

      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-on-surface px-margin-mobile py-stack-sm flex items-center gap-2">
        <div className="flex flex-col flex-shrink-0">
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant text-xs">
            {activeSize ?? "Size?"}
            {activeColor && product.colors && product.colors.length > 1
              ? ` · ${activeColor}`
              : ""}
          </span>
          <span className="font-headline-md text-headline-md uppercase">
            {formatPrice(product.price)}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToBag}
          disabled={soldOut || !activeSize || selectedStock === 0}
          className={`flex-1 py-3 font-headline-md text-headline-md uppercase transition-colors flex items-center justify-center gap-2 ${
            added
              ? "bg-primary text-on-primary"
              : "bg-on-surface text-surface hover:bg-primary hover:text-on-primary"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <span>
            {added
              ? "Added"
              : soldOut || selectedStock === 0
                ? "Sold Out"
                : "Add to Bag"}
          </span>
          <Icon
            name={added ? "check" : "shopping_bag"}
            className="w-6 h-6"
            filled={added}
          />
        </button>
        <WishlistButton
          item={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            subtitle: product.subtitle,
            price: product.price,
            image: product.images[0].src,
            imageAlt: product.images[0].alt,
            badge: product.badge,
          }}
          className="w-12 h-12 border border-on-surface text-on-surface hover:text-primary bg-surface"
        />
      </div>
    </div>
  );
}
