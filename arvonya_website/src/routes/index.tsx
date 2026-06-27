import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";
import { FilterCapsule } from "@/components/FilterCapsule";
import { ChatbotCapsule } from "@/components/ChatbotCapsule";
import { CookieBanner } from "@/components/CookieBanner";
import {
  GayrimenkulView,
  OtomotivView,
  DisTicaretView,
  TercumeView,
  KurumsalView,
} from "@/views/SectorViews";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arvonya Grup — Kurumsal Güven, Kalıcı İstikrar" },
      {
        name: "description",
        content:
          "Emlak, otomotiv ve dış ticaret hizmetleri. Arvonya Group ile değer katan stratejik çözümler.",
      },
      { name: "author", content: "Arvonya Grup" },
      { rel: "canonical", href: "https://arvonya-site.vercel.app/" },
      { property: "og:title", content: "Arvonya Grup — Kurumsal Güven, Kalıcı İstikrar" },
      {
        property: "og:description",
        content: "Emlak, otomotiv ve dış ticaret hizmetleri.",
      },
      { property: "og:image", content: "https://arvonya-site.vercel.app/assets/logo-480.webp" },
      { property: "og:url", content: "https://arvonya-site.vercel.app/" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Arvonya Grup — Kurumsal Güven, Kalıcı İstikrar" },
      {
        name: "twitter:description",
        content: "Emlak, otomotiv ve dış ticaret hizmetleri.",
      },
      { name: "twitter:image", content: "https://arvonya-site.vercel.app/assets/logo-480.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Arvonya Grup",
          image: "https://arvonya-site.vercel.app/assets/logo-480.webp",
          "@id": "https://arvonya-site.vercel.app",
          url: "https://arvonya-site.vercel.app",
          telephone: "+90 538 240 2246",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Isparta",
            addressCountry: "TR",
          },
          servingArea: "Isparta ve çevresi",
          priceRange: "TRY",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "50",
          },
        }),
      },
    ],
  }),
  component: () => <Home />,
});

function Home() {
  const { view } = useStore();
  return (
    <div className="min-h-screen relative">
      <main>
        <AnimatePresence mode="wait">
          {view === "kurumsal" && <KurumsalView key="k" />}
          {view === "gayrimenkul" && <GayrimenkulView key="g" />}
          {view === "otomotiv" && <OtomotivView key="o" />}
          {view === "disticaret" && <DisTicaretView key="d" />}
          {view === "tercume" && <TercumeView key="t" />}
        </AnimatePresence>
      </main>
      <AmbientBackdrop />
      <FilterCapsule />
      <ChatbotCapsule />
      <CookieBanner />
    </div>
  );
}