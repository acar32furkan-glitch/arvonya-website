import { motion } from "framer-motion";
import { useStore, applySort, tr } from "@/lib/store";
import { ListingCard } from "@/components/ListingCard";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5 },
};

export function OtomotivView() {
  const { vehicles, sort, lang, priceMin, priceMax } = useStore();
  let filtered = [...vehicles];
  if (priceMin) filtered = filtered.filter((v) => v.priceTL >= Number(priceMin));
  if (priceMax) filtered = filtered.filter((v) => v.priceTL <= Number(priceMax));
  const sorted = applySort(filtered, sort);
  return (
    <motion.section {...fade}>
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <header className="mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">{tr("Otomotiv", lang)}</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05]">
            <span className="text-[var(--brand-orange-dark)]">{tr("Güvenilir", lang)}</span> {tr("Araçlar,", lang)}<br />{tr("Her Bütçeye Uygun.", lang)}
          </h1>
        </header>
        <div className="mb-8">
          <a href="https://wa.me/905382402246?text=Merhaba,%20otomotiv%20araçları%20hakkında%20bilgi%20almak%20istiyorum." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-brand-green hover:text-brand-green-light">
            <span>{tr("WhatsApp ile Bilgi Al", lang)}</span>
          </a>
        </div>
        <div className="space-y-8">
          {sorted.map((v) => <ListingCard key={v.id} item={v} />)}
        </div>
      </div>
      <LeadForm />
      <Footer />
    </motion.section>
  );
}
