import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SalesChart from "./SalesChart";

export const metadata: Metadata = {
  title: "Admin",
  description: "LAST DANCE yönetim paneli.",
};

const REVENUE_EXCLUDE = ["CANCELLED", "REFUNDED", "FAILED"];

function formatEuro(value: number) {
  return `€${value.toFixed(2).replace(".", ",")}`;
}

function localDayKey(date: Date) {
  return date.toLocaleDateString("sv-SE");
}

export default async function AdminDashboard() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 29);

  const since24h = new Date();
  since24h.setHours(since24h.getHours() - 24);

  const [
    productCount,
    orderCount,
    userCount,
    categoryCount,
    revenueAgg,
    revenue30,
    chartOrders,
    topItems,
    lowStock,
    failed24,
    activeReservations,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      where: { status: { notIn: REVENUE_EXCLUDE } },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        status: { notIn: REVENUE_EXCLUDE },
        createdAt: { gte: start },
      },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      where: { status: { notIn: REVENUE_EXCLUDE }, createdAt: { gte: start } },
      select: { total: true, createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      where: {
        productId: { not: null },
        order: { status: { notIn: REVENUE_EXCLUDE } },
      },
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.productVariant.findMany({
      where: { stock: { lte: 5 } },
      include: { product: { select: { id: true, name: true, slug: true } } },
      orderBy: { stock: "asc" },
      take: 8,
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: since24h },
        status: { in: ["FAILED", "CANCELLED"] },
      },
    }),
    prisma.orderReservation.count({ where: { status: "ACTIVE" } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { email: true } } },
    }),
  ]);

  const topIds = topItems
    .map((t) => t.productId)
    .filter((id): id is string => Boolean(id));
  const topRevenueItems = await prisma.orderItem.findMany({
    where: {
      productId: { in: topIds },
      order: { status: { notIn: REVENUE_EXCLUDE } },
    },
    select: { productId: true, quantity: true, price: true },
  });
  const revenueByProduct = new Map<string, number>();
  for (const item of topRevenueItems) {
    if (!item.productId) continue;
    const prev = revenueByProduct.get(item.productId) ?? 0;
    revenueByProduct.set(
      item.productId,
      prev + item.quantity * Number(item.price)
    );
  }

  const buckets = new Map<string, number>();
  for (let i = 0; i < 30; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    buckets.set(localDayKey(d), 0);
  }
  for (const order of chartOrders) {
    const key = localDayKey(order.createdAt);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + Number(order.total));
    }
  }
  const series = [...buckets.entries()].map(([key, value]) => ({
    label: `${key.slice(8)}.${key.slice(5, 7)}`,
    value,
  }));

  const stats = [
    { label: "Ürün", value: productCount, href: "/admin/urunler" },
    { label: "Sipariş", value: orderCount, href: "/admin/siparisler" },
    { label: "Kullanıcı", value: userCount, href: "/admin/kullanicilar" },
    { label: "Kategori", value: categoryCount, href: "/admin/kategoriler" },
  ];

  const revenueStats = [
    {
      label: "Toplam Ciro",
      value: formatEuro(Number(revenueAgg._sum.total ?? 0)),
      href: "/admin/siparisler",
    },
    {
      label: "Son 30 Gün Ciro",
      value: formatEuro(Number(revenue30._sum.total ?? 0)),
      href: "/admin/siparisler",
    },
    {
      label: "Son 24s İptal/Fail",
      value: String(failed24),
      href: "/admin/siparisler",
    },
    {
      label: "Aktif Rezervasyon",
      value: String(activeReservations),
      href: "/admin/siparisler",
    },
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        {revenueStats.map((s) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
            Son 30 Gün — Günlük Ciro
          </h2>
          <SalesChart data={series} />
        </div>
        <div className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
            En Çok Satanlar
          </h2>
          {topItems.length === 0 ? (
            <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
              Satış verisi yok.
            </div>
          ) : (
            <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
              {topItems.map((item, i) => (
                <div
                  key={item.productId}
                  className="p-stack-md flex items-center gap-4"
                >
                  <span className="font-headline-md text-headline-md uppercase text-on-surface-variant">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <span className="font-label-mono text-label-mono uppercase text-on-surface truncate">
                      {item.name}
                    </span>
                    <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                      {item._sum.quantity} adet
                    </span>
                  </div>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {formatEuro(
                      revenueByProduct.get(item.productId ?? "") ?? 0
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-stack-sm">
        <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
          Düşük Stok Uyarıları (≤ 5)
        </h2>
        {lowStock.length === 0 ? (
          <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
            Düşük stoklu varyant yok.
          </div>
        ) : (
          <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
            {lowStock.map((v) => (
              <div
                key={v.id}
                className="p-stack-md flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {v.product.name}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {v.size}
                    {v.color ? ` / ${v.color}` : ""} · sku: {v.sku}
                  </span>
                </div>
                <span
                  className={`font-headline-md text-headline-md uppercase ${
                    v.stock === 0 ? "text-error" : "text-on-surface"
                  }`}
                >
                  {v.stock} adet
                </span>
              </div>
            ))}
          </div>
        )}
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
                    {order.user.email} · {order.orderNumber}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {order.createdAt.toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {formatEuro(Number(order.total))}
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
