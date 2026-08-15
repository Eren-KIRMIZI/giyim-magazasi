"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg flex flex-col items-center gap-stack-lg text-center">
      <div className="border border-on-surface w-full flex flex-col items-center gap-stack-md px-stack-md py-stack-lg">
        <span className="font-label-mono text-label-mono uppercase text-error">
          Something went wrong
        </span>
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg uppercase leading-none">
          Internal Error
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          Bir şeyler ters gitti. Tekrar dene, sorun devam ederse bize ulaş.
        </p>
        <button
          type="button"
          onClick={retry}
          className="inline-block bg-on-surface text-surface font-headline-md text-headline-md uppercase py-4 px-8 hover:bg-primary hover:text-on-primary transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
