"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/modules/cart";
import { useWishlistStore } from "@/modules/wishlist";
import { brandLogo } from "@/lib/data";
import { Icon } from "@/components/icons";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/#yeni-gelenler" },
  { label: "Collections", href: "/koleksiyonlar" },
  { label: "Newsletter", href: "/newsletter" },
];

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

  return (
    <header className="relative">
      <div className="bg-primary text-on-primary font-label-mono text-label-mono uppercase tracking-widest py-2 text-center px-margin-mobile">
        The Final Drop — Free shipping over €100 &middot; While objects last
      </div>
      <nav className="bg-surface/90 backdrop-blur-md w-full top-0 sticky z-50 border-b border-on-surface">
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
            <Link
              href="/search"
              aria-label="Search"
              className="hover:text-on-surface transition-colors duration-150 p-2"
            >
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
                  className="hover:text-on-surface transition-colors duration-150 p-2"
                  title="Çıkış"
                >
                  <Icon name="logout" className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <Link
                href="/giris"
                aria-label="Profile"
                className="hover:text-on-surface transition-colors duration-150 p-2 hidden md:block"
              >
                <Icon name="person" className="w-6 h-6" />
              </Link>
            )}
            <Link
              href="/begendiklerim"
              aria-label="Wishlist"
              className="relative hover:text-on-surface transition-colors duration-150 p-2 hidden md:block"
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
              className="relative hover:text-on-surface transition-colors duration-150 p-2"
            >
              <Icon name="shopping_bag" className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-on-primary font-label-mono text-label-mono px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              aria-label="Menu"
              className="md:hidden hover:text-on-surface transition-colors duration-150 p-2"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <Icon name={menuOpen ? "close" : "menu"} className="w-6 h-6" />
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
                  className={`font-headline-md text-headline-md uppercase transition-colors ${
                    isActive(link.href)
                      ? "text-primary"
                      : "text-on-surface hover:text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-stack-md mt-stack-sm">
                <Link
                  href="/search"
                  onClick={() => setMenuOpen(false)}
                  className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="search" className="w-[22px] h-[22px]" />
                  Search
                </Link>
                <Link
                  href="/begendiklerim"
                  onClick={() => setMenuOpen(false)}
                  className="font-headline-md text-headline-md uppercase text-on-surface hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Icon name="favorite" className="w-[22px] h-[22px]" />
                  Wishlist
                  {wishlistCount > 0 && ` (${wishlistCount})`}
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
