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
    const t = setTimeout(() => setShow(false), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
        >
<motion.div
           initial={{ scale: 1.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           exit={{ scale: 0.4, x: "-35vw", opacity: 0 }}
           transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
           className="origin-left relative overflow-hidden"
         >
           <div className="animate-aura absolute -top-8 -left-8 -z-10 rounded-full bg-gradient-to-r from-brand-orange/40 via-brand-green/40 to-brand-orange/40 blur-3xl pointer-events-none" />
           <Logo />
         </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
