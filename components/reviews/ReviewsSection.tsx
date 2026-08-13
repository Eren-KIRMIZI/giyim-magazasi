"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: string | null;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-primary" aria-label={`${rating} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`material-symbols-outlined icon-fill text-[16px] ${
            n <= rating ? "" : "text-outline opacity-30"
          }`}
        >
          star
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({ productId }: { productId: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch(`/api/reviews?productId=${productId}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!cancelled) {
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        }
      } catch {
        if (!cancelled) setReviews([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const average =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (rating < 1) {
      setError("Lütfen bir puan seçin.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yorum gönderilemedi.");
      setReviews((prev) => {
        const rest = prev.filter((r) => r.id !== data.review.id);
        return [data.review, ...rest];
      });
      setRating(0);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-stack-lg pt-stack-lg border-t border-on-surface">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-stack-md">
        <h2 className="font-headline-md text-headline-md uppercase tracking-tight">
          Yorumlar
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Stars rating={Math.round(average)} />
            <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
              {average.toFixed(1)} · {reviews.length} yorum
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="font-label-mono text-label-mono uppercase text-on-surface-variant">
          Yorumlar yükleniyor...
        </p>
      ) : (
        <div className="flex flex-col border border-on-surface divide-y divide-on-surface mb-stack-md">
          {reviews.length === 0 ? (
            <div className="p-stack-md font-body-md text-body-md text-on-surface-variant">
              Henüz yorum yok. İlk yorumu sen yaz.
            </div>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="p-stack-md flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <Stars rating={r.rating} />
                  <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                    {r.author ?? "Anonim"} ·{" "}
                    {new Date(r.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </div>
                {r.comment && (
                  <p className="font-body-md text-body-md text-on-surface">
                    {r.comment}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {session?.user ? (
        <form
          onSubmit={handleSubmit}
          className="border border-on-surface p-stack-md flex flex-col gap-stack-md"
        >
          <span className="font-headline-md text-headline-md uppercase">
            Yorum Yaz
          </span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(n)}
                className={`material-symbols-outlined icon-fill text-[28px] transition-colors ${
                  n <= (hoverRating || rating)
                    ? "text-primary"
                    : "text-outline opacity-30"
                }`}
                aria-label={`${n} yıldız`}
              >
                star
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Yorumunuzu yazın (opsiyonel)"
            className="border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary"
          />
          {error && (
            <p className="font-label-mono text-label-mono uppercase text-error">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="self-start bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-3 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60"
          >
            {submitting ? "Gönderiliyor..." : "Gönder"}
          </button>
        </form>
      ) : (
        <p className="font-label-mono text-label-mono uppercase text-on-surface-variant">
          Yorum yazmak için giriş yapın.
        </p>
      )}
    </section>
  );
}
