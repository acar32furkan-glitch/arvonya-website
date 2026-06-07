import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import car1 from "@/assets/car-1.jpg";
import car2 from "@/assets/car-2.jpg";

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
  id: string; code: string; title: string; priceTL: number;
  images: string[]; description: string; createdAt: number;
}
export interface Property extends BaseListing {
  kind: "property"; listingType: ListingType; subType: PropertySubType;
  location: string; type: string;
  rooms?: string; m2?: number; baths?: number; floor?: string;
  area?: number; tapu?: string; imar?: string;
  // Sahibinden-style extended spec matrix (konut)
  binaYasi?: string;        // Bina Yaşı
  katSayisi?: string;       // Kat Sayısı
  isitma?: string;          // Isıtma Tipi
  balkon?: string;          // Balkon Durumu
  kullanim?: string;        // Kullanım Durumu
}
export interface Vehicle extends BaseListing {
  kind: "vehicle"; listingType: ListingType;
  year: number; km: number; gear: string; fuel: string; damage: string;
  // Sahibinden-style extended spec matrix (otomotiv)
  renk?: string;            // Renk
  motorGucu?: string;       // Motor Gücü (HP)
  ekspertiz?: string;       // Boya / Değişen Özeti
}
export type Listing = Property | Vehicle;

export interface Sector {
  id: View; label: string; description: string; active: boolean;
}

const seedProperties: Property[] = [
  {
    id: "p1", code: "ARV-1024", kind: "property", listingType: "sale", subType: "konut",
    title: "Aliköy'de Satılık Müstakil Ev ve Arsa Fırsatı",
    priceTL: 4280000, images: [property1, property2, property1, property2],
    rooms: "2+1", m2: 130, baths: 1, floor: "Müstakil",
    location: "Isparta / Merkez / Aliköy", type: "Konut",
    binaYasi: "5-10 Yaş", katSayisi: "1", isitma: "Soba", balkon: "Var", kullanim: "Boş",
    description: "Geniş bahçeli, yatırımlık fiyat avantajı sunan müstakil ev ve arsa fırsatı.",
    createdAt: Date.now() - 100000,
  },
  {
    id: "p2", code: "ARV-1025", kind: "property", listingType: "rent", subType: "konut",
    title: "Erbey Nova Sitesi'nde Kiralık Lüks 3+1 Daire",
    priceTL: 25500, images: [property2, property1, property2, property1],
    rooms: "3+1", m2: 135, baths: 2, floor: "3. Kat",
    location: "Isparta / Merkez / Fatih Mahallesi", type: "Konut",
    binaYasi: "0-2 Yaş", katSayisi: "8", isitma: "Doğalgaz Kombi", balkon: "Var", kullanim: "Boş",
    description: "Erbey Nova Sitesi'nde lüks donanımlı, geniş ferah kiralık daire.",
    createdAt: Date.now() - 90000,
  },
  {
    id: "p3", code: "ARV-1026", kind: "property", listingType: "sale", subType: "konut",
    title: "Fatih Mahallesi'nde Sıfır Lüks Rezidans Dairesi",
    priceTL: 5170000, images: [property1, property2, property1, property2],
    rooms: "3+1", m2: 135, baths: 2, floor: "2. Kat",
    location: "Isparta / Merkez / Fatih Mahallesi", type: "Konut",
    binaYasi: "Sıfır", katSayisi: "10", isitma: "Yerden Isıtma", balkon: "Var (2)", kullanim: "Sıfır",
    description: "Sıfır, kullanılmamış, lüks malzemelerle donatılmış prestijli daire.",
    createdAt: Date.now() - 80000,
  },
  {
    id: "p4", code: "ARV-1027", kind: "property", listingType: "sale", subType: "arsa",
    title: "Büyükgökçeli'de Yatırımlık Satılık Bahçe",
    priceTL: 109000, images: [property2, property1, property2, property1],
    area: 1200, tapu: "Müstakil", imar: "Bağ-Bahçe",
    location: "Isparta / Merkez / BüyükGökçeli", type: "Arsa / Bahçe",
    description: "Doğa içinde, ulaşımı kolay, uygun fiyatlı bağ-bahçe fırsatı.",
    createdAt: Date.now() - 70000,
  },
  {
    id: "p5", code: "ARV-1028", kind: "property", listingType: "sale", subType: "arsa",
    title: "Gönen Merkez'de Yatırımlık Satılık Arsa",
    priceTL: 4000000, images: [property1, property2, property1, property2],
    area: 2500, tapu: "Müstakil", imar: "Konut İmarlı",
    location: "Isparta / Gönen", type: "Arsa",
    description: "Konut imarlı, yatırımcısına yüksek getirisi olan stratejik konum.",
    createdAt: Date.now() - 60000,
  },
];

