import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUS_LABELS } from "@/lib/order";

export const metadata: Metadata = {
  title: "Sipariş Detayı",
  description: "Siparişinizin detayları.",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/giris");
  }

  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });

  if (!order) notFound();
  if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
    notFound();
  }

  const statusLabel = ORDER_STATUS_LABELS[order.status] ?? order.status;

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <Link
        href="/hesabim"
        className="font-label-mono text-label-mono uppercase text-on-surface-variant hover:text-on-surface transition-colors"
      >
        ← Siparişlerim
      </Link>

      <div className="flex flex-wrap justify-between items-end gap-4 mt-stack-md mb-stack-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
            {order.orderNumber}
          </h1>
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
            {order.createdAt.toLocaleString("tr-TR")}
          </span>
        </div>
        <span className="inline-block bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 uppercase">
          {statusLabel} · {order.status}
        </span>
      </div>

      <div className="border border-on-surface divide-y divide-on-surface mb-stack-md">
        {order.items.map((item) => (
          <div key={item.id} className="p-stack-md flex gap-4">
            {item.image && (
              <div className="relative w-20 h-24 flex-shrink-0 bg-surface-container overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex flex-col justify-between flex-1 gap-1">
              <div>
                <div className="font-label-mono text-label-mono uppercase text-on-surface">
                  {item.name}
                </div>
                <div className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                  {item.sku ? `SKU ${item.sku}` : ""}
                  {item.size ? ` · ${item.size}` : ""}
                  {item.color ? ` · ${item.color}` : ""}
                </div>
              </div>
              <div className="flex justify-between items-center font-label-mono text-label-mono uppercase">
                <span className="text-on-surface-variant">
                  {item.quantity} × €{Number(item.price).toFixed(2).replace(".", ",")}
                </span>
                <span className="text-on-surface">
                  €{Number(Number(item.price) * item.quantity).toFixed(2).replace(".", ",")}
                </span>              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border border-on-surface p-stack-md mb-stack-md">
        <span className="font-headline-md text-headline-md uppercase">Toplam</span>
        <span className="font-headline-md text-headline-md uppercase">
          €{Number(order.total).toFixed(2).replace(".", ",")}
        </span>
      </div>

      <p className="font-label-mono text-label-mono uppercase text-on-surface-variant">
        Siparişle ilgili bir sorun varsa bizimle iletişime geçin.
      </p>
    </div>
  );
}
