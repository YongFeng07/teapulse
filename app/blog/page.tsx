"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Clock, User, Search, Sparkles, TrendingUp, Coffee } from "lucide-react";

interface BlogPost {
  slug: string; title: string; excerpt: string; coverImage: string;
  author: string; publishedAt: string; content?: string;
}

const CATEGORIES = [
  { key: "all", label: "All Posts", icon: Sparkles },
  { key: "tea", label: "Tea Culture", icon: Coffee },
  { key: "recipes", label: "Recipes", icon: TrendingUp },
  { key: "lifestyle", label: "Lifestyle", icon: Sparkles },
];

function estimateReadTime(content: string): number {
  const words = content?.split(/\s+/).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/blog?limit=50").then(r => r.json())
      .then(d => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter(p => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-28 pb-20">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] flex items-center justify-center">
              <Sparkles size={16} className="text-[#D4B483]" />
            </div>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider">Stories & Guides</p>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#F5EFE6] leading-tight">
            The Tea Pulse{" "}
            <span className="italic bg-gradient-to-r from-[#D4B483] via-[#E8D5B0] to-[#A8895A] bg-clip-text text-transparent">
              Journal
            </span>
          </h1>
          <p className="text-[#F5EFE6]/35 text-base mt-4 max-w-xl">
            Discover the art of tea, curated recipes, and stories from our tea masters.
          </p>
        </motion.div>

        {/* Search + Filter */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.12)] focus:border-[rgba(212,180,131,0.4)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  filter === key
                    ? "bg-[#D4B483] text-[#0E0E0E]"
                    : "bg-[rgba(255,255,255,0.03)] border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/45 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.2)]"
                }`}
              >
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            <div className="bg-[#161616] rounded-3xl h-80 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="bg-[#161616] rounded-2xl h-64 animate-pulse" />)}
            </div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <Coffee size={40} className="mx-auto text-[#F5EFE6]/10 mb-4" />
            <p className="font-display text-2xl text-[#F5EFE6]/20 mb-2">No articles yet</p>
            <p className="text-[#F5EFE6]/20 text-sm">Stories are brewing — check back soon!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featuredPost && !search && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mb-10"
              >
                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                  <div className="relative overflow-hidden rounded-3xl bg-[#161616] border border-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.2)] transition-all">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#161616] hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-transparent md:hidden" />
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 text-[#D4B483]/60 text-[10px] font-semibold uppercase tracking-wider mb-3">
                          <span className="flex items-center gap-1"><Sparkles size={11} /> Featured</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(featuredPost.publishedAt).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</span>
                        </div>
                        <h2 className="font-display text-2xl md:text-3xl font-bold text-[#F5EFE6] group-hover:text-[#D4B483] transition-colors mb-3 leading-tight">
                          {featuredPost.title}
                        </h2>
                        <p className="text-[#F5EFE6]/40 text-sm mb-4 line-clamp-2">{featuredPost.excerpt}</p>
                        <div className="flex items-center gap-3 text-[#F5EFE6]/25 text-xs">
                          <span className="flex items-center gap-1.5"><User size={12} /> {featuredPost.author}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {estimateReadTime(featuredPost.content || "")} min read</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gridPosts.map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block bg-[#161616] rounded-2xl overflow-hidden border border-[rgba(212,180,131,0.06)] hover:border-[rgba(212,180,131,0.2)] transition-all h-full">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/60 via-transparent to-transparent" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[#F5EFE6]/25 text-[10px] mb-2">
                        <Calendar size={10} />
                        {new Date(post.publishedAt).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                        <span>•</span>
                        <Clock size={10} />
                        {estimateReadTime(post.content || "")} min
                      </div>
                      <h3 className="font-display font-semibold text-[#F5EFE6] group-hover:text-[#D4B483] transition-colors mb-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-[#F5EFE6]/35 text-xs line-clamp-2 mb-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#F5EFE6]/20 text-[10px] flex items-center gap-1"><User size={10} /> {post.author}</span>
                        <span className="text-[#D4B483] text-[10px] font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read <ArrowRight size={10} />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Newsletter CTA */}
            {filteredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16 relative overflow-hidden rounded-3xl p-10 text-center"
                style={{
                  background: "linear-gradient(135deg, rgba(212,180,131,0.08), rgba(212,180,131,0.02))",
                  border: "1px solid rgba(212,180,131,0.15)",
                }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #D4B483, transparent 70%)", filter: "blur(30px)" }} />
                <div className="relative">
                  <p className="text-4xl mb-4">📬</p>
                  <h3 className="font-display text-2xl font-bold text-[#F5EFE6] mb-2">Stay in the loop</h3>
                  <p className="text-[#F5EFE6]/35 text-sm max-w-md mx-auto mb-6">
                    Get the latest tea stories, recipes, and exclusive offers delivered to your inbox.
                  </p>
                  <div className="flex gap-3 max-w-md mx-auto">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="flex-1 px-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.4)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all"
                    />
                    <motion.button
                      className="px-6 py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all shrink-0"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Subscribe
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
