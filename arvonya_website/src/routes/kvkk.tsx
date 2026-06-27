import { createFileRoute } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/kvkk")({
  head: () => ({
    meta: [{ title: "KVKK Aydınlatma Metni | Arvonya Grup" }],
  }),
  component: () => <KvkkPage />,
});

function KvkkPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto max-w-4xl px-6 pb-16 pt-28">
        <h1 className="text-3xl font-semibold tracking-tight">
          Kişisel Verilerin Korunması (KVKK) Aydınlatma Metni
        </h1>

        <section className="mt-8">
          <h2 className="text-xl font-semibold">Veri Sorumlusu</h2>
          <p className="mt-2 text-sm leading-7">
            Arvonya Grup, İstiklal Mahallesi 114 İstasyon Caddesi No:49/1 Isparta adresinde faaliyet
            gösteren veri sorumlusudur.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Toplanan Veriler</h2>
          <p className="mt-2 text-sm leading-7">
            Ad soyad, telefon numarası, iletişim içerikleri ve hizmet taleplerine ilişkin sınırlı
            veriler toplanabilmektedir.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">İşleme Amaçları</h2>
          <p className="mt-2 text-sm leading-7">
            Toplanan veriler, iletişim süreçlerinin yürütülmesi, talep ve başvuruların
            değerlendirilmesi, hizmet sunumu ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla
            işlenmektedir.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">Haklarınız</h2>
          <p className="mt-2 text-sm leading-7">
            6698 sayılı KVKK kapsamında, kişisel verilerinize ilişkin bilgi talep etme, düzeltme
            isteme, silinmesini talep etme, işlemeye itiraz etme ve kanundan doğan diğer haklarınızı
            kullanabilirsiniz.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold">İletişim</h2>
          <p className="mt-2 text-sm leading-7">
            KVKK kapsamındaki başvuru ve talepleriniz için Arvonya Grup ile telefon ve resmi
            iletişim kanalları üzerinden iletişime geçebilirsiniz.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
