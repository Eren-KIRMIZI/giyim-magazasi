// Prompt builder — ürünün DB bilgilerini ve model özelliklerini Gemini'ye taşır.

import type { AIView, ModelAttributes, ProductContext } from "./types";

const VIEW_ANGLE: Record<AIView, string> = {
  front: "front",
  left: "left side (90 degrees)",
  right: "right side (90 degrees)",
  back: "back",
};

export function buildPrompt(
  product: ProductContext,
  attributes: ModelAttributes,
  view: AIView
): string {
  const detailLines = [
    product.objectNumber ? `Object number: ${product.objectNumber}.` : "",
    product.campaign ? `Campaign: ${product.campaign}.` : "",
    product.material ? `Material: ${product.material}.` : "",
    product.weight ? `Fabric weight: ${product.weight}.` : "",
    product.fit ? `Fit: ${product.fit}.` : "",
    product.description ? `Design notes: ${product.description}` : "",
  ].filter(Boolean);

  return [
    "Professional e-commerce fashion photograph, full body shot, sharp focus, high detail.",
    `Garment: "${product.name}". ${detailLines.join(" ")}`,
    `Model: ${attributes.gender}, ${attributes.age} years old, ${attributes.heightCm} cm tall, ${attributes.bodyType} build, ${attributes.skinTone} skin tone, ${attributes.hair} hair.`,
    `View: model photographed from the ${VIEW_ANGLE[view]}, whole body visible.`,
    `Background: ${attributes.background} backdrop, clean.`,
    `Style: ${attributes.style}, dramatic natural lighting, editorial photography.`,
    "Requirements: keep the garment design, cut, color, graphics and proportions identical to the reference. The same person, same face, same hairstyle, same body type in every image. No extra text or logos on the image unless they exist on the garment. Realistic proportions, photorealistic.",
  ].join(" ");
}
