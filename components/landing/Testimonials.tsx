'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Ariana Lim',
    role: 'Creative Director, KL',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    review: "Tea Pulse isn't just a drink — it's a full sensory ritual. The Brown Sugar Boba changed my morning routine forever. I genuinely can't go back to anything else.",
    drink: 'Brown Sugar Boba',
  },
  {
    name: 'Marcus Tan',
    role: 'Architect, Penang',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    review: "The Matcha Velvet Latte is what premium should feel like. You can taste the quality in every sip. The café design is also next-level — very Gentle Monster energy.",
    drink: 'Matcha Velvet Latte',
  },
  {
    name: 'Sophia Chen',
    role: 'Fashion Editor, Singapore',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    review: "I came for the Taro Silk Milk and stayed for the atmosphere. Everything about Tea Pulse screams editorial. It's the most aesthetically complete café experience I've had.",
    drink: 'Taro Silk Milk',
  },
  {
    name: 'Jae-won Park',
    role: 'Product Designer, Seoul',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    review: "As someone obsessed with design and detail, Tea Pulse hits different. The Signature drink is a masterpiece — complex, layered, and memorable long after the last sip.",
    drink: 'Tea Pulse Signature',
  },
  {
    name: 'Priya Nair',
    role: 'Digital Strategist, KL',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 5,
    review: "Every visit is like entering a luxury hotel lobby. The staff knows your order, the vibe is always immaculate, and the Jasmine Cream Tea is simply unmatched in this city.",
    drink: 'Jasmine Cream Tea',
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((prev) => (prev + dir + testimonials.length) % testimonials.length);
  };

  const current = testimonials[active];

  return (
    <section className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(212,180,131,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12" ref={ref}>
        {/* Header */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="label-sm text-[#D4B483] mb-4"
          >
            05 — Social Proof
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-lg text-[#F5EFE6]"
          >
            Words from our
            <br />
            <span className="gold-gradient italic">community.</span>
          </motion.h2>
        </div>

        {/* Main testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="max-w-[900px] mx-auto">
            {/* Quote card */}
            <div className="relative glass-warm rounded-3xl p-10 md:p-14 border border-[rgba(212,180,131,0.15)] overflow-hidden">
              {/* Large quote mark */}
              <div className="absolute top-6 left-8 font-display text-[120px] leading-none text-[#D4B483]/[0.06] select-none pointer-events-none">
                &ldquo;
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: direction * 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -30 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-8">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#D4B483" color="#D4B483" />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="font-display text-2xl md:text-3xl font-normal text-[#F5EFE6]/90 leading-relaxed mb-10 italic">
                    &ldquo;{current.review}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[rgba(212,180,131,0.3)]">
                        <img
                          src={current.avatar}
                          alt={current.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-[#F5EFE6]">{current.name}</p>
                        <p className="label-sm text-[#F5EFE6]/40 mt-0.5">{current.role}</p>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-full glass border border-[rgba(212,180,131,0.2)]">
                      <span className="label-sm text-[#D4B483]">Ordered: {current.drink}</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 px-2">
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                    className={`transition-all duration-300 rounded-full ${
                      i === active
                        ? 'w-8 h-2 bg-[#D4B483]'
                        : 'w-2 h-2 bg-[#F5EFE6]/20 hover:bg-[#F5EFE6]/40'
                    }`}
                  />
                ))}
              </div>

              {/* Arrows */}
              <div className="flex gap-3">
                <motion.button
                  onClick={() => go(-1)}
                  className="w-12 h-12 rounded-full glass border border-[rgba(212,180,131,0.2)] flex items-center justify-center text-[#F5EFE6]/60 hover:text-[#D4B483] hover:border-[#D4B483] transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronLeft size={18} />
                </motion.button>
                <motion.button
                  onClick={() => go(1)}
                  className="w-12 h-12 rounded-full bg-[#D4B483] flex items-center justify-center text-[#0E0E0E]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Side reviews (desktop) */}
          <div className="absolute top-0 right-0 w-64 hidden xl:flex flex-col gap-4">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 30 }}
                animate={inView ? { opacity: i === active ? 1 : 0.4, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`glass rounded-2xl p-4 border cursor-pointer transition-all duration-300 ${
                  i === active ? 'border-[rgba(212,180,131,0.3)]' : 'border-transparent'
                }`}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-[#F5EFE6]">{t.name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} size={8} fill="#D4B483" color="#D4B483" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#F5EFE6]/50 text-xs line-clamp-2">{t.review}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
