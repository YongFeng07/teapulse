"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Package, RefreshCw } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { ReorderButton } from "@/components/orders/reorder-button";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  store: { name: string };
  items: Array<{ quantity: number; drink: { name: string } }>;
}

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pending",    color: "#F59E0B" },
  PREPARING: { label: "Preparing",  color: "#3B82F6" },
  READY:     { label: "Ready ✓",    color: "#10B981" },
  COMPLETED: { label: "Completed",  color: "#6B7280" },
  CANCELLED: { label: "Cancelled",  color: "#EF4444" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"active" | "all">("active");

  const fetchOrders = () => {
    setLoading(true);
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const activeOrders = orders.filter(o => ["PENDING", "PREPARING", "READY"].includes(o.status));
  const displayed = filter === "active" ? activeOrders : orders;

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[720px] mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">My Account</p>
            <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Order History</h1>
          </div>
          <motion.button onClick={fetchOrders} className="mt-2 p-2.5 rounded-xl glass border border-[rgba(212,180,131,0.15)] text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors" whileTap={{ rotate: 180 }}>
            <RefreshCw size={15} />
          </motion.button>
        </motion.div>

        {/* Filter */}
        <div className="flex gap-2 mb-5">
          {[
            { key: "active", label: `Active (${activeOrders.length})` },
            { key: "all", label: `All Orders (${orders.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                filter === key
                  ? "bg-[#D4B483] text-[#0E0E0E]"
                  : "bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.12)] text-[#F5EFE6]/50 hover:text-[#D4B483]"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {displayed.length === 0 ? (
          <div className="bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-2xl p-12 text-center">
            <Package size={36} className="mx-auto text-[#F5EFE6]/10 mb-4" />
            <p className="text-[#F5EFE6]/30 font-display text-xl">
              {filter === "active" ? "No active orders" : "No orders yet"}
            </p>
            <p className="text-[#F5EFE6]/20 text-sm mt-2">
              {filter === "active" ? "Your active orders will appear here" : "Order something delicious"}
            </p>
            <Link href="/menu">
              <button className="mt-5 px-5 py-2.5 rounded-full bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map((order, i) => {
              const cfg = STATUS_CFG[order.status] ?? { label: order.status, color: "#6B7280" };
              const isActive = ["PENDING", "PREPARING", "READY"].includes(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/dashboard/orders/${order.id}`} className="group flex items-center gap-4 bg-[#161616] border rounded-2xl p-5 transition-all hover:shadow-lg"
                    style={{ borderColor: isActive ? `${cfg.color}30` : "rgba(212,180,131,0.08)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${cfg.color}12` }}>
                      <Package size={16} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#D4B483] text-sm">#{order.orderNumber}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: `${cfg.color}14`, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        {isActive && (
                          <motion.span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: cfg.color }}
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        )}
                      </div>
                      <p className="text-[#F5EFE6]/40 text-xs mt-1 truncate">
                        {order.items?.map(i => `${i.drink?.name} ×${i.quantity}`).join(", ")}
                      </p>
                      <p className="text-[#F5EFE6]/20 text-[10px] mt-0.5">{order.store?.name} · {new Date(order.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <ReorderButton orderId={order.id} variant="icon" />
                      <span className="font-display font-bold text-[#D4B483]">RM {order.total.toFixed(2)}</span>
                      <ChevronRight size={15} className="text-[#F5EFE6]/20 group-hover:text-[#D4B483] transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
