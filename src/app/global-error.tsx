"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html>
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
            textAlign: "center",
            padding: "1.5rem",
            background: "var(--color-surface, #faf9f9)",
            color: "var(--color-on-surface, #1b1c1c)",
            fontFamily: "var(--font-geist, ui-monospace, monospace)",
          }}
        >
          <div style={{ fontSize: "0.8rem", textTransform: "uppercase" }}>
            Something went wrong
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 700, margin: 0 }}>
            Internal Error
          </h1>
          <button
            type="button"
            onClick={retry}
            style={{
              background: "var(--color-on-surface, #1b1c1c)",
              color: "var(--color-surface, #faf9f9)",
              border: "none",
              padding: "1rem 2rem",
              fontFamily: "inherit",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
