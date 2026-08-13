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
}

export function cartItemKey(item: Pick<CartItem, "productId" | "size" | "color">) {
  return `${item.productId}::${item.size}::${item.color ?? ""}`;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
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
          set({
            items: get().items.map((i) =>
              cartItemKey(i) === cartItemKey(item)
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
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
            cartItemKey(i) === key ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    { name: "last-dance-cart" }
  )
);
