# ARVONYA WEBSITE — KAPSAMLI FRONTEND ANALİZ RAPORU

Tarih: 2026-06-23
Analiz edilen commit: d28e93a (HEAD)
Referans stabil build: 618e917 (arvonya-site-ppxpa9sne)

---

## 1. NAVBAR — LOGO POZİSYONU

**DURUM: ⚠️ SORUNLU**

**Navbar.tsx:43** — Flex container:
```
<div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4">
```

**Navbar.tsx:44-46** — Logo:
```
<Link to="/" onClick={() => setView("gayrimenkul")}>
  <Logo size="text-lg" />
</Link>
```

**Sorun:** `justify-between` doğru çalışıyor ve Logo solda, nav linkleri + sağ taraftaki butonlar sağda. Ancak `<Link>` etiketi `<picture>` etiketini sarmalıyor ve `shrink-0` sadece `<picture>`'e uygulanıyor. Logo container'da `shrink-0` yok, bu yüzden küçük ekranlarda logo küçülebilir.

**Ek sorun:** Sağ taraftaki `<div className="flex items-center gap-2">` (Navbar.tsx:94) içinde `ml-auto` yok. `justify-between` parent'ı zaten iki ana grubu ayırıyor (nav + sağ kontroller), ama mobil hamburger butonu bu gruba dahil. Mobil menü açıldığında `setMobileOpen(false)` Link'lerde değil, sadece `<a>` etiketlerinde var.

**Logo.tsx:15-16:**
```
<picture className={`inline-block shrink-0 ${logoSizes[size] ?? logoSizes.navbar} ${className}`}>
```
`shrink-0` burada var ama parent `<Link>`'te yok.

**Gereken değişiklik:** Logo'yı sarmalayınca `<Link>`'e `shrink-0` eklenmeli:
```tsx
<Link to="/" onClick={() => setView("gayrimenkul")} className="shrink-0">
```

---

## 2. MARKA RENKLERİ

**DURUM: ✅ İYİ (Tutarlı)**

**styles.css:67-75** — Renk tanımları (CSS custom properties):
```css
--brand-orange: #ff6808;
--brand-green: #30d068;
--brand-orange-dark: #b83a12;
--brand-green-dark: #137a3a;
--brand-orange-soft: rgba(255, 104, 8, 0.12);
--brand-green-soft: rgba(48, 208, 104, 0.12);
--brand-orange-soft-strong: rgba(255, 104, 8, 0.2);
--brand-green-soft-strong: rgba(48, 208, 104, 0.2);
--brand-green-light: #4ade80;
```

**Kullanım örnekleri:**
- `IntroAnimation.tsx:26` — `rgba(48,208,104,0.85)` ve `rgba(255,104,8,0.65)` — CSS var kullanılmış, inline rgba
- `Hero.tsx:136` — `var(--brand-orange-dark)` — doğru kullanım
- `Navbar.tsx:54-56` — `var(--brand-green)`, `var(--brand-orange-dark)` — doğru kullanım
- `ListingCard.tsx:109-111` — `rgba(184,58,18,0.25)` ve `rgba(48,208,104,0.25)` — hardcoded rgba (sorunlu, var kullanılmalı)
- `ListingCard.tsx:321` — `var(--brand-orange-dark)` — doğru
- `iletisim.tsx:48` — `bg-brand-green` — Tailwind utility (CSS var'dan çözülüyor)
- `iletisim.tsx:48` — `bg-brand-orange` — Tailwind'de `brand-orange` tanımlı (styles.css:38'den)

**Tailwind config:** `tailwind.config.js` veya `tailwind.config.ts` dosyası YOK. Renkler CSS custom properties üzerinden `@theme inline` ile Tailwind'e aktarılıyor (styles.css:38-41).

**Sorun:** `ListingCard.tsx:109-111` ve `ListingCard.tsx:234-253` (WhatsApp hardcoded rgba) inline rgba kullanıyor. Bu Tailwind CSS v4'te çalışıyor ama marka rengi değiştiğinde güncellenmez. `var(--brand-orange-soft)` kullanılmalı.

---

## 3. HERO ARKAPLAN — GÖRÜNTÜ KALİTESİ

**DURUM: ❌ KRİK HATA**

