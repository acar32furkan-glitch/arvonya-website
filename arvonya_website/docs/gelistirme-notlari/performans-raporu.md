# ARVONYA SITE — PERFORMANS RAPORU & DÜZELTME PLANI
**Tarih:** 29 Haziran 2026
**Rapor:** Lighthouse 13.3.0 (Mobil, Moto G Power simülasyonu)
**URL:** https://arvonya-site.vercel.app/

---

## � MEVCUT SKORLAR

| Metrik | Değer | Skor | Hedef | Durum |
|--------|-------|------|-------|-------|
| **FCP** (First Contentful Paint) | 2.2s | 0.77 | <1.8s | 🟡 Orta |
| **LCP** (Largest Contentful Paint) | 4.9s | 0.28 | <2.5s | 🔴 Kötü |
| **SI** (Speed Index) | 3.3s | 0.91 | <3.4s | � İyi |
| **TTI** (Time to Interactive) | 4.9s | 0.77 | <3.5s | 🟡 Orta |
| **TBT** (Total Blocking Time) | 742ms | 0.40 | <200ms | � Kötü |
| **CLS** (Cumulative Layout Shift) | 0 | 1.0 | <0.1 | 🟢 Mükemmel |
| **TTFB** (Time to First Byte) | 64ms | 1.0 | <200ms | 🟢 Mükemmel |

**Toplam Tahmini Skor:** 0.45-0.55 (Kırmızı)

---

## � KRİTİK SORUNLAR

### 1. LCP 4.9s — Hero Görsel Yüklenme (En Büyük Sorun)
**Neden:** `hero-estate-o0EkCtrk-1920.webp` (7IF fallback yerine WebP yükleniyor)
**Etki:** LCP'yi ~3-4 saniye yavaşlatıyor
**Düzeltme:**
- `src`'i 768px AVIF olarak değiştir
- Preload'i kaldır (mobilde gereksiz, desktopta CSS ile göster)
- Mobilde hero gizle (`hidden md:block`)

### 2. TBT 742ms — Main Thread Blokajı
**Neden:**
- `vendor-Cg8SQHqi.js` 340kB tek dosya
- Supabase client ilk yüklemede yükleniyor
- framer-motion animasyonlar main thread'ı blokluyor
**Düzeltme:**
- Vendor chunk'ı böl (supabase, sonner ayrı)
- Supabase query'lerini 100ms defer et
- ListingCard'a React.memo ekle

### 3. TTI 4.9s — Etkileşim Hazır Süresi
**Neden:** TBT ile aynı kök neden. JS execution uzun.
**Düzeltme:** TBT düzeltmeleri bunu da çözer

---

## � ORTA SEVİYE SORUNLAR

### 4. FCP 2.2s — İlk İçerik Gösterimi
**Neden:** Hero görseli yüklenene kadar içerik gösterilmiyor
**Düzeltme:**
- Inline critical CSS (hero placeholder)
- Hero görselini lazy load et (eager yerine)

### 5. Font Yükleme
**Neden:** Google Fonts stylesheet render-blocking
**Düzeltme:** `preload` + `onload` pattern'i ekle

---

## � İYİ DURANLAR

- **CLS 0** — Layout stabil, shift yok
- **TTFB 64ms** — Sunucu yanıtı hızlı
- **Console errors yok** — JS çalışıyor
- **HTTPS** — Güvenli bağlantı

---

## �️ DÜZELTME PLANI (Öncelik Sırası)

### Adım 1: Hero Görsel Optimizasyonu (LCP -2s)
- `src/components/Hero.tsx`:
  - `hidden md:block` ekle (mobilde gizle)
  - `src`'i 768px AVIF olarak değiştir
  - `loading="lazy"` ekle (eager yerine)

### Adım 2: Vendor Chunk Bölme (TBT -300ms)
- `vite.config.ts`:
  - `supabase` → ayrı chunk
  - `sonner` → ayrı chunk
  - `tailwind-merge`, `clsx` → utils chunk

### Adım 3: Supabase Defer (TBT -200ms)
- `src/lib/store.tsx`:
  - `useEffect` içinde `setTimeout(100)` ile defer

### Adım 4: React.memo (TBT -100ms)
- `src/components/ListingCard.tsx`:
  - `memo()` wrapper ekle

### Adım 5: Font Preload (FCP -0.3s)
- `index.html`:
  - Google Fonts `<link rel="stylesheet">` → `preload` + `onload` pattern

### Adım 6: Lazy Load Bileşenler (TBT -100ms)
- `src/routes/index.tsx`:
  - FilterCapsule, ChatbotCapsule, CookieBanner → `lazy()`

---

## 📈 BEKLENEN SONUÇ

| Metrik | Mevcut | Hedef | İyileşme |
|--------|--------|-------|----------|
| FCP | 2.2s | 1.5s | -32% |
| LCP | 4.9s | 2.2s | -55% |
| TBT | 742ms | 250ms | -66% |
| TTI | 4.9s | 2.5s | -49% |
| **Skor** | **0.5** | **0.8+** | **+60%** |

---

## ⚠️ ÖNEMLİ NOTLAR

1. Her adım ayrı ayrı yapılacak, test edilecek, sonra geçilecek
2. Build her adımda kontrol edilecek
3. Vercel hatası (npm install 254) çözülmeden deploy yapılamaz
4. `package-lock.json` geri getirilmeli
