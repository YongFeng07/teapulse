'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gift, Zap, Star, CheckCircle } from 'lucide-react';

const perks = [
  { icon: Gift, label: 'Welcome Gift', desc: 'Free drink voucher on sign-up' },
  { icon: Zap, label: 'Early Access', desc: 'First to try new seasonal flavours' },
  { icon: Star, label: 'Bonus Points', desc: '100 points just for joining' },
];

export default function Newsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter" className="relative py-32 bg-[#0E0E0E] overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(212,180,131,0.05) 0%, transparent 60%)' }} />

      <div className="max-w-[900px] mx-auto px-6 md:px-12 text-center" ref={ref}>
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="text-[#D4B483] text-[10px] font-semibold uppercase tracking-widest mb-5"
        >
          Join The Inner Circle
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl font-bold text-[#F5EFE6] leading-tight mb-6"
        >
          Be the first to know.
          <br />
          <span className="italic" style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #D4B483, #E8D5B0)', backgroundClip: 'text' }}>
            Taste the future.
          </span>
        </motion.h2>

        {/* Perks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10"
        >
          {perks.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[rgba(212,180,131,0.1)] flex items-center justify-center shrink-0">
                <Icon size={14} className="text-[#D4B483]" />
              </div>
              <div className="text-left">
                <p className="text-[#F5EFE6] text-xs font-semibold">{label}</p>
                <p className="text-[#F5EFE6]/35 text-[10px]">{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/25 flex items-center justify-center">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <p className="font-display text-2xl font-bold text-[#F5EFE6]">You're on the list!</p>
              <p className="text-[#F5EFE6]/40 text-sm">Check your inbox for your welcome gift 🎁</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              onSubmit={handleSubmit}
              className="max-w-md mx-auto space-y-3"
            >
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your first name (optional)"
                className="w-full px-5 py-3.5 rounded-2xl bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/25 text-sm outline-none transition-all text-center"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/25 text-sm outline-none transition-all"
                />
                <motion.button
                  type="submit"
                  disabled={loading || !email}
                  className="px-5 py-3.5 rounded-2xl bg-[#D4B483] text-[#0E0E0E] font-semibold flex items-center gap-2 hover:bg-[#E8D5B0] transition-all disabled:opacity-50 shrink-0"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ boxShadow: '0 0 24px rgba(212,180,131,0.2)' }}
                >
                  {loading ? <span className="w-4 h-4 rounded-full border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E] animate-spin" /> : <ArrowRight size={16} />}
                </motion.button>
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <p className="text-[#F5EFE6]/20 text-xs">No spam. Unsubscribe anytime. We respect your privacy.</p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
