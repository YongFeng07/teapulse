"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-[8000] w-11 h-11 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(212,180,131,0.12)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(212,180,131,0.25)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
          whileHover={{ scale: 1.1, background: "rgba(212,180,131,0.2)" }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp size={16} className="text-[#D4B483]" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
