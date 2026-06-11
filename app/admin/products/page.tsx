"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, ToggleLeft, ToggleRight, X, Save, Search, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Category { id: string; name: string; slug: string; }
interface Drink {
  id: string; name: string; slug: string; description: string;
  price: number; image: string; isPopular: boolean; isAvailable: boolean;
  isSeasonal: boolean; rating: number; reviewCount: number; badges: string;
  calories: number; category: Category;
}

const DEFAULT_FORM = {
  name: "", slug: "", description: "", price: "", image: "",
  longDesc: "", ingredients: "", badges: "", calories: "",
  isPopular: false, isAvailable: true, isSeasonal: false, categoryId: "",
};

export default function AdminProductsPage() {
  const { toast } = useToast();
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [form, setForm] = useState<typeof DEFAULT_FORM>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch("/api/menu")
      .then(r => r.json())
      .then(data => {
        setDrinks(data.drinks ?? []);
        setCategories(data.categories ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setEditingSlug(null);
    setShowForm(true);
  };

  const openEdit = (d: Drink) => {
    setForm({
      name: d.name, slug: d.slug, description: d.description,
      price: String(d.price), image: d.image,
      longDesc: "", ingredients: "", badges: d.badges ?? "",
      calories: String(d.calories ?? ""),
      isPopular: d.isPopular, isAvailable: d.isAvailable, isSeasonal: d.isSeasonal,
      categoryId: d.category.id,
    });
    setEditingSlug(d.slug);
    setShowForm(true);
  };

  const toggleAvailability = async (d: Drink) => {
    await fetch(`/api/menu/${d.slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !d.isAvailable }),
    });
    setDrinks(prev => prev.map(x => x.id === d.id ? { ...x, isAvailable: !x.isAvailable } : x));
    toast({ title: `${d.name} ${!d.isAvailable ? "enabled" : "hidden"}`, variant: "success" });
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.categoryId) {
      toast({ title: "Fill in name, price, and category", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const body = {
        ...form, slug,
        price: parseFloat(form.price),
        calories: form.calories ? parseInt(form.calories) : 0,
      };

      const url = editingSlug ? `/api/menu/${editingSlug}` : "/api/menu";
      const method = editingSlug ? "PATCH" : "POST";

      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }

      toast({ title: editingSlug ? "Product updated!" : "Product created!", variant: "success" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast({ title: "Save failed", description: err instanceof Error ? err.message : "Try again", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const update = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggle = (k: string) => () => setForm(f => ({ ...f, [k]: !(f as any)[k] }));

  const filtered = search ? drinks.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.name.toLowerCase().includes(search.toLowerCase())
  ) : drinks;

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all";
  const labelClass = "text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-1.5";

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-2">Admin</p>
            <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Products</h1>
            <p className="text-[#F5EFE6]/30 text-sm mt-1">{drinks.length} drinks · {categories.length} categories</p>
          </div>
          <motion.button
            onClick={openAdd}
            className="mt-2 flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all text-sm"
            whileHover={{ scale: 1.04 }}
          >
            <Plus size={16} /> Add Product
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[rgba(212,180,131,0.05)] border border-[rgba(212,180,131,0.12)] focus:border-[rgba(212,180,131,0.35)] outline-none text-[#F5EFE6] placeholder-[#F5EFE6]/25 text-sm transition-all"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#161616] overflow-hidden">
                <div className="aspect-[4/3] bg-[rgba(212,180,131,0.04)] animate-pulse" />
                <div className="p-3 space-y-2">
                  <div className="h-3 rounded bg-[rgba(212,180,131,0.06)] animate-pulse" />
                  <div className="h-4 rounded bg-[rgba(212,180,131,0.04)] animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((drink, i) => (
              <motion.div
                key={drink.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn("bg-[#161616] border rounded-2xl overflow-hidden transition-all group",
                  drink.isAvailable ? "border-[rgba(212,180,131,0.1)]" : "border-red-500/15 opacity-55"
                )}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A]">
                  {drink.image && (
                    <Image src={drink.image} alt={drink.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="200px" unoptimized />
                  )}
                  {!drink.isAvailable && (
                    <div className="absolute inset-0 bg-[#0E0E0E]/60 flex items-center justify-center">
                      <span className="text-red-400 text-xs font-semibold">Hidden</span>
                    </div>
                  )}
                  {drink.isPopular && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(14,14,14,0.8)] border border-[rgba(212,180,131,0.3)]">
                      <Sparkles size={8} className="text-[#D4B483]" />
                      <span className="text-[#D4B483] text-[8px] font-semibold">Popular</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[#D4B483]/50 text-[9px] font-semibold uppercase tracking-wider mb-0.5">{drink.category.name}</p>
                  <h3 className="text-sm font-semibold text-[#F5EFE6] line-clamp-2 leading-snug">{drink.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-display font-bold text-[#D4B483] text-sm">RM {drink.price.toFixed(2)}</span>
                    {drink.rating > 0 && <span className="text-[#F5EFE6]/30 text-[10px]">★ {drink.rating.toFixed(1)}</span>}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => openEdit(drink)}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-[rgba(212,180,131,0.07)] border border-[rgba(212,180,131,0.14)] text-[#F5EFE6]/60 hover:text-[#D4B483] transition-all text-xs"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => toggleAvailability(drink)}
                      className="p-1.5 rounded-lg bg-[rgba(212,180,131,0.07)] border border-[rgba(212,180,131,0.14)] hover:border-[rgba(212,180,131,0.3)] transition-all"
                      title={drink.isAvailable ? "Hide from menu" : "Show on menu"}
                    >
                      {drink.isAvailable
                        ? <ToggleRight size={14} className="text-green-400" />
                        : <ToggleLeft size={14} className="text-red-400" />
                      }
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#0E0E0E]/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.93, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 30 }}
              className="bg-[#161616] rounded-3xl border border-[rgba(212,180,131,0.18)] p-7 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-[#F5EFE6]">
                  {editingSlug ? "Edit Product" : "Add New Product"}
                </h2>
                <button onClick={() => setShowForm(false)} className="text-[#F5EFE6]/40 hover:text-[#F5EFE6] transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Product Name *</label>
                  <input type="text" value={form.name} onChange={update("name")} placeholder="e.g. Brown Sugar Boba" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>URL Slug</label>
                  <input type="text" value={form.slug} onChange={update("slug")} placeholder="auto-generated" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Price (RM) *</label>
                  <input type="number" step="0.1" min="0" value={form.price} onChange={update("price")} placeholder="16.90" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Category *</label>
                  <select value={form.categoryId} onChange={update("categoryId")} className={inputClass}>
                    <option value="" className="bg-[#1A1A1A]">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-[#1A1A1A]">{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Calories</label>
                  <input type="number" value={form.calories} onChange={update("calories")} placeholder="280" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Short Description</label>
                  <textarea value={form.description} onChange={update("description")} rows={2} placeholder="Brief description shown in menu grid..." className={inputClass + " resize-none"} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Image URL</label>
                  <input type="text" value={form.image} onChange={update("image")} placeholder="https://images.pexels.com/..." className={inputClass} />
                  {form.image && (
                    <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-[rgba(212,180,131,0.15)]">
                      <Image src={form.image} alt="Preview" fill className="object-cover" sizes="80px" unoptimized />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Ingredients (comma-separated)</label>
                  <input type="text" value={form.ingredients} onChange={update("ingredients")} placeholder="Ceylon Black Tea, Whole Milk, Brown Sugar Syrup" className={inputClass} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Badges (comma-separated)</label>
                  <input type="text" value={form.badges} onChange={update("badges")} placeholder="Bestseller, Vegan, Premium" className={inputClass} />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex flex-wrap gap-4">
                  {[
                    { key: "isPopular", label: "⭐ Popular" },
                    { key: "isAvailable", label: "✅ Available on menu" },
                    { key: "isSeasonal", label: "🍂 Seasonal item" },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
                      <div
                        onClick={toggle(key)}
                        className={cn("w-10 h-6 rounded-full flex items-center px-0.5 transition-all cursor-pointer",
                          (form as any)[key] ? "bg-[#D4B483]" : "bg-[rgba(212,180,131,0.1)] border border-[rgba(212,180,131,0.2)]"
                        )}
                      >
                        <motion.div
                          className="w-5 h-5 rounded-full bg-white shadow-sm"
                          animate={{ x: (form as any)[key] ? 16 : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                      <span className="text-sm text-[#F5EFE6]/60 group-hover:text-[#F5EFE6] transition-colors">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <motion.button
                onClick={handleSave}
                disabled={saving}
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
              >
                {saving ? (<><span className="w-4 h-4 border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E] rounded-full animate-spin" /> Saving...</>) : (<><Save size={15} /> {editingSlug ? "Save Changes" : "Create Product"}</>)}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
