import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { seedProperties, seedVehicles, defaultSectors } from "./seed-data";
import { tr as translate } from "./i18n";
import { supabase } from "@/utils/supabase";

export type View = "kurumsal" | "gayrimenkul" | "otomotiv" | "disticaret" | "tercume";
export type Currency = "TL" | "USD" | "EUR";
export type Lang = "TR" | "EN";
export type SortKey = "newest" | "price-asc" | "price-desc";
export type ListingType = "sale" | "rent";
export type PropertySubType = "konut" | "arsa";

export const COMPANY = {
  phone: "0538 240 22 46",
  phoneIntl: "905382402246",
  address: "İstiklal Mahallesi 114 İstasyon Caddesi No:49/1 Isparta merkez, 32300 Merkez/Isparta",
};

export interface BaseListing {
  id: string;
  code: string;
  title: string;
  priceTL: number;
  images: string[];
  description: string;
  createdAt: number;
}
export interface Property extends BaseListing {
  kind: "property";
  listingType: ListingType;
  subType: PropertySubType;
  location: string;
  type: string;
  rooms?: string;
  m2?: number;
  baths?: number;
  floor?: string;
  area?: number;
  tapu?: string;
  imar?: string;
  // Sahibinden-style extended spec matrix (konut)
  binaYasi?: string; // Bina Yaşı
  katSayisi?: string; // Kat Sayısı
  isitma?: string; // Isıtma Tipi
  balkon?: string; // Balkon Durumu
  kullanim?: string; // Kullanım Durumu
}
export interface Vehicle extends BaseListing {
  kind: "vehicle";
  listingType: ListingType;
  year: number;
  km: number;
  gear: string;
  fuel: string;
  damage: string;
  // Sahibinden-style extended spec matrix (otomotiv)
  renk?: string; // Renk
  motorGucu?: string; // Motor Gücü (HP)
  ekspertiz?: string; // Boya / Değişen Özeti
}
export type Listing = Property | Vehicle;

export interface Sector {
  id: View;
  label: string;
  description: string;
  active: boolean;
}

export { seedProperties, seedVehicles, defaultSectors };

const TL_PER: Record<Currency, number> = { TL: 1, USD: 46.0601, EUR: 49.5 };
const SYMBOLS: Record<Currency, string> = { TL: "₺", USD: "$", EUR: "€" };

export function formatPrice(tl: number, currency: Currency) {
  const v = tl / TL_PER[currency];
  return `${SYMBOLS[currency]}${Math.round(v).toLocaleString("tr-TR")}`;
}

export function tr(text: string, lang: Lang) {
  return translate(text, lang);
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  listingTitle: string;
  status: "pending" | "answered";
}
export interface TranslationRequest {
  id: string;
  from: string;
  to: string;
  fileName: string;
  name: string;
  email: string;
  phone: string;
}
export interface LeadRequest {
  id: string;
  name: string;
  phone: string;
  propertyType?: string;
  region?: string;
  createdAt: number;
}

