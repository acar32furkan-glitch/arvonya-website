import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import {
  useStore,
  formatPrice,
  tr,
  type Listing,
  type Property,
  type Vehicle,
  type ListingType,
  type PropertySubType,
} from "@/lib/store";
import { seedProperties, seedVehicles } from "@/lib/seed-data";
import { supabase } from "@/utils/supabase";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import { Logo } from "@/components/Logo";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { ArrowLeft, MessageCircle, CalendarClock, X, Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SITE_URL = "https://arvonya-site.vercel.app";

type PropertyRow = {
  id: string;
  code: string;
  kind: string;
  listing_type: string;
  sub_type: string;
  title: string;
  price_tl: number;
  location_city?: string | null;
  location_district?: string | null;
  location_neighborhood?: string | null;
  rooms?: string | null;
  area_m2?: number | null;
  floor?: string | null;
  total_floors?: string | null;
  building_age?: string | null;
  heating?: string | null;
  balcony?: string | null;
  status?: string | null;
  description?: string | null;
  images: string[];
  created_at?: string;
};

type VehicleRow = {
  id: string;
  code: string;
  kind: string;
  title: string;
  price_tl: number;
  description?: string | null;
  images: string[];
  year: number;
  km: number;
  transmission?: string | null;
  fuel?: string | null;
  condition?: string | null;
  created_at?: string;
};

function formatLocation(
  city?: string | null,
  district?: string | null,
  neighborhood?: string | null,
) {
  return [city, district, neighborhood].filter(Boolean).join(" / ");
}

function propertyFromRow(row: PropertyRow): Property {
  const subType = row.sub_type as PropertySubType;
  const property: Property = {
    id: row.id,
    code: row.code,
    kind: "property",
    listingType: row.listing_type as ListingType,
    subType,
    title: row.title,
    priceTL: Number(row.price_tl),
    images: row.images ?? [],
    description: row.description ?? "",
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    location: formatLocation(row.location_city, row.location_district, row.location_neighborhood),
    type: row.status ?? "Konut",
    rooms: row.rooms ?? undefined,
    floor: row.floor ?? undefined,
    binaYasi: row.building_age ?? undefined,
    katSayisi: row.total_floors ?? undefined,
    isitma: row.heating ?? undefined,
    balkon: row.balcony ?? undefined,
    kullanim: row.status ?? undefined,
  };
  if (subType === "arsa") property.area = row.area_m2 != null ? Number(row.area_m2) : undefined;
  else property.m2 = row.area_m2 != null ? Number(row.area_m2) : undefined;
  return property;
}

function vehicleFromRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    code: row.code,
    kind: "vehicle",
    listingType: "sale",
    title: row.title,
    priceTL: Number(row.price_tl),
    images: row.images ?? [],
    description: row.description ?? "",
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    year: row.year,
    km: row.km,
    gear: row.transmission ?? "",
    fuel: row.fuel ?? "",
    damage: row.condition ?? "",
  };
}

function absoluteImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return url;
}

function buildOgDescription(listing: Listing): string {
  const price = formatPrice(listing.priceTL, "TL");
  if (listing.kind === "property") {
    const listingType = listing.listingType === "rent" ? "Kiralık" : "Satılık";
    const alan = listing.subType === "arsa" ? listing.area : listing.m2;
    return `${listingType} · ${alan ?? "-"} m² · ${price} | ${listing.location}`;
  }
  return `Satılık · ${listing.year} Model · ${listing.km.toLocaleString("tr-TR")} km · ${price}`;
}

