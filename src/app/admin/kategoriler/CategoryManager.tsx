"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

const INPUT_CLASS =
  "w-full border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary";
const LABEL_CLASS =
  "font-label-mono text-label-mono uppercase text-on-surface-variant";

export default function CategoryManager({
  categories,
}: {
  categories: CategoryRow[];
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: slug || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Eklenemedi.");
      setName("");
      setSlug("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (c: CategoryRow) => {
    setEditingId(c.id);
    setEditName(c.name);
    setEditSlug(c.slug);
    setError("");
  };

  const saveEdit = async (id: string) => {
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, slug: editSlug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kaydedilemedi.");
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (c: CategoryRow) => {
    if (!window.confirm(`"${c.name}" silinsin mi?`)) return;
    setError("");
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/categories/${c.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Silinemedi.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-stack-lg">
      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error">{error}</p>
      )}

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-gutter max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="flex flex-col gap-2">
            <label className={LABEL_CLASS}>Ad *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={INPUT_CLASS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={LABEL_CLASS}>Slug (boşsa adından üretilir)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={INPUT_CLASS}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="self-start bg-on-surface text-surface font-headline-md text-headline-md uppercase px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60"
        >
          {busy ? "Ekleniyor..." : "+ Kategori Ekle"}
        </button>
      </form>

      <div className="flex flex-col border border-on-surface divide-y divide-on-surface">
        {categories.length === 0 && (
          <div className="p-stack-md font-body-md text-body-md text-on-surface-variant">
            Henüz kategori yok.
          </div>
        )}
        {categories.map((c) => (
          <div key={c.id} className="p-stack-md flex items-center gap-4">
            {editingId === c.id ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-gutter">
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={INPUT_CLASS}
                />
                <input
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            ) : (
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <span className="font-label-mono text-label-mono uppercase text-on-surface truncate">
                  {c.name}
                </span>
                <span className="font-label-mono text-label-mono uppercase text-on-surface-variant">
                  /{c.slug} · {c.productCount} ürün
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {editingId === c.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => saveEdit(c.id)}
                    disabled={busy}
                    className="font-label-mono text-label-mono uppercase bg-on-surface text-surface px-3 py-2 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 hover:bg-on-surface hover:text-surface transition-colors"
                  >
                    Vazgeç
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(c)}
                  className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 hover:bg-on-surface hover:text-surface transition-colors"
                >
                  Düzenle
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(c)}
                disabled={busy}
                className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 text-error hover:bg-error hover:text-on-error transition-colors disabled:opacity-50"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
