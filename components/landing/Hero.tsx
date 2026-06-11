'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, ChevronDown, Crown, Sparkles } from 'lucide-react';

const STATS = [
  { value: '50K+', label: 'Happy customers' },
  { value: '15+', label: 'Signature drinks' },
  { value: '4.9★', label: 'App rating' },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0E0E0E]"
    >
      {/* Static ambient glow — avoids framer-motion issues */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #D4B483, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #E8D5B0, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      {/* Fine grid overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(212,180,131,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(212,180,131,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

      {/* Light rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full opacity-[0.03] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #D4B483, transparent)' }} />

      <motion.div style={{ opacity: heroOpacity }} className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* LEFT — Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-10"
              style={{
                background: 'rgba(212,180,131,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(212,180,131,0.2)',
              }}
            >
              <Crown size={13} className="text-[#D4B483]" fill="#D4B483" />
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#D4B483]">Premium Tea Experience</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-display text-[clamp(3.5rem,7vw,5.5rem)] font-bold leading-[0.95] text-[#F5EFE6] mb-6 tracking-tight">
                Not just
                <br />
                <span className="italic bg-gradient-to-r from-[#D4B483] via-[#E8D5B0] to-[#A8895A] bg-clip-text text-transparent">
                  Tea.
                </span>
                <br />
                <span className="text-[#F5EFE6]">A whole new pulse.</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-lg text-[#F5EFE6]/40 max-w-lg mb-10 leading-relaxed font-light"
            >
              Handcrafted luxury tea experiences for the rhythm of modern life.
              Order ahead, customize everything, earn premium rewards.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link href="/menu">
                <motion.button
                  className="group px-8 py-4 rounded-full font-semibold text-[#0E0E0E]"
                  style={{
                    background: 'linear-gradient(135deg, #D4B483, #E8D5B0)',
                    boxShadow: '0 0 30px rgba(212,180,131,0.2)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="flex items-center gap-2">
                    Explore Menu
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              <Link href="/gift">
                <motion.button
                  className="px-8 py-4 rounded-full font-semibold text-[#D4B483]"
                  style={{
                    background: 'rgba(212,180,131,0.04)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(212,180,131,0.2)',
                  }}
                  whileHover={{ scale: 1.05, background: 'rgba(212,180,131,0.08)' }}
                  whileTap={{ scale: 0.97 }}
                >
                  Gift a Drink 🎁
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex gap-10"
            >
              {STATS.map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 + i * 0.1 }}
                >
                  <p className="font-display text-3xl font-bold text-[#D4B483]">{value}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#F5EFE6]/25 mt-1.5">{label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — Premium drink showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[480px] hidden lg:flex items-center justify-center"
          >
            {/* Rotating rings */}
            <motion.div
              className="absolute w-[320px] h-[320px] rounded-full border border-[rgba(212,180,131,0.06)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-[240px] h-[240px] rounded-full border border-[rgba(212,180,131,0.04)]"
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />

            {/* Main cup card */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[200px] h-[280px] rounded-[36px] overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, rgba(212,180,131,0.1) 0%, rgba(212,180,131,0.03) 100%)',
                border: '1px solid rgba(212,180,131,0.2)',
                boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 40px rgba(212,180,131,0.08)',
              }}
            >
              <Image
                src="https://images.pexels.com/photos/19996404/pexels-photo-19996404.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Premium Tea"
                fill
                className="object-cover"
                sizes="200px"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/70 via-transparent to-transparent" />
            </motion.div>

            {/* Small floating cards */}
            {[
              { src: 'https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=300', top: '5%', left: '5%', delay: 0 },
              { src: 'https://images.pexels.com/photos/6412836/pexels-photo-6412836.jpeg?auto=compress&cs=tinysrgb&w=300', top: '60%', left: '65%', delay: 1.2 },
            ].map((card, i) => (
              <motion.div
                key={i}
                className="absolute w-[120px] h-[160px] rounded-2xl overflow-hidden"
                style={{ top: card.top, left: card.left }}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, delay: card.delay, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image src={card.src} alt="Drink" fill className="object-cover" sizes="120px" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/60 via-transparent to-transparent" />
                <div className="absolute inset-0 border border-[rgba(212,180,131,0.12)] rounded-2xl" />
              </motion.div>
            ))}

            {/* Sparkle accent */}
            <motion.div
              className="absolute top-[20%] right-[30%]"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              <Sparkles size={18} className="text-[#D4B483]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0E0E0E, transparent)' }} />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F5EFE6]/20">Scroll to explore</span>
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown size={16} className="text-[#D4B483]/30" />
        </motion.div>
      </motion.div>
    </section>
  );
}
