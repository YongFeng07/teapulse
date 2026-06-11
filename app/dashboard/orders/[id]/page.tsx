"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Phone, MessageCircle, RefreshCw, Star, XCircle } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { ReorderButton } from "@/components/orders/reorder-button";
import { useToast } from "@/hooks/use-toast";
import type { OrderWithDetails } from "@/types";

const WHATSAPP = "601131780587";
const SST_RATE = 0.06;

const STATUS_STEPS = [
  { key: "PENDING",   label: "Order Received",   desc: "We have your order",        icon: "📋", color: "#F59E0B" },
  { key: "PREPARING", label: "Being Prepared",   desc: "Crafting your drinks",      icon: "🧋", color: "#3B82F6" },
  { key: "READY",     label: "Ready for Pickup", desc: "Your order is waiting!",    icon: "✅", color: "#10B981" },
  { key: "COMPLETED", label: "Collected",         desc: "Enjoy your tea!",           icon: "🎉", color: "#6B7280" },
];

const EST_TIMES: Record<string, string> = {
  PENDING: "5–10 min", PREPARING: "3–5 min", READY: "Ready now!", COMPLETED: "—", CANCELLED: "—",
};

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: number;
  sst: number;
  discount: number;
  total: number;
  pointsEarned: number;
  notes: string | null;
  createdAt: string;
  store: { name: string; address: string; city: string; phone: string };
  items: Array<{
    id: string; quantity: number; unitPrice: number;
    sugarLevel: string; iceLevel: string; toppings: string; subtotal: number;
    drink: { name: string; image: string };
  }>;
}

function formatRM(amount: number) {
  return `RM ${Math.abs(amount).toFixed(2)}`;
}

