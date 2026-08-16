# LAST DANCE — Giyim Mağazası

Brutalist tasarımlı, tam yığın (full-stack) e-ticaret mağazası. Next.js 16 App Router, TypeScript, Tailwind CSS v4 üzerine kurulu; PostgreSQL (Prisma 7), Redis (Memurai/Upstash), Auth.js (NextAuth v5), Stripe ve Vercel Analytics entegrasyonlu.

## Özellikler

### Vitrin
- **Anasayfa:** hero + yeni gelenler + koleksiyon bölümleri; `Reveal` bileşeni **IntersectionObserver + CSS transition** ile çalışır (`prefers-reduced-motion` destekli); `template.tsx` **GSAP sayfa geçiş animasyonu** (reduced-motion'da kapalı). **Hero:** dikey "Est. 2026 — The Archive" etiketi + kampanya **marquee bandı** ("The Final Drop — Secure the Archive — Campaign 001 …").
- **Header:** üst duyuru bandı **marquee** animasyonlu ("The Final Drop — Free shipping over €100", hover'da duraklar), sticky + `backdrop-blur` navigasyon, aktif link alt çizgisi, gerçek nav linkleri (New Arrivals / Collections / Newsletter), arama-wishlist-sepet ikonları (inline SVG), sepet/favori rozetleri, **tam ekran mobil menü** (stagger'la beliren dev başlıklar, açıkken body scroll kilidi, tema + arama/favori satırları).
- **Ürün kartı (editorial redesign):** ürün sırasına göre **"No. 001"** etiketi, ürün **renk numuneleri (swatches)**, hover'da "View Object" + ikinci görsele geçiş, favori kalbi.
- **Koleksiyonlar:** `/koleksiyonlar` — kategori, beden ve fiyat filtresi; mobilde toggle panel; "Recently Viewed" bölümü; üstte **kampanya bandı** ("Archive // Campaign 001 — The Final Drop").
- **Arama:** `/search` — server-side arama (`?q=&kategori=&beden=&renk=&fiyatmin=&fiyatmax=&stok=1&sirala=`), ILIKE tabanlı (isim/alt başlık/açıklama), sıralama: newest / price_asc / price_desc / popular (sipariş adedine göre). Filtreler URL'e yazılır (paylaşılabilir, SSR); **aktif filtre çipleri + "Clear all"** (URL'deki her filtreden tek tıkla kaldırma); `/search` noindex; `loading.tsx` iskelet ekranı. Header'daki arama ikonu buraya gider.
- **Ürün detayı:** `/urunler/[slug]` (SSG, slug tabanlı) — görsel galeri (**ok/klavye geçişi + `01 / 04` sayaç**, minyatürler), beden/renk seçimi (renk swatch'larında press geri bildirimi), varyant bazlı **stok kontrolü** (seçili size+color'a göre; 0 stokta buton disabled + "Sold Out", ≤5 stokta **"Son X adet" uyarısı + kırmızı stok çubuğu**), **Add to Bag + Buy Now** (sepete ekleyip `/sepet`'e yönlendirir), favori butonu, "Complete the Look" önerileri (**aynı kategori öncelikli**), yorumlar, mobilde **sticky add-to-cart barı**. **Editorial bölüm:** `OBJECT / STATUS / SPEC` — object number, kampanya, kumaş/materyal, gramaj, kalıp ve çıkış tarihi (DB'den).
- **Wishlist (favoriler):** `/begendiklerim` — Zustand + localStorage kalıcılığı; ürün kartlarında kalp, ürün detayında buton, Header'da rozetli kalp + mobil menü linki; **boş durum EmptyState** (ikon + CTA ile).
- **Dark mode:** `.dark` altında CSS değişkeni override'ları (`globals.css`, `@custom-variant dark`) — token kullanan tüm bileşenler otomatik uyum sağlar; `ThemeToggle` (`useSyncExternalStore` + localStorage + sistem tercihi), layout'ta **no-flash inline script**; footer/duyuru bandı gibi istisnalar `dark:` sınıflarıyla ayarlanır.
- **Yakın zamanda bakılanlar:** localStorage'da tutulur (max 8), `/koleksiyonlar` altında listelenir.
- **Sepet:** Zustand + localStorage; **adet üst sınırı stokla clamp'lenir** (varyant `maxQuantity`), girişli kullanıcılarda Redis senkronizasyonu. **UI cilası:** boş sepet EmptyState, sticky özet paneli, **€100 kargo ilerleme çubuğu** ("Free Shipping — €X to go / Unlocked"), checkout butonunda ok + yükleme animasyonu, ürün minyatürlerinde hover zoom, miktar butonlarında press geri bildirimi.
- **Newsletter:** `/newsletter` sayfası + `/api/newsletter` (e-posta doğrulama, IP bazlı rate limit 5/saat, `NewsletterSubscription` tablosuna upsert, "ACCESS GRANTED" onayı); anasayfa `CollectionsSection` içindeki form da aynı API'yi kullanır.
- **Bilgi sayfaları:** `/shipping`, `/returns`, `/terms`, `/contact` — footer linkleri; özel **404** (`not-found.tsx`), hata (`error.tsx` + `retry`) ve kök hata (`global-error.tsx`) sayfaları.
- **İkonlar:** `components/icons.tsx` — tüm ikonlar **inline SVG** (Material Symbols bağımlılığı yok).
- **Ortak UI:** `components/ui/EmptyState.tsx` (ikon + başlık + açıklama + CTA) ve `components/ui/Skeleton.tsx` — boş/yükleme durumlarında standartlaştırılmış bileşenler.
- **Etkileşim katmanı (`globals.css`):** `focus-visible` halkası, buton imleci, görsel drag engelleme, kalın scrollbar, `.link-sweep` link animasyonu, `marquee` keyframes.

