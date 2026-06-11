"use client";

import { motion } from "framer-motion";

export function LoadingSpinner({ fullPage = false }: { fullPage?: boolean }) {
  if (fullPage) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <motion.div
          className="w-8 h-8 rounded-full border-2 border-[rgba(212,180,131,0.2)] border-t-[#D4B483]"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        className="w-8 h-8 rounded-full border-2 border-[rgba(212,180,131,0.2)] border-t-[#D4B483]"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
