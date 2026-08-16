import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { SHIPPING_TIERS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Shipping",
  description: "LAST DANCE shipping policy — dispatch times, carriers and delivery.",
  alternates: { canonical: `${SITE_URL}/shipping` },
};

export default function ShippingPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      <div className="border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Shipping
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Siparişler 48 saat içinde hazırlanır ve kargoya verilir. Kargo numarası
          e-posta ile paylaşılır.
        </p>
      </div>

      <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
        {SHIPPING_TIERS.map((row) => (
          <div
            key={row.region}
            className="grid grid-cols-1 md:grid-cols-3 gap-2 p-stack-md"
          >
            <span className="font-headline-md text-headline-md uppercase text-on-surface">
              {row.region}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {row.time}
            </span>
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {row.cost}
            </span>
          </div>
        ))}
      </div>

      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
        Gümrük vergileri destinasyona göre alıcıya aittir. Kargo firması kaynaklı
        gecikmelerden LAST DANCE sorumlu tutulamaz.
      </p>
    </div>
  );
}
