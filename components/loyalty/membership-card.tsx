"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Star, Shield, Sparkles } from "lucide-react";

const TIER_CONFIG: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  Bronze: { color: "#CD7F32", bg: "linear-gradient(135deg, #CD7F3220, #CD7F3208)", icon: "🥉", label: "Bronze Member" },
  Silver: { color: "#94A3B8", bg: "linear-gradient(135deg, #94A3B820, #94A3B808)", icon: "🥈", label: "Silver Member" },
  Gold: { color: "#D4B483", bg: "linear-gradient(135deg, #D4B48320, #D4B48308)", icon: "🥇", label: "Gold Member" },
  VIP: { color: "#C084FC", bg: "linear-gradient(135deg, #C084FC20, #C084FC08)", icon: "👑", label: "VIP Member" },
};

interface ProfileData {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: string;
}

export function MembershipCard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse bg-[#161616] rounded-3xl h-64" />;
  }
  if (!profile) return null;

  const cfg = TIER_CONFIG[profile.tier] || TIER_CONFIG.Bronze;
  const qrData = `TEAPULSE:MEMBER:${profile.id}:${profile.name}:${profile.tier}:${profile.points}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-6"
      style={{ background: cfg.bg, border: `1px solid ${cfg.color}30`, boxShadow: `0 20px 50px ${cfg.color}10` }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none opacity-15"
        style={{ background: `radial-gradient(circle, ${cfg.color}, transparent 70%)`, filter: "blur(30px)" }} />

      <div className="relative flex items-start justify-between">
        {/* Left: info */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{cfg.icon}</span>
            <div>
              <p className="text-[#F5EFE6]/40 text-[9px] uppercase tracking-wider">{cfg.label}</p>
              <p className="font-display font-bold text-[#F5EFE6] text-lg">{profile.name}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Star size={12} style={{ color: cfg.color }} fill={cfg.color} />
              <span className="text-sm font-bold" style={{ color: cfg.color }}>{profile.points.toLocaleString()} pts</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={12} style={{ color: cfg.color }} />
              <span className="text-xs font-medium" style={{ color: cfg.color }}>{profile.tier} Tier</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <Sparkles size={11} className="text-[#F5EFE6]/20" />
            <span className="text-[9px] text-[#F5EFE6]/25">Show this QR to earn points in-store</span>
          </div>
        </div>

        {/* Right: QR code */}
        <div className="bg-white rounded-2xl p-3 shrink-0">
          <QRCodeSVG
            value={qrData}
            size={110}
            level="M"
            fgColor="#0E0E0E"
            bgColor="#FFFFFF"
          />
        </div>
      </div>

      {/* Bottom glow line */}
      <div className="mt-5 h-px rounded-full opacity-30"
        style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }} />
      <p className="text-center text-[9px] text-[#F5EFE6]/15 mt-2 tracking-widest uppercase">Tea Pulse Member</p>
    </motion.div>
  );
}
