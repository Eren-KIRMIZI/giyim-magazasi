"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart";
import { brandLogo } from "@/lib/data";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/#yeni-gelenler" },
  { label: "Collections", href: "/koleksiyonlar" },
  { label: "Accessories", href: "/koleksiyonlar" },
  { label: "Archive", href: "/koleksiyonlar" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((n, item) => n + item.quantity, 0)
  );
  const { data: session, status } = useSession();
  const userName =
    session?.user?.name?.split(" ")[0] ?? session?.user?.email?.split("@")[0] ?? "";

  return (
    <nav className="bg-surface dark:bg-surface w-full top-0 sticky z-50 border-b border-on-surface dark:border-outline">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-stack-sm max-w-container-max mx-auto">
        <Link
          href="/"
          className="font-headline-md text-headline-md uppercase text-on-surface dark:text-inverse-on-surface tracking-tighter flex items-center gap-2 hover:scale-95 transition-transform duration-150"
        >
          <Image
            alt="LAST DANCE Logo"
            src={brandLogo}
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          LAST DANCE
        </Link>

        <div className="hidden md:flex items-center gap-stack-md font-headline-md text-headline-md uppercase">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={
                i === 0
                  ? "text-primary dark:text-primary-fixed-dim border-b-2 border-primary pb-1 transition-all duration-150"
                  : "text-on-surface dark:text-on-surface-variant hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-150"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-stack-sm text-primary dark:text-primary-fixed-dim">
          <button
            aria-label="Search"
            className="hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-150 p-2"
          >
            <span className="material-symbols-outlined">search</span>
          </button>
          {status === "authenticated" ? (
            <div className="hidden md:flex items-center gap-stack-sm">
              <Link
                href="/hesabim"
                className="font-label-mono text-label-mono uppercase text-on-surface dark:text-on-surface-variant hover:text-primary transition-colors"
              >
                {userName}
              </Link>
              <button
                type="button"
                aria-label="Sign Out"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-150 p-2"
                title="Çıkış"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/giris"
              aria-label="Profile"
              className="hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-150 p-2 hidden md:block"
            >
              <span className="material-symbols-outlined">person</span>
            </Link>
          )}
          <Link
            href="/sepet"
            aria-label="Shopping Bag"
            id="cart-icon"
            className="relative hover:text-primary dark:hover:text-primary-fixed-dim transition-all duration-150 p-2"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary font-label-mono text-label-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            aria-label="Menu"
            className="md:hidden hover:text-primary transition-colors duration-150 p-2"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="material-symbols-outlined">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-on-surface bg-surface">
          <div className="flex flex-col px-margin-mobile py-stack-md gap-stack-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