### Kimlik, hesap ve sipariş
- **Kimlik doğrulama:** kayıt + giriş (`/giris`), `bcryptjs` hash (cost 12), rol (ADMIN/CUSTOMER) JWT session'da; `session` callback'i rolü **her istekte DB'den taze okur** (admin panelden düşürülen kullanıcı anında yetkisini kaybeder); Redis tabanlı rate limit (**login 10/15dk e-posta+IP bazlı**, kayıt 10/15dk, yorum 10/saat, Redis yokken fail-open). Kayıtta **şifre politikası:** en az 8 karakter + büyük/küçük harf + rakam; mevcut e-posta çakışmasında **enumeration önleyici** genel mesaj döner.
- **Hesap:** `/hesabim` — sipariş geçmişi; `/hesabim/[orderNumber]` — sipariş detayı (sahibi veya admin).
- **Yorumlar:** girişli kullanıcı ürün başına bir yorum/puan (upsert, `productId+userId` benzersiz), ortalama puan.
- **Stripe Checkout (production-safe):** sepet sunucuda doğrulanır, fiyatlar **DB'den okunur ve sipariş kalemlerine snapshot** alınır; checkout'ta varyant bazlı **atomik stok rezervasyonu** (`OrderReservation`). Webhook imza doğrulamalı + idempotent (`stripeSessionId`/`stripePaymentIntentId` benzersiz):
  - `checkout.session.completed` → Order + kalem snapshot'ları (isim/fiyat/SKU/görsel/beden/renk) oluşturur, rezervasyonu CONSUMED yapar.
  - `expired` / `async_payment_failed` → stok iade + CANCELLED/FAILED kaydı.
  - `charge.refunded` → stok geri + REFUNDED (`stockRestored` ile tek sefer).
  - Sipariş numarası: `LD-2026-XXXXXX` (yıl dinamik, `generateOrderNumber()`). Ürün sonradan silinse bile sipariş kalemleri ayakta kalır.
  - **Rezervasyon süre aşımı:** her rezervasyona `expiresAt` (24 saat) yazılır; `/api/cron/release-expired` (Vercel Cron, `CRON_SECRET` korumalı) ve checkout öncesi lazy cleanup (`releaseExpiredReservations`) süresi dolan rezervasyonları iade eder — Stripe webhook'u kaçsa/gecikse bile stok kilitlenmez.

