import { type Property, type Vehicle, type Sector } from "./store";

export const seedProperties: Property[] = [
  {
    id: "p1", code: "ARV-1024", kind: "property", listingType: "sale", subType: "konut",
    title: "Satılık Bahçeli Müstakil Ev",
    priceTL: 4280000, images: ["/assets/p1-cover.jpg", "/assets/p1-1.jpg", "/assets/p1-2.jpg", "/assets/p1-3.jpg"],
    rooms: "2+1", m2: 130, baths: 1, floor: "Müstakil",
    location: "Isparta / Merkez / Aliköy", type: "Konut",
    binaYasi: "5-10 Yaş", katSayisi: "1", isitma: "Soba", balkon: "Var", kullanim: "Boş",
    description: "Geniş bahçeli, doğa ile iç içe huzurlu bir yaşam sunan müstakil ev ve arsa fırsatı.",
    createdAt: 1717833600000,
  },
  {
    id: "p2", code: "ARV-1025", kind: "property", listingType: "rent", subType: "konut",
    title: "Kiralık Lüks Modern Daire",
    priceTL: 25500, images: ["/assets/p2-cover.jpg", "/assets/p2-1.jpg", "/assets/p2-2.jpg", "/assets/p2-3.jpg"],
    rooms: "3+1", m2: 135, baths: 2, floor: "3. Kat",
    location: "Isparta / Merkez / Fatih Mahallesi", type: "Konut",
    binaYasi: "0-2 Yaş", katSayisi: "8", isitma: "Doğalgaz Kombi", balkon: "Var", kullanim: "Boş",
    description: "Lüks donanımlı, modern mimariye sahip, geniş ve ferah kiralık daire.",
    createdAt: 1717833600000 - 10000,
  },
  {
    id: "p3", code: "ARV-1026", kind: "property", listingType: "sale", subType: "konut",
    title: "Sıfır Ultra Lüks Rezidans",
    priceTL: 5170000, images: ["/assets/property-1-CBDHeObv.jpg", "/assets/p3-1.jpg", "/assets/p3-2.jpg", "/assets/p3-3.jpg"],
    rooms: "3+1", m2: 135, baths: 2, floor: "2. Kat",
    location: "Isparta / Merkez / Fatih Mahallesi", type: "Konut",
    binaYasi: "Sıfır", katSayisi: "10", isitma: "Yerden Isıtma", balkon: "Var (2)", kullanim: "Sıfır",
    description: "Sıfır, kullanılmamış, en üst segment malzemelerle donatılmış prestijli rezidans dairesi.",
    createdAt: 1717833600000 - 20000,
  },
  {
    id: "p4", code: "ARV-1027", kind: "property", listingType: "sale", subType: "arsa",
    title: "Yatırımlık Verimli Bahçe",
    priceTL: 109000, images: ["/assets/p4-orchard.jpg", "/assets/p4-1.jpg", "/assets/p4-2.jpg"],
    area: 1200, tapu: "Müstakil", imar: "Bağ-Bahçe",
    location: "Isparta / Merkez / BüyükGökçeli", type: "Arsa / Bahçe",
    description: "Yola cepheli, içerisinde meyve ağaçları bulunan, hobi bahçesi yapımına uygun verimli toprak.",
    createdAt: 1717833600000 - 30000,
  },
  {
    id: "p5", code: "ARV-1028", kind: "property", listingType: "sale", subType: "arsa",
    title: "Yatırımlık Satılık Arsa",
    priceTL: 4000000, images: ["/assets/p5-cover.jpg", "/assets/p5-1.jpg", "/assets/p5-2.jpg"],
    area: 2500, tapu: "Müstakil", imar: "Konut İmarlı",
    location: "Isparta / Gönen", type: "Arsa",
    description: "Konut imarlı, geleceği parlak, yatırımcısına yüksek getiri potansiyeli sunan stratejik konumda arsa.",
    createdAt: 1717833600000 - 40000,
  },
];

export const seedVehicles: Vehicle[] = [
  { id: "v1", code: "ARV-2048", kind: "vehicle", listingType: "sale", title: "Mercedes-Benz S-Class", priceTL: 6500000, images: ["/assets/car-1-BNcuS9Yg.jpg", "/assets/v1-1.jpg", "/assets/v1-2.jpg", "/assets/v1-3.jpg", "/assets/v1-4.jpg", "/assets/v1-5.jpg"], year: 2023, km: 12000, gear: "Otomatik", fuel: "Benzin", damage: "Hasarsız", renk: "Obsidyen Siyah", motorGucu: "367 HP", ekspertiz: "Boyasız, değişensiz", description: "Tek elden, garaj saklamalı, tüm bakımları yetkili serviste yapılmış.", createdAt: 1717833600000 - 50000 },
  { id: "v2", code: "ARV-2049", kind: "vehicle", listingType: "sale", title: "Range Rover Sport", priceTL: 8200000, images: ["/assets/car-2-_ZILX4VY.jpg", "/assets/v2-1.jpg", "/assets/v2-2.jpg", "/assets/v2-3.jpg", "/assets/v2-4.jpg", "/assets/v2-5.jpg"], year: 2024, km: 5500, gear: "Otomatik", fuel: "Dizel", damage: "Hasarsız", renk: "Santorini Beyaz", motorGucu: "350 HP", ekspertiz: "Boyasız, değişensiz", description: "Showroom durumunda, full opsiyonel.", createdAt: 1717833600000 - 60000 },
];

export const defaultSectors: Sector[] = [
  { id: "kurumsal",    label: "Kurumsal",    description: "Şirket profili, vizyon ve misyon",       active: true },
  { id: "gayrimenkul", label: "Gayrimenkul", description: "Emlak ilanları",                          active: true },
  { id: "otomotiv",    label: "Otomotiv",    description: "Araç ilanları",                            active: true },
  { id: "disticaret",  label: "Dış Ticaret", description: "Uluslararası ticaret hizmetleri",         active: true },
  { id: "tercume",     label: "Tercüme",     description: "Profesyonel çeviri",                       active: true },
];
