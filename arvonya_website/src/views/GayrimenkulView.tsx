import { motion } from "framer-motion";
import { useStore, applySort, tr } from "@/lib/store";
import { ListingCard } from "@/components/ListingCard";
import { Hero } from "@/components/Hero";
import { NedenArvonya } from "@/components/NedenArvonya";
import { LeadForm } from "@/components/LeadForm";
import { Footer } from "@/components/Footer";

const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5 },
};

export function GayrimenkulView() {
  const {
    properties,
    sort,
    listingTypeFilter,
    searchQuery,
    locationFilter,
    lang,
    priceMin,
    priceMax,
    roomsFilter,
  } = useStore();
  let filtered = properties.filter((p) => p.listingType === listingTypeFilter);
  if (locationFilter) filtered = filtered.filter((p) => p.location === locationFilter);
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q),
    );
  }
  if (priceMin) filtered = filtered.filter((p) => p.priceTL >= Number(priceMin));
  if (priceMax) filtered = filtered.filter((p) => p.priceTL <= Number(priceMax));
  if (roomsFilter)
    filtered = filtered.filter((p) => p.kind === "property" && p.rooms === roomsFilter);
  const sorted = applySort(filtered, sort);
  return (
    <motion.section {...fade}>
      <Hero />
      <div className="mx-auto max-w-7xl px-6 pb-20">
        <div className="space-y-10">
          {sorted.length > 0 ? (
            sorted.map((p) => <ListingCard key={p.id} item={p} />)
          ) : (
            <div className="text-center py-24 text-muted-foreground">
              <p className="text-lg">{tr("Aramanıza uygun ilan bulunamadı.", lang)}</p>
            </div>
          )}
        </div>
      </div>
      <NedenArvonya />
      <LeadForm />
      <Footer />
    </motion.section>
  );
}
