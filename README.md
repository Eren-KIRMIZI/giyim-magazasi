# LAST DANCE — Giyim Mağazası

Brutalist tasarımlı, tam yığın (full-stack) e-ticaret mağazası. Next.js 16 App Router, TypeScript, Tailwind CSS v4 üzerine kurulu; PostgreSQL (Prisma), Redis (Memurai/Upstash), Auth.js (NextAuth v5), Stripe ve Vercel Analytics entegrasyonlu.

## Özellikler

### Vitrin
- **Anasayfa:** hero + yeni gelenler + koleksiyon bölümleri, GSAP/Lenis animasyonlu `Reveal`.
- **Koleksiyonlar:** `/koleksiyonlar` — kategori, beden ve fiyat filtresi; mobilde toggle panel; "Recently Viewed" bölümü.
- **Arama:** `/search` — server-side arama (`?q=&kategori=&beden=&renk=&fiyatmin=&fiyatmax=&stok=1&sirala=`), ILIKE tabanlı (isim/alt başlık/açıklama), sıralama: newest / price_asc / price_desc / popular (sipariş adedine göre). Filtreler URL'e yazılır (paylaşılabilir, SSR); `/search` noindex; `loading.tsx` iskelet ekranı. Header'daki arama ikonu buraya gider.
- **Ürün detayı:** `/urunler/[slug]` (SSG, slug tabanlı) — görsel galeri, beden/renk seçimi, varyant bazlı **stok kontrolü** (seçili size+color'a göre; 0 stokta buton disabled + "Sold Out", ≤5 stokta "Son X adet" uyarısı), **Add to Bag + Buy Now** (sepete ekleyip `/sepet`'e yönlendirir), favori butonu, "Complete the Look" önerileri (**aynı kategori öncelikli**), yorumlar, mobilde **sticky add-to-cart barı**.
- **Wishlist (favoriler):** `/begendiklerim` — Zustand + localStorage kalıcılığı; ürün kartlarında kalp, ürün detayında buton, Header'da rozetli kalp + mobil menü linki.
- **Yakın zamanda bakılanlar:** localStorage'da tutulur (max 8), `/koleksiyonlar` altında listelenir.
- **Sepet:** Zustand + localStorage; **adet üst sınırı stokla clamp'lenir** (varyant `maxQuantity`), girişli kullanıcılarda Redis senkronizasyonu.
- **Newsletter:** `/newsletter` sayfası + `/api/newsletter` (e-posta doğrulama, IP bazlı rate limit 5/saat, `NewsletterSubscription` tablosuna upsert); anasayfa `CollectionsSection` içindeki form da aynı API'yi kullanır.
- **Bilgi sayfaları:** `/shipping`, `/returns`, `/terms`, `/contact` — footer linkleri; özel **404** (`not-found.tsx`), hata (`error.tsx` + `retry`) ve kök hata (`global-error.tsx`) sayfaları.

### Kimlik, hesap ve sipariş
- **Kimlik doğrulama:** kayıt + giriş (`/giris`), `bcryptjs` hash, rol (ADMIN/CUSTOMER) JWT session'da; Redis tabanlı rate limit (kayıt 10/15dk, yorum 10/saat, Redis yokken fail-open).
- **Hesap:** `/hesabim` — sipariş geçmişi; `/hesabim/[orderNumber]` — sipariş detayı (sahibi veya admin).
- **Yorumlar:** girişli kullanıcı ürün başına bir yorum/puan (upsert, `productId+userId` benzersiz), ortalama puan.
- **Stripe Checkout (production-safe):** sepet sunucuda doğrulanır, fiyatlar **DB'den okunur ve sipariş kalemlerine snapshot** alınır; checkout'ta varyant bazlı **atomik stok rezervasyonu** (`OrderReservation`). Webhook imza doğrulamalı + idempotent (`stripeSessionId`/`stripePaymentIntentId` benzersiz):
  - `checkout.session.completed` → Order + kalem snapshot'ları (isim/fiyat/SKU/görsel/beden/renk) oluşturur, rezervasyonu CONSUMED yapar.
  - `expired` / `async_payment_failed` → stok iade + CANCELLED/FAILED kaydı.
  - `charge.refunded` → stok geri + REFUNDED (`stockRestored` ile tek sefer).
  - Sipariş numarası: `LD-2026-XXXXXX`. Ürün sonradan silinse/silinse de sipariş kalemleri ayakta kalır.

