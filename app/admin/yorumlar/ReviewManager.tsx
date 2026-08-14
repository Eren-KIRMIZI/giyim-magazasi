"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  product: { id: string; name: string; slug: string };
  user: { id: string; email: string; name: string | null };
}

export default function ReviewManager({
  initialReviews,
}: {
  initialReviews: ReviewRow[];
}) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const handleSearch = async () => {
    setError("");
    setSearching(true);
    try {
      const res = await fetch(`/api/admin/reviews?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Arama başarısız.");
      setReviews(data.reviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (r: ReviewRow) => {
    if (!window.confirm("Bu yorum silinsin mi?")) return;
    setError("");
    setBusyId(r.id);
    try {
      const res = await fetch(`/api/admin/reviews/${r.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Silinemedi.");
      setReviews((prev) => prev.filter((x) => x.id !== r.id));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex flex-col gap-stack-md">
      <div className="flex flex-col md:flex-row gap-gutter max-w-2xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Ürün adı ara..."
          className="flex-1 border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching}
          className="bg-on-surface text-surface font-headline-md text-headline-md uppercase px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60"
        >
          {searching ? "..." : "Ara"}
        </button>
      </div>

      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error">{error}</p>
      )}

      <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
        {reviews.length === 0 && (
          <div className="p-stack-md font-body-md text-body-md text-on-surface-variant">
            Yorum bulunamadı.
          </div>
        )}
        {reviews.map((r) => (
          <div key={r.id} className="p-stack-md flex items-start gap-4">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <span className="font-label-mono text-label-mono uppercase text-on-surface">
                {"★".repeat(r.rating)}
                <span className="text-on-surface-variant">
                  {"★".repeat(5 - r.rating)}
                </span>{" "}
                · {r.product.name}
              </span>
              <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                {r.user.name ?? r.user.email} ·{" "}
                {new Date(r.createdAt).toLocaleDateString("tr-TR")}
              </span>
              {r.comment && (
                <p className="font-body-md text-body-md text-on-surface whitespace-pre-wrap">
                  {r.comment}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(r)}
              disabled={busyId === r.id}
              className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 text-error hover:bg-error hover:text-on-error transition-colors disabled:opacity-50"
            >
              {busyId === r.id ? "..." : "Sil"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
