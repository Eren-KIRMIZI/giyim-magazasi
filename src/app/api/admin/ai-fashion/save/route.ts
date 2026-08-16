import { NextResponse } from "next/server";
import { requireAdmin } from "@/modules/auth";
import { AiFashionError, saveGeneratedImages } from "@/modules/ai-fashion";
import { revalidateStorefront } from "@/lib/revalidate";

interface SaveImageInput {
  url: string;
  alt: string | null;
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { productId?: unknown; images?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const productId = String(body.productId ?? "").trim();
  const imagesRaw = Array.isArray(body.images) ? body.images : [];

  const images: SaveImageInput[] = imagesRaw
    .map((img) => {
      if (!img || typeof img !== "object") return null;
      const url = String((img as { url?: unknown }).url ?? "");
      if (!url.trim()) return null;
      if (!url.startsWith("/uploads/ai/")) return null;
      return {
        url: url.trim(),
        alt: (img as { alt?: unknown }).alt ? String((img as { alt?: unknown }).alt) : null,
      };
    })
    .filter((i): i is SaveImageInput => i !== null);

  if (!productId || images.length === 0) {
    return NextResponse.json(
      { error: "Ürün ve en az bir görsel gerekli." },
      { status: 400 }
    );
  }

  try {
    const { count } = await saveGeneratedImages(productId, images);
    revalidateStorefront();
    return NextResponse.json({ ok: true, count });
  } catch (err) {
    if (err instanceof AiFashionError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("AI Fashion save failed:", err);
    return NextResponse.json({ error: "Kaydetme sırasında bir hata oluştu." }, { status: 500 });
  }
}
