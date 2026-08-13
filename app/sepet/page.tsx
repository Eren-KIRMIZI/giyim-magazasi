import type { Metadata } from "next";
import CartClient from "./CartClient";

export const metadata: Metadata = {
  title: "Shopping Bag",
  description: "Review your LAST DANCE bag before checkout.",
};

export default function CartPage() {
  return <CartClient />;
}
