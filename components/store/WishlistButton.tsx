"use client";

import { useEffect, useState } from "react";
import { useWishlistStore, type WishlistItem } from "@/store/wishlist";

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  label?: string;
}

export default function WishlistButton({
  item,
  className = "",
  label,
}: WishlistButtonProps) {
  const has = useWishlistStore((s) => s.has(item.id));
  const toggle = useWishlistStore((s) => s.toggle);
  const [popping, setPopping] = useState(false);

  useEffect(() => {
    if (!popping) return;
    const t = setTimeout(() => setPopping(false), 250);
    return () => clearTimeout(t);
  }, [popping]);

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(item);
    setPopping(true);
  };

  return (
    <button
      type="button"
      aria-label={has ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={has}
      title={has ? "Favorilerden çıkar" : "Favorilere ekle"}
      onClick={handleToggle}
      className={`flex items-center justify-center transition-colors cursor-pointer ${className}`}
    >
      <span
        className={`material-symbols-outlined text-[24px] transition-all ${
          has
            ? "icon-fill text-primary animate-pop"
            : popping
              ? "animate-pop"
              : ""
        }`}
      >
        favorite
      </span>
      {label ? (
        <span className="font-label-mono text-label-mono uppercase">
          {has ? "Favorilerde" : label}
        </span>
      ) : null}
    </button>
  );
}
