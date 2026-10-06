# ARVONYA WEBSİTE — KAPSAMLI PROJE ANALİZ RAPORU

> Tarih: 2025-07  
> Analist: Kıdemli Yazılım Mimarı  
> Proje Dizini: `C:\Users\admin\Desktop\arvonya\arvonya_website`

---

## A) PROJE GENEL DURUMU

| Özellik            | Değer                                                      |
| ------------------ | ---------------------------------------------------------- |
| **Framework**      | TanStack Start (SSR) + React 19.2                          |
| **Build Aracı**    | Vite 7.3.1 (`@lovable.dev/vite-tanstack-config`)           |
| **Deploy Hedefi**  | Netlify (`@netlify/vite-plugin-tanstack-start`)            |
| **Dil**            | TypeScript 5.8                                             |
| **State Yönetimi** | React Context + useState (Zustand BENZERİ ama Context API) |
| **Styling**        | Tailwind CSS 4.2                                           |
| **Router**         | @tanstack/react-router 1.168 (file-based routing)          |
| **Veritabanı**     | Supabase (PostgreSQL)                                      |
| **SSR**            | Aktif (`shellComponent` + Nitro server)                    |
| **Animasyon**      | Framer Motion 12                                           |

### Route Listesi

| Route Dosyası     | URL                | Durum               | Açıklama                                              |
| ----------------- | ------------------ | ------------------- | ----------------------------------------------------- |
| `__root.tsx`      | — (Layout wrapper) | ✅ Çalışıyor        | SSR shell, QueryClient, Outlet, 404/Error bileşenleri |
| `index.tsx`       | `/`                | ✅ Çalışıyor        | Ana sayfa — 5 sektör view'ı arasında geçiş            |
| `listing.$id.tsx` | `/listing/:id`     | ⚠️ Kısmen çalışıyor | Detay sayfası — Supabase + seed data                  |
| `admin.tsx`       | `/admin`           | ✅ Çalışıyor        | Admin paneli — şifre korumalı                         |
| `iletisim.tsx`    | `/iletisim`        | ✅ Çalışıyor        | İletişim formu (Netlify Forms)                        |
| `kvkk.tsx`        | `/kvkk`            | ✅ Çalışıyor        | KVKK aydınlatma metni                                 |

### Önemli: `hakkimizda.tsx` ve `hizmetlerimiz.tsx` YOK

Bu dosyalar proje ağacında bulunmuyor. Eğer URL'den erişilmeye çalışılırsa 404 döner.

---

## B) KRİTİK HATALAR (Siteyi Kıran / Riskli Şeyler)

### HATA 1 — `netlify.toml` SPA Redirect Eksikliği ⛔ KRİTİK

**Dosya:** `netlify.toml`  
**Satır:** Tüm dosya

**Mevcut içerik:**

```toml
[build]
  command = "npm run build"
  publish = "dist/client"

[dev]
  command = "npm run dev"
  port = 3000

[[redirects]]
  from = "/tesekkurler"
  to = "/"
  status = 200
```

**Sorun:** SPA redirect kuralı (`/* → /index.html`) YOK. Sadece `/tesekkurler → /` redirect var.  
**Ancak:** Bu proje TanStack Start SSR kullandığı için, Nitro server her route'u sunucu tarafında render ediyor. Bu nedenle klasik SPA redirect'e gerek OLMAYABİLİR — Nitro/Netlify adapter bunu kendi hallediyor. **Yine de doğrulanmalı.**

**Risk:** Eğer Nitro adapter düzgün çalışmazsa, `/admin`, `/iletisim`, `/kvkk`, `/listing/:id` sayfaları doğrudan URL girildiğinde Netlify 404 verir.

---

### HATA 2 — `<html lang="en">` Türkçe Site İçin Yanlış ⚠️

**Dosya:** `src/routes/__root.tsx`  
**Satır:** `RootShell` fonksiyonu

```tsx
function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      {" "}
      // ← "en" OLMALIYKEN "tr" OLMALI
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
```

