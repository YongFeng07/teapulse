"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-5 pt-28 pb-20">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, #D4B483, transparent)", filter: "blur(80px)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 rounded-full border border-[#D4B483] opacity-60" />
            <div className="absolute inset-[3px] rounded-full bg-[#D4B483] opacity-80" />
            <div className="absolute inset-[6px] rounded-full bg-[#0E0E0E]" />
          </div>
          <span className="font-display text-xl font-semibold text-[#F5EFE6]">
            TEA <span className="text-[#D4B483]">PULSE</span>
          </span>
        </Link>

        <div className="bg-[#161616] rounded-3xl border border-[rgba(212,180,131,0.12)] p-8">
          <h1 className="font-display text-3xl font-bold text-[#F5EFE6] text-center mb-1">Welcome back</h1>
          <p className="text-[#F5EFE6]/35 text-sm text-center mb-7">Sign in to your Tea Pulse account</p>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-5 flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#F5EFE6]/40 text-xs font-semibold uppercase tracking-wider block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] rounded-xl px-4 py-3 text-[#F5EFE6] placeholder-[#F5EFE6]/18 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[#F5EFE6]/40 text-xs font-semibold uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] rounded-xl px-4 py-3 pr-11 text-[#F5EFE6] placeholder-[#F5EFE6]/18 text-sm outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/28 hover:text-[#D4B483] transition-colors"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading && <span className="w-4 h-4 border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E] rounded-full animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>

          {/* Forgot password */}
          <div className="text-center mt-3">
            <Link href="/forgot-password" className="text-xs text-[#F5EFE6]/30 hover:text-[#D4B483] transition-colors">
              Forgot your password?
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-5 p-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.09)]">
            <p className="text-[11px] text-[#F5EFE6]/35 text-center">
              Demo: <button onClick={() => { setEmail("demo@teapulse.com"); setPassword("password123"); }} className="text-[#D4B483] hover:underline">click to fill</button>
            </p>
          </div>

          <p className="text-center text-sm text-[#F5EFE6]/28 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#D4B483] hover:underline font-medium">
              Join Tea Pulse
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
