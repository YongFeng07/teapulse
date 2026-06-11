"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Minus, Plus, ShoppingBag, Star, Check,
  Heart, Award, ChevronDown, Flame, Leaf, Share2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { SUGAR_LEVELS, ICE_LEVELS, TOPPINGS, TOPPING_PRICE } from "@/types";
import { VisualDrinkBuilder } from "@/components/menu/visual-drink-builder";
import { RelatedDrinks } from "@/components/menu/related-drinks";
import type { DrinkWithCategory, ReviewType, SugarLevel, IceLevel, Topping } from "@/types";
import { cn } from "@/lib/utils";

const TOPPING_LABELS: Record<Topping, string> = {
  pearls: "Tapioca Pearls +RM2.50",
  jelly: "Grass Jelly +RM2.50",
  pudding: "Egg Pudding +RM2.50",
};

function StarRating({ value, size = 14, interactive = false, onChange }: {
  value: number; size?: number; interactive?: boolean; onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = interactive ? hovered || value : value;
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <motion.button key={i} type="button"
          onClick={() => interactive && onChange?.(i)}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          whileHover={interactive ? { scale: 1.2 } : {}}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star size={size} fill={i <= display ? "#D4B483" : "transparent"}
            className={i <= display ? "text-[#D4B483]" : "text-[#F5EFE6]/15"} />
        </motion.button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ReviewType }) {
  return (
    <div className="bg-[#1A1A1A] border border-[rgba(212,180,131,0.08)] rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[rgba(212,180,131,0.12)] flex items-center justify-center shrink-0">
            <span className="text-[#D4B483] font-bold text-sm">{review.user.name[0].toUpperCase()}</span>
          </div>
          <div>
            <p className="text-[#F5EFE6] text-sm font-semibold">{review.user.name}</p>
            <p className="text-[#F5EFE6]/30 text-xs">{new Date(review.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
        <StarRating value={review.rating} size={12} />
      </div>
      <p className="text-[#F5EFE6]/60 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
}

function RelatedDrinks({ currentSlug, categorySlug }: { currentSlug: string; categorySlug: string }) {
  const [drinks, setDrinks] = useState<DrinkWithCategory[]>([]);
  useEffect(() => {
    fetch(`/api/menu?category=${categorySlug}`)
      .then(r => r.json())
      .then(data => setDrinks((data.drinks ?? []).filter((d: DrinkWithCategory) => d.slug !== currentSlug).slice(0, 4)))
      .catch(() => {});
  }, [currentSlug, categorySlug]);
  if (!drinks.length) return null;
  return (
    <div className="mt-16 border-t border-[rgba(212,180,131,0.08)] pt-12">
      <h2 className="font-display text-2xl font-bold text-[#F5EFE6] mb-6">You might also like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {drinks.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Link href={`/menu/${d.slug}`} className="group block">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A1A1A] border border-[rgba(212,180,131,0.08)] group-hover:border-[rgba(212,180,131,0.25)] transition-all mb-3">
                <Image src={d.image} alt={d.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="200px" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/60 to-transparent" />
              </div>
              <p className="text-[#D4B483]/50 text-[9px] font-semibold uppercase tracking-wider mb-0.5">{d.category.name}</p>
              <p className="text-[#F5EFE6] text-sm font-semibold line-clamp-2 group-hover:text-[#D4B483] transition-colors">{d.name}</p>
              <p className="font-display font-bold text-[#D4B483] text-sm mt-1">RM {d.price.toFixed(2)}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function DrinkDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [drink, setDrink] = useState<DrinkWithCategory | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [sugar, setSugar] = useState<SugarLevel>("100%");
  const [ice, setIce] = useState<IceLevel>("Normal");
  const [toppings, setToppings] = useState<Topping[]>([]);
  const [added, setAdded] = useState(false);
  const [favourited, setFavourited] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/menu/${params.slug}`).then(r => r.json()),
      fetch(`/api/menu/${params.slug}/reviews`).then(r => r.json()),
      session ? fetch("/api/user/favourites").then(r => r.json()) : Promise.resolve([]),
    ]).then(([drinkData, reviewsData, favsData]) => {
      setDrink(drinkData?.id ? drinkData : null);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      if (Array.isArray(favsData)) {
        setFavourited(favsData.some((f: any) => f.slug === params.slug));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [params.slug, session]);

  const toggleFavourite = async () => {
    if (!session) { toast({ title: "Sign in to save favourites", variant: "destructive" }); return; }
    if (!drink) return;
    const res = await fetch("/api/user/favourites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drinkId: drink.id }),
    });
    const data = await res.json();
    setFavourited(data.favourited);
    toast({ title: data.favourited ? "💖 Saved to favourites" : "Removed from favourites", variant: "success" });
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({ title: drink?.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!", variant: "success" });
    }
  };

  const toggleTopping = (t: Topping) =>
    setToppings(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const toppingsCost = toppings.length * TOPPING_PRICE;
  const displayPrice = drink ? drink.price + toppingsCost : 0;
  const lineTotal = displayPrice * qty;

  const handleAdd = () => {
    if (!drink) return;
    addItem({ drinkId: drink.id, name: drink.name, image: drink.image, price: drink.price, quantity: qty, sugarLevel: sugar, iceLevel: ice, toppings });
    setAdded(true);
    toast({ title: `${drink.name} added! 🧋`, description: `×${qty} · RM ${lineTotal.toFixed(2)}`, variant: "success" });
    setTimeout(() => setAdded(false), 2500);
  };

  const handleReviewSubmit = async () => {
    if (!newComment.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/menu/${params.slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: newRating, comment: newComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReviews(p => [data, ...p]);
      setShowReviewForm(false);
      setNewComment(""); setNewRating(5);
      toast({ title: "Review posted! ⭐", variant: "success" });
    } catch (err) {
      toast({ title: "Failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
      <motion.div className="w-8 h-8 rounded-full border-2 border-[rgba(212,180,131,0.2)] border-t-[#D4B483]"
        animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
    </div>
  );

  if (!drink) return (
    <div className="min-h-screen bg-[#0E0E0E] flex flex-col items-center justify-center gap-4">
      <p className="font-display text-2xl text-[#F5EFE6]/30">Drink not found</p>
      <Link href="/menu" className="text-[#D4B483] text-sm hover:underline">← Back to Menu</Link>
    </div>
  );

  const badges = drink.badges ? drink.badges.split(",").map(b => b.trim()).filter(Boolean) : [];
  const ingredients = drink.ingredients ? drink.ingredients.split(",").map(i => i.trim()).filter(Boolean) : [];
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : drink.rating;
  const ratingDist = [5,4,3,2,1].map(n => ({ stars: n, count: reviews.filter(r => r.rating === n).length }));

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-32">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Back + actions */}
        <div className="flex items-center justify-between mt-6 mb-8">
          <motion.button onClick={() => router.back()}
            className="flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm font-medium"
            whileHover={{ x: -3 }}>
            <ArrowLeft size={14} /> Menu
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.button onClick={shareLink}
              className="w-9 h-9 rounded-full bg-[rgba(212,180,131,0.07)] border border-[rgba(212,180,131,0.15)] flex items-center justify-center text-[#F5EFE6]/50 hover:text-[#D4B483] transition-all"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Share2 size={14} />
            </motion.button>
            <motion.button onClick={toggleFavourite}
              className={cn("w-9 h-9 rounded-full border flex items-center justify-center transition-all",
                favourited ? "bg-red-500/15 border-red-500/30 text-red-400" : "bg-[rgba(212,180,131,0.07)] border-[rgba(212,180,131,0.15)] text-[#F5EFE6]/50 hover:text-red-400"
              )}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Heart size={14} fill={favourited ? "currentColor" : "none"} />
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Image ── */}
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative aspect-[3/4] max-h-[450px] rounded-3xl overflow-hidden bg-[#161616] border border-[rgba(212,180,131,0.1)] group">
              <Image src={drink.image} alt={drink.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 400px" priority unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E]/50 via-transparent to-transparent" />
              <div className="absolute top-5 left-5 flex flex-wrap gap-2">
                {drink.isPopular && (
                  <motion.div animate={{ y: [0,-4,0] }} transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(212,180,131,0.3)]">
                    <Flame size={11} className="text-orange-400" />
                    <span className="text-[#D4B483] text-[10px] font-semibold uppercase tracking-wide">Popular</span>
                  </motion.div>
                )}
                {drink.isSeasonal && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(74,222,128,0.3)]">
                    <Leaf size={11} className="text-green-400" />
                    <span className="text-green-400 text-[10px] font-semibold uppercase tracking-wide">Seasonal</span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(14,14,14,0.8)] backdrop-blur-sm border border-[rgba(212,180,131,0.2)]">
                <Star size={11} fill="#D4B483" className="text-[#D4B483]" />
                <span className="text-[#F5EFE6] text-sm font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-[#F5EFE6]/40 text-xs">({reviews.length || drink.reviewCount})</span>
              </div>
            </div>
            {drink.calories > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Calories", value: `${drink.calories} kcal` },
                  { label: "Category", value: drink.category.name },
                  { label: "Size", value: "500ml" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#161616] border border-[rgba(212,180,131,0.07)] rounded-xl p-3 text-center">
                    <p className="text-[#D4B483] font-semibold text-sm">{value}</p>
                    <p className="text-[#F5EFE6]/30 text-[10px] mt-0.5 uppercase tracking-wide">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* ── Info + Customise ── */}
          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap mb-3">
              <span className="text-[#D4B483]/60 text-[11px] font-semibold uppercase tracking-wider">{drink.category.name}</span>
              {badges.map(b => (
                <span key={b} className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-[rgba(212,180,131,0.1)] text-[#D4B483] font-medium">
                  <Award size={9} /> {b}
                </span>
              ))}
            </div>

            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE6] leading-tight">{drink.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <StarRating value={Math.round(avgRating)} size={16} />
              <span className="text-[#D4B483] font-bold">{avgRating.toFixed(1)}</span>
              <span className="text-[#F5EFE6]/30 text-sm">{reviews.length || drink.reviewCount} reviews</span>
            </div>

            <p className="text-[#F5EFE6]/50 mt-4 leading-relaxed text-sm">{drink.description}</p>

            {drink.longDesc && (
              <div className="mt-3">
                <AnimatePresence initial={false}>
                  {showFullDesc && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="text-[#F5EFE6]/40 text-sm leading-relaxed pb-3">{drink.longDesc}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button onClick={() => setShowFullDesc(v => !v)} className="flex items-center gap-1.5 text-[#D4B483] text-xs font-medium hover:underline">
                  {showFullDesc ? "Show less" : "Read full description"}
                  <ChevronDown size={12} className={cn("transition-transform", showFullDesc && "rotate-180")} />
                </button>
              </div>
            )}

            <div className="mt-5 flex items-end gap-2">
              <span className="font-display text-4xl font-bold text-[#D4B483]">RM {displayPrice.toFixed(2)}</span>
              {toppingsCost > 0 && <span className="text-[#F5EFE6]/30 text-xs mb-1.5">+RM {toppingsCost.toFixed(2)} add-ons</span>}
            </div>

            {ingredients.length > 0 && (
              <div className="mt-5 pt-5 border-t border-[rgba(212,180,131,0.08)]">
                <p className="text-[#F5EFE6]/30 text-[11px] font-semibold uppercase tracking-wider mb-2.5">Ingredients</p>
                <div className="flex flex-wrap gap-1.5">
                  {ingredients.map(ing => (
                    <span key={ing} className="text-xs px-2.5 py-1 rounded-full bg-[rgba(212,180,131,0.06)] border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/50">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Visual Drink Preview */}
            <div className="mt-5 pt-5 border-t border-[rgba(212,180,131,0.08)]">
              <VisualDrinkBuilder
                sugarLevel={sugar}
                iceLevel={ice}
                toppings={toppings}
                calories={drink.calories}
              />
            </div>

            <div className="mt-5 pt-5 border-t border-[rgba(212,180,131,0.08)] space-y-5">
              {/* Sugar */}
              <div>
                <p className="text-[#F5EFE6]/30 text-[11px] font-semibold uppercase tracking-wider mb-3">Sugar Level</p>
                <div className="flex flex-wrap gap-2">
                  {SUGAR_LEVELS.map(s => (
                    <motion.button key={s} onClick={() => setSugar(s)}
                      className={cn("px-4 py-2 rounded-full text-sm font-medium border transition-all",
                        sugar === s ? "bg-[#D4B483] text-[#0E0E0E] border-[#D4B483]" : "border-[rgba(212,180,131,0.18)] text-[#F5EFE6]/50 hover:border-[rgba(212,180,131,0.4)] hover:text-[#D4B483]"
                      )}
                      whileTap={{ scale: 0.95 }}>
                      {s}
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* Ice */}
              <div>
                <p className="text-[#F5EFE6]/30 text-[11px] font-semibold uppercase tracking-wider mb-3">Ice Level</p>
                <div className="flex flex-wrap gap-2">
                  {ICE_LEVELS.map(i => (
                    <motion.button key={i} onClick={() => setIce(i)}
                      className={cn("px-4 py-2 rounded-full text-sm font-medium border transition-all",
                        ice === i ? "bg-[#D4B483] text-[#0E0E0E] border-[#D4B483]" : "border-[rgba(212,180,131,0.18)] text-[#F5EFE6]/50 hover:border-[rgba(212,180,131,0.4)] hover:text-[#D4B483]"
                      )}
                      whileTap={{ scale: 0.95 }}>
                      {i}
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* Toppings */}
              <div>
                <p className="text-[#F5EFE6]/30 text-[11px] font-semibold uppercase tracking-wider mb-3">Add-ons</p>
                <div className="flex flex-wrap gap-2">
                  {TOPPINGS.map(t => (
                    <motion.button key={t} type="button" onClick={() => toggleTopping(t)}
                      className={cn("flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all",
                        toppings.includes(t) ? "bg-[#D4B483] text-[#0E0E0E] border-[#D4B483]" : "border-[rgba(212,180,131,0.18)] text-[#F5EFE6]/50 hover:border-[rgba(212,180,131,0.4)] hover:text-[#D4B483]"
                      )}
                      whileTap={{ scale: 0.95 }}>
                      {toppings.includes(t) && <Check size={11} />}
                      {TOPPING_LABELS[t]}
                    </motion.button>
                  ))}
                </div>
              </div>
              {/* Qty */}
              <div>
                <p className="text-[#F5EFE6]/30 text-[11px] font-semibold uppercase tracking-wider mb-3">Quantity</p>
                <div className="flex items-center gap-4">
                  <motion.button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-9 h-9 rounded-full border border-[rgba(212,180,131,0.2)] flex items-center justify-center text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.4)] transition-all"
                    whileTap={{ scale: 0.88 }}>
                    <Minus size={13} />
                  </motion.button>
                  <span className="font-display text-2xl font-bold text-[#F5EFE6] w-8 text-center">{qty}</span>
                  <motion.button onClick={() => setQty(q => Math.min(9, q + 1))}
                    className="w-9 h-9 rounded-full border border-[rgba(212,180,131,0.2)] flex items-center justify-center text-[#F5EFE6]/50 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.4)] transition-all"
                    whileTap={{ scale: 0.88 }}>
                    <Plus size={13} />
                  </motion.button>
                </div>
              </div>
            </div>

            <motion.button onClick={handleAdd}
              className={cn("mt-7 w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-base transition-all duration-300",
                added ? "bg-green-500/12 border border-green-500/30 text-green-400" : "bg-[#D4B483] text-[#0E0E0E] hover:bg-[#E8D5B0]"
              )}
              style={!added ? { boxShadow: "0 0 30px rgba(212,180,131,0.25)" } : {}}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span key="added" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Check size={18} /> Added to Cart!
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <ShoppingBag size={18} /> Add to Cart · RM {lineTotal.toFixed(2)}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>

        {/* ── Related ── */}
        <RelatedDrinks currentSlug={drink.slug} categorySlug={drink.category.slug} />

        {/* ── Reviews ── */}
        <div className="mt-16 border-t border-[rgba(212,180,131,0.08)] pt-12">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-[#F5EFE6]">Customer Reviews</h2>
              <div className="flex items-center gap-3 mt-2">
                <StarRating value={Math.round(avgRating)} size={18} />
                <span className="font-display text-2xl font-bold text-[#D4B483]">{avgRating.toFixed(1)}</span>
                <span className="text-[#F5EFE6]/30 text-sm">{reviews.length || drink.reviewCount} reviews</span>
              </div>
            </div>
            {reviews.length > 0 && (
              <div className="space-y-1.5 min-w-[200px]">
                {ratingDist.map(({ stars, count }) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-xs text-[#F5EFE6]/30 w-3">{stars}</span>
                    <Star size={10} fill="#D4B483" className="text-[#D4B483]" />
                    <div className="flex-1 h-1.5 rounded-full bg-[rgba(212,180,131,0.08)] overflow-hidden">
                      <motion.div className="h-full rounded-full bg-[#D4B483]"
                        initial={{ width: 0 }}
                        animate={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%" }}
                        transition={{ duration: 0.8, delay: 0.3 }} />
                    </div>
                    <span className="text-xs text-[#F5EFE6]/25 w-4">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Write review */}
          {session ? (
            <div className="mb-8">
              {!showReviewForm ? (
                <motion.button onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 rounded-xl border border-[rgba(212,180,131,0.2)] text-[#D4B483] text-sm font-medium hover:bg-[rgba(212,180,131,0.06)] transition-all"
                  whileHover={{ scale: 1.02 }}>
                  ✍️ Write a Review
                </motion.button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-[#161616] border border-[rgba(212,180,131,0.14)] rounded-2xl p-6">
                  <h3 className="font-semibold text-[#F5EFE6] mb-4">Your Review</h3>
                  <div className="mb-4">
                    <p className="text-[#F5EFE6]/40 text-xs mb-2 uppercase tracking-wider">Rating</p>
                    <StarRating value={newRating} size={28} interactive onChange={setNewRating} />
                  </div>
                  <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
                    placeholder="Share your honest experience..."
                    rows={4}
                    className="w-full bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.12)] focus:border-[rgba(212,180,131,0.35)] rounded-xl px-4 py-3 text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none resize-none transition-all mb-4" />
                  <div className="flex gap-3">
                    <motion.button onClick={handleReviewSubmit} disabled={submittingReview || !newComment.trim()}
                      className="px-6 py-2.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}>
                      {submittingReview ? "Posting..." : "Post Review"}
                    </motion.button>
                    <button onClick={() => setShowReviewForm(false)} className="px-6 py-2.5 text-sm text-[#F5EFE6]/40 hover:text-[#F5EFE6] transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="mb-8 p-4 rounded-xl bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.1)]">
              <p className="text-[#F5EFE6]/40 text-sm">
                <Link href="/login" className="text-[#D4B483] hover:underline">Sign in</Link> to write a review
              </p>
            </div>
          )}

          {reviews.length === 0 ? (
            <p className="text-[#F5EFE6]/25 text-sm">No reviews yet — be the first!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r, i) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <ReviewCard review={r} />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Related drinks */}
        <RelatedDrinks />
      </div>

      {/* Sticky bottom CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0E0E0E]/95 backdrop-blur-xl border-t border-[rgba(212,180,131,0.1)] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[#F5EFE6] font-semibold text-sm truncate">{drink.name}</p>
            <p className="font-display font-bold text-[#D4B483]">RM {lineTotal.toFixed(2)}</p>
          </div>
          <motion.button onClick={handleAdd}
            className={cn("flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm shrink-0 transition-all",
              added ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-[#D4B483] text-[#0E0E0E]"
            )}
            whileTap={{ scale: 0.97 }}>
            {added ? <><Check size={15} /> Added!</> : <><ShoppingBag size={15} /> Add to Cart</>}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
