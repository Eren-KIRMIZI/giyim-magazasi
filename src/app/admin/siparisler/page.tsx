import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrders } from "@/modules/admin";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/modules/orders";
import OrderStatus from "./OrderStatus";

export const metadata: Metadata = {
  title: "Siparişler",
  description: "Sipariş yönetimi.",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;

  const status = params.status ?? "";
  const q = (params.q ?? "").trim();
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const { orders, total, page: currentPage, pageCount } = await getAdminOrders({
    status,
    q,
    page,
  });

  const buildPageHref = (p: number) => {
    const sp = new URLSearchParams();
    if (status) sp.set("status", status);
    if (q) sp.set("q", q);
    sp.set("page", String(p));
    return `/admin/siparisler?${sp.toString()}`;
  };

  return (
    <div className="flex flex-col gap-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        Siparişler
      </h1>

      <form
        method="get"
        className="flex flex-wrap items-end gap-4 border border-on-surface p-stack-md"
      >
        <label className="flex flex-col gap-1 font-label-mono text-label-mono uppercase">
          Durum
          <select
            name="status"
            defaultValue={status}
            className="border border-on-surface bg-transparent px-3 py-2 font-label-mono text-label-mono uppercase text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="">Tümü</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {ORDER_STATUS_LABELS[s] ?? s} ({s})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 font-label-mono text-label-mono uppercase flex-1">
          Ara (no / e-posta / isim)
          <input
            name="q"
            defaultValue={q}
            placeholder="LD-2026-…"
            className="border border-on-surface bg-transparent px-3 py-2 font-label-mono text-label-mono text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          className="border border-on-surface bg-on-surface text-surface px-6 py-2 font-headline-md text-headline-md uppercase hover:bg-primary transition-colors"
        >
          Filtrele
        </button>
      </form>

      {orders.length === 0 ? (
        <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
          Sipariş bulunamadı.
        </div>
      ) : (
        <>
          <div className="font-label-mono text-label-mono uppercase text-on-surface-variant">
            {total} sipariş
          </div>
          <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
            {orders.map((order) => (
              <div
                key={order.id}
                className="p-stack-md flex flex-col gap-3 hover:bg-surface-container transition-colors"
              >
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <Link
                    href={`/admin/siparisler/${order.id}`}
                    className="flex flex-col gap-1"
                  >
                    <span className="font-label-mono text-label-mono uppercase text-on-surface">
                      {order.orderNumber}
                    </span>
                    <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                      {order.email} ·{" "}
                      {order.createdAt.toLocaleString("tr-TR")}
                    </span>
                  </Link>
                  <div className="flex items-center gap-4">
                    <span className="font-label-mono text-label-mono uppercase text-on-surface">
                      €{Number(order.total).toFixed(2).replace(".", ",")}
                    </span>
                    <OrderStatus orderId={order.id} status={order.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {order.items.map((item) => (
                    <span
                      key={item.id}
                      className="font-label-mono text-label-mono uppercase text-on-surface-variant border border-on-surface px-2 py-1"
                    >
                      {item.name} × {item.quantity}
                      {item.size ? ` (${item.size})` : ""}
                      {item.color ? ` · ${item.color}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {pageCount > 1 && (
            <div className="flex items-center justify-between gap-4 border-t border-on-surface pt-stack-sm">
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                Sayfa {currentPage} / {pageCount}
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    className="border border-on-surface px-4 py-2 font-label-mono text-label-mono uppercase hover:bg-on-surface hover:text-surface transition-colors"
                  >
                    Önceki
                  </Link>
                )}
                {currentPage < pageCount && (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className="border border-on-surface bg-on-surface text-surface px-4 py-2 font-label-mono text-label-mono uppercase hover:bg-primary transition-colors"
                  >
                    Sonraki
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
