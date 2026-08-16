// Pollinations.ai Image API istemcisi — FLUX tabanlı, ücretsiz, token gerekmez.
// Doküman: https://pollinations.ai / https://image.pollinations.ai
//
// Sınırlamalar:
//  - Referans görsel (image-to-image) desteklenmez — sadece text-to-image
//  - Ticari kullanım: ücretsiz tier için "nologo=true" parametresi kullanılır
//  - Rate limit: belirli bir kota yok, ancak yoğun kullanımda yavaşlayabilir

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

export class PollinationsImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PollinationsImageError";
  }
}

export interface GenerateImageOptions {
  prompt: string;
  /** Referans görsel — Pollinations text-to-image'dır, bu parametre yoksayılır. */
  references?: string[];
  width?: number;
  height?: number;
  seed?: number;
}

export async function generateImage(
  options: GenerateImageOptions
): Promise<Buffer> {
  const {
    prompt,
    width = 768,
    height = 1024,
    seed = Math.floor(Math.random() * 999_999),
  } = options;

  const url = `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(120_000) });
  } catch (err) {
    throw new PollinationsImageError(
      `Pollinations isteği başarısız: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new PollinationsImageError(
      `Pollinations hata (${res.status}): ${text.slice(0, 300)}`
    );
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length < 5_000) {
    throw new PollinationsImageError(
      `Pollinations geçersiz yanıt döndürdü (${buffer.length} byte).`
    );
  }

  return buffer;
}
