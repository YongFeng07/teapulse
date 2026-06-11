"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, MapPin, User, Phone, Home, Building, Navigation } from "lucide-react";

const LABELS = [
  { value: "Home", icon: Home },
  { value: "Work", icon: Building },
  { value: "Other", icon: Navigation },
];

interface AddressFormData {
  label: string;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postcode: string;
  isDefault: boolean;
}

interface Props {
  initial?: Partial<AddressFormData>;
  onSave: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

export function AddressForm({ initial, onSave, onCancel, saving }: Props) {
  const [form, setForm] = useState<AddressFormData>({
    label: initial?.label || "Home",
    recipientName: initial?.recipientName || "",
    phone: initial?.phone || "",
    line1: initial?.line1 || "",
    line2: initial?.line2 || "",
    city: initial?.city || "",
    state: initial?.state || "",
    postcode: initial?.postcode || "",
    isDefault: initial?.isDefault ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all";

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="overflow-hidden"
    >
      <div className="bg-[#161616] rounded-2xl border border-[rgba(212,180,131,0.15)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-[#F5EFE6]">
            {initial?.recipientName ? "Edit Address" : "New Address"}
          </h3>
          <button type="button" onClick={onCancel} className="p-1.5 rounded-lg text-[#F5EFE6]/30 hover:text-[#F5EFE6] transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Label */}
        <div>
          <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Label</label>
          <div className="grid grid-cols-3 gap-2">
            {LABELS.map(({ value, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm(f => ({ ...f, label: value }))}
                className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  form.label === value
                    ? "bg-[rgba(212,180,131,0.15)] border border-[rgba(212,180,131,0.3)] text-[#D4B483]"
                    : "bg-[rgba(255,255,255,0.03)] border border-[rgba(212,180,131,0.08)] text-[#F5EFE6]/40 hover:text-[#F5EFE6]/70"
                }`}
              >
                <Icon size={12} /> {value}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Recipient Name</label>
            <div className="relative">
              <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
              <input type="text" value={form.recipientName} onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))} placeholder="Full name" required className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Phone</label>
            <div className="relative">
              <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+60 12-xxx xxxx" required className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Address Line 1</label>
          <div className="relative">
            <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
            <input type="text" value={form.line1} onChange={e => setForm(f => ({ ...f, line1: e.target.value }))} placeholder="Street address" required className={inputClass} />
          </div>
        </div>

        <div>
          <input type="text" value={form.line2} onChange={e => setForm(f => ({ ...f, line2: e.target.value }))} placeholder="Apt, suite, floor (optional)" className={`${inputClass} pl-4`} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">City</label>
            <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" required className={`${inputClass} pl-4`} />
          </div>
          <div>
            <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">State</label>
            <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="State" required className={`${inputClass} pl-4`} />
          </div>
          <div>
            <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Postcode</label>
            <input type="text" value={form.postcode} onChange={e => setForm(f => ({ ...f, postcode: e.target.value }))} placeholder="Postcode" required className={`${inputClass} pl-4`} />
          </div>
        </div>

        {/* Default toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 rounded accent-[#D4B483]" />
          <span className="text-xs text-[#F5EFE6]/50">Set as default address</span>
        </label>

        <motion.button
          type="submit"
          disabled={saving}
          className="w-full py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] font-semibold text-sm hover:bg-[#E8D5B0] transition-all disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? "Saving..." : "Save Address"}
        </motion.button>
      </div>
    </motion.form>
  );
}
