import "server-only";
import { prisma } from "@/infrastructure/prisma";
import type { Product } from "./types";
import { mapProduct, type DbProduct } from "./queries";

export async function getRecommendedProducts(
  excludeSlug: string,
  limit = 3
): Promise<Product[]> {
  const current = await prisma.product.findUnique({
    where: { slug: excludeSlug },
    select: { categoryId: true },
  });

  const include = {
    category: true,
    images: { orderBy: { position: "asc" } },
    variants: true,
  } as const;

  const rows: DbProduct[] = [];
  if (current) {
    rows.push(
      ...(await prisma.product.findMany({
        where: {
          status: { not: "DRAFT" },
          categoryId: current.categoryId,
          slug: { not: excludeSlug },
        },
        include,
        orderBy: { createdAt: "desc" },
        take: limit,
      }))
    );
  }
  if (rows.length < limit) {
    rows.push(
      ...(await prisma.product.findMany({
        where: {
          status: { not: "DRAFT" },
          slug: { not: excludeSlug },
          id: { notIn: rows.map((r) => r.id) },
        },
        include,
        orderBy: { createdAt: "desc" },
        take: limit - rows.length,
      }))
    );
  }
  return rows.map(mapProduct);
}
