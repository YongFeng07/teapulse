"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Navigation2 } from "lucide-react";
import dynamic from "next/dynamic";

const StoreMap = dynamic(() => import("@/components/stores/store-map").then(mod => mod.StoreMap), {
  ssr: false,
});

interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  openHours: string;
  lat: number;
  lng: number;
}

function StoreCard({ store, index }: { store: Store; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-3xl bg-[#161616] border border-[rgba(212,180,131,0.1)] hover:border-[rgba(212,180,131,0.3)] p-7 transition-all duration-400 hover:shadow-[0_20px_60px_rgba(212,180,131,0.07)]"
    >
      {/* Subtle glow on hover */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(212,180,131,0.06), transparent 70%)" }} />

      <div className="relative">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-[rgba(212,180,131,0.08)] flex items-center justify-center mb-5 group-hover:bg-[rgba(212,180,131,0.14)] transition-colors">
          <MapPin size={20} className="text-[#D4B483]" />
        </div>

        {/* Name */}
        <h2 className="font-display text-xl font-semibold text-[#F5EFE6] mb-1 group-hover:text-[#D4B483] transition-colors">
          {store.name}
        </h2>
        <p className="text-[#F5EFE6]/50 text-sm">{store.address}</p>
        <p className="text-[#D4B483]/60 text-xs font-semibold uppercase tracking-wider mt-0.5">{store.city}</p>

        {/* Details */}
        <div className="mt-5 space-y-2.5 border-t border-[rgba(212,180,131,0.07)] pt-5">
          <div className="flex items-center gap-2.5">
            <Phone size={13} className="text-[#D4B483]/60 shrink-0" />
            <span className="text-[#F5EFE6]/45 text-sm">{store.phone}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock size={13} className="text-[#D4B483]/60 shrink-0" />
            <span className="text-[#F5EFE6]/45 text-sm">{store.openHours}</span>
          </div>
        </div>

        {/* Directions */}
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(store.name + " " + store.address + " " + store.city)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-[#D4B483] text-sm font-medium hover:gap-3 transition-all duration-300 group/link"
        >
          <Navigation2 size={14} />
          Get Directions
        </a>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl bg-[#161616] border border-[rgba(212,180,131,0.06)] p-7 space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-[rgba(212,180,131,0.05)] animate-pulse" />
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-[rgba(212,180,131,0.06)] animate-pulse" />
        <div className="h-3 w-full rounded bg-[rgba(212,180,131,0.04)] animate-pulse" />
        <div className="h-3 w-20 rounded bg-[rgba(212,180,131,0.04)] animate-pulse" />
      </div>
    </div>
  );
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((data) => {
        setStores(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #D4B483, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-3">Find Us</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-[#F5EFE6] leading-tight">
            Our{" "}
            <span
              className="italic"
              style={{
                WebkitTextFillColor: "transparent",
                WebkitBackgroundClip: "text",
                backgroundImage: "linear-gradient(135deg, #D4B483, #E8D5B0, #A8895A)",
                backgroundClip: "text",
              }}
            >
              Locations
            </span>
          </h1>
          <p className="text-[#F5EFE6]/40 mt-4 text-base max-w-md">
            Premium tea experiences across Kuala Lumpur and Petaling Jaya. Order ahead, skip the queue.
          </p>
        </motion.div>

        {error ? (
          <div className="text-center py-20">
            <p className="text-[#F5EFE6]/30">Failed to load locations. Please try again.</p>
            <button onClick={() => window.location.reload()} className="mt-4 text-[#D4B483] text-sm hover:underline">
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {stores.length > 0 ? (
              <>
                <StoreMap stores={stores} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {stores.map((store, i) => (
                    <StoreCard key={store.id} store={store} index={i} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-[#F5EFE6]/30 font-display text-2xl">No locations found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
