'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Star, Flame } from 'lucide-react';
import Link from 'next/link';

interface Drink {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  isPopular: boolean;
  rating: number;
  reviewCount: number;
  badges: string;
  category: { name: string };
}

function DrinkCard({ drink, index }: { drink: Drink; index: number }) {
  const [hovered, setHovered] = useState(false);
  const badges = drink.badges ? drink.badges.split(',').map(b => b.trim()).filter(Boolean) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative group cursor-pointer shrink-0 w-72 md:w-80"
    >
      <Link href={`/menu/${drink.slug}`} className="block">
        <div
          className="relative overflow-hidden rounded-3xl border transition-all duration-500"
          style={{
            background: hovered ? 'rgba(212,180,131,0.07)' : 'rgba(22,22,22,0.9)',
            borderColor: hovered ? 'rgba(212,180,131,0.3)' : 'rgba(212,180,131,0.1)',
            boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.6)' : '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <motion.div
              className="w-full h-full"
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={drink.image}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent opacity-80" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {drink.isPopular && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(14,14,14,0.85)] backdrop-blur-sm border border-[rgba(212,180,131,0.3)] text-[#D4B483] text-[9px] font-semibold uppercase tracking-wide">
                  <Flame size={8} className="text-orange-400" /> Popular
                </span>
              )}
            </div>

            {/* Rating */}
            {drink.rating > 0 && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[rgba(14,14,14,0.85)] backdrop-blur-sm border border-[rgba(212,180,131,0.2)]">
                <Star size={10} fill="#D4B483" className="text-[#D4B483]" />
                <span className="text-[#F5EFE6] text-[11px] font-bold">{drink.rating.toFixed(1)}</span>
                <span className="text-[#F5EFE6]/40 text-[10px]">({drink.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-[#D4B483]/50 text-[9px] font-semibold uppercase tracking-widest mb-1">{drink.category.name}</p>
            <h3 className="font-display text-xl font-bold text-[#F5EFE6] mb-2 leading-tight group-hover:text-[#D4B483] transition-colors">
              {drink.name}
            </h3>
            <p className="text-[#F5EFE6]/45 text-sm leading-relaxed line-clamp-2">{drink.description}</p>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2.5">
                {badges.slice(0, 3).map(b => (
                  <span key={b} className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(212,180,131,0.08)] text-[#D4B483]/70">{b}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-5">
              <span className="font-display text-2xl font-bold text-[#D4B483]">RM {drink.price.toFixed(2)}</span>
              <motion.div
                animate={{ x: hovered ? 4 : 0, opacity: hovered ? 1 : 0.5 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1.5 text-[#D4B483] text-sm font-semibold"
              >
                Order <ArrowRight size={14} />
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Drinks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [drinks, setDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => {
        // Show popular + top-rated drinks first, max 8
        const sorted = (data.drinks ?? [])
          .sort((a: Drink, b: Drink) => {
            if (b.isPopular !== a.isPopular) return b.isPopular ? 1 : -1;
            return b.rating - a.rating;
          })
          .slice(0, 8);
        setDrinks(sorted);
      })
      .catch(() => {});
  }, []);

  // Fallback static drinks if API not loaded yet
  const displayDrinks = drinks.length > 0 ? drinks : [
    { id: '1', name: 'Signature Brown Sugar Boba', slug: 'signature-brown-sugar-boba', description: 'Hand-rolled tapioca pearls in rich brown sugar syrup with fresh milk.', price: 16.9, image: 'https://images.pexels.com/photos/6412836/pexels-photo-6412836.jpeg?auto=compress&cs=tinysrgb&w=600', isPopular: true, rating: 4.9, reviewCount: 127, badges: 'Bestseller,Staff Pick', category: { name: 'Milk Tea' } },
    { id: '2', name: 'Ceremonial Matcha Latte', slug: 'ceremonial-matcha-latte', description: 'Uji ceremonial-grade matcha whisked with oat milk.', price: 18.9, image: 'https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=600', isPopular: true, rating: 4.9, reviewCount: 98, badges: 'Vegan,Premium', category: { name: 'Matcha' } },
    { id: '3', name: 'Osmanthus Gold Tea', slug: 'osmanthus-gold-tea', description: 'Premium Tie Guan Yin oolong with dried osmanthus flowers.', price: 21.9, image: 'https://images.pexels.com/photos/19996404/pexels-photo-19996404.jpeg?auto=compress&cs=tinysrgb&w=600', isPopular: true, rating: 4.9, reviewCount: 63, badges: 'Premium,Seasonal', category: { name: 'Specials' } },
    { id: '4', name: 'Passion Fruit Green Tea', slug: 'passion-fruit-green-tea', description: 'Tropical passion fruit with crisp green tea. Vibrant and refreshing.', price: 15.5, image: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=600', isPopular: true, rating: 4.8, reviewCount: 84, badges: 'Refreshing,No Milk', category: { name: 'Fruit Tea' } },
    { id: '5', name: 'Matcha Cloud Boba', slug: 'matcha-cloud-boba', description: 'Premium matcha with tapioca pearls topped with salted cheese foam.', price: 19.9, image: 'https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=600', isPopular: true, rating: 4.8, reviewCount: 72, badges: 'Bestseller,Instagram Worthy', category: { name: 'Matcha' } },
    { id: '6', name: 'Black Sesame Milk Tea', slug: 'black-sesame-milk-tea', description: 'Nutty black sesame paste swirled into premium milk tea.', price: 19.9, image: 'https://images.pexels.com/photos/3625372/pexels-photo-3625372.jpeg?auto=compress&cs=tinysrgb&w=600', isPopular: false, rating: 4.7, reviewCount: 45, badges: 'Unique,Rich', category: { name: 'Specials' } },
  ];

  return (
    <section id="drinks" className="relative py-24 md:py-32 overflow-hidden bg-[#0E0E0E]">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #D4B483, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="px-5 md:px-10 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-[#D4B483] text-[10px] font-semibold uppercase tracking-widest mb-3">Featured Drinks</p>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-[#F5EFE6] leading-tight">
              Crafted with
              <br />
              <span className="italic" style={{
                WebkitTextFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                backgroundImage: 'linear-gradient(135deg, #D4B483, #E8D5B0, #A8895A)',
                backgroundClip: 'text',
              }}>
                obsession.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link href="/menu">
              <motion.button
                className="flex items-center gap-2 px-6 py-3 rounded-full border border-[rgba(212,180,131,0.25)] text-[#D4B483] text-sm font-semibold hover:bg-[rgba(212,180,131,0.07)] transition-all"
                whileHover={{ scale: 1.04 }}
              >
                View Full Menu <ArrowRight size={15} />
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-5 overflow-x-auto px-5 md:px-10 pb-4 scrollbar-hide">
          {displayDrinks.map((drink, i) => (
            <DrinkCard key={drink.id} drink={drink} index={i} />
          ))}
          {/* CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="shrink-0 w-72 md:w-80"
          >
            <Link href="/menu">
              <div className="h-full min-h-[400px] rounded-3xl border border-dashed border-[rgba(212,180,131,0.2)] flex flex-col items-center justify-center gap-4 hover:border-[rgba(212,180,131,0.4)] hover:bg-[rgba(212,180,131,0.03)] transition-all duration-300 p-8 text-center cursor-pointer group">
                <div className="w-14 h-14 rounded-full border border-[rgba(212,180,131,0.2)] flex items-center justify-center group-hover:border-[rgba(212,180,131,0.5)] transition-colors">
                  <ArrowRight size={20} className="text-[#D4B483]/60 group-hover:text-[#D4B483] transition-colors" />
                </div>
                <p className="font-display text-xl font-semibold text-[#F5EFE6]/40 group-hover:text-[#D4B483] transition-colors">
                  See all drinks
                </p>
                <p className="text-[#F5EFE6]/25 text-sm">15 crafted beverages</p>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
