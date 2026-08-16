"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "@/components/icons";

type Tone = "on-dark" | "on-light";
type Status = "idle" | "loading" | "error";

export default function NewsletterForm({
  tone = "on-light",
  className = "",
}: {
  tone?: Tone;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Subscription failed.");
      setSubscribed(true);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  };

  if (subscribed) {
    return (
      <p
        className={`font-label-mono text-label-mono uppercase tracking-widest ${
          tone === "on-dark"
            ? "text-primary-fixed-dim"
            : "text-primary"
        } ${className}`}
      >
        Access granted — you&apos;re on the list.
      </p>
    );
  }

  if (tone === "on-dark") {
    return (
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col w-full ${className}`}
      >
        <div className="flex w-full border-b border-surface dark:border-on-surface pb-2 group focus-within:border-primary transition-colors">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMAIL ADDRESS"
            className="bg-transparent w-full font-label-mono text-label-mono text-surface dark:text-on-surface placeholder:text-surface-variant dark:placeholder:text-on-surface-variant focus:outline-none focus:ring-0 border-none p-0 transition-all duration-300"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            aria-label="Subscribe to newsletter"
            className="text-surface dark:text-on-surface group-focus-within:text-primary transition-colors hover:translate-x-1 transform duration-300 disabled:opacity-60"
          >
            <Icon name="arrow_forward" className="w-[18px] h-[18px]" />
          </button>
        </div>
        {error && (
          <p
            role="alert"
            className="font-label-mono text-label-mono uppercase mt-2 text-error-container dark:text-error"
          >
            {error}
          </p>
        )}
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-stack-sm ${className}`}
    >
      <div className="flex flex-col gap-1">
        <label
          htmlFor="newsletter-email"
          className="font-label-mono text-label-mono uppercase text-on-surface-variant"
        >
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary transition-colors duration-200"
        />
      </div>
      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="self-start bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-3 hover:bg-primary hover:text-on-primary hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60"
      >
        {status === "loading" ? "Joining..." : "Subscribe"}
      </button>
    </form>
  );
}
