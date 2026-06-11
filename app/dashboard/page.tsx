"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Package, User, Gift, Coffee, Star, Heart } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { DailyCheckinCard } from "@/components/checkin/daily-checkin-card";
import { MembershipCard } from "@/components/loyalty/membership-card";
import { cn } from "@/lib/utils";

interface Profile {
  points: number;
  tier: string;
  tierProgress: number;
  nextTier: string | null;
  pointsToNextTier: number | null;
  name: string;
  email: string;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{ drink: { name: string }; quantity: number }>;
}

const TIER_COLORS: Record<string, string> = {
  Bronze: "#CD7F32",
  Silver: "#94A3B8",
  Gold: "#D4B483",
  VIP: "#C084FC",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#F59E0B",
  PREPARING: "#3B82F6",
  READY: "#10B981",
  COMPLETED: "#6B7280",
  CANCELLED: "#EF4444",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      fetch("/api/user/profile").then(r => r.json()),
      fetch("/api/orders").then(r => r.json()),
    ])
      .then(([profileData, ordersData]) => {
        setProfile(profileData);
        setOrders((Array.isArray(ordersData) ? ordersData : []).slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) return <LoadingSpinner fullPage />;

  const tierColor = TIER_COLORS[profile?.tier ?? "Bronze"] ?? "#D4B483";
  const activeOrder = orders.find(o => ["PENDING", "PREPARING", "READY"].includes(o.status));

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[680px] mx-auto px-5 md:px-8">

        {/* Greeting */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">Welcome back</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">
            {session?.user?.name?.split(" ")[0] ?? "Hey"} 👋
          </h1>
        </motion.div>

        {/* Daily check-in */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-6"
        >
          <DailyCheckinCard />
        </motion.div>

        {/* Active order alert */}
        {activeOrder && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Link href={`/dashboard/orders/${activeOrder.id}`}>
              <div className="flex items-center justify-between p-4 rounded-2xl border border-[#10B981]/25 bg-[rgba(16,185,129,0.06)] hover:border-[#10B981]/40 transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-2.5 h-2.5 rounded-full bg-[#10B981]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <div>
                    <p className="text-[#F5EFE6] text-sm font-semibold">
                      Order #{activeOrder.orderNumber} is{" "}
                      <span style={{ color: STATUS_COLORS[activeOrder.status] }}>
                        {activeOrder.status === "PENDING" ? "being received" : activeOrder.status === "PREPARING" ? "being prepared" : "ready for pickup!"}
                      </span>
                    </p>
                    <p className="text-[#F5EFE6]/40 text-xs mt-0.5">Tap to track your order</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#10B981]" />
              </div>
            </Link>
          </motion.div>
        )}

        {/* Points card */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-3xl p-6 mb-6"
            style={{
              background: `linear-gradient(135deg, ${tierColor}18, ${tierColor}08)`,
              border: `1px solid ${tierColor}25`,
              boxShadow: `0 20px 50px ${tierColor}10`,
            }}
          >
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: `radial-gradient(circle, ${tierColor}15, transparent 70%)`, filter: "blur(20px)" }} />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[#F5EFE6]/40 text-xs uppercase tracking-wider mb-1">Total Points</p>
                  <p className="font-display text-5xl font-bold" style={{ color: tierColor }}>
                    {profile.points.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: `${tierColor}15`, border: `1px solid ${tierColor}25` }}>
                  <Star size={11} fill={tierColor} style={{ color: tierColor }} />
                  <span className="text-xs font-bold" style={{ color: tierColor }}>{profile.tier}</span>
                </div>
              </div>
              {profile.nextTier && profile.pointsToNextTier !== null && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[#F5EFE6]/35 text-xs">Progress to {profile.nextTier}</span>
                    <span className="text-xs font-medium" style={{ color: tierColor }}>{profile.pointsToNextTier} pts away</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: `${tierColor}15` }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${tierColor}, ${tierColor}80)` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, profile.tierProgress)}%` }}
                      transition={{ duration: 1.2, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Membership Card */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mb-6"
          >
            <MembershipCard />
          </motion.div>
        )}

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          {[
            { href: "/menu", icon: Coffee, label: "Order Now", desc: "Browse menu", primary: true },
            { href: "/rewards", icon: Gift, label: "Rewards", desc: `${profile?.points ?? 0} pts`, primary: false },
            { href: "/dashboard/orders", icon: Package, label: "My Orders", desc: `${orders.length} orders`, primary: false },
            { href: "/dashboard/favourites", icon: Heart, label: "Favourites", desc: "Saved drinks", primary: false },
          ].map(({ href, icon: Icon, label, desc, primary }, i) => (
            <motion.div
              key={href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
            >
              <Link href={href} className="group block">
                <div className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border transition-all duration-300",
                  primary
                    ? "bg-[#D4B483] border-[#D4B483] hover:bg-[#E8D5B0]"
                    : "bg-[#161616] border-[rgba(212,180,131,0.1)] hover:border-[rgba(212,180,131,0.3)]"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    primary ? "bg-[rgba(0,0,0,0.15)]" : "bg-[rgba(212,180,131,0.08)]"
                  )}>
                    <Icon size={18} className={primary ? "text-[#0E0E0E]" : "text-[#D4B483]"} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("font-semibold text-sm truncate", primary ? "text-[#0E0E0E]" : "text-[#F5EFE6]")}>{label}</p>
                    <p className={cn("text-xs mt-0.5 truncate", primary ? "text-[#0E0E0E]/60" : "text-[#F5EFE6]/35")}>{desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent orders */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-[#F5EFE6]">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-[#D4B483] text-xs font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-2xl p-8 text-center">
              <Coffee size={28} className="mx-auto text-[#F5EFE6]/10 mb-3" />
              <p className="text-[#F5EFE6]/30 text-sm">No orders yet.</p>
              <Link href="/menu">
                <button className="mt-4 px-5 py-2.5 rounded-full bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all">
                  Place Your First Order
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                >
                  <Link href={`/dashboard/orders/${order.id}`} className="group flex items-center gap-4 bg-[#161616] border border-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.25)] rounded-2xl p-4 transition-all">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLORS[order.status] ?? "#6B7280" }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-[#D4B483]">#{order.orderNumber}</span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${STATUS_COLORS[order.status]}15`, color: STATUS_COLORS[order.status] }}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[#F5EFE6]/40 text-xs mt-0.5 truncate">
                        {order.items?.map(i => `${i.drink?.name} ×${i.quantity}`).join(", ")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display font-bold text-[#D4B483] text-sm">RM {order.total.toFixed(2)}</p>
                      <p className="text-[#F5EFE6]/25 text-[10px]">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ChevronRight size={14} className="text-[#F5EFE6]/20 group-hover:text-[#D4B483] transition-colors shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