**Hero.tsx:78-86** — Görüntü implementasyonu:
```tsx
<img
  src="/assets/hero-estate-o0EkCtrk-1920.webp"
  alt="Arvonya Emlak"
  className="h-full w-full object-cover object-center"
  loading="eager"
  fetchPriority="high"
  width={1920}
  height={832}
/>
```

**Mevcut durum:**
- Tek bir `<img>` tag, srcset YOK
- `src="/assets/hero-estate-o0EkCtrk-1920.webp"` — her zaman 1920px'lik dosya yükleniyor
- `sizes` attribute YOK — browser viewport genişliğine bakmadan 1920px dosyayı indiriyor
- `srcset` attribute YOK — responsive varyant yok
- `width={1920} height={832}` — aspect ratio için iyi ama CLS riski var (explicit dimension)

**Sorunlar:**
1. Mobil cihazda (375px genişlik) 1920px'lik dosya indiriliyor → bant genişliği israfı, yavaş LCP
2. `object-cover` + `h-full w-full` ile `clipPath: "polygon(13% 0%, 100% 0%, 100% 100%, 0% 100%)"` birlikte kullanılıyor. `clipPath` görüntünün %48'ini kesiyor ama hâlâ tam dosya indiriliyor
3. `srcset` olmadığı için browser daha küçük varyantları seçemiyor
4. `index.html:12-16` preload'lar AVIF formatında ama `<img>` tag WebP kullanıyor → preload boşa gidiyor

**Gereken değişiklik:**
```tsx
<picture>
  <source 
    type="image/avif" 
    srcSet="/assets/hero-estate-o0EkCtrk-480.avif 480w, /assets/hero-estate-o0EkCtrk-768.avif 768w, /assets/hero-estate-o0EkCtrk-1024.avif 1024w, /assets/hero-estate-o0EkCtrk-1440.avif 1440w, /assets/hero-estate-o0EkCtrk-1920.avif 1920w"
    sizes="(min-width: 1024px) 48vw, 100vw"
  />
  <source 
    type="image/webp" 
    srcSet="/assets/hero-estate-o0EkCtrk-480.webp 480w, /assets/hero-estate-o0EkCtrk-768.webp 768w, /assets/hero-estate-o0EkCtrk-1024.webp 1024w, /assets/hero-estate-o0EkCtrk-1440.webp 1440w, /assets/hero-estate-o0EkCtrk-1920.webp 1920w"
    sizes="(min-width: 1024px) 48vw, 100vw"
  />
  <img
    src="/assets/hero-estate-o0EkCtrk-1920.webp"
    alt="Arvonya Emlak"
    className="h-full w-full object-cover object-center"
    loading="eager"
    fetchPriority="high"
    width={1920}
    height={832}
  />
</picture>
```

---

## 4. PAGESPEED 86 — PERFORMANS AUDIT

### A) LCP (Largest Contentful Paint)

**DURUM: ⚠️ SORUNLU**

**LCP elementi:** Hero görseli (`Hero.tsx:78-86`)
- `fetchPriority="high"` var ✅
- `loading="eager"` var ✅
- WebP format ✅
- `srcset` YOK ❌
- `sizes` YOK ❌
- Preload ile format uyumsuzluk (preload AVIF, img WebP) ❌

**Sorun:** LCP elementi 1920px sabit yükleniyor, srcset yok. Mobil için ~5x gereksiz data indiriliyor.

**Gereken değişiklik:** Bölüm 3'teki `<picture>` implementasyonu uygulandığında LCP ~40-60% iyileşecek.

---

### B) JavaScript Bundle

**DURUM: ✅ İYİ**

**vite.config.ts:24-42** — `manualChunks` doğru ayarlanmış:
- `@tanstack` → "tanstack" chunk
- `react-dom/react/scheduler` → "react-vendor" chunk
- `framer-motion` → "framer-motion" chunk
- `lucide-react/@radix-ui` → "ui-vendor" chunk
- Diğer node_modules → "vendor" chunk

**Route'lar:** TanStack Router `autoCodeSplitting: true` ile route bazlı code splitting yapıyor (vite.config.ts:9). `src/routes/` dosyaları otomatik lazy yüklenir.

