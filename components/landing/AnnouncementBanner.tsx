'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  body: string;
  emoji: string;
}

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [current, setCurrent] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch('/api/announcements')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) setAnnouncements(data);
      })
      .catch(() => {});
  }, []);

  // Auto-cycle through announcements
  useEffect(() => {
    if (announcements.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent(c => (c + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!announcements.length || dismissed) return null;

  const ann = announcements[current];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-16 left-0 right-0 z-[8990] bg-[rgba(212,180,131,0.1)] backdrop-blur-sm border-b border-[rgba(212,180,131,0.15)]"
      >
        <div className="max-w-[1400px] mx-auto px-5 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {announcements.length > 1 && (
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => setCurrent(c => (c - 1 + announcements.length) % announcements.length)}
                  className="text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <span className="text-[#F5EFE6]/30 text-[10px]">{current + 1}/{announcements.length}</span>
                <button onClick={() => setCurrent(c => (c + 1) % announcements.length)}
                  className="text-[#F5EFE6]/40 hover:text-[#D4B483] transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={ann.id}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 min-w-0"
              >
                <span className="text-base shrink-0">{ann.emoji}</span>
                <span className="text-[#F5EFE6] text-xs font-semibold shrink-0">{ann.title}</span>
                <span className="text-[#F5EFE6]/50 text-xs hidden sm:block truncate">— {ann.body}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#F5EFE6]/30 hover:text-[#F5EFE6] transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
