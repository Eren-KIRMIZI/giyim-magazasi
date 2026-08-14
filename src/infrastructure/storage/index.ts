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
