import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LAST DANCE team.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col gap-stack-lg">
      <div className="border-b border-on-surface pb-stack-sm">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Contact
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-2 max-w-2xl">
          Sipariş, kargo ve iade konularında bize ulaşın. Ortalama yanıt süresi 24
          saattir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-3xl">
        <a
          href="mailto:hello@lastdance.store"
          className="border border-on-surface p-stack-md flex flex-col gap-2 hover:bg-surface-container transition-colors"
        >
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
            E-posta
          </span>
          <span className="font-headline-md text-headline-md uppercase text-on-surface">
            hello@lastdance.store
          </span>
        </a>
        <div className="border border-on-surface p-stack-md flex flex-col gap-2">
          <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
            Çalışma saatleri
          </span>
          <span className="font-headline-md text-headline-md uppercase text-on-surface">
            Pzt – Cum · 09:00 – 18:00
          </span>
        </div>
      </div>
    </div>
  );
}
