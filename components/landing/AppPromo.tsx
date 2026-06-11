'use client';

import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Smartphone, Gift, Zap, Star } from 'lucide-react';

const appFeatures = [
  { icon: Zap, label: 'Order in 30 seconds', desc: 'Skip the queue, not the quality' },
  { icon: Gift, label: 'Earn Pulse Points', desc: 'Loyalty rewards on every order' },
  { icon: Star, label: 'Exclusive Drops', desc: 'First access to seasonal flavours' },
  { icon: Smartphone, label: 'Track in Real-Time', desc: 'Live updates from cup to door' },
];

const appScreens = [
  {
    bg: 'from-[#1A1200] to-[#0E0E0E]',
    title: 'Your Orders',
    items: ['Brown Sugar Boba x2', 'Matcha Velvet Latte', 'Taro Silk Milk'],
  },
  {
    bg: 'from-[#0D2010] to-[#0E0E0E]',
    title: 'Pulse Points',
    value: '1,240 pts',
  },
];

export default function AppPromo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const phoneY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <section className="relative py-32 bg-[#080808] overflow-hidden" id="app">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 50%, rgba(212,180,131,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12" ref={ref}>
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Phone mockup side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center"
          >
            <motion.div style={{ y: phoneY }} className="relative">
              {/* Glow */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  scale: glowScale,
                  background: 'radial-gradient(circle, rgba(212,180,131,0.25) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Phone frame */}
              <div
                className="relative w-[280px] md:w-[320px] mx-auto rounded-[40px] overflow-hidden border-[6px] shadow-2xl"
                style={{
                  borderColor: '#2A2A2A',
                  background: '#0E0E0E',
                  boxShadow: '0 40px 100px rgba(0,0,0,0.8), 0 0 60px rgba(212,180,131,0.1)',
                }}
              >
                {/* Status bar */}
                <div className="bg-[#0E0E0E] px-6 pt-3 pb-2 flex justify-between items-center">
                  <span className="text-[10px] text-[#F5EFE6]/60 font-medium">9:41</span>
                  <div className="w-20 h-5 rounded-full bg-[#1A1A1A]" />
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-2.5 rounded-sm border border-[#F5EFE6]/40" />
                  </div>
                </div>

                {/* App header */}
                <div className="px-5 py-4 bg-[#0E0E0E]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="label-sm text-[#D4B483]">Good morning,</p>
                      <p className="font-display text-lg font-semibold text-[#F5EFE6]">Ariana</p>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-[#D4B483]/20 flex items-center justify-center">
                      <span className="text-[#D4B483] text-xs font-bold">A</span>
                    </div>
                  </div>

                  {/* Points card */}
                  <div
                    className="rounded-2xl p-4 mb-4"
                    style={{
                      background: 'linear-gradient(135deg, #2A1A00, #1A1200)',
                      border: '1px solid rgba(212,180,131,0.2)',
                    }}
                  >
                    <p className="label-sm text-[#D4B483]/70 mb-1">Pulse Points</p>
                    <p className="font-display text-3xl font-bold text-[#D4B483]">1,240</p>
                    <div className="mt-2 h-1.5 rounded-full bg-[#D4B483]/20">
                      <motion.div
                        className="h-full rounded-full bg-[#D4B483]"
                        initial={{ width: 0 }}
                        animate={inView ? { width: '62%' } : {}}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-[9px] text-[#F5EFE6]/30 mt-1">760 pts until Gold tier</p>
                  </div>

                  {/* Quick order */}
                  <p className="label-sm text-[#F5EFE6]/40 mb-3">Quick Reorder</p>
                  {['Brown Sugar Boba · RM 18', 'Matcha Velvet Latte · RM 22'].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2.5 border-b border-[rgba(255,255,255,0.04)]"
                    >
                      <span className="text-[11px] text-[#F5EFE6]/70">{item}</span>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(212,180,131,0.15)' }}
                      >
                        <span className="text-[#D4B483] text-xs">+</span>
                      </div>
                    </div>
                  ))}

                  {/* Bottom nav */}
                  <div className="flex justify-around mt-5 pt-3 border-t border-[rgba(255,255,255,0.04)]">
                    {['Home', 'Menu', 'Orders', 'Profile'].map((tab, i) => (
                      <div key={tab} className="flex flex-col items-center gap-1">
                        <div
                          className="w-4 h-4 rounded-sm"
                          style={{ background: i === 0 ? '#D4B483' : 'rgba(255,255,255,0.15)' }}
                        />
                        <span
                          className="text-[9px]"
                          style={{ color: i === 0 ? '#D4B483' : 'rgba(255,255,255,0.3)' }}
                        >
                          {tab}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification */}
              <motion.div
                className="absolute -right-8 top-20 glass-warm rounded-xl p-3 z-20 w-44"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <p className="label-sm text-[#D4B483] mb-0.5">Order Ready!</p>
                <p className="text-xs text-[#F5EFE6]/60">Your Brown Sugar Boba is ready for pickup</p>
              </motion.div>

              <motion.div
                className="absolute -left-8 bottom-24 glass rounded-xl p-3 z-20 w-36"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#D4B483]/20 flex items-center justify-center">
                    <Gift size={12} className="text-[#D4B483]" />
                  </div>
                  <div>
                    <p className="text-[9px] text-[#D4B483] font-semibold">+50 pts earned!</p>
                    <p className="text-[9px] text-[#F5EFE6]/40">Last order</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="label-sm text-[#D4B483] mb-4">07 — Mobile App</p>
            <h2 className="heading-lg text-[#F5EFE6] mb-6">
              Tea, delivered to
              <br />
              <span className="gold-gradient italic">your pulse.</span>
            </h2>
            <p className="body-lg text-[#F5EFE6]/50 mb-10 leading-loose">
              The Tea Pulse app brings your favourite drinks, loyalty rewards, and exclusive drops right to your fingertips — designed with the same obsessive attention to detail as our teas.
            </p>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
              {appFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-2xl border border-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.2)] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[rgba(212,180,131,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(212,180,131,0.15)] transition-colors">
                      <Icon size={18} className="text-[#D4B483]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#F5EFE6] text-sm">{f.label}</p>
                      <p className="text-xs text-[#F5EFE6]/40 mt-0.5">{f.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#"
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-[#F5EFE6] text-[#0E0E0E] hover:bg-white transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="text-[#0E0E0E]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] text-[#0E0E0E]/60 font-medium leading-none">Download on the</p>
                  <p className="text-sm font-bold leading-tight">App Store</p>
                </div>
              </motion.a>

              <motion.a
                href="#"
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl glass border border-[rgba(212,180,131,0.25)] text-[#F5EFE6] hover:border-[rgba(212,180,131,0.4)] transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.18 23.76c.31.17.67.22 1.05.09L13.88 12 4.23.15C3.85.03 3.49.07 3.18.24 2.54.6 2.12 1.34 2.12 2.3v19.38c0 .96.42 1.7 1.06 2.08zM20.33 9.85L17.55 8.2l-3.21 3.8 3.21 3.8 2.8-1.64c.8-.47 1.28-1.16 1.28-1.95s-.48-1.49-1.3-1.96zM4.58 1.08L16.45 8.8 13.24 12l-8.66-10.92zM4.58 22.92L13.24 12l3.21 3.2-11.87 7.72z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[9px] text-[#F5EFE6]/50 font-medium leading-none">Get it on</p>
                  <p className="text-sm font-bold leading-tight">Google Play</p>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
