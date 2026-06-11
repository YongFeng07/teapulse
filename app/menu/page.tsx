"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Sparkles, Flame, Leaf, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string; slug: string; }
interface Drink {
  id: string; name: string; slug: string; description: string;
  price: number; image: string; isPopular: boolean; isSeasonal: boolean;
  rating: number; reviewCount: number; badges: string;
  category: { id: string; name: string; slug: string };
}

function DrinkCard({ drink, index }: { drink: Drink; index: number }) {
  const badges = drink.badges ? drink.badges.split(",").map(b => b.trim()).filter(Boolean) : [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.4 }}
    >
      <Link href={`/menu/${drink.slug}`} className="group block h-full">
        <div className="relative overflow-hidden rounded-2xl bg-[#161616] border border-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.28)] transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.5)] h-full flex flex-col">

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden shrink-0 bg-[#1A1A1A]">
            <Image
              src={drink.image} alt={drink.name} fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/10 to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {drink.isPopular && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(212,180,131,0.3)] text-[#D4B483] text-[9px] font-semibold uppercase tracking-wide">
                  <Flame size={8} className="text-orange-400" /> Hot
                </span>
              )}
              {drink.isSeasonal && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(74,222,128,0.3)] text-green-400 text-[9px] font-semibold uppercase tracking-wide">
                  <Leaf size={8} /> Limited
                </span>
              )}
            </div>

            {/* Rating */}
            {(drink.rating > 0 || drink.reviewCount > 0) && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(212,180,131,0.15)]">
                <Star size={10} fill="#D4B483" className="text-[#D4B483]" />
                <span className="text-[#F5EFE6] text-[11px] font-semibold">{drink.rating.toFixed(1)}</span>
                <span className="text-[#F5EFE6]/40 text-[10px]">({drink.reviewCount})</span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[rgba(212,180,131,0.04)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[#D4B483]/50 text-[9px] font-semibold uppercase tracking-widest mb-1.5">
              {drink.category.name}
            </p>
            <h3 className="font-display text-base font-semibold text-[#F5EFE6] leading-snug line-clamp-2 group-hover:text-[#D4B483] transition-colors duration-300 flex-1">
              {drink.name}
            </h3>
            <p className="text-[#F5EFE6]/30 text-[11px] mt-1.5 line-clamp-2 leading-relaxed">
              {drink.description}
            </p>

            {/* Badges row */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {badges.slice(0, 2).map((b) => (
                  <span key={b} className="text-[9px] px-2 py-0.5 rounded-full bg-[rgba(212,180,131,0.08)] text-[#D4B483]/70 font-medium">
                    {b}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-[rgba(212,180,131,0.07)]">
              <span className="font-display text-lg font-bold text-[#D4B483]">RM {drink.price.toFixed(2)}</span>
              <motion.div
                className="w-8 h-8 rounded-full bg-[#D4B483] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-[#0E0E0E] text-sm font-bold leading-none">+</span>
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[#161616] border border-[rgba(212,180,131,0.05)] overflow-hidden">
      <div className="aspect-[4/3] bg-[rgba(212,180,131,0.04)] animate-pulse" />
      <div className="p-4 space-y-2.5">
        <div className="h-2 w-16 rounded bg-[rgba(212,180,131,0.06)] animate-pulse" />
        <div className="h-4 rounded bg-[rgba(212,180,131,0.06)] animate-pulse" />
        <div className="h-3 w-3/4 rounded bg-[rgba(212,180,131,0.04)] animate-pulse" />
        <div className="h-6 w-24 rounded bg-[rgba(212,180,131,0.06)] animate-pulse mt-3" />
      </div>
    </div>
  );
}

export default function MenuPage() {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDrinks = useCallback((cat: string) => {
    setLoading(true);
    const url = cat === "all" ? "/api/menu" : `/api/menu?category=${cat}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setDrinks(data.drinks ?? []);
        if (data.categories?.length > 0) setCategories(data.categories);
      })
      .catch(() => setDrinks([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchDrinks(activeCategory); }, [activeCategory, fetchDrinks]);

  const filtered = search.trim()
    ? drinks.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()) ||
        d.category.name.toLowerCase().includes(search.toLowerCase())
      )
    : drinks;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pb-24">
      {/* Sticky search + filter bar */}
      <div className="sticky top-16 z-40 bg-[#0E0E0E]/96 backdrop-blur-xl border-b border-[rgba(212,180,131,0.07)] py-4">
        <div className="max-w-[1400px] mx-auto px-5 md:px-10">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drinks, ingredients..."
              className="w-full pl-9 pr-8 py-2.5 rounded-full bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.12)] focus:border-[rgba(212,180,131,0.35)] outline-none text-[#F5EFE6] placeholder-[#F5EFE6]/25 text-sm transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/30 hover:text-[#D4B483]">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-200",
                activeCategory === "all"
                  ? "bg-[#D4B483] text-[#0E0E0E]"
                  : "bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.12)] text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)]"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all duration-200",
                  activeCategory === cat.slug
                    ? "bg-[#D4B483] text-[#0E0E0E]"
                    : "bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.12)] text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)]"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8">
        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[#D4B483] text-[10px] font-semibold uppercase tracking-widest mb-2">Our Collection</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE6]">
            Craft your{" "}
            <span className="italic" style={{
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              backgroundImage: "linear-gradient(135deg, #D4B483 0%, #E8D5B0 50%, #A8895A 100%)",
              backgroundClip: "text",
            }}>
              perfect cup.
            </span>
          </h1>
          {!loading && (
            <p className="text-[#F5EFE6]/30 mt-2 text-sm">
              {search ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"` : `${filtered.length} drinks`}
            </p>
          )}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <Sparkles size={32} className="mx-auto text-[#F5EFE6]/10 mb-4" />
            <p className="font-display text-2xl text-[#F5EFE6]/20">No drinks found</p>
            <p className="text-[#F5EFE6]/15 text-sm mt-2">
              {search ? `Nothing matches "${search}"` : "Check back soon for new additions"}
            </p>
            {search && (
              <button onClick={() => setSearch("")} className="mt-4 text-[#D4B483] text-sm hover:underline">
                Clear search
              </button>
            )}
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((drink, i) => (
                <DrinkCard key={drink.id} drink={drink} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
