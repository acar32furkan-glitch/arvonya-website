import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { formatPrice, useStore, tr, type Listing } from "@/lib/store";
import { Bed, Bath, Maximize, Calendar, Gauge, Settings2, Fuel, ShieldCheck, Heart, Layers, MapPin, ScrollText, Trees } from "lucide-react";
import { useState } from "react";

export function ListingCard({ item }: { item: Listing }) {
  const { currency, lang, favorites, toggleFavorite } = useStore();
  const hasImages = item.images && item.images.length > 0;
  const isArsa = item.kind === "property" && item.subType === "arsa";
  const thumbs = hasImages ? [...item.images, ...item.images, ...item.images, ...item.images].slice(0, 4) : [];
  const [active, setActive] = useState(0);
  const fav = favorites.includes(item.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-3xl bg-card overflow-hidden shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col lg:flex-row">
        <div className={`relative aspect-[16/10] ${isArsa ? "lg:w-full lg:aspect-[16/7]" : "lg:w-4/5 lg:aspect-[16/8]"} overflow-hidden bg-muted`}>
          {hasImages ? (
            <img src={thumbs[active]} alt={item.title} className="h-full w-full object-cover transition-all duration-500" />
          ) : (
            <FallbackImage />
          )}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[11px] font-semibold tracking-wider shadow-lg">
            {item.code}
          </div>
          {item.kind === "property" && (
            <div className="absolute top-4 left-24 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-white" style={{ backgroundColor: item.listingType === "rent" ? "#E8521A" : "#2EAA4A" }}>
              {item.listingType === "rent" ? "Kiralık" : "Satılık"}
            </div>
          )}
          <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(item.id); }}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 hover:scale-110 transition"
            aria-label="Favorilere ekle"
          >
            <Heart className="h-4 w-4" style={{ color: fav ? "#E8521A" : "#fff", fill: fav ? "#E8521A" : "transparent" }} />
          </button>
          <Link to="/listing/$id" params={{ id: item.id }} className="absolute inset-0" aria-label={item.title} />
        </div>

        {!isArsa && (
          <div className="lg:w-1/5 grid grid-cols-4 lg:grid-cols-1 grid-rows-1 lg:grid-rows-4 gap-3 p-3 overflow-x-auto lg:overflow-visible">
            {thumbs.map((src, i) => {
              const aura = item.kind === "property" && item.listingType === "rent" ? "rgba(232,82,26,0.25)" : "rgba(46,170,74,0.25)";
              return (
                <button
                  key={i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="relative aspect-square lg:aspect-auto overflow-hidden rounded-xl transition-all duration-300"
                  style={active === i ? { boxShadow: `0 0 22px ${aura}` } : undefined}
                >
                  {hasImages ? (
                    <img src={src} alt="" className={`h-full w-full object-cover transition-transform duration-300 ${active === i ? "scale-105" : "scale-100 hover:scale-105"}`} />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-brand-green-soft to-brand-orange-soft" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Link to="/listing/$id" params={{ id: item.id }} className="block">
        <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{tr(item.title, lang)}</h3>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {item.kind === "property" ? (
                isArsa ? (
                  <>
                    <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4" />{item.area} m²</span>
                    <span className="flex items-center gap-1.5"><ScrollText className="h-4 w-4" />{item.tapu}</span>
                    <span className="flex items-center gap-1.5"><Trees className="h-4 w-4" />{item.imar}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{item.location}</span>
                  </>
                ) : (
                  <>
                    <span className="flex items-center gap-1.5"><Bed className="h-4 w-4" />{item.rooms}</span>
                    <span className="flex items-center gap-1.5"><Maximize className="h-4 w-4" />{item.m2} m²</span>
                    {item.floor && <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" />{item.floor}</span>}
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{item.location}</span>
                  </>
                )
              ) : (
                <>
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{item.year}</span>
                  <span className="flex items-center gap-1.5"><Gauge className="h-4 w-4" />{(item.km / 1000).toFixed(0)}k km</span>
                  <span className="flex items-center gap-1.5"><Settings2 className="h-4 w-4" />{item.gear}</span>
                  <span className="flex items-center gap-1.5"><Fuel className="h-4 w-4" />{item.fuel}</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" />{item.damage}</span>
                </>
              )}
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap text-[#E8521A]">
            {formatPrice(item.priceTL, currency)}
            {item.kind === "property" && item.listingType === "rent" && <span className="text-sm font-normal text-muted-foreground"> / ay</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FallbackImage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-green-soft/40 via-white to-brand-orange-soft/40">
      <div className="text-center">
        <div className="text-2xl font-black tracking-tight">
          <span className="text-brand-orange">ARVONYA</span> <span className="text-brand-green">GROUP</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">Görsel Hazırlanıyor</p>
      </div>
    </div>
  );
}
