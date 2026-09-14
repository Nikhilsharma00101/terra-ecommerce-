'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import Link from 'next/link';

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen bg-black text-[#F6F3ED] overflow-hidden flex flex-col items-center justify-center font-sans">
      {/* Background Image & Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: "url('/images/coming-soon-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl px-6 text-center">
        {/* Logo area */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="mb-16"
        >
          <h2 className="text-xl md:text-2xl tracking-[0.4em] font-serif uppercase text-[#F6F3ED]/90 border-b border-[#F6F3ED]/20 pb-4">
            Terra Men&apos;s Co.
          </h2>
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light leading-tight text-white drop-shadow-lg">
            Something Better <br />
            <span className="italic text-[#c4a482]">Is Coming.</span>
          </h1>
          <p className="text-base md:text-lg text-gray-300 max-w-xl mx-auto font-light leading-relaxed tracking-wide">
            We are building a premium grooming experience. Clean, simple, and effective. 
            Join the waitlist to get early access.
          </p>
        </motion.div>

        {/* Notify Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
          className="mt-14 w-full max-w-md mx-auto"
        >
          <form className="relative flex flex-col sm:flex-row gap-4 sm:gap-0 items-center" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-white/5 border border-white/20 rounded-full sm:rounded-r-none py-4 px-6 text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#c4a482] focus:border-[#c4a482] transition-all backdrop-blur-md"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#c4a482] hover:bg-[#d8b896] text-black font-medium tracking-wide rounded-full sm:rounded-l-none sm:rounded-r-full py-4 px-8 transition-colors duration-300"
            >
              Join Waitlist
            </button>
          </form>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
          className="mt-20 flex gap-8"
        >
          <Link href="#" className="text-gray-400 hover:text-[#c4a482] hover:scale-110 transition-all duration-300">
            <InstagramIcon size={22} />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-[#c4a482] hover:scale-110 transition-all duration-300">
            <TwitterIcon size={22} />
          </Link>
          <Link href="#" className="text-gray-400 hover:text-[#c4a482] hover:scale-110 transition-all duration-300">
            <Mail size={22} strokeWidth={1.5} />
          </Link>
        </motion.div>
      </div>

      {/* Footer text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-8 text-xs tracking-widest text-gray-500 uppercase font-light"
      >
        © {new Date().getFullYear()} Terra Men&apos;s Co.
      </motion.div>
    </div>
  );
}
