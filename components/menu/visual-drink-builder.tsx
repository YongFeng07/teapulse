"use client";

import { motion } from "framer-motion";
import { Droplets, Snowflake } from "lucide-react";

interface Props {
  sugarLevel: string;
  iceLevel: string;
  toppings: string[];
  calories: number;
}

const SUGAR_COLORS: Record<string, string> = {
  "0%": "#F5EFE6",
  "25%": "#E8D5B0",
  "50%": "#D4B483",
  "75%": "#A8895A",
  "100%": "#7B5E3B",
};

const TOPPING_ICONS: Record<string, string> = {
  pearls: "⚫",
  jelly: "🟡",
  pudding: "🍮",
};

const TOPPING_POSITIONS = [
  { bottom: "15%", left: "20%" },
  { bottom: "25%", left: "55%" },
  { bottom: "20%", left: "40%" },
];

export function VisualDrinkBuilder({ sugarLevel, iceLevel, toppings, calories }: Props) {
  const sugarColor = SUGAR_COLORS[sugarLevel] || "#D4B483";
  const iceCount = iceLevel === "No ice" ? 0 : iceLevel === "Less" ? 2 : 4;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Cup */}
      <motion.div
        className="relative w-32 h-48"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Cup body */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28"
          style={{
            height: "85%",
            background: `linear-gradient(180deg, ${sugarColor}40 0%, ${sugarColor}80 100%)`,
            borderRadius: "12px 12px 24px 24px",
            border: "2px solid rgba(212,180,131,0.3)",
            boxShadow: `inset 0 0 30px ${sugarColor}20, 0 8px 24px rgba(0,0,0,0.3)`,
            overflow: "hidden",
          }}
        >
          {/* Liquid fill based on ice */}
          <motion.div
            className="absolute bottom-0 left-0 right-0"
            initial={{ height: "0%" }}
            animate={{ height: iceLevel === "No ice" ? "90%" : iceLevel === "Less" ? "80%" : "70%" }}
            transition={{ duration: 0.8 }}
            style={{
              background: `linear-gradient(180deg, ${sugarColor}60, ${sugarColor})`,
              borderRadius: "0 0 22px 22px",
            }}
          />

          {/* Ice cubes */}
          {Array.from({ length: iceCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-6 h-6 rounded-md bg-white/15 border border-white/20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 0.8, y: 0 }}
              transition={{ delay: i * 0.2 }}
              style={{
                left: `${15 + i * 25}%`,
                top: `${25 + (i % 2) * 20}%`,
                backdropFilter: "blur(2px)",
              }}
            />
          ))}

          {/* Toppings */}
          {toppings.map((t, i) => {
            const pos = TOPPING_POSITIONS[i] || TOPPING_POSITIONS[0];
            return (
              <motion.div
                key={t}
                className="absolute text-base"
                style={pos}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.2 }}
              >
                {TOPPING_ICONS[t] || "🫧"}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Indicators */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <Droplets size={12} className="text-[#D4B483]" />
          <span className="text-[#F5EFE6]/40">{sugarLevel} sugar</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Snowflake size={12} className="text-[#94A3B8]" />
          <span className="text-[#F5EFE6]/40">{iceLevel} ice</span>
        </div>
        <span className="text-[#F5EFE6]/25">{calories} kcal</span>
      </div>
    </div>
  );
}
