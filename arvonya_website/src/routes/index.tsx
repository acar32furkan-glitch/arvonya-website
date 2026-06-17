import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { IntroAnimation } from "@/components/IntroAnimation";
import { Navbar } from "@/components/Navbar";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { FilterCapsule } from "@/components/FilterCapsule";
import { ChatbotCapsule } from "@/components/ChatbotCapsule";
import { CookieBanner } from "@/components/CookieBanner";
import { GayrimenkulView, OtomotivView, DisTicaretView, TercumeView, KurumsalView } from "@/views/SectorViews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arvonya Grup — Kurumsal Güven, Kalıcı İstikrar" },
      { name: "description", content: "Emlak, otomotiv, dış ticaret ve profesyonel tercüme hizmetleri. Arvonya Group ile değer katan stratejik çözümler." },
      { name: "author", content: "Arvonya Grup" },
      { property: "og:title", content: "Arvonya Grup — Kurumsal Güven, Kalıcı İstikrar" },
      { property: "og:description", content: "Emlak, otomotiv, dış ticaret ve profesyonel tercüme hizmetleri." },
      { property: "og:image", content: "https://arvonya-website.vercel.app/logo_preview.png" },
      { property: "og:url", content: "https://arvonya-website.vercel.app" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Arvonya Grup — Kurumsal Güven, Kalıcı İstikrar" },
      { name: "twitter:description", content: "Emlak, otomotiv, dış ticaret ve profesyonel tercüme hizmetleri." },
      { name: "twitter:image", content: "https://arvonya-website.vercel.app/logo_preview.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Home />,
});

function Home() {
  const { view } = useStore();
  return (
    <div className="min-h-screen relative">
      <IntroAnimation />
      <AmbientBackdrop />
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          {view === "kurumsal" && <KurumsalView key="k" />}
          {view === "gayrimenkul" && <GayrimenkulView key="g" />}
          {view === "otomotiv" && <OtomotivView key="o" />}
          {view === "disticaret" && <DisTicaretView key="d" />}
          {view === "tercume" && <TercumeView key="t" />}
        </AnimatePresence>
      </main>
      <FilterCapsule />
      <ChatbotCapsule />
      <CookieBanner />
    </div>
  );
}
