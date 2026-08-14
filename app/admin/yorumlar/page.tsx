import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ReviewManager from "./ReviewManager";

export const metadata: Metadata = {
  title: "Yorumlar",
  description: "Yorum moderasyonu.",
};

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Yorumlar
        </h1>
      </div>

      <ReviewManager
        initialReviews={reviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          createdAt: r.createdAt.toISOString(),
          product: r.product,
          user: r.user,
        }))}
      />
    </div>
  );
}
