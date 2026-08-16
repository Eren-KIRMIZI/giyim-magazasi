// AI Fashion Studio servisi — referans çözümleme, görsel üretimi, disk + DB kaydı.
//
// Sağlayıcı seçimi: AI_PROVIDER env değişkeniyle belirlenir.
//   AI_PROVIDER=fal        → fal.ai + FLUX.1 Dev  (varsayılan)
//   AI_PROVIDER=openrouter → OpenRouter + Gemini 2.5 Flash Image

import { randomBytes } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/infrastructure/prisma";
import { buildPrompt } from "./prompts";
import { generateImage as generateImageFal } from "./fal";
import { generateImage as generateImageOpenRouter } from "./openrouter";
import { generateImage as generateImagePollinations } from "./pollinations";
import {
  AI_VIEWS,
  type AIStudioProduct,
  type AIView,
  type GeneratedView,
  type ModelAttributes,
  type ProductContext,
} from "./types";

const MAX_REF_SIZE = 5 * 1024 * 1024; // 5MB

/** Aktif sağlayıcıya göre görsel üretir. AI_PROVIDER=fal|openrouter|pollinations */
function generateImage(
  options: Parameters<typeof generateImageFal>[0]
): Promise<Buffer> {
  const provider = (process.env.AI_PROVIDER ?? "fal").toLowerCase();
  if (provider === "openrouter") return generateImageOpenRouter(options);
  if (provider === "pollinations") return generateImagePollinations(options);
  return generateImageFal(options);
}

function isPng(buffer: Buffer): boolean {
  return buffer.length > 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
}

function isJpeg(buffer: Buffer): boolean {
  return buffer.length > 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]));
}

function extensionFor(buffer: Buffer): string {
  if (isJpeg(buffer)) return "jpg";
  return "png";
}

function toDataUrl(buffer: Buffer): string {
  const mime = isJpeg(buffer) ? "image/jpeg" : "image/png";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

export class AiFashionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiFashionError";
  }
}

// Yerel yol, uzak URL veya data URL → data URL. Sadece görsel olduğunu doğrular.
export async function resolveReference(raw: string): Promise<string> {
  const value = raw.trim();
  if (!value) throw new AiFashionError("Referans görsel boş.");

  if (value.startsWith("data:image/")) {
    const comma = value.indexOf(",");
    const meta = comma >= 0 ? value.slice(0, comma) : "";
    if (!/;base64/.test(meta)) throw new AiFashionError("Referans base64 olmalı.");
    const size = Buffer.byteLength(value.slice(comma + 1), "base64");
    if (size > MAX_REF_SIZE) throw new AiFashionError("Referans görsel 5MB'dan büyük.");
    return value;
  }

  let buffer: Buffer;
  if (/^https?:\/\//.test(value)) {
    const res = await fetch(value, { signal: AbortSignal.timeout(30_000) });
    if (!res.ok) throw new AiFashionError(`Referans indirilemedi (${res.status}).`);
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    const safe = value.replace(/^\/+/, "");
    const filePath = path.join(process.cwd(), "public", safe);
    try {
      buffer = await readFile(filePath);
    } catch {
      throw new AiFashionError("Referans dosyası bulunamadı.");
    }
  }

  if (buffer.length === 0) throw new AiFashionError("Referans görsel boş.");
  if (buffer.length > MAX_REF_SIZE) throw new AiFashionError("Referans görsel 5MB'dan büyük.");
  if (!isPng(buffer) && !isJpeg(buffer)) {
    throw new AiFashionError("Referans görsel PNG/JPEG değil.");
  }

  return toDataUrl(buffer);
}

export function productContextFromProduct(p: {
  id: string;
  name: string;
  objectNumber: string | null;
  campaign: string | null;
  material: string | null;
  weight: string | null;
  fit: string | null;
  description: string;
}): ProductContext {
  return {
    id: p.id,
    name: p.name,
    objectNumber: p.objectNumber,
    campaign: p.campaign,
    material: p.material,
    weight: p.weight,
    fit: p.fit,
    description: p.description,
  };
}

async function saveGeneratedFile(
  buffer: Buffer,
  slug: string,
  view: AIView
): Promise<string> {
  const ext = extensionFor(buffer);
  const filename = `${slug}-${view}-${Date.now()}-${randomBytes(3).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "ai");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/ai/${filename}`;
}

export async function generateProductViews(opts: {
  product: ProductContext;
  attributes: ModelAttributes;
  references: string[]; // data URL'ler (en fazla 3)
  views: AIView[];
  customPrompt?: string; // varsa buildPrompt() yerine kullanılır
}): Promise<GeneratedView[]> {
  const refs = opts.references.slice(0, 3);
  if (refs.length === 0) {
    throw new AiFashionError("En az bir referans görsel (kıyafet) gerekli.");
  }

  const settled = await Promise.allSettled(
    opts.views.map(async (view) => {
      const prompt =
        opts.customPrompt?.trim() || buildPrompt(opts.product, opts.attributes, view);
      const buffer = await generateImage({ prompt, references: refs });
      const url = await saveGeneratedFile(buffer, opts.product.id, view);
      return { view, url };
    })
  );

  return settled.map((result, i) => {
    const view = opts.views[i];
    if (result.status === "fulfilled") {
      return { view, ok: true, url: result.value.url };
    }
    const reason = result.reason;
    return {
      view,
      ok: false,
      error: reason instanceof Error ? reason.message : String(reason),
    };
  });
}


export async function getAIStudioProducts(): Promise<AIStudioProduct[]> {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      objectNumber: true,
      campaign: true,
      material: true,
      weight: true,
      fit: true,
      description: true,
      images: {
        orderBy: { position: "asc" },
        select: { url: true, alt: true },
      },
    },
  });
  return products;
}

export async function saveGeneratedImages(
  productId: string,
  images: { url: string; alt: string | null }[]
): Promise<{ count: number }> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });
  if (!product) throw new AiFashionError("Ürün bulunamadı.");
  if (images.length === 0) throw new AiFashionError("Kaydedilecek görsel yok.");

  const max = await prisma.productImage.aggregate({
    where: { productId },
    _max: { position: true },
  });
  const start = (max._max.position ?? -1) + 1;

  const created = await prisma.productImage.createMany({
    data: images.map((img, i) => ({
      productId,
      url: img.url,
      alt: img.alt,
      position: start + i,
    })),
  });

  return { count: created.count };
}

export { AI_VIEWS };
