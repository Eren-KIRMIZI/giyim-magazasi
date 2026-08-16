import { revalidatePath } from "next/cache";

// Storefront'u ISR ile önbelleğe alan tüm sayfaları geçersiz kılar.
// Admin ürün/kategori/değişiklikleri ve stok mutasyonlarında çağrılır;
// aksi halde kullanıcılar 60-300sn bayat içerik görür.
//
// revalidatePath yalnızca gerçek request context'inde çalışır; handler'ları
// doğrudan çağıran testler (unit smoke) ve bazı edge durumlarında throw eder.
// Üretimde normal çalışır; burada hata yutulur ki webhook işleme aksamasın.
export function revalidateStorefront() {
  try {
    revalidatePath("/", "page");
    revalidatePath("/koleksiyonlar", "page");
    revalidatePath("/search", "page");
    revalidatePath("/urunler/[slug]", "page");
    revalidatePath("/begendiklerim", "page");
  } catch {
    // no-op: request context yoksa önbellek kırılamaz, zaten zamanla expire olur.
  }
}