**Sorun:** Site tamamen Türkçe, `lang="en"` SEO ve erişilebilirlik için yanlış.  
**Düzeltilmesi:** `lang="en"` → `lang="tr"` yapılmalı.

---

### HATA 3 — Google Analytics Placeholder Değeri ⚠️

**Dosya:** `src/routes/__root.tsx`  
**Satır:** `head()` fonksiyonundaki `scripts` dizisi

```tsx
scripts: [
  {
    src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX",  // ← Placeholder!
    async: true,
  },
  {
    children:
      "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');",  // ← Placeholder!
  },
],
```

**Sorun:** `G-XXXXXXXXXX` gerçek bir GA4 Measurement ID değil. Bu şekilde deploy edilirse GA çalışmaz ve konsolda hata verir.  
**Düzeltilmesi:** Ya gerçek ID girilmeli ya da bu script bloğu kaldırılmalı.

---

### HATA 4 — Döviz Kurları Sabit (Hardcoded) ⚠️

**Dosya:** `src/lib/store.tsx`  
**Satır:** 53

```tsx
const TL_PER: Record<Currency, number> = { TL: 1, USD: 46.0601, EUR: 49.5 };
```

**Sorun:** Döviz kurları sabit kodlanmış. Zamanla güncelliğini yitirecek. USD/TL kuru 46.0601 sabit — bugün bile farklı olabilir.  
**Öneri:** Bir API'den (TCMB, ExchangeRate API) güncel kur çekilmeli veya en azından .env'den yönetilmeli.

---

### HATA 5 — Seed Data'da Eksik/Görsel Referansı ⚠️

**Dosya:** `src/lib/seed-data.ts`

```tsx
// p4 ilanında:
images: ["/assets/p4-orchard.jpg", "/assets/p4-1.jpg", "/assets/p4-2.jpg"],
```

`p4-orchard.jpg` dosyası `public/assets/` klasöründe YOK. `ls` çıktısında görülmüyor.  
**Sonuç:** Bu ilanın kapak görseli kırık (404) olacak.

Ayrıca:

```tsx
// p3 ilanında:
images: ["/assets/property-1-CBDHeObv.jpg", ...]
```

Bu dosya public klasöründe var mı? Kontrol edilmeli — hash son ekli dosya isimleri Vite asset hashing'den geliyor olabilir.

---

### HATA 6 — `listing.$id.tsx` Supabase Import Yolu Tutarsızlığı ⚠️

**Dosya:** `src/routes/listing.$id.tsx`  
**Satır:** 5

```tsx
import { supabase } from "@/utils/supabase";
```

Ancak `src/lib/supabase.ts` dosyası da var ve sadece re-export yapıyor:

```tsx
export { supabase } from "@/utils/supabase";
```

Bu şu an çalışıyor ama iki ayrı supabase import yolu var (`@/utils/supabase` ve `@/lib/supabase`). **Tutarlılık için tek bir yol kullanılmalı.**

---

### HATA 7 — İletişim Formu Netlify Forms SSR ile Çalışmayabilir ⚠️

**Dosya:** `src/routes/iletisim.tsx`  
**Satır:** 50-60

```tsx
const response = await fetch("/", {
  method: "POST",
  body: formData,
});
```

**Sorun:** Netlify Forms, SPA modda `POST /` ile çalışır. Ancak bu proje SSR (TanStack Start + Nitro) kullanıyor. Nitro server `POST /` isteğini kendi handle edebilir ve Netlify Forms'a ulaşmayabilir.  
**Risk:** İletişim formu gönderimleri sessizce başarısız olabilir.

---

### HATA 8 — Admin Panel `VITE_ADMIN_PASSWORD` Environment Variable Zorunlu ⚠️

**Dosya:** `src/routes/admin.tsx`  
**Satır:** 33

```tsx
const adminPw = import.meta.env.VITE_ADMIN_PASSWORD;
```

