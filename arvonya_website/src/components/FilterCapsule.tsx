import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useStore, type SortKey } from "@/lib/store";

export function FilterCapsule() {
  const { view, sort, setSort, properties, locationFilter, setLocationFilter, priceMin, setPriceMin, priceMax, setPriceMax, roomsFilter, setRoomsFilter } = useStore();
  const [open, setOpen] = useState(false);
  if (view !== "otomotiv" && view !== "gayrimenkul") return null;
  const isProperty = view === "gayrimenkul";
  const locations = Array.from(new Set(properties.map(p => p.location))).sort();
  const activeFilters = [locationFilter, priceMin, priceMax, roomsFilter].filter(Boolean).length;

  const clearAll = () => { setLocationFilter(""); setPriceMin(""); setPriceMax(""); setRoomsFilter(""); };

  return (
    <>
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 p-1.5 rounded-full bg-white/70 backdrop-blur-2xl border border-white/60 shadow-2xl"
      >
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-80 transition"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtrele
          {activeFilters > 0 && (
            <span className="h-5 w-5 rounded-full bg-[#E8521A] text-white text-[10px] font-bold flex items-center justify-center">{activeFilters}</span>
          )}
        </button>

      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Filtreler</h2>
                <div className="flex gap-2">
                  {activeFilters > 0 && <button onClick={clearAll} className="text-xs text-[#E8521A] hover:underline">Temizle ({activeFilters})</button>}
                  <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-secondary"><X className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Sıralama</label>
                <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="filter-input">
                  <option value="newest">En yeni</option>
                  <option value="price-asc">Fiyat artan</option>
                  <option value="price-desc">Fiyat azalan</option>
                </select>
              </div>

              <div className="space-y-5">
                {isProperty ? (
                  <>
                    <Field label="Lokasyon">
                      <select className="filter-input" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
                        <option value="">Tümü</option>
                        {locations.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </Field>
                    <Field label="Fiyat Aralığı (TL)">
                      <div className="flex gap-2">
                        <input className="filter-input" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} type="number" />
                        <input className="filter-input" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} type="number" />
                      </div>
                    </Field>
                    <Field label="Oda Sayısı">
                      <div className="flex gap-2 flex-wrap">
                        {["1+1","2+1","3+1","4+1","5+"].map(r => (
                          <button key={r} onClick={() => setRoomsFilter(roomsFilter === r ? "" : r)} className={`px-3 py-1.5 text-xs rounded-full border transition ${roomsFilter === r ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}>{r}</button>
                        ))}
                      </div>
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Fiyat Aralığı (TL)">
                      <div className="flex gap-2">
                        <input className="filter-input" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} type="number" />
                        <input className="filter-input" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} type="number" />
                      </div>
                    </Field>
                    <Field label="Araç Tipi"><div className="flex gap-2 flex-wrap">{["Sedan","SUV","Hatchback","Coupe"].map(r => <button key={r} className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-secondary">{r}</button>)}</div></Field>
                  </>
                )}
                <button onClick={() => setOpen(false)} className="w-full py-3 rounded-full bg-foreground text-background font-medium">Uygula</button>
              </div>
              <style>{`.filter-input{width:100%;padding:0.6rem 0.9rem;border:1px solid var(--border);border-radius:0.75rem;font-size:0.875rem;background:white}`}</style>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}
