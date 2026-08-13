import type { Metadata } from "next";
import CollectionsClient from "./CollectionsClient";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse the LAST DANCE archive — hoodies, tees, bottoms, footwear and accessories.",
};

export default function CollectionsPage() {
  return <CollectionsClient />;
}
