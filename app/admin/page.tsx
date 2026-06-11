"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart, TrendingUp, Coffee, ChevronRight,
  Activity, Users, Star, Clock, Package,
} from "lucide-react";

interface AdminStats {
  totalOrders: number;
  todayOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  readyOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  avgOrderValue: number;
  topDrinks: Array<{ name: string; count: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    user: { name: string };
    createdAt: string;
  }>;
}

const STATUS_COLOR: Record<string, string> = {
  PENDING: "#F59E0B", PREPARING: "#3B82F6",
  READY: "#10B981", COMPLETED: "#6B7280", CANCELLED: "#EF4444",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/orders").then(r => r.json()),
      fetch("/api/menu").then(r => r.json()),
    ]).then(([ordersData, menuData]) => {
      const orders = Array.isArray(ordersData) ? ordersData : [];
      const today = new Date().toDateString();
      const todayOrders = orders.filter((o: any) => new Date(o.createdAt).toDateString() === today);
      const completed = orders.filter((o: any) => o.status === "COMPLETED");

      // Count top drinks
      const drinkCounts: Record<string, number> = {};
      orders.forEach((o: any) => {
        o.items?.forEach((item: any) => {
          const name = item.drink?.name;
          if (name) drinkCounts[name] = (drinkCounts[name] || 0) + item.quantity;
        });
      });
      const topDrinks = Object.entries(drinkCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setStats({
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        pendingOrders: orders.filter((o: any) => o.status === "PENDING").length,
        preparingOrders: orders.filter((o: any) => o.status === "PREPARING").length,
        readyOrders: orders.filter((o: any) => o.status === "READY").length,
        totalRevenue: completed.reduce((s: number, o: any) => s + (o.total || 0), 0),
        todayRevenue: todayOrders.filter((o: any) => o.status === "COMPLETED").reduce((s: number, o: any) => s + (o.total || 0), 0),
        totalProducts: (menuData.drinks || []).length,
        totalCustomers: new Set(orders.map((o: any) => o.userId)).size,
        avgOrderValue: completed.length > 0 ? completed.reduce((s: number, o: any) => s + (o.total || 0), 0) / completed.length : 0,
        topDrinks,
        recentOrders: orders.slice(0, 6),
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] pt-24 flex items-center justify-center">
        <motion.div className="w-8 h-8 rounded-full border-2 border-[rgba(212,180,131,0.2)] border-t-[#D4B483]"
          animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
      </div>
    );
  }

  const metricCards = [
    { label: "Total Revenue", value: `RM ${(stats?.totalRevenue ?? 0).toFixed(0)}`, sub: `RM ${(stats?.todayRevenue ?? 0).toFixed(0)} today`, icon: TrendingUp, color: "#4ADE80" },
    { label: "Total Orders", value: stats?.totalOrders ?? 0, sub: `${stats?.todayOrders ?? 0} today`, icon: ShoppingCart, color: "#D4B483" },
    { label: "Customers", value: stats?.totalCustomers ?? 0, sub: "unique accounts", icon: Users, color: "#A78BFA" },
    { label: "Avg Order Value", value: `RM ${(stats?.avgOrderValue ?? 0).toFixed(2)}`, sub: "per order", icon: Star, color: "#F59E0B" },
  ];

  const liveCards = [
    { label: "Pending", value: stats?.pendingOrders ?? 0, color: "#F59E0B", urgent: (stats?.pendingOrders ?? 0) > 0 },
    { label: "Preparing", value: stats?.preparingOrders ?? 0, color: "#3B82F6", urgent: false },
    { label: "Ready", value: stats?.readyOrders ?? 0, color: "#10B981", urgent: false },
    { label: "Products", value: stats?.totalProducts ?? 0, color: "#D4B483", urgent: false },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">Control Centre</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Admin Dashboard</h1>
          <p className="text-[#F5EFE6]/30 text-sm mt-1">{new Date().toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
        </motion.div>

        {/* Live status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {liveCards.map(({ label, value, color, urgent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-[#161616] border rounded-2xl p-5"
              style={{ borderColor: urgent ? `${color}40` : "rgba(212,180,131,0.1)" }}
            >
              {urgent && (
                <motion.div
                  className="w-2 h-2 rounded-full mb-3"
                  style={{ background: color }}
                  animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
              <p className="font-display text-3xl font-bold" style={{ color }}>{value}</p>
              <p className="text-[#F5EFE6]/40 text-xs mt-1 uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Revenue metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {metricCards.map(({ label, value, sub, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}12` }}>
                  <Icon size={16} style={{ color }} />
                </div>
              </div>
              <p className="font-display text-2xl font-bold text-[#F5EFE6]">{value}</p>
              <p className="text-[#F5EFE6]/35 text-xs mt-1">{label}</p>
              <p className="text-[#F5EFE6]/20 text-[10px] mt-0.5">{sub}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Recent orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(212,180,131,0.08)]">
              <h2 className="font-display font-semibold text-[#F5EFE6]">Recent Orders</h2>
              <Link href="/admin/orders" className="flex items-center gap-1 text-xs text-[#D4B483] hover:underline">
                View all <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-[rgba(212,180,131,0.05)]">
              {(stats?.recentOrders ?? []).length === 0 ? (
                <div className="p-8 text-center text-[#F5EFE6]/25 text-sm">No orders yet</div>
              ) : (
                stats?.recentOrders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.04 }}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-[rgba(212,180,131,0.02)] transition-all"
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[order.status] ?? "#6B7280" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-[#D4B483] font-semibold">#{order.orderNumber}</span>
                        <span className="text-[10px]" style={{ color: STATUS_COLOR[order.status] }}>{order.status}</span>
                      </div>
                      <p className="text-[#F5EFE6]/40 text-xs mt-0.5 truncate">{order.user?.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display font-bold text-[#D4B483] text-sm">RM {order.total?.toFixed(2)}</p>
                      <p className="text-[#F5EFE6]/25 text-[10px]">{new Date(order.createdAt).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Top drinks + quick actions */}
          <div className="space-y-4">
            {/* Top drinks */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[rgba(212,180,131,0.08)]">
                <h2 className="font-display font-semibold text-[#F5EFE6]">Top Drinks</h2>
              </div>
              {(stats?.topDrinks ?? []).length === 0 ? (
                <div className="p-6 text-center text-[#F5EFE6]/25 text-sm">No data yet</div>
              ) : (
                <div className="p-4 space-y-3">
                  {stats?.topDrinks.map(({ name, count }, i) => {
                    const max = stats.topDrinks[0]?.count ?? 1;
                    return (
                      <div key={name}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#F5EFE6]/70 text-xs truncate pr-2">{name}</span>
                          <span className="text-[#D4B483] text-xs font-semibold shrink-0">{count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[rgba(212,180,131,0.06)] overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-[#D4B483]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(count / max) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.7 + i * 0.1 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-[rgba(212,180,131,0.08)]">
                <h2 className="font-display font-semibold text-[#F5EFE6]">Quick Actions</h2>
              </div>
              {[
                { href: "/admin/orders", icon: ShoppingCart, label: "Manage Orders", color: "#D4B483" },
                { href: "/admin/products", icon: Coffee, label: "Manage Products", color: "#A78BFA" },
                { href: "/menu", icon: Activity, label: "View Live Menu", color: "#4ADE80" },
              ].map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href}>
                  <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-[rgba(212,180,131,0.04)] transition-all group border-b border-[rgba(212,180,131,0.05)] last:border-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
                      <Icon size={14} style={{ color }} />
                    </div>
                    <span className="text-sm text-[#F5EFE6]/60 group-hover:text-[#F5EFE6] transition-colors flex-1">{label}</span>
                    <ChevronRight size={13} className="text-[#F5EFE6]/20 group-hover:text-[#D4B483] transition-colors" />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
