'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag } from 'lucide-react';

const navLinks = [
  { label: 'Menu', href: '#drinks' },
  { label: 'Story', href: '#story' },
  { label: 'Experience', href: '#features' },
  { label: 'Locations', href: '#location' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount] = useState(2);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 1.8 }}
        className={`fixed top-0 left-0 right-0 z-[9000] transition-all duration-500 ${
          scrolled
            ? 'bg-[#0E0E0E]/90 backdrop-blur-xl border-b border-[rgba(212,180,131,0.1)] py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-[#D4B483] opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[3px] rounded-full bg-[#D4B483] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[6px] rounded-full bg-[#0E0E0E]" />
            </div>
            <span className="font-display text-xl font-semibold tracking-[0.05em] text-[#F5EFE6]">
              TEA <span className="text-[#D4B483]">PULSE</span>
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="label-sm text-[#F5EFE6]/60 hover:text-[#D4B483] transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4B483] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-6">
            <motion.button
              className="relative p-2 text-[#F5EFE6]/70 hover:text-[#D4B483] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4B483] text-[#0E0E0E] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </motion.button>
            <motion.a
              href="#drinks"
              className="px-6 py-2.5 rounded-full bg-[#D4B483] text-[#0E0E0E] label-sm font-semibold hover:bg-[#E8D5B0] transition-all duration-300 glow-gold-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              Order Now
            </motion.a>
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 text-[#F5EFE6]/80"
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-0 z-[8999] pt-20 pb-10 px-6 bg-[#0E0E0E]/98 backdrop-blur-xl border-b border-[rgba(212,180,131,0.1)] md:hidden"
          >
            <div className="flex flex-col gap-8 mt-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="font-display text-2xl font-semibold text-[#F5EFE6] hover:text-[#D4B483] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#drinks"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 px-8 py-3.5 rounded-full bg-[#D4B483] text-[#0E0E0E] label-sm font-semibold text-center"
                onClick={() => setMenuOpen(false)}
              >
                Order Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
