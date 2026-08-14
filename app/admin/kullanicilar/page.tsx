import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import UserManager from "./UserManager";

export const metadata: Metadata = {
  title: "Kullanıcılar",
  description: "Kullanıcı yönetimi.",
};

export default async function AdminUsersPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    include: { _count: { select: { orders: true, reviews: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex justify-between items-end border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Kullanıcılar
        </h1>
      </div>

      <UserManager
        currentUserId={session?.user?.id ?? ""}
        initialUsers={users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          orderCount: u._count.orders,
          reviewCount: u._count.reviews,
          createdAt: u.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
