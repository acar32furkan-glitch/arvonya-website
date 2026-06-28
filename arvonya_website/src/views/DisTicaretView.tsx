import { motion } from "framer-motion";
import { useStore, tr } from "@/lib/store";
import { ResponsivePicture } from "@/components/ResponsivePicture";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5 },
};

const trades = [
  { title: "Uluslararası Lojistik & Taşımacılık", image: "/assets/trade-1.webp", vision: "Kıtalar arası kesintisiz tedarik zinciri çözümleri ile ticareti hızlandırıyoruz." },
  { title: "Endüstriyel Ürün İhracatı", image: "/assets/trade-2.webp", vision: "Üretici ile küresel pazar arasında stratejik bir köprü kuruyoruz." },
  { title: "Tekstil ve Hammadde Ticareti", image: "/assets/trade-3.webp", vision: "Anadolu'nun tekstil mirasını dünyanın dört bir yanına taşıyoruz." },
];

export function DisTicaretView() {
  const { lang } = useStore();
  const waUrl = (title: string) => `https://wa.me/905382402246?text=${encodeURIComponent(`Merhaba, ${title} hizmeti hakkında bilgi almak istiyorum.`)}`;
  return (
    <motion.section {...fade} className="mx-auto max-w-7xl px-6 pt-32 pb-24">
      <header className="mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{tr("Dış Ticaret", lang)}</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05]">{tr("Sınırların ötesinde, güvenin merkezinde.", lang)}</h1>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trades.map((t) => (
          <a key={t.title} href={waUrl(t.title)} target="_blank" rel="noreferrer" className="group relative aspect-[4/5] overflow-hidden rounded-3xl bg-card border border-border/60 block">
            <ResponsivePicture src={t.image} alt={tr(t.title, lang)} className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-[0.35]" sizes="(min-width: 768px) 33vw, 100vw" width={1000} height={1250} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-0 p-7 flex flex-col justify-end text-white">
              <h2 className="text-2xl font-semibold leading-tight">{tr(t.title, lang)}</h2>
              <p className="mt-3 text-sm text-white/0 group-hover:text-white/90 transition-all duration-500 max-w-xs">{tr(t.vision, lang)}</p>
            </div>
          </a>
        ))}
      </div>
    </motion.section>
  );
}
