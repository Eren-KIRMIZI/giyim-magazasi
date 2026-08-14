import { ImageResponse } from "next/og";
import { getProductBySlug } from "@/modules/catalog";
import { SITE_NAME } from "@/lib/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "LAST DANCE";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0e0e0e",
          color: "#f5f5f4",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            borderBottom: "2px solid #e11d2e",
            paddingBottom: 24,
            color: "#e11d2e",
          }}
        >
          <span>{SITE_NAME}</span>
          <span style={{ fontSize: 18, color: "#a3a3a3" }}>OFFICIAL STORE</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: 22,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#a3a3a3",
              marginBottom: 16,
            }}
          >
            {product ? `${product.categoryLabel} / ${product.subtitle}` : "LAST DANCE"}
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              textTransform: "uppercase",
              maxWidth: 900,
              lineHeight: 1.1,
            }}
          >
            {product?.name ?? "LAST DANCE"}
          </div>
          <div style={{ fontSize: 40, marginTop: 24, color: "#e11d2e" }}>
            {product ? `€${product.price.toFixed(2)}` : ""}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
