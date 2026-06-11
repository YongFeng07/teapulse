"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, Link as LinkIcon, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title: string;
  url?: string;
  variant?: "icon" | "button";
}

const WHATSAPP = "601131780587";

export function ShareButton({ title, url, variant = "icon" }: ShareButtonProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", variant: "success" });
    setOpen(false);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${shareUrl}`)}`, "_blank");
    setOpen(false);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ title, url: shareUrl }).catch(() => {});
    } else {
      handleCopy();
    }
    setOpen(false);
  };

  const btnClass = variant === "button"
    ? "flex items-center gap-2 px-4 py-2 rounded-xl border border-[rgba(212,180,131,0.15)] text-[#F5EFE6]/60 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)] transition-all text-xs font-medium"
    : "p-2 rounded-xl text-[#F5EFE6]/40 hover:text-[#D4B483] hover:bg-[rgba(212,180,131,0.06)] transition-all";

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={() => setOpen(!open)}
        className={btnClass}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        title="Share"
      >
        <Share2 size={variant === "button" ? 14 : 16} />
        {variant === "button" && "Share"}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            className="absolute right-0 top-full mt-2 w-36 bg-[#1A1A1A] border border-[rgba(212,180,131,0.13)] rounded-xl overflow-hidden shadow-2xl z-50"
          >
            <button onClick={handleNativeShare} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#F5EFE6]/60 hover:text-[#D4B483] hover:bg-[rgba(212,180,131,0.05)] transition-all">
              <Share2 size={12} /> Share
            </button>
            <button onClick={handleCopy} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-[#F5EFE6]/60 hover:text-[#D4B483] hover:bg-[rgba(212,180,131,0.05)] transition-all">
              <Copy size={12} /> Copy Link
            </button>
            <button onClick={handleWhatsApp} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-green-400/70 hover:text-green-400 hover:bg-green-500/05 transition-all">
              <MessageCircle size={12} /> WhatsApp
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
