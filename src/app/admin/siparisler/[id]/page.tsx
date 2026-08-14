import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminOrder } from "@/modules/admin";
import { ORDER_STATUS_LABELS } from "@/modules/orders";
import OrderStatus from "../OrderStatus";

export const metadata: Metadata = {
  title: "Sipariş Detayı",
  description: "Sipariş detay yönetimi.",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) notFound();

  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;
  const itemCount = order.items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="flex flex-col gap-stack-lg">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <Link
            href="/admin/siparisler"
            className="font-label-mono text-label-mono uppercase text-on-surface-variant hover:text-on-surface transition-colors"
          >
            ← Siparişler
          </Link>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface mt-2">
            {order.orderNumber}
          </h1>
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
            {order.createdAt.toLocaleString("tr-TR")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 uppercase">
            {statusLabel}
          </span>
          <OrderStatus orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4 flex flex-col gap-stack-md">
          <div className="border border-on-surface p-stack-md flex flex-col gap-1">
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              Müşteri
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface">
              {order.customerName ?? order.userName ?? "—"}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {order.customerEmail ?? order.userEmail}
            </span>
          </div>

          <div className="border border-on-surface p-stack-md flex flex-col gap-1">
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              Ödeme
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface">
              Toplam: €{Number(order.total).toFixed(2).replace(".", ",")}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {itemCount} ürün
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              Session: {order.stripeSessionId ?? "—"}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              PaymentIntent: {order.stripePaymentIntentId ?? "—"}
            </span>
          </div>

          <div className="border border-on-surface p-stack-md flex flex-col gap-1">
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              Stok
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface">
              Tüketildi: {order.stockConsumed ? "Evet" : "Hayır"}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface">
              Geri yüklendi: {order.stockRestored ? "Evet" : "Hayır"}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col">
          <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm mb-stack-md">
            Kalemler
          </h2>
          <div className="border border-on-surface divide-y divide-on-surface">
            {order.items.map((item) => (
              <div key={item.id} className="p-stack-md flex justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {item.name}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {item.sku ? `SKU ${item.sku}` : ""}
                    {item.size ? ` · ${item.size}` : ""}
                    {item.color ? ` · ${item.color}` : ""}
                    {item.variantId ? ` · var:${item.variantId.slice(-4)}` : ""}
                  </span>
                </div>
                <span className="font-label-mono text-label-mono uppercase text-on-surface flex-shrink-0">
                  {item.quantity} × €{Number(item.price).toFixed(2).replace(".", ",")} = €
                  {Number(Number(item.price) * item.quantity).toFixed(2).replace(".", ",")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
