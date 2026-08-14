import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import { prisma } from "@/infrastructure/prisma";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  const reviews = await prisma.review.findMany({
    where: q
      ? { product: { name: { contains: q, mode: "insensitive" } } }
      : undefined,
    include: {
      product: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, email: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    reviews: reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      product: r.product,
      user: r.user,
    })),
  });
}
