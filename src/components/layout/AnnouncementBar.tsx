'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Sparkles } from 'lucide-react';

interface Announcement {
  id: string;
  text: string;
  linkText?: string;
  href?: string;
  code?: string;
  icon?: React.ReactNode;
}

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const announcements: Announcement[] = [
    {
      id: 'shipping',
      text: 'COMPLIMENTARY EXPRESS SHIPPING',
      linkText: 'SHOP',
      href: '/shop',
      icon: <Sparkles size={12} className="text-[#DC143C]" />
    },
    {
      id: 'flash-sale',
      text: '10% OFF YOUR FIRST ORDER',
      code: 'TERRA10',
    },
    {
      id: 'guarantee',
      text: '30-DAY SATISFACTION GUARANTEE',
      linkText: 'PROMISE',
      href: '/about',
    },
  ];

  const DURATION_MS = 5000;

  useEffect(() => {
    if (isHovered || announcements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((curr) => (curr + 1) % announcements.length);
    }, DURATION_MS);

    return () => clearInterval(interval);
  }, [isHovered, announcements.length]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  const current = announcements[currentIndex];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="pointer-events-auto flex items-center bg-[#121212]/80 backdrop-blur-xl border border-white/10 rounded-full px-1.5 py-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_32px_rgba(220,20,60,0.15)] transition-all duration-500 overflow-hidden"
          style={{ width: isHovered ? 'auto' : 'auto' }}
        >
          {/* Animated Glow Border */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#DC143C]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />

          {/* Dynamic Content */}
          <div className="flex items-center gap-3 px-3 relative z-10">

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ y: 15, opacity: 0, filter: 'blur(4px)' }}
                animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                exit={{ y: -15, opacity: 0, filter: 'blur(4px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 whitespace-nowrap"
              >

                {/* Icon or Status Dot */}
                <div className="flex items-center justify-center">
                  {current.icon ? current.icon : <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C] animate-pulse" />}
                </div>

                <span className="font-sans text-[10px] tracking-[0.15em] font-semibold text-[#E6E6E6] uppercase">
                  {current.text}
                </span>

                {/* Interactive Elements */}
                {current.code && (
                  <button
                    onClick={() => handleCopyCode(current.code!)}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-[#DC143C] text-white px-2 py-0.5 rounded-full transition-colors duration-300 font-bold text-[9px] tracking-widest focus:outline-none"
                  >
                    {copied ? <Check size={10} /> : <Copy size={10} />}
                    {copied ? 'COPIED' : current.code}
                  </button>
                )}

                {current.href && (
                  <Link
                    href={current.href}
                    className="relative group text-white text-[9px] tracking-widest font-bold focus:outline-none"
                  >
                    <span className="relative z-10 group-hover:text-[#DC143C] transition-colors">{current.linkText}</span>
                    <span className="absolute -bottom-0.5 left-1/2 w-0 h-px bg-[#DC143C] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </Link>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Close Button - Only visible on hover */}
          <motion.button
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0 }}
            className="overflow-hidden flex items-center justify-center text-gray-500 hover:text-white transition-colors focus:outline-none pr-1.5 pl-1"
            onClick={() => setIsVisible(false)}
            aria-label="Close announcement"
          >
            <div className="p-1 rounded-full hover:bg-white/10 transition-colors">
              <X size={12} />
            </div>
          </motion.button>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
