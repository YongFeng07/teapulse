"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Save, User, Phone, Mail, Star, Camera, Calendar,
  Package, MessageSquare, Award, ChevronRight, Edit3,
  Shield, Clock, Gift, MapPin
} from "lucide-react";
import Link from "next/link";
import { LoadingSpinner } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";

const TIER_CONFIG: Record<string, { color: string; bg: string; icon: string; perks: string[] }> = {
  Bronze: {
    color: "#CD7F32", bg: "rgba(205,127,50,0.12)", icon: "🥉",
    perks: ["1 pt per RM 1 spent", "Birthday reward", "Member-only deals"],
  },
  Silver: {
    color: "#94A3B8", bg: "rgba(148,163,184,0.12)", icon: "🥈",
    perks: ["1.25x points multiplier", "Priority support", "Exclusive Silver menu items"],
  },
  Gold: {
    color: "#D4B483", bg: "rgba(212,180,131,0.12)", icon: "🥇",
    perks: ["1.5x points multiplier", "Free upgrade on every 5th order", "Early access to new drinks"],
  },
  VIP: {
    color: "#C084FC", bg: "rgba(192,132,252,0.12)", icon: "👑",
    perks: ["2x points on all orders", "Monthly free drink", "Personal order concierge", "Exclusive VIP events"],
  },
};

const AVATAR_OPTIONS = [
  "🧋", "🍵", "☕", "🌸", "⭐", "🌿", "🍃", "🎋",
  "🦋", "✨", "🌙", "🔮", "💎", "🌺", "🍀", "🎯",
];

interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  avatar: string;
  birthday: string;
  tier: string;
  tierProgress: number;
  nextTier: string | null;
  pointsToNextTier: number | null;
  totalOrders: number;
  totalReviews: number;
  createdAt: string;
}

