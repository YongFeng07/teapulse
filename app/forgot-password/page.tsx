"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setSent(true);
        toast({ title: "Reset link sent!", variant: "success" });
      } else {
        toast({ title: data.error || "Failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[420px] w-full"
      >
        {/* Back link */}
        <Link href="/login" className="inline-flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm mb-8">
          <ArrowLeft size={14} /> Back to Sign In
        </Link>

        <div className="bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-3xl p-8">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)] flex items-center justify-center">
                <CheckCircle size={28} className="text-[#10B981]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#F5EFE6] mb-2">Check Your Email</h2>
              <p className="text-[#F5EFE6]/40 text-sm mb-6">
                If an account with {email} exists, we&apos;ve sent a reset link. Check your inbox.
              </p>
              <Link href="/login" className="text-[#D4B483] text-sm hover:underline">
                Return to Sign In
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] flex items-center justify-center">
                  <Mail size={22} className="text-[#D4B483]" />
                </div>
                <h1 className="font-display text-2xl font-bold text-[#F5EFE6] mb-1">Forgot Password?</h1>
                <p className="text-[#F5EFE6]/40 text-sm">Enter your email and we&apos;ll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full py-3.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all disabled:opacity-50"
                  style={{ boxShadow: "0 0 24px rgba(212,180,131,0.15)" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
