import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { formatPrice, useStore, tr, type Listing } from "@/lib/store";
import { Bed, Bath, Maximize, Calendar, Gauge, Settings2, Fuel, ShieldCheck, Heart, Layers, MapPin, ScrollText, Trees } from "lucide-react";
import { useState } from "react";

export function ListingCard({ item, showWhatsAppShare = false }: { item: Listing; showWhatsAppShare?: boolean }) {
  const { currency, lang, favorites, toggleFavorite } = useStore();
  const hasImages = item.images && item.images.length > 0;
  const isArsa = item.kind === "property" && item.subType === "arsa";
  const thumbs = hasImages ? [...item.images, ...item.images, ...item.images, ...item.images].slice(0, 4) : [];
  const [active, setActive] = useState(0);
  const fav = favorites.includes(item.id);
  const whatsappText = `Merhaba, ${item.title} ilanı hakkında bilgi almak istiyorum. https://arvonya-website.netlify.app/listing/${item.id}`;
  const whatsappHref = `https://wa.me/905382402246?text=${encodeURIComponent(whatsappText)}`;

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
      {showWhatsAppShare && (
        <div className="border-t border-border/80 px-6 pb-5 pt-4 md:px-8">
          <div className="flex items-center gap-4 text-xs">
            <button
              type="button"
              onClick={() => toggleFavorite(item.id)}
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-[#E8521A]"
              aria-label="Favorilere ekle"
            >
              <Heart className="h-3.5 w-3.5" style={{ color: fav ? "#E8521A" : "currentColor", fill: fav ? "#E8521A" : "transparent" }} />
              <span>{fav ? "Favorilerde" : "Favorilere Ekle"}</span>
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-brand-green transition-opacity hover:opacity-80"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5 fill-current">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.1.55 4.15 1.6 5.96L0 24l6.33-1.66a11.78 11.78 0 0 0 5.75 1.47h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.15-3.45-8.35Zm-8.44 18.34h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.75.98 1-3.65-.23-.38a9.9 9.9 0 0 1-1.52-5.3c0-5.45 4.43-9.88 9.88-9.88 2.64 0 5.12 1.03 6.98 2.89a9.81 9.81 0 0 1 2.9 6.99c0 5.45-4.44 9.88-9.9 9.88Zm5.41-7.37c-.3-.15-1.75-.86-2.03-.96-.27-.1-.47-.15-.66.15-.2.3-.76.95-.93 1.14-.18.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.48-.89-.79-1.5-1.76-1.68-2.06-.18-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.72.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.42.25-.69.25-1.28.18-1.42-.08-.14-.28-.22-.58-.37Z" />
              </svg>
              <span>WhatsApp'ta Paylaş</span>
            </a>
          </div>
        </div>
      )}
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
