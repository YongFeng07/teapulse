"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Coffee } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-6">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #D4B483, transparent)", filter: "blur(80px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md relative z-10"
      >
        <motion.div
          className="w-20 h-20 rounded-3xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] flex items-center justify-center mx-auto mb-8"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <Coffee size={32} className="text-[#D4B483]" />
        </motion.div>

        <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-widest mb-4">404</p>
        <h1 className="font-display text-5xl font-bold text-[#F5EFE6] mb-4">
          Page not found.
        </h1>
        <p className="text-[#F5EFE6]/40 mb-8 text-base leading-relaxed">
          Looks like this page went cold. Let us get you back to something warm.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <motion.button
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all"
              whileHover={{ scale: 1.04 }}
            >
              Back to Home <ArrowRight size={16} />
            </motion.button>
          </Link>
          <Link href="/menu">
            <motion.button
              className="px-7 py-3.5 rounded-full border border-[rgba(212,180,131,0.25)] text-[#D4B483] font-semibold hover:bg-[rgba(212,180,131,0.07)] transition-all"
              whileHover={{ scale: 1.04 }}
            >
              Browse Menu
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
