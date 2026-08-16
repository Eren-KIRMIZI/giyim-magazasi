# LAST DANCE | Official Store

LAST DANCE, premium streetwear (sokak giyimi) markaları için tasarlanmış modern, yüksek performanslı ve tam donanımlı bir e-ticaret web uygulamasıdır. Proje, "brutalist" (keskin ve endüstriyel) bir tasarım anlayışına sahip olup, kullanıcılara kesintisiz, güvenli ve erişilebilir bir alışveriş deneyimi sunmak üzere mühendislik pratikleri gözetilerek geliştirilmiştir.

## Mimari ve Teknoloji Yığını (Tech Stack)

Bu proje, en modern JavaScript/TypeScript ekosistemi kullanılarak, yüksek ölçeklenebilirlik ve performans hedeflenerek inşa edilmiştir:

*   **Çerçeve (Framework):** Next.js 16 (App Router, Turbopack)
*   **Dil:** TypeScript (Sıkı tip güvenliği ile uçtan uca koruma)
*   **Stil & Tasarım:** Tailwind CSS ve özel CSS değişkenleri (Tam uyumlu Dark/Light tema desteği)
*   **Veritabanı:** PostgreSQL
*   **ORM:** Prisma
*   **Kimlik Doğrulama:** NextAuth.js (Güvenli oturum yönetimi ve Rol tabanlı erişim kontrolü - RBAC)
*   **Durum Yönetimi (State Management):** Zustand (İstemci tarafında Sepet ve Favoriler yönetimi)
*   **Ödeme Altyapısı:** Stripe
*   **İşlemsel E-postalar (Transactional Emails):** Resend (React Email entegrasyonu ile)
*   **Otomatik Testler:** Vitest (Birim Testleri) ve Playwright (Uçtan Uca - E2E Testler)

## Detaylı Proje Özellikleri

Proje, standart bir e-ticaret sitesinin ötesinde karmaşık iş kurallarını (business logic) yöneten bir dizi gelişmiş özellik barındırır.

### Kullanıcı Deneyimi ve Arayüz (UI/UX)
*   **Brutalist Tasarım Sistemi:** Markanın kimliğine uygun olarak tasarlanmış yüksek kontrastlı, keskin hatlı özel kullanıcı arayüzü. 
*   **Kusursuz Tema Geçişleri:** `next-themes` kullanılarak Hydration hatası (Sunucu-İstemci HTML uyuşmazlığı) yaşatmayan, kullanıcının sistem tercihine duyarlı Karanlık (Dark) ve Aydınlık (Light) mod.
*   **Tam Duyarlı (Responsive) Tasarım:** Mobil, tablet ve masaüstü cihazlar için özel olarak optimize edilmiş akıcı arayüz.
*   **Erişilebilirlik (Accessibility - a11y):** Ekran okuyucular için ARIA etiketleri, klavye ile tam gezinme desteği (Focus trapping) ve semantik HTML yapısı.
*   **Yapay Zeka Destekli Görseller:** Sitedeki tüm konsept fotoğraflar ve ürün kareleri HD kalitesinde özel olarak oluşturulmuştur.

### E-Ticaret ve Alışveriş Akışı
*   **Kapsamlı Ürün Kataloğu:** Dinamik ürün listeleme, kategoriler arası geçiş, detaylı beden ve renk varyasyonları ile gerçek zamanlı stok durumunu gösteren ürün sayfaları.
*   **Akıllı Sepet ve Favoriler (Zustand):** Kullanıcının sepetini ve favorilediği ürünleri sayfa yenilense dahi tarayıcı hafızasında (LocalStorage) güvenle saklayan, Hydration uyumlu istemci durum yönetimi.
*   **Misafir Alışverişi (Guest Checkout):** Kullanıcıların hesap oluşturma zorunluluğu olmadan, doğrudan e-posta adresleri üzerinden satın alım yapabilmelerine olanak tanıyan, dönüşüm oranını (conversion rate) artıran esnek altyapı.
*   **Stripe Entegrasyonu:** Güvenli kredi kartı ödemeleri için Stripe Checkout Sessions kullanımı.

### Gelişmiş Envanter ve Sipariş Yönetimi
*   **Eşzamanlı Stok Rezervasyon Sistemi:** Aynı ürünü aynı anda almaya çalışan kullanıcıların "stokta olmayan" bir ürünü satın almasını (Overselling) engelleyen gelişmiş sistem. Kullanıcı ödeme adımına geçtiğinde ürün geçici olarak (Örn: 24 saat) rezerve edilir (`OrderReservation`). Satın alım tamamlanmazsa, bu süre sonunda ürün otomatik olarak tekrar genel stoğa dahil edilir. Transaction bazlı (Prisma $transaction) güvenli veritabanı yazımları ile Race Condition problemleri çözülmüştür.
*   **Stripe Webhook Mimarisi:** Ödeme başarıyla tamamlandığında Stripe tarafından tetiklenen webhook (`checkout.session.completed`), siparişi güvenli bir arka plan işlemi olarak oluşturur, rezerve stoğu nihai olarak eksiltir ve kullanıcıya otomatik makbuz e-postası gönderir.
*   **İşlemsel E-Postalar (Resend):** Sipariş tamamlandığında Resend ve React Email şablonları kullanılarak kullanıcıya anında özel tasarımlı sipariş onay e-postası (`OrderConfirmation`) iletilir.

