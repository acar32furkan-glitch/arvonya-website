import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useStore, applySort, tr } from "@/lib/store";
import { ListingCard } from "@/components/ListingCard";
import { LeadForm } from "@/components/LeadForm";
import { Hero } from "@/components/Hero";
import { NedenArvonya } from "@/components/NedenArvonya";
import { Footer } from "@/components/Footer";
import { Upload, Check, Loader2 } from "lucide-react";
import { ResponsivePicture } from "@/components/ResponsivePicture";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5 },
};

export function GayrimenkulView() {
  const {
    properties,
    sort,
    listingTypeFilter,
    searchQuery,
    locationFilter,
    lang,
    priceMin,
    priceMax,
    roomsFilter,
  } = useStore();
  let filtered = properties.filter((p) => p.listingType === listingTypeFilter);
  if (locationFilter) filtered = filtered.filter((p) => p.location === locationFilter);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q),
    );
  }
  if (priceMin) filtered = filtered.filter((p) => p.priceTL >= Number(priceMin));
  if (priceMax) filtered = filtered.filter((p) => p.priceTL <= Number(priceMax));
  if (roomsFilter)
    filtered = filtered.filter((p) => p.kind === "property" && p.rooms === roomsFilter);
  const sorted = applySort(filtered, sort);
  return (
    <motion.section {...fade}>
      <Hero />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="space-y-10">
          {sorted.length > 0 ? (
            sorted.map((p) => <ListingCard key={p.id} item={p} />)
          ) : (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-lg">{tr("Aramanıza uygun ilan bulunamadı.", lang)}</p>
            </div>
          )}
        </div>
      </div>
      <NedenArvonya />
      <LeadForm />
      <Footer />
    </motion.section>
  );
}

export function OtomotivView() {
  const { vehicles, sort, lang, priceMin, priceMax, vehicleTypeFilter } = useStore();
  let filtered = [...vehicles];
  if (priceMin) filtered = filtered.filter((v) => v.priceTL >= Number(priceMin));
  if (priceMax) filtered = filtered.filter((v) => v.priceTL <= Number(priceMax));
  const sorted = applySort(filtered, sort);
  return (
    <motion.section {...fade}>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <header className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
            {tr("Otomotiv", lang)}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05]">
            <span className="text-[var(--brand-orange-dark)]">{tr("Güvenilir", lang)}</span>{" "}
            {tr("Araçlar,", lang)}
            <br />
            {tr("Her Bütçeye Uygun.", lang)}
          </h1>
        </header>
        <div className="mb-8">
          <a
            href="https://wa.me/905382402246?text=Merhaba,%20otomotiv%20araçları%20hakkında%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-green-light"
          >
            <span>{tr("WhatsApp ile Bilgi Al", lang)}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H8a2 2 0 00-2 2v10.586l3.293-3.293a1 1 0 011.414 0L16 18.586V14a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h5.586l-3.293 3.293a1 1 0 001.414 1.414L20 15.414V18a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 002-2z"
              />
            </svg>
          </a>
        </div>
        <div className="mb-8">
          <a
            href="https://wa.me/905382402246?text=Merhaba,%20gayrimenkul%20ilanları%20hakkında%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-green-light"
          >
            <span>{tr("WhatsApp ile İletişime Geç", lang)}</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H8a2 2 0 00-2 2v10.586l3.293-3.293a1 1 0 011.414 0L16 18.586V14a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h5.586l-3.293 3.293a1 1 0 001.414 1.414L20 15.414V18a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 002-2z"
              />
            </svg>
          </a>
        </div>
        <div className="space-y-8">
          {sorted.map((v) => (
            <ListingCard key={v.id} item={v} />
          ))}
        </div>
      </div>
      <LeadForm />
      <Footer />
    </motion.section>
  );
}

