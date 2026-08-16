import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('should allow a guest user to add an item to cart and proceed to checkout', async ({ page }) => {
    // Anasayfaya git
    await page.goto('/');

    // İlk ürün kartına tıkla (Eğer varsa ürün detayına gider)
    // Eğer ürünler "a" etiketi altındaysa href içeren ilk linke tıkla
    const firstProduct = page.locator('a[href^="/urunler/"]').first();
    await firstProduct.click();

    // Ürün detay sayfasında sepete ekle butonunu bul
    const addToCartButton = page.locator('button:has-text("Sepete Ekle")');
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Sepetin açıldığını/güncellendiğini varsayalım. Header'daki sepet ikonuna tıklayıp veya direkt /sepet'e gidelim.
    await page.goto('/sepet');

    // Sepette ürün olduğunu doğrula
    const checkoutButton = page.locator('button:has-text("Güvenli Ödeme"), a:has-text("Güvenli Ödeme")');
    await expect(checkoutButton).toBeVisible();

    // Checkout işlemi (Stripe yönlendirmesi olacağı için sadece butonun çalıştığını test edebiliriz, 
    // gerçek stripe ödemesi mocklanmadıkça yönlendirmeyi beklemeyiz veya sadece API yanıtını mocklarız)
    
    // API mock örneği
    await page.route('/api/checkout', async route => {
      const json = { url: 'https://checkout.stripe.com/test-session' };
      await route.fulfill({ json });
    });

    await checkoutButton.click();
    
    // Yönlendirme beklentisi
    await expect(page).toHaveURL(/checkout\.stripe\.com/);
  });
});
