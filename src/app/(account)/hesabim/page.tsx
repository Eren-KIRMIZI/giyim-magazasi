import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/modules/auth";
import { getUserOrders } from "@/modules/orders";

export const metadata: Metadata = {
  title: "Hesabım",
  description: "LAST DANCE — hesap ve sipariş geçmişiniz.",
};

export default async function HesabimPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/giris");
  }

  const orders = await getUserOrders(session.user.id);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface mb-stack-md">
        Hesabım
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-4">
          <div className="border border-on-surface p-stack-md flex flex-col gap-stack-sm">
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              Üye
            </span>
            <span className="font-headline-md text-headline-md uppercase text-on-surface">
              {session.user.name ?? session.user.email}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {session.user.email}
            </span>
          </div>
        </div>

        <div className="md:col-span-8 flex flex-col">
          <h2 className="font-headline-md text-headline-md uppercase border-b border-on-surface pb-stack-sm mb-stack-md">
            Sipariş Geçmişi
          </h2>

          {orders.length === 0 ? (
            <div className="border border-on-surface p-stack-md flex flex-col items-center gap-stack-md text-center">
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Henüz siparişiniz yok. Arşiv seni bekliyor.
              </p>
              <Link
                href="/koleksiyonlar"
                className="inline-block bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-4 hover:bg-primary transition-colors duration-200"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/hesabim/${order.orderNumber || order.id}`}
                  className="p-stack-md flex flex-col gap-stack-sm hover:bg-surface-container transition-colors"
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                      {order.createdAt.toLocaleDateString("tr-TR")} ·{" "}
                      {order.orderNumber || order.id.slice(-6)}
                    </span>
                    <span className="font-label-mono text-label-mono uppercase text-primary">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                      {order.items.reduce((n, i) => n + i.quantity, 0)} ürün
                    </span>
                    <span className="font-label-mono text-label-mono uppercase text-on-surface">
                      €{Number(order.total).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