const trades = [
  {
    title: "Uluslararası Lojistik & Taşımacılık",
    image: "/assets/trade-1.webp",
    vision: "Kıtalar arası kesintisiz tedarik zinciri çözümleri ile ticareti hızlandırıyoruz.",
  },
  {
    title: "Endüstriyel Ürün İhracatı",
    image: "/assets/trade-2.webp",
    vision: "Üretici ile küresel pazar arasında stratejik bir köprü kuruyoruz.",
  },
  {
    title: "Tekstil ve Hammadde Ticareti",
    image: "/assets/trade-3.webp",
    vision: "Anadolu'nun tekstil mirasını dünyanın dört bir yanına taşıyoruz.",
  },
];

export function DisTicaretView() {
  const { lang } = useStore();
  const waUrl = (title: string) =>
    `https://wa.me/905382402246?text=${encodeURIComponent(`Merhaba, ${title} hizmeti hakkında bilgi almak istiyorum.`)}`;
  return (
    <motion.section {...fade} className="mx-auto max-w-7xl px-6 pt-32 pb-24">
      <header className="mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          {tr("Dış Ticaret", lang)}
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05]">
          {tr("Sınırların ötesinde, güvenin merkezinde.", lang)}
        </h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trades.map((t) => (
          <a
            key={t.title}
            href={waUrl(t.title)}
            target="_blank"
            rel="noreferrer"
            className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-card border border-border/60 block"
          >
            <ResponsivePicture
              src={t.image}
              alt={tr(t.title, lang)}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.35]"
              sizes="(min-width: 768px) 33vw, 100vw"
              width={1000}
              height={1250}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-7 flex flex-col justify-end text-white">
              <h2 className="text-2xl font-semibold leading-tight">{tr(t.title, lang)}</h2>
              <p className="mt-3 text-sm text-white/0 group-hover:text-white/90 transition-all duration-500 max-w-xs">
                {tr(t.vision, lang)}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-brand-green group-hover:text-brand-green-light">
                {tr("WhatsApp ile Bilgi Al", lang)}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H8a2 2 0 00-2 2v10.586l3.293-3.293a1 1 0 011.414 0L16 18.586V14a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h5.586l-3.293 3.293a1 1 0 001.414 1.414L20 15.414V18a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 002-2z"
                  />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}

export function TercumeView() {
  const { addTranslationRequest } = useStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    from: "Türkçe",
    to: "İngilizce",
    fileName: "",
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<string | null>(null);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const submit = () => {
    setLoading(true);
    setTimeout(() => {
      addTranslationRequest({ id: `t${Date.now()}`, ...data });
      setLoading(false);
      setQuote(
        "Yapay Zeka Destekli Tahmini Teklif: 1.500 TL – 1.900 TL (Kesin fiyatlandırma uzman onayı sonrası iletilecektir)",
      );
    }, 1800);
  };

  return (
    <motion.section {...fade} className="mx-auto max-w-3xl px-6 pt-32 pb-24">
      <header className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          Tercüme Hizmetleri
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Belgenizi yükleyin, yapay zeka teklifi anında.
        </h1>
      </header>
      <div className="mb-8 text-center">
        <a
          href="https://wa.me/905382402246?text=Merhaba,%20tercüme%20hizmeti%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-green-light"
        >
          <span>WhatsApp ile ön fiyat al</span>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H8a2 2 0 00-2 2v10.586l3.293-3.293a1 1 0 011.414 0L16 18.586V14a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2h5.586l-3.293 3.293a1 1 0 001.414 1.414L20 15.414V18a2 2 0 00-2 2H6a2 2 0 00-2-2v-2a2 2 0 002-2z"
            />
          </svg>
        </a>
      </div>

      {quote ? (
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-brand-green/10 flex items-center justify-center mb-6">
            <Check className="h-7 w-7 text-brand-green" />
          </div>
          <p className="text-xl font-medium leading-relaxed">{quote}</p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10">
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${step >= s ? "bg-foreground" : "bg-border"}`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Adım 1 — Dil seçimi</h2>
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Kaynak Dil"
                  value={data.from}
                  onChange={(v) => setData({ ...data, from: v })}
                />
                <Select
                  label="Hedef Dil"
                  value={data.to}
                  onChange={(v) => setData({ ...data, to: v })}
                />
              </div>
              <button
                onClick={next}
                className="w-full py-3 rounded-full bg-foreground text-background font-medium"
              >
                Devam
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Adım 2 — Belge yükle</h2>
              <label className="block">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setData({ ...data, fileName: e.target.files?.[0]?.name ?? "" })}
                />
                <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:bg-secondary/50 cursor-pointer transition">
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm">
                    {data.fileName || "Dosyayı buraya sürükleyin veya tıklayın"}
                  </p>
                </div>
              </label>
              {data.fileName && (
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2 }}
                    className="h-full bg-brand-green"
                  />
                </div>
              )}
              <button
                onClick={next}
                disabled={!data.fileName}
                className="w-full py-3 rounded-full bg-foreground text-background font-medium disabled:opacity-40"
              >
                Devam
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Adım 3 — İletişim</h2>
              <input
                className="w-full px-4 py-3 rounded-xl border border-border"
                placeholder="Ad Soyad"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
              <input
                className="w-full px-4 py-3 rounded-xl border border-border"
                placeholder="E-posta"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
              <input
                className="w-full px-4 py-3 rounded-xl border border-border"
                placeholder="Telefon"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
              />
              <button
                onClick={submit}
                disabled={loading}
                className="w-full py-3 rounded-full bg-foreground text-background font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analiz ediliyor…
                  </>
                ) : (
                  "Ücretsiz Teklif Al"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </motion.section>
  );
}

function Select({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const opts = ["Türkçe", "İngilizce", "Almanca", "Fransızca", "Arapça", "Rusça", "İspanyolca"];
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full px-4 py-3 rounded-xl border border-border bg-white"
      >
        {opts.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

export function KurumsalView() {
  const { lang } = useStore();
  const tabs = [
    {
      id: "biz",
      label: tr("Biz Kimiz", lang),
      content: tr(
        "Arvonya Group; emlak, yatırım, otomotiv ve dış ticaret sektörleri ile profesyonel tercüme hizmetlerinde faaliyet gösteren çok yönlü kurumsal bir yapıdır. 'Kurumsal Güven, Kalıcı İstikrar' ilkesiyle değer katan stratejik çözümler sunuyoruz.",
        lang,
      ),
    },
    {
      id: "misyon",
      label: tr("Misyonumuz", lang),
      content: tr(
        "Müşterilerimize her sektörde şeffaf, ölçülebilir ve sürdürülebilir değer üretmek; uluslararası standartlarda hizmet kalitesini Türk iş dünyasına taşımak.",
        lang,
      ),
    },
    {
      id: "vizyon",
      label: tr("Vizyonumuz", lang),
      content: tr(
        "Bölgemizde güvenin ve kurumsal istikrarın referans markası olmak; teknoloji, insan ve sermayeyi en yüksek verimle birleştirmek.",
        lang,
      ),
    },
  ];
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active)!;
  return (
    <motion.section {...fade} className="mx-auto max-w-4xl px-6 pt-32 pb-24">
      <header className="mb-12 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">
          {tr("Kurumsal", lang)}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          {tr("Kurumsal Güven, Kalıcı İstikrar", lang)}
        </h1>
      </header>
      <div className="rounded-3xl border border-border bg-card p-2">
        <div className="flex gap-1 overflow-x-auto p-1 bg-secondary/50 rounded-2xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`flex-1 min-w-fit px-5 py-2.5 text-sm font-medium rounded-xl transition ${active === t.id ? "bg-white shadow-sm" : "text-muted-foreground"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="p-8 md:p-12"
          >
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
              {current.content}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
