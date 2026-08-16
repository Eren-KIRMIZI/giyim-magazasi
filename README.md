# LAST DANCE - Giyim Magazasi

Brutalist tasarimli, tam yigin (full-stack) e-ticaret platformu. Next.js 16 App Router, TypeScript ve Tailwind CSS v4 uzerine kuruludur; PostgreSQL (Prisma 7), Redis (Memurai / Upstash), Auth.js (NextAuth v5), Stripe Checkout ve Vercel Analytics entegrasyonuna sahiptir.

---

## 1. Ozellikler

### Vitrin
- **Anasayfa:** Hero, yeni gelenler ve koleksiyon bolumleri; Reveal bileseni IntersectionObserver ve CSS transition ile calisir (prefers-reduced-motion destekli); template.tsx GSAP sayfa gecis animasyonu icerir. Hero bolumunde dikey arsiv etiketi ve marquee kayan yazi bandi bulunur.
- **Header:** Ust duyuru bandi marquee animasyonlu, yapiskan (sticky) ve backdrop-blur navigasyon, aktif link cizgisi, gercek navigasyon linkleri (New Arrivals, Collections, Newsletter), arama, favori ve sepet ikonlari, sepet/favori sayac rozetleri, tam ekran mobil menu (body scroll kilidi ve tema gecisi ile).
- **Urun Karti:** Urun sirasina gore nesne numaralandirma, urun renk numuneleri (swatches), hover durumunda ikinci gorsele yumusak gecis, indirimli fiyat (compareAtPrice) ve cizili fiyat gosterimi, favori butonu.
- **Koleksiyonlar:** /koleksiyonlar - Kategori, beden, renk ve fiyat filtreleme; mobilde acilir filtre paneli; son incelenen urunler (Recently Viewed) bolumu.
- **Arama:** /search - Sunucu tarafli arama, ILIKE tabanli filtreleme (isim, alt baslik, aciklama), siralama secenekleri (newest, price_asc, price_desc, popular). Filtreler URL parametrelerine senkronize edilir, aktif filtre cipleri uzerinden tek tikla kaldirilabilir.
- **Urun Detayi:** /urunler/[slug] (SSG, slug tabanli) - Gorsel galeri (sayac, minyaturler ve klavye/ok gecisi), beden/renk secimi, varyant bazli stok kontrolu (tukenen varyantlarda disabled durumu, kritik stokta adet uyarisi ve dinamik stok cubugu), sepete ekleme ve hemen satin alma (Buy Now), favori butonu, editorial ozellikler tablosu (nesne no, kampanya, kumas, gramaj, kalip, cikis tarihi), dogrulanmis musteri yorumlari bolumu.
- **Favoriler (Wishlist):** /begendiklerim - Zustand ve localStorage kaliciligi ile urun kartlarinda ve detay sayfasinda favori yonetimi.
- **Karanlik Mod (Dark Mode):** CSS degiskenleri uzerinden calisan tema yonetimi (ThemeToggle bileseni, useSyncExternalStore, localStorage ve sistem tercihi destegi, sifir parlama saglayan no-flash inline script).
- **Sepet:** Zustand ve localStorage entegrasyonlu sepet yapisi; urun adetleri stok limitine gore sinirlandirilir; oturum acmis kullanicilarda Redis uzerinden cift yonlu senkronizasyon saglanir; ucretsiz kargo esik cubugu ve hizli odeme yonlendirmesi bulunur.
- **Bulten (Newsletter):** /newsletter sayfasi ve API rotasi (e-posta formati dogrulama, IP bazli rate limit, veri tabanina kayit).
- **Bilgi Sayfalari:** /shipping, /returns, /terms, /contact sayfalari; ozel 404 (not-found.tsx), hata yakalama (error.tsx) ve global hata (global-error.tsx) sinirlari.

