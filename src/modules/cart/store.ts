"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color?: string;
  quantity: number;
  maxQuantity?: number;
}

export function cartItemKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}::${item.size}::${item.color ?? ""}`;
}

function clampQty(quantity: number, maxQuantity?: number) {
  if (maxQuantity != null && maxQuantity > 0) {
    return Math.min(quantity, maxQuantity);
  }
  return quantity;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { maxQuantity?: number }) => void;
  removeItem: (productId: string, size: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    size: string,
    quantity: number,
    color?: string
  ) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => cartItemKey(i) === cartItemKey(item)
        );
        if (existing) {
          const maxQuantity = Math.max(
            existing.maxQuantity ?? 0,
            item.maxQuantity ?? 0
          );
          set({
            items: get().items.map((i) =>
              cartItemKey(i) === cartItemKey(item)
                ? {
                    ...i,
                    quantity: clampQty(i.quantity + 1, maxQuantity),
                    maxQuantity: maxQuantity || undefined,
                  }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...get().items,
              { ...item, quantity: 1, maxQuantity: item.maxQuantity },
            ],
          });
        }
      },
      removeItem: (productId, size, color) => {
        set({
          items: get().items.filter(
            (i) =>
              cartItemKey(i) !== cartItemKey({ productId, size, color })
          ),
        });
      },
      updateQuantity: (productId, size, quantity, color) => {
        const key = cartItemKey({ productId, size, color });
        if (quantity <= 0) {
          set({
            items: get().items.filter((i) => cartItemKey(i) !== key),
          });
          return;
        }
        set({
          items: get().items.map((i) =>
            cartItemKey(i) === key
              ? { ...i, quantity: clampQty(quantity, i.maxQuantity) }
              : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    { name: "last-dance-cart" }
  )
);
