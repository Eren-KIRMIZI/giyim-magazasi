import type { Metadata } from "next";
import { Suspense } from "react";
import CartClient from "./CartClient";
import CheckoutNotice from "./CheckoutNotice";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your LAST DANCE bag before checkout.",
};

export default function CartPage() {
  return (
    <div className="flex flex-col gap-stack-md">
      <Suspense fallback={null}>
        <div className="w-full max-w-container-max mx-auto">
          <CheckoutNotice />
        </div>
      </Suspense>
      <CartClient />
    </div>
  );
}
