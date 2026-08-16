// OpenRouter Image API istemcisi — google/gemini-2.5-flash-image (Nano Banana).
// Doküman: https://openrouter.ai/docs/guides/overview/multimodal/image-generation
//
// API anahtarı üçüncü taraf sohbet aracına yapıştırılmışsa mutlaka rotate edilmeli:
// https://openrouter.ai/settings/keys

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/images";
const OPENROUTER_MODEL = "google/gemini-2.5-flash-image";

export class OpenRouterImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OpenRouterImageError";
  }
}

export interface GenerateImageOptions {
  prompt: string;
  // input_references: https URL, yerel "/uploads/..." yolu veya data URL.
  references: string[];
}

interface OpenRouterImageResponse {
  data?: { b64_json?: string; media_type?: string }[];
}

export function getOpenRouterApiKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    throw new OpenRouterImageError(
      "OPENROUTER_API_KEY tanımlı değil. .env dosyasına ekleyin."
    );
  }
  return key;
}

export async function generateImage(
  options: GenerateImageOptions
): Promise<Buffer> {
  const body = {
    model: OPENROUTER_MODEL,
    prompt: options.prompt,
    aspect_ratio: "2:3",
    input_references: options.references.map((url) => ({
      type: "image_url",
      image_url: { url },
    })),
  };

  let res: Response;
  try {
    res = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getOpenRouterApiKey()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120_000),
    });
  } catch (err) {
    throw new OpenRouterImageError(
      `OpenRouter isteği başarısız: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new OpenRouterImageError(
      `OpenRouter hata (${res.status}): ${text.slice(0, 300)}`
    );
  }

  const json = (await res.json()) as OpenRouterImageResponse;
  const first = json.data?.[0];
  if (!first?.b64_json) {
    throw new OpenRouterImageError("OpenRouter görsel döndürmedi.");
  }

  return Buffer.from(first.b64_json, "base64");
}
