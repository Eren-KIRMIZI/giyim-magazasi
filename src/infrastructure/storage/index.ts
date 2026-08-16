import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

function hasSignature(buffer: Buffer, sig: number[], offset = 0): boolean {
  if (buffer.length < offset + sig.length) return false;
  return sig.every((byte, i) => buffer[offset + i] === byte);
}

function matchesImageSignature(buffer: Buffer, ext: string): boolean {
  switch (ext) {
    case "jpg":
      return hasSignature(buffer, [0xff, 0xd8, 0xff]);
    case "png":
      return hasSignature(buffer, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "gif":
      return hasSignature(buffer, [0x47, 0x49, 0x46, 0x38]); // "GIF8"
    case "webp":
      // "RIFF".... "WEBP"
      return (
        hasSignature(buffer, [0x52, 0x49, 0x46, 0x46]) &&
        hasSignature(buffer, [0x57, 0x45, 0x42, 0x50], 8)
      );
    case "avif":
      // "....ftypavif/avis"
      return (
        hasSignature(buffer, [0x66, 0x74, 0x79, 0x70], 4) &&
        (hasSignature(buffer, [0x61, 0x76, 0x69, 0x66], 8) || // "avif"
          hasSignature(buffer, [0x61, 0x76, 0x69, 0x73], 8)) // "avis"
      );
    default:
      return false;
  }
}

export type SaveImageResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

export async function saveProductImage(file: File): Promise<SaveImageResult> {
  const ext = EXT_BY_MIME[file.type];
  if (!ext) {
    return {
      ok: false,
      error: "Desteklenmeyen dosya türü. (jpeg, png, webp, gif, avif)",
    };
  }

  if (file.size > MAX_SIZE) {
    return { ok: false, error: "Dosya en fazla 5MB olabilir." };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!matchesImageSignature(buffer, ext)) {
    return {
      ok: false,
      error: "Dosya içeriği görsel türüyle eşleşmiyor.",
    };
  }

  const filename = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads", "products");

  try {
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
  } catch (err) {
    console.error("Upload failed:", err);
    return { ok: false, error: "Dosya kaydedilemedi." };
  }

  return { ok: true, url: `/uploads/products/${filename}` };
}
