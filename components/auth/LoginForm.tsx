"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Mode = "giris" | "kayit";

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("giris");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setMode((m) => (m === "giris" ? "kayit" : "giris"));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "kayit") {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Kayıt başarısız.");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-posta veya şifre hatalı.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto border border-on-surface bg-surface">
      <div className="flex border-b border-on-surface">
        {(["giris", "kayit"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => toggleMode()}
            className={`flex-1 py-4 font-headline-md text-headline-md uppercase transition-colors ${
              mode === m
                ? "bg-on-surface text-surface"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {m === "giris" ? "Giriş" : "Kayıt"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md p-stack-lg">
        {mode === "kayit" && (
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="font-label-mono text-label-mono uppercase text-on-surface-variant"
            >
              İsim
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ad Soyad"
              className="border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="font-label-mono text-label-mono uppercase text-on-surface-variant"
          >
            E-posta
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@lastdance.store"
            className="border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="font-label-mono text-label-mono uppercase text-on-surface-variant"
          >
            Şifre
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
          />
        </div>

        {error && (
          <p className="font-label-mono text-label-mono uppercase text-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-on-surface text-surface font-headline-md text-headline-md uppercase py-4 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? "Bekleyin..."
            : mode === "giris"
              ? "Giriş Yap"
              : "Hesap Oluştur"}
        </button>

        <p className="font-label-mono text-label-mono uppercase text-on-surface-variant text-center">
          Demo: demo@lastdance.store / demo1234
        </p>
      </form>
    </div>
  );
}
