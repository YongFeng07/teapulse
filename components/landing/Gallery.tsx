'use client';

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Expand } from 'lucide-react';

const galleryItems = [
  {
    src: 'https://images.pexels.com/photos/19996404/pexels-photo-19996404.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Tea Pulse signature drink',
    span: 'col-span-1 row-span-2',
    label: 'Signature',
  },
  {
    src: 'https://images.pexels.com/photos/6412836/pexels-photo-6412836.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Brown sugar boba',
    span: 'col-span-1 row-span-1',
    label: 'Brown Sugar Boba',
  },
  {
    src: 'https://images.pexels.com/photos/911810/pexels-photo-911810.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Matcha latte',
    span: 'col-span-1 row-span-1',
    label: 'Matcha Velvet',
  },
  {
    src: 'https://images.pexels.com/photos/28915280/pexels-photo-28915280.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Tea ingredients',
    span: 'col-span-2 row-span-1',
    label: 'Fresh Ingredients',
  },
  {
    src: 'https://images.pexels.com/photos/5817624/pexels-photo-5817624.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Taro milk tea',
    span: 'col-span-1 row-span-1',
    label: 'Taro Silk Milk',
  },
  {
    src: 'https://images.pexels.com/photos/5335709/pexels-photo-5335709.jpeg?auto=compress&cs=tinysrgb&w=800',
    alt: 'Mango drink',
    span: 'col-span-1 row-span-1',
    label: 'Mango Spark',
  },
];

function GalleryItem({ item, index }: { item: typeof galleryItems[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className={`${item.span} relative rounded-2xl overflow-hidden cursor-pointer group`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="w-full h-full object-cover"
        animate={{ scale: hovered ? 1.08 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/80 via-transparent to-transparent"
        animate={{ opacity: hovered ? 1 : 0.4 }}
        transition={{ duration: 0.3 }}
      />

      {/* Label */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="label-sm text-[#F5EFE6]">{item.label}</span>
        <div className="w-8 h-8 rounded-full glass flex items-center justify-center">
          <Expand size={14} className="text-[#D4B483]" />
        </div>
      </motion.div>

      {/* Corner glow on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(212,180,131,0.15) 0%, transparent 60%)',
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative py-32 bg-[#0E0E0E] overflow-hidden" id="gallery">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div ref={ref} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="label-sm text-[#D4B483] mb-4"
          >
            06 — Visual World
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="heading-lg text-[#F5EFE6]"
          >
            The Tea Pulse
            <br />
            <span className="gold-gradient italic">aesthetic.</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-3 gap-4 auto-rows-[220px]"
          style={{ gridAutoRows: 'minmax(200px, auto)' }}
        >
          {galleryItems.map((item, i) => (
            <GalleryItem key={i} item={item} index={i} />
          ))}
        </div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center mt-12 gap-4"
        >
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(212,180,131,0.2)]" />
          <a
            href="#"
            className="flex items-center gap-2 px-6 py-3 rounded-full glass border border-[rgba(212,180,131,0.2)] text-[#F5EFE6]/60 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.4)] transition-all duration-300 label-sm"
          >
            <span>@teapulse</span>
            <span className="text-[#D4B483]">on Instagram</span>
          </a>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(212,180,131,0.2)]" />
        </motion.div>
      </div>
    </section>
  );
}
