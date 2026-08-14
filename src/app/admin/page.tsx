import type { Metadata } from "next";
import Link from "next/link";
import { getDashboardData } from "@/modules/admin";
import SalesChart from "./SalesChart";

export const metadata: Metadata = {
  title: "Admin",
  description: "LAST DANCE yönetim paneli.",
};

function formatEuro(value: number) {
  return `€${value.toFixed(2).replace(".", ",")}`;
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const stats = [
    { label: "Ürün", value: data.productCount, href: "/admin/urunler" },
    { label: "Sipariş", value: data.orderCount, href: "/admin/siparisler" },
    { label: "Kullanıcı", value: data.userCount, href: "/admin/kullanicilar" },
    { label: "Kategori", value: data.categoryCount, href: "/admin/kategoriler" },
  ];

  const revenueStats = [
    {
      label: "Toplam Ciro",
      value: formatEuro(data.totalRevenue),
      href: "/admin/siparisler",
    },
    {
      label: "Son 30 Gün Ciro",
      value: formatEuro(data.revenue30),
      href: "/admin/siparisler",
    },
    {
      label: "Son 24s İptal/Fail",
      value: String(data.failedLast24h),
      href: "/admin/siparisler",
    },
    {
      label: "Aktif Rezervasyon",
      value: String(data.activeReservations),
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
          <SalesChart data={data.revenueSeries} />
        </div>
        <div className="flex flex-col gap-stack-sm">
          <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm">
            En Çok Satanlar
          </h2>
          {data.topSellers.length === 0 ? (
            <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
              Satış verisi yok.
            </div>
          ) : (
            <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
              {data.topSellers.map((item, i) => (
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
                      {item.quantity} adet
                    </span>
                  </div>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {formatEuro(item.revenue)}
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
        {data.lowStock.length === 0 ? (
          <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
            Düşük stoklu varyant yok.
          </div>
        ) : (
          <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
            {data.lowStock.map((v) => (
              <div
                key={v.id}
                className="p-stack-md flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {v.productName}
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
        {data.recentOrders.length === 0 ? (
          <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
            Henüz sipariş yok.
          </div>
        ) : (
          <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="p-stack-md flex flex-wrap justify-between items-center gap-4"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {order.email} · {order.orderNumber}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {order.createdAt.toLocaleDateString("tr-TR")}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {formatEuro(order.total)}
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