const seedVehicles: Vehicle[] = [
  { id: "v1", code: "ARV-2048", kind: "vehicle", listingType: "sale", title: "Mercedes-Benz S-Class", priceTL: 6500000, images: [car1, car2, car1, car2], year: 2023, km: 12000, gear: "Otomatik", fuel: "Benzin", damage: "Hasarsız", renk: "Obsidyen Siyah", motorGucu: "367 HP", ekspertiz: "Boyasız, değişensiz", description: "Tek elden, garaj saklamalı, tüm bakımları yetkili serviste yapılmış.", createdAt: Date.now() - 50000 },
  { id: "v2", code: "ARV-2049", kind: "vehicle", listingType: "sale", title: "Range Rover Sport", priceTL: 8200000, images: [car2, car1, car2, car1], year: 2024, km: 5500, gear: "Otomatik", fuel: "Dizel", damage: "Hasarsız", renk: "Santorini Beyaz", motorGucu: "350 HP", ekspertiz: "Boyasız, değişensiz", description: "Showroom durumunda, full opsiyonel.", createdAt: Date.now() - 40000 },
];

const defaultSectors: Sector[] = [
  { id: "kurumsal",    label: "Kurumsal",    description: "Şirket profili, vizyon ve misyon",       active: true },
  { id: "gayrimenkul", label: "Gayrimenkul", description: "Emlak ilanları",                          active: true },
  { id: "otomotiv",    label: "Otomotiv",    description: "Araç ilanları",                            active: true },
  { id: "disticaret",  label: "Dış Ticaret", description: "Uluslararası ticaret hizmetleri",         active: true },
  { id: "tercume",     label: "Tercüme",     description: "Profesyonel çeviri",                       active: true },
];

const TL_PER: Record<Currency, number> = { TL: 1, USD: 46.0601, EUR: 49.5 };
const SYMBOLS: Record<Currency, string> = { TL: "₺", USD: "$", EUR: "€" };

export function formatPrice(tl: number, currency: Currency) {
  const v = tl / TL_PER[currency];
  return `${SYMBOLS[currency]}${Math.round(v).toLocaleString("tr-TR")}`;
}

export function tr(text: string, lang: Lang) {
  return lang === "EN" ? `${text}-(EN)` : text;
}

export interface Appointment { id: string; name: string; phone: string; datetime: string; listingTitle: string; status: "pending" | "answered"; }
export interface TranslationRequest { id: string; from: string; to: string; fileName: string; name: string; email: string; phone: string; }
export interface LeadRequest { id: string; name: string; phone: string; propertyType?: string; region?: string; createdAt: number; }

interface Ctx {
  view: View; setView: (v: View) => void;
  currency: Currency; setCurrency: (c: Currency) => void;
  lang: Lang; setLang: (l: Lang) => void;
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
  sort: SortKey; setSort: (s: SortKey) => void;
  listingTypeFilter: ListingType; setListingTypeFilter: (t: ListingType) => void;
  searchQuery: string; setSearchQuery: (q: string) => void;
  locationFilter: string; setLocationFilter: (l: string) => void;
  priceMin: string; setPriceMin: (v: string) => void;
  priceMax: string; setPriceMax: (v: string) => void;
  roomsFilter: string; setRoomsFilter: (v: string) => void;
  vehicleTypeFilter: string; setVehicleTypeFilter: (v: string) => void;
  sectors: Sector[];
  updateSector: (s: Sector) => void;
}

