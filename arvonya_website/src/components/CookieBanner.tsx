import { useEffect, useState } from "react";

const CONSENT_KEY = "arvonya_cookie_consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } finally {
      setIsVisible(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <section className="w-full border-t-2 border-brand-orange bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 text-xs text-[var(--foreground)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Bu site deneyiminizi iyileştirmek için çerez kullanmaktadır. KVKK kapsamında bilgi için
          Gizlilik Politikamızı inceleyebilirsiniz.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleConsent("accepted")}
            className="rounded-full border border-brand-orange px-3 py-1.5 text-xs font-medium text-brand-orange transition-colors hover:bg-brand-orange hover:text-white"
          >
            Kabul Et
          </button>
          <button
            type="button"
            onClick={() => handleConsent("rejected")}
            className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)]"
          >
            Reddet
          </button>
        </div>
      </div>
    </section>
  );
}
