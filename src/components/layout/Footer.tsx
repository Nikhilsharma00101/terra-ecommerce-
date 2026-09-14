'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { useUI } from '@/context/UIContext';
import {
  ArrowRight,
  ArrowUp,
  Check,
  Truck,
  ShieldCheck,
  Leaf,
  Lock,
  Globe,
  Sparkles,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useUI();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    showToast('Welcome to Terra. Confirmation sent to your inbox.', 'success');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#121212] text-[#D4CEBF] pt-20 pb-12 border-t border-[#333333] relative overflow-hidden select-none">
      {/* Background Subtle Gradient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#8B0000]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1. TRUST & QUALITY ASSURANCE BADGES STRIP                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-[#333333]">
          <div className="flex items-center gap-3.5 bg-[#1A1A1A] border border-[#333333] p-4 transition-colors hover:border-[#DC143C]">
            <Leaf size={20} className="text-[#DC143C] shrink-0" />
            <div>
              <h5 className="text-xs font-medium text-white uppercase tracking-wider">100% Pure Botanicals</h5>
              <p className="text-[10px] text-gray-500">Cold-pressed plant oils</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#1A1A1A] border border-[#333333] p-4 transition-colors hover:border-[#DC143C]">
            <Truck size={20} className="text-[#DC143C] shrink-0" />
            <div>
              <h5 className="text-xs font-medium text-white uppercase tracking-wider">Express Dispatch</h5>
              <p className="text-[10px] text-gray-500">Free delivery over ₹999</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#1A1A1A] border border-[#333333] p-4 transition-colors hover:border-[#DC143C]">
            <ShieldCheck size={20} className="text-[#DC143C] shrink-0" />
            <div>
              <h5 className="text-xs font-medium text-white uppercase tracking-wider">Risk-Free Trial</h5>
              <p className="text-[10px] text-gray-500">30-day money-back policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-[#1A1A1A] border border-[#333333] p-4 transition-colors hover:border-[#DC143C]">
            <Lock size={20} className="text-[#DC143C] shrink-0" />
            <div>
              <h5 className="text-xs font-medium text-white uppercase tracking-wider">Secure Checkout</h5>
              <p className="text-[10px] text-gray-500">UPI, Cards, COD Available</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. NEWSLETTER DISPATCHES & EXCLUSIVE ACCESS                               */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-16 border-b border-[#333333] items-center">
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#DC143C] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#DC143C] font-mono font-semibold">
                JOIN THE TERRA CLUB
              </span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-white font-light leading-tight">
              Get 10% off your first routine & exclusive dispatches.
            </h3>
            <p className="text-xs text-gray-400 font-light max-w-md leading-relaxed">
              Subscribe to receive minimalist skincare advice, product drop alerts, and subscriber-only access.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="bg-[#2A1010] border border-[#8B0000] p-5 flex items-center gap-3 text-white">
                <Check className="text-[#DC143C]" size={20} />
                <div>
                  <p className="text-xs uppercase tracking-widest font-semibold text-white">
                    YOU ARE REGISTERED FOR TERRA DISPATCHES
                  </p>
                  <p className="text-[10px] text-gray-400">Check your inbox for your 10% welcome code.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="bg-[#1A1A1A] border border-[#333333] text-xs text-white px-5 py-4 flex-1 focus:outline-none focus:border-[#DC143C] placeholder-gray-500 tracking-wide transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#DC143C] hover:text-white transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <span>SUBSCRIBE</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. NAVIGATION COLUMNS                                                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 py-16 border-b border-[#333333]">
          {/* Column 1: PRODUCTS */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold mb-5 font-mono">
              PRODUCTS
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/shop/face-wash" className="hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span>Face Wash</span>
                  <span className="text-[9px] bg-[#DC143C] text-white px-1.5 py-0.2 rounded-xs font-mono">HOT</span>
                </Link>
              </li>
              <li>
                <Link href="/shop/beard-oil" className="hover:text-white transition-colors">
                  Beard Oil
                </Link>
              </li>
              <li>
                <Link href="/shop/terra-set" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>The Complete Method</span>
                  <span className="text-[9px] bg-[#2D4438] text-white px-1.5 py-0.2 rounded-xs font-mono">SAVE ₹399</span>
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  All Formulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: EXPLORE */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold mb-5 font-mono">
              EXPLORE
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Terra
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-white transition-colors">
                  Journal & Stories
                </Link>
              </li>
              <li>
                <Link href="/about#standards" className="hover:text-white transition-colors">
                  Our Botanical Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER CARE */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold mb-5 font-mono">
              SUPPORT
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/about#contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/about#faq" className="hover:text-white transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/about#shipping" className="hover:text-white transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ACCOUNT */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold mb-5 font-mono">
              ACCOUNT
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Sign In / Register
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: LEGAL */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold mb-5 font-mono">
              LEGAL
            </h4>
            <ul className="space-y-3 text-xs text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: SOCIAL & REGION */}
          <div>
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold mb-5 font-mono">
              SOCIAL
            </h4>
            <ul className="space-y-3 text-xs text-gray-400 mb-6">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>YouTube</span>
                </a>
              </li>
            </ul>

            {/* Region Pill */}
            <div className="inline-flex items-center gap-2 bg-[#1A1A1A] border border-[#333333] px-3 py-1.5 text-[10px] font-mono text-[#DC143C]">
              <Globe size={12} />
              <span>India (INR ₹)</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. GIANT BRAND STATEMENT & BACK TO TOP BUTTON                             */}
        {/* ========================================================================= */}
        <div className="pt-16 pb-12 flex flex-col items-center justify-center text-center relative">
          <Logo variant="full" color="#FFFFFF" markHeight={52} />

          <p className="font-serif text-sm tracking-widest text-gray-500 uppercase mt-4">
            CLEANSE. NOURISH. REVEAL.
          </p>

          {/* Back To Top Floating Action Button */}
          <button
            onClick={scrollToTop}
            className="mt-8 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.25em] text-[#DC143C] hover:text-white border border-[#333333] hover:border-[#DC143C] px-4 py-2 transition-all cursor-pointer bg-[#1A1A1A]"
          >
            <ArrowUp size={13} />
            <span>BACK TO TOP</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 5. BOTTOM COPYRIGHT ROW                                                   */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-[#333333] flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} TERRA MEN’S CARE CO. All rights reserved. Prices include all GST taxes.</p>
          <div className="flex items-center space-x-6 font-mono text-[10px]">
            <span>Fast Dispatch across India</span>
            <span>✦</span>
            <span>Cold-Pressed Quality Guarantee</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
