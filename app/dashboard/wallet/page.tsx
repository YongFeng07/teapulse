"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Wallet, Plus, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

export default function WalletPage() {
  const { toast } = useToast();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toppingUp, setToppingUp] = useState(false);
  const [amount, setAmount] = useState(50);

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setBalance(data.balance);
        setTransactions(data.transactions || []);
      }
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchWallet(); }, []);

  const handleTopup = async () => {
    setToppingUp(true);
    try {
      const res = await fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) {
        setBalance(data.balance);
        toast({ title: `RM${amount} topped up!`, variant: "success" });
        fetchWallet();
      } else {
        toast({ title: data.error || "Failed", variant: "destructive" });
      }
    } catch { toast({ title: "Failed", variant: "destructive" }); }
    finally { setToppingUp(false); }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[680px] mx-auto px-5 md:px-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm mb-6">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">Digital Wallet</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Stored Value</h1>
        </motion.div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-6 mb-6"
          style={{ background: "linear-gradient(135deg, rgba(212,180,131,0.12), rgba(212,180,131,0.04))", border: "1px solid rgba(212,180,131,0.2)", boxShadow: "0 20px 50px rgba(212,180,131,0.1)" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-15" style={{ background: "radial-gradient(circle, #D4B483, transparent 70%)", filter: "blur(30px)" }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={14} className="text-[#D4B483]" />
              <span className="text-[#F5EFE6]/40 text-xs uppercase tracking-wider">Balance</span>
            </div>
            <p className="font-display text-5xl font-bold text-[#D4B483]">RM {balance.toFixed(2)}</p>
            <p className="text-[#F5EFE6]/25 text-xs mt-2">Earn 1.5x points when paying with wallet</p>
          </div>
        </motion.div>

        {/* Topup */}
        <div className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 mb-6">
          <h3 className="font-semibold text-[#F5EFE6] text-sm mb-4">Quick Top-Up</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[10, 20, 50, 100].map(v => (
              <button key={v} onClick={() => setAmount(v)} className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                amount === v ? "bg-[#D4B483] text-[#0E0E0E]" : "bg-[rgba(255,255,255,0.03)] border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/50 hover:text-[#D4B483]"
              }`}>RM {v}</button>
            ))}
          </div>
          <motion.button onClick={handleTopup} disabled={toppingUp} className="w-full py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold text-sm hover:bg-[#E8D5B0] transition-all disabled:opacity-50 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Plus size={15} /> {toppingUp ? "Processing..." : `Top Up RM${amount}`}
          </motion.button>
        </div>

        {/* Transactions */}
        <div className="bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-2xl p-5">
          <h3 className="font-semibold text-[#F5EFE6] text-sm mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-[#F5EFE6]/25 text-xs text-center py-6">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "TOPUP" ? "bg-green-500/10" : "bg-red-500/10"}`}>
                    {tx.type === "TOPUP" ? <ArrowDown size={14} className="text-green-400" /> : <ArrowUp size={14} className="text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#F5EFE6]">{tx.description}</p>
                    <p className="text-[10px] text-[#F5EFE6]/25">{new Date(tx.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`font-semibold text-sm ${tx.type === "TOPUP" ? "text-green-400" : "text-red-400"}`}>
                    {tx.type === "TOPUP" ? "+" : "-"}RM{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