### Yönetici (Admin) Paneli
*   **Rol Tabanlı Erişim:** Sadece veritabanında `ADMIN` yetkisi tanımlanmış kullanıcıların erişebildiği güvenli `/admin` rotası.
*   **Kapsamlı Gösterge Paneli (Dashboard):** Toplam gelir, sipariş sayısı, kritik stok uyarısı (azalan ürünler) ve son siparişlerin tek ekrandan takibi.
*   **Sipariş Takibi:** Misafir veya kayıtlı kullanıcı ayrımı gözetmeksizin tüm siparişlerin durumlarının yönetimi.

## Proje Klasör Yapısı

Proje, kodun sürdürülebilirliğini ve okunabilirliğini en üst düzeye çıkarmak için modüler bir mimari ile tasarlanmıştır:

*   `/src/app`: Next.js App Router yapısı (Sayfalar, layout'lar ve API uç noktaları).
*   `/src/components`: Tekrar kullanılabilir UI bileşenleri (Butonlar, Kartlar, Navigation vb.).
*   `/src/modules`: Sistemin can damarı olan, iş kurallarının modüler olarak ayrıldığı dizin (Katalog, Sepet, Ödeme, Sipariş, Rezervasyon, Admin, Webhook fonksiyonları).
*   `/src/infrastructure`: Dış servis entegrasyonlarının merkezileştirildiği yapı (Prisma, Stripe, Resend ayarları).
*   `/src/lib`: Yardımcı fonksiyonlar, sabitler ve projeye ait başlangıç (seed) verileri.
*   `/src/prisma`: Prisma veritabanı şeması (`schema.prisma`) ve başlangıç verisi ekleme betiği.
*   `/tests`: Playwright (E2E) ve Vitest (Birim Testleri) dosyaları.
*   `/public`: HD kalitede optimize edilmiş resimler ve statik dosyalar.

## Kurulum ve Çalıştırma

### Gereksinimler
*   Node.js (v18 veya daha güncel)
*   PostgreSQL veritabanı sunucusu
*   Stripe Hesabı (Ödeme altyapısı ve webhook için)
*   Resend Hesabı (E-posta gönderimi için)

### Çevresel Değişkenler (Environment Variables)
Proje ana dizininde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri kendi sisteminize göre doldurun:

```env
# Veritabanı
DATABASE_URL="postgresql://kullanici:sifre@localhost:5432/giyim_magazasi?schema=public"

# NextAuth (Kimlik Doğrulama)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="guvenli_gizli_bir_anahtar"

# Stripe (Ödeme İşlemleri)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Resend (E-posta İşlemleri)
RESEND_API_KEY="re_..."
```

### Kurulum Adımları

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

2.  **Prisma Client'ı Oluşturun ve Veritabanı Şemasını Senkronize Edin:**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

3.  **Örnek Verileri (Ürünler vb.) Veritabanına Yazın (İsteğe Bağlı):**
    ```bash
    npx prisma db seed
    ```

4.  **Geliştirme Sunucusunu Başlatın:**
    ```bash
    npm run dev
    ```
    Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

## Test Altyapısı

Projenin güvenilirliğini sağlamak adına iki farklı test yaklaşımı benimsenmiştir:

*   **Birim Testleri (Vitest):** Projedeki bağımsız fonksiyonların (örneğin sepet hesaplamaları) doğru çalışıp çalışmadığını test eder.
    ```bash
    npm run test
    ```

*   **Uçtan Uca Testler (Playwright - E2E):** Gerçek bir kullanıcının siteye girip, ürünü sepete ekleyip ödeme sayfasına kadar giden tüm alışveriş serüvenini simüle eder ve sistemin bir bütün olarak çökmeden çalıştığını doğrular.
    ```bash
    npx playwright test
    ```

## Webhook Yapılandırması (Önemli)

Stripe üzerinden alınan başarılı ödemeler, stok düşümü ve e-posta gönderimi için webhook'lara güvenir. Webhook dinleyicisi `/api/webhooks/stripe` rotasındadır. Geliştirme aşamasında webhook'ları lokal olarak test etmek için Stripe CLI kullanarak `checkout.session.completed` event'ini lokal sunucunuza yönlendirmeniz gerekmektedir.

## Lisans

Tüm hakları saklıdır. LAST DANCE.
