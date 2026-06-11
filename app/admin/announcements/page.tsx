"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Megaphone, X, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Announcement {
  id: string; title: string; body: string; emoji: string;
  isActive: boolean; expiresAt: string | null; createdAt: string;
}

export default function AdminAnnouncementsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", emoji: "📢", expiresAt: "" });

  useEffect(() => {
    fetch("/api/announcements")
      .then(r => r.json())
      .then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!form.title || !form.body) { toast({ title: "Fill in title and message", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, expiresAt: form.expiresAt || null }),
      });
      const data = await res.json();
      setItems(prev => [data, ...prev]);
      setShowForm(false);
      setForm({ title: "", body: "", emoji: "📢", expiresAt: "" });
      toast({ title: "Announcement published!", variant: "success" });
    } catch { toast({ title: "Failed", variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all";

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[900px] mx-auto px-6 md:px-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">Admin</p>
            <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Announcements</h1>
            <p className="text-[#F5EFE6]/30 text-sm mt-1">Publish banners to your homepage</p>
          </div>
          <motion.button onClick={() => setShowForm(true)} className="mt-2 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold text-sm hover:bg-[#E8D5B0] transition-all" whileHover={{ scale: 1.04 }}>
            <Plus size={16} /> New Announcement
          </motion.button>
        </div>

        {/* Form modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-[#0E0E0E]/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={e => e.target === e.currentTarget && setShowForm(false)}>
              <motion.div initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94 }}
                className="bg-[#161616] rounded-3xl border border-[rgba(212,180,131,0.18)] p-7 w-full max-w-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl font-bold text-[#F5EFE6]">New Announcement</h2>
                  <button onClick={() => setShowForm(false)} className="text-[#F5EFE6]/40 hover:text-[#F5EFE6]"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-20">
                      <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">Emoji</label>
                      <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} className={inputClass + " text-center text-2xl"} maxLength={2} />
                    </div>
                    <div className="flex-1">
                      <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">Title</label>
                      <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New seasonal drink!" className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">Message</label>
                    <textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={3} placeholder="Tell your customers what's happening..." className={inputClass + " resize-none"} />
                  </div>
                  <div>
                    <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">Expires At (optional)</label>
                    <input type="datetime-local" value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} className={inputClass + " [color-scheme:dark]"} />
                  </div>
                  <motion.button onClick={handleSave} disabled={saving}
                    className="w-full py-3.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}>
                    {saving ? "Publishing..." : <><Save size={15} /> Publish</>}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* List */}
        {loading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse bg-[rgba(212,180,131,0.04)]" />)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <Megaphone size={36} className="mx-auto text-[#F5EFE6]/10 mb-4" />
            <p className="text-[#F5EFE6]/25">No announcements yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 flex items-start gap-4">
                <div className="text-2xl shrink-0 mt-0.5">{item.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#F5EFE6]">{item.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${item.isActive ? "bg-green-500/15 text-green-400" : "bg-[rgba(212,180,131,0.08)] text-[#F5EFE6]/30"}`}>
                      {item.isActive ? "Live" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-[#F5EFE6]/45 text-sm">{item.body}</p>
                  <p className="text-[#F5EFE6]/20 text-xs mt-2">
                    Published {new Date(item.createdAt).toLocaleDateString()}
                    {item.expiresAt && ` · Expires ${new Date(item.expiresAt).toLocaleDateString()}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
