"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Clock, CheckCircle, XCircle, Package, Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "PENDING" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  store: { name: string };
  items: Array<{ quantity: number; drink: { name: string } }>;
  notes?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  PENDING:   { label: "Pending",   color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  PREPARING: { label: "Preparing", color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  READY:     { label: "Ready",     color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  COMPLETED: { label: "Completed", color: "#6B7280", bg: "rgba(107,114,128,0.08)" },
  CANCELLED: { label: "Cancelled", color: "#EF4444", bg: "rgba(239,68,68,0.1)" },
};

const ALL_STATUSES: OrderStatus[] = ["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 60s
    const interval = setInterval(() => fetchOrders(true), 60000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } finally {
      setUpdating(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchesFilter = filter === "ALL" || o.status === filter;
    const matchesSearch = !search || 
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    pending: orders.filter(o => o.status === "PENDING").length,
    preparing: orders.filter(o => o.status === "PREPARING").length,
    ready: orders.filter(o => o.status === "READY").length,
    revenue: orders.filter(o => o.status === "COMPLETED").reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">Admin</p>
            <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Order Management</h1>
            <p className="text-[#F5EFE6]/30 text-xs mt-1">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
          <motion.button
            onClick={() => fetchOrders(true)}
            disabled={loading}
            className="mt-2 flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-[rgba(212,180,131,0.15)] text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)] transition-all text-sm"
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </motion.button>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Pending", value: stats.pending, color: "#F59E0B", urgent: stats.pending > 0 },
            { label: "Preparing", value: stats.preparing, color: "#3B82F6", urgent: false },
            { label: "Ready", value: stats.ready, color: "#10B981", urgent: false },
            { label: "Revenue Today", value: `RM ${stats.revenue.toFixed(0)}`, color: "#D4B483", urgent: false },
          ].map(({ label, value, color, urgent }) => (
            <motion.div
              key={label}
              className="bg-[#161616] border rounded-2xl p-4"
              style={{ borderColor: urgent ? `${color}40` : "rgba(212,180,131,0.1)" }}
              animate={urgent ? { boxShadow: [`0 0 0 0 ${color}20`, `0 0 0 6px transparent`] } : {}}
              transition={{ duration: 1.5, repeat: urgent ? Infinity : 0 }}
            >
              <p className="font-display text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-[#F5EFE6]/40 text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders, customers..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.12)] focus:border-[rgba(212,180,131,0.35)] outline-none text-[#F5EFE6] placeholder-[#F5EFE6]/25 text-sm transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {(["ALL", ...ALL_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
                  filter === s
                    ? "bg-[#D4B483] text-[#0E0E0E]"
                    : "bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/50 hover:text-[#D4B483]"
                )}
              >
                {s === "ALL" ? `All (${orders.length})` : `${STATUS_CONFIG[s].label} (${orders.filter(o => o.status === s).length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="text-center py-20 text-[#F5EFE6]/30">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-[#F5EFE6]/30">No orders found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => {
              const cfg = STATUS_CONFIG[order.status];
              const isUrgent = order.status === "PENDING";
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={cn(
                    "bg-[#161616] border rounded-2xl p-5 transition-all duration-300",
                    isUrgent ? "border-yellow-500/20" : "border-[rgba(212,180,131,0.1)]"
                  )}
                >
                  <div className="flex flex-wrap items-start gap-4">
                    {/* Order info */}
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-[#D4B483]">#{order.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                        {isUrgent && (
                          <motion.span
                            className="text-[10px] text-yellow-400 font-semibold"
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            NEW
                          </motion.span>
                        )}
                      </div>
                      <p className="text-[#F5EFE6] text-sm font-medium">{order.user?.name}</p>
                      <p className="text-[#F5EFE6]/30 text-xs">{order.user?.email}</p>
                    </div>

                    {/* Items */}
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-[#F5EFE6]/60 text-sm line-clamp-2">
                        {order.items?.map(i => `${i.drink?.name} ×${i.quantity}`).join(", ")}
                      </p>
                      {order.notes && (
                        <p className="text-yellow-400/60 text-xs mt-1">📝 {order.notes}</p>
                      )}
                    </div>

                    {/* Store + Time */}
                    <div className="text-right">
                      <p className="text-[#F5EFE6]/40 text-xs">{order.store?.name}</p>
                      <p className="text-[#F5EFE6]/25 text-xs">{new Date(order.createdAt).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}</p>
                      <p className="font-display font-bold text-[#D4B483] mt-1">RM {order.total?.toFixed(2)}</p>
                    </div>

                    {/* Status control */}
                    <div className="flex flex-col gap-2 min-w-[160px]">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        disabled={updating === order.id}
                        className="w-full text-sm bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.18)] rounded-xl px-3 py-2 text-[#F5EFE6] outline-none disabled:opacity-50 cursor-pointer"
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s} className="bg-[#1A1A1A]">{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                      {/* Quick action buttons */}
                      {order.status === "PENDING" && (
                        <motion.button
                          onClick={() => updateStatus(order.id, "PREPARING")}
                          className="w-full py-1.5 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-semibold hover:bg-blue-500/25 transition-all"
                          whileTap={{ scale: 0.97 }}
                        >
                          Start Preparing →
                        </motion.button>
                      )}
                      {order.status === "PREPARING" && (
                        <motion.button
                          onClick={() => updateStatus(order.id, "READY")}
                          className="w-full py-1.5 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-semibold hover:bg-green-500/25 transition-all"
                          whileTap={{ scale: 0.97 }}
                        >
                          Mark Ready ✓
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
