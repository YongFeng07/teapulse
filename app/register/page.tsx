"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
          phone: form.phone.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h2 className="font-display text-2xl font-bold text-[#F5EFE6]">Account created!</h2>
          <p className="text-[#F5EFE6]/40 text-sm mt-2">Redirecting to sign in…</p>
        </motion.div>
      </div>
    );
  }

  const fields = [
    { key: "name",  label: "Full Name",  type: "text",     placeholder: "Your name",         required: true,  autoComplete: "name" },
    { key: "email", label: "Email",       type: "email",    placeholder: "you@example.com",   required: true,  autoComplete: "email" },
    { key: "phone", label: "Phone",       type: "tel",      placeholder: "+60 12-xxx xxxx",   required: false, autoComplete: "tel" },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center px-5 pt-28 pb-20">
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
          <h1 className="font-display text-3xl font-bold text-[#F5EFE6] text-center mb-1">Join Tea Pulse</h1>
          <p className="text-[#F5EFE6]/35 text-sm text-center mb-7">Create your account and start earning rewards</p>

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
            {fields.map(({ key, label, type, placeholder, required, autoComplete }) => (
              <div key={key}>
                <label className="text-[#F5EFE6]/40 text-xs font-semibold uppercase tracking-wider block mb-2">
                  {label} {!required && <span className="text-[#F5EFE6]/20 normal-case font-normal">(optional)</span>}
                </label>
                <input
                  type={type}
                  value={form[key as keyof typeof form]}
                  onChange={update(key)}
                  required={required}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  className="w-full bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] rounded-xl px-4 py-3 text-[#F5EFE6] placeholder-[#F5EFE6]/18 text-sm outline-none transition-all"
                />
              </div>
            ))}

            <div>
              <label className="text-[#F5EFE6]/40 text-xs font-semibold uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
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
              {loading ? "Creating Account..." : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#F5EFE6]/28 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#D4B483] hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
