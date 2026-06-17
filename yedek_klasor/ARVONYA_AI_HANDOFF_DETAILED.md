# Arvonya Website - Ultra Detailed AI Handoff

Hazirlayan: GitHub Copilot
Olusturma Tarihi: 2026-06-08
Workspace Koku: c:/Users/admin/Desktop/arvonya
Canli URL: https://arvonya-website.netlify.app
Ana Proje Klasoru: c:/Users/admin/Desktop/arvonya/arvonya_website

---

## 1) Proje Ozeti

Bu proje, TanStack Start SSR tabanli, React 19 + Vite 7 ile gelistirilmis, Netlify uzerinde deploy edilen kurumsal bir web uygulamasidir.

Marka: Arvonya Grup
Ana is alanlari:
- Gayrimenkul ilanlari
- Otomotiv ilanlari
- Dis ticaret hizmetleri
- Tercume hizmetleri
- Kurumsal tanitim

Uygulamada hem ziyaretci arayuzu hem de sifre korumali bir admin panel bulunur.

---

## 2) Teknoloji Stack'i

### Core
- React 19.2.0
- React DOM 19.2.0
- TypeScript 5.8.x
- Vite 7.3.x
- TanStack React Router 1.168.x
- TanStack React Start 1.167.x
- TanStack React Query 5.83.x

### UI ve Motion
- Tailwind CSS 4.2.x
- tw-animate-css
- Radix UI (genis paket seti)
- shadcn/ui yapilandirmasi (components.json)
- Framer Motion 12.40.x
- Lucide React ikonlari

### Form ve Validation
- react-hook-form
- zod
- @hookform/resolvers

### Build / Deploy
- @lovable.dev/vite-tanstack-config
- @netlify/vite-plugin-tanstack-start
- Netlify (SSR function output)

### Kod Kalitesi
- ESLint 9 + typescript-eslint
- Prettier 3

---

## 3) Klasor ve Dosya Haritasi (Anlamlandirilmis)

## 3.1 Workspace Root
- ARVONYA GRUP LOGO.pdf -> Marka dokuman
- vizyon_misyon.md -> Kurumsal metin girdileri
- logo_*.png -> Farkli logo varyantlari
- arvonya_website/ -> Asil uygulama

