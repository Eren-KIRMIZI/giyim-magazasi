"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
}

interface AdminImage {
  url: string;
  alt: string | null;
  position: number;
}

interface AdminVariant {
  size: string;
  color: string | null;
  stock: number;
}

export interface ProductFormInitial {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  status: string;
  badge: string | null;
  categoryId: string;
  images: AdminImage[];
  variants: AdminVariant[];
}

const INPUT_CLASS =
  "w-full border border-on-surface bg-transparent px-4 py-3 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary";
const LABEL_CLASS =
  "font-label-mono text-label-mono uppercase text-on-surface-variant";

export default function ProductForm({
  categories,
  initial,
  mode,
}: {
  categories: AdminCategory[];
  initial?: ProductFormInitial;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initial?.compareAtPrice != null ? String(initial.compareAtPrice) : ""
  );
  const [stock, setStock] = useState(initial ? String(initial.stock) : "25");
  const [status, setStatus] = useState(initial?.status ?? "ACTIVE");
  const [badge, setBadge] = useState(initial?.badge ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? ""
  );
  const [imagesText, setImagesText] = useState(
    initial
      ? initial.images.map((i) => (i.alt ? `${i.url}|${i.alt}` : i.url)).join("\n")
      : ""
  );
  const [variantsText, setVariantsText] = useState(
    initial
      ? initial.variants
          .map((v) => `${v.size}|${v.color ?? ""}|${v.stock}`)
          .join("\n")
      : "M|Black|25\nL|Black|25\nXL|Black|25"
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaved(false);
    setLoading(true);

    const payload = {
      name,
      slug: slug || undefined,
      subtitle,
      description,
      price: Number(price),
      compareAtPrice: compareAtPrice !== "" ? Number(compareAtPrice) : null,
      stock: Number(stock),
      status,
      badge: badge || null,
      categoryId,
      images: imagesText.split("\n").filter((l) => l.trim()),
      variants: variantsText.split("\n").filter((l) => l.trim()),
    };

    try {
      const url =
        mode === "edit" && initial
          ? `/api/admin/products/${initial.id}`
          : "/api/admin/products";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kaydedilemedi.");

      if (mode === "create") {
        router.push("/admin/urunler");
        router.refresh();
      } else {
        setSaved(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md max-w-2xl">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={LABEL_CLASS}>Ürün Adı *</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="flex flex-col gap-2">
          <label htmlFor="slug" className={LABEL_CLASS}>Slug (boşsa adından üretilir)</label>
          <input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className={INPUT_CLASS} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="category" className={LABEL_CLASS}>Kategori *</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={INPUT_CLASS}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="subtitle" className={LABEL_CLASS}>Alt Başlık</label>
        <input
          id="subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="LAST DANCE // CORE"
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className={LABEL_CLASS}>Açıklama</label>
        <textarea
          id="description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={INPUT_CLASS}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
        <div className="flex flex-col gap-2">
          <label htmlFor="price" className={LABEL_CLASS}>Fiyat (€) *</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="compare" className={LABEL_CLASS}>Eski Fiyat</label>
          <input
            id="compare"
            type="number"
            step="0.01"
            min="0"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="stock" className={LABEL_CLASS}>Stok</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={INPUT_CLASS}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="badge" className={LABEL_CLASS}>Rozet</label>
          <select
            id="badge"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="">Yok</option>
            <option value="NEW">NEW</option>
            <option value="LIMITED">LIMITED</option>
            <option value="SOLD OUT">SOLD OUT</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="flex flex-col gap-2">
          <label htmlFor="status" className={LABEL_CLASS}>Durum</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={INPUT_CLASS}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="DRAFT">DRAFT</option>
            <option value="SOLD_OUT">SOLD_OUT</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="images" className={LABEL_CLASS}>
          Görseller (her satır: url veya url|alt)
        </label>
        <textarea
          id="images"
          rows={5}
          value={imagesText}
          onChange={(e) => setImagesText(e.target.value)}
          className={`${INPUT_CLASS} font-mono`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="variants" className={LABEL_CLASS}>
          Varyantlar (her satır: beden|renk|stok)
        </label>
        <textarea
          id="variants"
          rows={4}
          value={variantsText}
          onChange={(e) => setVariantsText(e.target.value)}
          className={`${INPUT_CLASS} font-mono`}
        />
      </div>

      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error">{error}</p>
      )}
      {saved && (
        <p className="font-label-mono text-label-mono uppercase text-primary">
          Kaydedildi.
        </p>
      )}

      <div className="flex gap-stack-sm">
        <button
          type="submit"
          disabled={loading}
          className="bg-on-surface text-surface font-headline-md text-headline-md uppercase px-8 py-4 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-60"
        >
          {loading ? "Kaydediliyor..." : mode === "create" ? "Oluştur" : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
