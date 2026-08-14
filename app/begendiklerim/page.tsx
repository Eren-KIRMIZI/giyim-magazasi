import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import WishlistPage from "./WishlistPage";

export const metadata: Metadata = {
  title: "Wishlist",
  description:
    "Your saved LAST DANCE pieces. Secure them before they're gone.",
  alternates: { canonical: `${SITE_URL}/begendiklerim` },
  robots: { index: false, follow: true },
};

export default function WishlistPageRoute() {
  return <WishlistPage />;
}
