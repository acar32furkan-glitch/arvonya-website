import { useState } from "react";
import { useStore, COMPANY } from "@/lib/store";
import { motion } from "framer-motion";

export function LeadForm() {
  const { addLead, properties } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [region, setRegion] = useState("");
  const [sent, setSent] = useState(false);

  const regions = Array.from(new Set(properties.map(p => p.location))).sort();
  const types = ["Konut / Daire", "Arsa / Bahçe", "İşyeri", "Müstakil Ev", "Araç"];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    addLead({ id: `l${Date.now()}`, name, phone, propertyType, region, createdAt: Date.now() });
    setSent(true);
    setName(""); setPhone(""); setPropertyType(""); setRegion("");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mx-auto max-w-7xl px-6 pb-24"
    >
      <div className="rounded-3xl border border-border bg-white p-8 md:p-12 shadow-md">
        <div className="mb-8">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#2EAA4A] mb-2">Arvonya Group</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#1A1A1A]">
            Size en uygun teklif için bilgilerinizi bırakın
          </h2>
          <p className="text-sm text-muted-foreground mt-2">Sizi en kısa sürede {COMPANY.phone} numarasından arayalım.</p>
        </div>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-5 md:items-end">
          <FloatingInput label="İsim" value={name} onChange={setName} />
          <FloatingInput label="Telefon Numarası" value={phone} onChange={setPhone} type="tel" />
          <FloatingSelect label="Mülk Türü" value={propertyType} onChange={setPropertyType} options={types} />
          <FloatingSelect label="Bölge" value={region} onChange={setRegion} options={regions} />
          <button type="submit" className="btn-outline-orange h-12 whitespace-nowrap">
            {sent ? "Talebiniz alındı ✓" : "Beni Arasın"}
          </button>
        </form>
      </div>
    </motion.section>
  );
}

function FloatingInput({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="relative block">
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full h-12 px-1 pt-4 pb-1 bg-transparent border-b-2 border-border focus:border-[#1A1A1A] outline-none transition-colors text-sm"
      />
      <span className="absolute left-1 top-3.5 text-sm text-muted-foreground transition-all peer-focus:top-0 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest">
        {label}
      </span>
    </label>
  );
}

function FloatingSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="relative block">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">{label}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-9 bg-transparent border-b-2 border-border focus:border-[#1A1A1A] outline-none text-sm appearance-none cursor-pointer"
      >
        <option value="">Seçiniz</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
