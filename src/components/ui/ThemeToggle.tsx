"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Icon } from "@/components/icons";

const STORAGE_KEY = "last-dance-theme";

function getTheme(): "light" | "dark" {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  window.addEventListener("ld-theme-change", onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener("ld-theme-change", onChange);
  };
}

const getSnapshot = () => getTheme();
const getServerSnapshot = (): "light" | "dark" => "light";

export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Harici sistem = <html>. Bu effect yalnızca DOM'u senkronize eder;
  // ilk boyamayı no-flash script yönetir (burada sınıf yanlış uygulanmaz).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event("ld-theme-change"));
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Açık temaya geç" : "Karanlık temaya geç"}
      onClick={toggle}
      className={`p-2 rounded-sm transition-all duration-200 hover:bg-surface-container hover:text-primary active:scale-95 ${className}`}
    >
      <Icon name={isDark ? "light_mode" : "dark_mode"} className="w-6 h-6" />
    </button>
  );
}
