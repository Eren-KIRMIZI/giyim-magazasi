import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Newsletter", href: "/newsletter" },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-on-surface dark:bg-surface-container-lowest w-full mt-stack-lg border-t border-on-surface">
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop py-stack-lg gap-gutter max-w-container-max mx-auto">
        <div className="flex flex-col gap-stack-sm w-full md:w-auto">
          <span className="font-headline-md text-headline-md text-surface dark:text-on-surface uppercase tracking-tighter">
            LAST DANCE
          </span>
          <span className="font-label-mono text-label-mono uppercase text-surface-variant dark:text-on-surface-variant">
            © {new Date().getFullYear()} LAST DANCE. ALL RIGHTS RESERVED.
          </span>
        </div>
        <div className="flex flex-wrap md:flex-nowrap gap-stack-md font-label-mono text-label-mono uppercase w-full md:w-auto mt-stack-md md:mt-0">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="link-sweep text-surface-variant dark:text-on-surface-variant hover:text-surface dark:hover:text-on-surface transition-colors duration-200 opacity-80 hover:opacity-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
