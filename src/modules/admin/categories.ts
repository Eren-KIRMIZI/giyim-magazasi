import { prisma } from "@/infrastructure/prisma";

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: c._count.products,
  }));
}
