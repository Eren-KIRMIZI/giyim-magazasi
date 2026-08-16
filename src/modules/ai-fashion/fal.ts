// fal.ai Image API istemcisi — fal-ai/flux/dev (FLUX.1 Dev, IP-Adapter destekli).
// Doküman: https://fal.ai/models/fal-ai/flux/dev
//
// Ortam değişkeni: FAL_KEY (fal.ai dashboard → API Keys)
// Kayıt: https://fal.ai — yeni hesaplara başlangıç kredisi verilir.

import * as falClient from "@fal-ai/client";

const FAL_MODEL = "fal-ai/flux/dev";

export class FalImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FalImageError";
  }
}

export interface GenerateImageOptions {
  prompt: string;
  /** Referans görsel: data URL veya https:// URL. FLUX IP-Adapter olarak kullanılır. */
  references: string[];
}

export function getFalApiKey(): string {
  const key = process.env.FAL_KEY;
  if (!key) {
    throw new FalImageError(
      "FAL_KEY tanımlı değil. .env dosyasına ekleyin: FAL_KEY=fal_..."
    );
  }
  return key;
}

export async function generateImage(
  options: GenerateImageOptions
): Promise<Buffer> {
  const key = getFalApiKey();

  falClient.fal.config({ credentials: key });

  // FLUX.1 Dev için input — referans görsel IP-Adapter ile giysi tutarlılığını sağlar.
  // image_url: ilk referans (kıyafet görseli) olarak kullanılır.
  const inputBase = {
    prompt: options.prompt,
    image_size: "portrait_4_3" as const, // 768×1024 — e-ticaret katalog formatı
    num_inference_steps: 28,
    guidance_scale: 3.5,
    num_images: 1,
    enable_safety_checker: true,
  };

  // İlk referans görseli IP-Adapter'a bağla (varsa)
  const input =
    options.references.length > 0
      ? { ...inputBase, image_url: options.references[0], strength: 0.85 }
      : inputBase;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: Awaited<ReturnType<typeof falClient.fal.subscribe>>;
  try {
    result = await (falClient.fal.subscribe as (model: string, opts: { input: unknown }) => Promise<unknown>)(
      FAL_MODEL,
      { input }
    ) as Awaited<ReturnType<typeof falClient.fal.subscribe>>;
  } catch (err) {
    throw new FalImageError(
      `fal.ai isteği başarısız: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  // Yanıt tipi: { images: [{ url, width, height, content_type }], ... }
  const data = result.data as {
    images?: { url: string; content_type?: string }[];
  };

  const firstImage = data?.images?.[0];
  if (!firstImage?.url) {
    throw new FalImageError(
      `fal.ai görsel döndürmedi. Yanıt: ${JSON.stringify(data).slice(0, 300)}`
    );
  }

  // fal.ai, üretilen görseli CDN'de barındırır — indir ve Buffer'a çevir
  let imgRes: Response;
  try {
    imgRes = await fetch(firstImage.url, {
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    throw new FalImageError(
      `Üretilen görsel indirilemedi: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!imgRes.ok) {
    throw new FalImageError(
      `Görsel CDN hatası: HTTP ${imgRes.status}`
    );
  }

  return Buffer.from(await imgRes.arrayBuffer());
}