**Sorun:** Eğer `VITE_ADMIN_PASSWORD` .env dosyasında tanımlı değilse, `adminPw` `undefined` olur ve `pw === undefined` hiçbir zaman `true` olmayacağından **admin paneline giriş yapılamaz**.  
**Ayrıca:** Bu şifre client-side bundle'a açık metin olarak gidiyor — güvensiz.

---

### HATA 9 — StoreProvider Her Route'ta Ayrı Ayrı Sarılıyor ⚠️

**Dosya:** Tüm route dosyaları (`index.tsx`, `admin.tsx`, `iletisim.tsx`, `kvkk.tsx`, `listing.$id.tsx`)

Her route'un `component` fonksiyonu kendi `StoreProvider`'ını sarıyor:

```tsx
component: () => (
  <StoreProvider>
    <SomePage />
  </StoreProvider>
),
```

**Sorun:** Her route geçişinde `StoreProvider` yeniden mount oluyor ve `useEffect` içinde Supabase'den veriler **yeniden çekiliyor**. State (favoriler, filtreler vb.) sayfalar arası kaybolabilir çünkü her route kendi provider instance'ına sahip.  
**Düzeltilmesi:** `StoreProvider` `__root.tsx`'te tek bir kez sarılmalı.

---

## C) META TAG DURUMU

| Route          | og:title                                   | og:description | og:image              | twitter:card             | Durum                                          |
| -------------- | ------------------------------------------ | -------------- | --------------------- | ------------------------ | ---------------------------------------------- |
| `/` (\_\_root) | ✅ `Arvonya Grup \| Gayrimenkul...`        | ✅ Var         | ❌ Yok                | ❌ Yok                   | Root sadece base title/description             |
| `/` (index)    | ✅ `Arvonya Grup — Kurumsal Güven...`      | ✅ Var         | ✅ `logo_preview.png` | ✅ `summary_large_image` | ✅ Tam                                         |
| `/listing/:id` | ✅ Dinamik (`${listing.title}`)            | ✅ Dinamik     | ✅ İlk görsel         | ✅ `summary_large_image` | ✅ Tam                                         |
| `/admin`       | ✅ `Admin — Arvonya Group`                 | ❌ Yok         | ❌ Yok                | ❌ Yok                   | ⚠️ Admin için gerekli değil ama indexlenmemeli |
| `/iletisim`    | ✅ `İletişim \| Arvonya Grup`              | ❌ Yok         | ❌ Yok                | ❌ Yok                   | ⚠️ og:description eksik                        |
| `/kvkk`        | ✅ `KVKK Aydınlatma Metni \| Arvonya Grup` | ❌ Yok         | ❌ Yok                | ❌ Yok                   | ⚠️ og:description eksik                        |

### Detaylı Bulgular:

1. **`/iletisim`** — `og:description`, `og:image`, `og:url`, `twitter:*` tagları tamamen eksik. Sosyal medya paylaşımlarında düzgün önizleme göstermez.
2. **`/kvkk`** — Aynı şekilde sosyal medya meta tagları eksik.
3. **`/admin`** — `robots.txt`'de `Disallow: /admin` var ✅ ama meta tag ile `noindex` eklenmeli.
4. **`/listing/:id`** — `head()` fonksiyonu loader verisini kullanıyor. SSR'da loader çalıştığı için meta taglar doğru şekilde sunucu tarafında render edilecek. ✅

---

## D) STORE VERİ YAPISI

### Store Mimarisi

Store, Zustand DEĞİL, **React Context + useState** ile implement edilmiş:

```
StoreCtx (React Context)
  └── StoreProvider (Component)
        ├── useState: view, currency, lang, isLoading
        ├── useState: properties[], vehicles[]
        ├── useState: appointments[], translationRequests[], leads[]
        ├── useState: favorites[], sectors[]
        ├── useState: sort, listingTypeFilter, searchQuery, locationFilter
        ├── useState: priceMin, priceMax, roomsFilter, vehicleTypeFilter
        └── useEffect: Supabase'den ilk yükleme
```

### İlanlar Nasıl Tutuluyor?

