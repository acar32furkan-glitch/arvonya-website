import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore, type Property, type Vehicle, type Sector, COMPANY } from "@/lib/store";
import { supabase } from "@/utils/supabase";
import { Logo } from "@/components/Logo";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Home,
  Car,
  Languages,
  CalendarCheck,
  Inbox,
  MessageCircle,
  Layers,
  Check,
  Pencil,
  Trash2,
  X,
  Upload,
  Menu,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Arvonya Group" }] }),
  component: () => <Admin />,
});

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  // IMPORTANT: Set VITE_ADMIN_PASSWORD in your environment (e.g., .env or CI/CD dashboard)
  const adminPw = import.meta.env.VITE_ADMIN_PASSWORD;
  const tryLogin = () => (pw === adminPw ? setAuthed(true) : alert("Hatalı parola"));
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(to bottom right, rgba(47,69,83,0.1) 0%, white 50%, rgba(184,58,18,0.1) 100%)" }}>
        <div className="w-full max-w-sm bg-white rounded-3xl border border-border p-8 shadow-xl">
          <Logo size="text-2xl" />
          <h1 className="mt-6 text-xl font-semibold">Yönetim Paneli</h1>
          <p className="text-sm text-muted-foreground mt-1">Devam etmek için giriş yapın.</p>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Parola"
            className="mt-6 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[#1A1A1A] outline-none"
            onKeyDown={(e) => e.key === "Enter" && tryLogin()}
          />
          <button
            onClick={tryLogin}
            className="mt-3 w-full py-3 rounded-full bg-[#1A1A1A] text-white font-medium hover:bg-[#2f4553] transition"
          >
            Giriş
          </button>
          <Link
            to="/"
            className="block text-center mt-4 text-xs text-muted-foreground hover:underline"
          >
            ← Siteye dön
          </Link>
        </div>
      </div>
    );
  }
  return <AdminInner />;
}

type Tab = "stats" | "properties" | "vehicles" | "sectors" | "translations" | "appointments";

