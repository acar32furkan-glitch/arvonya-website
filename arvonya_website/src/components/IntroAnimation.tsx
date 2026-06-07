import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function IntroAnimation() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("arvonya_intro_seen")) return;
    setShow(true);
    sessionStorage.setItem("arvonya_intro_seen", "1");
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.4, y: "-42vh", x: "-44vw", opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="animate-aura absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-brand-orange/30 via-brand-green/30 to-brand-orange/30 blur-3xl" />
            <Logo size="text-6xl md:text-7xl" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
