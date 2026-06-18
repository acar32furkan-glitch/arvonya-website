import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { ResponsivePicture } from "@/components/ResponsivePicture";
import { Link } from "@tanstack/react-router";
import { useStore, formatPrice } from "@/lib/store";

export function FavoritesDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { favorites, properties, vehicles, currency, toggleFavorite } = useStore();
  const items = [...properties, ...vehicles].filter((i) => favorites.includes(i.id));

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold">Favorilerim</h2>
              <button
                onClick={onClose}
                aria-label="Favoriler panelini kapat"
                className="p-2 rounded-full hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="h-14 w-14 mx-auto text-border mb-5" />
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Henüz favori mülkünüz bulunmuyor. Keşfetmeye başlayın!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-2 rounded-2xl border border-border hover:bg-secondary/40 transition"
                  >
                    <Link
                      to="/listing/$id"
                      params={{ id: item.id }}
                      onClick={onClose}
                      className="flex-shrink-0"
                    >
                      <ResponsivePicture
                        src={item.images[0]}
                        alt={item.title}
                        className="h-16 w-20 object-cover rounded-xl"
                        sizes="80px"
                        width={1600}
                        height={900}
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to="/listing/$id" params={{ id: item.id }} onClick={onClose}>
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.code}</p>
                        <p className="text-sm font-semibold mt-1">
                          {formatPrice(item.priceTL, currency)}
                        </p>
                      </Link>
                    </div>
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      aria-label={`${item.title} favorilerden çıkar`}
                      className="p-2 self-start text-brand-orange"
                    >
                      <Heart className="h-4 w-4 fill-brand-orange" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
