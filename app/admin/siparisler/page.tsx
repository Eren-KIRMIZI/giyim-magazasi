import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import OrderStatus from "./OrderStatus";

export const metadata: Metadata = {
  title: "Siparişler",
  description: "Sipariş yönetimi.",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return (
    <div className="flex flex-col gap-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
        Siparişler
      </h1>

      {orders.length === 0 ? (
        <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
          Henüz sipariş yok.
        </div>
      ) : (
        <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
          {orders.map((order) => (
            <div key={order.id} className="p-stack-md flex flex-col gap-3">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="font-label-mono text-label-mono uppercase text-on-surface">
                    {order.user.email}
                  </span>
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {order.id.slice(-6)} ·{" "}
                    {order.createdAt.toLocaleDateString("tr-TR")}
                  </span>
                </div>
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
                    {item.product.name} × {item.quantity}
                    {item.size ? ` (${item.size})` : ""}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