### Kimlik ve Siparis Yonetimi
- **Kimlik Dogrulama:** Kayit ve giris (/giris), bcryptjs parola hash'leme (cost 12), NextAuth v5 JWT oturum stratejisi; rol kontrolu (ADMIN/CUSTOMER) guvenlik amaciyla her istekte veri tabanindan guncel olarak dogrulanir; Redis tabanli brute-force ve rate limit korumasi (IP ve e-posta bazli).
- **Hesap Paneli:** /hesabim - Siparis gecmisi listesi ve /hesabim/[orderNumber] uzerinden detayli siparis takibi.
- **Yorum Sistemi:** Oturum acmis kullanicilar icin urun bazinda puanlama ve yorum yapma (upsert mantigi ile her kullanici urun basina tek yorum girebilir).
- **Stripe Checkout:** Sepet verisi sunucuda dogrulanir; fiyatlar veri tabanindan okunarak siparis kalemlerine anlik snapshot alinir; checkout asamasinda atomik stok rezervasyonu (OrderReservation) yapilir. Webhook imza dogrulamali ve idempotent calisir:
  - checkout.session.completed: Siparis ve kalem snapshot'larini olusturur, rezervasyonu tuketildi (CONSUMED) durumuna getirir.
  - expired / async_payment_failed: Rezervasyon serbest birakilir, stok iade edilir.
  - charge.refunded: Iade durumunda stok geri yuklenir (stockRestored bayragi ile tekil islem).
  - Rezervasyon Zaman Asimi: Her rezervasyona 24 saatlik sure taninir; suresi dolan rezervasyonlar cron gorevi (/api/cron/release-expired) veya odeme oncesi kontrol ile otomatik serbest birakilir.

### Yonetim Paneli (/admin, Sadece ADMIN Rolu)
- **Gosterge Paneli (Dashboard):** Urun, siparis, kullanici ve kategori sayaclari; toplam ve son 30 gunluk ciro; aktif rezervasyon ve basarisiz islem sayilari; 30 gunluk ciro SVG cizgi grafigi; en cok satanlar; kritik stok uyarilari (5 ve alti); son siparisler tablosu.
- **Urun Yonetimi:** /admin/urunler - Urun ekleme, duzenleme, silme; editoryal veri alanlari, gorsel yukleme (/api/admin/upload), varyant ve stok tablosu yonetimi.
- **Kategori Yonetimi:** /admin/kategoriler - Kategori ekleme, guncelleme, silme (urunu bulunan kategori silinemez).
- **Kullanici Yonetimi:** /admin/kullanicilar - Kullanici arama, rol degistirme ve guvenli silme (admin kendini silemez / dusuremez).
- **Yorum Moderasyonu:** /admin/yorumlar - Urun yorumlarini inceleme ve moderasyon amacli silme.
- **Siparis Yonetimi:** /admin/siparisler ve /admin/siparisler/[id] - Siparis filtreleme, detay inceleme ve durum guncelleme (iptal durumunda stok iadesi tetiklenir).
- **Fashion Studio:** /admin/ai-studio - Gorsel modelleme ve katalog studiyosu entegrasyonu.

---

## 2. Teknolojiler

| Katman | Kullanilan Teknolojiler |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Stil | Tailwind CSS v4, CSS Token Tabanli Tema, Inline SVG Ikonlar |
| Animasyon | GSAP, Lenis Smooth Scroll, Reveal (IntersectionObserver) |
| Veri Tabani | PostgreSQL, Prisma 7 (@prisma/adapter-pg, prisma.config.ts) |
| Onbellek ve Hiz Sinirlama | Redis (ioredis / Upstash REST API) |
| Kimlik Dogrulama | Auth.js (NextAuth v5 beta), Credentials Provider, PrismaAdapter |
| Odeme | Stripe Checkout, Webhook Entegrasyonu, Atomik Stok Yonetimi |
| Durum Yonetimi (Client) | Zustand (persist middleware) |
| Analitik ve SEO | @vercel/analytics, Metadata API, JSON-LD, sitemap.ts, robots.ts, next/og |

---

## 3. Kurulum ve Calistirma

### 1. Bagimliliklar
```bash
npm install
```

### 2. Ortam Degiskenleri
`.env.example` dosyasini `.env` olarak kopyalayip ilgili degerleri girin:

```bash
cp .env.example .env
```

