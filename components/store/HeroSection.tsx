"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { heroImage } from "@/lib/data";

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
              className="inline-block bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-4 hover:bg-primary transition-colors duration-200 hover:-translate-y-1 transform"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div
          data-hero-img
          className="col-span-1 md:col-span-7 bg-surface-container relative overflow-hidden min-h-[50vh] md:min-h-full"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute bottom-stack-md right-stack-md bg-on-surface text-surface font-label-mono text-label-mono px-3 py-1 uppercase">
            Campaign 001
          </div>
        </div>
      </div>
    </section>
  );
}
