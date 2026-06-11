"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { orderToCartItems } from "@/lib/reorder";
import type { OrderWithDetails } from "@/types";

interface ReorderButtonProps {
  orderId: string;
  order?: OrderWithDetails; // If already loaded (detail page), pass directly
  variant?: "icon" | "button";
}

export function ReorderButton({ orderId, order, variant = "button" }: ReorderButtonProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleReorder = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      let orderData = order;
      if (!orderData) {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order");
        orderData = await res.json();
      }

      const items = orderToCartItems(orderData as OrderWithDetails);
      for (const item of items) {
        addItem(item);
      }

      toast({
        title: `🛒 ${items.length} item${items.length > 1 ? "s" : ""} added to cart!`,
        description: "Go to cart to checkout",
        variant: "success",
      });

      // Optionally navigate to cart
      router.push("/cart");
    } catch {
      toast({ title: "Failed to reorder", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <motion.button
        onClick={handleReorder}
        disabled={loading}
        className="p-2 rounded-xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] text-[#D4B483] hover:bg-[rgba(212,180,131,0.15)] transition-all disabled:opacity-50"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title="Reorder"
      >
        <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleReorder}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.18)] text-[#D4B483] text-xs font-semibold hover:bg-[rgba(212,180,131,0.15)] transition-all disabled:opacity-50"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {loading ? (
        <RefreshCw size={13} className="animate-spin" />
      ) : (
        <ShoppingBag size={13} />
      )}
      Reorder
    </motion.button>
  );
}
