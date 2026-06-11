"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Award, Heart, Star } from "lucide-react";

const VALUES = [
  { icon: Leaf, title: "Sustainably Sourced", desc: "Every tea leaf we use is sourced directly from family-owned farms with fair trade practices. We visit our suppliers annually." },
  { icon: Award, title: "Uncompromising Quality", desc: "We use only ceremonial-grade ingredients. No artificial flavours, colours, or shortcuts — ever. If we wouldn't serve it to our family, we don't serve it to you." },
  { icon: Heart, title: "Community First", desc: "10% of our profits go to the Malaysian Tea Farmers Fund, supporting smallholder farms and sustainable agriculture." },
  { icon: Star, title: "Craft Over Volume", desc: "We train every team member for 4 weeks before their first shift. Your drink is made by someone who genuinely cares about what's in the cup." },
];

const TIMELINE = [
  { year: "2019", title: "The idea", desc: "Founded in a small apartment kitchen in Bangsar, with one recipe and an obsession: what would happen if we treated tea like fine coffee?" },
  { year: "2020", title: "First outlet", desc: "TeaPulse Pavilion KL opens. 3-hour queues on day one. We were completely unprepared — and completely overwhelmed with gratitude." },
  { year: "2021", title: "The matcha moment", desc: "Our Ceremonial Matcha Latte goes viral. We source directly from Uji, Kyoto — and refuse to cut corners even when demand outpaces supply." },
  { year: "2022", title: "Growing the family", desc: "Mid Valley and 1 Utama open. We hire our 50th team member. Every person is trained by the founders personally." },
  { year: "2023", title: "Recognition", desc: "Time Out KL names us 'Best Specialty Tea Bar'. We frame the article and put it in the staff room — not the storefront." },
  { year: "2024", title: "Online ordering", desc: "TeaPulse.com launches with our full loyalty program, online ordering, and the ability to earn rewards. The journey continues." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0E0E0E] pt-20 pb-24">

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/3879495/pexels-photo-3879495.jpeg?auto=compress&cs=tinysrgb&w=1400"
          alt="TeaPulse"
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(14,14,14,0.5), #0E0E0E)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1200px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-widest mb-4">Our Story</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-[#F5EFE6] leading-tight max-w-2xl">
              Not just tea.<br />
              <span className="italic" style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text", backgroundImage: "linear-gradient(135deg, #D4B483, #E8D5B0)", backgroundClip: "text" }}>
                A whole new pulse.
              </span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-[1000px] mx-auto px-6 md:px-12">

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="py-20 max-w-[680px]"
        >
          <p className="font-display text-3xl md:text-4xl font-bold text-[#F5EFE6] leading-relaxed">
            We started Tea Pulse because we were tired of choosing between good tea and a good experience. We wanted both.{" "}
            <span className="text-[#D4B483]">We believed you did too.</span>
          </p>
          <p className="text-[#F5EFE6]/50 mt-6 text-lg leading-relaxed">
            Every drink at Tea Pulse is a small act of obsession. We spend weeks developing each recipe, source our ingredients from the best farms in Asia, and train our team to execute with precision and care. The result is a cup that tastes like we meant it — because we did.
          </p>
        </motion.div>

        {/* Values */}
        <section className="pb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-widest mb-12"
          >
            What We Stand For
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#161616] border border-[rgba(212,180,131,0.1)] rounded-2xl p-6 hover:border-[rgba(212,180,131,0.25)] transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(212,180,131,0.08)] flex items-center justify-center mb-4 group-hover:bg-[rgba(212,180,131,0.14)] transition-colors">
                  <Icon size={18} className="text-[#D4B483]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#F5EFE6] mb-2">{title}</h3>
                <p className="text-[#F5EFE6]/45 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="pb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[#D4B483] text-[11px] font-semibold uppercase tracking-widest mb-12"
          >
            Our Journey
          </motion.p>
          <div className="relative">
            <div className="absolute left-[72px] top-0 bottom-0 w-px bg-[rgba(212,180,131,0.1)]" />
            <div className="space-y-10">
              {TIMELINE.map(({ year, title, desc }, i) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex gap-8"
                >
                  <div className="w-[72px] shrink-0 flex flex-col items-center">
                    <span className="font-display font-bold text-[#D4B483] text-sm">{year}</span>
                    <div className="w-2 h-2 rounded-full bg-[#D4B483] mt-2 relative z-10" />
                  </div>
                  <div className="pb-2">
                    <h3 className="font-display text-lg font-semibold text-[#F5EFE6] mb-1">{title}</h3>
                    <p className="text-[#F5EFE6]/45 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#161616] border border-[rgba(212,180,131,0.12)] rounded-3xl p-10 text-center mb-12"
        >
          <h2 className="font-display text-3xl font-bold text-[#F5EFE6] mb-3">Come try a cup.</h2>
          <p className="text-[#F5EFE6]/40 mb-7">We have 4 locations across KL and PJ. Order online and skip the queue.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/menu">
              <motion.button className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all" whileHover={{ scale: 1.04 }}>
                Order Now <ArrowRight size={16} />
              </motion.button>
            </Link>
            <Link href="/stores">
              <motion.button className="px-7 py-3.5 rounded-full border border-[rgba(212,180,131,0.25)] text-[#D4B483] font-semibold hover:bg-[rgba(212,180,131,0.07)] transition-all" whileHover={{ scale: 1.04 }}>
                Find a Store
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
