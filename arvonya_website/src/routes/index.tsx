import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "framer-motion";
import { Suspense, lazy } from "react";
import { useStore } from "@/lib/store";
import {
  GayrimenkulView,
  OtomotivView,
  DisTicaretView,
  TercumeView,
  KurumsalView,
} from "@/views/SectorViews";

const FilterCapsule = lazy(() => import("@/components/FilterCapsule").then(m => ({ default: m.FilterCapsule })));
const ChatbotCapsule = lazy(() => import("@/components/ChatbotCapsule").then(m => ({ default: m.ChatbotCapsule })));
const CookieBanner = lazy(() => import("@/components/CookieBanner").then(m => ({ default: m.CookieBanner })));

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
      <Suspense fallback={null}><FilterCapsule /></Suspense>
      <Suspense fallback={null}><ChatbotCapsule /></Suspense>
      <Suspense fallback={null}><CookieBanner /></Suspense>
    </div>
  );
}