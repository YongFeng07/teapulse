"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import type { MembershipTier } from "@/types";

const TIER_COLORS: Record<MembershipTier, { bg: string; text: string; glow: string }> = {
  Bronze: { bg: "from-amber-900/40 to-amber-800/20", text: "#CD7F32", glow: "rgba(205,127,50,0.2)" },
  Silver: { bg: "from-slate-600/40 to-slate-500/20", text: "#94A3B8", glow: "rgba(148,163,184,0.2)" },
  Gold:   { bg: "from-yellow-700/40 to-yellow-600/20", text: "#D4B483", glow: "rgba(212,180,131,0.25)" },
  VIP:    { bg: "from-purple-900/40 to-pink-800/20", text: "#C084FC", glow: "rgba(192,132,252,0.25)" },
};

interface PointsCardProps {
  points: number;
  tier: MembershipTier;
  tierProgress: number;
  nextTier: MembershipTier | null;
  pointsToNextTier: number | null;
}

export function PointsCard({ points, tier, tierProgress, nextTier, pointsToNextTier }: PointsCardProps) {
  const colors = TIER_COLORS[tier];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${colors.bg} border border-[rgba(212,180,131,0.15)] p-6`}
      style={{ boxShadow: `0 20px 60px ${colors.glow}` }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-10" style={{ background: colors.text, filter: "blur(30px)" }} />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full opacity-8" style={{ background: colors.text, filter: "blur(20px)" }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="label-sm text-[#F5EFE6]/40 mb-1">Total Points</p>
            <p className="font-display text-5xl font-bold" style={{ color: colors.text }}>{points.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-warm">
            <Star size={12} fill={colors.text} style={{ color: colors.text }} />
            <span className="label-sm" style={{ color: colors.text }}>{tier}</span>
          </div>
        </div>

        {nextTier && pointsToNextTier !== null && (
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-[#F5EFE6]/40">Progress to {nextTier}</span>
              <span className="text-xs" style={{ color: colors.text }}>{pointsToNextTier} pts to go</span>
            </div>
            <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.08)] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${colors.text}, ${colors.text}99)` }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, tierProgress)}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
          </div>
        )}
        {!nextTier && (
          <p className="text-xs text-[#F5EFE6]/40 flex items-center gap-1">
            <TrendingUp size={12} style={{ color: colors.text }} />
            You&apos;ve reached the highest tier!
          </p>
        )}
      </div>
    </motion.div>
  );
}
