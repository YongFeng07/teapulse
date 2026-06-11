"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Gift, ArrowLeft, Sparkles, Copy, MessageCircle, Mail,
  Check, ChevronRight, ChevronLeft, Heart, CreditCard, Clock, Send, Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DESIGNS = [
  { id: "gold", name: "Golden Elegance", emoji: "✨", gradient: "from-[#D4B483] to-[#A8895A]", bg: "#D4B483" },
  { id: "rose", name: "Rose Garden", emoji: "🌹", gradient: "from-[#F43F5E] to-[#E11D48]", bg: "#F43F5E" },
  { id: "ocean", name: "Ocean Breeze", emoji: "🌊", gradient: "from-[#3B82F6] to-[#1D4ED8]", bg: "#3B82F6" },
  { id: "forest", name: "Forest Whisper", emoji: "🌿", gradient: "from-[#10B981] to-[#047857]", bg: "#10B981" },
];

const AMOUNTS = [
  { value: 10, label: "RM 10", desc: "1 drink" },
  { value: 20, label: "RM 20", desc: "2 drinks" },
  { value: 30, label: "RM 30", desc: "3 drinks" },
  { value: 50, label: "RM 50", desc: "5 drinks" },
  { value: 100, label: "RM 100", desc: "Premium bundle" },
  { value: 0, label: "Custom", desc: "Any amount" },
];

type Step = "design" | "amount" | "message" | "preview" | "sent";

