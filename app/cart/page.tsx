"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart, calculateCartItemPrice } from "@/hooks/use-cart";
import { TOPPING_PRICE } from "@/types";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateItem, clearCart, getSubtotal } = useCart();

  const subtotal = getSubtotal();
  const sst = subtotal * 0.06;
  const total = subtotal + sst;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-24">
      <div className="max-w-[760px] mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">Your Order</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Cart</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 rounded-full bg-[rgba(212,180,131,0.06)] flex items-center justify-center mx-auto mb-5">
              <ShoppingBag size={32} className="text-[#F5EFE6]/15" />
            </div>
            <p className="font-display text-2xl text-[#F5EFE6]/25">Your cart is empty</p>
            <p className="text-[#F5EFE6]/15 text-sm mt-2">Add something delicious</p>
            <Link href="/menu">
              <motion.button
                className="mt-6 px-6 py-3 rounded-full bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all"
                whileHover={{ scale: 1.04 }}
              >
                Browse Menu
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-3 mb-6">
              <AnimatePresence initial={false}>
                {items.map((item, i) => {
                  const itemTotal = calculateCartItemPrice(item);
                  const toppingCost = item.toppings.length * TOPPING_PRICE;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -32, scale: 0.96 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex gap-4 bg-[#161616] border border-[rgba(212,180,131,0.09)] rounded-2xl p-4"
                    >
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#1A1A1A]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-[#F5EFE6] truncate text-sm">{item.name}</h3>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(212,180,131,0.08)] text-[#D4B483]/70">
                            {item.sugarLevel} sugar
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(212,180,131,0.08)] text-[#D4B483]/70">
                            {item.iceLevel} ice
                          </span>
                          {item.toppings.map((t) => (
                            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(167,139,250,0.08)] text-purple-300/70">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="text-[#F5EFE6]/30 text-[11px] mt-1">
                          RM {item.price.toFixed(2)}
                          {toppingCost > 0 && ` + RM ${toppingCost.toFixed(2)} toppings`}
                        </p>

                        {/* Qty + delete */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() =>
                                item.quantity > 1
                                  ? updateItem(item.id, { quantity: item.quantity - 1 })
                                  : removeItem(item.id)
                              }
                              className="w-7 h-7 rounded-full border border-[rgba(212,180,131,0.18)] flex items-center justify-center text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.4)] transition-all"
                              whileTap={{ scale: 0.88 }}
                            >
                              <Minus size={11} />
                            </motion.button>
                            <span className="font-semibold text-[#F5EFE6] w-5 text-center text-sm">{item.quantity}</span>
                            <motion.button
                              onClick={() => updateItem(item.id, { quantity: Math.min(9, item.quantity + 1) })}
                              className="w-7 h-7 rounded-full border border-[rgba(212,180,131,0.18)] flex items-center justify-center text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.4)] transition-all"
                              whileTap={{ scale: 0.88 }}
                            >
                              <Plus size={11} />
                            </motion.button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-display font-bold text-[#D4B483]">
                              RM {itemTotal.toFixed(2)}
                            </span>
                            <motion.button
                              onClick={() => removeItem(item.id)}
                              className="text-[#F5EFE6]/20 hover:text-red-400 transition-colors"
                              whileTap={{ scale: 0.85 }}
                            >
                              <Trash2 size={13} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Clear cart */}
            <button
              onClick={clearCart}
              className="text-xs text-[#F5EFE6]/20 hover:text-red-400 transition-colors mb-8"
            >
              Clear all items
            </button>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-2xl p-6"
            >
              <h2 className="font-display text-lg font-semibold text-[#F5EFE6] mb-5">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-[#F5EFE6]/45">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>RM {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#F5EFE6]/45">
                  <span className="flex items-center gap-1.5"><Tag size={11} /> SST (6%)</span>
                  <span>RM {sst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[rgba(212,180,131,0.08)]">
                  <span className="font-semibold text-[#F5EFE6]">Total</span>
                  <span className="font-display text-xl font-bold text-[#D4B483]">RM {total.toFixed(2)}</span>
                </div>
              </div>

              <motion.button
                onClick={() => router.push("/checkout")}
                className="w-full mt-5 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all"
                style={{ boxShadow: "0 0 24px rgba(212,180,131,0.2)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </motion.button>

              <p className="text-center text-[#F5EFE6]/20 text-xs mt-3">
                Free pickup · Earn points on every order
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
