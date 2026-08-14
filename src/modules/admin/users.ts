import { prisma } from "@/infrastructure/prisma";

export interface AdminUserRow {
  id: string;
  email: string;
  name: string | null;
  role: string;
  orderCount: number;
  reviewCount: number;
  createdAt: string;
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true, reviews: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    orderCount: u._count.orders,
    reviewCount: u._count.reviews,
    createdAt: u.createdAt.toISOString(),
  }));
}
