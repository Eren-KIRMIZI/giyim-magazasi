"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  price: number;
  image: string;
  imageAlt?: string;
  badge?: string;
}

const MAX_ITEMS = 8;

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  add: (item: RecentlyViewedItem) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const filtered = get().items.filter((i) => i.id !== item.id);
        set({
          items: [item, ...filtered].slice(0, MAX_ITEMS),
        });
      },
    }),
    { name: "last-dance-recently-viewed" }
  )
);
