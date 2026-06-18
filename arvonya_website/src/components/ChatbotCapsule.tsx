import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { COMPANY } from "@/lib/store";

export function ChatbotCapsule() {
  const [hover, setHover] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const href = `https://wa.me/${COMPANY.phoneIntl}?text=${encodeURIComponent("Merhaba, Arvonya Group ile iletişime geçmek istiyorum.")}`;
  return (
    <div
      className="fixed bottom-6 right-6 z-40 flex items-end gap-3"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-1 px-4 py-2.5 rounded-2xl rounded-br-sm bg-white border-2 border-[#B83A12] shadow-lg text-sm text-[#1A1A1A] whitespace-nowrap"
          >
            Size nasıl yardımcı olabilirim?
          </motion.div>
        )}
      </AnimatePresence>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="Arvonya Asistan"
        className="h-14 w-14 rounded-full bg-[#2f4553] text-white flex items-center justify-center shadow-xl hover:scale-110 transition relative"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute inset-0 rounded-full animate-aura bg-[#2f4553]/30 -z-10" />
      </a>
    </div>
  );
}
