"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, MessageCircle, CreditCard, CheckCircle,
  ArrowLeft, ChevronRight, Wallet, Tag, X, Check, Gift
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart, calculateCartItemPrice } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "601131780587";
const SST_RATE = 0.06;

interface StoreItem { id: string; name: string; address: string; city: string; openHours: string; }
type PaymentMethod = "pay_in_store" | "tng" | "whatsapp";

function OrderSuccess({ orderNumber, total }: { orderNumber: string; total: number }) {
  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center max-w-sm w-full">
        <motion.div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6"
          animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 0.6, delay: 0.2 }}>
          <CheckCircle size={36} className="text-green-400" />
        </motion.div>
        <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Order Placed!</h1>
        <p className="text-[#F5EFE6]/40 mt-2 text-sm">Preparing your order now.</p>
        <div className="mt-4 px-5 py-2 rounded-full bg-[rgba(212,180,131,0.1)] border border-[rgba(212,180,131,0.2)] inline-block">
          <span className="font-mono text-[#D4B483] font-bold">#{orderNumber}</span>
        </div>
        <p className="font-display text-2xl font-bold text-[#D4B483] mt-3">RM {total.toFixed(2)}</p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/dashboard/orders"><motion.button className="w-full py-3.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all" whileHover={{ scale: 1.02 }}>Track Your Order</motion.button></Link>
          <Link href="/menu"><motion.button className="w-full py-3.5 rounded-xl glass border border-[rgba(212,180,131,0.2)] text-[#D4B483] font-semibold hover:border-[rgba(212,180,131,0.4)] transition-all" whileHover={{ scale: 1.02 }}>Order Again</motion.button></Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, selectedStoreId, setStore, getSubtotal, clearCart } = useCart();
  const { toast } = useToast();

  const [stores, setStores] = useState<StoreItem[]>([]);
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pay_in_store");
  const [loading, setLoading] = useState(false);
  const [storesLoading, setStoresLoading] = useState(true);
  const [success, setSuccess] = useState<{ orderNumber: string; total: number } | null>(null);

  // Reward code state
  const [rewardCode, setRewardCode] = useState("");
  const [rewardInput, setRewardInput] = useState("");
  const [rewardDiscount, setRewardDiscount] = useState(0);
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValid, setCodeValid] = useState<boolean | null>(null);

  const subtotal = getSubtotal();
  const sst = Math.round(subtotal * SST_RATE * 100) / 100;
  const total = Math.max(0, subtotal + sst - rewardDiscount);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/checkout");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/stores")
      .then(r => r.json())
      .then(data => { setStores(Array.isArray(data) ? data : []); setStoresLoading(false); })
      .catch(() => setStoresLoading(false));
  }, []);

  const validateCode = async () => {
    if (!rewardInput.trim()) return;
    setValidatingCode(true);
    try {
      const res = await fetch("/api/rewards/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: rewardInput.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setRewardCode(rewardInput.trim().toUpperCase());
        setRewardDiscount(data.discount);
        setCodeValid(true);
        toast({ title: `Reward applied! -RM ${data.discount.toFixed(2)}`, variant: "success" });
      } else {
        setCodeValid(false);
        toast({ title: "Invalid code", description: data.error || "Code not found or already used", variant: "destructive" });
      }
    } catch {
      setCodeValid(false);
      toast({ title: "Failed to validate", variant: "destructive" });
    } finally {
      setValidatingCode(false);
    }
  };

  const removeCode = () => {
    setRewardCode("");
    setRewardInput("");
    setRewardDiscount(0);
    setCodeValid(null);
  };

  const placeOrder = async () => {
    if (!selectedStoreId) {
      toast({ title: "Choose a pickup location", description: "Please select a store first.", variant: "destructive" });
      return;
    }
    if (items.length === 0) { router.push("/menu"); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: selectedStoreId,
          notes: notes || undefined,
          redemptionCode: rewardCode || undefined,
          items: items.map(({ drinkId, name, image, price, quantity, sugarLevel, iceLevel, toppings }) => ({
            drinkId, name, image, price, quantity, sugarLevel, iceLevel, toppings,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      if (paymentMethod === "whatsapp" || paymentMethod === "tng") {
        const store = stores.find(s => s.id === selectedStoreId);
        const itemLines = items.map(i => `  • ${i.name} ×${i.quantity} (${i.sugarLevel} sugar, ${i.iceLevel} ice)`).join("\n");
        const payLabel = paymentMethod === "tng" ? "💚 TNG eWallet" : "💬 WhatsApp";
        const discountLine = rewardDiscount > 0 ? `\n💰 Reward Discount: -RM ${rewardDiscount.toFixed(2)}` : "";
        const msg = `*🧋 TeaPulse Order #${data.orderNumber}*\n\n${itemLines}\n\nSubtotal: RM ${subtotal.toFixed(2)}\nSST (6%): RM ${sst.toFixed(2)}${discountLine}\n*Total: RM ${total.toFixed(2)}*\n💳 Payment: ${payLabel}\n📍 Pickup: ${store?.name ?? "—"}\n${notes ? `📝 Notes: ${notes}` : ""}`;
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
      }

      clearCart();
      setSuccess({ orderNumber: data.orderNumber, total });
    } catch (err) {
      toast({ title: "Order failed", description: err instanceof Error ? err.message : "Please try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (success) return <OrderSuccess {...success} />;
  if (items.length === 0 && status !== "loading") {
    return (
      <div className="min-h-screen bg-[#0E0E0E] pt-24 flex flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl text-[#F5EFE6]/30">Your cart is empty</p>
        <Link href="/menu"><button className="px-6 py-3 rounded-full bg-[#D4B483] text-[#0E0E0E] font-semibold">Browse Menu</button></Link>
      </div>
    );
  }

  const paymentOptions = [
    { id: "pay_in_store" as PaymentMethod, icon: CreditCard, label: "Pay In Store", desc: "Cash or card on pickup" },
    { id: "tng" as PaymentMethod, icon: Wallet, label: "TNG eWallet", desc: "Send to 011-3178 0587 · Confirm via WhatsApp" },
    { id: "whatsapp" as PaymentMethod, icon: MessageCircle, label: "WhatsApp Order", desc: "We'll confirm your order via WhatsApp" },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-24">
      <div className="max-w-[1100px] mx-auto px-6 md:px-12">
        <motion.button onClick={() => router.back()} className="flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors mt-6 mb-8 text-sm font-medium" whileHover={{ x: -3 }}>
          <ArrowLeft size={14} /> Back
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left */}
          <div className="space-y-5">
            <div>
              <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">Checkout</p>
              <h1 className="font-display text-3xl font-bold text-[#F5EFE6]">Complete your order</h1>
            </div>

            {/* Store selection */}
            <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.12)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={15} className="text-[#D4B483]" />
                <h2 className="font-semibold text-[#F5EFE6] text-sm">Pickup Location</h2>
              </div>
              {storesLoading ? (
                <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="h-14 rounded-xl animate-pulse bg-[rgba(212,180,131,0.04)]" />)}</div>
              ) : (
                <div className="space-y-2">
                  {stores.map(store => (
                    <motion.button key={store.id} onClick={() => setStore(store.id)}
                      className={cn("w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3",
                        selectedStoreId === store.id ? "border-[#D4B483] bg-[rgba(212,180,131,0.07)]" : "border-[rgba(212,180,131,0.1)] hover:border-[rgba(212,180,131,0.25)]"
                      )} whileTap={{ scale: 0.99 }}>
                      <div>
                        <p className="font-semibold text-[#F5EFE6] text-sm">{store.name}</p>
                        <p className="text-[#F5EFE6]/35 text-xs mt-0.5">{store.address}, {store.city}</p>
                        <p className="text-[#D4B483]/50 text-xs mt-0.5">⏰ {store.openHours}</p>
                      </div>
                      <div className={cn("w-4 h-4 rounded-full border-2 shrink-0 transition-all", selectedStoreId === store.id ? "border-[#D4B483] bg-[#D4B483]" : "border-[rgba(212,180,131,0.3)]")} />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Reward code */}
            <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.12)] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Gift size={15} className="text-[#D4B483]" />
                <h2 className="font-semibold text-[#F5EFE6] text-sm">Reward Code</h2>
                <span className="text-[#F5EFE6]/30 text-xs">(optional)</span>
              </div>
              {codeValid && rewardCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/10 border border-green-500/25">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-green-400" />
                    <span className="font-mono text-green-400 font-bold text-sm">{rewardCode}</span>
                    <span className="text-green-400/70 text-xs">-RM {rewardDiscount.toFixed(2)}</span>
                  </div>
                  <button onClick={removeCode} className="text-[#F5EFE6]/30 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
                    <input
                      value={rewardInput}
                      onChange={e => setRewardInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === "Enter" && validateCode()}
                      placeholder="Enter reward code"
                      className="w-full pl-9 pr-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all font-mono tracking-wider"
                    />
                  </div>
                  <motion.button
                    onClick={validateCode}
                    disabled={!rewardInput.trim() || validatingCode}
                    className="px-5 py-3 rounded-xl bg-[rgba(212,180,131,0.1)] border border-[rgba(212,180,131,0.2)] text-[#D4B483] text-sm font-semibold hover:bg-[rgba(212,180,131,0.18)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.97 }}
                  >
                    {validatingCode ? "..." : "Apply"}
                  </motion.button>
                </div>
              )}
              <p className="text-[#F5EFE6]/25 text-xs mt-2">Find your reward codes in the Rewards page</p>
            </div>

            {/* Payment method */}
            <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.12)] p-5">
              <h2 className="font-semibold text-[#F5EFE6] text-sm mb-4">Payment Method</h2>
              <div className="space-y-2">
                {paymentOptions.map(({ id, icon: Icon, label, desc }) => (
                  <motion.button key={id} onClick={() => setPaymentMethod(id)}
                    className={cn("w-full flex items-center gap-4 p-4 rounded-xl border transition-all",
                      paymentMethod === id ? "border-[#D4B483] bg-[rgba(212,180,131,0.07)]" : "border-[rgba(212,180,131,0.1)] hover:border-[rgba(212,180,131,0.25)]"
                    )} whileTap={{ scale: 0.99 }}>
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", paymentMethod === id ? "bg-[#D4B483]" : "bg-[rgba(212,180,131,0.08)]")}>
                      <Icon size={18} className={paymentMethod === id ? "text-[#0E0E0E]" : "text-[#D4B483]"} />
                    </div>
                    <div className="text-left flex-1">
                      <p className="text-sm font-semibold text-[#F5EFE6]">{label}</p>
                      <p className="text-[#F5EFE6]/35 text-xs mt-0.5">{desc}</p>
                    </div>
                    <div className={cn("w-4 h-4 rounded-full border-2 shrink-0", paymentMethod === id ? "border-[#D4B483] bg-[#D4B483]" : "border-[rgba(212,180,131,0.3)]")} />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.12)] p-5">
              <h2 className="font-semibold text-[#F5EFE6] text-sm mb-3">Special Instructions <span className="text-[#F5EFE6]/30 font-normal">(optional)</span></h2>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Extra sweet, no straw please..." rows={3} className="w-full bg-transparent text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none resize-none" />
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.12)] p-5">
              <h2 className="font-display text-lg font-semibold text-[#F5EFE6] mb-4">
                Order Summary <span className="text-[#F5EFE6]/30 font-sans font-normal text-sm">({items.length} items)</span>
              </h2>

              <div className="space-y-3 max-h-52 overflow-y-auto scrollbar-hide mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#1A1A1A]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="44px" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#F5EFE6] text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[#F5EFE6]/35 text-xs">×{item.quantity} · {item.sugarLevel} · {item.iceLevel}</p>
                    </div>
                    <p className="text-[#D4B483] text-sm font-semibold shrink-0">RM {calculateCartItemPrice(item).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[rgba(212,180,131,0.08)] pt-4 space-y-2.5">
                <div className="flex justify-between text-sm text-[#F5EFE6]/40">
                  <span>Subtotal</span><span>RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-[#F5EFE6]/40">
                  <span>SST (6%)</span><span>RM {sst.toFixed(2)}</span>
                </div>
                {rewardDiscount > 0 && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between text-sm text-green-400">
                    <span className="flex items-center gap-1"><Tag size={11} /> Reward Discount</span>
                    <span>-RM {rewardDiscount.toFixed(2)}</span>
                  </motion.div>
                )}
                <div className="flex justify-between pt-2.5 border-t border-[rgba(212,180,131,0.08)]">
                  <span className="font-semibold text-[#F5EFE6]">Total</span>
                  <span className="font-display text-xl font-bold text-[#D4B483]">RM {total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                onClick={placeOrder}
                disabled={loading || items.length === 0}
                className={cn("w-full mt-5 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all duration-300",
                  loading ? "bg-[rgba(212,180,131,0.3)] text-[#0E0E0E]/50 cursor-not-allowed" : "bg-[#D4B483] text-[#0E0E0E] hover:bg-[#E8D5B0]"
                )}
                style={!loading ? { boxShadow: "0 0 30px rgba(212,180,131,0.2)" } : {}}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (<><span className="w-4 h-4 rounded-full border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E] animate-spin" /> Placing Order...</>) : (<>Place Order · RM {total.toFixed(2)} <ChevronRight size={16} /></>)}
              </motion.button>
              <p className="text-center text-xs text-[#F5EFE6]/20 mt-3">
                {paymentMethod === "tng" ? "Send TNG to 011-3178 0587 after ordering" : paymentMethod === "whatsapp" ? "Confirm via WhatsApp" : "Pay on pickup · Earn points"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
