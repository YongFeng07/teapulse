"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Clock, Tag, BookOpen, Heart } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { ShareButton } from "@/components/ui/share-button";

interface Post {
  title: string; slug: string; excerpt: string; content: string;
  coverImage: string; author: string; publishedAt: string;
}

function estimateReadTime(content: string): number {
  return Math.max(1, Math.ceil(content?.split(/\s+/).length / 200));
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`).then(r => r.json())
      .then(data => { setPost(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullPage />;
  if (!post) return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 flex items-center justify-center">
      <div className="text-center">
        <BookOpen size={40} className="mx-auto text-[#F5EFE6]/10 mb-4" />
        <p className="font-display text-2xl text-[#F5EFE6]/20">Article not found</p>
        <Link href="/blog" className="text-[#D4B483] text-sm mt-3 inline-block hover:underline">← Back to Journal</Link>
      </div>
    </div>
  );

  const readTime = estimateReadTime(post.content || "");

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <article className="max-w-[820px] mx-auto px-5 md:px-10">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-xs text-[#F5EFE6]/25 mb-8">
          <Link href="/" className="hover:text-[#D4B483] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-[#D4B483] transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-[#F5EFE6]/40">{post.title}</span>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Category pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] text-[#D4B483] text-[10px] font-semibold uppercase tracking-wider mb-4">
            <Tag size={10} /> Article
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-[#F5EFE6] leading-tight mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-[#F5EFE6]/30 text-sm mb-8 pb-8 border-b border-[rgba(212,180,131,0.08)]">
            <span className="flex items-center gap-1.5"><User size={13} className="text-[#D4B483]/50" /> {post.author}</span>
            <span className="text-[#F5EFE6]/15">|</span>
            <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#D4B483]/50" /> {new Date(post.publishedAt).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="text-[#F5EFE6]/15">|</span>
            <span className="flex items-center gap-1.5"><Clock size={13} className="text-[#D4B483]/50" /> {readTime} min read</span>
            <div className="ml-auto">
              <ShareButton title={post.title} variant="button" />
            </div>
          </div>
        </motion.div>

        {/* Cover image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-10"
        >
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="820px" unoptimized priority />
          <div className="absolute inset-0 border border-[rgba(212,180,131,0.06)] rounded-3xl" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert max-w-none"
        >
          <div className="text-[#F5EFE6]/55 leading-relaxed whitespace-pre-wrap text-base font-light"
            style={{ lineHeight: "1.9" }}>
            {post.content}
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 pt-8 border-t border-[rgba(212,180,131,0.08)] flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[rgba(212,180,131,0.08)] flex items-center justify-center text-sm">
              {post.author?.charAt(0) || "T"}
            </div>
            <div>
              <p className="text-sm font-medium text-[#F5EFE6]">{post.author}</p>
              <p className="text-[#F5EFE6]/25 text-xs">Tea Pulse Contributor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShareButton title={post.title} variant="button" />
          </div>
        </motion.div>

        {/* Related posts placeholder */}
        <div className="mt-10 pt-8 border-t border-[rgba(212,180,131,0.06)]">
          <Link href="/blog" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.12)] text-[#D4B483] text-sm font-semibold hover:bg-[rgba(212,180,131,0.08)] transition-all">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>
        </div>
      </article>
    </div>
  );
}
