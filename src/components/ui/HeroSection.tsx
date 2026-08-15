"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { heroImage } from "@/lib/data";

const CAMPAIGN_BAND =
  "The Final Drop — Secure the Archive — Campaign 001 — Free Shipping over €100";

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-img]",
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
      );
      gsap.fromTo(
        "[data-hero-text]",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.15,
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="w-full border-b border-on-surface mb-stack-lg overflow-hidden"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 min-h-[70vh]">
        <div className="col-span-1 md:col-span-5 flex flex-col justify-center px-margin-mobile md:px-margin-desktop py-stack-lg md:py-0 border-b md:border-b-0 md:border-r border-on-surface">
          <h1
            data-hero-text
            className="font-display-lg text-headline-lg-mobile md:text-display-lg uppercase mb-stack-sm text-on-surface"
          >
            The<br />
            Final<br />
            Drop.
          </h1>
          <p
            data-hero-text
            className="font-body-lg text-body-lg text-on-surface-variant mb-stack-md max-w-md"
          >
            Unapologetic streetwear. Brutalist design. This is your last chance
            to secure the archive.
          </p>
          <div data-hero-text className="flex gap-4">
            <Link
              href="/koleksiyonlar"
              className="group inline-flex items-center gap-3 bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-4 hover:bg-primary transition-colors duration-200 hover:-translate-y-1 active:translate-y-0 transform will-change-transform"
            >
              Shop Now
              <span className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                &#8599;
              </span>
            </Link>
          </div>
        </div>
        <div
          data-hero-img
          className="col-span-1 md:col-span-7 bg-surface-container relative overflow-hidden min-h-[50vh] md:min-h-full"
        >
          <Image
            src={heroImage}
            alt="LAST DANCE Campaign 001 — The Final Drop"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 58vw"
            className="object-cover object-center"
          />
          <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2">
            <span className="bg-on-surface/80 backdrop-blur-sm text-surface font-label-mono text-label-mono uppercase tracking-[0.3em] px-2 py-3 [writing-mode:vertical-rl]">
              Est. 2026 — The Archive
            </span>
          </div>
          <div className="absolute bottom-stack-md right-stack-md bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 uppercase">
            Campaign 001
          </div>
        </div>
      </div>
      <div className="bg-on-surface text-surface font-label-mono text-label-mono uppercase tracking-widest py-3 overflow-hidden border-t border-on-surface">
        <div className="flex w-max whitespace-nowrap animate-[marquee_32s_linear_infinite] hover:[animation-play-state:paused]">
          <span className="px-margin-mobile">{CAMPAIGN_BAND} &nbsp;&middot;&nbsp;</span>
          <span className="px-margin-mobile" aria-hidden="true">
            {CAMPAIGN_BAND} &nbsp;&middot;&nbsp;
          </span>
        </div>
      </div>
    </section>
  );
}
