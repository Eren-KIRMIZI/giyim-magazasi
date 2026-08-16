// AI Fashion Studio — tipler ve seçenek listeleri.
// OpenRouter üzerinden google/gemini-2.5-flash-image (Nano Banana) kullanır.

export const AI_VIEWS = [
  { id: "front", label: "Ön", angle: "front" },
  { id: "left", label: "Sol", angle: "left side" },
  { id: "right", label: "Sağ", angle: "right side" },
  { id: "back", label: "Arka", angle: "back" },
] as const;

export type AIView = (typeof AI_VIEWS)[number]["id"];

export const AI_VIEW_LABELS: Record<AIView, string> = {
  front: "Ön",
  left: "Sol",
  right: "Sağ",
  back: "Arka",
};

export const AI_GENDERS = ["Male", "Female", "Non-binary"] as const;

export const AI_BODY_TYPES = [
  "Slim",
  "Athletic",
  "Average",
  "Curvy",
  "Tall",
] as const;

export const AI_SKIN_TONES = [
  "Fair",
  "Light",
  "Medium",
  "Tan",
  "Deep",
] as const;

export const AI_BACKGROUNDS = [
  { id: "Studio", label: "Studio" },
  { id: "White", label: "Beyaz" },
  { id: "Dark", label: "Koyu" },
  { id: "Editorial", label: "Editorial" },
] as const;

export const AI_STYLES = [
  { id: "Brutalist editorial fashion photography", label: "Brutalist editorial" },
  { id: "High-fashion lookbook", label: "High-fashion lookbook" },
  { id: "Minimalist studio", label: "Minimalist studio" },
  { id: "Streetwear campaign", label: "Streetwear campaign" },
] as const;

export interface ProductContext {
  id: string;
  name: string;
  objectNumber: string | null;
  campaign: string | null;
  material: string | null;
  weight: string | null;
  fit: string | null;
  description: string;
}

export interface ModelAttributes {
  gender: string;
  age: number;
  heightCm: number;
  bodyType: string;
  skinTone: string;
  hair: string;
  background: string;
  style: string;
}

export interface GeneratedView {
  view: AIView;
  ok: boolean;
  url?: string;
  error?: string;
}

export interface AIStudioProduct {
  id: string;
  name: string;
  slug: string;
  objectNumber: string | null;
  campaign: string | null;
  material: string | null;
  weight: string | null;
  fit: string | null;
  description: string;
  images: { url: string; alt: string | null }[];
}
