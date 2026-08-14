import type { Metadata } from "next";
import { getAdminReviews } from "@/modules/admin";
import ReviewManager from "./ReviewManager";

export const metadata: Metadata = {
  title: "Yorumlar",
  description: "Yorum moderasyonu.",
};

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Yorumlar
        </h1>
      </div>

      <ReviewManager initialReviews={reviews} />
    </div>
  );
}
