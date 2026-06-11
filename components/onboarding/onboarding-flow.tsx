"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Gift, Sparkles, ChevronRight, Star } from "lucide-react";
import { useOnboarding } from "@/hooks/use-onboarding";

const SLIDES = [
  {
    icon: Coffee,
    emoji: "🧋",
    title: "Crafting Tea Perfection",
    subtitle: "Welcome to Tea Pulse",
    description:
      "Every cup is a masterpiece — handcrafted with premium ingredients, designed for the rhythm of modern life. Experience tea like never before.",
    color: "#D4B483",
    features: ["Premium loose-leaf teas", "Fresh daily ingredients", "Expertly crafted"],
  },
  {
    icon: Gift,
    emoji: "👑",
    title: "Earn Rewards, Rise Up",
    subtitle: "Loyalty Program",
    description:
      "Earn 1 point for every RM 1 spent. Climb through Bronze, Silver, Gold, and VIP tiers. Unlock exclusive perks at every level.",
    color: "#C084FC",
    features: ["Earn points on every order", "Daily check-in bonus", "Tier-exclusive perks"],
  },
  {
    icon: Sparkles,
    emoji: "🚀",
    title: "Skip the Queue",
    subtitle: "Order Ahead",
    description:
      "Browse, customize, and order ahead. Your drink will be ready when you arrive. No waiting, just sipping.",
    color: "#10B981",
    features: ["Order ahead & pickup", "Customize your drink", "Live order tracking"],
  },
];

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { completed, setCompleted } = useOnboarding();

  useEffect(() => { setMounted(true); }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!mounted || completed) return null;

  const handleFinish = () => {
    setCompleted();
  };

  const currentSlide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#0E0E0E] overflow-hidden"
      >
        {/* Background ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10"
            style={{
              background: `radial-gradient(circle, ${currentSlide.color}, transparent 70%)`,
              filter: "blur(80px)",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8"
            style={{
              background: `radial-gradient(circle, ${currentSlide.color}, transparent 70%)`,
              filter: "blur(60px)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative max-w-lg w-full mx-6 text-center">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {SLIDES.map((_, i) => (
              <motion.div
                key={i}
                className="h-1 rounded-full transition-all"
                style={{
                  width: i === step ? 32 : 8,
                  background: i === step ? currentSlide.color : "rgba(255,255,255,0.1)",
                }}
                animate={i === step ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ))}
          </div>

          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mb-6"
            >
              <div
                className="w-28 h-28 mx-auto rounded-3xl flex items-center justify-center text-6xl"
                style={{
                  background: `${currentSlide.color}12`,
                  border: `1px solid ${currentSlide.color}25`,
                  boxShadow: `0 0 60px ${currentSlide.color}15`,
                }}
              >
                {currentSlide.emoji}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p
                className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: currentSlide.color }}
              >
                {currentSlide.subtitle}
              </p>
              <h2 className="font-display text-4xl font-bold text-[#F5EFE6] mb-4 leading-tight">
                {currentSlide.title}
              </h2>
              <p className="text-[#F5EFE6]/45 text-sm leading-relaxed max-w-sm mx-auto">
                {currentSlide.description}
              </p>

              {/* Feature bullets */}
              <div className="flex flex-col items-center gap-2 mt-6">
                {currentSlide.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-[#F5EFE6]/40">
                    <Star
                      size={10}
                      style={{ color: currentSlide.color }}
                      fill={currentSlide.color}
                    />
                    {feat}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-10 flex items-center justify-center gap-4">
            {step > 0 && (
              <motion.button
                onClick={() => setStep(step - 1)}
                className="px-5 py-3 rounded-xl text-sm text-[#F5EFE6]/40 hover:text-[#F5EFE6] transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Back
              </motion.button>
            )}
            <motion.button
              onClick={isLast ? handleFinish : () => setStep(step + 1)}
              className="flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: currentSlide.color,
                color: "#0E0E0E",
                boxShadow: `0 0 30px ${currentSlide.color}30`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLast ? (
                <>Get Started ✨</>
              ) : (
                <>
                  Next <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </div>

          {/* Skip */}
          {!isLast && (
            <motion.button
              onClick={handleFinish}
              className="mt-5 text-xs text-[#F5EFE6]/20 hover:text-[#F5EFE6]/40 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              Skip
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