**En ağır import'lar:**
- `framer-motion` (39.54 kB gzip: 13.81 kB) — Hero, IntroAnimation, ListingCard, Navbar'da kullanılıyor
- `tanstack-B5oo3S31.js` (106.79 kB gzip: 33.88 kB) — TanStack Router
- `react-vendor` (201.60 kB gzip: 64.08 kB) — React + React DOM
- `vendor` (338.94 kB gzip: 95.39 kB) — Supabase, Radix, diğerleri

**Sorun:** `vendor` chunk çok büyük (95.39 kB gzip). Supabase, recharts, date-fns, embla-carousel hepsi bu chunk'ta. Kullanılmayan kütüphaneler (recharts, embla-carousel) bundle'dan çıkarılmalı.

---

### C) IntroAnimation

**DURUM: ⚠️ SORUNLU**

**IntroAnimation.tsx:6-15:**
```tsx
const [show, setShow] = useState(false);
useEffect(() => {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem("arvonya_intro_seen")) return;
  setShow(true);
  sessionStorage.setItem("arvonya_intro_seen", "1");
  const t = setTimeout(() => setShow(false), 2000);
  return () => clearTimeout(t);
}, []);
```

**Sorunlar:**
1. `IntroAnimation` ilk render'da mount ediliyor ve 2 saniye boyunca tüm ekranı kapatıyor (`fixed inset-0 z-[100]`)
2. Bu 2 saniye boyunca Hero content'i görünüyor ama kullanıcı etkileşemiyor
3. LCP etkileniyor çünkü Hero görseli IntroAnimation'dan sonra tam olarak gösteriliyor
4. `AnimatePresence` ile exit animasyonu var (0.5s) → toplam 2.5s bloklama

**Gereken değişiklik:**
- IntroAnimation'ı `useEffect` içinde `requestAnimationFrame` ile bir sonraki frame'e ertele
- Veya `IntroAnimation` bileşenini route seviyesinde lazy yükle: `React.lazy(() => import('@/components/IntroAnimation'))`
- Veya 2000ms süresini 800ms'e düşür

---

### D) Font Loading

**DURUM: ⚠️ SORUNLU**

**index.html** — Font yükleme YOK. Hiçbir `<link rel="font">`, `@font-face`, `font-display: swap` veya `preconnect` yok.

**styles.css:8-9:**
```css
--font-sans: "Inter", system-ui, -apple-system, sans-serif;
--font-display: "Inter", system-ui, sans-serif;
```

**Sorun:** Inter font'u yüklenmiyor! `system-ui` fallback kullanılıyor. Bu, görsel olarak font-weight ve font-style farklılıklarına yol açar. Ayrıca font yüklenene kadar metin görünmeyebilir (FOIT) veya aniden değişebilir (FOUT).

**Gereken değişiklik:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet" />
```

---

### E) Görseller (CLS)

**DURUM: ⚠️ SORUNLU**

**Hero.tsx:78-86** — `<img>` tag'de `width={1920} height={832}` var (explicit dimension → CLS koruması). Ancak `h-full w-full object-cover` ile parent'a göre scale ediliyor, bu da doğru aspect ratio'u korumuyor olabilir.

**ListingCard.tsx:53-62** — ResponsivePicture:
```tsx
<ResponsivePicture
  src={thumbs[active]}
  alt={item.title}
  className="h-full w-full object-cover transition-all duration-500"
  sizes={isArsa ? "(min-width: 1024px) 100vw, 100vw" : "(min-width: 1024px) 64vw, 100vw"}
  width={1600}
  height={900}
/>
```
`width={1600} height={900}` var ✅

**ListingCard.tsx:124-131** — Thumbnail ResponsivePicture:
```tsx
<ResponsivePicture
  src={src}
  alt=""
  className={`h-full w-full object-cover transition-transform duration-300 ...`}
  sizes="120px"
  width={300}
  height={300}
/>
```
`width={300} height={300}` var ✅

**Sorun:** Skeleton loader YOK. Resimler yüklenirken layout shift olabilir. `aspect-[16/10]` ve `aspect-square` kullanılmış (ListingCard.tsx:50, 120) ama resim yüklenmeden önce height 0 olabilir.

**Gereken değişiklik:** Listing kartlarına skeleton loader veya `bg-muted` placeholder eklenmeli.

---

## 5. VERCEL DEPLOYMENT HATASI

**DURUM: ⚠️ YAPILANDIRMA SORUNU**

**vercel.json** (mevcut):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [...]
}
```

