"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  badge: string | null;
  category: string;
  image?: string | null;
}

export default function ProductList({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`"${name}" silinsin mi?`)) return;
    setDeleting(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Silinemedi.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex flex-col gap-stack-md">
      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error">{error}</p>
      )}

      {products.length === 0 ? (
        <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
          Henüz ürün yok.
        </div>
      ) : (
        <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
          {products.map((p) => (
            <div key={p.id} className="p-stack-md flex items-center gap-4">
              <div className="relative w-14 h-16 flex-shrink-0 bg-surface-container overflow-hidden">
                {p.image && (
                  <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="font-label-mono text-label-mono uppercase text-on-surface truncate">
                  {p.name}
                </span>
                <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                  {p.category} · {p.status}
                  {p.badge ? ` · ${p.badge}` : ""}
                </span>
              </div>
              <span className="font-label-mono text-label-mono uppercase text-on-surface">
                €{p.price.toFixed(2).replace(".", ",")}
              </span>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/urunler/${p.id}/duzenle`}
                  className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 hover:bg-on-surface hover:text-surface transition-colors"
                >
                  Düzenle
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  disabled={deleting === p.id}
                  className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 text-error hover:bg-error hover:text-on-error transition-colors disabled:opacity-50"
                >
                  {deleting === p.id ? "..." : "Sil"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
