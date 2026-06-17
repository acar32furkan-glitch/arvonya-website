import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { StoreProvider, COMPANY } from "@/lib/store";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/iletisim")({
  head: () => ({
    meta: [{ title: "İletişim | Arvonya Grup" }],
  }),
  component: () => (
    <StoreProvider>
      <IletisimPage />
    </StoreProvider>
  ),
});

function IletisimPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    setSending(true);
    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Netlify form submit failed");
      }

      toast.success("Mesajınız alındı, en kısa sürede dönüş yapacağız.");
      setName("");
      setPhone("");
      setMessage("");
    } catch {
      toast.error("Gönderim sırasında bir sorun oluştu.");
    } finally {
      setSending(false);
    }
  };

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
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Çalışma Saatleri</p>
                <p className="mt-1">Pzt-Cmt 09:00-18:00</p>
              </div>
            </div>
          </div>

          <form
            name="arvonya-contact"
            data-netlify="true"
            onSubmit={submit}
            className="rounded-3xl border border-border bg-white p-6 md:p-8"
          >
            <input type="hidden" name="form-name" value="arvonya-contact" />
            <h2 className="text-xl font-semibold">İletişim Formu</h2>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">İsim</span>
                <input
                  name="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 outline-none transition focus:border-[#1A1A1A]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Telefon</span>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-white px-3 outline-none transition focus:border-[#1A1A1A]"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">Mesaj</span>
                <textarea
                  name="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="min-h-[120px] w-full rounded-xl border border-border bg-white px-3 py-2 outline-none transition focus:border-[#1A1A1A]"
                  required
                />
              </label>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex h-11 items-center justify-center rounded-full border-2 border-brand-orange px-6 text-sm font-semibold text-brand-orange transition hover:bg-brand-orange hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </form>
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-white">
          <iframe
            title="Arvonya Grup Konum"
            src="https://maps.google.com/maps?q=37.7648,30.5566&z=16&output=embed"
            className="h-[360px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
