# AI Studio Modül Test Sonuçları

**Tarih:** 2026-08-16T22:01:48.684Z
**Sonuç:** 6 geçti / 0 başarısız / 1 atlandı / 7 toplam

## Testler

- ✅ **OPENROUTER_API_KEY tanımlı ve formatı doğru** (0ms)
   - Bilgi: Key bulundu: sk-or-v1-2e2be... (73 karakter)
- ✅ **OpenRouter API erişimi — key geçerliliği** (540ms)
   - Bilgi: Key geçerli — label: "sk-or-v1-2e2...efe", limit: ?, usage: 0
- ✅ **Gemini görsel modeli OpenRouter katalogunda mevcut** (72ms)
   - Bilgi: Model bulundu: google/gemini-2.5-flash-image (context: 32768)
- ✅ **buildPrompt() — doğru metin üretiyor** (0ms)
   - Bilgi: Prompt üretildi (559 karakter)
- ✅ **resolveReference() — geçerli PNG data URL kabul ediyor** (0ms)
   - Bilgi: Data URL geçerli — decoded boyut: 70 byte
- ✅ **resolveReference() — geçersiz input hata fırlatıyor** (0ms)
   - Bilgi: Geçersiz inputlar doğru şekilde reddediliyor
- ⏭️ **OpenRouter görsel API — gerçek üretim isteği (1x1 referans)** (59ms)
   - Bilgi: OpenRouter kredisi yok — https://openrouter.ai/settings/credits adresinden yükleyin

## Dosyalar
- JSON sonuçlar: `test-results/ai-studio-test-results.json`
- Üretilen görsel (test 7 geçerse): `test-results/ai-generated-test.png`