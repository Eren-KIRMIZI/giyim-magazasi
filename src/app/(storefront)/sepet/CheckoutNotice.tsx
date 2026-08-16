"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import { useCartStore } from "@/modules/cart";

export default function CheckoutNotice() {
  const params = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);
  const success = params.get("success");
  const cancelled = params.get("cancelled");

  useEffect(() => {
    if (success === "1") {
      // Sepeti yalnızca bu ödeme akışında bir kez temizle:
      // URL'deki ?success=1 geri/ileri ile tekrar mount olursa
      // kullanıcının yeni eklediği ürünler silinmesin.
      const key = "ld-checkout-cleared";
      if (typeof window !== "undefined" && !window.sessionStorage.getItem(key)) {
        clearCart();
        track("order_completed");
        window.sessionStorage.setItem(key, "1");
      }
    }
  }, [success, clearCart]);

  if (success === "1") {
    return (
      <div className="border border-on-surface bg-primary text-on-primary px-margin-mobile py-stack-md font-headline-md text-headline-md uppercase">
        Payment successful. Your order has been placed.{" "}
        <Link href="/hesabim" className="underline">
          Siparişlerimi gör
        </Link>
      </div>
    );
  }

  if (cancelled === "1") {
    return (
      <div className="border border-on-surface bg-surface-container text-on-surface px-margin-mobile py-stack-md font-headline-md text-headline-md uppercase">
        Payment cancelled. Your bag is still waiting.
      </div>
    );
  }

  return null;
}