interface Ctx {
  view: View;
  setView: (v: View) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  isLoading: boolean;
  properties: Property[];
  vehicles: Vehicle[];
  addListing: (l: Listing) => void;
  updateListing: (l: Listing) => void;
  deleteListing: (kind: "property" | "vehicle", id: string) => void;
  appointments: Appointment[];
  addAppointment: (a: Appointment) => void;
  markAppointmentAnswered: (id: string) => void;
  translationRequests: TranslationRequest[];
  addTranslationRequest: (t: TranslationRequest) => void;
  leads: LeadRequest[];
  addLead: (l: LeadRequest) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  sort: SortKey;
  setSort: (s: SortKey) => void;
  listingTypeFilter: ListingType;
  setListingTypeFilter: (t: ListingType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  locationFilter: string;
  setLocationFilter: (l: string) => void;
  priceMin: string;
  setPriceMin: (v: string) => void;
  priceMax: string;
  setPriceMax: (v: string) => void;
  roomsFilter: string;
  setRoomsFilter: (v: string) => void;
  vehicleTypeFilter: string;
  setVehicleTypeFilter: (v: string) => void;
  sectors: Sector[];
  updateSector: (s: Sector) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

type PropertyRow = {
  id: string;
  code: string;
  kind: string;
  listing_type: string;
  sub_type: string;
  title: string;
  price_tl: number;
  price_usd?: number | null;
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
  is_active?: boolean;
  created_at?: string;
};

type VehicleRow = {
  id: string;
  code: string;
  kind: string;
  title: string;
  price_tl: number;
  price_usd?: number | null;
  description?: string | null;
  images: string[];
  year: number;
  km: number;
  transmission?: string | null;
  fuel?: string | null;
  condition?: string | null;
  is_active?: boolean;
  created_at?: string;
};

type AppointmentRow = {
  id: string;
  name: string;
  phone: string;
  datetime: string;
  listing_title: string;
  status: string;
  created_at?: string;
};

function parseLocation(location: string) {
  const parts = location.split(" / ").map((s) => s.trim());
  return { city: parts[0], district: parts[1], neighborhood: parts[2] };
}

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

function propertyToRow(p: Property) {
  const { city, district, neighborhood } = parseLocation(p.location);
  return {
    id: p.id,
    code: p.code,
    kind: "property",
    listing_type: p.listingType,
    sub_type: p.subType,
    title: p.title,
    price_tl: p.priceTL,
    location_city: city ?? null,
    location_district: district ?? null,
    location_neighborhood: neighborhood ?? null,
    rooms: p.rooms ?? null,
    area_m2: p.subType === "arsa" ? (p.area ?? null) : (p.m2 ?? null),
    floor: p.floor ?? null,
    total_floors: p.katSayisi ?? null,
    building_age: p.binaYasi ?? null,
    heating: p.isitma ?? null,
    balcony: p.balkon ?? null,
    status: p.kullanim ?? p.type ?? null,
    description: p.description,
    images: p.images,
    is_active: true,
  };
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

function vehicleToRow(v: Vehicle) {
  return {
    id: v.id,
    code: v.code,
    kind: "vehicle",
    title: v.title,
    price_tl: v.priceTL,
    description: v.description,
    images: v.images,
    year: v.year,
    km: v.km,
    transmission: v.gear,
    fuel: v.fuel,
    condition: v.damage,
    is_active: true,
  };
}

function appointmentFromRow(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    datetime: row.datetime,
    listingTitle: row.listing_title,
    status: row.status === "answered" ? "answered" : "pending",
  };
}

function appointmentToRow(a: Appointment) {
  return {
    id: a.id,
    name: a.name,
    phone: a.phone,
    datetime: a.datetime,
    listing_title: a.listingTitle,
    status: a.status,
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("gayrimenkul");
  const [currency, setCurrency] = useState<Currency>("TL");
  const [lang, setLang] = useState<Lang>("TR");
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [vehicles, setVehicles] = useState<Vehicle[]>(seedVehicles);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [translationRequests, setTranslationRequests] = useState<TranslationRequest[]>([]);
  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("newest");
  const [listingTypeFilter, setListingTypeFilter] = useState<ListingType>("sale");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [roomsFilter, setRoomsFilter] = useState("");
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState("");
  const [sectors, setSectors] = useState<Sector[]>(defaultSectors);

  useEffect(() => {
    let cancelled = false;

    async function loadFromSupabase() {
      setIsLoading(true);
      try {
        const [propertiesRes, vehiclesRes, appointmentsRes] = await Promise.all([
          supabase
            .from("properties")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
          supabase
            .from("vehicles")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
          supabase.from("appointments").select("*").order("created_at", { ascending: false }),
        ]);

        if (cancelled) return;

        if (propertiesRes.error) console.error("load properties:", propertiesRes.error);
        if (vehiclesRes.error) console.error("load vehicles:", vehiclesRes.error);
        if (appointmentsRes.error) console.error("load appointments:", appointmentsRes.error);

        const loadedProperties = propertiesRes.data?.length
          ? (propertiesRes.data as PropertyRow[]).map(propertyFromRow)
          : seedProperties;
        const loadedVehicles = vehiclesRes.data?.length
          ? (vehiclesRes.data as VehicleRow[]).map(vehicleFromRow)
          : seedVehicles;

        setProperties(loadedProperties);
        setVehicles(loadedVehicles);

        if (appointmentsRes.data) {
          setAppointments((appointmentsRes.data as AppointmentRow[]).map(appointmentFromRow));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadFromSupabase();

    setTranslationRequests(loadLS("arvonya_translations", []));
    setLeads(loadLS("arvonya_leads", []));
    setFavorites(loadLS("arvonya_favorites", []));
    setSectors(loadLS("arvonya_sectors", defaultSectors));

    return () => {
      cancelled = true;
    };
  }, []);

  const addListing = (l: Listing) => {
    if (l.kind === "property") setProperties((prev) => [l, ...prev]);
    else setVehicles((prev) => [l, ...prev]);

    void (async () => {
      const { error } =
        l.kind === "property"
          ? await supabase.from("properties").insert(propertyToRow(l as Property))
          : await supabase.from("vehicles").insert(vehicleToRow(l as Vehicle));
      if (error) console.error("addListing:", error);
    })();
  };

  const updateListing = (l: Listing) => {
    if (l.kind === "property") {
      setProperties((prev) => prev.map((p) => (p.id === l.id ? (l as Property) : p)));
      void (async () => {
        const { error } = await supabase.from("properties").upsert(propertyToRow(l as Property));
        if (error) console.error("updateListing:", error);
      })();
    } else {
      setVehicles((prev) => prev.map((v) => (v.id === l.id ? (l as Vehicle) : v)));
      void (async () => {
        const { error } = await supabase.from("vehicles").upsert(vehicleToRow(l as Vehicle));
        if (error) console.error("updateListing:", error);
      })();
    }
  };

  const deleteListing = (kind: "property" | "vehicle", id: string) => {
    if (kind === "property") setProperties((prev) => prev.filter((p) => p.id !== id));
    else setVehicles((prev) => prev.filter((v) => v.id !== id));

    void (async () => {
      const table = kind === "property" ? "properties" : "vehicles";
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) console.error("deleteListing:", error);
    })();
  };

  const addAppointment = (a: Appointment) => {
    setAppointments((prev) => [a, ...prev]);
    void (async () => {
      const { error } = await supabase.from("appointments").insert(appointmentToRow(a));
      if (error) console.error("addAppointment:", error);
    })();
  };

  const markAppointmentAnswered = (id: string) => {
    const next = appointments.map((a) => (a.id === id ? { ...a, status: "answered" as const } : a));
    setAppointments(next);
    void (async () => {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "answered" })
        .eq("id", id);
      if (error) console.error("markAppointmentAnswered:", error);
    })();
  };

  const addTranslationRequest = (t: TranslationRequest) => {
    const next = [t, ...translationRequests];
    setTranslationRequests(next);
    localStorage.setItem("arvonya_translations", JSON.stringify(next));
  };
  const addLead = (l: LeadRequest) => {
    const next = [l, ...leads];
    setLeads(next);
    localStorage.setItem("arvonya_leads", JSON.stringify(next));
  };
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [id, ...favorites];
    setFavorites(next);
    localStorage.setItem("arvonya_favorites", JSON.stringify(next));
  };
  const updateSector = (s: Sector) => {
    const next = sectors.map((x) => (x.id === s.id ? s : x));
    setSectors(next);
    localStorage.setItem("arvonya_sectors", JSON.stringify(next));
  };

  return (
    <StoreCtx.Provider
      value={{
        view,
        setView,
        currency,
        setCurrency,
        lang,
        setLang,
        isLoading,
        properties,
        vehicles,
        addListing,
        updateListing,
        deleteListing,
        appointments,
        addAppointment,
        markAppointmentAnswered,
        translationRequests,
        addTranslationRequest,
        leads,
        addLead,
        favorites,
        toggleFavorite,
        sort,
        setSort,
        listingTypeFilter,
        setListingTypeFilter,
        searchQuery,
        setSearchQuery,
        locationFilter,
        setLocationFilter,
        priceMin,
        setPriceMin,
        priceMax,
        setPriceMax,
        roomsFilter,
        setRoomsFilter,
        vehicleTypeFilter,
        setVehicleTypeFilter,
        sectors,
        updateSector,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}

export function applySort<T extends Listing>(items: T[], sort: SortKey): T[] {
  const arr = [...items];
  if (sort === "price-asc") arr.sort((a, b) => a.priceTL - b.priceTL);
  else if (sort === "price-desc") arr.sort((a, b) => b.priceTL - a.priceTL);
  else arr.sort((a, b) => b.createdAt - a.createdAt);
  return arr;
}