function AvatarPicker({ current, onSelect }: { current: string; onSelect: (v: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-[rgba(212,180,131,0.18)] rounded-2xl p-3 z-50 shadow-2xl"
      style={{ width: 220 }}
    >
      <p className="text-[#F5EFE6]/40 text-[10px] font-semibold uppercase tracking-wider mb-2 text-center">Choose Avatar</p>
      <div className="grid grid-cols-8 gap-1">
        {AVATAR_OPTIONS.map((emoji) => (
          <motion.button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className={`text-xl p-1.5 rounded-xl transition-all hover:bg-[rgba(212,180,131,0.1)] ${current === emoji ? "bg-[rgba(212,180,131,0.15)] ring-1 ring-[#D4B483]/40" : ""}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            {emoji}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}


function ChangePasswordSection({ toast }: { toast: any }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (newPw !== confirm) { toast({ title: "Passwords don\'t match", variant: "destructive" }); return; }
    if (newPw.length < 6) { toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOpen(false); setCurrent(""); setNewPw(""); setConfirm("");
      toast({ title: "Password changed!", variant: "success" });
    } catch (err) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.08)] overflow-hidden"
    >
      <div className="flex items-center justify-between p-5">
        <div>
          <p className="font-semibold text-[#F5EFE6] text-sm">Security</p>
          <p className="text-[#F5EFE6]/30 text-xs mt-0.5">Manage your password</p>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs text-[#D4B483] border border-[rgba(212,180,131,0.2)] px-3 py-1.5 rounded-lg hover:bg-[rgba(212,180,131,0.08)] transition-all"
        >
          {open ? "Cancel" : "Change Password"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[rgba(212,180,131,0.08)]"
          >
            <div className="p-5 space-y-3">
              {[
                { label: "Current Password", val: current, set: setCurrent },
                { label: "New Password", val: newPw, set: setNewPw },
                { label: "Confirm New Password", val: confirm, set: setConfirm },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-1.5">{label}</label>
                  <input
                    type="password"
                    value={val}
                    onChange={e => set(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
                  />
                </div>
              ))}
              <motion.button
                onClick={handleSubmit}
                disabled={saving || !current || !newPw || !confirm}
                className="w-full py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold text-sm disabled:opacity-40 hover:bg-[#E8D5B0] transition-all"
                whileHover={{ scale: 1.02 }}
              >
                {saving ? "Changing..." : "Update Password"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("🧋");
  const [birthday, setBirthday] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then(r => r.json())
      .then((data) => {
        setProfile(data);
        setName(data.name || "");
        setPhone(data.phone || "");
        setAvatar(data.avatar || "🧋");
        setBirthday(data.birthday || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone: phone || undefined, avatar, birthday: birthday || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setProfile(prev => prev ? { ...prev, name: data.name, phone: data.phone, avatar: data.avatar, birthday: data.birthday } : prev);
      await update();
      setEditing(false);
      toast({ title: "Profile updated! ✨", variant: "success" });
    } catch (err) {
      toast({ title: "Update failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  if (!profile) return null;

  const tierCfg = TIER_CONFIG[profile.tier] ?? TIER_CONFIG.Bronze;
  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-MY", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[680px] mx-auto px-5 md:px-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">My Account</p>
            <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Profile</h1>
          </div>
          <motion.button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              editing
                ? "bg-[rgba(212,180,131,0.1)] border-[rgba(212,180,131,0.3)] text-[#D4B483]"
                : "bg-[#161616] border-[rgba(212,180,131,0.12)] text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)]"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            <Edit3 size={14} /> {editing ? "Cancel" : "Edit Profile"}
          </motion.button>
        </motion.div>

        {/* Avatar + Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden bg-[#161616] rounded-3xl border p-6 mb-5"
          style={{ borderColor: `${tierCfg.color}25` }}
        >
          {/* Ambient glow */}
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full pointer-events-none opacity-20"
            style={{ background: `radial-gradient(circle, ${tierCfg.color}, transparent 70%)`, filter: "blur(40px)" }} />

          <div className="relative flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl cursor-pointer border-2 transition-all"
                style={{ background: tierCfg.bg, borderColor: editing ? tierCfg.color : "transparent" }}
                onClick={() => editing && setShowAvatarPicker(!showAvatarPicker)}
              >
                {avatar}
              </div>
              {editing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#D4B483] flex items-center justify-center cursor-pointer"
                  onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                >
                  <Camera size={12} className="text-[#0E0E0E]" />
                </motion.div>
              )}
              <AnimatePresence>
                {showAvatarPicker && editing && (
                  <AvatarPicker current={avatar} onSelect={(v) => { setAvatar(v); setShowAvatarPicker(false); }} />
                )}
              </AnimatePresence>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-2xl font-bold text-[#F5EFE6] truncate">{profile.name}</h2>
                <span className="text-base">{tierCfg.icon}</span>
              </div>
              <p className="text-[#F5EFE6]/40 text-sm truncate">{profile.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <Shield size={12} style={{ color: tierCfg.color }} />
                  <span className="text-xs font-semibold" style={{ color: tierCfg.color }}>{profile.tier} Member</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#F5EFE6]/30">
                  <Clock size={12} />
                  <span className="text-xs">Since {memberSince}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-[rgba(212,180,131,0.08)]">
            {[
              { icon: Package, label: "Orders", value: profile.totalOrders, href: "/dashboard/orders" },
              { icon: Star, label: "Points", value: profile.points.toLocaleString(), href: "/rewards" },
              { icon: MessageSquare, label: "Reviews", value: profile.totalReviews, href: "/menu" },
            ].map(({ icon: Icon, label, value, href }) => (
              <Link key={label} href={href}>
                <motion.div
                  className="text-center p-3 rounded-xl hover:bg-[rgba(212,180,131,0.06)] transition-all cursor-pointer group"
                  whileHover={{ scale: 1.03 }}
                >
                  <Icon size={16} className="mx-auto mb-1 text-[#D4B483]/60 group-hover:text-[#D4B483] transition-colors" />
                  <p className="font-display font-bold text-[#F5EFE6] text-lg">{value}</p>
                  <p className="text-[#F5EFE6]/30 text-[10px] uppercase tracking-wider">{label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Tier card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.1)] p-5 mb-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#F5EFE6] text-sm">Membership Status</h3>
            <Link href="/rewards" className="flex items-center gap-1 text-xs text-[#D4B483] hover:underline">
              View Rewards <ChevronRight size={11} />
            </Link>
          </div>

          {/* Progress */}
          {profile.nextTier && profile.pointsToNextTier !== null && (
            <div className="mb-4">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-semibold" style={{ color: tierCfg.color }}>{profile.tier}</span>
                <span className="text-xs text-[#F5EFE6]/30">{profile.pointsToNextTier} pts to {profile.nextTier}</span>
              </div>
              <div className="h-2 rounded-full bg-[rgba(255,255,255,0.05)] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: `linear-gradient(90deg, ${tierCfg.color}, ${tierCfg.color}80)` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, profile.tierProgress)}%` }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Perks */}
          <div className="space-y-1.5">
            {tierCfg.perks.map((perk) => (
              <div key={perk} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: tierCfg.color }} />
                <span className="text-[#F5EFE6]/45 text-xs">{perk}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edit form */}
        <AnimatePresence>
          {editing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.15)] p-6 mb-5">
                <h3 className="font-display text-lg font-semibold text-[#F5EFE6] mb-5">Edit Information</h3>
                <div className="space-y-4">
                  {/* Email (readonly) */}
                  <div>
                    <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Email Address</label>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[rgba(212,180,131,0.03)] border border-[rgba(212,180,131,0.08)]">
                      <Mail size={14} className="text-[#F5EFE6]/20" />
                      <span className="text-[#F5EFE6]/35 text-sm">{profile.email}</span>
                      <span className="ml-auto text-[10px] text-[#F5EFE6]/20">Cannot be changed</span>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Full Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+60 12-xxx xxxx"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Birthday */}
                  <div>
                    <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">
                      Birthday <span className="text-[#D4B483] normal-case font-normal">🎂 Get a free drink on your birthday!</span>
                    </label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
                      <input
                        type="date"
                        value={birthday}
                        onChange={e => setBirthday(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] text-sm outline-none transition-all [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  {/* Save button */}
                  <motion.button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all disabled:opacity-50"
                    style={{ boxShadow: "0 0 24px rgba(212,180,131,0.2)" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {saving ? (
                      <><span className="w-4 h-4 border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E] rounded-full animate-spin" /> Saving...</>
                    ) : (
                      <><Save size={15} /> Save Changes</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.08)] overflow-hidden"
        >
          {[
            { icon: Package, label: "Order History", desc: `${profile.totalOrders} orders placed`, href: "/dashboard/orders", color: "#D4B483" },
            { icon: MapPin, label: "Saved Addresses", desc: "Manage your delivery addresses", href: "/dashboard/profile/addresses", color: "#60A5FA" },
            { icon: Gift, label: "Rewards & Points", desc: `${profile.points.toLocaleString()} points available`, href: "/rewards", color: "#A78BFA" },
            { icon: Award, label: "Membership Tier", desc: `${profile.tier} — ${profile.pointsToNextTier ? `${profile.pointsToNextTier} pts to ${profile.nextTier}` : "Highest tier!"}`, href: "/rewards", color: "#D4B483" },
            { icon: Star, label: "Points History", desc: "View all transactions", href: "/dashboard/points", color: "#4ADE80" },
            { icon: Gift, label: "Refer Friends", desc: "Earn 50 bonus points per friend", href: "/dashboard/profile/referral", color: "#F97316" },
          ].map(({ icon: Icon, label, desc, href, color }, i) => (
            <Link key={href + label} href={href}>
              <motion.div
                className={`flex items-center gap-4 px-5 py-4 hover:bg-[rgba(212,180,131,0.04)] transition-all group cursor-pointer ${i > 0 ? "border-t border-[rgba(212,180,131,0.07)]" : ""}`}
                whileHover={{ x: 2 }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-[#F5EFE6] text-sm">{label}</p>
                  <p className="text-[#F5EFE6]/30 text-xs mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={14} className="text-[#F5EFE6]/20 group-hover:text-[#D4B483] transition-colors" />
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Security */}
        <ChangePasswordSection toast={toast} />
      </div>
    </div>
  );
}