### Admin paneli (`/admin`, sadece ADMIN)
- **Dashboard:** ürün/sipariş/kullanıcı/kategori sayaçları; toplam + son 30 gün ciro; son 24 saat iptal/fail; aktif rezervasyon; **30 günlük günlük ciro SVG grafiği** (bağımlılıksız); en çok satanlar (adet + ciro); **düşük stok uyarıları (≤5)**; son siparişler.
- **Ürünler:** CRUD (`/admin/urunler`, oluştur/düzenle), **görsel yükleme** (`/api/admin/upload` — 5MB, jpeg/png/webp/gif/avif; `public/uploads/products/<ts>-<hex>.<ext>`), varyant stok satırları.
- **Kategoriler:** CRUD (`/admin/kategoriler`); ürünü olan kategori silinemez (409).
- **Kullanıcılar:** `/admin/kullanicilar` — arama, rol değiştirme, silme (koruma: kendini/ son admin'i düşüremez, kendini silemez, sipariş/yorum/sepeti olan kullanıcı silinemez).
- **Yorumlar:** `/admin/yorumlar` — ürün adıyla arama + silme (moderasyon).

### SEO / Büyüme (Phase 4)
- **Metadata:** `metadataBase` + canonical/OG/twitter; ürün sayfası dinamik `generateMetadata`; home'da Organization, üründe **Product + BreadcrumbList JSON-LD**; `/search` ve kişisel sayfalar noindex.
- **sitemap.xml** (statik + bilgi sayfaları + tüm ürünler, `updatedAt`) ve **robots.txt** (admin/hesap/sepet/favori/search/api gizli).
- **OG görselleri:** kök `opengraph-image` (brutalist anasayfa kartı) + ürün sayfası dinamik `opengraph-image` (ad, fiyat, kategori) — `next/og` ImageResponse, `nodejs` runtime.
- **Analytics:** `@vercel/analytics` (`<Analytics/>` layout'ta); checkout başarısında `track("order_completed")` conversion event'i.
- **lib/site.ts:** `SITE_URL` (`.env` → `NEXT_PUBLIC_SITE_URL`, yoksa `https://lastdance.store`).

## Teknolojiler

| Katman | Kullanılan |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS v4, Material Symbols, CSS token tabanlı tema |
| Animasyon | GSAP, Lenis (smooth scroll), `Reveal` bileşeni |
| Veritabanı | PostgreSQL + Prisma 7 (`@prisma/adapter-pg`) |
| Cache / state | Redis (ioredis) — Memurai (yerel) / Upstash (prod) |
| Auth | Auth.js (next-auth v5 beta) — Credentials + PrismaAdapter, JWT session |
| Ödeme | Stripe Checkout + webhook ile sipariş oluşturma |
| State (client) | Zustand (persist) — sepet, favoriler, son bakılanlar |
| Analytics | `@vercel/analytics` (pageview + özel event) |
| SEO | Next metadata (OG/twitter/canonical), `sitemap.ts`/`robots.ts`, `next/og` (ImageResponse) |

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

> Not: `next.config.ts`'te görsel uzak host yalnızca `lh3.googleusercontent.com` (`/aida-public/**`) için açık. `public/uploads` lokaldir ve `images.remotePatterns` gerektirmez.

### 3. Veritabanı

PostgreSQL'in çalışıyor olması gerekir. Migrasyonlar ve seed:

```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

Seed içeriği: kategoriler, ürünler (varyant + görseller) ve demo admin kullanıcısı.

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
app/
  page.tsx                 # Anasayfa (metadata + Organization JSON-LD)
  layout.tsx               # Kök layout (fonts, metadataBase, Analytics)
  robots.ts / sitemap.ts   # robots.txt + sitemap.xml
  admin/                   # Yönetim paneli (guard layout)
    page.tsx, SalesChart.tsx           # Dashboard + 30 gün SVG grafiği
    urunler/  (yeni, [id]/duzenle)     # Ürün CRUD + ProductList
    kategoriler/  kullanicilar/  yorumlar/  # Yönetim UI'ları
    siparisler/   ([id])               # Sipariş listesi + detay/durum
  api/
    admin/               # products, orders/[id], categories, users,
                         # reviews, upload (hepsi ADMIN guard'lı)
    auth/                # NextAuth handler + kayıt
    cart/sync/           # Redis sepet senkronizasyonu
    checkout/            # Stripe Checkout oturumu + stok rezervasyonu
    newsletter/          # E-posta aboneliği (rate limit + upsert)
    reviews/             # Yorum listeleme/ekleme (rate limit)
    webhooks/stripe/     # Ödeme webhook'u (imza + idempotent)
  not-found.tsx / error.tsx / global-error.tsx  # 404 + hata sınırları
  opengraph-image.tsx    # Kök OG görseli (ImageResponse)
  begendiklerim/         # Wishlist sayfası (client)
  newsletter/  shipping/  returns/  terms/  contact/   # Bilgi sayfaları
  giris/  hesabim/  sepet/  koleksiyonlar/  search/  urunler/[slug]/
  urunler/[slug]/opengraph-image.tsx    # Ürün OG görseli (ImageResponse)
components/
  admin/  animations/  auth/  cart/  layout/  providers/  reviews/  store/
lib/
  admin.ts               # requireAdmin, ORDER_STATUSES, slugify
  auth.ts                # NextAuth yapılandırması
  cartSync.ts            # client: pull/push/merge sepet
  catalog.ts             # server-only: Prisma → vitrin Product mapper,
                         # searchProducts, getAllCategories
  data.ts                # statik tasarım verisi (hero, koleksiyonlar, format)
  flyToCart.ts           # "sepete uç" animasyonu
  order.ts               # reserveStock/releaseStock/createOrderFromReservation/
                         # applyOrderStatusChange + durum sabitleri
  prisma.ts / redis.ts / stripe.ts     # istemci örnekleri (global singleton)
  rateLimit.ts           # Redis tabanlı hız sınırı
  site.ts                # SITE_URL / SITE_NAME sabitleri (SEO)
store/
  cart.ts                # Zustand sepet (persist) — maxQuantity clamp
  wishlist.ts            # Zustand favoriler (persist)
  recentlyViewed.ts      # Zustand son bakılanlar (persist, max 8)
prisma/
  schema.prisma          # Veri modeli
  seed.ts                # Örnek veriler + demo admin
scripts/
  order-smoke.ts         # Stok/sipariş regresyon testleri
  webhook-smoke.ts       # Webhook imza + idempotency testleri
public/uploads/products/ # Admin görsel upload'ları (gitignore'lu)
```

## Veri modeli (Prisma)

- `User` — hesap, rol (ADMIN/CUSTOMER), bcrypt parola hash'i
- `Account` / `Session` / `VerificationToken` — Auth.js adaptör tabloları
- `Category` / `Product` / `ProductImage` / `ProductVariant` — katalog; varyant `productId+size+color` benzersiz, `sku` benzersiz
- `Order` / `OrderItem` — siparişler; `orderNumber` + `stripeSessionId` + `stripePaymentIntentId` benzersiz; kalemlerde ürün adı/fiyat/SKU/görsel snapshot'ı; `stockConsumed`/`stockRestored` bayrakları
- `OrderReservation` — checkout'ta rezerve edilen stok kaydı (ACTIVE → CONSUMED/RELEASED); webhook buradan siparişi kurar veya süresi dolunca stoku iade eder
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
| GET/POST | `/api/auth/[...nextauth]` | Auth.js handler'ı |
| POST | `/api/admin/products` | Ürün oluştur (ADMIN) |
| PUT/DELETE | `/api/admin/products/[id]` | Ürün güncelle/sil (ADMIN) |
| PATCH | `/api/admin/orders/[id]` | Sipariş durumu (ADMIN; iptal/iadede stok geri yüklenir) |
| GET/POST | `/api/admin/categories` · PUT/DELETE `/[id]` | Kategori CRUD (ADMIN) |
| GET | `/api/admin/users` · PATCH/DELETE `/[id]` | Kullanıcı arama/rol/silme (ADMIN, guard'lı) |
| GET | `/api/admin/reviews` · DELETE `/[id]` | Yorum moderasyonu (ADMIN) |
| POST | `/api/admin/upload` | Görsel yükleme (ADMIN; 5MB, mime whitelist) |

## Test

```bash
npm test                    # tümü
npm run test:order          # stok rezervasyonu/iade, sipariş oluşturma, snapshot,
                            # idempotency, durum geçişleri (canlı DB üzerinde)
npm run test:webhook        # webhook imza doğrulama (eksik/bozuk→400, secretsız→500),
                            # expired/completed/refunded akışları + replay idempotency
```

## Scriptler

```bash
npm run dev       # geliştirme sunucusu
npm run build     # production build
npm run start     # build sonrası sunucu
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
- **Görsel upload kalıcı değildir:** yüklemeler `public/uploads/` içine yazılır; Vercel serverless ortamında ephemeral'dir. Prod'ta CDN/object storage'a (ör. Cloudinary/UploadThing) geçilmeli — `/api/admin/upload` API yüzeyi (POST → `{ url }`) aynı kalacak şekilde değiştirilebilir.
- Analytics: `@vercel/analytics` Vercel'de otomatik devreye girer; yerel geliştirmede no-op'dur.

## Bilinen sınırlamalar / notlar

- Stripe key'leri `.env`'de placeholder (`pk_test_xxx`, `sk_test_xxx`, `whsec_xxx`) — gerçek key gelene kadar checkout/webhook 500 döner. Webhook testleri secret'ı test içinde geçici olarak override eder (canlı DB'ye bağımlı değildir).
- Stripe Checkout üzerinden gönderim adresi toplanmaz (`shippingAddress` şemada durur).
- Arama `ILIKE` (contains) ile yapılır; katalog büyüdükçe PostgreSQL `pg_trgm`/full-text'e geçiş önerilir.
- Görsel upload yalnızca ADMIN; dosya adı benzersiz (`<timestamp>-<hex>`), mime whitelist + 5MB limit. Prod'ta kalıcı depolama gerekir (yukarıya bakın).
- `next/og` ürün OG görseli `nodejs` runtime kullanır (Edge runtime deprecated uyarısı veriyordu).
- `npm run build` sonrası aynı `.next` ile `npm run dev` başlatmak `/api/auth/csrf` 404 bozulmasına yol açabiliyor; bu durumda `.next` silinip dev yeniden başlatılmalıdır.
- Statik tasarım verileri (`hero`, koleksiyon etiketleri) `lib/data.ts`'ten gelir; DB'den bağımsızdır. Katalog akışı (`lib/catalog.ts`) tamamen DB'den okur.
