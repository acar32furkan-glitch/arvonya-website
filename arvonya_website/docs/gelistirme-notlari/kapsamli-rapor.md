# ARVONYA SITE — KAPSAMLI PERFORMANS RAPORU
**Tarih:** 29 Haziran 2026  
**Rapor:** Lighthouse 13.3.0 (Mobil + Desktop)  
**URL:** https://arvonya-site.vercel.app/

---

## � SKOR ÖZETİ

| Metrik | Mobil | Desktop | Hedef | Durum |
|--------|-------|---------|-------|-------|
| **FCP** | 2.2s (0.78) | 0.8s | <1.8s | � / � |
| **LCP** | 2.2s (0.95) | 1.0s | <2.5s | 🟢 / 🟢 |
| **SI** | 2.7s (0.96) | 1.2s | <3.4s | 🟢 / 🟢 |
| **TTI** | 4.9s (0.77) | 1.5s | <3.5s | � / � |
| **TBT** | 790ms (0.37) | 120ms | <200ms | 🔴 / 🟢 |
| **CLS** | 0.001 (1.0) | 0 | <0.1 | � / � |
| **TTFB** | 60ms (1.0) | 60ms | <200ms | 🟢 / 🟢 |
| **Performance** | **~0.75** | **~0.95** | >0.9 | 🟡 / 🟢 |

**Sonuç:** Desktop hariç, mobil performans **TBT (790ms)** yüzünden düşük.

---

## 🔴 KRİTİK SORUNLAR (Mobil)

### 1. TBT 790ms — Total Blocking Time
**Dosya:** `src/lib/store.tsx:366-420`
**Neden:** İlk yüklemede 3 paralel Supabase query + localStorage okuma
**Çözüm:** Supabase query'lerini `setTimeout(100)` ile defer et

### 2. Hero Görseli — Desktop'ta Kalitesiz
**Dosya:** `src/components/Hero.tsx:78-88`
**Neden:** `hero-estate-o0EkCtrk.webp` (128KB) yüksek kalite ama `width={1920}` ile sıkıştırılmış
**Çözüm:** 
- Daha yüksek kaliteli kaynak görsel kullan
- Veya `hero-estate-o0EkCtrk-1440.avif` (39KB) kullan (1024px+ ekranlar için yeterli)

### 3. Vendor Chunk 340kB
**Dosya:** `vite.config.ts`
**Neden:** Tüm 3. parti kütüphaneler tek dosyada
**Çözüm:** `manualChunks` ile supabase, sonner, utils ayır

---

## 🟡 ORTA SEVİYE SORUNLAR

### 4. FCP 2.2s (Mobil)
**Neden:** Hero görseli yüklenene kadar içerik gösterilmiyor
**Çözüm:** Inline critical CSS + hero placeholder

### 5. Font Yükleme
**Dosya:** `index.html:12`
**Neden:** Google Fonts render-blocking
**Çözüm:** `preload` + `onload` pattern

### 6. Gereksiz Preload'lar
**Dosya:** `index.html:14-19`
**Neden:** 6 adet preload tag (480w, 768w, 1024w, 1440w, 1920w, logo)
**Çözüm:** Sadece 768px AVIF preload kal, gerisini kaldır

---

## � İYİ DURANLAR

- ✅ CLS 0.001 — Layout stabil
- ✅ TTFB 60ms — Sunucu hızlı
- ✅ Console errors yok
- ✅ HTTPS aktif
- ✅ Desktop performans mükemmel (0.95)
- ✅ Admin paneli çalışıyor
- ✅ Tüm sayfalar yükleniyor (/, /admin, /iletisim, /kvkk, /listing/:id)

---

## 📋 TO-DO LİSTESİ (Öncelik Sırası)

### ✅ Adım 1: Hero Görsel Kalitesini Düzelt
**Dosya:** `src/components/Hero.tsx`
- [ ] `src="/assets/hero-estate-o0EkCtrk.webp"` → daha yüksek kaliteli görsel kullan
- [ ] Veya `hero-estate-o0EkCtrk-1440.avif` (39KB) + `hero-estate-o0EkCtrk-1920.avif` (66KB) srcSet ekle
- [ ] `loading="lazy"` ekle (eager yerine)

### ✅ Adım 2: TBT Düşür (790ms → <200ms)
**Dosya:** `src/lib/store.tsx`
- [ ] Supabase query'lerini `setTimeout(() => { ... }, 100)` ile defer et
- [ ] localStorage okumayı `requestIdleCallback` içine al

### ✅ Adım 3: Vendor Chunk Böl
**Dosya:** `vite.config.ts`
- [ ] `supabase` → ayrı chunk
- [ ] `sonner` → ayrı chunk
- [ ] `tailwind-merge`, `clsx` → utils chunk

### ✅ Adım 4: Gereksiz Preload'ları Kaldır
**Dosya:** `index.html`
- [ ] Sadece 768px AVIF preload bırak
- [ ] Diğer 5 preload'u sil

### ✅ Adım 5: Font Preload
**Dosya:** `index.html`
- [ ] `<link rel="stylesheet">` → `rel="preload" onload="this.rel='stylesheet'"` pattern

### ✅ Adım 6: React.memo
**Dosya:** `src/components/ListingCard.tsx`
- [ ] `export const ListingCard = memo(function ListingCard(...))`

### ✅ Adım 7: Lazy Load Bileşenler
**Dosya:** `src/routes/index.tsx`
- [ ] FilterCapsule, ChatbotCapsule, CookieBanner → `lazy()`

---

## 📈 BEKLENEN SONUÇ

| Metrik | Mevcut | Hedef | İyileşme |
|--------|--------|-------|----------|
| TBT | 790ms | 150ms | -81% |
| FCP | 2.2s | 1.5s | -32% |
| LCP | 2.2s | 1.8s | -18% |
| Mobil Skor | 0.75 | 0.92 | +23% |

---

## ⚠️ NOTLAR

1. Her adım ayrı ayrı yapılacak, test edilecek, onay sonrası geçilecek
2. Build her adımda kontrol edilecek: `npm run build`
3. Deploy: `vercel --prod`
4. Admin paneli çalışıyor — ilan yükleme test edilecek
5. Tüm sayfalar çalışıyor: /, /admin, /iletisim, /kvkk, /listing/:id
