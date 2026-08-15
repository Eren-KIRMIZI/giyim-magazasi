import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE_NAME;

export default function OpengraphImage() {
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
            Brutalist Streetwear
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 1,
              letterSpacing: 2,
            }}
          >
            {SITE_NAME}
          </div>
          <div
            style={{
              fontSize: 34,
              marginTop: 24,
              color: "#e11d2e",
              textTransform: "uppercase",
              letterSpacing: 2,
            }}
          >
            Secure the archive before it&apos;s gone
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            color: "#a3a3a3",
            borderTop: "1px solid #262626",
            paddingTop: 20,
          }}
        >
          <span>Drop III — Limited</span>
          <span>{SITE_URL.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
