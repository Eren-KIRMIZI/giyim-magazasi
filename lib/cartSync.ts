import type { CartItem } from "@/store/cart";
import { cartItemKey } from "@/store/cart";

export async function pullServerCart(): Promise<CartItem[]> {
  try {
    const res = await fetch("/api/cart/sync", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

export async function pushServerCart(items: CartItem[]): Promise<boolean> {
  try {
    const res = await fetch("/api/cart/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function mergeCartItems(
  local: CartItem[],
  server: CartItem[]
): CartItem[] {
  const merged = new Map<string, CartItem>();

  for (const item of server) {
    merged.set(cartItemKey(item), item);
  }
  for (const item of local) {
    const key = cartItemKey(item);
    const existing = merged.get(key);
    merged.set(key, {
      ...item,
      quantity: existing
        ? Math.max(existing.quantity, item.quantity)
        : item.quantity,
    });
  }
  return Array.from(merged.values());
}
