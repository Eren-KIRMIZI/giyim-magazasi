import type { Metadata } from "next";
import NewsletterForm from "@/components/ui/NewsletterForm";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Join the LAST DANCE syndicate — early access to limited drops.",
  alternates: { canonical: `${SITE_URL}/newsletter` },
};

export default function NewsletterPage() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col items-center gap-stack-lg">
      <div className="flex flex-col items-center gap-stack-sm text-center max-w-2xl">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase text-on-surface">
          Join the Syndicate
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Limited drop&apos;lar halka açılmadan önce sana ulaşsın. Spam yok —
          yalnızca arşiv.
        </p>
      </div>

      <div className="w-full max-w-md border border-on-surface p-stack-md">
        <NewsletterForm tone="on-light" />
      </div>
    </div>
  );
}
