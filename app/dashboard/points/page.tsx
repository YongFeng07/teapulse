"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

const TYPE_CFG: Record<string, { icon: typeof TrendingUp; color: string; label: string }> = {
  EARNED:     { icon: TrendingUp,   color: "#4ADE80", label: "Earned" },
  REDEEMED:   { icon: TrendingDown, color: "#F59E0B", label: "Redeemed" },
  BONUS:      { icon: Star,         color: "#D4B483", label: "Bonus" },
  ADJUSTMENT: { icon: TrendingUp,   color: "#94A3B8", label: "Adjustment" },
};

export default function PointsHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/user/points/history").then(r => r.json()),
      fetch("/api/user/points").then(r => r.json()),
    ]).then(([history, pointsData]) => {
      setTransactions(Array.isArray(history) ? history : []);
      setPoints(pointsData?.points ?? 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [status]);

  const totalEarned = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  if (status === "loading" || loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[680px] mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <motion.button onClick={() => router.back()}
            className="flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors mb-4 text-sm"
            whileHover={{ x: -3 }}>
            <ArrowLeft size={14} /> Back
          </motion.button>
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">My Account</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Points History</h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Balance", value: points.toLocaleString(), color: "#D4B483", big: true },
            { label: "Total Earned", value: `+${totalEarned}`, color: "#4ADE80", big: false },
            { label: "Total Spent", value: `-${totalSpent}`, color: "#F59E0B", big: false },
          ].map(({ label, value, color, big }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-4 text-center">
              <p className={`font-display font-bold ${big ? "text-3xl" : "text-xl"}`} style={{ color }}>{value}</p>
              <p className="text-[#F5EFE6]/30 text-[10px] uppercase tracking-wider mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Transaction list */}
        {transactions.length === 0 ? (
          <div className="text-center py-16">
            <Star size={32} className="mx-auto text-[#F5EFE6]/10 mb-4" />
            <p className="text-[#F5EFE6]/25 font-display text-xl">No transactions yet</p>
            <p className="text-[#F5EFE6]/15 text-sm mt-2">Place an order to start earning points</p>
            <Link href="/menu">
              <button className="mt-5 px-5 py-2.5 rounded-full bg-[#D4B483] text-[#0E0E0E] font-semibold text-sm hover:bg-[#E8D5B0] transition-all">
                Order & Earn
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {transactions.map((tx, i) => {
              const cfg = TYPE_CFG[tx.type] ?? TYPE_CFG.EARNED;
              const Icon = cfg.icon;
              const isPositive = tx.amount > 0;
              return (
                <motion.div key={tx.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-4 bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-xl p-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${cfg.color}12` }}>
                    <Icon size={15} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#F5EFE6] text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-[#F5EFE6]/30 text-xs mt-0.5">
                      {cfg.label} · {new Date(tx.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span className="font-display font-bold text-sm shrink-0" style={{ color: cfg.color }}>
                    {isPositive ? "+" : ""}{tx.amount} pts
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
