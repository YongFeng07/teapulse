'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const steps = [20, 45, 70, 88, 100];
    const timings = [200, 400, 300, 500, 400];

    let total = 0;
    steps.forEach((step, i) => {
      total += timings[i];
      setTimeout(() => {
        setProgress(step);
        if (step === 100) {
          setTimeout(() => setDone(true), 600);
        }
      }, total);
    });
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#0E0E0E]"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 text-center"
          >
            <div className="flex items-center gap-3 justify-center mb-4">
              <div className="relative w-12 h-12">
                <motion.div
                  className="absolute inset-0 rounded-full border border-[#D4B483]"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.2, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="absolute inset-[2px] rounded-full bg-[#D4B483] opacity-80" />
                <div className="absolute inset-[5px] rounded-full bg-[#0E0E0E]" />
              </div>
            </div>
            <h1 className="font-display text-4xl font-bold tracking-[0.08em] text-[#F5EFE6]">
              TEA <span className="text-[#D4B483]">PULSE</span>
            </h1>
            <p className="label-sm text-[#F5EFE6]/30 mt-2 tracking-[0.2em]">LUXURY TEA EXPERIENCE</p>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-px bg-[rgba(212,180,131,0.15)] relative overflow-hidden rounded-full">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#D4B483] to-[#E8D5B0]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <p className="label-sm text-[#F5EFE6]/20 mt-3 tabular-nums">{progress}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
