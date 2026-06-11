'use client';

import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

const WHATSAPP = "601131780587";
const PHONE_DISPLAY = "+60 11-3178 0587";

const footerLinks = {
  Order: [
    { label: 'Menu', href: '/menu' },
    { label: 'Locations', href: '/stores' },
    { label: 'Rewards', href: '/rewards' },
    { label: 'Track Order', href: '/dashboard/orders' },
  ],
  Company: [
    { label: 'About Us', href: '#story' },
    { label: 'Our Story', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: `https://wa.me/${WHATSAPP}` },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#080808] overflow-hidden border-t border-[rgba(212,180,131,0.08)]">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,180,131,0.03) 0%, transparent 60%)' }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border border-[#D4B483] opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-[3px] rounded-full bg-[#D4B483] opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-[6px] rounded-full bg-[#080808]" />
              </div>
              <span className="font-display text-xl font-semibold tracking-[0.05em] text-[#F5EFE6]">
                TEA <span className="text-[#D4B483]">PULSE</span>
              </span>
            </Link>
            <p className="text-[#F5EFE6]/40 text-sm leading-relaxed max-w-[280px] mb-8">
              Luxury handcrafted tea experiences designed for the rhythm of modern life. Not just tea. A whole new pulse.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#F5EFE6]/50 hover:text-green-400 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                  <MessageCircle size={14} className="text-green-400" />
                </div>
                <span className="text-sm">WhatsApp Us</span>
              </a>
              <a href={`tel:${WHATSAPP}`}
                className="flex items-center gap-3 text-[#F5EFE6]/50 hover:text-[#D4B483] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-[rgba(212,180,131,0.08)] flex items-center justify-center group-hover:bg-[rgba(212,180,131,0.15)] transition-colors">
                  <Phone size={14} className="text-[#D4B483]" />
                </div>
                <span className="text-sm">{PHONE_DISPLAY}</span>
              </a>
              <a href="mailto:hello@teapulse.com"
                className="flex items-center gap-3 text-[#F5EFE6]/50 hover:text-[#D4B483] transition-colors group">
                <div className="w-8 h-8 rounded-full bg-[rgba(212,180,131,0.08)] flex items-center justify-center group-hover:bg-[rgba(212,180,131,0.15)] transition-colors">
                  <Mail size={14} className="text-[#D4B483]" />
                </div>
                <span className="text-sm">hello@teapulse.com</span>
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-[#F5EFE6] font-semibold text-sm mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a href={href} className="text-[#F5EFE6]/40 hover:text-[#D4B483] text-sm transition-colors duration-200">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Locations strip */}
        <div className="border-t border-[rgba(212,180,131,0.07)] pt-8 mb-8">
          <p className="text-[#F5EFE6]/30 text-xs font-semibold uppercase tracking-wider mb-4">Our Locations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              "Pavilion KL · Bukit Bintang",
              "Mid Valley · Lingkaran Syed Putra",
              "1 Utama · Petaling Jaya",
              "Sunway Pyramid · Bandar Sunway",
            ].map((loc) => (
              <Link key={loc} href="/stores" className="flex items-center gap-2 text-[#F5EFE6]/30 hover:text-[#D4B483] transition-colors text-xs">
                <MapPin size={10} className="shrink-0" /> {loc}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[rgba(212,180,131,0.07)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F5EFE6]/25 text-xs">
            © {new Date().getFullYear()} Tea Pulse. All rights reserved. Crafted with obsession in Kuala Lumpur.
          </p>
          <div className="flex items-center gap-3">
            <motion.a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/20 transition-all"
              whileHover={{ scale: 1.1 }} aria-label="WhatsApp">
              <MessageCircle size={14} />
            </motion.a>
            <motion.a href="#"
              className="w-8 h-8 rounded-full glass border border-[rgba(212,180,131,0.15)] flex items-center justify-center text-[#F5EFE6]/40 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.4)] transition-all"
              whileHover={{ scale: 1.1 }} aria-label="Instagram">
              <Instagram size={14} />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
