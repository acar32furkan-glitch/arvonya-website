# Arvonya İyileştirme Raporu

Bu rapor; mevcut site incelemesi, marka/UX/UI, teknik-performans, SEO, içerik-iletişim ve backend tespitlerini P0-P3 öncelikleriyle özetler.

## Mevcut Kritik Bulgular

- Logo, favicon ve site renkleri tamamen aynı marka sistemine bağlı değil.
- Logo renkleri yaklaşık `#ff6808` turuncu ve `#30d068` yeşil tonlarında; CSS’deki `#22c55e` / `#f97316` bu tonlarla birebir aynı değil.
- Navbar logosu `text-xl` nedeniyle biraz büyük görünüyor.
- Açılış logosu ve favicon, küçük boyutta arka planlı/kirli algılanabiliyor.
- Hero görseli ilk açılışta pikselli görünüyor; mevcut responsive varyantlar 480/768/1024 ile sınırlı.
- Bazı meta/OG alanlarında eski domain `arvonya-website.vercel.app` geçiyor; canlı domain `arvonya-site.vercel.app`.
- Supabase RLS policy’leri eksik görünüyor; leads/appointments insert akışları çalışmayabilir.
- Admin paneli basit hardcoded password ile çalışıyor; production için güvenli değil.

---

# P0 — Hemen Düzeltilecekler

## 1. Logo renklerini logodan alıp tüm siteye yay

### Tespit

Mevcut logo asset’inde baskın turuncu/yeşil tonları yaklaşık:

```txt
orange: #ff6808
green:  #30d068
```

CSS’de ise farklı tonlar kullanılıyor:

```txt
#22c55e
#f97316
#B83A12
#2f4553
```

### Çözüm

Logo renkleri referans alınarak tek marka token sistemi kurulmalı:

```css
--brand-orange: #ff6808;
--brand-green: #30d068;
--brand-orange-dark: #b83a12;
--brand-green-dark: #137a3a;
--brand-orange-soft: rgba(255, 104, 8, 0.12);
--brand-green-soft: rgba(48, 208, 104, 0.12);
```

### Beklenen Sonuç

Logo, favicon, butonlar, badge’ler, hover alanları ve metin vurguları aynı marka ailesinden gelir.

---

## 2. Navbar logo boyutunu küçült

### Tespit

Navbar `Logo size="text-xl"` kullanıyor:

```txt
text-xl = 80x63px
```

### Çözüm

Navbar için:

```txt
text-lg = 70x56px
```

veya

```txt
navbar = 70x56px
```

kullanılmalı.

### Beklenen Sonuç

Sol üst logo daha dengeli ve profesyonel görünür.

---

## 3. Açılış logosu ve favicon arka planını temizle

### Tespit

- `/logo_preview-*` serisi beyaz arka planlı ve kullanılmamalı.
- `/assets/logo-*` serisi daha temiz.
- `public/favicon.svg` içinde gri kutucuklar ve dolu şekil var; küçük boyutta arka planlı görünüyor.

### Çözüm

- Logo component sadece `/assets/logo-*` kullanmalı.
- Favicon sadeleştirilmeli.
- Gerekiyorsa logo için SVG/transparent PNG kullanılmalı.

### Beklenen Sonuç

Açılış logosu ve favicon temiz, transparan ve marka uyumlu görünür.

---

## 4. Hero ilk açılış piksel sorununu düzelt

### Tespit

Hero görseli:

```tsx
width={1920}
height={832}
```

ancak responsive varyantlar yalnızca:

```txt
480
768
1024
```

### Çözüm

Hero için 1440 ve 1920 varyantları oluşturulmalı. `ResponsivePicture` fallback width listesi genişletilmeli.

### Beklenen Sonuç

İlk açılışta arka görsel net görünür; pikselleşme azalır.

---

# P1 — UX/UI İyileştirmeleri

## 1. Aktif navigasyon ve CTA renklerini marka token’larına bağla

Aktif nav, hero tab, listing badge, favoriler, WhatsApp paylaşımı ve buton hover alanları tek renk sistemine bağlanmalı.

## 2. Sector sayfalarını güçlendir

Her sektör için net CTA eklenmeli:

- Gayrimenkul: “İlanları İncele”
- Otomotiv: “Araçları Gör”
- Dış Ticaret: “WhatsApp ile Bilgi Al”
- Tercüme: “Belge Gönder, Teklif Al”

## 3. Mobil deneyimi kontrol et

- Mobil menü
- Filtre drawer
- Listing kartları
- WhatsApp kapsülü
- Cookie banner

alanları mobilde daha kontrollü hale getirilmeli.

## 4. Listing kartlarında marka uyumu

Fiyat, favori, tip badge ve fallback görselleri yeni renk token’larıyla uyumlu hale getirilmeli.

---

# P2 — SEO ve İçerik

## 1. Meta ve OG düzeltmeleri

- Canlı domain `arvonya-site.vercel.app` kullanılmalı.
- Her route için description, canonical, og:image eklenmeli.
- Listing sayfaları için dinamik OG image oluşturulmalı.

## 2. Structured data

Eklenebilir:

- `Organization`
- `LocalBusiness`
- `RealEstateListing` veya `Product`
- `ContactPoint`

## 3. İçerik güçlendirme

Ana sayfada güven sinyalleri artırılmalı:

- Yerel uzmanlık
- Şeffaf süreç
- Hızlı dönüş
- Çok sektör entegrasyonu
- İletişim kanalı netliği

## 4. Sosyal paylaşım görseli

Logo yerine profesyonel bir OG/social preview görseli hazırlanmalı.

---

# P3 — Backend ve Güvenlik

## 1. Supabase RLS policy’leri

Mevcut şemada RLS aktif ancak bazı insert policy’leri eksik:

- `leads`
- `appointments`
- `translation_requests`

### Risk

Frontend form gönderimleri başarısız olabilir veya yetki hataları oluşabilir.

### Çözüm

- Leads insert policy
- Appointments insert policy
- Translation requests tablosu ve policy
- Admin-only write policies

eklenmeli.

## 2. Admin güvenliği

Mevcut admin hardcoded password ile çalışıyor.

### Risk

Production için güvenli değil.

### Çözüm

- Supabase Auth
- Admin role
- RLS role policy
- Upload policy sınırlaması
- Rate limit / audit log

## 3. Storage limit

Mevcut storage limit 5 MB.

### Risk

Emlak ve araç fotoğrafları için düşük.

### Çözüm

Limit artırılmalı; upload sırasında boyut/oran kontrolü yapılmalı.

## 4. Form altyapısı

İletişim formu Netlify form mantığıyla yazılmış ancak site Vercel’de.

### Çözüm

- Vercel API route
- Supabase edge function
- Form backend endpoint

kullanılmalı.

---

# Önerilen Uygulama Sırası

1. P0 renk/logo/favicon/hero piksel düzeltmeleri
2. P0 sonrası canlı deploy ve görsel kontrol
3. P1 UX/UI iyileştirmeleri
4. P2 SEO/content iyileştirmeleri
5. P3 backend/security düzeltmeleri
