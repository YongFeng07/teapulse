"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.2)] flex items-center justify-center">
          <AlertTriangle size={28} className="text-[#EF4444]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#F5EFE6] mb-2">Invalid Link</h2>
        <p className="text-[#F5EFE6]/40 text-sm mb-6">This reset link is missing or invalid.</p>
        <Link href="/forgot-password" className="text-[#D4B483] text-sm hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        toast({ title: "Password reset! 🎉", variant: "success" });
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast({ title: data.error || "Failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center">
          <CheckCircle size={28} className="text-[#10B981]" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#F5EFE6] mb-2">Password Reset!</h2>
        <p className="text-[#F5EFE6]/40 text-sm">Redirecting to sign in...</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] flex items-center justify-center">
          <Lock size={22} className="text-[#D4B483]" />
        </div>
        <h1 className="font-display text-2xl font-bold text-[#F5EFE6] mb-1">Set New Password</h1>
        <p className="text-[#F5EFE6]/40 text-sm">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="Re-enter your password"
            required
            className="w-full px-4 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading || !password || !confirm}
          className="w-full py-3.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all disabled:opacity-50"
          style={{ boxShadow: "0 0 24px rgba(212,180,131,0.15)" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </motion.button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full"
      >
        <Link href="/login" className="inline-flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm mb-8">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>
        <div className="bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-3xl p-8">
          <Suspense fallback={<div className="text-center text-[#F5EFE6]/40">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </motion.div>
    </div>
  );
}