export default function OrderDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrder = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    try {
      const res = await fetch(`/api/orders/${params.id}`);
      const data = await res.json();
      if (data?.orderNumber) setOrder(data);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    intervalRef.current = setInterval(() => fetchOrder(true), 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [params.id]);

  const handleCancelOrder = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`/api/orders/${params.id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (res.ok) {
        setOrder(data);
        toast({ title: "Order cancelled", variant: "success" });
      } else {
        toast({ title: data.error || "Failed to cancel", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!order) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] pt-24 flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-[#F5EFE6]/30">Order not found</p>
        <Link href="/dashboard/orders" className="text-[#D4B483] text-sm hover:underline">← Back to orders</Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);
  const isCancelled = order.status === "CANCELLED";
  const isActive = !["COMPLETED", "CANCELLED"].includes(order.status);

  // Use stored values, fallback to calculation
  const sst = order.sst > 0 ? order.sst : Math.round(order.subtotal * SST_RATE * 100) / 100;
  const discount = order.discount > 0 ? order.discount : (order.subtotal + sst > order.total ? Math.round((order.subtotal + sst - order.total) * 100) / 100 : 0);

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-24">
      <div className="max-w-[760px] mx-auto px-5 md:px-10">
        <div className="flex items-center justify-between mt-6 mb-8">
          <motion.div whileHover={{ x: -3 }}>
            <Link href="/dashboard/orders" className="flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm font-medium">
              <ArrowLeft size={14} /> All Orders
            </Link>
          </motion.div>
          {isActive && (
            <motion.button onClick={() => fetchOrder(true)} disabled={refreshing}
              className="flex items-center gap-1.5 text-xs text-[#F5EFE6]/30 hover:text-[#D4B483] transition-colors"
              whileTap={{ rotate: 180 }}>
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              {refreshing ? "Refreshing..." : "Refresh status"}
            </motion.button>
          )}
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">Order Details</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold text-[#F5EFE6]">#{order.orderNumber}</h1>
              <ReorderButton orderId={order.id} order={order as OrderWithDetails} />
            </div>
            <span className="text-[#F5EFE6]/30 text-sm">{new Date(order.createdAt).toLocaleString("en-MY")}</span>
          </div>
        </motion.div>

        {/* Status tracker */}
        {!isCancelled ? (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="mt-6 bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[rgba(212,180,131,0.08)]">
              <motion.div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${STATUS_STEPS[currentStepIndex]?.color ?? "#6B7280"}18` }}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {STATUS_STEPS[currentStepIndex]?.icon}
              </motion.div>
              <div>
                <p className="font-display text-xl font-bold text-[#F5EFE6]">{STATUS_STEPS[currentStepIndex]?.label}</p>
                <p className="text-[#F5EFE6]/40 text-sm">{STATUS_STEPS[currentStepIndex]?.desc}</p>
                {isActive && <p className="text-[#D4B483] text-xs mt-1 font-medium">⏱ Est. {EST_TIMES[order.status]}</p>}
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-4 bottom-4 w-px bg-[rgba(212,180,131,0.08)]" />
              <div className="space-y-4">
                {STATUS_STEPS.map((step, i) => {
                  const done = i < currentStepIndex;
                  const active = i === currentStepIndex;
                  return (
                    <div key={step.key} className="flex items-center gap-4 relative">
                      <motion.div className="w-8 h-8 rounded-full flex items-center justify-center text-sm z-10 shrink-0"
                        style={{ background: done || active ? `${step.color}20` : "rgba(255,255,255,0.03)", border: `1px solid ${done || active ? step.color : "rgba(212,180,131,0.1)"}` }}
                        animate={active ? { boxShadow: [`0 0 0 0 ${step.color}40`, `0 0 0 8px transparent`] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}>
                        {done ? "✓" : step.icon}
                      </motion.div>
                      <p className="text-sm font-medium" style={{ color: done || active ? "#F5EFE6" : "rgba(245,239,230,0.3)" }}>
                        {step.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mt-6 bg-red-950/20 border border-red-500/20 rounded-2xl p-5 text-center">
            <p className="text-red-400 font-semibold">Order Cancelled</p>
          </div>
        )}

        {/* Cancel button for pending orders */}
        {order.status === "PENDING" && !isCancelled && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex justify-end">
            <motion.button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/25 text-red-400/80 text-xs font-medium hover:bg-red-500/8 hover:text-red-400 transition-all disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <XCircle size={14} />
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </motion.button>
          </motion.div>
        )}

        {/* Store + Contact */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="mt-4 bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5">
          <div className="flex items-start gap-3 mb-4">
            <MapPin size={16} className="text-[#D4B483] mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-[#F5EFE6] text-sm">{order.store.name}</p>
              <p className="text-[#F5EFE6]/40 text-xs mt-0.5">{order.store.address}, {order.store.city}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <a href={`tel:${WHATSAPP}`} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/60 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.25)] transition-all text-xs font-medium">
              <Phone size={13} /> Call Us
            </a>
            <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! Checking on order #${order.orderNumber}`)}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-500/08 border border-green-500/20 text-green-400 hover:bg-green-500/12 transition-all text-xs font-medium">
              <MessageCircle size={13} /> WhatsApp
            </a>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="mt-4 bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold text-[#F5EFE6] mb-4">Items</h2>
          <div className="space-y-4">
            {order.items.map(item => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A]">
                  <Image src={item.drink.image} alt={item.drink.name} fill className="object-cover" sizes="56px" unoptimized />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#F5EFE6] text-sm">{item.drink.name} <span className="text-[#F5EFE6]/40">×{item.quantity}</span></p>
                  <p className="text-xs text-[#F5EFE6]/35 mt-0.5">{item.sugarLevel} sugar · {item.iceLevel} ice{item.toppings && item.toppings !== "none" ? ` · ${item.toppings}` : ""}</p>
                  <p className="text-xs text-[#F5EFE6]/25 mt-0.5">RM {item.unitPrice.toFixed(2)} each</p>
                </div>
                <span className="font-display font-semibold text-[#D4B483] shrink-0 text-sm">{formatRM(item.subtotal)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Price breakdown */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="mt-4 bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 space-y-2.5">
          <div className="flex justify-between text-sm text-[#F5EFE6]/40">
            <span>Subtotal</span><span>{formatRM(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#F5EFE6]/40">
            <span>SST (6%)</span><span>{formatRM(sst)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-400">
              <span>Reward Discount</span><span>-{formatRM(discount)}</span>
            </div>
          )}
          {order.pointsEarned > 0 && (
            <div className="flex justify-between text-sm text-[#D4B483]/60">
              <span className="flex items-center gap-1"><Star size={11} /> Points Earned</span>
              <span>+{order.pointsEarned} pts</span>
            </div>
          )}
          <div className="flex justify-between pt-2.5 border-t border-[rgba(212,180,131,0.08)]">
            <span className="font-semibold text-[#F5EFE6]">Total Paid</span>
            <span className="font-display text-xl font-bold text-[#D4B483]">{formatRM(order.total)}</span>
          </div>
        </motion.div>

        {order.notes && (
          <div className="mt-4 bg-[#161616] border border-[rgba(212,180,131,0.07)] rounded-2xl p-4">
            <p className="text-[#F5EFE6]/25 text-xs uppercase tracking-wider mb-1">Special Instructions</p>
            <p className="text-[#F5EFE6]/55 text-sm">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
