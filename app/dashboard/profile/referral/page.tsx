"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Copy, Share2, Gift, Users } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

interface ReferralInfo {
  code: string;
  referralCount: number;
  totalBonusPoints: number;
}

export default function ReferralPage() {
  const { toast } = useToast();
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/referral")
      .then(r => r.json())
      .then(data => { setInfo(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const referralLink = `${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${info?.code || ""}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast({ title: "Referral link copied!", variant: "success" });
  };

  const handleShare = () => {
    const text = `Join Tea Pulse using my referral code ${info?.code}! Get 50 bonus points when you sign up. 🧋✨\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!info) return null;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[680px] mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/dashboard/profile" className="inline-flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm mb-3">
            <ArrowLeft size={14} /> Back to Profile
          </Link>
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">Share & Earn</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6] mb-8">Refer Friends</h1>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 text-center">
            <Users size={20} className="mx-auto text-[#D4B483] mb-2" />
            <p className="font-display text-3xl font-bold text-[#F5EFE6]">{info.referralCount}</p>
            <p className="text-[#F5EFE6]/30 text-xs mt-1">Friends Referred</p>
          </div>
          <div className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 text-center">
            <Gift size={20} className="mx-auto text-[#C084FC] mb-2" />
            <p className="font-display text-3xl font-bold text-[#C084FC]">{info.totalBonusPoints}</p>
            <p className="text-[#F5EFE6]/30 text-xs mt-1">Bonus Points Earned</p>
          </div>
        </motion.div>

        {/* Code card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative overflow-hidden bg-[#161616] rounded-3xl border border-[rgba(212,180,131,0.12)] p-6 mb-5"
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #D4B483, transparent 70%)", filter: "blur(30px)" }} />
          <div className="relative text-center">
            <p className="text-[#F5EFE6]/40 text-xs uppercase tracking-wider mb-3">Your Referral Code</p>
            <p className="font-mono text-4xl font-bold text-[#D4B483] tracking-wider mb-2">{info.code}</p>
            <p className="text-[#F5EFE6]/35 text-xs">Share your code and both of you get <span className="text-[#D4B483] font-bold">50 points!</span></p>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1A1A1A] border border-[rgba(212,180,131,0.15)] text-[#F5EFE6]/70 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)] transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Copy size={15} /> Copy Link
          </motion.button>
          <motion.button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/15 transition-all text-sm font-medium"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            <Share2 size={15} /> Share WhatsApp
          </motion.button>
        </div>
      </div>
    </div>
  );
}
