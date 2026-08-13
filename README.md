# LAST DANCE — Giyim Mağazası

Brutalist tasarımlı, tam yığın (full-stack) e-ticaret mağazası. Next.js 16 App Router, TypeScript, Tailwind CSS v4 üzerine kurulu; PostgreSQL (Prisma), Redis (Memurai/Upstash), Auth.js (NextAuth v5) ve Stripe entegrasyonlu.

## Teknolojiler

| Katman | Kullanılan |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS v4, Material Symbols, CSS token tabanlı tema |
| Animasyon | GSAP, Lenis (smooth scroll), `Reveal` bileşeni |
| Veritabanı | PostgreSQL 18 + Prisma 7 (`@prisma/adapter-pg`) |
| Cache / state | Redis (ioredis) — Memurai (yerel) / Upstash (prod) |
| Auth | Auth.js (next-auth v5 beta) — Credentials + PrismaAdapter, JWT session |
| Ödeme | Stripe Checkout + webhook ile sipariş oluşturma |
| State (client) | Zustand (persist) — sepet |

## Özellikler

- **Vitrin:** Anasayfa (hero + yeni gelenler), koleksiyonlar/kategoriler, ürün listeleme ve detay (SSG, slug tabanlı), beden seçimi, ürün görselleri.
- **Katalog DB'den:** Ürünler `lib/catalog.ts` üzerinden Prisma ile çekilir; statik veri (`lib/data.ts`) yalnızca görsel tasarım alanlarında (hero, koleksiyon etiketleri) kullanılır.
- **Kimlik doğrulama:** Kayıt + giriş (`/giris`), şifre `bcryptjs` ile hash'li; rol (ADMIN/CUSTOMER) JWT token üzerinden session'a taşınır.
- **Hesap sayfası:** `/hesabim` — girişli kullanıcının sipariş geçmişi; authsuz kullanıcılar `/giris`'e yönlendirilir.
- **Sepet:** Zustand + localStorage kalıcılığı, girişli kullanıcılarda Redis'e senkronizasyon (`/api/cart/sync`, TTL 30 gün); giriş yapınca sunucu+yerel sepet birleştirilir (debounce'lu push).
- **Yorumlar:** Girişli kullanıcı ürün başına bir yorum/puan bırakabilir (upsert), hız sınırı 10/saat, ortalama puan gösterimi.
- **Stripe Checkout:** Sepet içeriği metadata'da taşınır; webhook `checkout.session.completed` ile sipariş + sipariş kalemlerini idempotent (stripeSessionId benzersiz) oluşturur.
- **Admin paneli:** `/admin` — sadece ADMIN rolüne açık (guard'lı layout). Dashboard istatistikleri, ürün CRUD (oluştur/düzenle/sil), sipariş durumu yönetimi (PENDING→CANCELLED).
- **Rate limiting:** Redis tabanlı hız sınırı (kayıt 10/15dk, yorum 10/saat). Redis yokken fail-open.

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

Gerekli ayarlar:

| Değişken | Açıklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL bağlantı adresi (yerel: `postgresql://postgres:postgres@localhost:5432/giyim_magazasi?schema=public`) |
| `REDIS_URL` | Redis bağlantı adresi (yerel Memurai: `redis://localhost:6379`; prod Upstash REST değerleri ayrı alanlarda) |
| `STRIPE_SECRET_KEY` | Stripe `sk_test_...` / `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook `whsec_...` |
| `AUTH_SECRET` | `npx auth secret` ile üretilebilir |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | Uygulama adresi (yerel: `http://localhost:3000`) |

### 3. Veritabanı

PostgreSQL'in çalışıyor olması gerekir. Veritabanı, migrasyonlar ve seed:

```bash
npx prisma migrate dev --name init
npx prisma migrate dev        # kalan migrasyonlar (auth, subtitle)
npx prisma generate
npx prisma db seed
```

Seed içeriği: 5 kategori, 11 ürün (varyant + görseller) ve demo admin kullanıcısı.

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
  admin/                 # Yönetim paneli (guard layout, dashboard, ürünler, siparişler)
  api/
    admin/               # Ürün CRUD + sipariş durumu (ADMIN)
    auth/                # NextAuth handler + kayıt
    cart/sync/           # Redis sepet senkronizasyonu
    checkout/            # Stripe Checkout oturumu
    reviews/             # Yorum listeleme/ekleme
    webhooks/stripe/     # Ödeme webhook'u (sipariş oluşturur)
  giris/                 # Giriş / kayıt
  hesabim/               # Kullanıcı sipariş geçmişi
  koleksiyonlar/         # Kategori/filtre sayfası
  sepet/                 # Sepet + checkout başlatma
  urunler/[slug]/        # Ürün detayı (SSG)
components/
  admin/  animations/  auth/  cart/  layout/  providers/  reviews/  store/
lib/
  admin.ts               # requireAdmin, ORDER_STATUSES, slugify
  auth.ts                # NextAuth yapılandırması
  cartSync.ts            # client: pull/push/merge sepet
  catalog.ts             # server-only: Prisma → vitrin Product mapper
  data.ts                # statik tasarım verisi (hero, koleksiyonlar, format)
  flyToCart.ts           # "sepete uç" animasyonu
  prisma.ts / redis.ts / stripe.ts   # istemci örnekleri (global singleton)
  rateLimit.ts           # Redis tabanlı hız sınırı
store/
  cart.ts                # Zustand sepet store (persist)
prisma/
  schema.prisma          # Veri modeli
  seed.ts                # Örnek veriler + demo admin
```

## Veri modeli (Prisma)

- `User` — hesap, rol (ADMIN/CUSTOMER), bcrypt parola hash'i
- `Account` / `Session` / `VerificationToken` — Auth.js adaptör tabloları
- `Category` / `Product` / `ProductImage` / `ProductVariant` — katalog; varyant `productId+size+color` benzersiz
- `Order` / `OrderItem` — siparişler; `stripeSessionId` benzersiz (idempotent webhook)
- `Cart` / `CartItem` — DB sepet şeması (aktif senkronizasyon Redis üzerinden)
- `Review` — `productId+userId` benzersiz (kullanıcı ürün başına bir yorum)

Ürün durumu: `ACTIVE` | `DRAFT` | `SOLD_OUT`; rozetler: `NEW` | `LIMITED` | `SOLD OUT`.

## API Route'ları

| Metot | Yol | Açıklama |
| --- | --- | --- |
| GET/POST | `/api/cart/sync` | Redis sepetini oku/yaz (girişli) |
| GET/POST | `/api/reviews` | Ürün yorumları; POST girişli + rate limit |
| POST | `/api/checkout` | Stripe Checkout oturumu oluşturur |
| POST | `/api/webhooks/stripe` | `checkout.session.completed` → Order oluşturur |
| POST | `/api/auth/register` | Kayıt (rate limit) |
| GET/POST | `/api/auth/[...nextauth]` | Auth.js handler'ı |
| POST | `/api/admin/products` | Ürün oluştur (ADMIN) |
| PUT/DELETE | `/api/admin/products/[id]` | Ürün güncelle/sil (ADMIN) |
| PATCH | `/api/admin/orders/[id]` | Sipariş durumu güncelle (ADMIN) |

## Scriptler

```bash
npm run dev       # geliştirme sunucusu
npm run build     # production build
npm run start     # build sonrası sunucu
npm run lint      # ESLint
npx prisma db seed   # veritabanını örnek veriyle doldurur
```

## Prod (Vercel) notları

- `DATABASE_URL` → hosted PostgreSQL (ör. Neon/Supabase); `prisma migrate deploy` uygulanır.
- Redis → Upstash (Redis URL / REST değişkenleri). Yerel Memurai yalnızca geliştirme içindir.
- Stripe: canlı key'ler + endpoint/webhook secret; webhook URL'si prod adresine ayarlanmalıdır.
- `AUTH_SECRET` prod ortamına ayrı ve güvenli bir değerle tanımlanmalıdır.

## Bilinen sınırlamalar / notlar

- Stripe canlı testi için gerçek key gerekir (yerel geliştirmede `sk_test_...` + webhook CLI).
- Sipariş stok düşmez; webhook yalnızca ürün slug'ını metadata'dan eşleştirir (ürün silinmişse `productId` boş kalır).
- Statik tasarım verileri (`hero`, koleksiyon etiketleri) `lib/data.ts`'ten gelir; DB'den bağımsızdır.
