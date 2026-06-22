import { createFileRoute } from "@tanstack/react-router";
import { COMPANY } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [{ title: "İletişim | Arvonya Grup" }],
  }),
  component: () => <IletisimPage />,
});

function IletisimPage() {
  const whatsappHref = `https://wa.me/${COMPANY.phoneIntl}?text=${encodeURIComponent("Merhaba, iletişim formu üzerinden mesaj gönderiyorum.")}`;
  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#1A1A1A]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pb-16 pt-28">
        <h1 className="text-3xl font-semibold tracking-tight">İletişim</h1>

        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Bize Ulaşın</h2>
            <div className="mt-5 space-y-5 text-sm leading-7">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Adres</p>
                <p className="mt-1">{COMPANY.address}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Telefon</p>
                <a className="mt-1 inline-block hover:underline" href={`tel:+${COMPANY.phoneIntl}`}>
                  {COMPANY.phone}
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Çalışma Saatleri
                </p>
                <p className="mt-1">Pzt-Cmt 09:00-18:00</p>
              </div>
            </div>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp ile Mesaj Gönder
            </a>
          </div>

          <div className="rounded-3xl border border-border bg-white p-6 md:p-8">
            <h2 className="text-xl font-semibold">Harita</h2>
            <iframe
              title="Arvonya Grup Konum"
              src="https://maps.google.com/maps?q=37.7648,30.5566&z=16&output=embed"
              className="mt-4 h-[300px] w-full rounded-2xl"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