### Admin paneli (`/admin`, sadece ADMIN)
- **Dashboard:** ürün/sipariş/kullanıcı/kategori sayaçları; toplam + son 30 gün ciro; son 24 saat iptal/fail; aktif rezervasyon; **30 günlük günlük ciro SVG grafiği** (bağımlılıksız); en çok satanlar (adet + ciro); **düşük stok uyarıları (≤5)**; son siparişler.
- **Ürünler:** CRUD (`/admin/urunler`, oluştur/düzenle) — artı **editorial alanlar** (Object No, Kampanya, Materyal, Gramaj, Kalıp, Çıkış Tarihi), **görsel yükleme** (`/api/admin/upload` — 5MB, jpeg/png/webp/gif/avif; `public/uploads/products/<ts>-<hex>.<ext>`), varyant stok satırları.
- **Kategoriler:** CRUD (`/admin/kategoriler`); ürünü olan kategori silinemez (409).
- **Kullanıcılar:** `/admin/kullanicilar` — arama, rol değiştirme, silme (koruma: kendini/son admin'i düşüremez, kendini silemez, sipariş/yorum/sepeti olan kullanıcı silinemez).
- **Yorumlar:** `/admin/yorumlar` — ürün adıyla arama + silme (moderasyon).

### SEO / Büyüme (Phase 4)
- **Metadata:** `metadataBase` + canonical/OG/twitter; ürün sayfası dinamik `generateMetadata`; home'da Organization, üründe **Product + BreadcrumbList JSON-LD**; `/search` ve kişisel sayfalar noindex.
- **sitemap.xml** (statik + bilgi sayfaları + tüm ürünler, `updatedAt`) ve **robots.txt** (admin/hesap/sepet/favori/search/api gizli).
- **OG görselleri:** kök `opengraph-image` (brutalist anasayfa kartı) + ürün sayfası dinamik `opengraph-image` (ad, fiyat, kategori) — `next/og` ImageResponse, `nodejs` runtime.
- **Analytics:** `@vercel/analytics` (`<Analytics/>` layout'ta); checkout başarısında `track("order_completed")` conversion event'i.
- **lib/site.ts:** `SITE_URL` (`.env` → `NEXT_PUBLIC_SITE_URL`, yoksa `https://lastdance.store`).

### Performans
- **ISR:** katalog sayfaları `revalidate` ile önbelleğe alınır (stok/DB güncel kaldıkça yeniden doğrulanır).
- **Lean Prisma sorguları:** vitrin sorguları yalnızca gerekli alanları seçer (`select`), yorum/sayım sorguları `count`-only.
- **`next/image` hero:** anasayfa hero görseli optimize edilmiş, `priority`/boyutlandırılmış; hover ikinci görseller `lazy`.
- **Reduced motion:** tüm animasyonlar (`Reveal`, `template.tsx` geçişi, fly-to-cart) `prefers-reduced-motion: reduce`'da devre dışı.
- **Bundle analyzer:** `npm run analyze` → `.next/analyze/*.html` raporları (Turbopack uyumsuz olduğundan `--webpack` ile çalışır).

## Teknolojiler

| Katman | Kullanılan |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS v4, CSS token tabanlı tema, inline SVG ikonlar (`components/icons.tsx`) |
| Animasyon | GSAP (`template.tsx` sayfa geçişi, fly-to-cart), Lenis (smooth scroll), `Reveal` (IntersectionObserver + CSS) |
| Veritabanı | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`, `prisma.config.ts`) |
| Cache / state | Redis (ioredis) — Memurai (yerel) / Upstash (prod) |
| Auth | Auth.js (next-auth v5 beta) — Credentials + PrismaAdapter, JWT session |
| Ödeme | Stripe Checkout + webhook ile sipariş oluşturma |
| State (client) | Zustand (persist) — sepet, favoriler, son bakılanlar |
| Analytics | `@vercel/analytics` (pageview + özel event) |
| SEO | Next metadata (OG/twitter/canonical), `sitemap.ts`/`robots.ts`, `next/og` (ImageResponse) |
| Build analizi | `@next/bundle-analyzer` (`npm run analyze`) |
| CI | GitHub Actions (`.github/workflows/ci.yml`) — lint, tip, build, test, audit |

## Kurulum

### 1. Bağımlılıklar

```bash
npm install
```

### 2. Ortam değişkenleri

`.env.example` dosyasını kopyalayıp doldurun:

```bash
cp .env.example .env
```

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantı adresi (yerel: `postgresql://postgres:postgres@localhost:5432/giyim_magazasi?schema=public`) |
| `REDIS_URL` | Redis bağlantı adresi (yerel Memurai: `redis://localhost:6379`; prod Upstash REST değerleri ayrı alanlarda) |
| `STRIPE_SECRET_KEY` | Stripe `sk_test_...` / `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook `whsec_...` |
| `AUTH_SECRET` | `npx auth secret` ile üretilebilir |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | Uygulama adresi (yerel: `http://localhost:3000`); checkout redirect origin'i |
| `NEXT_PUBLIC_SITE_URL` | SEO taban URL'i (canonical/OG/sitemap; yoksa `https://lastdance.store`) |
| `ALLOWED_ORIGINS` | Checkout open-redirect allowlist'i — virgülle ayrılmış ek origin'ler (varsayılan: `NEXT_PUBLIC_APP_URL` + `NEXT_PUBLIC_SITE_URL` + `http://localhost:3000`) |
| `CRON_SECRET` | Süresi dolan rezervasyon temizliği için Bearer token (`/api/cron/release-expired`) |

> Not: `next.config.ts`'te görsel uzak host yalnızca `lh3.googleusercontent.com` (`/aida-public/**`) için açık. `public/uploads` lokaldir ve `images.remotePatterns` gerektirmez.

### 3. Veritabanı

PostgreSQL'in çalışıyor olması gerekir. Migrasyonlar ve seed:

```bash
npx prisma migrate dev   # ilk denemede takılabilir → iptal edip tekrar çalıştırın
npx prisma generate
npx prisma db seed
```

`prisma.config.ts` şemayı `src/prisma/schema.prisma`, migrasyonları `src/prisma/migrations` üzerinden yönetir.

Seed içeriği: **5 kategori** (hoodies, tees, bottoms, footwear, accessories) ve **11 ürün** (editorial alanlar + varyant + görsellerle) + demo admin kullanıcısı.

### 4. Çalıştırma

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde açılır.

### Demo hesaplar

| Rol | E-posta | Şifre |
| --- | --- | --- |
| Admin | `demo@lastdance.store` | `demo1234` |

Admin paneli: [http://localhost:3000/admin](http://localhost:3000/admin)

## Proje yapısı

```
src/
  app/                       # Next.js App Router sayfaları
    layout.tsx               # Kök layout (fonts, metadataBase, Analytics)
    template.tsx             # GSAP sayfa geçiş animasyonu
    page.tsx                 # Anasayfa (metadata + Organization JSON-LD)
    robots.ts / sitemap.ts   # robots.txt + sitemap.xml
    opengraph-image.tsx      # Kök OG görseli (ImageResponse)
    not-found.tsx / error.tsx / global-error.tsx  # 404 + hata sınırları
    (storefront)/
      urunler/[slug]/        # Ürün detayı (SSG) + ProductDetail + OG görseli
      koleksiyonlar/         # Filtreli katalog + Recently Viewed + kampanya bandı
      search/                # Server-side arama + searchParams + loading
      sepet/  begendiklerim/ # Sepet + CheckoutNotice / Wishlist
    (auth)/giris/            # Giriş formu
    (account)/hesabim/       # Sipariş geçmişi + [orderNumber] detay
    admin/                   # Yönetim paneli (guard layout, SalesChart)
      urunler/ (yeni, [id]/duzenle)  kategoriler/  kullanicilar/
      yorumlar/  siparisler/ ([id])
    newsletter/ shipping/ returns/ terms/ contact/   # Bilgi sayfaları
    api/
      admin/               # categories, orders/[id], products, reviews, upload, users
      auth/                # NextAuth handler + register
      cart/sync/  checkout/  newsletter/  reviews/
      webhooks/stripe/     # Ödeme webhook'u (imza + idempotent)
  components/
    icons.tsx              # İnline SVG ikonlar (Material Symbols yok)
    layout/  (Header, Footer)   ui/  (Hero, ProductCard, Reveal, ...)
    admin/  cart/  providers/  reviews/
  lib/                     # Ortak yardımcılar (data, flyToCart, site, utils)
  modules/                 # Domain modülleri
    catalog/   (types, queries, recommendations, client, recently-viewed-store)
    cart/      (store, sync)   wishlist/ (store)   reviews/
    checkout/  (service, reservation, webhooks)    orders/ (order, queries)
    admin/     (dashboard, products, orders, categories, users, reviews)
    auth/      (config, guards)
  infrastructure/          # Dış servis bağlantıları (global singleton)
    prisma/  redis/  (rate-limit)  stripe/  storage/
  prisma/
    schema.prisma          # Veri modeli
    migrations/            # (1) init → (…) → product_editorial_fields
    seed.ts                # Örnek veriler + demo admin
scripts/
  order-smoke.ts           # Stok/sipariş regresyon testleri
  webhook-smoke.ts         # Webhook imza + idempotency testleri
public/uploads/products/   # Admin görsel upload'ları (gitignore'lu)
```

## Veri modeli (Prisma)

- `User` — hesap, rol (ADMIN/CUSTOMER), bcrypt parola hash'i
- `Account` / `Session` / `VerificationToken` — Auth.js adaptör tabloları
- `Category` / `Product` / `ProductImage` / `ProductVariant` — katalog; varyant `productId+size+color` benzersiz, `sku` benzersiz. Product'ta **editorial alanlar:** `objectNumber` (LD-001…), `campaign`, `material`, `weight`, `fit`, `releaseDate`
- `Order` / `OrderItem` — siparişler; `orderNumber` + `stripeSessionId` + `stripePaymentIntentId` benzersiz; kalemlerde ürün adı/fiyat/SKU/görsel snapshot'ı; `stockConsumed`/`stockRestored` bayrakları
- `OrderReservation` — checkout'ta rezerve edilen stok kaydı (ACTIVE → CONSUMED/RELEASED); `expiresAt` (24 saat) üzerinden cron/lazy cleanup ile süresi dolan rezervasyonlar iade edilir; webhook buradan siparişi kurar
- `Cart` / `CartItem` — DB sepet şeması (aktif senkronizasyon Redis üzerinden)
- `Review` — `productId+userId` benzersiz (kullanıcı ürün başına bir yorum)
- `NewsletterSubscription` — abonelik e-postaları (`email` benzersiz, upsert)

Ürün durumu: `ACTIVE` | `DRAFT` | `SOLD_OUT`; rozetler: `NEW` | `LIMITED` | `SOLD OUT` (toplam varyant stoku 0 olduğunda otomatik SOLD OUT). Sipariş durumu: `PENDING` | `PAID` | `SHIPPED` | `DELIVERED` | `CANCELLED` | `REFUNDED` | `FAILED`.

## API Route'ları

| Metot | Yol | Açıklama |
| --- | --- | --- |
| GET/POST | `/api/cart/sync` | Redis sepetini oku/yaz (girişli) |
| GET/POST | `/api/reviews` | Ürün yorumları; POST girişli + rate limit |
| POST | `/api/newsletter` | E-posta aboneliği (doğrulama + rate limit 5/saat + upsert) |
| POST | `/api/checkout` | Stripe Checkout oturumu + stok rezervasyonu |
| POST | `/api/webhooks/stripe` | Webhook (imza doğrulamalı, idempotent) → Order/refund |
| POST | `/api/auth/register` | Kayıt (rate limit) |
| GET | `/api/cron/release-expired` | Süresi dolan rezervasyonları iade eder (cron, `CRON_SECRET` Bearer) |
| GET/POST | `/api/auth/[...nextauth]` | Auth.js handler'ı |
| POST | `/api/admin/products` | Ürün oluştur (ADMIN) |
| PUT/DELETE | `/api/admin/products/[id]` | Ürün güncelle/sil (ADMIN) |
| PATCH | `/api/admin/orders/[id]` | Sipariş durumu (ADMIN; iptal/iadede stok geri yüklenir) |
| GET/POST | `/api/admin/categories` · PUT/DELETE `/[id]` | Kategori CRUD (ADMIN) |
| GET | `/api/admin/users` · PATCH/DELETE `/[id]` | Kullanıcı arama/rol/silme (ADMIN, guard'lı) |
| GET | `/api/admin/reviews` · DELETE `/[id]` | Yorum moderasyonu (ADMIN) |
| POST | `/api/admin/upload` | Görsel yükleme (ADMIN; 5MB, mime whitelist) |

## CI/CD

`.github/workflows/ci.yml` — `main`/`master` push ve tüm PR'larda: `npm ci`, Prisma generate + `migrate deploy` (Postgres 16 + Redis 7 servisleri), TypeScript kontrolü, ESLint, production build, `npm test` ve `npm audit --omit=dev`. Deploy Vercel git entegrasyonuyla ayrıca yapılır.

## Test

```bash
npm test                    # tümü
npm run test:order          # stok rezervasyonu/iade, sipariş oluşturma, snapshot,
                            # idempotency, durum geçişleri (canlı DB üzerinde)
npm run test:webhook        # webhook imza doğrulama (eksik/bozuk→400, secretsız→500),
                            # expired/completed/refunded akışları + replay idempotency
```

## Güvenlik (OWASP Top 10)

| Alan | Durum |
| --- | --- |
| A01 Yetkilendirme | Tüm admin API'lerinde `requireAdmin()`; hesap sipariş detayı sahiplik/ADMIN kontrolü; sepet Redis key'i kullanıcıya bağlı |
| A02 Kriptografi | bcrypt cost 12, JWT `AUTH_SECRET`, düz metin şifre yok |
| A03 Enjeksiyon | Prisma parametrik sorgular (raw SQL yok); React otomatik escape; JSON-LD `<script>`'ler `serializeJsonLd()` ile escape edilir |
| A04 Tasarım | Rezervasyon expiry (`expiresAt` + cron + lazy cleanup); rate limitler aktif |
| A05 Yanlış yapılandırma | `next.config.ts` güvenlik başlıkları: **CSP** (script-src 'self' + va.vercel-scripts.com, frame-ancestors 'none', base-uri 'self', object-src 'none'), **HSTS** (2 yıl + preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy |
| A06 Bileşenler | `npm audit --omit=dev` → 0 vulnerability |
| A07 Kimlik doğrulama | Login brute-force koruması (10 deneme/15dk e-posta+IP); kayıt enumeration önlemi; güçlü şifre politikası; taze rol |
| A08 Bütünlük | Webhook imza doğrulaması + idempotency; fiyat snapshot'ları; amount-mismatch kontrolü; package-lock |
| A09 Loglama/izleme | Yapılandırılmış güvenlik logları (`lib/logger.ts` `[security]` JSON): login başarısız/rate-limited, admin rol değişimi, kullanıcı silme, ürün silme, sipariş durumu değişimi |
| A10 SSRF | Server-side kullanıcı URL fetch'i yok; `next/image` yalnızca `lh3.googleusercontent.com/aida-public/**`; OG ImageResponse fetch içermiyor |

CSP, ISR/statik sayfaları korumak için nonce'siz kuruldu (Next 16 dokümanındaki önerilen yöntem); `script-src 'unsafe-inline'` JSON-LD ve Next.js bootstrap script'leri için gereklidir, JSON-LD escape'i ile XSS riski kapatılır. `va.vercel-scripts.com` Vercel Analytics için izinlidir.

## Scriptler

```bash
npm run dev       # geliştirme sunucusu
npm run build     # production build
npm run start     # build sonrası sunucu
npm run analyze   # bundle analizi → .next/analyze/*.html (--webpack)
npm run lint      # ESLint
npm test          # order + webhook regresyon testleri
npx prisma db seed   # veritabanını örnek veriyle doldurur
```

## Prod (Vercel) notları

- `DATABASE_URL` → hosted PostgreSQL (ör. Neon/Supabase); `prisma migrate deploy` uygulanır.
- Redis → Upstash (Redis URL / REST değişkenleri). Yerel Memurai yalnızca geliştirme içindir.
- Stripe: canlı key'ler + endpoint/webhook secret; webhook URL'si prod adresine ayarlanmalıdır. `STRIPE_WEBHOOK_SECRET` boş/placeholder iken webhook 500 döner.
- `AUTH_SECRET` prod ortamına ayrı ve güvenli bir değerle tanımlanmalıdır.
- `NEXT_PUBLIC_SITE_URL` prod domain'ine ayarlanmalıdır (canonical/OG/sitemap/robots).
- **Vercel Cron:** `https://<domain>/api/cron/release-expired` her gün `Authorization: Bearer $CRON_SECRET` ile çalıştırılmalı (cron saati günde bir yeterli; checkout öncesi lazy cleanup zaten ikinci katman). `CRON_SECRET` her ortamda benzersiz ve uzun olmalıdır.
- **Görsel upload kalıcı değildir:** yüklemeler `public/uploads/` içine yazılır; Vercel serverless ortamında ephemeral'dir. Prod'ta CDN/object storage'a (ör. Cloudinary/UploadThing) geçilmeli — `/api/admin/upload` API yüzeyi (POST → `{ url }`) aynı kalacak şekilde değiştirilebilir.
- Analytics: `@vercel/analytics` Vercel'de otomatik devreye girer; yerel geliştirmede no-op'dur.

## Bilinen sınırlamalar / notlar

- Stripe key'leri `.env`'de placeholder (`pk_test_xxx`, `sk_test_xxx`, `whsec_xxx`) — gerçek key gelene kadar checkout/webhook 500 döner. Webhook testleri secret'ı test içinde geçici olarak override eder (canlı DB'ye bağımlı değildir).
- Stripe Checkout üzerinden gönderim adresi toplanmaz (`shippingAddress` şemada durur).
- Arama `ILIKE` (contains) ile yapılır; katalog büyüdükçe PostgreSQL `pg_trgm`/full-text'e geçiş önerilir.
- Görsel upload yalnızca ADMIN; dosya adı benzersiz (`<timestamp>-<hex>`), mime whitelist + 5MB limit. Prod'ta kalıcı depolama gerekir (yukarıya bakın).
- `next/og` ürün OG görseli `nodejs` runtime kullanır (Edge runtime deprecated uyarısı veriyordu).
- `npm run build` sonrası aynı `.next` ile `npm run dev` başlatmak `/api/auth/csrf` 404 bozulmasına yol açabiliyor; bu durumda `.next` silinip dev yeniden başlatılmalıdır.
- Statik tasarım verileri (`hero`, koleksiyon etiketleri, ürün görselleri/metinleri) `lib/data.ts`'ten gelir ve seed buradan beslenir; katalog okuma akışı (`modules/catalog/queries.ts`) tamamen DB'den okur.
