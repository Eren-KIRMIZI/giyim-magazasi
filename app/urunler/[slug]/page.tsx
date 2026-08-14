import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProductBySlug,
  getAllSlugs,
  getRecommendedProducts,
} from "@/lib/catalog";
import { SITE_URL } from "@/lib/site";
import ProductDetail from "./ProductDetail";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product Not Found" };
  }
  const url = `${SITE_URL}/urunler/${slug}`;
  const description =
    product.description ||
    `LAST DANCE ${product.name} — ${product.categoryLabel}. ${product.subtitle}.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${product.name} | LAST DANCE`,
      description,
      url,
      siteName: "LAST DANCE",
      type: "website",
      images: product.images.map((img) => ({
        url: img.src,
        alt: img.alt,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | LAST DANCE`,
      description,
      images: product.images[0]?.src ? [product.images[0].src] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const recommended = await getRecommendedProducts(product.slug);

  const url = `${SITE_URL}/urunler/${product.slug}`;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => img.src),
    brand: { "@type": "Brand", name: "LAST DANCE" },
    category: product.categoryLabel,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "EUR",
      price: product.price.toFixed(2),
      availability:
        product.badge === "SOLD OUT"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categoryLabel,
        item: `${SITE_URL}/koleksiyonlar`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetail product={product} recommended={recommended} />
    </div>
  );
}
