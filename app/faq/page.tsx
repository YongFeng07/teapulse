"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, Phone } from "lucide-react";

const WHATSAPP = "601131780587";

const FAQS = [
  {
    category: "Ordering",
    items: [
      { q: "How do I place an order?", a: "Browse our menu, customize your drink (sugar level, ice, add-ons), add to cart, and proceed to checkout. Select your pickup location and payment method." },
      { q: "Can I modify my order after placing it?", a: "Once an order is confirmed, modifications are difficult. Please WhatsApp us immediately at +60 11-3178 0587 and we'll do our best to help." },
      { q: "What payment methods do you accept?", a: "We accept cash or card at pickup, TNG eWallet (send to 011-3178 0587), or WhatsApp orders. More payment options coming soon." },
      { q: "How long does preparation take?", a: "Most orders are ready within 5–15 minutes depending on complexity and queue. You'll be able to track your order status in real-time." },
    ],
  },
  {
    category: "Drinks & Customization",
    items: [
      { q: "Can I request less sugar or no ice?", a: "Absolutely! All drinks can be customised with 0%, 25%, 50%, 75%, or 100% sugar, and no ice, less ice, or normal ice." },
      { q: "Do you have vegan/dairy-free options?", a: "Yes! Many drinks are available with oat milk. Look for the 'Vegan' badge on menu items. Our Ceremonial Matcha Latte, Jasmine Pearl, and Passion Fruit Green Tea are popular vegan options." },
      { q: "Are the tapioca pearls freshly made?", a: "Our pearls are cooked fresh every 4 hours to ensure the perfect QQ texture. We never use pre-made or frozen pearls." },
      { q: "What is the difference between your matcha tiers?", a: "We use genuine ceremonial-grade Uji matcha from Kyoto, Japan — not sweetened culinary powder. This gives our matcha drinks their characteristic deep umami flavour and vibrant colour." },
    ],
  },
  {
    category: "Rewards & Points",
    items: [
      { q: "How do I earn points?", a: "You earn 1 point for every RM 1 spent. Points are automatically added to your account after each completed order." },
      { q: "How do I redeem my rewards?", a: "Go to Rewards in your account, browse available rewards, and click Redeem. You'll receive a unique code to show at the counter." },
      { q: "When do my points expire?", a: "Points are valid for 12 months from the date they were earned. Keep ordering to keep them active!" },
      { q: "What are the membership tiers?", a: "Bronze (0–499 pts), Silver (500–1499 pts), Gold (1500–3999 pts), and VIP (4000+ pts). Higher tiers unlock exclusive rewards and multipliers." },
    ],
  },
  {
    category: "Locations & Hours",
    items: [
      { q: "Where are your outlets?", a: "We have 4 locations: Pavilion KL, Mid Valley, 1 Utama, and Sunway Pyramid. Visit our Locations page for addresses and opening hours." },
      { q: "What are your opening hours?", a: "Generally 10:00 AM – 10:00 PM daily. 1 Utama stays open until 10:30 PM. Check the Locations page for specific hours." },
      { q: "Do you offer delivery?", a: "Currently we are pickup-only. We're working on delivery partnerships and will announce when it's available." },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (key: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[800px] mx-auto px-5 md:px-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-3">Help Center</p>
          <h1 className="font-display text-5xl font-bold text-[#F5EFE6]">
            Frequently Asked{" "}
            <span className="italic" style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #D4B483, #E8D5B0)", backgroundClip: "text" }}>
              Questions
            </span>
          </h1>
        </motion.div>

        <div className="space-y-10">
          {FAQS.map((section, si) => (
            <motion.div key={section.category} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}>
              <h2 className="font-display text-xl font-semibold text-[#F5EFE6] mb-4">{section.category}</h2>
              <div className="space-y-2">
                {section.items.map((item, ii) => {
                  const key = `${si}-${ii}`;
                  const open = openItems.has(key);
                  return (
                    <motion.div key={key} className="bg-[#161616] border border-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.18)] rounded-2xl overflow-hidden transition-all">
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-medium text-[#F5EFE6] text-sm pr-4">{item.q}</span>
                        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                          <ChevronDown size={16} className="text-[#D4B483]" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="px-5 pb-5 text-[#F5EFE6]/50 text-sm leading-relaxed border-t border-[rgba(212,180,131,0.06)] pt-3">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-3xl p-8 text-center"
        >
          <h3 className="font-display text-2xl font-bold text-[#F5EFE6] mb-2">Still have questions?</h3>
          <p className="text-[#F5EFE6]/40 text-sm mb-6">Our team is available daily 9 AM – 11 PM</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer">
              <motion.button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-green-500/12 border border-green-500/25 text-green-400 font-semibold text-sm hover:bg-green-500/20 transition-all"
                whileHover={{ scale: 1.04 }}
              >
                <MessageCircle size={16} /> WhatsApp Us
              </motion.button>
            </a>
            <a href={`tel:${WHATSAPP}`}>
              <motion.button
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.2)] text-[#D4B483] font-semibold text-sm hover:bg-[rgba(212,180,131,0.14)] transition-all"
                whileHover={{ scale: 1.04 }}
              >
                <Phone size={16} /> +60 11-3178 0587
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
