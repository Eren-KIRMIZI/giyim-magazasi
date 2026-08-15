import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col items-center gap-stack-lg text-center">
      <div className="border border-on-surface w-full flex flex-col items-center gap-stack-md px-stack-md py-stack-lg">
        <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
          Error 404
        </span>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase leading-none">
          Page Not Found
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          Bu adreste arşivden bir parça yok. Aramayı değiştir ya da koleksiyona
          dön.
        </p>
        <Link
          href="/"
          className="inline-block bg-on-surface text-surface font-headline-md text-headline-md uppercase py-4 px-8 hover:bg-primary hover:text-on-primary transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
