# Güvenlik Politikası

## Desteklenen sürümler

| Sürüm | Destek |
| --- | --- |
| `main` | Aktif olarak bakımda |

## Güvenlik açığı bildirimi

LAST DANCE projesinde bir güvenlik açığı tespit ettiyseniz lütfen GitHub private vulnerability reporting üzerinden bildirin
(bkz. https://github.com/…/security/advisories) ya da doğrudan proje sahibine e-posta gönderin. Public issue açmayın.

Bildiriminizde şunları belirtin:

1. Etkilenen uç nokta / dosya (örn. `src/app/api/checkout/route.ts`)
2. Açığın türü (CWE kategorisi — örn. XSS, SSRF, broken access control)
3. Tekrarlama adımları (mümkünse PoC)
4. Etki ve olası istismar senaryosu
5. (Varsa) önerilen düzeltme

Yanıt süresi: 48 saat içinde ilk değerlendirme; sorumlu açıklama (responsible disclosure) beklenir.

## Kapsam dışı

- `.env` dosyaları, çalışan ortam değişkenleri veya sırlar
- Rate limiting'e tabi brute-force denemeleri (zaten korumalı)
- Zaten genel duyurulmuş 3. parti bağımlılık zafiyetleri (npm audit üzerinden yönetilir)
- Stripe/NextAuth gibi 3. parti servislerin kendi zafiyetleri

## Güvenlik mimarisi (özet)

- **Kimlik doğrulama:** Auth.js Credentials + JWT; bcrypt cost 12; login brute-force limiti (10/15dk e-posta+IP); kayıt enumeration koruması; rol her istekte DB'den taze okunur (`auth/config.ts`).
- **Yetkilendirme:** tüm `/api/admin/*` uç noktaları `requireAdmin()`; hesap sipariş detayı sahiplik/ADMIN kontrolü; admin logları audit amaçlı `logSecurity` ile kaydedilir.
- **Ödeme bütünlüğü:** Stripe webhook imza doğrulaması + idempotent sipariş kurulumu (`stripeSessionId`/`stripePaymentIntentId` unique); fiyatlar DB'den okunur ve kalem snapshot'larına yazılır; `amount_total` santim bazında doğrulanır (`lib/money.ts`).
- **Stok tutarlılığı:** varyant stok güncellemeleri koşullu atomik `updateMany` + işlem delta'sı (`applyProductStockDelta`); rezervasyon `expiresAt` (24s) ile sınırlı, cron + lazy cleanup stok kilitlenmesini önler; gecikmiş ödemede `revivePaidOrder` stoku yeniden tüketir.
- **Girdi doğrulama:** form/API girdileri sunucuda doğrulanır; sepet sync `isValidCartItem`; upload mime whitelist + 5MB + benzersiz dosya adı.
- **Open redirect:** checkout success/cancel URL'leri yalnızca `ALLOWED_ORIGINS` allowlist'inden geçer.
- **Başlıklar:** CSP, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy (`next.config.ts`).
- **Sırlar:** `.gitignore` `.env*`; `.env.example` yalnızca placeholder içerir; CI `GITHUB_TOKEN` minimum izinle (`contents: read`).

## Güvenlikle ilgili güncelleme geçmişi

- **2026-08 — checkout/webhook dayanıklılığı:** `payment_status === "paid"` kontrolü, expired→completed yarışında `revivePaidOrder` + `reconsumeStock`, stok delta güncellemeleri, checkout rate limit + origin allowlist, santim bazlı para matematiği.
- **2026-08 — auth sıkılaştırma:** timing-safe login (DUMMY_HASH), IP bazlı limit, silinen kullanıcı için rol fallback, admin audit logları.