export default function GiftPage() {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>("design");

  // Form state
  const [design, setDesign] = useState(DESIGNS[0]);
  const [amount, setAmount] = useState(20);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientContact, setRecipientContact] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"whatsapp" | "email" | "link">("whatsapp");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");

  // Generated
  const [giftCode, setGiftCode] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const generateGift = async () => {
    setSending(true);
    const code = `GIFT${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    await new Promise(r => setTimeout(r, 1200));
    setGiftCode(code);
    setStep("sent");
    setSending(false);
  };

  const giftLink = mounted ? `${window.location.origin}/register?gift=${giftCode}` : "";
  const finalAmount = isCustom ? parseFloat(customAmount) || 20 : amount;

  const whatsappMsg = encodeURIComponent(
    `🎁 *${senderName || "Someone"} sent you a Tea Pulse gift!*\n\n` +
    `💳 Gift Code: *${giftCode}*\n` +
    `💰 Value: *RM ${finalAmount}*\n` +
    (message ? `💌 Message: "${message}"\n\n` : "\n") +
    `Redeem at any Tea Pulse store or online.\n${giftLink}`
  );

  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-24 pb-20">
      <div className="max-w-[720px] mx-auto px-5 md:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors text-sm mb-4">
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] flex items-center justify-center text-3xl">
              🎁
            </div>
            <div>
              <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-wider mb-1">Spread the Love</p>
              <h1 className="font-display text-4xl font-bold text-[#F5EFE6]">Gift a Drink</h1>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-1.5 mt-6">
            {(["design", "amount", "message", "preview"] as Step[]).map((s, i) => {
              const active = stepOrder.indexOf(step) >= stepOrder.indexOf(s) && step !== "sent";
              const current = step === s && step !== "sent";
              return (
                <div key={s} className="flex items-center gap-1.5 flex-1">
                  <div className={`h-1 rounded-full flex-1 transition-all ${active ? "bg-[#D4B483]" : "bg-[rgba(255,255,255,0.06)]"} ${current ? "shadow-[0_0_8px_rgba(212,180,131,0.4)]" : ""}`} />
                  {i < 3 && <div className="w-1 h-1 rounded-full bg-[rgba(255,255,255,0.1)] shrink-0" />}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === "design" && (
            <StepWrapper key="design" title="Choose a Design" subtitle="Pick a gift card style">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DESIGNS.map(d => (
                  <motion.button
                    key={d.id}
                    onClick={() => { setDesign(d); setStep("amount"); }}
                    className={`relative p-5 rounded-2xl text-center transition-all ${
                      design.id === d.id
                        ? "bg-[rgba(212,180,131,0.08)] border-2 border-[#D4B483]"
                        : "bg-[#161616] border border-[rgba(212,180,131,0.08)] hover:border-[rgba(212,180,131,0.2)]"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${d.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                      {d.emoji}
                    </div>
                    <p className="text-xs font-medium text-[#F5EFE6]">{d.name}</p>
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <NextBtn onClick={() => setStep("amount")} />
              </div>
            </StepWrapper>
          )}

          {step === "amount" && (
            <StepWrapper key="amount" title="Select Amount" subtitle="How much would you like to gift?">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {AMOUNTS.map(amt => (
                  <motion.button
                    key={amt.value}
                    onClick={() => { if (amt.value === 0) { setIsCustom(true); } else { setAmount(amt.value); setIsCustom(false); } }}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      !isCustom && amount === amt.value
                        ? "bg-[#D4B483] text-[#0E0E0E] border-2 border-[#D4B483]"
                        : "bg-[#161616] border border-[rgba(212,180,131,0.08)] text-[#F5EFE6] hover:border-[rgba(212,180,131,0.2)]"
                    }`}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <p className="font-display text-xl font-bold">{amt.label}</p>
                    <p className="text-[10px] opacity-60 mt-0.5">{amt.desc}</p>
                  </motion.button>
                ))}
              </div>
              {isCustom && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-4">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="Enter amount (RM)"
                    className="w-full px-4 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[#D4B483] text-[#F5EFE6] text-sm outline-none transition-all text-center font-display text-2xl"
                    min="5"
                  />
                </motion.div>
              )}
              <div className="flex justify-between mt-6">
                <BackBtn onClick={() => setStep("design")} />
                <NextBtn onClick={() => setStep("message")} />
              </div>
            </StepWrapper>
          )}

          {step === "message" && (
            <StepWrapper key="message" title="Personal Message" subtitle="Make it personal">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <InputField icon={Heart} label="Your Name" value={senderName} onChange={setSenderName} placeholder="Your name" />
                  <InputField icon={Users} label="Recipient Name" value={recipientName} onChange={setRecipientName} placeholder="Friend's name" />
                </div>
                <div>
                  <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Delivery Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "whatsapp" as const, icon: MessageCircle, label: "WhatsApp" },
                      { id: "email" as const, icon: Mail, label: "Email" },
                      { id: "link" as const, icon: Copy, label: "Share Link" },
                    ].map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setDeliveryMethod(m.id)}
                        className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-medium transition-all ${
                          deliveryMethod === m.id
                            ? "bg-[rgba(212,180,131,0.12)] border border-[rgba(212,180,131,0.3)] text-[#D4B483]"
                            : "bg-[rgba(255,255,255,0.02)] border border-[rgba(212,180,131,0.08)] text-[#F5EFE6]/40 hover:text-[#F5EFE6]/70"
                        }`}
                      >
                        <m.icon size={14} /> {m.label}
                      </button>
                    ))}
                  </div>
                </div>
                {deliveryMethod !== "link" && (
                  <InputField icon={deliveryMethod === "whatsapp" ? MessageCircle : Mail} label={deliveryMethod === "whatsapp" ? "Phone Number" : "Email Address"} value={recipientContact} onChange={setRecipientContact} placeholder={deliveryMethod === "whatsapp" ? "+60 12-xxx xxxx" : "friend@email.com"} />
                )}
                <div>
                  <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">Message (optional)</label>
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Write a heartfelt message..."
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/15 text-sm outline-none transition-all resize-none"
                  />
                  <p className="text-[#F5EFE6]/20 text-[10px] text-right mt-1">{message.length}/200</p>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <BackBtn onClick={() => setStep("amount")} />
                <NextBtn onClick={() => setStep("preview")} label="Preview Gift" />
              </div>
            </StepWrapper>
          )}

          {step === "preview" && (
            <StepWrapper key="preview" title="Preview Your Gift" subtitle="Here's how it will look">
              {/* Gift card preview */}
              <motion.div
                initial={{ opacity: 0, y: 20, rotateX: 15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                className={`relative overflow-hidden rounded-3xl p-8 mb-6 bg-gradient-to-br ${design.gradient}`}
                style={{ boxShadow: `0 30px 60px rgba(0,0,0,0.4), 0 0 40px ${design.bg}20` }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />

                <div className="relative text-center text-white">
                  <p className="text-6xl mb-4">{design.emoji}</p>
                  <p className="text-white/70 text-xs uppercase tracking-[0.2em] font-semibold mb-2">Gift Card</p>
                  <p className="font-display text-4xl font-bold mb-2">RM {finalAmount}</p>
                  <p className="text-white/60 text-sm mb-6">
                    {senderName ? `From ${senderName}` : "A special gift"} {recipientName ? `for ${recipientName}` : "for you"}
                  </p>
                  {message && (
                    <div className="bg-white/10 rounded-2xl p-4 mb-4">
                      <p className="text-white/80 text-sm italic">&ldquo;{message}&rdquo;</p>
                    </div>
                  )}
                  <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                    <Clock size={12} /> Redeemable at any Tea Pulse store
                  </div>
                </div>
              </motion.div>

              {/* Summary */}
              <div className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-5 space-y-3 mb-6">
                {[
                  { label: "Design", value: `${design.emoji} ${design.name}` },
                  { label: "Amount", value: `RM ${finalAmount}` },
                  { label: "From", value: senderName || "Anonymous" },
                  { label: "To", value: recipientName || "Friend" },
                  { label: "Delivery", value: deliveryMethod === "whatsapp" ? "WhatsApp" : deliveryMethod === "email" ? "Email" : "Share Link" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-[#F5EFE6]/30">{label}</span>
                    <span className="text-[#F5EFE6] font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <BackBtn onClick={() => setStep("message")} />
                <motion.button
                  onClick={generateGift}
                  disabled={sending}
                  className="group flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-[#0E0E0E] disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${design.bg}, ${design.bg}cc)`,
                    boxShadow: `0 0 30px ${design.bg}30`,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {sending ? (
                    <><span className="w-4 h-4 border-2 border-[#0E0E0E]/30 border-t-[#0E0E0E] rounded-full animate-spin" /> Generating...</>
                  ) : (
                    <><Send size={15} /> Send Gift</>
                  )}
                </motion.button>
              </div>
            </StepWrapper>
          )}

          {step === "sent" && (
            <StepWrapper key="sent" title="Gift Sent! 🎉" subtitle="Your gift is ready to share">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative overflow-hidden rounded-3xl p-8 mb-8 bg-gradient-to-br ${design.gradient} text-center`}
                style={{ boxShadow: `0 30px 60px rgba(0,0,0,0.4), 0 0 40px ${design.bg}20` }}
              >
                <p className="text-6xl mb-4">✅</p>
                <p className="font-display text-3xl font-bold text-white mb-2">Gift Created!</p>
                <p className="text-white/60 text-sm mb-6">Share this code with {recipientName || "your friend"}</p>
                <div className="bg-white/15 rounded-2xl p-5 mb-4">
                  <p className="font-mono text-4xl font-bold text-white tracking-wider">{giftCode}</p>
                  <p className="text-white/40 text-xs mt-2">Value: RM {finalAmount}</p>
                </div>
              </motion.div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                <motion.button
                  onClick={() => { navigator.clipboard.writeText(giftCode); toast({ title: "Code copied!", variant: "success" }); }}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.15)] text-[#D4B483] text-sm font-semibold hover:bg-[rgba(212,180,131,0.12)] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Copy size={15} /> Copy Code
                </motion.button>
                {mounted && (
                  <motion.a
                    href={`https://wa.me/?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold hover:bg-green-500/15 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageCircle size={15} /> Share WhatsApp
                  </motion.a>
                )}
              </div>

              <div className="text-center">
                <p className="text-[#F5EFE6]/25 text-xs mb-2">What happens next?</p>
                <div className="flex items-center justify-center gap-6 text-[#F5EFE6]/35 text-xs">
                  <span className="flex items-center gap-1.5"><span className="text-[#D4B483]">1.</span> Friend receives code</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#D4B483]">2.</span> Redeems at any store</span>
                  <span className="flex items-center gap-1.5"><span className="text-[#D4B483]">3.</span> Enjoys their drink! 🧋</span>
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <motion.button
                  onClick={() => { setStep("design"); setGiftCode(""); setSenderName(""); setRecipientName(""); setRecipientContact(""); setMessage(""); }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161616] border border-[rgba(212,180,131,0.15)] text-[#D4B483] text-sm font-semibold hover:border-[rgba(212,180,131,0.3)] transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Sparkles size={14} /> Send Another Gift
                </motion.button>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- Step order helper ----
const stepOrder: Step[] = ["design", "amount", "message", "preview", "sent"];

// ---- Reusable sub-components ----

function StepWrapper({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-3xl p-6 md:p-8"
    >
      <h2 className="font-display text-2xl font-bold text-[#F5EFE6] mb-1">{title}</h2>
      <p className="text-[#F5EFE6]/35 text-sm mb-6">{subtitle}</p>
      {children}
    </motion.div>
  );
}

function InputField({ icon: Icon, label, value, onChange, placeholder }: { icon: any; label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-[#F5EFE6]/35 text-[10px] font-semibold uppercase tracking-wider block mb-2">{label}</label>
      <div className="relative">
        <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5EFE6]/25" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-[rgba(212,180,131,0.04)] border border-[rgba(212,180,131,0.14)] focus:border-[rgba(212,180,131,0.45)] text-[#F5EFE6] placeholder-[#F5EFE6]/20 text-sm outline-none transition-all" />
      </div>
    </div>
  );
}

function NextBtn({ onClick, label = "Continue" }: { onClick: () => void; label?: string }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4B483] text-[#0E0E0E] text-sm font-semibold hover:bg-[#E8D5B0] transition-all"
      style={{ boxShadow: "0 0 20px rgba(212,180,131,0.15)" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label} <ChevronRight size={15} />
    </motion.button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(212,180,131,0.1)] text-[#F5EFE6]/40 hover:text-[#F5EFE6]/70 transition-all text-sm"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <ChevronLeft size={15} /> Back
    </motion.button>
  );
}
