import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Returns",
  description: "LAST DANCE returns policy — 14-day returns on unworn items.",
  alternates: { canonical: `${SITE_URL}/returns` },
};

export default function ReturnsPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      <div className="border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Returns
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Teslimattan itibaren 14 gün içinde, giyilmemiş ve etiketi üzerinde olan
          ürünleri iade edebilirsiniz.
        </p>
      </div>

      <ol className="flex flex-col border border-on-surface divide-y divide-on-surface">
        {[
          "Sipariş detay sayfanızdan iade talebi oluşturun.",
          "Ürünleri orijinal ambalajıyla kargoya verin.",
          "Ürünler stokumuza ulaştığında iadeniz 3–5 iş günü içinde tamamlanır.",
        ].map((step, i) => (
          <li key={step} className="flex gap-4 p-stack-md">
            <span className="font-headline-md text-headline-md uppercase text-primary">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="font-body-lg text-body-lg text-on-surface">
              {step}
            </span>
          </li>
        ))}
      </ol>

      <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
        İndirimli ve limited drop ürünleri aksi belirtilmedikçe iade edilebilir.
        İade onayı için{" "}
        <Link href="/contact" className="text-primary underline">
          iletişime
        </Link>{" "}
        geçin.
      </p>
    </div>
  );
}
