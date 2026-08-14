import type { Metadata } from "next";
import HeroSection from "@/components/store/HeroSection";
import NewArrivalsSection from "@/components/store/NewArrivalsSection";
import CollectionsSection from "@/components/store/CollectionsSection";
import { brandLogo } from "@/lib/data";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  title: "LAST DANCE | Official Store",
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "LAST DANCE | Official Store",
    description:
      "Unapologetic streetwear. Brutalist design. This is your last chance to secure the archive.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LAST DANCE | Official Store",
    description: SITE_DESCRIPTION,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: brandLogo,
};

export default function HomePage() {
  return (
    <div className="w-full max-w-container-max mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HeroSection />
      <NewArrivalsSection />
      <CollectionsSection />
    </div>
  );
}
