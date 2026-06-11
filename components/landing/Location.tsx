'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Phone, Calendar } from 'lucide-react';

const hours = [
  { day: 'Monday — Friday', time: '8:00 AM — 10:00 PM' },
  { day: 'Saturday', time: '9:00 AM — 11:00 PM' },
  { day: 'Sunday', time: '10:00 AM — 9:00 PM' },
];

export default function Location() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="location" className="relative py-32 bg-[#0A0A0A] overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(212,180,131,0.04) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="label-sm text-[#D4B483] mb-4"
          >
            08 — Find Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-lg text-[#F5EFE6]"
          >
            Visit our
            <br />
            <span className="gold-gradient italic">flagship store.</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden aspect-[4/3]"
          >
            <img
              src="https://images.pexels.com/photos/19996404/pexels-photo-19996404.jpeg?auto=compress&cs=tinysrgb&w=900"
              alt="Tea Pulse flagship store"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Grid lines */}
              <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(212,180,131,1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(212,180,131,1) 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px',
                }}
              />

              {/* Pin */}
              <div className="relative z-10 text-center">
                <motion.div
                  className="w-16 h-16 rounded-full bg-[#D4B483] flex items-center justify-center mx-auto mb-3 shadow-lg"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: '0 0 0 0 rgba(212,180,131,0.4)' }}
                >
                  <MapPin size={28} color="#0E0E0E" />
                </motion.div>

                {/* Pulse rings */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4B483]"
                    style={{ width: 80 + i * 50, height: 80 + i * 50, marginLeft: -(40 + i * 25), marginTop: -(40 + i * 25) }}
                    animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                  />
                ))}

                <div className="glass-warm rounded-2xl px-5 py-3 mt-2">
                  <p className="font-semibold text-[#F5EFE6] text-sm">Tea Pulse Flagship</p>
                  <p className="text-xs text-[#F5EFE6]/50 mt-0.5">Kuala Lumpur, Malaysia</p>
                </div>
              </div>
            </div>

            {/* Neighborhood labels */}
            <div className="absolute top-6 left-6 label-sm text-[#F5EFE6]/30">KLCC</div>
            <div className="absolute top-6 right-6 label-sm text-[#F5EFE6]/30">Bukit Bintang</div>
            <div className="absolute bottom-6 left-6 label-sm text-[#F5EFE6]/30">Pavilion Mall</div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center gap-8"
          >
            {/* Address */}
            <div className="glass-warm rounded-2xl p-6 border border-[rgba(212,180,131,0.12)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(212,180,131,0.1)] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-[#D4B483]" />
                </div>
                <div>
                  <p className="label-sm text-[#D4B483] mb-2">Address</p>
                  <p className="font-semibold text-[#F5EFE6]">Level 3, Pavilion Mall</p>
                  <p className="text-[#F5EFE6]/50 text-sm mt-1">168, Jalan Bukit Bintang</p>
                  <p className="text-[#F5EFE6]/50 text-sm">55100 Kuala Lumpur, Malaysia</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="glass-warm rounded-2xl p-6 border border-[rgba(212,180,131,0.12)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[rgba(212,180,131,0.1)] flex items-center justify-center">
                  <Clock size={18} className="text-[#D4B483]" />
                </div>
                <p className="label-sm text-[#D4B483]">Opening Hours</p>
              </div>
              <div className="space-y-3">
                {hours.map((h) => (
                  <div key={h.day} className="flex justify-between items-center">
                    <span className="text-[#F5EFE6]/60 text-sm">{h.day}</span>
                    <span className="text-[#F5EFE6] text-sm font-medium">{h.time}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Open now</span>
              </div>
            </div>

            {/* Contact */}
            <div className="flex gap-4">
              <motion.a
                href="tel:+601131780587"
                className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl glass border border-[rgba(212,180,131,0.15)] hover:border-[rgba(212,180,131,0.3)] transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <Phone size={18} className="text-[#D4B483]" />
                <div>
                  <p className="text-[10px] text-[#F5EFE6]/40 font-medium">Call us</p>
                  <p className="text-sm text-[#F5EFE6] font-semibold">+60 11-3178 0587</p>
                </div>
              </motion.a>

              <motion.a
                href="#newsletter"
                className="flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#D4B483] hover:bg-[#E8D5B0] transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <Calendar size={18} color="#0E0E0E" />
                <div>
                  <p className="text-[10px] text-[#0E0E0E]/60 font-medium">Reserve a</p>
                  <p className="text-sm text-[#0E0E0E] font-semibold">Table</p>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Other locations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-12"
        >
          <p className="label-sm text-[#F5EFE6]/30 text-center mb-6">Also at</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Mid Valley Megamall', 'KLCC Suria', 'Sunway Pyramid'].map((loc) => (
              <div
                key={loc}
                className="px-5 py-2.5 rounded-full glass border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/50 text-sm"
              >
                {loc}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
