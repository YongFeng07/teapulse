'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

export default function Story() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const imageY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);

  return (
    <section id="story" ref={sectionRef} className="relative py-32 bg-[#0E0E0E] overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div
          className="absolute left-0 top-0 bottom-0 w-1/2"
          style={{
            background: 'radial-gradient(ellipse at left center, rgba(123,94,59,0.15) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="label-sm text-[#D4B483] mb-16 text-center"
        >
          03 — Our Story
        </motion.p>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <motion.div style={{ y: imageY }} className="relative">
              {/* Main image */}
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="https://images.pexels.com/photos/6412836/pexels-photo-6412836.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Tea crafting experience"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/60 via-transparent to-transparent" />
              </div>

              {/* Overlay card - positioned inside the image container bounds */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="absolute bottom-4 right-4 md:bottom-8 md:right-8 glass-warm rounded-2xl p-5 z-20"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-[#D4B483]">2019</p>
                <p className="label-sm text-[#F5EFE6]/50 mt-1">Founded in</p>
                <p className="label-sm text-[#F5EFE6]/50">Kuala Lumpur</p>
              </motion.div>

              {/* Second smaller image - positioned inside bounds */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="absolute top-4 right-4 md:top-6 md:right-6 w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-[rgba(212,180,131,0.2)] z-10 shadow-lg"
              >
                <img
                  src="https://images.pexels.com/photos/12517410/pexels-photo-12517410.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Tea ingredients"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 className="heading-lg text-[#F5EFE6] mb-8">
                Where flavor
                <br />
                meets <span className="gold-gradient italic">emotion.</span>
              </h2>

              <p className="body-lg text-[#F5EFE6]/60 mb-8 leading-loose">
                Every cup of Tea Pulse is crafted to synchronize flavor, emotion, and lifestyle into one unforgettable modern tea experience.
              </p>

              <p className="body-lg text-[#F5EFE6]/40 mb-12 leading-loose">
                Born from a passion for redefining Asian tea culture, we source only the finest ingredients — from Taiwanese high-mountain oolongs to Japanese ceremonial matcha — and transform them into liquid poetry.
              </p>

              {/* Values */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {[
                  { label: 'Farm to Cup', desc: 'Ethically sourced from partner farms across Asia' },
                  { label: 'Zero Compromise', desc: 'Every ingredient passes our 7-point quality test' },
                  { label: 'Daily Fresh', desc: 'Ingredients prepared fresh every morning at 6am' },
                  { label: 'Science + Art', desc: 'Flavour calibrated to 0.1g precision every batch' },
                ].map((v) => (
                  <div key={v.label} className="group">
                    <div className="w-8 h-0.5 bg-[#D4B483] mb-3 group-hover:w-12 transition-all duration-300" />
                    <p className="font-semibold text-[#F5EFE6] text-sm mb-1">{v.label}</p>
                    <p className="text-xs text-[#F5EFE6]/40 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <a
                href="#features"
                className="inline-flex items-center gap-3 text-[#D4B483] label-sm font-semibold group"
              >
                <span>Discover Our Process</span>
                <span className="w-10 h-px bg-[#D4B483] group-hover:w-16 transition-all duration-300" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Large watermark text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none">
        <p
          className="font-display text-[15vw] font-bold text-[#F5EFE6]/[0.02] whitespace-nowrap"
          style={{ letterSpacing: '-0.02em' }}
        >
          TEA PULSE
        </p>
      </div>
    </section>
  );
}
