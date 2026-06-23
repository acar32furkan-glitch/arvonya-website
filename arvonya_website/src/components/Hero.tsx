import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useStore, tr, type ListingType, type View } from "@/lib/store";
import { ResponsivePicture } from "@/components/ResponsivePicture";

function GrainOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full z-0"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <filter id="grain-hero">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="4"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-hero)" opacity="0.048" />
    </svg>
  );
}

function DotGrid() {
  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill="#1A1A1A" opacity="0.055" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid)" />
    </svg>
  );
}

function Word({ text, delay, color }: { text: string; delay: number; color?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="inline-block"
      style={color ? { color } : undefined}
    >
      {text}
    </motion.span>
  );
}

export function Hero() {
  const { lang, listingTypeFilter, setListingTypeFilter } = useStore();

  const tabs: { id: ListingType; label: string }[] = [
    { id: "sale", label: tr("Satılık", lang) },
    { id: "rent", label: tr("Kiralık", lang) },
  ];

  return (
    <section className="relative">
      <div className="relative min-h-screen overflow-hidden bg-[#F4F0EA]">
        <GrainOverlay />
        <DotGrid />

        <div className="pointer-events-none absolute left-[6%] top-[30%] h-[30rem] w-[30rem] rounded-full bg-[var(--brand-green)]/10 blur-[120px]" />

<motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-0 h-full w-full lg:w-[48%]"
            style={{ clipPath: "polygon(13% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
          >
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
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(244,240,234,0.55) 0%, rgba(244,240,234,0.12) 22%, transparent 42%)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F0EA]/30 via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 flex min-h-screen flex-col justify-center px-8 pt-24 pb-20 lg:w-[55%] lg:px-16 xl:px-24">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mb-7 text-[10px] uppercase tracking-[0.5em] text-neutral-400"
          >
            Gayrimenkul · Otomotiv · Güven
          </motion.p>

<h1 className="text-4xl font-light leading-[1.12] tracking-tight text-[#1A1A1A] sm:text-5xl lg:text-[4.25rem] xl:text-[5rem]" id="hero-heading">
             <span className="block">
               <Word text="Isparta'nın" delay={0.65} />
             </span>
             <span className="block font-bold">
               <Word text="Güvenilir" delay={0.78} color="var(--brand-green)" />
             </span>
             <span className="block">
               <Word text="Emlak" delay={0.9} /> <Word text="Adresi." delay={0.98} />
             </span>
           </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.7 }}
            className="mt-6 max-w-[22rem] text-sm leading-relaxed text-neutral-500"
          >
            Satılık ve kiralık konut, arsa ve ticari portföy — tek çatı altında.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25, duration: 0.6 }}
            onClick={() => {
              document.getElementById("sector-band")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="mt-6 flex w-fit items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "var(--brand-orange-dark)" }}
          >
            İlanları Keşfet
            <ArrowUpRight className="h-4 w-4" />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.65 }}
            className="mt-10 flex flex-col gap-1 text-neutral-400"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div id="sector-band" className="bg-[#F4F0EA] px-6 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 h-px bg-neutral-200" />
          <p className="mb-8 text-center text-[10px] uppercase tracking-[0.45em] text-neutral-400">
            {tr("Portföyümüzü Keşfedin", lang)}
          </p>
          <SectorBand />
        </div>
      </div>
    </section>
  );
}

function SectorBand() {
  const { setView, lang } = useStore();
  const [hover, setHover] = useState<View | null>(null);

  const sectors: { id: View; label: string; sub: string; img: string; accent: string }[] = [
    {
      id: "gayrimenkul",
      label: "Gayrimenkul",
      sub: "Satılık · Kiralık · Arsa",
      img: "/assets/property-1-CBDHeObv.webp",
      accent: "var(--brand-green)",
    },
    {
      id: "otomotiv",
      label: "Otomotiv",
      sub: "Sıfır & İkinci El Araçlar",
      img: "/assets/car-1-BNcuS9Yg.webp",
      accent: "var(--brand-orange-dark)",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row" onMouseLeave={() => setHover(null)}>
      {sectors.map((p) => {
        const expanded = hover === p.id;
        const collapsed = hover !== null && hover !== p.id;
        return (
          <article
            key={p.id}
            className={`relative min-h-[200px] w-full max-h-[500px] overflow-hidden rounded-3xl shadow-md transition-all duration-500 ease-in-out h-[56vw] md:h-[44vh] ${
              expanded ? "md:flex-[3]" : collapsed ? "md:flex-[1]" : "md:flex-1"
            }`}
          >
            <h2 className="sr-only">{p.label}</h2>
            <button
              onMouseEnter={() => setHover(p.id)}
              onClick={() => setView(p.id)}
              aria-label={`${p.label} sektörüne git`}
              className="absolute inset-0 group"
            >
              <ResponsivePicture
                src={p.img}
                alt={p.label}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                sizes="(min-width: 768px) 50vw, 100vw"
                width={1600}
                height={900}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span
                className="absolute top-0 left-0 h-1 transition-all duration-500"
                style={{ backgroundColor: p.accent, width: expanded ? "100%" : "0%" }}
              />
              <span className="absolute inset-0 flex flex-col justify-end p-6 text-left md:p-8">
                <span className="mb-2 text-[10px] uppercase tracking-[0.4em] text-white/60">
                  {p.sub}
                </span>
                <span className="flex items-end justify-between gap-4">
                  <span
                    className={`font-black leading-tight text-white transition-all duration-300 ${expanded ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}
                  >
                    {p.label}
                  </span>
                  <span
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-all duration-300 group-hover:rotate-45 group-hover:scale-110"
                    style={{ backgroundColor: p.accent }}
                    aria-hidden="true"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </span>
              </span>
            </button>
          </article>
        );
      })}
    </div>
  );
}
