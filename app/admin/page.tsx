import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin",
  description: "LAST DANCE yönetim paneli.",
};

export default async function AdminDashboard() {
  const [productCount, orderCount, userCount, categoryCount, revenueAgg] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
    ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: { select: { email: true } } },
  });

  const stats = [
    { label: "Ürün", value: productCount, href: "/admin/urunler" },
    { label: "Sipariş", value: orderCount, href: "/admin/siparisler" },
    { label: "Kullanıcı", value: userCount, href: "/admin" },
    { label: "Kategori", value: categoryCount, href: "/admin" },
  ];

  return (
    <div className="flex flex-col gap-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        Panel
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="border border-on-surface p-stack-md flex flex-col gap-2 hover:bg-surface-container transition-colors"
          >
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {s.label}
            </span>
            <span className="font-headline-md text-headline-md uppercase text-on-surface">
              {s.value}
            </span>
          </Link>
        ))}
      </div>

      <div className="border border-on-surface p-stack-md flex justify-between items-center">
        <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
          Toplam Ciro (iptal hariç)
        </span>
        <span className="font-headline-md text-headline-md uppercase text-on-surface">
          €{Number(revenueAgg._sum.total ?? 0).toFixed(2).replace(".", ",")}
        </span>
      </div>

      <div className="flex flex-col">
        <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm mb-stack-md">
          Son Siparişler
        </h2>
        {recentOrders.length === 0 ? (
          <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
            Henüz sipariş yok.
          </div>
        ) : (
          <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-stack-md flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {order.user.email} · {order.id.slice(-6)}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {order.createdAt.toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    €{Number(order.total).toFixed(2).replace(".", ",")}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-primary">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
