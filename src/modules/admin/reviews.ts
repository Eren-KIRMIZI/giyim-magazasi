import { prisma } from "@/infrastructure/prisma";

export interface AdminReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  product: { id: string; name: string; slug: string };
  user: { id: string; email: string; name: string | null };
}

export async function getAdminReviews(): Promise<AdminReviewRow[]> {
  const reviews = await prisma.review.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt.toISOString(),
    product: r.product,
    user: r.user,
  }));
}
