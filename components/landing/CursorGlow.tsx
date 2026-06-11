'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const dotX = useSpring(mouseX, { stiffness: 500, damping: 30 });
  const dotY = useSpring(mouseY, { stiffness: 500, damping: 30 });

  const ringX = useSpring(mouseX, { stiffness: 200, damping: 30 });
  const ringY = useSpring(mouseY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [data-cursor="pointer"]');
      setHovered(!!interactive);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleEnter);
    document.documentElement.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleEnter);
      document.documentElement.removeEventListener('mouseleave', handleLeave);
    };
  }, [mouseX, mouseY, visible]);

  if (typeof window === 'undefined') return null;

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed pointer-events-none z-[99999] rounded-full bg-[#D4B483] mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovered ? 12 : 6,
          height: hovered ? 12 : 6,
          opacity: visible ? 1 : 0,
          transition: 'width 0.2s, height 0.2s, opacity 0.2s',
        }}
      />

      {/* Ring */}
      <motion.div
        className="fixed pointer-events-none z-[99998] rounded-full border border-[rgba(212,180,131,0.5)]"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: hovered ? 52 : 36,
          height: hovered ? 52 : 36,
          opacity: visible ? 1 : 0,
          transition: 'width 0.3s, height 0.3s, opacity 0.2s, border-color 0.3s',
          borderColor: hovered ? 'rgba(212,180,131,0.9)' : 'rgba(212,180,131,0.4)',
        }}
      />
    </>
  );
}
