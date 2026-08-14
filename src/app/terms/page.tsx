import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "LAST DANCE terms of service.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      <div className="border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Terms of Service
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          LAST DANCE mağazasını kullanarak aşağıdaki koşulları kabul etmiş
          olursunuz.
        </p>
      </div>

      <div className="flex flex-col gap-stack-md max-w-2xl">
        <div className="flex flex-col gap-2 border border-on-surface p-stack-md">
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            Fiyatlar
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Fiyatlar EUR cinsindendir ve vergiler dahildir. Katalogdaki hatalı
            fiyatlandırma durumunda sipariş iptal edilebilir.
          </p>
        </div>
        <div className="flex flex-col gap-2 border border-on-surface p-stack-md">
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            Stok
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Stok varyant bazında takip edilir; rezervasyon ve ödeme anında stok
            doğrulanır. Limited drop ürünleri satın alındıktan sonra yeniden
            stoklanmayabilir.
          </p>
        </div>
        <div className="flex flex-col gap-2 border border-on-surface p-stack-md">
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            Fikri Mülkiyet
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Ürün görselleri, marka ve içerikler LAST DANCE&apos;e aittir; izinsiz
            kullanılamaz.
          </p>
        </div>
        <div className="flex flex-col gap-2 border border-on-surface p-stack-md">
          <h2 className="font-headline-md text-headline-md uppercase text-on-surface">
            Sorumluluk
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Mağaza &quot;olduğu gibi&quot; sunulur; kesintilerden veya erişim
            kayıplarından kaynaklanan doğrudan zararlar hariç sorumluluk sınırlıdır.
          </p>
        </div>
      </div>
    </div>
  );
}