```typescript
// Property (Emlak)
interface Property extends BaseListing {
  kind: "property";
  listingType: "sale" | "rent";
  subType: "konut" | "arsa";
  location: string; // "İl / İlçe / Mahalle" formatında
  type: string; // "Konut", "Arsa / Bahçe", "Arsa"
  rooms?: string; // "3+1"
  m2?: number; // Konut için
  area?: number; // Arsa için
  baths?: number;
  floor?: string;
  tapu?: string; // "Müstakil" | "Hisseli"
  imar?: string; // "Konut İmarlı" | "Tarla" | "Bağ-Bahçe"
  binaYasi?: string;
  katSayisi?: string;
  isitma?: string;
  balkon?: string;
  kullanim?: string;
}

// Vehicle (Araç)
interface Vehicle extends BaseListing {
  kind: "vehicle";
  listingType: "sale"; // Araçlar sadece satılık
  year: number;
  km: number;
  gear: string;
  fuel: string;
  damage: string;
  renk?: string;
  motorGucu?: string;
  ekspertiz?: string;
}
```

### Yeni İlan Eklemek İçin Gerekli Alanlar

**Property (minimum):**

- `id`, `code`, `title`, `priceTL`, `images[]`, `description`, `createdAt`
- `kind: "property"`, `listingType`, `subType`, `location`, `type`
- Konut ise: `rooms`, `m2`
- Arsa ise: `area`, `tapu`, `imar`

**Vehicle (minimum):**

- `id`, `code`, `title`, `priceTL`, `images[]`, `description`, `createdAt`
- `kind: "vehicle"`, `listingType: "sale"`, `year`, `km`, `gear`, `fuel`, `damage`

### `useStore.getState()` SSR'da Çalışır mı?

**HAYIR.** Bu Zustand değil, React Context. `useStore()` bir React hook'u (`useContext` sarıcı). SSR'da ancak bir React bileşeni içinde çalışır. Server-side'da doğrudan erişilemez.

---

## E) ADMIN PANELİ DURUMU

### Genel Yapı

- **Route:** `/admin` ✅ Var
- **Şifre Koruması:** ✅ Var — `VITE_ADMIN_PASSWORD` env değişkeni ile
- **İlan Ekleme:** ✅ Mümkün — Modal form ile yeni ilan oluşturma
- **İlan Düzenleme:** ✅ Mümkün — Mevcut ilanı düzenleme modalı
- **İlan Silme:** ✅ Mümkün — Onay modalı ile
- **Görsel Yükleme:** ✅ Supabase Storage'a yükleme
- **Sektör Yönetimi:** ✅ Aktif/Pasif toggle + düzenleme
- **Randevu Yönetimi:** ✅ WhatsApp ile yanıtlama
- **Tercüme Talepleri:** ✅ Listeleme

### Güvenlik Sorunları

1. **Şifre client-side'da:** `import.meta.env.VITE_ADMIN_PASSWORD` Vite tarafından client bundle'ına açık metin olarak eklenir. Tarayıcı DevTools'tan görülebilir.
2. **API koruması yok:** Supabase insert/update/delete işlemleri admin şifresiyle korunmuyor. Supabase client anon key ile çalışıyor — RLS (Row Level Security) olmadan herkes Supabase'e doğrudan yazabilir.
3. **Session yok:** Sayfa yenilendiğinde tekrar şifre girilmeli. JWT/session tabanlı auth yok.

### Admin Panel Sekmeleri

| Sekme             | İşlev                      | Durum |
| ----------------- | -------------------------- | ----- |
| İstatistikler     | Toplam ilan/talep sayıları | ✅    |
| Emlak İlanları    | CRUD işlemleri             | ✅    |
| Araç İlanları     | CRUD işlemleri             | ✅    |
| Sektörleri Yönet  | Aktif/Pasif + düzenleme    | ✅    |
| Tercüme Talepleri | Listeleme                  | ✅    |
| Randevular        | Listeleme + WhatsApp yanıt |
