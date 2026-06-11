'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Leaf, Zap, Sliders, Truck, Coffee, Camera } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Handmade Daily',
    description: 'Each tea base is brewed in small batches every morning to ensure peak freshness and flavor integrity.',
    color: '#4A8C3F',
    gradient: 'from-[#0D2010] to-[#0E0E0E]',
  },
  {
    icon: Zap,
    title: 'Fresh Ingredients',
    description: 'Only the finest ingredients. No artificial flavoring, no shortcuts — just pure, natural excellence.',
    color: '#D4B483',
    gradient: 'from-[#2A1A00] to-[#0E0E0E]',
  },
  {
    icon: Sliders,
    title: 'Fully Customizable',
    description: 'Choose your sweetness, ice level, milk type, and toppings. Your drink, your way — every time.',
    color: '#60A5FA',
    gradient: 'from-[#0A1628] to-[#0E0E0E]',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Order from our app and receive your premium tea delivered to your door in under 30 minutes.',
    color: '#F59E0B',
    gradient: 'from-[#2A1800] to-[#0E0E0E]',
  },
  {
    icon: Coffee,
    title: 'Modern Café Atmosphere',
    description: 'Our flagship space is designed for focus, connection, and aesthetic pleasure. Come stay a while.',
    color: '#C4882A',
    gradient: 'from-[#1A0E00] to-[#0E0E0E]',
  },
  {
    icon: Camera,
    title: 'Instagram-Worthy',
    description: 'Every cup is a visual statement. Designed to be photographed, shared, and admired.',
    color: '#F472B6',
    gradient: 'from-[#280820] to-[#0E0E0E]',
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="features" className="relative py-32 bg-[#0E0E0E] overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(212,180,131,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(212,180,131,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={ref} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="label-sm text-[#D4B483] mb-4"
          >
            04 — The Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-lg text-[#F5EFE6]"
          >
            Why Tea Pulse
            <br />
            <span className="gold-gradient italic">stands apart.</span>
          </motion.h2>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={`group relative p-8 rounded-3xl bg-gradient-to-br ${f.gradient} border border-[rgba(255,255,255,0.04)] hover:border-[rgba(212,180,131,0.15)] transition-all duration-500 card-lift overflow-hidden`}
              >
                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${f.color}15 0%, transparent 60%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}30` }}
                >
                  <Icon size={24} style={{ color: f.color }} />
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: `0 0 20px ${f.color}40`,
                    }}
                  />
                </div>

                <h3 className="font-display text-xl font-semibold text-[#F5EFE6] mb-3">{f.title}</h3>
                <p className="text-[#F5EFE6]/50 text-sm leading-relaxed">{f.description}</p>

                {/* Bottom line */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(90deg, transparent, ${f.color}60, transparent)` }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 p-8 rounded-3xl glass-warm border border-[rgba(212,180,131,0.15)]"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50+', label: 'Unique Blends' },
              { value: '3', label: 'Store Locations' },
              { value: '99%', label: 'Fresh Daily' },
              { value: '30min', label: 'Avg Delivery' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-display text-4xl font-bold gold-gradient">{s.value}</p>
                <p className="label-sm text-[#F5EFE6]/40 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
