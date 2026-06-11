"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Flame, CalendarCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CheckinStatus {
  checkedIn: boolean;
  streak: number;
  nextStreak: number;
  points: number;
}

export function DailyCheckinCard() {
  const { toast } = useToast();
  const [status, setStatus] = useState<CheckinStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/checkin/status");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCheckin = async () => {
    setClaiming(true);
    try {
      const res = await fetch("/api/checkin", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setStatus({
          checkedIn: !data.already,
          streak: data.streak,
          nextStreak: data.streak,
          points: data.points,
        });
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 2500);

        if (data.already) {
          toast({ title: "Already checked in today! Come back tomorrow 🌅", variant: "default" });
        } else if (data.isStreakBonus) {
          toast({
            title: `🔥 ${data.streak}-Day Streak! +${data.points} pts`,
            description: "You earned a streak bonus!",
            variant: "success",
          });
        } else {
          toast({
            title: `Checked in! +${data.points} pts`,
            description: `Day ${data.streak} streak`,
            variant: "success",
          });
        }
        // Refresh session to update points in navbar
        await fetch("/api/user/profile").then(r => r.json()).catch(() => {});
      } else {
        toast({ title: "Failed to check in", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setClaiming(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 animate-pulse">
        <div className="h-4 w-24 bg-[rgba(255,255,255,0.05)] rounded mb-3" />
        <div className="h-8 w-48 bg-[rgba(255,255,255,0.05)] rounded" />
      </div>
    );
  }

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currentDay = new Date().getDay();
  const adjustedDay = currentDay === 0 ? 6 : currentDay - 1; // Mon=0, Sun=6

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.1)] p-5"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, #D4B483, transparent 70%)", filter: "blur(30px)" }} />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[rgba(212,180,131,0.12)] flex items-center justify-center">
              <CalendarCheck size={16} className="text-[#D4B483]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#F5EFE6] text-sm">Daily Check-in</h3>
              <p className="text-[#F5EFE6]/35 text-xs">Earn points every day!</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame size={14} className={status?.streak && status.streak >= 7 ? "text-[#F97316]" : "text-[#F5EFE6]/20"} />
            <span className={`text-xs font-bold ${status?.streak && status.streak >= 7 ? "text-[#F97316]" : "text-[#F5EFE6]/40"}`}>
              {status?.streak ?? 0} day{status?.streak !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Weekday progress dots */}
        <div className="flex items-center gap-2 mb-4">
          {dayLabels.map((day, i) => {
            const isPast = i < adjustedDay;
            const isToday = i === adjustedDay;
            const isCheckedToday = isToday && status?.checkedIn;
            const isStreakDay = status?.streak && i < (status.streak % 7);

            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCheckedToday
                      ? "bg-[#D4B483] text-[#0E0E0E]"
                      : isPast && isStreakDay
                      ? "bg-[rgba(212,180,131,0.2)] text-[#D4B483] border border-[rgba(212,180,131,0.3)]"
                      : isToday
                      ? "border-2 border-[#D4B483] text-[#D4B483]"
                      : "bg-[rgba(255,255,255,0.04)] text-[#F5EFE6]/25"
                  }`}
                >
                  {isCheckedToday ? <Check size={12} strokeWidth={3} /> : day[0]}
                </div>
                <span className="text-[9px] text-[#F5EFE6]/25">{day}</span>
              </div>
            );
          })}
        </div>

        {/* Check-in button */}
        <motion.button
          onClick={handleCheckin}
          disabled={claiming || status?.checkedIn}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            status?.checkedIn
              ? "bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.2)] text-[#10B981] cursor-default"
              : "bg-[#D4B483] text-[#0E0E0E] hover:bg-[#E8D5B0] shadow-[0_0_24px_rgba(212,180,131,0.15)]"
          } disabled:opacity-50`}
          whileHover={status?.checkedIn ? {} : { scale: 1.02 }}
          whileTap={status?.checkedIn ? {} : { scale: 0.98 }}
        >
          {status?.checkedIn ? (
            <span className="flex items-center justify-center gap-2">
              <Check size={15} /> Checked In Today — Come back tomorrow!
            </span>
          ) : claiming ? (
            "Claiming..."
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles size={15} /> Check In — +{status?.streak && status.streak + 1 >= 7 ? 25 : 5} pts today
            </span>
          )}
        </motion.button>
      </div>

      {/* Claim animation */}
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-lg"
                initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                animate={{
                  y: -80 - Math.random() * 60,
                  x: (Math.random() - 0.5) * 120,
                  opacity: 0,
                  scale: 0.3,
                }}
                transition={{ duration: 1.2, delay: i * 0.08 }}
              >
                {i < 4 ? "✨" : "🪙"}
              </motion.div>
            ))}
            <motion.div
              className="text-6xl"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.3, 1], rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              ✅
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
