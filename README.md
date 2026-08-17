# LAST DANCE | Official Store

LAST DANCE, premium streetwear (sokak giyimi) markaları için tasarlanmış modern, yüksek performanslı ve tam donanımlı bir e-ticaret web uygulamasıdır. Proje, "brutalist" (keskin ve endüstriyel) bir tasarım anlayışına sahip olup, kullanıcılara kesintisiz, güvenli ve erişilebilir bir alışveriş deneyimi sunmak üzere mühendislik pratikleri gözetilerek geliştirilmiştir.

---

<img width="1365" height="580" alt="image" src="https://github.com/user-attachments/assets/75269c91-4129-46e4-8eca-9dbba242b1d6" />

<img width="1366" height="641" alt="image" src="https://github.com/user-attachments/assets/18f402f1-4b26-4bbd-88ca-9a9d1bfb2633" />

<img width="1366" height="611" alt="image" src="https://github.com/user-attachments/assets/f81a5e12-6ec2-468b-8789-777f0398667c" />

<img width="1359" height="131" alt="image" src="https://github.com/user-attachments/assets/827daa64-a7f5-474f-855a-4a16127c135f" />

<img width="1358" height="310" alt="image" src="https://github.com/user-attachments/assets/c3278605-d417-4c66-a5d0-d2b87c6b501d" />

<img width="1359" height="538" alt="image" src="https://github.com/user-attachments/assets/0e591d05-dc1a-4601-9030-ae560bfde218" />

<img width="941" height="443" alt="image" src="https://github.com/user-attachments/assets/e890bf7f-9f26-43da-bef4-89092e847e43" />

<img width="936" height="642" alt="image" src="https://github.com/user-attachments/assets/6cfbe6c8-0d2b-424e-a788-4efe6c4d6a18" />

<img width="1135" height="595" alt="image" src="https://github.com/user-attachments/assets/bd2d61ba-90c1-405f-824a-d63003974271" />

<img width="1152" height="398" alt="image" src="https://github.com/user-attachments/assets/17dfb445-ec92-4233-80d4-281fcbd65cf1" />

<img width="1171" height="226" alt="image" src="https://github.com/user-attachments/assets/b6715a74-0161-4b6e-ac9d-fe5463e4681e" />

<img width="1359" height="609" alt="image" src="https://github.com/user-attachments/assets/b0887055-69ae-439d-b8f3-600c7e46716e" />

<img width="1366" height="625" alt="image" src="https://github.com/user-attachments/assets/cd48403d-535c-4f15-ba58-3d4de4430cde" />

<img width="1366" height="640" alt="image" src="https://github.com/user-attachments/assets/ceb518ce-2c54-4faf-827c-682e8617915b" />

<img width="1366" height="612" alt="image" src="https://github.com/user-attachments/assets/d6e84aa8-a953-4188-b752-a9bbe4997bd9" />

<img width="961" height="303" alt="image" src="https://github.com/user-attachments/assets/58396f1b-2fd2-4ad3-ab2b-26f38d457b6a" />

<img width="971" height="479" alt="image" src="https://github.com/user-attachments/assets/721d0f9e-cd5c-4742-bca3-7660dff060fc" />

<img width="909" height="638" alt="image" src="https://github.com/user-attachments/assets/7186be80-cad8-4943-a660-251a6e1a60c8" />

<img width="1207" height="604" alt="image" src="https://github.com/user-attachments/assets/b963afaf-90f5-4ccf-a868-e0fc6c448000" />

<img width="932" height="310" alt="image" src="https://github.com/user-attachments/assets/62a1b5f8-5398-481b-ad50-bdd5ed556315" />

<img width="929" height="275" alt="image" src="https://github.com/user-attachments/assets/714e01ad-e62a-4d81-989c-46050bb9db82" />

---

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
