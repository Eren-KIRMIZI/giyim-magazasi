"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 40,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          delay,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay, y, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
