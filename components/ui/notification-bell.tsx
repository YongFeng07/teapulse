"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check } from "lucide-react";
import Link from "next/link";

interface NotifItem { id: string; type: string; title: string; body: string; link?: string; isRead: boolean; createdAt: string; }

export function NotificationBell() {
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotifItem[]>([]);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnread(data.count);
      }
    } catch {}
  };

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/notifications?limit=5");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items || []);
      }
    } catch {}
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) fetchItems();
  };

  const handleMarkAll = async () => {
    await fetch("/api/notifications", { method: "PATCH" });
    setUnread(0);
    setItems(items.map(i => ({ ...i, isRead: true })));
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleOpen}
        className="relative p-2 text-[#F5EFE6]/60 hover:text-[#D4B483] transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bell size={18} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center"
            >
              {unread > 9 ? "9+" : unread}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40" onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#1A1A1A] border border-[rgba(212,180,131,0.13)] rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(212,180,131,0.08)]">
                <p className="text-xs font-semibold text-[#F5EFE6]">Notifications</p>
                {unread > 0 && (
                  <button onClick={handleMarkAll} className="text-[10px] text-[#D4B483] hover:underline flex items-center gap-1">
                    <Check size={10} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-center text-[#F5EFE6]/25 text-xs py-8">No notifications yet</p>
                ) : items.map(n => (
                  <div key={n.id} className={`px-4 py-3 border-b border-[rgba(212,180,131,0.04)] ${!n.isRead ? "bg-[rgba(212,180,131,0.03)]" : ""}`}>
                    <div className="flex items-start gap-2">
                      {!n.isRead && <div className="w-1.5 h-1.5 rounded-full bg-[#D4B483] mt-1.5 shrink-0" />}
                      <div>
                        <p className="text-xs font-medium text-[#F5EFE6]">{n.title}</p>
                        <p className="text-xs text-[#F5EFE6]/40 mt-0.5">{n.body}</p>
                        <p className="text-[10px] text-[#F5EFE6]/20 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
