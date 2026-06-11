"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, User, Menu, X, Coffee, MapPin,
  Gift, LayoutDashboard, LogOut, ChevronDown, Shield, Heart, Search,
  BookOpen, Sparkles,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { NotificationBell } from "@/components/ui/notification-bell";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/menu",    label: "Menu",      icon: Coffee },
  { href: "/stores",  label: "Locations", icon: MapPin },
  { href: "/rewards", label: "Rewards",   icon: Gift },
  { href: "/gift",    label: "Gift 🎁",   icon: Sparkles },
  { href: "/blog",    label: "Journal",   icon: BookOpen },
];

export function UnifiedNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const itemCount = useCart((s) => s.getItemCount());

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  const transparent = isHome && !scrolled;

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-[9000] transition-all duration-500",
          transparent
            ? "bg-transparent py-6"
            : "bg-[#0E0E0E]/95 backdrop-blur-xl border-b border-[rgba(212,180,131,0.08)] py-4"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-10 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-full border border-[#D4B483] opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-[3px] rounded-full bg-[#D4B483] opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[6px] rounded-full bg-[#0E0E0E]" />
            </div>
            <span className="font-display text-lg font-semibold text-[#F5EFE6] tracking-wide">
              TEA <span className="text-[#D4B483]">PULSE</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 relative group",
                  pathname.startsWith(href)
                    ? "text-[#D4B483]"
                    : "text-[#F5EFE6]/55 hover:text-[#D4B483]"
                )}
              >
                {label}
                <span className={cn(
                  "absolute -bottom-0.5 left-0 h-px bg-[#D4B483] transition-all duration-300",
                  pathname.startsWith(href) ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search */}
            <Link href="/search">
              <motion.div
                className="p-2 text-[#F5EFE6]/60 hover:text-[#D4B483] transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search size={18} />
              </motion.div>
            </Link>

            {/* Notifications - only render after mount to prevent hydration mismatch */}
            {mounted && session && <NotificationBell />}
            <Link href="/cart">
              <motion.div
                className="relative p-2 text-[#F5EFE6]/60 hover:text-[#D4B483] transition-colors cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ShoppingBag size={19} />
                <AnimatePresence>
                  {mounted && itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D4B483] text-[#0E0E0E] text-[9px] font-bold flex items-center justify-center"
                    >
                      {itemCount > 9 ? "9+" : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>

            {/* User menu - only render after mount to prevent hydration mismatch */}
            {!mounted ? <div className="w-[100px] h-[36px]" /> : session ? (
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(212,180,131,0.08)] border border-[rgba(212,180,131,0.18)] text-[#F5EFE6]/75 hover:text-[#D4B483] hover:border-[rgba(212,180,131,0.35)] transition-all text-xs font-medium"
                  whileHover={{ scale: 1.02 }}
                >
                  <User size={13} />
                  <span className="max-w-[80px] truncate">{session.user.name?.split(" ")[0]}</span>
                  <ChevronDown size={11} className={cn("transition-transform duration-200", userMenuOpen && "rotate-180")} />
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-44 bg-[#161616] rounded-2xl overflow-hidden border border-[rgba(212,180,131,0.13)] shadow-2xl"
                    >
                      {[
                        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                        { href: "/dashboard/profile", icon: User, label: "My Profile" },
                        { href: "/dashboard/orders", icon: ShoppingBag, label: "My Orders" },
                        { href: "/dashboard/favourites", icon: Heart, label: "Favourites" },
                        { href: "/rewards", icon: Gift, label: "Rewards" },
                        ...(session?.user?.email === "yongfeng3318@gmail.com" ? [{ href: "/admin", icon: Shield, label: "Admin Panel" }] : []),
                      ].map(({ href, icon: Icon, label }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-xs text-[#F5EFE6]/60 hover:text-[#D4B483] hover:bg-[rgba(212,180,131,0.05)] transition-all"
                        >
                          <Icon size={13} /> {label}
                        </Link>
                      ))}
                      <div className="border-t border-[rgba(212,180,131,0.08)]" />
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs text-red-400/80 hover:text-red-400 hover:bg-red-500/05 transition-all"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <motion.button
                    className="px-4 py-2 text-xs font-semibold text-[#F5EFE6]/60 hover:text-[#D4B483] transition-colors"
                    whileHover={{ scale: 1.02 }}
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link href="/register">
                  <motion.button
                    className="px-5 py-2.5 rounded-full bg-[#D4B483] text-[#0E0E0E] text-xs font-semibold hover:bg-[#E8D5B0] transition-all"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Join Free
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/cart" className="relative p-1.5 text-[#F5EFE6]/60">
              <ShoppingBag size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D4B483] text-[#0E0E0E] text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <motion.button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-1.5 text-[#F5EFE6]/70"
              whileTap={{ scale: 0.9 }}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[8998] bg-[#0E0E0E]/70 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[8999] w-72 bg-[#161616] border-l border-[rgba(212,180,131,0.1)] flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[rgba(212,180,131,0.08)]">
                <span className="font-display font-semibold text-[#F5EFE6]">Menu</span>
                <motion.button onClick={() => setMobileOpen(false)} whileTap={{ scale: 0.9 }}>
                  <X size={20} className="text-[#F5EFE6]/50" />
                </motion.button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {NAV_LINKS.map(({ href, label, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all",
                        pathname.startsWith(href)
                          ? "bg-[rgba(212,180,131,0.1)] text-[#D4B483]"
                          : "text-[#F5EFE6]/60 hover:bg-[rgba(212,180,131,0.05)] hover:text-[#D4B483]"
                      )}
                    >
                      <Icon size={17} />
                      {label}
                    </Link>
                  </motion.div>
                ))}

                <div className="pt-4 border-t border-[rgba(212,180,131,0.08)] space-y-1">
                  {session ? (
                    <>
                      {[
                        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                        { href: "/dashboard/profile", icon: User, label: "My Profile" },
                        { href: "/dashboard/orders", icon: ShoppingBag, label: "My Orders" },
                        { href: "/dashboard/favourites", icon: Heart, label: "Favourites" },
                        { href: "/rewards", icon: Gift, label: "Rewards" },
                        ...(session?.user?.email === "yongfeng3318@gmail.com" ? [{ href: "/admin", icon: Shield, label: "Admin Panel" }] : []),
                      ].map(({ href, icon: Icon, label }) => (
                        <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-[#F5EFE6]/50 hover:text-[#D4B483] hover:bg-[rgba(212,180,131,0.05)] transition-all">
                          <Icon size={16} /> {label}
                        </Link>
                      ))}
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/70 hover:text-red-400 transition-all"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2 pt-2">
                      <Link href="/login" className="block px-4 py-3 rounded-xl text-sm text-center text-[#F5EFE6]/60 border border-[rgba(212,180,131,0.15)] hover:border-[rgba(212,180,131,0.3)] transition-all">
                        Sign In
                      </Link>
                      <Link href="/register" className="block px-4 py-3 rounded-xl text-sm text-center bg-[#D4B483] text-[#0E0E0E] font-semibold hover:bg-[#E8D5B0] transition-all">
                        Join Free
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
