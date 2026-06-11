"use client";

import { motion } from "framer-motion";
import { Clock, Coffee, CheckCircle, Package } from "lucide-react";

const STEPS = [
  { status: "PENDING",   label: "Received",  icon: Clock },
  { status: "PREPARING", label: "Preparing", icon: Coffee },
  { status: "READY",     label: "Ready",     icon: Package },
  { status: "COMPLETED", label: "Done",      icon: CheckCircle },
];

const ORDER = ["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

interface Props { status: string; }

export function OrderStatusTracker({ status }: Props) {
  if (status === "CANCELLED") {
    return (
      <div className="glass rounded-2xl border border-red-500/20 p-4 text-center">
        <p className="text-red-400 font-semibold">Order Cancelled</p>
      </div>
    );
  }

  const currentIndex = ORDER.indexOf(status);
  const progressPct = (Math.min(currentIndex, STEPS.length - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="glass rounded-2xl border border-[rgba(212,180,131,0.12)] p-6">
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-5 left-5 right-5 h-px bg-[rgba(212,180,131,0.1)]" />
        {/* Progress line */}
        <motion.div
          className="absolute top-5 left-5 h-px bg-[#D4B483]"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ maxWidth: "calc(100% - 2.5rem)" }}
        />

        <div className="flex items-start justify-between relative z-10">
          {STEPS.map((step, i) => {
            const isActive = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const Icon = step.icon;
            return (
              <div key={step.status} className="flex flex-col items-center gap-2">
                <motion.div
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500"
                  style={{
                    borderColor: isActive ? "#D4B483" : "rgba(212,180,131,0.15)",
                    background: isActive ? "rgba(212,180,131,0.12)" : "#0E0E0E",
                  }}
                  animate={isCurrent ? { boxShadow: ["0 0 0 0 rgba(212,180,131,0)", "0 0 0 8px rgba(212,180,131,0.1)", "0 0 0 0 rgba(212,180,131,0)"] } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon size={16} style={{ color: isActive ? "#D4B483" : "rgba(245,239,230,0.2)" }} />
                </motion.div>
                <span className="text-xs font-medium" style={{ color: isActive ? "#D4B483" : "rgba(245,239,230,0.25)" }}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