async function loadListing(id: string): Promise<Listing | undefined> {
  const fromSeed = seedProperties.find((p) => p.id === id) || seedVehicles.find((v) => v.id === id);
  if (fromSeed) return fromSeed;

  const { data: propertyData, error: propertyError } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (propertyError) console.error("loadListing properties:", propertyError);
  if (propertyData) return propertyFromRow(propertyData as PropertyRow);

  const { data: vehicleData, error: vehicleError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .maybeSingle();

  if (vehicleError) console.error("loadListing vehicles:", vehicleError);
  if (vehicleData) return vehicleFromRow(vehicleData as VehicleRow);

  return undefined;
}

export const Route = createFileRoute("/listing/$id")({
  loader: async ({ params }) => {
    const item = await loadListing(params.id);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    const listing = loaderData.item;
    if (!listing) return { meta: [{ title: "İlan Bulunamadı — Arvonya Grup" }] };

    const pageTitle = `${listing.title} — Arvonya Grup`;
    const ogDescription = buildOgDescription(listing);
    const firstImage = absoluteImageUrl(listing.images?.[0] ?? `${SITE_URL}/assets/logo-480.webp`);
    const pageUrl = `${SITE_URL}/listing/${listing.id}`;

    return {
      meta: [
        { title: pageTitle },
        { name: "description", content: listing.description },
        { name: "author", content: "Arvonya Grup" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: ogDescription },
        { property: "og:image", content: firstImage },
        { property: "og:url", content: pageUrl },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:image", content: firstImage },
      ],
    };
  },
  component: () => <Detail />,
});

function Detail() {
  const { id } = useParams({ from: "/listing/$id" });
  const { item: loaderItem } = Route.useLoaderData();
  const { properties, vehicles, currency, lang, addAppointment, favorites, toggleFavorite } =
    useStore();
  const item: Listing | undefined =
    properties.find((p) => p.id === id) ||
    vehicles.find((v) => v.id === id) ||
    (loaderItem?.id === id ? loaderItem : undefined);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", datetime: "" });

  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link to="/" className="underline">
          İlan bulunamadı — geri dön
        </Link>
      </div>
    );

  const submitAppt = () => {
    addAppointment({ id: `a${Date.now()}`, ...form, listingTitle: item.title, status: "pending" });
    setModal(false);
    setForm({ name: "", phone: "", datetime: "" });
    alert("Randevu talebiniz alındı. En kısa sürede dönüş yapacağız.");
  };

  const specs =
    item.kind === "property"
      ? item.subType === "arsa"
        ? [
            ["Tip", item.type],
            ["Konum", item.location],
            ["Toplam Alan", `${item.area} m²`],
            ["Tapu Türü", item.tapu ?? "-"],
            ["İmar Durumu", item.imar ?? "-"],
          ]
        : [
            ["Tip", item.type],
            ["Konum", item.location],
            ["İlan Tipi", item.listingType === "rent" ? "Kiralık" : "Satılık"],
            ["Oda Sayısı", item.rooms ?? "-"],
            ["Brüt / Net m²", `${item.m2} m²`],
            ["Banyo Sayısı", String(item.baths ?? "-")],
            ["Bulunduğu Kat", item.floor ?? "-"],
            ["Kat Sayısı", item.katSayisi ?? "-"],
            ["Bina Yaşı", item.binaYasi ?? "-"],
            ["Isıtma Tipi", item.isitma ?? "-"],
            ["Balkon Durumu", item.balkon ?? "-"],
            ["Kullanım Durumu", item.kullanim ?? "-"],
          ]
      : [
          ["Model Yılı", String(item.year)],
          ["Kilometre", `${item.km.toLocaleString("tr-TR")} km`],
          ["Vites Tipi", item.gear],
          ["Yakıt Tipi", item.fuel],
          ["Renk", item.renk ?? "-"],
          ["Motor Gücü", item.motorGucu ?? "-"],
          ["Boya / Değişen", item.ekspertiz ?? item.damage],
          ["Hasar Durumu", item.damage],
        ];

  const images = item.images && item.images.length > 0 ? item.images : [];
  const fav = favorites.includes(item.id);

  return (
    <div className="min-h-screen relative">
      <AmbientBackdrop />
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-xl bg-white/70 border-b border-border/50">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="text-xl" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-medium hover:text-foreground/70"
          >
            <ArrowLeft className="h-4 w-4" /> Geri
          </Link>
        </div>
      </header>

      <div className="pt-16 grid lg:grid-cols-2 min-h-screen">
        <div className="p-6 lg:p-10 space-y-4 overflow-y-auto">
          {images.length > 0 ? (
            images.map((src, i) => (
              <div key={i} className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
                <ResponsivePicture
                  src={src}
                  alt={`${item.title} görsel ${i + 1}`}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  width={1600}
                  height={1067}
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-[11px] font-semibold tracking-wider">
                  {item.code}
                </div>
              </div>
            ))
          ) : (
            <div className="aspect-[3/2] rounded-2xl bg-gradient-to-br from-brand-green-soft/40 via-white to-brand-orange-soft/40 flex items-center justify-center">
              <p className="text-muted-foreground">Arvonya Group — Görsel Hazırlanıyor</p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] p-6 lg:p-10 lg:overflow-y-auto bg-white/60 backdrop-blur-xl border-l border-border/50">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{item.code}</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                {tr(item.title, lang)}
              </h1>
            </div>
            <button
              onClick={() => toggleFavorite(item.id)}
              aria-label={
                fav ? `${item.title} favorilerden çıkar` : `${item.title} favorilere ekle`
              }
              className="p-3 rounded-full border border-border hover:bg-secondary transition"
            >
              <Heart className={`h-5 w-5 ${fav ? "fill-brand-orange text-brand-orange" : ""}`} />
            </button>
          </div>
          <div className="mt-3 text-4xl font-bold text-brand-green">
            {formatPrice(item.priceTL, currency)}
          </div>

          <div className="mt-8 divide-y divide-border border-y border-border">
            {specs.map(([k, v]) => (
              <div key={k} className="flex justify-between py-3 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-foreground/80 leading-relaxed">{tr(item.description, lang)}</p>

          <div className="mt-8 space-y-3">
            <a
              href={`https://wa.me/905382402246?text=${encodeURIComponent("Merhaba, " + item.title + " (" + item.code + ") ilanı için bilgi almak istiyorum.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full bg-brand-orange text-white font-medium hover:opacity-90 transition"
            >
              <MessageCircle className="h-5 w-5" /> WhatsApp ile İletişime Geç
            </a>
            <button
              onClick={() => setModal(true)}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-full border border-border bg-white font-medium hover:bg-secondary transition"
            >
              <CalendarClock className="h-5 w-5" /> Hızlı Randevu Talebi
            </button>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Randevu Talebi</h3>
                <button
                  onClick={() => setModal(false)}
                  aria-label="Randevu formunu kapat"
                  className="p-1.5 rounded-full hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-border"
                  placeholder="Ad Soyad"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="w-full px-4 py-3 rounded-xl border border-border"
                  placeholder="Telefon"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <input
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-xl border border-border"
                  value={form.datetime}
                  onChange={(e) => setForm({ ...form, datetime: e.target.value })}
                />
                <button
                  onClick={submitAppt}
                  className="w-full py-3 rounded-full bg-foreground text-background font-medium"
                >
                  Talebi Gönder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
