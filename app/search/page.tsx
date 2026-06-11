"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Star, ArrowLeft } from "lucide-react";

interface Drink {
  id: string; name: string; slug: string; description: string;
  price: number; image: string; rating: number; badges: string;
  category: { name: string };
}

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(false);
  const [allDrinks, setAllDrinks] = useState<Drink[]>([]);

  useEffect(() => {
    fetch("/api/menu")
      .then(r => r.json())
      .then(data => setAllDrinks(data.drinks ?? []));
  }, []);

  useEffect(() => {
    if (!query.trim()) { setDrinks([]); return; }
    setLoading(true);
    const t = setTimeout(() => {
      const lower = query.toLowerCase();
      const results = allDrinks.filter(d =>
        d.name.toLowerCase().includes(lower) ||
        d.description.toLowerCase().includes(lower) ||
        d.category.name.toLowerCase().includes(lower) ||
        d.badges?.toLowerCase().includes(lower)
      );
      setDrinks(results);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query, allDrinks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[900px] mx-auto px-5 md:px-10">
        <motion.button onClick={() => router.back()}
          className="flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors mt-2 mb-8 text-sm"
          whileHover={{ x: -3 }}>
          <ArrowLeft size={14} /> Back
        </motion.button>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mb-10">
          <div className="relative">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/30" />
            <input
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search drinks, flavours, ingredients..."
              className="w-full pl-14 pr-5 py-4 rounded-2xl bg-[#161616] border border-[rgba(212,180,131,0.15)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/25 text-lg outline-none transition-all"
            />
          </div>
        </form>

        {/* Results */}
        {query.trim() ? (
          <>
            <p className="text-[#F5EFE6]/30 text-sm mb-5">
              {loading ? "Searching..." : `${drinks.length} result${drinks.length !== 1 ? "s" : ""} for "${query}"`}
            </p>
            {drinks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {drinks.map((drink, i) => (
                  <motion.div key={drink.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link href={`/menu/${drink.slug}`} className="group block">
                      <div className="bg-[#161616] border border-[rgba(212,180,131,0.08)] group-hover:border-[rgba(212,180,131,0.28)] rounded-2xl overflow-hidden transition-all">
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
                          <Image src={drink.image} alt={drink.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="300px" unoptimized />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] to-transparent" />
                          {drink.rating > 0 && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(14,14,14,0.8)] border border-[rgba(212,180,131,0.2)]">
                              <Star size={9} fill="#D4B483" className="text-[#D4B483]" />
                              <span className="text-[#F5EFE6] text-[10px] font-bold">{drink.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-[#D4B483]/50 text-[9px] font-semibold uppercase tracking-wider mb-0.5">{drink.category.name}</p>
                          <h3 className="font-display text-sm font-semibold text-[#F5EFE6] line-clamp-2 group-hover:text-[#D4B483] transition-colors">{drink.name}</h3>
                          <p className="font-display font-bold text-[#D4B483] text-sm mt-2">RM {drink.price.toFixed(2)}</p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : !loading && (
              <div className="text-center py-16">
                <p className="font-display text-2xl text-[#F5EFE6]/20">No drinks found</p>
                <p className="text-[#F5EFE6]/15 text-sm mt-2">Try a different search term</p>
              </div>
            )}
          </>
        ) : (
          // Popular searches when empty
          <div>
            <p className="text-[#F5EFE6]/30 text-xs font-semibold uppercase tracking-wider mb-4">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {["Brown Sugar", "Matcha", "Passion Fruit", "Taro", "Osmanthus", "Boba", "Vegan", "Bestseller"].map(term => (
                <button key={term} onClick={() => setQuery(term)}
                  className="px-4 py-2 rounded-full bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.12)] text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.3)] transition-all text-sm">
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E0E0E] pt-24 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-[rgba(212,180,131,0.2)] border-t-[#D4B483] animate-spin" /></div>}>
      <SearchResults />
    </Suspense>
  );
}