const StoreCtx = createContext<Ctx | null>(null);

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>("gayrimenkul");
  const [currency, setCurrency] = useState<Currency>("TL");
  const [lang, setLang] = useState<Lang>("TR");
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
    const pUser = loadLS<Property[]>("arvonya_properties", []);
    const vUser = loadLS<Vehicle[]>("arvonya_vehicles", []);
    const pOverride = loadLS<Record<string, Partial<Property>>>("arvonya_properties_override", {});
    const vOverride = loadLS<Record<string, Partial<Vehicle>>>("arvonya_vehicles_override", {});
    const pDeleted = loadLS<string[]>("arvonya_properties_deleted", []);
    const vDeleted = loadLS<string[]>("arvonya_vehicles_deleted", []);
    const mergedP = [...pUser, ...seedProperties].filter(p => !pDeleted.includes(p.id)).map(p => ({ ...p, ...(pOverride[p.id] || {}) }));
    const mergedV = [...vUser, ...seedVehicles].filter(v => !vDeleted.includes(v.id)).map(v => ({ ...v, ...(vOverride[v.id] || {}) }));
    setProperties(mergedP);
    setVehicles(mergedV);
    setAppointments(loadLS("arvonya_appointments", []));
    setTranslationRequests(loadLS("arvonya_translations", []));
    setLeads(loadLS("arvonya_leads", []));
    setFavorites(loadLS("arvonya_favorites", []));
    setSectors(loadLS("arvonya_sectors", defaultSectors));
  }, []);

  const seedIds = (kind: "property" | "vehicle") => (kind === "property" ? seedProperties : seedVehicles).map(s => s.id);
  const persistUserList = (kind: "property" | "vehicle", next: Listing[]) => {
    const ids = seedIds(kind);
    const user = next.filter(x => !ids.includes(x.id));
    localStorage.setItem(kind === "property" ? "arvonya_properties" : "arvonya_vehicles", JSON.stringify(user));
  };

  const addListing = (l: Listing) => {
    if (l.kind === "property") { const next = [l, ...properties]; setProperties(next); persistUserList("property", next); }
    else { const next = [l, ...vehicles]; setVehicles(next); persistUserList("vehicle", next); }
  };

  const updateListing = (l: Listing) => {
    if (l.kind === "property") {
      const next = properties.map(p => p.id === l.id ? l as Property : p);
      setProperties(next);
      if (seedIds("property").includes(l.id)) {
        const ov = loadLS<Record<string, Partial<Property>>>("arvonya_properties_override", {});
        ov[l.id] = l as Property;
        localStorage.setItem("arvonya_properties_override", JSON.stringify(ov));
      } else persistUserList("property", next);
    } else {
      const next = vehicles.map(v => v.id === l.id ? l as Vehicle : v);
      setVehicles(next);
      if (seedIds("vehicle").includes(l.id)) {
        const ov = loadLS<Record<string, Partial<Vehicle>>>("arvonya_vehicles_override", {});
        ov[l.id] = l as Vehicle;
        localStorage.setItem("arvonya_vehicles_override", JSON.stringify(ov));
      } else persistUserList("vehicle", next);
    }
  };

  const deleteListing = (kind: "property" | "vehicle", id: string) => {
    if (kind === "property") {
      const next = properties.filter(p => p.id !== id);
      setProperties(next);
      if (seedIds("property").includes(id)) {
        const del = loadLS<string[]>("arvonya_properties_deleted", []);
        if (!del.includes(id)) { del.push(id); localStorage.setItem("arvonya_properties_deleted", JSON.stringify(del)); }
      } else persistUserList("property", next);
    } else {
      const next = vehicles.filter(v => v.id !== id);
      setVehicles(next);
      if (seedIds("vehicle").includes(id)) {
        const del = loadLS<string[]>("arvonya_vehicles_deleted", []);
        if (!del.includes(id)) { del.push(id); localStorage.setItem("arvonya_vehicles_deleted", JSON.stringify(del)); }
      } else persistUserList("vehicle", next);
    }
  };

  const addAppointment = (a: Appointment) => { const next = [a, ...appointments]; setAppointments(next); localStorage.setItem("arvonya_appointments", JSON.stringify(next)); };
  const markAppointmentAnswered = (id: string) => {
    const next = appointments.map(a => a.id === id ? { ...a, status: "answered" as const } : a);
    setAppointments(next); localStorage.setItem("arvonya_appointments", JSON.stringify(next));
  };
  const addTranslationRequest = (t: TranslationRequest) => { const next = [t, ...translationRequests]; setTranslationRequests(next); localStorage.setItem("arvonya_translations", JSON.stringify(next)); };
  const addLead = (l: LeadRequest) => { const next = [l, ...leads]; setLeads(next); localStorage.setItem("arvonya_leads", JSON.stringify(next)); };
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [id, ...favorites];
    setFavorites(next); localStorage.setItem("arvonya_favorites", JSON.stringify(next));
  };
  const updateSector = (s: Sector) => {
    const next = sectors.map(x => x.id === s.id ? s : x);
    setSectors(next);
    localStorage.setItem("arvonya_sectors", JSON.stringify(next));
  };

  return (
    <StoreCtx.Provider value={{ view, setView, currency, setCurrency, lang, setLang, properties, vehicles, addListing, updateListing, deleteListing, appointments, addAppointment, markAppointmentAnswered, translationRequests, addTranslationRequest, leads, addLead, favorites, toggleFavorite, sort, setSort, listingTypeFilter, setListingTypeFilter, searchQuery, setSearchQuery, locationFilter, setLocationFilter, priceMin, setPriceMin, priceMax, setPriceMax, roomsFilter, setRoomsFilter, vehicleTypeFilter, setVehicleTypeFilter, sectors, updateSector }}>
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
