"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Star, CheckCircle, Sparkles, Lock, Copy, Check } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: string;
  value: number | null;
  isActive: boolean;
}

interface Redemption {
  id: string;
  code: string;
  isUsed: boolean;
  createdAt: string;
  reward: { name: string; type: string };
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  FREE_DRINK: { label: "Free Drink", color: "#D4B483", bg: "rgba(212,180,131,0.12)" },
  DISCOUNT: { label: "Discount", color: "#4ADE80", bg: "rgba(74,222,128,0.12)" },
  VOUCHER: { label: "Voucher", color: "#A78BFA", bg: "rgba(167,139,250,0.12)" },
};

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1.5 text-xs text-[#D4B483] hover:text-[#E8D5B0] transition-colors">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function TierProgressBar({ points }: { points: number }) {
  const tiers = [
    { name: "Bronze", min: 0, max: 499, color: "#CD7F32" },
    { name: "Silver", min: 500, max: 1499, color: "#94A3B8" },
    { name: "Gold", min: 1500, max: 3999, color: "#D4B483" },
    { name: "VIP", min: 4000, max: Infinity, color: "#C084FC" },
  ];
  const current = tiers.find(t => points >= t.min && points <= t.max) ?? tiers[0];
  const next = tiers[tiers.indexOf(current) + 1];
  const progress = next ? Math.min(100, ((points - current.min) / (next.min - current.min)) * 100) : 100;

  return (
    <div className="mt-4 p-4 bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.1)] rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: current.color }}>{current.name}</span>
          <span className="text-[#F5EFE6]/30 text-xs">Member</span>
        </div>
        {next && <span className="text-[#F5EFE6]/30 text-xs">{next.min - points} pts to {next.name}</span>}
      </div>
      <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${current.color}, ${current.color}99)` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {tiers.map((t) => (
          <span key={t.name} className="text-[10px] font-medium" style={{ color: points >= t.min ? t.color : "rgba(245,239,230,0.2)" }}>
            {t.name}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/rewards");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    Promise.all([
      fetch("/api/rewards").then((r) => r.json()),
      fetch("/api/user/redemptions").then((r) => r.json()),
      fetch("/api/user/points").then((r) => r.json()),
    ])
      .then(([rewardsData, redemptionsData, pointsData]) => {
        setRewards(Array.isArray(rewardsData) ? rewardsData : []);
        setRedemptions(Array.isArray(redemptionsData) ? redemptionsData : []);
        setUserPoints(typeof pointsData?.points === "number" ? pointsData.points : 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  const handleRedeem = async (reward: Reward) => {
    if (userPoints < reward.pointsCost) return;
    setRedeeming(reward.id);
    try {
      const res = await fetch("/api/rewards/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rewardId: reward.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Redemption failed");

      // Update state immediately
      setUserPoints((p) => p - reward.pointsCost);
      const newRedemption: Redemption = {
        id: data.id,
        code: data.code,
        isUsed: false,
        createdAt: data.createdAt || new Date().toISOString(),
        reward: { name: reward.name, type: reward.type },
      };
      setRedemptions((prev) => [newRedemption, ...prev]);
      toast({ title: "🎉 Redeemed!", description: `Code: ${data.code}`, variant: "success" });
    } catch (err) {
      toast({
        title: "Redemption failed",
        description: err instanceof Error ? err.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setRedeeming(null);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] pt-24 flex items-center justify-center">
        <motion.div className="w-8 h-8 rounded-full border-2 border-[rgba(212,180,131,0.2)] border-t-[#D4B483]"
          animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[960px] mx-auto px-5 md:px-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-3">Loyalty Program</p>
          <h1 className="font-display text-5xl font-bold text-[#F5EFE6]">
            Your{" "}
            <span className="italic" style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #D4B483, #E8D5B0)", backgroundClip: "text" }}>
              Rewards
            </span>
          </h1>
        </motion.div>

        {/* Points card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-3xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#F5EFE6]/40 text-xs uppercase tracking-wider mb-1">Available Points</p>
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="text-[#D4B483]" />
                <span className="font-display text-4xl font-bold text-[#D4B483]">{userPoints.toLocaleString()}</span>
                <span className="text-[#F5EFE6]/40 text-sm">pts</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[#F5EFE6]/30 text-xs">Earn 1 pt per</p>
              <p className="text-[#D4B483] font-semibold text-sm">RM 1 spent</p>
            </div>
          </div>
          <TierProgressBar points={userPoints} />
        </motion.div>

        {/* Available Rewards */}
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold text-[#F5EFE6] mb-5">Available Rewards</h2>
          {rewards.length === 0 ? (
            <p className="text-[#F5EFE6]/30 text-sm">No rewards available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward, i) => {
                const canRedeem = userPoints >= reward.pointsCost;
                const cfg = TYPE_CONFIG[reward.type] ?? TYPE_CONFIG.VOUCHER;
                return (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`bg-[#161616] border rounded-2xl p-5 transition-all duration-300 ${
                      canRedeem
                        ? "border-[rgba(212,180,131,0.15)] hover:border-[rgba(212,180,131,0.3)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
                        : "border-[rgba(212,180,131,0.06)] opacity-55"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: cfg.bg }}>
                        <Gift size={18} style={{ color: cfg.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-[#F5EFE6] text-sm">{reward.name}</h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          {!canRedeem && <Lock size={11} className="text-[#F5EFE6]/25" />}
                        </div>
                        <p className="text-[#F5EFE6]/40 text-xs leading-relaxed">{reward.description}</p>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-1.5">
                            <Star size={11} fill="#D4B483" className="text-[#D4B483]" />
                            <span className="font-display font-bold text-[#D4B483]">{reward.pointsCost}</span>
                            <span className="text-[#F5EFE6]/30 text-xs">points</span>
                          </div>
                          <motion.button
                            onClick={() => handleRedeem(reward)}
                            disabled={!canRedeem || redeeming === reward.id}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                              canRedeem && redeeming !== reward.id
                                ? "bg-[#D4B483] text-[#0E0E0E] hover:bg-[#E8D5B0]"
                                : "bg-[rgba(212,180,131,0.06)] text-[#F5EFE6]/25 cursor-not-allowed"
                            }`}
                            whileHover={{ scale: canRedeem && !redeeming ? 1.04 : 1 }}
                            whileTap={{ scale: canRedeem && !redeeming ? 0.97 : 1 }}
                          >
                            {redeeming === reward.id ? (
                              <span className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full border border-[#0E0E0E]/30 border-t-[#0E0E0E] animate-spin" />
                                Redeeming...
                              </span>
                            ) : canRedeem ? "Redeem" : `Need ${reward.pointsCost - userPoints} more pts`}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        {/* My Codes */}
        <AnimatePresence>
          {redemptions.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10"
            >
              <h2 className="font-display text-2xl font-semibold text-[#F5EFE6] mb-5">My Codes</h2>
              <div className="space-y-3">
                {redemptions.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`flex items-center justify-between bg-[#161616] border rounded-xl p-4 ${
                      r.isUsed ? "border-[rgba(212,180,131,0.05)] opacity-50" : "border-[rgba(212,180,131,0.1)]"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F5EFE6] text-sm font-medium">{r.reward.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="font-mono text-[#D4B483] text-sm font-bold tracking-wider">{r.code}</p>
                        {!r.isUsed && <CopyButton code={r.code} />}
                      </div>
                      <p className="text-[#F5EFE6]/25 text-xs mt-0.5">{new Date(r.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    {r.isUsed ? (
                      <span className="text-[#F5EFE6]/25 text-xs font-medium px-2 py-1 rounded-lg bg-[rgba(255,255,255,0.03)]">Used</span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-green-400">
                        <CheckCircle size={14} />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* How it works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-3xl p-7"
        >
          <h2 className="font-display text-xl font-semibold text-[#F5EFE6] mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Order & Earn", desc: "Get 1 point for every RM 1 spent. Points are added automatically after each order.", icon: "🧋" },
              { step: "02", title: "Level Up", desc: "Reach Bronze → Silver → Gold → VIP for exclusive perks and bonus multipliers.", icon: "⭐" },
              { step: "03", title: "Redeem", desc: "Use points for free drinks, discounts, or free add-ons. Codes are valid for 30 days.", icon: "🎁" },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="flex gap-4">
                <div className="text-2xl shrink-0 mt-0.5">{icon}</div>
                <div>
                  <p className="text-[#D4B483]/50 text-[10px] font-semibold uppercase tracking-wider mb-1">Step {step}</p>
                  <p className="font-semibold text-[#F5EFE6] text-sm mb-1">{title}</p>
                  <p className="text-[#F5EFE6]/35 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-[rgba(212,180,131,0.07)]">
            <Link href="/menu">
              <motion.button
                className="px-6 py-3 rounded-full bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all"
                whileHover={{ scale: 1.04 }}
              >
                Order Now & Start Earning
              </motion.button>
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
