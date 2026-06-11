"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Drink {
  id: string; name: string; slug: string; image: string; price: number;
  category: { name: string };
}

export function RelatedDrinks() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recommendations")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDrinks(data.slice(0, 4));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || drinks.length === 0) return null;

  return (
    <section className="mt-8 pt-8 border-t border-[rgba(212,180,131,0.08)]">
      <div className="flex items-center gap-2 mb-5">
        <Sparkles size={14} className="text-[#D4B483]" />
        <h3 className="font-display text-lg font-semibold text-[#F5EFE6]">You Might Also Like</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {drinks.map((d, i) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/menu/${d.slug}`} className="group block bg-[#161616] rounded-2xl overflow-hidden border border-[rgba(212,180,131,0.06)] hover:border-[rgba(212,180,131,0.25)] transition-all">
              <div className="relative aspect-square overflow-hidden">
                <Image src={d.image} alt={d.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="150px" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/40 via-transparent to-transparent" />
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-[#F5EFE6] truncate group-hover:text-[#D4B483] transition-colors">{d.name}</p>
                <p className="text-[10px] text-[#F5EFE6]/30 mt-0.5">{d.category.name}</p>
                <p className="text-xs font-bold text-[#D4B483] mt-1.5">RM {d.price.toFixed(2)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
