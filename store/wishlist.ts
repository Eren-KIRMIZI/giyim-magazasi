"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
  imageAlt?: string;
  badge?: string;
}

interface WishlistState {
  items: WishlistItem[];
  toggle: (item: WishlistItem) => void;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (item) => {
        const exists = get().items.some((i) => i.id === item.id);
        set({
          items: exists
            ? get().items.filter((i) => i.id !== item.id)
            : [...get().items, item],
        });
      },
      remove: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "last-dance-wishlist" }
  )
);
