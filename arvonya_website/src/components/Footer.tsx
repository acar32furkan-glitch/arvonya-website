import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Linkedin, Facebook, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useStore, tr, COMPANY } from "@/lib/store";

export function Footer() {
  const { lang } = useStore();
  const [modal, setModal] = useState<null | "privacy">(null);

  return (
    <>
      <footer className="bg-[#111111] text-neutral-300">
        <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-10">
          <div>
            <Logo size="text-xl" />
            <p className="mt-5 text-sm leading-relaxed text-neutral-400 max-w-xs">
              {tr(
                "Kurumsal güven, kalıcı istikrar ilkesiyle çok sektörlü hizmet sunan stratejik bir grup.",
                lang,
              )}
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white mb-4">
              {tr("İletişim", lang)}
            </h3>
            <div className="space-y-3 text-sm text-neutral-400 leading-relaxed">
              <p className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[var(--brand-orange-dark)]" />
                <span>{COMPANY.address}</span>
              </p>
              <p className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-[var(--brand-green)]" />
                <a href={`tel:+${COMPANY.phoneIntl}`} className="text-white hover:underline">
                  {COMPANY.phone}
                </a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white mb-4">
              {tr("Bizi Takip Edin", lang)}
            </h3>
            <div className="flex gap-3">
              {[
                [Instagram, "Instagram"],
                [Linkedin, "LinkedIn"],
                [Facebook, "Facebook"],
              ].map(([Ic, label], i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2.5 rounded-full border-2 border-white/15 hover:border-[var(--brand-orange-dark)] hover:text-[var(--brand-orange-dark)] transition"
                  aria-label={`${label} hesabına git`}
                >
                  <Ic className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-neutral-500">
            <p>
              © {new Date().getFullYear()} Arvonya Group. {tr("Tüm hakları saklıdır.", lang)}
            </p>
            <div className="flex gap-5">
              <Link to="/kvkk" className="hover:text-[var(--brand-orange-dark)] transition">
                KVKK
              </Link>
              <button
                onClick={() => setModal("privacy")}
                className="hover:text-[var(--brand-orange-dark)] transition"
              >
                {tr("Gizlilik Politikası", lang)}
              </button>
            </div>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-md"
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-3xl p-8 md:p-10 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-tight">Gizlilik Politikası</h3>
                <button
                  onClick={() => setModal(null)}
                  aria-label="Kapat"
                  className="p-2 rounded-full hover:bg-secondary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-4">
                <p>
                  Arvonya Group olarak 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında
                  veri sorumlusu sıfatıyla kişisel verilerinizi mevzuata uygun şekilde işliyoruz.
                </p>
                <p>
                  Kişisel verileriniz; size hizmet sunmak, iletişim kurmak, talepleri yönetmek ve
                  yasal yükümlülükleri yerine getirmek amacıyla işlenmektedir.
                </p>
                <p>
                  Verileriniz; üçüncü kişilerle yalnızca açık rızanız doğrultusunda veya yasal
                  zorunluluk halinde paylaşılır. KVKK'nın 11. maddesi gereği her zaman bilgi talep
                  etme, düzeltme, silme ve itiraz haklarına sahipsiniz.
                </p>
                <p>
                  Detaylı bilgi ve başvuru için {COMPANY.phone} numarasından bize ulaşabilirsiniz.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
