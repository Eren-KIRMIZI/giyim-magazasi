import { NextResponse } from "next/server";
import { auth } from "@/modules/auth";
import {
  getProductReviews,
  submitReview,
  ReviewValidationError,
  ReviewRateLimitError,
  ReviewProductNotFoundError,
} from "@/modules/reviews";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await getProductReviews(productId);

  return NextResponse.json({ reviews });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  let body: { productId?: string; rating?: number; comment?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  try {
    const review = await submitReview({
      userId: session.user.id,
      productId: body.productId,
      rating: body.rating,
      comment: body.comment,
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    if (err instanceof ReviewRateLimitError) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }
    if (err instanceof ReviewProductNotFoundError) {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    if (err instanceof ReviewValidationError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    throw err;
  }
}