**Sorun:** `vercel.json` dosyasında `rootDirectory` tanımlı DEĞİL. Vercel dashboard'da "arvonya_website/arvonya_website" olarak ayarlı ama bu path repo'da yok. Repo yapısı:

```
C:\Users\admin\Desktop\arvonya\arvonya_website\  ← proje kökü
  ├── vercel.json
  ├── index.html
  ├── src/
  ├── public/
  └── package.json
```

**Doğru path:** `rootDirectory` ayarı YOK, yani Vercel root'u `arvonya_website/` olarak algılamalı. Ancak dashboard'da `arvonya_website/arvonya_website` ayarlıysa bu path bulunamaz ve build başarısız olur.

**Gereken değişiklik:**
1. Vercel dashboard'dan `rootDirectory` ayarını kaldırın (boş bırakın) VEYA
2. `vercel.json`'a ekleyin: `"rootDirectory": "."` (repo root zaten proje kökü)
3. `.vercel/project.json` dosyası varsa kontrol edin — bu dosyada `orgId` ve `projectId` bulunur, rootDirectory burada da tanımlanabilir

**Ek sorun:** `vercel.json` dosyası projenin doğru yerde (`arvonya_website/vercel.json`) ama Vercel `arvonya_website/arvonya_website/vercel.json` arıyorsa bulamaz.

---

## 6. GEREKSİZ DEĞİŞİKLİKLER

### admin.tsx

**Değişiklik:** `admin.tsx` dosyasında son commit'de önemli bir değişiklik yapılmamış. Son commit sadece Hero, Navbar, ListingCard, ResponsivePicture, seed-data, iletisim ve index.tsx dosyalarını etkilemiş.

**Durum:** ✅ Sorunsuz — admin.tsx'de işlevsellik bozan değişiklik yok.

### listing.$id.tsx

**Değişiklik:** `listing.$id.tsx` dosyasında son commit'de küçük bir güncelleme yapılmış:
- `SITE_URL` değişkeni: `"https://arvonya-website.netlify.app"` → `"https://arvonya-website.netlify.app"` (aynı)
- Aslında değişiklik yok, bu dosya önceki commit'lerden beri aynı

**Sorun:** `SITE_URL = "https://arvonya-website.netlify.app"` — domain eski! Şu anki domain `arvonya-site.vercel.app`. Bu yüzden OG image URL'leri ve Twitter card URL'leri yanlış.

**Gereken değişiklik:** `SITE_URL` değerini `"https://arvonya-site.vercel.app"` olarak güncelleyin.

---

## ÖZET — ÖNCELİK SIRALAMASILa GEREKLİ DEĞİŞİKLİKLER

| Öncelik | Bölüm | Dosya | Sorun | Çözüm |
|---------|-------|-------|-------|-------|
| 🔴 P0 | Hero Görsel | Hero.tsx:78-86 | srcset yok, 1920px zorunlu | `<picture>` + srcset ekle |
| 🔴 P0 | Preload Uyumsuzluğu | index.html:12-16 | AVIF preload, WebP img | Preload'i güncelle veya img'yi AVIF yap |
| 🟠 P1 | Font Loading | index.html | Inter font yüklenmiyor | Google Fonts preconnect + link ekle |
| 🟠 P1 | IntroAnimation | IntroAnimation.tsx | 2.5s LCP bloklama | Lazy yükle veya süreyi kısalt |
| 🟡 P2 | CLS | ListingCard.tsx | Skeleton loader yok | Placeholder bg + skeleton ekle |
| 🟡 P2 | Vercel Root | vercel.json | rootDirectory belirsiz | `"rootDirectory": "."` ekle |
| 🟡 P2 | Listing Domain | listing.$id.tsx:21 | Eski Netlify domain | `SITE_URL` güncelle |
| 🟢 P3 | Bundle Size | vendor chunk | 95kB gzip | recharts/embla çıkar |
| 🟢 P3 | Renk Tutarsızlığı | ListingCard.tsx:109 | Hardcoded rgba | CSS var kullan |
| 🟢 P3 | Logo Shrink | Navbar.tsx:44 | `shrink-0` parent'ta yok | `className="shrink-0"` ekle |