| Degisken | Aciklama |
| --- | --- |
| `DATABASE_URL` | PostgreSQL baglanti adresi |
| `REDIS_URL` | Redis baglanti adresi (yerel gelistirme icin Memurai / Redis) |
| `UPSTASH_REDIS_REST_URL` | Prod Redis REST URL (Upstash) |
| `UPSTASH_REDIS_REST_TOKEN` | Prod Redis REST Token (Upstash) |
| `STRIPE_SECRET_KEY` | Stripe gizli anahtari (sk_test_...) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe genel anahtari (pk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook dogrulama anahtari (whsec_...) |
| `AUTH_SECRET` | NextAuth oturum sifreleme anahtari (npx auth secret) |
| `AUTH_URL` / `NEXT_PUBLIC_APP_URL` | Uygulama ana adresi (ornegin http://localhost:3000) |
| `NEXT_PUBLIC_SITE_URL` | SEO kanonik URL adresi |
| `ALLOWED_ORIGINS` | Guvenli yonlendirme icin izin verilen origin listesi |
| `CRON_SECRET` | Sure asimi temizleme endpoint'i icin Bearer token |
| `OPENROUTER_API_KEY` | Fashion Studio servis anahtari |

### 3. Veri Tabani Kurulumu
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db seed
```

Seed verisi; 5 ana kategori (hoodies, tees, bottoms, footwear, accessories), 11 ornek editoryal urun ve demo yonetici hesabi icerir.

### 4. Gelistirme Sunucusu
```bash
npm run dev
```
Uygulama `http://localhost:3000` adresinde calisir.

### Demo Hesap
- **Rol:** Admin
- **E-posta:** `demo@lastdance.store`
- **Sifre:** `demo1234`
- **Panel:** `http://localhost:3000/admin`

---

## 4. Proje Dizin Yapisi

```
src/
  app/                       # App Router sayfalari ve API rotalari
    layout.tsx               # Kok layout (fontlar, metadata, analitik)
    template.tsx             # Sayfa gecis animasyonlari
    page.tsx                 # Anasayfa
    robots.ts / sitemap.ts   # SEO motor yapilandirmalari
    opengraph-image.tsx      # Dinamik OG kartlari
    not-found.tsx / error.tsx
    (storefront)/            # Magaza arayuzu (urunler, koleksiyonlar, search, sepet)
    (auth)/                  # Giris ve kayit sayfalari
    (account)/               # Kullanici hesap ve siparis sayfalari
    admin/                   # Yonetim paneli sayfalari
    api/                     # REST API ve webhook uclari
  components/
    icons.tsx                # Inline SVG ikon bilesenleri
    layout/                  # Header, Footer
    ui/                      # ProductCard, Hero, Reveal, EmptyState, Skeleton
    admin/                   # Admin form ve veri tablolari
    cart/                    # Sepet senkronizasyon bilesenleri
    reviews/                 # Yorum listeleme ve ekleme bilesenleri
  infrastructure/            # Dagitik servis adaptörleri (Prisma, Redis, Stripe, Storage)
  lib/                       # Yardimci fonksiyonlar, konfigurasyon, formatlayicilar
  modules/                   # Domain-Driven Core Modulleri
    catalog/                 # Urun sorgulari, filtreler, tipler
    cart/                    # Zustand sepet store'u ve senkronizasyon
    wishlist/                # Favoriler store'u
    checkout/                # Stok rezervasyonu ve odeme servisi
    orders/                  # Siparis durumu ve sorgulari
    admin/                   # Admin metrikleri ve veri islemleri
    auth/                    # Kimlik dogrulama ve guvenlik
  prisma/
    schema.prisma            # Veri modeli tanimlari
    migrations/              # Veri tabani migrasyon dosyalari
    seed.ts                  # Baslangic veri yukleyici
scripts/
  order-smoke.ts             # Siparis ve stok regresyon testleri
  webhook-smoke.ts           # Webhook imza ve idempotency testleri
```

---

## 5. Guvenlik ve Mimari Ilkeler

- **Yetkilendirme:** Tum admin rotalarinda `requireAdmin()` ve session kontrolleri uygulanir.
- **Kriptografi:** Sifreler bcrypt (cost 12) ile saklanir, duz metin parola tutulmaz.
- **Enjeksiyon Korumasi:** Prisma parametrik sorgulari kullanilir; HTML ve script enjeksiyonlarina karsi otomatik cikti kacisi (escape) saglanir.
- **Guvenlik Basliklari (CSP):** `next.config.ts` uzerinde Strict CSP, HSTS, X-Frame-Options (DENY), X-Content-Type-Options (nosniff) ve Permissions-Policy tanimlidir.
- **Hiz Sinirlama (Rate Limiting):** Redis tabanli sliding window algoritmasi ile giris, kayit ve odeme istekleri guvenceye alinmistir.
- **Zamanlama Saldirilari Korumasi:** Olmayan kullanici giris denemelerinde de ayni bcrypt hesaplama maliyeti isletilerek yanit suresi analizine dayali kullanici taramalari engellenir.

---

## 6. Test ve Komutlar

```bash
npm run typecheck    # TypeScript tip kontrolu (tsc --noEmit)
npm run lint         # ESLint kontrolu
npm run test         # Siparis ve webhook testlerini calistirir
npm run test:order   # Stok rezervasyon ve siparis akisi testleri
npm run test:webhook # Webhook imza ve tekrar (replay) testleri
npm run build        # Production derlemesi
npm run analyze      # Paket boyutu analiz raporu olusturur
```
