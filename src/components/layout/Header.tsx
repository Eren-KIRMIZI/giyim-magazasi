"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/modules/cart";
import { useWishlistStore } from "@/modules/wishlist";
import { brandLogo } from "@/lib/data";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/config";
import { Icon } from "@/components/icons";
import ThemeToggle from "@/components/ui/ThemeToggle";

const NAV_LINKS = [
  { label: "NEW ARRIVALS", href: "/#yeni-gelenler" },
  { label: "COLLECTIONS", href: "/koleksiyonlar" },
  { label: "NEWSLETTER", href: "/newsletter" },
];

const ANNOUNCEMENT = `The Final Drop — Free shipping over €${FREE_SHIPPING_THRESHOLD} · While objects last`;

const ICON_BTN =
  "p-2 rounded-sm transition-all duration-200 hover:bg-surface-container hover:text-primary active:scale-95";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const itemCount = useCartStore((s) =>
    s.items.reduce((n, item) => n + item.quantity, 0)
  );
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { data: session, status } = useSession();
  const userName =
    session?.user?.name?.split(" ")[0] ?? session?.user?.email?.split("@")[0] ?? "";

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/";
    return pathname.startsWith(href);
  };

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="relative">
      <div className="bg-primary text-on-primary font-label-mono text-label-mono uppercase tracking-widest py-2 overflow-hidden">
        <div className="flex w-max whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
          <span className="px-margin-mobile">{ANNOUNCEMENT} &nbsp;&middot;&nbsp;</span>
          <span className="px-margin-mobile" aria-hidden="true">
            {ANNOUNCEMENT} &nbsp;&middot;&nbsp;
          </span>
        </div>
      </div>
      <nav aria-label="Main Navigation" className="bg-surface/90 backdrop-blur-md w-full top-0 sticky z-50 border-b border-on-surface">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-2.5 max-w-container-max mx-auto">
          <Link
            href="/"
            className="font-headline-md text-headline-md uppercase text-on-surface tracking-tighter flex items-center gap-2 hover:scale-95 transition-transform duration-150"
          >
            <Image
              alt="LAST DANCE Logo"
              src={brandLogo}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            LAST DANCE
          </Link>

          <div className="hidden md:flex items-center gap-stack-md font-headline-md text-headline-md uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`border-b-[3px] pb-1 transition-colors duration-150 ${
                  isActive(link.href)
                    ? "text-primary border-primary"
                    : "text-on-surface border-transparent hover:text-primary hover:border-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-stack-sm text-primary">
            <Link href="/search" aria-label="Search" className={ICON_BTN}>
              <Icon name="search" className="w-6 h-6" />
            </Link>
            {status === "authenticated" ? (
              <div className="hidden md:flex items-center gap-stack-sm">
                {session?.user?.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="font-label-mono text-label-mono uppercase text-primary hover:text-on-surface transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/hesabim"
                  className="font-label-mono text-label-mono uppercase text-on-surface hover:text-primary transition-colors"
                >
                  {userName}
                </Link>
                <button
                  type="button"
                  aria-label="Sign Out"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={ICON_BTN}
                  title="Çıkış"
                >
                  <Icon name="logout" className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                aria-label="Profile"
                className={`${ICON_BTN} hidden md:block`}
              >
                <Icon name="person" className="w-6 h-6" />
              </Link>
            )}
            <Link
              href="/begendiklerim"
              aria-label="Wishlist"
              className={`${ICON_BTN} relative hidden md:block`}
            >
              <Icon name="favorite" className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary font-label-mono text-label-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/sepet"
              aria-label="Shopping Bag"
              id="cart-icon"
              className={`${ICON_BTN} relative`}
            >
              <Icon name="shopping_bag" className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary font-label-mono text-label-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
            <button
              aria-label="Menu"
              className={`${ICON_BTN} md:hidden`}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          className={`md:hidden fixed inset-0 z-40 bg-surface flex flex-col transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <nav className="flex flex-col gap-5 px-margin-mobile py-stack-lg pt-28 overflow-y-auto flex-1">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${120 + i * 70}ms` : "0ms" }}
                className={`font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase tracking-tight transition-all duration-500 ease-out ${
                  menuOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                } ${isActive(link.href) ? "text-primary" : "text-on-surface"}`}
              >
                {link.label}
              </Link>
            ))}
            <div
              style={{ transitionDelay: menuOpen ? `${120 + NAV_LINKS.length * 70}ms` : "0ms" }}
              className={`flex items-center gap-stack-md mt-stack-sm transition-all duration-500 ease-out ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <Link
                href="/search"
                onClick={() => setMenuOpen(false)}
                className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors flex items-center gap-2"
              >
                <Icon name="search" className="w-[22px] h-[22px]" />
                SEARCH
              </Link>
              <Link
                href="/begendiklerim"
                onClick={() => setMenuOpen(false)}
                className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors flex items-center gap-2"
              >
                <Icon name="favorite" className="w-[22px] h-[22px]" />
                WISHLIST
                {wishlistCount > 0 && ` (${wishlistCount})`}
              </Link>
              {status === "authenticated" ? (
                <Link
                  href="/hesabim"
                  onClick={() => setMenuOpen(false)}
                  className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="person" className="w-[22px] h-[22px]" />
                  {userName || "Hesabım"}
                </Link>
              ) : (
                <Link
                  href="/giris"
                  onClick={() => setMenuOpen(false)}
                  className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="person" className="w-[22px] h-[22px]" />
                  LOGIN
                </Link>
              )}
            </div>
            <div
              style={{ transitionDelay: menuOpen ? `${180 + NAV_LINKS.length * 70}ms` : "0ms" }}
              className={`border-t border-on-surface pt-stack-sm mt-stack-sm flex items-center justify-between transition-all duration-500 ease-out ${
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                THEME
              </span>
              <ThemeToggle />
            </div>
            <p
              className={`font-label-mono text-label-mono uppercase text-on-surface-variant mt-auto pt-stack-lg transition-opacity duration-500 ${
                menuOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              LAST DANCE — Official Store
            </p>
          </nav>
        </div>
      </nav>
    </header>
  );
}
