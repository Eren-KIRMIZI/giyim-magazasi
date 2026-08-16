// Central shop configuration — single source of truth for customer-facing
// thresholds and catalog filter options shared across server and client.

export const CURRENCY = "EUR";

// Subtotal üzerinden global "free shipping" eşiği (sepet, header, hero).
export const FREE_SHIPPING_THRESHOLD = 100;

export interface ShippingTier {
  region: string;
  time: string;
  cost: string;
}

// Bölgesel kargo tablosu — ücretsiz kargo eşikleri FREE_SHIPPING_THRESHOLD'a
// bağlanır; böylece sepet/header/hero ile shipping sayfası çelişmez.
export const SHIPPING_TIERS: ShippingTier[] = [
  {
    region: "Domestic (TR)",
    time: "1–3 iş günü",
    cost: `€8 — ${FREE_SHIPPING_THRESHOLD}€ üzeri ücretsiz`,
  },
  {
    region: "Europe",
    time: "3–6 iş günü",
    cost: `€12 — ${FREE_SHIPPING_THRESHOLD}€ üzeri ücretsiz`,
  },
  {
    region: "Rest of World",
    time: "6–12 iş günü",
    cost: "€20",
  },
];

// Katalogda filtrelenebilir bedenler — koleksiyon ve arama sayfaları bunu kullanır.
export const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL", "39", "40", "41", "42", "43", "44"];

// Renk adı → hex eşlemesi; hem sunucu (queries) hem istemci (filtreler) kullanır.
export const COLOR_HEX: Record<string, string> = {
  Black: "#1b1c1c",
  White: "#faf9f9",
  Red: "#dc2626",
};

export const FILTER_COLORS: { name: string; hex: string }[] = Object.entries(
  COLOR_HEX
).map(([name, hex]) => ({ name, hex }));