## 3.2 Application Root (arvonya_website)
- package.json -> Scriptler ve bagimliliklar
- vite.config.ts -> TanStack Start + Netlify plugin konfig
- netlify.toml -> Build publish/dev ayarlari
- tsconfig.json -> TS strict config + @/* alias
- eslint.config.js -> Lint kurallari
- components.json -> shadcn/ui alias ve stil ayarlari
- bunfig.toml -> Bun install guvenlik ayari (minimum release age)
- src/ -> Uygulama kaynak kodu
- public/ -> Statik varliklar
- dist/ -> Build output
- .tanstack/ -> TanStack internal
- .netlify/ -> Netlify local/build artifact
- .lovable/ -> Lovable context dosyalari

## 3.3 src/ Ic Yapisi
- router.tsx -> Router instance ve QueryClient context
- start.ts -> createStart middleware setup
- server.ts -> SSR fetch wrapper + catastrophic error normalization
- routeTree.gen.ts -> auto-generated route tree
- styles.css -> Tailwind theme + brand tokenlar + custom utility classlar
- routes/ -> File-based route dosyalari
- components/ -> Site bilesenleri
- hooks/ -> Custom hooklar
- lib/ -> Store, config, error handling, util
- views/ -> Sektor bazli ekranlar
- assets/ -> Resim ve medya

---

## 4) Route Mimarisi (TanStack File-Based)

Aktif route seti routeTree.gen.ts icinden:
- / -> src/routes/index.tsx
- /admin -> src/routes/admin.tsx
- /listing/$id -> src/routes/listing.$id.tsx
- Root shell -> src/routes/__root.tsx

Not: routeTree.gen.ts otomatik uretilir, manuel degistirilmemeli.

---

## 5) Root Shell ve Global Meta

Dosya: src/routes/__root.tsx

Yaptiklari:
- Html shell tanimi (HeadContent + Scripts)
- QueryClientProvider wrapping
- 404 NotFound component
- Root ErrorBoundary ve hata raporlama cagrisi (reportLovableError)
- Global default meta seti

Onemli not:
- Root-level meta icinde hala "Lovable App" ve Lovable image/url bazli degerler mevcut.
- Child route'lar head() ile override edebiliyor; ancak bazi sosyal preview istemcilerinde root/default ve page meta celisebilir.

---

## 6) Ana Sayfa Davranisi

Dosya: src/routes/index.tsx

- head() ile ana sayfa title/description/author/og bilgileri set ediyor.
- StoreProvider ile Home component sariliyor.
- Home icinde:
  - IntroAnimation
  - AmbientBackdrop
  - Navbar
  - FilterCapsule
  - ChatbotCapsule
  - Sector tab secimine gore asagidaki view'lar:
    - KurumsalView
    - GayrimenkulView
    - OtomotivView
    - DisTicaretView
    - TercumeView

---

## 7) Ilan Detay Sayfasi

Dosya: src/routes/listing.$id.tsx
URL pattern: /listing/:id

Detay:
- Sayfa item bulmak icin property/vehicle listesinde id ariyor.
- UI iki kolonlu: galeri + specs + fiyat + aciklama + WhatsApp + randevu modal
- Favori toggle destekliyor.

Meta hedefi:
- Ilan bazli dinamik OG/meta hedeflenmis.

Kritik teknik not:
- Bu dosyada loader icinde useStore.getState() ve useParams kullanimi var.
- Mevcut store implementasyonu React context tabanli (zustand degil), yani useStore.getState() mevcut degil.
- Build su an geciyor olsa da bu kisim runtime/SSR davranisinda sorun cikarma potansiyeli tasiyor.

---

## 8) Admin Panel

Dosya: src/routes/admin.tsx

Ozellikler:
- Basit parola kontrolu (VITE_ADMIN_PASSWORD veya fallback: arvonya2026)
- Sol menu + mobil drawer
- Tab bazli yonetim:
  - Istatistikler
  - Emlak ilanlari CRUD
  - Arac ilanlari CRUD
  - Sektor yonetimi
  - Tercume talepleri
  - Randevular

Is akislar:
- Listing olusturma/duzenleme/silme
- Appointment status guncelleme
- Tercume talepleri goruntuleme
- Sektor aktiflik/etiket guncelleme

Guvenlik notu:
- Frontend-side sifre korumasi oldugu icin gercek guvenlik siniri yok.
- Uretimde server-side auth/RBAC gereklidir.

---

## 9) State Yonetimi (src/lib/store.tsx)

Mimari:
- React Context + useState tabanli local state
- Uygulama acilisinda localStorage'dan hydrate
- Seed data + user data merge yaklasimi

Ana tipler:
- View: kurumsal | gayrimenkul | otomotiv | disticaret | tercume
- Currency: TL | USD | EUR
- Lang: TR | EN
- ListingType: sale | rent
- PropertySubType: konut | arsa
- Listing: Property | Vehicle

Seed data:
- 5 adet property
- 2 adet vehicle
- default sector listesi

Yardimci fonksiyonlar:
- formatPrice(tl, currency)
- tr(text, lang) -> EN seciminde "-(EN)" suffix ekliyor
- applySort(items, sort)

## 9.1 LocalStorage Key Envanteri
- arvonya_properties
- arvonya_vehicles
- arvonya_properties_override
- arvonya_vehicles_override
- arvonya_properties_deleted
- arvonya_vehicles_deleted
- arvonya_appointments
- arvonya_translations
- arvonya_leads
- arvonya_favorites
- arvonya_sectors

## 9.2 Veri Birlesimi Stratejisi
- Seed + user-created listeler birlestiriliyor
- Seed kayitlari icin override/deleted keyleriyle mutation uygulanmis
- User-created kayitlar direkt user listede tutuluyor

---

## 10) View Katmani (src/views/SectorViews.tsx)

### GayrimenkulView
- listingType, location, query, min/max fiyat, oda filtresi
- sort + ListingCard render
- Hero + NedenArvonya + LeadForm + Footer

### OtomotivView
- Fiyat araligi filtrelemesi
- sort + ListingCard
- LeadForm + Footer

### DisTicaretView
- 3 hizmet karti
- Kart click -> WhatsApp prefilled mesaj

### TercumeView
- 3 adimli wizard:
  1) Dil secimi
  2) Dosya yukleme
  3) Iletisim bilgileri
- Simule teklif uretimi (setTimeout)
- Talep store'a kaydediliyor

### KurumsalView
- Biz Kimiz / Misyon / Vizyon tabli icerik sunumu

---

## 11) Bilesen Envanteri

Ana bilesenler (src/components):
- AmbientBackdrop
- ChatbotCapsule
- FavoritesDrawer
- FilterCapsule
- Footer
- Hero
- IntroAnimation
- LeadForm
- ListingCard
- Logo
- Navbar
- NedenArvonya

UI primitive seti (src/components/ui):
- accordion, alert, alert-dialog
- aspect-ratio, avatar, badge, breadcrumb
- button, calendar, card, carousel, chart
- checkbox, collapsible, command, context-menu
- dialog, drawer, dropdown-menu
- form, hover-card, input, input-otp
- label, menubar, navigation-menu
- pagination, popover, progress
- radio-group, resizable, scroll-area, select
- separator, sheet, sidebar, skeleton, slider
- sonner, switch, table, tabs, textarea
- toggle, toggle-group, tooltip

---

## 12) Styling Sistemi (src/styles.css)

- Tailwind CSS v4 config css-icinde
- Brand renk tokenlari:
  - brand-orange: #E8521A
  - brand-green: #2EAA4A
- Global theme token mapleri (background, foreground, card, border vb.)
- Custom utility classlar:
  - btn-outline-orange
  - btn-outline-green
  - btn-outline-red
- Lovable badge gizleme CSS rule'lari
- Blob ve aura animasyon keyframe'leri

Not:
- Font tokenlari Inter odakli.

---

## 13) SSR ve Hata Yonetimi

### start.ts
- createStart + server middleware
- Try/catch ile 500 fallback html response (renderErrorPage)

### server.ts
- @tanstack/react-start/server-entry dynamic import
- h3 tarafinda swallow edilen "unhandled HTTPError" durumunu detect edip
  JSON 500 yerine custom HTML error page donduruyor

### error-capture.ts
- global error + unhandledrejection yakalama
- son yakalanan hatayi TTL ile elde tutma

### error-page.ts
- plain HTML fallback error sayfasi

### lovable-error-reporting.ts
- window.__lovableEvents captureException entegrasyonu

---

## 14) API / Server Function Katmani

Dosya: src/lib/api/example.functions.ts

- createServerFn + zod input validation ornegi var
- POST method ile name alip greeting donduruyor
- getServerConfig() cagrisi ile server env okumasi gosteriliyor

Gercek is API'si su an dosya tabaninda gorunmuyor; proje agirlikli olarak local state + localStorage uzerinden calisiyor.

---

## 15) Build ve Deploy Bilgileri

### package.json scriptleri
- dev: vite dev
- build: vite build
- build:dev: vite build --mode development
- preview: vite preview
- lint: eslint .
- format: prettier --write .

### netlify.toml
- build command: npm run build
- publish: dist/client
- dev command: npm run dev
- dev port: 3000

### Vite config
- defineConfig from @lovable.dev/vite-tanstack-config
- tanstackStart.server.entry = "server"
- netlify plugin aktif

### Son build kontrolu (2026-06-08)
- npm run build -> BASARILI
- Client ve SSR bundle olustu
- Netlify SSR entry yazildi: .netlify/v1/functions/server.mjs

---

## 16) Konfigurasyon ve Kalite Kurallari

### TypeScript
- strict: true
- moduleResolution: Bundler
- alias: @/* -> src/*

### ESLint
- dist/.output/.vinxi ignore
- react-hooks kurallari aktif
- react-refresh only-export-components warning
- no-restricted-imports ile "server-only" paketi yasak

### Bun guvenlik notu
- minimumReleaseAge = 86400
- yeni publish edilen paketleri 24 saat bekletme politikasi var

---

## 17) Kurumsal Icerik Kaynagi

Dosya: vizyon_misyon.md

Icerik:
- Biz Kimiz
- Misyon
- Vizyon

Not:
- Dosyada WhatsApp export benzeri tekrarli metin bloklari var.
- Kurumsal ekran metinleri bu kaynagin sadeleştirilmis bir varyanti gibi gorunuyor.

---

## 18) Bilinen Riskler ve Teknik Borc

1) Root meta fallback hala Lovable
- __root.tsx icinde global title/og/twitter degerleri Lovable kalmis.
- Sosyal crawler davranisina gore beklenmedik preview dogurabilir.

2) listing.$id route loader mimarisi
- useStore.getState() cagrisi mevcut store modeliyle uyumsuz.
- Runtime'da veri/SSR senaryolarinda kirilma riski var.

3) Admin auth client-side
- Gercek bir backend auth olmadan panel korunmasi zayif.

4) Persisted localStorage semasi
- Veri migration/versioning stratejisi yok.
- Gelecekte schema degisimlerinde eski key/format sorunlari olusabilir.

5) tr() fonksiyonu
- Gercek i18n yerine EN seciminde suffix ekleme yaklasimi var.

---

## 19) Diger AI Icin Hizli Onboarding Notlari

Bu projeyi devralan AI asagidaki sirayla ilerlemeli:

1) Projeyi calistir
- npm install
- npm run dev

2) Route ve meta audit yap
- __root.tsx
- index.tsx
- listing.$id.tsx
- route bazli head() precedence test et

3) Store modelini netlestir
- Context tabanli oldugu icin loader/server tarafinda dogrudan state erisimi stratejisi belirle
- SSR-compatible data source tasarla (server function veya API)

4) Admin panel guvenligini sertlestir
- server-side auth
- role bazli yetkilendirme

5) Production checklist
- social preview testleri (WhatsApp, X, Facebook)
- localStorage migration policy
- error telemetry endpoint

---

## 20) Kritik Dosyalarin Kisa Listesi

- src/routes/__root.tsx
- src/routes/index.tsx
- src/routes/listing.$id.tsx
- src/routes/admin.tsx
- src/lib/store.tsx
- src/views/SectorViews.tsx
- src/server.ts
- src/start.ts
- src/styles.css
- src/lib/api/example.functions.ts
- vite.config.ts
- netlify.toml
- package.json
- tsconfig.json
- eslint.config.js

---

## 21) Sonuc

Arvonya website, guclu bir frontend deneyimi ve hizli prototipleme odakli bir mimariyle kurulmus durumda.
Canliya cikis ve SSR build akisi calisiyor.
Bununla birlikte SEO/meta tutarliligi, SSR'de ilan verisi erisimi ve admin guvenligi konulari bir sonraki iterasyonun en kritik iyilestirme alanlari.
