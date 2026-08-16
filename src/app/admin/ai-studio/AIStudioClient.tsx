"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AI_BACKGROUNDS,
  AI_BODY_TYPES,
  AI_GENDERS,
  AI_SKIN_TONES,
  AI_STYLES,
  AI_VIEWS,
  AI_VIEW_LABELS,
  type AIStudioProduct,
  type AIView,
  type GeneratedView,
} from "@/modules/ai-fashion/types";

const INPUT_CLS =
  "w-full bg-surface border border-on-surface px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary";
const LABEL_CLS =
  "font-label-mono text-label-mono uppercase text-on-surface-variant";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Dosya okunamadı."));
    reader.readAsDataURL(file);
  });
}

export default function AIStudioClient({
  products,
}: {
  products: AIStudioProduct[];
}) {
  const router = useRouter();
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [garmentRef, setGarmentRef] = useState("");
  const [modelRef, setModelRef] = useState("");
  const [views, setViews] = useState<AIView[]>(AI_VIEWS.map((v) => v.id));
  const [attributes, setAttributes] = useState({
    gender: "Female",
    age: 25,
    heightCm: 175,
    bodyType: "Average",
    skinTone: "Medium",
    hair: "black",
    background: "Studio",
    style: "Brutalist editorial fashion photography",
  });
  const [results, setResults] = useState<GeneratedView[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regeneratingView, setRegeneratingView] = useState<AIView | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const product = products.find((p) => p.id === productId) ?? null;

  const handleProductChange = (value: string) => {
    setProductId(value);
    setResults([]);
    setError("");
    setNotice("");
    setGarmentRef("");
    setModelRef("");
  };

  const setAttr = (key: keyof typeof attributes, value: string | number) =>
    setAttributes((prev) => ({ ...prev, [key]: value }));

  const toggleView = (id: AIView) =>
    setViews((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );

  const handleGarmentFile = async (file: File | undefined) => {
    if (!file) return;
    setGarmentRef(await readFileAsDataUrl(file));
  };

  const handleModelFile = async (file: File | undefined) => {
    if (!file) return;
    setModelRef(await readFileAsDataUrl(file));
  };

  const submitGenerate = async (targetViews: AIView[]) => {
    if (!product) return;
    if (!garmentRef) {
      setError("Kıyafet referansı gerekli (ürün görseli seç veya dosya yükle).");
      return;
    }
    setError("");
    setNotice("");
    setGenerating(true);

    const fd = new FormData();
    fd.append("productId", product.id);
    fd.append("garmentRef", garmentRef);
    if (modelRef) fd.append("modelRef", modelRef);
    fd.append("views", JSON.stringify(targetViews));
    fd.append("gender", attributes.gender);
    fd.append("age", String(attributes.age));
    fd.append("heightCm", String(attributes.heightCm));
    fd.append("bodyType", attributes.bodyType);
    fd.append("skinTone", attributes.skinTone);
    fd.append("hair", attributes.hair);
    fd.append("background", attributes.background);
    fd.append("style", attributes.style);

    try {
      const res = await fetch("/api/admin/ai-fashion/generate", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Üretim başarısız.");

      if (targetViews.length === AI_VIEWS.length) {
        setResults(data.results as GeneratedView[]);
      } else {
        setResults((prev) => {
          const next = prev.filter((r) => !targetViews.includes(r.view));
          return [...next, ...(data.results as GeneratedView[])];
        });
      }
      if (data.error) setError(data.error);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setGenerating(false);
      setRegeneratingView(null);
    }
  };

  const regenerateView = async (view: AIView) => {
    setRegeneratingView(view);
    await submitGenerate([view]);
  };

  const handleSave = async () => {
    if (!product) return;
    const okResults = results.filter((r) => r.ok && r.url);
    if (okResults.length === 0) {
      setError("Kaydedilecek üretilmiş görsel yok.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/ai-fashion/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          images: okResults.map((r) => ({
            url: r.url,
            alt: `${product.name} — ${AI_VIEW_LABELS[r.view]}`,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Kaydedilemedi.");
      setNotice(
        `${data.count} görsel "${product.name}" ürün galerisine eklendi.`
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-stack-lg">
      {error && (
        <p className="font-label-mono text-label-mono uppercase text-error border border-error p-stack-sm">
          {error}
        </p>
      )}
      {notice && (
        <p className="font-label-mono text-label-mono uppercase text-on-surface border border-on-surface p-stack-sm">
          {notice}
        </p>
      )}

      {products.length === 0 ? (
        <div className="border border-on-surface p-stack-md font-body-md text-body-md text-on-surface-variant">
          Önce bir ürün oluştur.
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-stack-md">
            <div className="grid md:grid-cols-2 gap-gutter">
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Ürün</label>
                <select
                  className={INPUT_CLS}
                  value={productId}
                  onChange={(e) => handleProductChange(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.objectNumber ? `· ${p.objectNumber}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Görsel Referansı (Kıyafet)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => handleGarmentFile(e.target.files?.[0])}
                    className={INPUT_CLS}
                  />
                  {garmentRef && (
                    <button
                      type="button"
                      onClick={() => setGarmentRef("")}
                      className="font-label-mono text-label-mono uppercase border border-on-surface px-3 py-2 hover:bg-on-surface hover:text-surface transition-colors flex-shrink-0"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
              </div>
            </div>

            {product && product.images.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className={LABEL_CLS}>
                  veya ürün görsellerinden seç (tıklayınca referans olur):
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.images.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setGarmentRef(img.url)}
                      className={`relative w-16 h-20 overflow-hidden border transition-colors ${
                        garmentRef === img.url
                          ? "border-primary ring-1 ring-primary"
                          : "border-on-surface"
                      }`}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt ?? product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-gutter">
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Model Referansı (opsiyonel)</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => handleModelFile(e.target.files?.[0])}
                  className={INPUT_CLS}
                />
              </div>
              {modelRef && (
                <div className="flex flex-col gap-1">
                  <label className={LABEL_CLS}>Model Önizleme</label>
                  <img
                    src={modelRef}
                    alt="Model referansı"
                    className="w-16 h-20 object-cover border border-on-surface"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Cinsiyet</label>
                <select
                  className={INPUT_CLS}
                  value={attributes.gender}
                  onChange={(e) => setAttr("gender", e.target.value)}
                >
                  {AI_GENDERS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Yaş</label>
                <input
                  type="number"
                  min={16}
                  max={99}
                  className={INPUT_CLS}
                  value={attributes.age}
                  onChange={(e) => setAttr("age", Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Boy (cm)</label>
                <input
                  type="number"
                  min={140}
                  max={220}
                  className={INPUT_CLS}
                  value={attributes.heightCm}
                  onChange={(e) => setAttr("heightCm", Number(e.target.value))}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Vücut Tipi</label>
                <select
                  className={INPUT_CLS}
                  value={attributes.bodyType}
                  onChange={(e) => setAttr("bodyType", e.target.value)}
                >
                  {AI_BODY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Ten Rengi</label>
                <select
                  className={INPUT_CLS}
                  value={attributes.skinTone}
                  onChange={(e) => setAttr("skinTone", e.target.value)}
                >
                  {AI_SKIN_TONES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Saç</label>
                <input
                  className={INPUT_CLS}
                  value={attributes.hair}
                  onChange={(e) => setAttr("hair", e.target.value)}
                  placeholder="black, blonde..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Arka Plan</label>
                <select
                  className={INPUT_CLS}
                  value={attributes.background}
                  onChange={(e) => setAttr("background", e.target.value)}
                >
                  {AI_BACKGROUNDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className={LABEL_CLS}>Fotoğraf Stili</label>
                <select
                  className={INPUT_CLS}
                  value={attributes.style}
                  onChange={(e) => setAttr("style", e.target.value)}
                >
                  {AI_STYLES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className={LABEL_CLS}>Üretilecek Açılar</span>
              <div className="flex flex-wrap gap-2">
                {AI_VIEWS.map((v) => {
                  const active = views.includes(v.id);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => toggleView(v.id)}
                      className={`font-label-mono text-label-mono uppercase px-4 py-2 border transition-colors ${
                        active
                          ? "bg-on-surface text-surface border-on-surface"
                          : "border-on-surface text-on-surface-variant hover:bg-surface-variant"
                      }`}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => submitGenerate(AI_VIEWS.map((v) => v.id))}
              disabled={generating}
              className="bg-on-surface text-surface font-headline-md text-headline-md uppercase px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50"
            >
              {generating ? "Üretiliyor..." : "Generate"}
            </button>
          </div>

          {results.length > 0 && (
            <div className="flex flex-col gap-stack-md">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                {AI_VIEWS.map((v) => {
                  const result = results.find((r) => r.view === v.id);
                  const isRegenerating = regeneratingView === v.id;
                  return (
                    <div
                      key={v.id}
                      className="flex flex-col gap-2 border border-on-surface p-2"
                    >
                      <span className="font-label-mono text-label-mono uppercase text-on-surface text-center">
                        {v.label}
                      </span>
                      {isRegenerating ? (
                        <div className="w-full aspect-[2/3] bg-surface-container flex items-center justify-center font-label-mono text-label-mono uppercase text-on-surface-variant">
                          Üretiliyor...
                        </div>
                      ) : result?.ok && result.url ? (
                        <div className="relative w-full aspect-[2/3] overflow-hidden border border-on-surface">
                          <Image
                            src={result.url}
                            alt={`${product?.name} — ${v.label}`}
                            fill
                            sizes="(min-width: 768px) 25vw, 50vw"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-[2/3] bg-surface-container flex items-center justify-center font-label-mono text-label-mono uppercase text-on-surface-variant p-2 text-center">
                          {result?.error ?? "Üretilmedi"}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => regenerateView(v.id)}
                          disabled={generating}
                          className="flex-1 font-label-mono text-label-mono uppercase border border-on-surface px-2 py-1 hover:bg-on-surface hover:text-surface transition-colors disabled:opacity-50"
                        >
                          Yenile
                        </button>
                        {result?.ok && result.url && (
                          <a
                            href={result.url}
                            download
                            className="flex-1 font-label-mono text-label-mono uppercase border border-on-surface px-2 py-1 text-center hover:bg-on-surface hover:text-surface transition-colors"
                          >
                            İndir
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving || !results.some((r) => r.ok)}
                  className="bg-on-surface text-surface font-headline-md text-headline-md uppercase px-6 py-3 hover:bg-primary hover:text-on-primary transition-colors disabled:opacity-50"
                >
                  {saving ? "Kaydediliyor..." : "Ürün Galerisine Kaydet"}
                </button>
                <a
                  href={product ? `/admin/urunler/${product.id}/duzenle` : "#"}
                  className="font-label-mono text-label-mono uppercase border border-on-surface px-4 py-3 hover:bg-on-surface hover:text-surface transition-colors"
                >
                  Ürünü Düzenle
                </a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
