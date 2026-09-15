'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

export default function ComingSoonPage() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Mouse setup for extremely subtle interaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 100, stiffness: 400, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    // Check if prefers reduced motion is enabled
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMouseMove = (e: MouseEvent) => {
      if (mediaQuery.matches) return; // Disable parallax if reduced motion
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) * 2 - 1);
      mouseY.set((e.clientY / innerHeight) * 2 - 1);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Extremely restrained parallax (1-3px movement mostly)
  const objectX = useTransform(smoothX, [-1, 1], [-15, 15]);
  const objectY = useTransform(smoothY, [-1, 1], [-15, 15]);
  const bgX = useTransform(smoothX, [-1, 1], [-5, 5]);
  const bgY = useTransform(smoothY, [-1, 1], [-5, 5]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  // Cinematic Animation Variants
  const revealUp: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(8px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const revealRight: Variants = {
    hidden: { opacity: 0, x: -30, clipPath: 'inset(0 100% 0 0)' },
    visible: { opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)', transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.3 } }
  };

  return (
    <div className="relative min-h-screen bg-[#F7F5F0] text-[#1C1C1C] font-sans selection:bg-[#1C1C1C] selection:text-[#F7F5F0] flex flex-col justify-between overflow-hidden">

      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/coming-soon-bg.jpeg"
          alt="Background Texture"
          fill
          priority
          className="object-cover opacity-90 mix-blend-multiply"
        />
        {/* Soft overlay to ensure text readability, reduced to make bg pop */}
        <div className="absolute inset-0 bg-[#F7F5F0]/10 backdrop-blur-[1px]"></div>
      </div>

      {/* 1. ARCHITECTURAL LIGHTING & BACKGROUND */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft, glowing ambient light */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[80%] bg-gradient-to-br from-white via-[#FDFBF7]/80 to-transparent blur-[120px]" />
        {/* Warm secondary bounce light */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#EBE5D9]/50 blur-[100px]" />
      </motion.div>

      {/* 2. SUBTLE FILM GRAIN */}
      {mounted && (
        <div
          className="pointer-events-none absolute inset-0 z-50 opacity-[0.045] mix-blend-multiply"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      )}

      {/* 3. GRID OVERLAY (Very subtle architectural lines) */}
      <div className="pointer-events-none absolute inset-0 z-10 flex justify-between px-6 md:px-12 w-full max-w-[1600px] mx-auto">
        <div className="w-[1px] h-full bg-[#1C1C1C]/[0.03]"></div>
        <div className="w-[1px] h-full bg-[#1C1C1C]/[0.03] hidden md:block"></div>
        <div className="w-[1px] h-full bg-[#1C1C1C]/[0.03] hidden md:block"></div>
        <div className="w-[1px] h-full bg-[#1C1C1C]/[0.03]"></div>
      </div>

      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
        className="relative z-20 flex justify-between items-start p-4 md:p-8 w-full max-w-[1600px] mx-auto"
      >
        <div className="text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold text-[#1C1C1C]">
          TERRA MEN&apos;S CO.
        </div>
        <div className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[#1C1C1C]/40 font-medium">
          EST. 2026
        </div>
      </motion.header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-20 flex-1 flex flex-col md:flex-row w-full max-w-[1600px] mx-auto px-6 md:px-12">

        {/* LEFT COMPOSITION (Typography & Editorial) */}
        <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col justify-center pt-12 md:pt-0">

          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-col">

            {/* Tiny Label */}
            <motion.div variants={revealRight} className="flex items-center gap-4 mb-4 md:mb-8">
              <div className="w-8 h-[1px] bg-[#1C1C1C]/20"></div>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[#1C1C1C]/50 font-medium">
                CHAPTER 01 &mdash; THE INAUGURAL COLLECTION
              </span>
            </motion.div>

            {/* Massive Headline */}
            <div className="mb-6 md:mb-10">
              <div className="overflow-hidden py-1">
                <motion.h1 variants={revealUp} className="text-5xl sm:text-6xl md:text-[6vw] lg:text-[7vw] leading-[0.85] font-semibold tracking-tighter uppercase text-[#1C1C1C]">
                  UNCOMPROMISED
                </motion.h1>
              </div>
              <div className="overflow-hidden py-1">
                <motion.h1 variants={revealUp} className="text-5xl sm:text-6xl md:text-[6vw] lg:text-[7vw] leading-[0.85] font-semibold tracking-tighter uppercase text-[#1C1C1C] flex items-center gap-3 md:gap-6">
                  <span className="italic font-light text-[#1C1C1C]/60 lowercase text-4xl sm:text-5xl md:text-[5vw] lg:text-[6vw] -translate-y-1 md:-translate-y-2">men&apos;s</span> ESSENTIALS.
                </motion.h1>
              </div>
            </div>

            {/* Supporting Copy */}
            <motion.p variants={revealUp} className="text-xs md:text-sm lg:text-base max-w-[420px] font-medium text-[#1C1C1C]/60 leading-relaxed mb-8 md:mb-10">
              We&apos;re crafting the foundational formulas your daily routine has been missing. Premium ingredients, earth-conscious practices, and elevated grooming. The new standard in men&apos;s cosmetics is launching soon.
            </motion.p>

            {/* Form */}
            <motion.div variants={revealUp} className="w-full max-w-md mt-2">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#1C1C1C]/50 mb-4 font-semibold ml-2">
                SECURE EARLY ACCESS TO THE LAUNCH
              </div>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    exit={{ opacity: 0, filter: "blur(8px)", scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    onSubmit={handleSubmit}
                    className="relative w-full flex items-center bg-white/60 backdrop-blur-xl rounded-full p-2 border border-white/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] transition-all duration-500 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] focus-within:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] focus-within:bg-white/90"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="ENTER EMAIL ADDRESS"
                      className="w-full bg-transparent border-none pl-6 text-sm text-[#1C1C1C] placeholder:text-[#1C1C1C]/40 focus:outline-none focus:ring-0 tracking-[0.15em] font-medium"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-[#1C1C1C] text-[#F7F5F0] rounded-full px-6 py-3 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#2A2A2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md whitespace-nowrap shrink-0"
                    >
                      JOIN NOW
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex items-center justify-center bg-[#1C1C1C] text-[#F7F5F0] rounded-full p-4 border border-[#1C1C1C] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)]"
                  >
                    <span className="text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      WELCOME TO THE FOLD
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT COMPOSITION (Image Focus) */}
        <div className="hidden md:flex w-1/2 lg:w-5/12 relative items-center justify-center pointer-events-none mt-10 md:mt-0">
          
          {/* Base slow-breathing ambient aura */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [0.8, 1.05, 0.8] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-[10%] w-[80%] aspect-square rounded-full bg-gradient-to-tr from-[#D1C9B8] via-[#E8E1D2] to-transparent blur-[80px] opacity-60 mix-blend-multiply"
          />

          <motion.div
            initial={{ opacity: 0, filter: 'blur(20px)', y: 40 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 2.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            style={{ x: objectX, y: objectY }}
            className="relative w-full max-w-[280px] lg:max-w-[340px] aspect-[3/4] flex items-center justify-center rounded-[2rem] shadow-[0_30px_90px_rgba(0,0,0,0.12)] border border-[#1C1C1C]/5 overflow-hidden"
          >
            <Image
              src="/images/coming-soon-products.jpeg"
              alt="Terra Men's Cosmetics - Face Wash and Beard Oil"
              fill
              priority
              className="object-cover scale-105"
            />
            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 ring-1 ring-inset ring-[#1C1C1C]/10 rounded-[2rem]"></div>
          </motion.div>
        </div>

      </main>

      {/* PULL QUOTE & BRAND PHILOSOPHY */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1.5 }}
        className="relative z-20 w-full max-w-[1600px] mx-auto px-6 md:px-12 mt-6 md:mt-0 mb-6 md:mb-4"
      >
        <div className="w-full md:w-5/12 lg:w-4/12 border-l border-[#1C1C1C]/10 pl-6 py-2">
          <p className="text-[9px] md:text-[10px] leading-[2.5] uppercase tracking-[0.3em] font-semibold text-[#1C1C1C]/60">
            A NEW STANDARD<br />
            FOR THE MODERN<br />
            GENTLEMAN.
          </p>
        </div>
      </motion.div>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 1.8 }}
        className="relative z-20 flex flex-col md:flex-row justify-between items-center md:items-end p-4 md:p-8 w-full max-w-[1600px] mx-auto border-t border-[#1C1C1C]/[0.05] text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-[#1C1C1C]/40 font-medium gap-4 md:gap-0"
      >
        <div>
          &copy; {new Date().getFullYear()} TERRA MEN&apos;S CO.
        </div>
        <div className="text-center md:text-right tracking-[0.3em]">
          ELEVATED UTILITY.
        </div>
      </motion.footer>

    </div>
  );
}
