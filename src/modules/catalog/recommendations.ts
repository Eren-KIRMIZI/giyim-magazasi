import "server-only";
import { prisma } from "@/infrastructure/prisma";
import type { Product } from "./types";
import { getCardProducts } from "./queries";

export async function getRecommendedProducts(
  excludeSlug: string,
  limit = 3
): Promise<Product[]> {
  const current = await prisma.product.findUnique({
    where: { slug: excludeSlug },
    select: { categoryId: true },
  });

  const products: Product[] = [];
  if (current) {
    products.push(
      ...(await getCardProducts(
        {
          status: { not: "DRAFT" },
          categoryId: current.categoryId,
          slug: { not: excludeSlug },
        },
        { take: limit }
      ))
    );
  }
  if (products.length < limit) {
    products.push(
      ...(await getCardProducts(
        {
          status: { not: "DRAFT" },
          slug: { not: excludeSlug },
          id: { notIn: products.map((p) => p.id) },
        },
        { take: limit - products.length }
      ))
    );
  }
  return products;
}
