"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/modules/cart";
import {
  pullServerCart,
  pushServerCart,
  mergeCartItems,
} from "@/modules/cart";

export default function CartSync() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id ?? null;
  const items = useCartStore((s) => s.items);
  const setItems = useCartStore((s) => s.setItems);
  const lastUserId = useRef<string | null>(null);
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;
    if (lastUserId.current === userId) return;

    let cancelled = false;

    const syncFromServer = async () => {
      lastUserId.current = userId;
      const serverItems = await pullServerCart();
      if (cancelled || serverItems.length === 0) return;
      const merged = mergeCartItems(itemsRef.current, serverItems);
      setItems(merged);
      pushServerCart(merged);
    };

    syncFromServer();
    return () => {
      cancelled = true;
    };
  }, [status, userId, setItems]);

  useEffect(() => {
    if (status !== "authenticated" || !userId) return;
    if (lastUserId.current !== userId) return;
    const timer = setTimeout(() => {
      pushServerCart(items);
    }, 800);
    return () => clearTimeout(timer);
  }, [items, status, userId]);

  return null;
}
