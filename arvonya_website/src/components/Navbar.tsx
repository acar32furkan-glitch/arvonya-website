import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { useStore, type View, type Currency, type Lang } from "@/lib/store";
import { Logo } from "./Logo";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { FavoritesDrawer } from "./FavoritesDrawer";

const ACCENTS: Record<View, "green" | "orange" | "neutral"> = {
  kurumsal: "neutral",
  gayrimenkul: "green",
  otomotiv: "orange",
  disticaret: "neutral",
  tercume: "neutral",
};

export function Navbar() {
  const { view, setView, currency, setCurrency, lang, setLang, favorites, sectors } = useStore();
  const [open, setOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", v => setScrolled(v > 60));

  const visibleNav = sectors.filter(s => s.active);
  const onHero = view === "gayrimenkul" || view === "kurumsal";
  const transparent = onHero && !scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          transparent
            ? "bg-transparent border-transparent"
            : "backdrop-blur-xl bg-white/90 border-b border-border/60 shadow-sm"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" onClick={() => setView("gayrimenkul")}>
            <Logo size="text-xl" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {visibleNav.map((n) => {
              const active = view === n.id;
              const accent = ACCENTS[n.id];
              const accentColor = accent === "green" ? "#2EAA4A" : accent === "orange" ? "#E8521A" : "#1A1A1A";
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${transparent ? "text-[#1A1A1A]/70 hover:bg-black/6" : "hover:bg-secondary"}`}
                  style={{ color: active && !transparent ? accentColor : transparent ? undefined : undefined }}
                >
                  {n.label}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ backgroundColor: accent === "green" ? "rgba(46,170,74,0.12)" : accent === "orange" ? "rgba(232,82,26,0.12)" : "rgba(26,26,26,0.06)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFavOpen(true)}
              className="relative p-2 rounded-full hover:bg-secondary transition"
              aria-label="Favoriler"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center">{favorites.length}</span>
              )}
            </button>

            <div className="relative hidden lg:block">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-white/60 hover:bg-secondary transition"
              >
                {lang} · {currency}
                <ChevronDown className="h-3 w-3" />
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-white/95 backdrop-blur-xl shadow-xl p-3 space-y-3 z-50">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Language</div>
                    <div className="flex gap-1">
                      {(["TR", "EN"] as Lang[]).map(l => (
                        <button key={l} onClick={() => setLang(l)} className={`flex-1 px-2 py-1 text-xs rounded-md ${lang === l ? "bg-foreground text-background" : "hover:bg-secondary"}`}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Currency</div>
                    <div className="flex gap-1">
                      {(["TL", "USD", "EUR"] as Currency[]).map(c => (
                        <button key={c} onClick={() => setCurrency(c)} className={`flex-1 px-2 py-1 text-xs rounded-md ${currency === c ? "bg-foreground text-background" : "hover:bg-secondary"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden p-2 rounded-full hover:bg-secondary transition"
              aria-label="Menü"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden border-t border-border/40 bg-white/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 space-y-1">
                {visibleNav.map((n) => {
                  const active = view === n.id;
                  const accent = ACCENTS[n.id];
                  const accentColor = accent === "green" ? "#2EAA4A" : accent === "orange" ? "#E8521A" : "#1A1A1A";
                  return (
                    <button
                      key={n.id}
                      onClick={() => { setView(n.id); setMobileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-colors hover:bg-secondary"
                      style={{ color: active ? accentColor : undefined, backgroundColor: active ? (accent === "green" ? "rgba(46,170,74,0.08)" : accent === "orange" ? "rgba(232,82,26,0.08)" : "rgba(26,26,26,0.04)") : undefined }}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />}
                      {!active && <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-transparent" />}
                      {n.label}
                    </button>
                  );
                })}
                {/* Lang + Currency in mobile */}
                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <div className="flex gap-1">
                    {(["TR", "EN"] as Lang[]).map(l => (
                      <button key={l} onClick={() => setLang(l)} className={`px-3 py-1.5 text-xs rounded-full font-medium ${lang === l ? "bg-foreground text-background" : "bg-secondary"}`}>{l}</button>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {(["TL", "USD", "EUR"] as Currency[]).map(c => (
                      <button key={c} onClick={() => setCurrency(c)} className={`px-3 py-1.5 text-xs rounded-full font-medium ${currency === c ? "bg-foreground text-background" : "bg-secondary"}`}>{c}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <FavoritesDrawer open={favOpen} onClose={() => setFavOpen(false)} />
    </>
  );
}
