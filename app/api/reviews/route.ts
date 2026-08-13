import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      author: r.user.name,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });
  }

  const limited = await rateLimit(`review:${session.user.id}`, 10, 3600);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Çok fazla yorum denemesi. Lütfen bekleyin." },
      { status: 429 }
    );
  }

  let body: { productId?: string; rating?: number; comment?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const productId = body.productId;
  const rating = Number(body.rating);
  const comment = typeof body.comment === "string" ? body.comment.trim() : "";

  if (!productId) {
    return NextResponse.json({ error: "Ürün gereklidir." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Puan 1 ile 5 arasında olmalı." },
      { status: 400 }
    );
  }
  if (comment.length > 1000) {
    return NextResponse.json(
      { error: "Yorum en fazla 1000 karakter olabilir." },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  const review = await prisma.review.upsert({
    where: { productId_userId: { productId, userId: session.user.id } },
    update: { rating, comment: comment || null },
    create: { productId, userId: session.user.id, rating, comment: comment || null },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json(
    {
      review: {
        id: review.id,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
        author: review.user.name,
      },
    },
    { status: 201 }
  );
}
