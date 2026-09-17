'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';
import { Menu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { openMobileNav } = useUI();
  const { user, isAuthenticated } = useAuth();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 20);
        rafId = null;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  const productLinks = [
    { label: 'FACE WASH', href: '/shop/terra-face-wash' },
    { label: 'BEARD OIL', href: '/shop/terra-beard-oil' },
    { label: 'SHOP', href: '/shop' },
  ];
  
  const secondaryLinks = [
    { label: 'JOURNAL', href: '/journal' },
    { label: 'ABOUT US', href: '/about' },
  ];

  return (
    <nav
      className={`relative w-full z-50 transition-colors duration-300 border-b ${
        scrolled
          ? 'bg-[#121212] border-white/10 shadow-md'
          : 'bg-[#121212] border-transparent'
      }`}
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TIER 1: UTILITIES & BRANDING */}
        <div className="flex items-center justify-between h-[70px] sm:h-[85px]">
          
          {/* Left: Mobile Menu & Clean Whitespace */}
          <div className="flex-1 flex items-center justify-start">
            <button
              onClick={openMobileNav}
              className="lg:hidden text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Open navigation menu"
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <div className="flex-1 flex items-center justify-center shrink-0">
            <Logo
              variant="full"
              color="#FFFFFF"
              markHeight={scrolled || !isHome ? 24 : 32}
              compact={scrolled || !isHome}
              className="py-0 relative z-10 transition-transform hover:scale-105 duration-300"
            />
          </div>

          {/* Right: Account & Cart */}
          <div className="flex-1 flex items-center justify-end gap-4 sm:gap-6 lg:gap-8">
            {/* User Profile Button */}
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className="group flex items-center gap-2.5 text-white hover:text-[#DC143C] transition-all focus:outline-none cursor-pointer"
              aria-label={isAuthenticated ? 'My Account' : 'Sign In'}
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-[#DC143C] group-hover:bg-[#DC143C]/10 group-hover:shadow-[0_0_15px_rgba(220,20,60,0.3)] transition-all duration-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:scale-110"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                </svg>
              </div>
              <span className="hidden lg:inline text-[10px] tracking-[0.22em] font-semibold uppercase">
                {isAuthenticated ? (user?.name?.split(' ')[0] || 'ACCOUNT') : 'SIGN IN'}
              </span>
            </Link>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="group flex items-center gap-2.5 text-white hover:text-[#DC143C] transition-all focus:outline-none cursor-pointer"
              aria-label={`View shopping bag (${totalItems} items)`}
            >
              <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 border border-white/15 flex items-center justify-center group-hover:border-[#DC143C] group-hover:bg-[#DC143C]/10 group-hover:shadow-[0_0_15px_rgba(220,20,60,0.3)] transition-all duration-300">
                {/* Cyber-Speed Cart Icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                >
                  <path d="M2 3.5h3.2l2.2 10a1.5 1.5 0 0 0 1.5 1.2h9.6a1.5 1.5 0 0 0 1.5-1.1l2.2-7.8H5.8" />
                  <line x1="8" y1="9.5" x2="19.5" y2="9.5" strokeWidth="1.2" strokeOpacity="0.45" />
                  <circle cx="9.5" cy="19" r="1.8" />
                  <circle cx="17.5" cy="19" r="1.8" />
                  <circle cx="9.5" cy="19" r="0.6" fill="currentColor" />
                  <circle cx="17.5" cy="19" r="0.6" fill="currentColor" />
                </svg>

                {/* HUD Cargo Badge */}
                {totalItems > 0 && (
                  <div className="absolute -top-1.5 -right-2 sm:-right-2.5 flex items-center h-[17px] px-1.5 rounded-[4px] bg-[#0A0A0A] border border-[#DC143C]/70 shadow-[0_0_12px_rgba(220,20,60,0.5)] backdrop-blur-md transition-all duration-300 group-hover:border-[#DC143C] group-hover:shadow-[0_0_18px_rgba(220,20,60,0.7)] pointer-events-none">
                    <span className="text-[7.5px] font-mono text-[#DC143C] font-black mr-0.5 tracking-tighter select-none">{'//'}</span>
                    <span className="text-[9px] font-mono font-black tracking-tight text-white leading-none">
                      {totalItems < 10 ? `0${totalItems}` : totalItems > 99 ? '99+' : totalItems}
                    </span>
                  </div>
                )}
              </div>
              <span className="hidden sm:inline-block text-[10px] tracking-[0.22em] font-semibold uppercase">
                BAG
              </span>
            </Link>
          </div>
        </div>

        {/* TIER 2: PRODUCT CATEGORIES (Desktop Only) */}
        <div className="hidden lg:flex items-center justify-center h-[50px] border-t border-white/10 gap-12">
          
          {productLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative group py-2 focus:outline-none"
            >
              <span className="text-white text-[11px] tracking-[0.25em] font-medium uppercase transition-colors duration-300 group-hover:text-[#DC143C]">
                {link.label}
              </span>
              <span className="absolute bottom-1 left-1/2 w-0 h-[1px] bg-[#DC143C] transition-all duration-300 ease-out group-hover:w-full group-hover:left-0" />
            </Link>
          ))}

          <span className="h-4 w-px bg-white/20 mx-2"></span>

          {secondaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-gray-400 text-[10px] tracking-[0.2em] font-medium uppercase hover:text-white transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}
          
        </div>

      </div>
    </nav>
  );
};
