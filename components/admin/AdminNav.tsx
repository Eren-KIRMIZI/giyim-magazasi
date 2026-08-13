"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/urunler", label: "Ürünler" },
  { href: "/admin/siparisler", label: "Siparişler" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      <div className="flex md:flex-col gap-1 border border-on-surface p-2">
        {LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex-1 md:flex-none px-4 py-3 font-headline-md text-headline-md uppercase transition-colors ${
                active
                  ? "bg-on-surface text-surface"
                  : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
