import { motion } from "framer-motion";
import { useStore, tr } from "@/lib/store";

const items = [
  {
    n: "01",
    title: "Çok Sektörlü Güç",
    desc: "Emlak, otomotiv, dış ticaret ve tercüme alanlarında entegre uzmanlık.",
    color: "var(--brand-green)",
  },
  {
    n: "02",
    title: "Kalıcı İstikrar",
    desc: "Kurumsal disiplin ve şeffaf süreçlerle uzun vadeli değer üretiyoruz.",
    color: "var(--brand-orange-dark)",
  },
  {
    n: "03",
    title: "Küresel Standartlar",
    desc: "Uluslararası iş kalitesini Türk iş dünyasına entegre ediyoruz.",
    color: "var(--foreground)",
  },
];

export function NedenArvonya() {
  const { lang } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <header className="mb-16 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-4">
          {tr("Neden Arvonya", lang)}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          {tr("Üç temel ilke.", lang)}
        </h2>
      </header>
      <div className="grid md:grid-cols-3 gap-10 md:gap-6">
        {items.map((it, i) => (
          <motion.div
            key={it.n}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <div
              className="text-7xl md:text-8xl font-black tracking-tighter"
              style={{ color: it.color, opacity: 0.18 }}
            >
              {it.n}
            </div>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight">{tr(it.title, lang)}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed max-w-xs">
              {tr(it.desc, lang)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
