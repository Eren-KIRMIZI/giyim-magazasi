"use client";

import gsap from "gsap";

export function flyToCart(sourceEl: HTMLElement | null) {
  if (!sourceEl) return;

  const target = document.getElementById("cart-icon");
  if (!target) return;

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  const clone = sourceEl.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = `${sourceRect.left}px`;
  clone.style.top = `${sourceRect.top}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.margin = "0";
  clone.style.padding = "0";
  clone.style.pointerEvents = "none";
  clone.style.zIndex = "9999";
  clone.style.borderRadius = "0";
  document.body.appendChild(clone);

  gsap.to(clone, {
    left: targetRect.left,
    top: targetRect.top,
    width: 28,
    height: 28,
    opacity: 0.3,
    rotate: 8,
    duration: 0.75,
    ease: "power3.in",
    onComplete: () => clone.remove(),
  });

  gsap.fromTo(
    target,
    { scale: 1.35, rotate: -6 },
    { scale: 1, rotate: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" }
  );
}
