import { prisma } from "@/infrastructure/prisma";
import { rateLimit } from "@/infrastructure/redis/rate-limit";

export interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  author: string | null;
}

export class ReviewValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewValidationError";
  }
}

export class ReviewRateLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewRateLimitError";
  }
}

export class ReviewProductNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReviewProductNotFoundError";
  }
}

export async function getProductReviews(
  productId: string
): Promise<ReviewRow[]> {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.createdAt,
    author: r.user.name,
  }));
}

export interface SubmitReviewInput {
  userId: string;
  productId?: string;
  rating?: number;
  comment?: string;
}

export async function submitReview(
  input: SubmitReviewInput
): Promise<ReviewRow> {
  const productId = input.productId;
  const rating = Number(input.rating);
  const comment = typeof input.comment === "string" ? input.comment.trim() : "";

  if (!productId) {
    throw new ReviewValidationError("Ürün gereklidir.");
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ReviewValidationError("Puan 1 ile 5 arasında olmalı.");
  }
  if (comment.length > 1000) {
    throw new ReviewValidationError("Yorum en fazla 1000 karakter olabilir.");
  }

  const limited = await rateLimit(`review:${input.userId}`, 10, 3600);
  if (!limited.ok) {
    throw new ReviewRateLimitError("Çok fazla yorum denemesi. Lütfen bekleyin.");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) {
    throw new ReviewProductNotFoundError("Ürün bulunamadı.");
  }

  const review = await prisma.review.upsert({
    where: { productId_userId: { productId, userId: input.userId } },
    update: { rating, comment: comment || null },
    create: {
      productId,
      userId: input.userId,
      rating,
      comment: comment || null,
    },
    include: { user: { select: { name: true } } },
  });

  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
    author: review.user.name,
  };
}
