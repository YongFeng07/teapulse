"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MapPin, Plus, Pencil, Trash2, Star, User, Phone } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading";
import { AddressForm } from "@/components/profile/address-form";
import { useToast } from "@/hooks/use-toast";

interface Address {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { toast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editAddr, setEditAddr] = useState<Address | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) setAddresses(await res.json());
    } catch { /* */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSave = async (data: any) => {
    setSaving(true);
    try {
      if (editAddr) {
        const res = await fetch(`/api/user/addresses/${editAddr.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast({ title: "Address updated!", variant: "success" });
          setEditAddr(null);
        }
      } else {
        const res = await fetch("/api/user/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          toast({ title: "Address added!", variant: "success" });
          setShowForm(false);
        }
      }
      fetchAddresses();
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Address deleted", variant: "success" });
        fetchAddresses();
      }
    } catch { toast({ title: "Failed", variant: "destructive" }); }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[680px] mx-auto px-5 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/dashboard/profile" className="inline-flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm mb-3">
            <ArrowLeft size={14} /> Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">My Addresses</p>
              <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Saved Addresses</h1>
            </div>
            <motion.button
              onClick={() => { setShowForm(!showForm); setEditAddr(null); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Plus size={15} /> Add New
            </motion.button>
          </div>
        </motion.div>

        <AnimatePresence>
          {showForm && (
            <div className="mb-5">
              <AddressForm onSave={handleSave} onCancel={() => setShowForm(false)} saving={saving} />
            </div>
          )}
          {editAddr && (
            <div className="mb-5">
              <AddressForm initial={editAddr} onSave={handleSave} onCancel={() => setEditAddr(null)} saving={saving} />
            </div>
          )}
        </AnimatePresence>

        {addresses.length === 0 && !showForm ? (
          <div className="bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-2xl p-12 text-center">
            <MapPin size={36} className="mx-auto text-[#F5EFE6]/10 mb-4" />
            <p className="text-[#F5EFE6]/30 font-display text-xl">No saved addresses</p>
            <p className="text-[#F5EFE6]/20 text-sm mt-2">Add an address for faster checkout</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <motion.div
                key={addr.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#161616] border border-[rgba(212,180,131,0.08)] rounded-2xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[rgba(212,180,131,0.08)] flex items-center justify-center shrink-0">
                      <MapPin size={16} className="text-[#D4B483]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-[#F5EFE6] text-sm">{addr.recipientName}</p>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(212,180,131,0.1)] text-[#D4B483]">{addr.label}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[rgba(16,185,129,0.1)] text-[#10B981] flex items-center gap-1">
                            <Star size={8} /> Default
                          </span>
                        )}
                      </div>
                      <p className="text-[#F5EFE6]/30 text-xs flex items-center gap-1"><Phone size={10} /> {addr.phone}</p>
                      <p className="text-[#F5EFE6]/40 text-xs mt-1">
                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state}, {addr.postcode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditAddr(addr)} className="p-2 rounded-lg text-[#F5EFE6]/25 hover:text-[#D4B483] hover:bg-[rgba(212,180,131,0.06)] transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="p-2 rounded-lg text-[#F5EFE6]/25 hover:text-red-400 hover:bg-red-500/6 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
