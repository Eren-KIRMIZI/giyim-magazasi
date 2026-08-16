"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, cartItemKey } from "@/modules/cart";
import { formatPrice } from "@/lib/data";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { fromCents, lineTotalCents } from "@/lib/money";
import EmptyState from "@/components/ui/EmptyState";
import { Icon } from "@/components/icons";

export default function CartClient() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const subtotal = fromCents(
    items.reduce(
      (sum, item) => sum + lineTotalCents(item.price, item.quantity),
      0
    )
  );
  const shippingProgress = Math.min(subtotal / FREE_SHIPPING_THRESHOLD, 1);
  const remainingForFree = Math.max(
    FREE_SHIPPING_THRESHOLD - subtotal,
    0
  );

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            quantity: item.quantity,
            size: item.size,
            color: item.color ?? null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Checkout failed"
      );
      setCheckoutLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="w-full max-w-container-max mx-auto">
        <EmptyState
          icon="shopping_bag"
          title="Your Bag is Empty"
          description="The archive awaits. Secure your drop before it's gone."
          actionLabel="Shop Now"
          actionHref="/koleksiyonlar"
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <div className="flex justify-between items-end mb-stack-md border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Shopping Bag
        </h1>
        <button
          type="button"
          onClick={clearCart}
          className="font-label-mono text-label-mono uppercase text-on-surface-variant hover:text-error transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 flex flex-col border border-on-surface">
          {items.map((item) => (
            <div
              key={cartItemKey(item)}
              className="flex gap-4 p-stack-md border-b border-on-surface last:border-b-0"
            >
              <Link
                href={`/urunler/${item.slug}`}
                className="relative w-24 h-32 flex-shrink-0 bg-surface-container overflow-hidden group"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </Link>
              <div className="flex flex-col justify-between flex-1 gap-2">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link
                      href={`/urunler/${item.slug}`}
                      className="font-label-mono text-label-mono uppercase text-on-surface hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                    <div className="font-label-mono text-label-mono uppercase text-on-surface-variant mt-1">
                      Size: {item.size}
                      {item.color ? ` · ${item.color}` : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      removeItem(item.productId, item.size, item.color)
                    }
                    className="font-label-mono text-label-mono text-on-surface-variant hover:text-error transition-colors self-start"
                  >
                    Remove
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-on-surface">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity - 1,
                          item.color
                        )
                      }
                      className="w-9 h-9 flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface active:scale-90 transition-all duration-150"
                    >
                      -
                    </button>
                    <span className="w-9 h-9 flex items-center justify-center font-label-mono text-label-mono">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.quantity + 1,
                          item.color
                        )
                      }
                      disabled={
                        item.maxQuantity != null &&
                        item.quantity >= item.maxQuantity
                      }
                      className="w-9 h-9 flex items-center justify-center font-label-mono text-label-mono hover:bg-on-surface hover:text-surface active:scale-90 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="font-label-mono text-label-mono uppercase">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                    {item.maxQuantity != null && (
                      <div className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                        Stok: {item.maxQuantity}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="md:col-span-4">
          <div className="md:sticky md:top-24 border border-on-surface bg-surface p-stack-md flex flex-col gap-stack-md">
            <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
              Order Summary
            </h2>
            <div className="flex flex-col gap-2 border border-on-surface bg-surface-container-low p-3">
              <div className="flex justify-between items-center gap-2">
                <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                  Free Shipping
                </span>
                <span
                  className={`font-label-mono text-label-mono uppercase ${
                    remainingForFree > 0
                      ? "text-on-surface"
                      : "text-primary"
                  }`}
                >
                  {remainingForFree > 0
                    ? `${formatPrice(remainingForFree)} to go`
                    : "Unlocked"}
                </span>
              </div>
              <div className="h-1 w-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${shippingProgress * 100}%` }}
                />
              </div>
              <p className="font-label-mono text-label-mono uppercase text-on-surface-variant text-[11px]">
                {remainingForFree > 0
                  ? `Add ${formatPrice(remainingForFree)} more for free shipping`
                  : "You've unlocked free shipping"}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                Subtotal
              </span>
              <span className="font-label-mono text-label-mono uppercase text-on-surface">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                Shipping
              </span>
              <span className="font-label-mono text-label-mono uppercase text-on-surface">
                Calculated at checkout
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-on-surface pt-stack-sm">
              <span className="font-headline-md text-headline-md uppercase">
                Total
              </span>
              <span className="font-headline-md text-headline-md uppercase">
                {formatPrice(subtotal)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-on-surface text-surface font-headline-md text-headline-md uppercase py-4 hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>
                {checkoutLoading ? "Redirecting..." : "Proceed to Checkout"}
              </span>
              <Icon
                name={checkoutLoading ? "progress_activity" : "arrow_forward"}
                className={`w-5 h-5 ${checkoutLoading ? "animate-spin" : ""}`}
              />
            </button>
            {checkoutError && (
              <div className="flex flex-col gap-2 items-center">
                <p className="font-label-mono text-label-mono uppercase text-error text-center">
                  {checkoutError}
                </p>
                {checkoutError.includes("giriş") && (
                  <Link
                    href="/giris"
                    className="inline-block border border-on-surface px-6 py-2 font-headline-md text-headline-md uppercase hover:bg-on-surface hover:text-surface transition-colors"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>
            )}
            <p className="font-label-mono text-label-mono uppercase text-on-surface-variant text-center">
              Payments processed securely by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
