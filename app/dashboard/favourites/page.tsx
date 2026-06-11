"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Star, Sparkles } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface Drink {
  id: string; name: string; slug: string; description: string;
  price: number; image: string; rating: number; reviewCount: number;
  badges: string; category: { name: string };
}

export default function FavouritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/favourites")
      .then(r => r.json())
      .then(data => { setDrinks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [status]);

  const removeFavourite = async (drink: Drink) => {
    setRemoving(drink.id);
    await fetch("/api/user/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drinkId: drink.id }),
    });
    setDrinks(prev => prev.filter(d => d.id !== drink.id));
    setRemoving(null);
    toast({ title: "Removed from favourites", variant: "success" });
  };

  const quickAdd = (drink: Drink) => {
    addItem({ drinkId: drink.id, name: drink.name, image: drink.image, price: drink.price, quantity: 1, sugarLevel: "100%", iceLevel: "Normal", toppings: [] });
    toast({ title: `${drink.name} added! 🧋`, variant: "success" });
  };

  if (status === "loading" || loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[1000px] mx-auto px-5 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">My Account</p>
          <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">
            My <span className="italic" style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #D4B483, #E8D5B0)", backgroundClip: "text" }}>Favourites</span>
          </h1>
          <p className="text-[#F5EFE6]/30 mt-2 text-sm">{drinks.length} saved drink{drinks.length !== 1 ? "s" : ""}</p>
        </motion.div>

        {drinks.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-[rgba(212,180,131,0.06)] flex items-center justify-center mx-auto mb-5">
              <Heart size={32} className="text-[#F5EFE6]/15" />
            </div>
            <p className="font-display text-2xl text-[#F5EFE6]/25">No favourites yet</p>
            <p className="text-[#F5EFE6]/15 text-sm mt-2">Tap the heart on any drink to save it here</p>
            <Link href="/menu">
              <motion.button className="mt-6 px-6 py-3 rounded-full bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all" whileHover={{ scale: 1.04 }}>
                Browse Menu
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <AnimatePresence>
              {drinks.map((drink, i) => (
                <motion.div key={drink.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl overflow-hidden group hover:border-[rgba(212,180,131,0.25)] transition-all"
                >
                  <Link href={`/menu/${drink.slug}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
                      <Image src={drink.image} alt={drink.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="300px" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent" />
                      {drink.rating > 0 && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(212,180,131,0.2)]">
                          <Star size={10} fill="#D4B483" className="text-[#D4B483]" />
                          <span className="text-[#F5EFE6] text-xs font-bold">{drink.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <p className="text-[#D4B483]/50 text-[9px] font-semibold uppercase tracking-wider mb-1">{drink.category.name}</p>
                    <Link href={`/menu/${drink.slug}`}>
                      <h3 className="font-display text-base font-semibold text-[#F5EFE6] line-clamp-1 hover:text-[#D4B483] transition-colors">{drink.name}</h3>
                    </Link>
                    <p className="text-[#F5EFE6]/35 text-xs mt-1 line-clamp-2">{drink.description}</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-display font-bold text-[#D4B483]">RM {drink.price.toFixed(2)}</span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => removeFavourite(drink)}
                          disabled={removing === drink.id}
                          className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-all"
                          whileTap={{ scale: 0.9 }}
                        >
                          <Heart size={13} fill="currentColor" />
                        </motion.button>
                        <motion.button
                          onClick={() => quickAdd(drink)}
                          className="w-8 h-8 rounded-full bg-[#D4B483] flex items-center justify-center text-[#0E0E0E] hover:bg-[#E8D5B0] transition-all"
                          whileTap={{ scale: 0.9 }}
                        >
                          <ShoppingBag size={13} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
