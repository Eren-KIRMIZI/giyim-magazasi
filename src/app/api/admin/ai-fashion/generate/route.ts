import { NextResponse } from "next/server";
import { prisma } from "@/infrastructure/prisma";
import { requireAdmin } from "@/modules/auth";
import {
  AI_VIEWS,
  AiFashionError,
  generateProductViews,
  productContextFromProduct,
  resolveReference,
  type AIView,
} from "@/modules/ai-fashion";

const AI_VIEW_IDS = AI_VIEWS.map((v) => v.id);

function parseViews(raw: string): AIView[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => String(v))
      .filter((v): v is AIView => (AI_VIEW_IDS as string[]).includes(v));
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const productId = String(formData.get("productId") ?? "").trim();
  if (!productId) {
    return NextResponse.json({ error: "Ürün seçilmedi." }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  const views = parseViews(String(formData.get("views") ?? ""));
  if (views.length === 0) {
    return NextResponse.json({ error: "En az bir açı seçin." }, { status: 400 });
  }

  const references = [String(formData.get("garmentRef") ?? ""), String(formData.get("modelRef") ?? "")]
    .map((r) => r.trim())
    .filter(Boolean);

  const attributes = {
    gender: String(formData.get("gender") ?? "Female"),
    age: Math.min(99, Math.max(16, Number(formData.get("age") ?? 25) || 25)),
    heightCm: Math.min(220, Math.max(140, Number(formData.get("heightCm") ?? 175) || 175)),
    bodyType: String(formData.get("bodyType") ?? "Average"),
    skinTone: String(formData.get("skinTone") ?? "Medium"),
    hair: String(formData.get("hair") ?? "black").trim() || "black",
    background: String(formData.get("background") ?? "Studio"),
    style: String(formData.get("style") ?? "Brutalist editorial fashion photography"),
  };

  try {
    const resolved = await Promise.all(references.map((r) => resolveReference(r)));
    const results = await generateProductViews({
      product: productContextFromProduct(product),
      attributes,
      references: resolved,
      views,
    });

    const failed = results.filter((r) => !r.ok);
    return NextResponse.json({
      results,
      ok: failed.length === 0,
      error: failed.length ? "Bazı açılar üretilemedi — aşağıdaki ayrıntıya bakın." : null,
    });
  } catch (err) {
    if (err instanceof AiFashionError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("AI Fashion generate failed:", err);
    return NextResponse.json({ error: "Üretim sırasında beklenmeyen bir hata oluştu." }, { status: 500 });
  }
}