function AdminInner() {
  const [tab, setTab] = useState<Tab>("stats");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { properties, vehicles, appointments, translationRequests } = useStore();
  const items: { id: Tab; label: string; icon: typeof Home; n: number }[] = [
    { id: "stats", label: "İstatistikler", icon: BarChart3, n: 0 },
    { id: "properties", label: "Emlak İlanları", icon: Home, n: properties.length },
    { id: "vehicles", label: "Araç İlanları", icon: Car, n: vehicles.length },
    { id: "sectors", label: "Sektörleri Yönet", icon: Layers, n: 0 },
    {
      id: "translations",
      label: "Tercüme Talepleri",
      icon: Languages,
      n: translationRequests.length,
    },
    { id: "appointments", label: "Randevular", icon: CalendarCheck, n: appointments.length },
  ];

  const sidebarBody = (dark: boolean) => (
    <>
      <Link to="/" onClick={() => setMobileOpen(false)}>
        <Logo size="text-lg" />
      </Link>
      <nav className="mt-10 space-y-1">
        {items.map(({ id, label, icon: Icon, n }) => {
          const active = tab === id;
          const baseLight = active
            ? "bg-[#1A1A1A] text-white"
            : "hover:bg-secondary text-[#1A1A1A]";
          const baseDark = active
            ? "bg-white text-[#1A1A1A]"
            : "text-white/80 hover:bg-white/10 hover:text-white";
          return (
            <button
              key={id}
              onClick={() => {
                setTab(id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition ${dark ? baseDark : baseLight}`}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Icon className="h-4 w-4 shrink-0" /> <span className="truncate">{label}</span>
              </span>
              {n > 0 && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${active ? (dark ? "bg-[#1A1A1A]/10" : "bg-white/20") : dark ? "bg-white/10" : "bg-secondary"}`}
                >
                  {n}
                </span>
              )}
            </button>
          );
        })}
      </nav>
      <p
        className={`mt-auto pt-6 text-[10px] leading-relaxed ${dark ? "text-white/50" : "text-muted-foreground"}`}
      >
        {COMPANY.address}
      </p>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[#F4F0EA] w-full overflow-x-hidden">
      <aside className="hidden md:flex w-64 bg-white border-r border-border p-6 flex-col shrink-0">
        {sidebarBody(false)}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 md:hidden backdrop-blur-sm"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1A1A1A] p-6 flex flex-col md:hidden shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Menüyü kapat"
              >
                <X className="h-4 w-4" />
              </button>
              {sidebarBody(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main
        className="flex-1 p-5 pt-20 md:p-10 md:pt-10 overflow-y-auto w-full min-w-0"
        style={{ boxSizing: "border-box" }}
      >
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed top-4 left-4 z-30 inline-flex items-center justify-center h-11 w-11 rounded-full bg-[#1A1A1A] text-white shadow-lg"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </button>
        {tab === "stats" && (
          <Stats
            counts={{
              properties: properties.length,
              vehicles: vehicles.length,
              translations: translationRequests.length,
              appointments: appointments.length,
            }}
          />
        )}
        {tab === "properties" && <ListingsManager kind="property" />}
        {tab === "vehicles" && <ListingsManager kind="vehicle" />}
        {tab === "sectors" && <SectorsManage />}
        {tab === "translations" && <RequestsTable type="translations" />}
        {tab === "appointments" && <RequestsTable type="appointments" />}
      </main>
    </div>
  );
}

function Stats({ counts }: { counts: Record<string, number> }) {
  const cards = [
    {
      label: "Emlak İlanları",
      val: counts.properties,
      color: "#2f4553",
      bg: "#2f455315",
      icon: Home,
    },
    { label: "Araç İlanları", val: counts.vehicles, color: "var(--brand-orange-dark)", bg: "var(--brand-orange-soft)", icon: Car },
    {
      label: "Tercüme Talepleri",
      val: counts.translations,
      color: "#2f4553",
      bg: "#2f455315",
      icon: Languages,
    },
    {
      label: "Randevular",
      val: counts.appointments,
      color: "var(--brand-orange-dark)",
      bg: "var(--brand-orange-soft)",
      icon: CalendarCheck,
    },
  ];
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#1A1A1A]">Genel Bakış</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-2xl p-5 md:p-6 border border-border shadow-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: c.bg }}
              >
                <c.icon className="h-5 w-5" style={{ color: c.color }} />
              </div>
              <span className="text-3xl md:text-4xl font-black" style={{ color: c.color }}>
                {c.val}
              </span>
            </div>
            <div>
              <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, (c.val / 20) * 100)}%`,
                    backgroundColor: c.color,
                  }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-[#1A1A1A]">{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Listings CRUD ---------------- */

function ListingsManager({ kind }: { kind: "property" | "vehicle" }) {
  const { properties, vehicles, deleteListing } = useStore();
  const list = kind === "property" ? properties : vehicles;
  const [editing, setEditing] = useState<Property | Vehicle | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<{ id: string; title: string } | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1A1A1A]">
          {kind === "property" ? "Emlak İlanları" : "Araç İlanları"}
        </h1>
        <button onClick={() => setCreating(true)} className="btn-outline-green">
          + Yeni İlan
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              {["Başlık", "Kod", "Fiyat", "İşlemler"].map((h) => (
                <th key={h} className="px-5 py-3 font-semibold text-[#1A1A1A]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((l) => (
              <tr key={l.id}>
                <td className="px-5 py-4 font-medium text-[#1A1A1A]">{l.title}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.code}</td>
                <td className="px-5 py-4 font-semibold text-[var(--brand-orange-dark)] whitespace-nowrap">
                  {l.priceTL.toLocaleString("tr-TR")} TL
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditing(l)}
                      className="btn-outline-orange !py-1.5 !px-3 text-xs"
                    >
                      <Pencil className="h-3 w-3" /> Düzenle
                    </button>
                    <button
                      onClick={() => setConfirmDel({ id: l.id, title: l.title })}
                      className="btn-outline-red"
                    >
                      <Trash2 className="h-3 w-3" /> Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-16 text-center text-muted-foreground">
                  Henüz bir ilan bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {list.length === 0 && (
          <div className="bg-white rounded-2xl border border-border p-10 text-center text-sm text-muted-foreground">
            Henüz bir ilan bulunmuyor.
          </div>
        )}
        {list.map((l) => (
          <div key={l.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-[#1A1A1A] leading-tight">{l.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{l.code}</p>
              </div>
              <span className="shrink-0 font-bold text-[var(--brand-orange-dark)] text-sm whitespace-nowrap">
                {l.priceTL.toLocaleString("tr-TR")} TL
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setEditing(l)}
                className="px-5 py-2.5 rounded-full border-2 border-[var(--brand-orange-dark)] text-[var(--brand-orange-dark)] text-xs font-semibold hover:bg-[var(--brand-orange-soft)] transition"
              >
                <Pencil className="h-3 w-3" /> Düzenle
              </button>
              <button
                onClick={() => setConfirmDel({ id: l.id, title: l.title })}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border-2 border-red-500 text-red-500 text-xs font-semibold hover:bg-red-50 transition"
              >
                <Trash2 className="h-3 w-3" /> Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(editing || creating) && (
          <ListingModal
            kind={kind}
            initial={editing}
            onClose={() => {
              setEditing(null);
              setCreating(false);
            }}
          />
        )}
        {confirmDel && (
          <ConfirmDelete
            title={confirmDel.title}
            onCancel={() => setConfirmDel(null)}
            onConfirm={() => {
              deleteListing(kind, confirmDel.id);
              setConfirmDel(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ConfirmDelete({
  title,
  onCancel,
  onConfirm,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.94, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
      >
        <h3 className="text-lg font-bold text-[var(--brand-orange-dark)] mb-2">İlanı Sil</h3>
        <p className="text-sm text-[#1A1A1A] leading-relaxed mb-1">
          Bu ilanı sistemden tamamen kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz.
        </p>
        <p className="text-xs text-muted-foreground italic mt-2 mb-6">"{title}"</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border-2 border-border hover:border-[#1A1A1A] text-sm font-medium transition"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
          >
            Evet, Sil
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ListingModal({
  kind,
  initial,
  onClose,
}: {
  kind: "property" | "vehicle";
  initial: Property | Vehicle | null;
  onClose: () => void;
}) {
  const { addListing, updateListing } = useStore();
  const isEdit = !!initial;
  const init = initial as Property | Vehicle | null;

  const [common, setCommon] = useState({
    title: init?.title ?? "",
    priceTL: init?.priceTL?.toString() ?? "",
    description: init?.description ?? "",
  });
  const [images, setImages] = useState<string[]>(init?.images ?? []);
  const [p, setP] = useState({
    listingType:
      init && (init as Property).kind === "property"
        ? (init as Property).listingType
        : ("sale" as "sale" | "rent"),
    subType:
      init && (init as Property).kind === "property"
        ? (init as Property).subType
        : ("konut" as "konut" | "arsa"),
    rooms: (init as Property)?.rooms ?? "",
    m2: (init as Property)?.m2?.toString() ?? "",
    baths: (init as Property)?.baths?.toString() ?? "",
    location: (init as Property)?.location ?? "",
    type: (init as Property)?.type ?? "Daire",
    floor: (init as Property)?.floor ?? "",
    area: (init as Property)?.area?.toString() ?? "",
    tapu: (init as Property)?.tapu ?? "Müstakil",
    imar: (init as Property)?.imar ?? "Konut İmarlı",
  });
  const [v, setV] = useState({
    year: (init as Vehicle)?.year?.toString() ?? "",
    km: (init as Vehicle)?.km?.toString() ?? "",
    gear: (init as Vehicle)?.gear ?? "Otomatik",
    fuel: (init as Vehicle)?.fuel ?? "Benzin",
    damage: (init as Vehicle)?.damage ?? "Hasarsız",
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const listingId = init?.id ?? Date.now().toString();

  const onFiles = async (files: FileList | null) => {
    if (!files || uploadingImages) return;
    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const safeName = file.name.replace(/[^\w.-]+/g, "_");
        const path = `${listingId}/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage.from("listings").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        if (error) {
          console.error("onFiles upload:", error);
          alert(`Görsel yüklenemedi: ${file.name}`);
          continue;
        }
        const { data } = supabase.storage.from("listings").getPublicUrl(path);
        uploadedUrls.push(data.publicUrl);
      }
      if (uploadedUrls.length > 0) {
        setImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error("onFiles:", err);
      alert("Görsel yüklenirken bir hata oluştu.");
    } finally {
      setUploadingImages(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const save = () => {
    if (!common.title || !common.priceTL) {
      alert("Başlık ve fiyat zorunludur.");
      return;
    }
    const base = {
      id: init?.id ?? `${kind[0]}${Date.now()}`,
      code: init?.code ?? `ARV-${Math.floor(1000 + Math.random() * 9000)}`,
      title: common.title,
      priceTL: Number(common.priceTL),
      images,
      description: common.description,
      createdAt: init?.createdAt ?? Date.now(),
    };
    let next: Property | Vehicle;
    if (kind === "property") {
      next = {
        ...base,
        kind: "property",
        listingType: p.listingType,
        subType: p.subType,
        location: p.location,
        type: p.type,
        rooms: p.subType === "konut" ? p.rooms : undefined,
        m2: p.subType === "konut" ? Number(p.m2) || 0 : undefined,
        baths: p.subType === "konut" ? Number(p.baths) || 0 : undefined,
        floor: p.subType === "konut" ? p.floor : undefined,
        area: p.subType === "arsa" ? Number(p.area) || 0 : undefined,
        tapu: p.subType === "arsa" ? p.tapu : undefined,
        imar: p.subType === "arsa" ? p.imar : undefined,
      } as Property;
    } else {
      next = {
        ...base,
        kind: "vehicle",
        listingType: "sale",
        year: Number(v.year) || new Date().getFullYear(),
        km: Number(v.km) || 0,
        gear: v.gear,
        fuel: v.fuel,
        damage: v.damage,
      } as Vehicle;
    }
    if (isEdit) updateListing(next);
    else addListing(next);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1A1A1A]">
            {isEdit ? "İlanı Düzenle" : "Yeni İlan"}
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <input
            className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[#1A1A1A] outline-none"
            placeholder="Başlık"
            value={common.title}
            onChange={(e) => setCommon({ ...common, title: e.target.value })}
          />
          <input
            className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[#1A1A1A] outline-none"
            placeholder="Fiyat (TL)"
            value={common.priceTL}
            onChange={(e) => setCommon({ ...common, priceTL: e.target.value })}
          />
          <textarea
            className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[#1A1A1A] outline-none"
            placeholder="Açıklama"
            rows={3}
            value={common.description}
            onChange={(e) => setCommon({ ...common, description: e.target.value })}
          />

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-2">
              Görseller
            </label>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              hidden
              disabled={uploadingImages}
              onChange={(e) => void onFiles(e.target.files)}
            />
            <button
              type="button"
              disabled={uploadingImages}
              onClick={() => fileRef.current?.click()}
              className="w-full border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-[#2f4553] transition flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="h-5 w-5 text-[#2f4553]" />
              <span className="text-sm">
                {uploadingImages ? "Yükleniyor..." : "Görsel yükle (çoklu seçim)"}
              </span>
            </button>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {images.map((src, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={src}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center"
                      aria-label="Görseli kaldır"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {kind === "property" ? (
            <div className="grid grid-cols-2 gap-3">
              <select
                className="px-4 py-3 rounded-xl border-2 border-border"
                value={p.listingType}
                onChange={(e) => setP({ ...p, listingType: e.target.value as "sale" | "rent" })}
              >
                <option value="sale">Satılık</option>
                <option value="rent">Kiralık</option>
              </select>
              <select
                className="px-4 py-3 rounded-xl border-2 border-border"
                value={p.subType}
                onChange={(e) => setP({ ...p, subType: e.target.value as "konut" | "arsa" })}
              >
                <option value="konut">Konut / Daire</option>
                <option value="arsa">Arsa / Bahçe</option>
              </select>
              <input
                className="px-4 py-3 rounded-xl border-2 border-border col-span-2"
                placeholder="Lokasyon (İl / İlçe / Mahalle)"
                value={p.location}
                onChange={(e) => setP({ ...p, location: e.target.value })}
              />
              {p.subType === "konut" ? (
                <>
                  <input
                    className="px-4 py-3 rounded-xl border-2 border-border"
                    placeholder="Oda sayısı (3+1)"
                    value={p.rooms}
                    onChange={(e) => setP({ ...p, rooms: e.target.value })}
                  />
                  <input
                    className="px-4 py-3 rounded-xl border-2 border-border"
                    placeholder="m²"
                    value={p.m2}
                    onChange={(e) => setP({ ...p, m2: e.target.value })}
                  />
                  <input
                    className="px-4 py-3 rounded-xl border-2 border-border"
                    placeholder="Banyo"
                    value={p.baths}
                    onChange={(e) => setP({ ...p, baths: e.target.value })}
                  />
                  <input
                    className="px-4 py-3 rounded-xl border-2 border-border"
                    placeholder="Bulunduğu Kat"
                    value={p.floor}
                    onChange={(e) => setP({ ...p, floor: e.target.value })}
                  />
                </>
              ) : (
                <>
                  <input
                    className="px-4 py-3 rounded-xl border-2 border-border"
                    placeholder="Toplam Alan (m²)"
                    value={p.area}
                    onChange={(e) => setP({ ...p, area: e.target.value })}
                  />
                  <select
                    className="px-4 py-3 rounded-xl border-2 border-border"
                    value={p.tapu}
                    onChange={(e) => setP({ ...p, tapu: e.target.value })}
                  >
                    <option>Müstakil</option>
                    <option>Hisseli</option>
                  </select>
                  <select
                    className="px-4 py-3 rounded-xl border-2 border-border col-span-2"
                    value={p.imar}
                    onChange={(e) => setP({ ...p, imar: e.target.value })}
                  >
                    <option>Konut İmarlı</option>
                    <option>Tarla</option>
                    <option>Bağ-Bahçe</option>
                  </select>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <input
                className="px-4 py-3 rounded-xl border-2 border-border"
                placeholder="Yıl"
                value={v.year}
                onChange={(e) => setV({ ...v, year: e.target.value })}
              />
              <input
                className="px-4 py-3 rounded-xl border-2 border-border"
                placeholder="Kilometre"
                value={v.km}
                onChange={(e) => setV({ ...v, km: e.target.value })}
              />
              <select
                className="px-4 py-3 rounded-xl border-2 border-border"
                value={v.gear}
                onChange={(e) => setV({ ...v, gear: e.target.value })}
              >
                <option>Otomatik</option>
                <option>Manuel</option>
              </select>
              <select
                className="px-4 py-3 rounded-xl border-2 border-border"
                value={v.fuel}
                onChange={(e) => setV({ ...v, fuel: e.target.value })}
              >
                <option>Benzin</option>
                <option>Dizel</option>
                <option>Hibrit</option>
                <option>Elektrik</option>
              </select>
              <select
                className="px-4 py-3 rounded-xl border-2 border-border col-span-2"
                value={v.damage}
                onChange={(e) => setV({ ...v, damage: e.target.value })}
              >
                <option>Hasarsız</option>
                <option>Az Hasarlı</option>
                <option>Ekspertizli</option>
              </select>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border-2 border-border hover:border-[#1A1A1A] text-sm font-medium transition"
            >
              İptal
            </button>
            <button
              onClick={save}
              className="px-5 py-2.5 rounded-full bg-[#2f4553] hover:bg-[#1a2a33] text-white text-sm font-semibold transition"
            >
              {isEdit ? "Güncelle" : "Yayınla"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Sectors Management ---------------- */

function SectorsManage() {
  const { sectors, updateSector } = useStore();
  const [editing, setEditing] = useState<Sector | null>(null);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-[#1A1A1A]">Sektörleri Yönet</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Pasif yapılan sektörler ana navigasyondan otomatik olarak gizlenir.
      </p>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              {["Sektör", "Açıklama", "Durum", "İşlemler"].map((h) => (
                <th key={h} className="px-5 py-3 font-semibold text-[#1A1A1A]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sectors.map((s) => (
              <tr key={s.id}>
                <td className="px-5 py-4 font-semibold text-[#1A1A1A]">{s.label}</td>
                <td className="px-5 py-4 text-muted-foreground">{s.description}</td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => updateSector({ ...s, active: !s.active })}
                    className={`relative h-6 w-11 rounded-full transition-colors ${s.active ? "bg-[#2f4553]" : "bg-neutral-300"}`}
                    aria-label={
                      s.active ? `${s.label} sektörünü pasif yap` : `${s.label} sektörünü aktif yap`
                    }
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${s.active ? "left-[22px]" : "left-0.5"}`}
                    />
                  </button>
                  <span
                    className={`ml-3 text-xs font-medium ${s.active ? "text-[#2f4553]" : "text-muted-foreground"}`}
                  >
                    {s.active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    onClick={() => setEditing(s)}
                    className="btn-outline-orange !py-1.5 !px-3 text-xs"
                  >
                    <Pencil className="h-3 w-3" /> Düzenle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sectors.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-[#1A1A1A]">{s.label}</p>
              <button
                onClick={() => updateSector({ ...s, active: !s.active })}
                className={`relative shrink-0 h-6 w-11 rounded-full transition-colors ${s.active ? "bg-[#2f4553]" : "bg-neutral-300"}`}
                aria-label={
                  s.active ? `${s.label} sektörünü pasif yap` : `${s.label} sektörünü aktif yap`
                }
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${s.active ? "left-[22px]" : "left-0.5"}`}
                />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1 mb-3">{s.description}</p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold ${s.active ? "text-[#2f4553]" : "text-muted-foreground"}`}
              >
                {s.active ? "● Aktif" : "○ Pasif"}
              </span>
              <button
                onClick={() => setEditing(s)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-[var(--brand-orange-dark)] text-[var(--brand-orange-dark)] text-xs font-semibold hover:bg-[var(--brand-orange-soft)] transition"
              >
                <Pencil className="h-3 w-3" /> Düzenle
              </button>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {editing && <SectorEditModal sector={editing} onClose={() => setEditing(null)} />}
      </AnimatePresence>
    </div>
  );
}

function SectorEditModal({ sector, onClose }: { sector: Sector; onClose: () => void }) {
  const { updateSector } = useStore();
  const [label, setLabel] = useState(sector.label);
  const [description, setDescription] = useState(sector.description);
  const save = () => {
    updateSector({ ...sector, label, description });
    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[#1A1A1A]">Sektörü Düzenle</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary"
            aria-label="Kapat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Başlık</span>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[#1A1A1A] outline-none"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Açıklama
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1.5 w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[#1A1A1A] outline-none"
            />
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border-2 border-border hover:border-[#1A1A1A] text-sm font-medium transition"
            >
              İptal
            </button>
            <button
              onClick={save}
              className="px-5 py-2.5 rounded-full bg-[#2f4553] hover:bg-[#1a2a33] text-white text-sm font-semibold transition"
            >
              Kaydet
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------- Requests ---------------- */

function RequestsTable({ type }: { type: "translations" | "appointments" }) {
  const { appointments, translationRequests, markAppointmentAnswered } = useStore();
  const rows = type === "appointments" ? appointments : translationRequests;

  if (rows.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8 text-[#1A1A1A]">
          {type === "appointments" ? "Randevular" : "Tercüme Talepleri"}
        </h1>
        <div className="bg-white rounded-3xl border border-border p-16 text-center text-muted-foreground">
          <Inbox className="h-12 w-12 mx-auto mb-4 text-border" />
          <p className="text-sm">Henüz bir talep bulunmuyor. Harika işler yolda!</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[#1A1A1A]">
        {type === "appointments" ? "Randevular" : "Tercüme Talepleri"}
      </h1>
      <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-secondary/60 text-left">
            <tr>
              {(type === "appointments"
                ? ["Ad", "Telefon", "Tarih", "İlan", "Durum", ""]
                : ["Ad", "E-posta", "Dil", "Dosya", ""]
              ).map((h) => (
                <th key={h} className="px-5 py-3 font-semibold text-[#1A1A1A]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {type === "appointments"
              ? appointments.map((a) => {
                  const answered = a.status === "answered";
                  return (
                    <tr key={a.id}>
                      <td className="px-5 py-4 font-medium">{a.name}</td>
                      <td className="px-5 py-4">{a.phone}</td>
                      <td className="px-5 py-4">{a.datetime}</td>
                      <td className="px-5 py-4">{a.listingTitle}</td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={
                            answered
                              ? { backgroundColor: "rgba(47,69,83,0.15)", color: "#2f4553" }
                              : { backgroundColor: "#FEF3C7", color: "#B45309" }
                          }
                        >
                          {answered ? (
                            <>
                              <Check className="h-3 w-3" /> Yanıtlandı
                            </>
                          ) : (
                            "Beklemede"
                          )}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <a
                          href={`https://wa.me/${a.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Merhaba ${a.name}, ${a.listingTitle} için randevu talebiniz onaylanmıştır.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => markAppointmentAnswered(a.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2f4553] hover:bg-[#1a2a33] text-white text-xs font-semibold transition"
                        >
                          <MessageCircle className="h-3 w-3" /> WhatsApp'tan Yanıtla
                        </a>
                      </td>
                    </tr>
                  );
                })
              : translationRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-5 py-4 font-medium">{r.name}</td>
                    <td className="px-5 py-4">{r.email}</td>
                    <td className="px-5 py-4">
                      {r.from} → {r.to}
                    </td>
                    <td className="px-5 py-4">{r.fileName}</td>
                    <td className="px-5 py-4"></td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
