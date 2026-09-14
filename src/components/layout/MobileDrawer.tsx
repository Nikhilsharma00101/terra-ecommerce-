'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import { Logo } from '@/components/ui/Logo';
import { X, ArrowRight, User } from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const { isMobileNavOpen, closeMobileNav } = useUI();
  const pathname = usePathname();

  if (!isMobileNavOpen) return null;

  const links = [
    { label: 'SHOP', href: '/shop', subtitle: 'View all products' },
    { label: 'BLOG', href: '/journal', subtitle: 'Grooming tips & articles' },
    { label: 'ABOUT US', href: '/about', subtitle: 'Our brand story' },
    { label: 'CART', href: '/cart', subtitle: 'View your cart items' },
    { label: 'ACCOUNT', href: '/account', subtitle: 'Orders & saved details' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F6F3ED] text-[#181817] animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-6 border-b border-[#DDD8CF]">
        <Logo variant="full" markHeight={26} />
        <button
          onClick={closeMobileNav}
          className="p-2 text-[#181817] hover:text-[#2D4438] focus:outline-none"
          aria-label="Close menu"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col justify-between">
        <nav className="space-y-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileNav}
                className="group flex items-center justify-between py-2 border-b border-[#DDD8CF]/40"
              >
                <div>
                  <span
                    className={`font-serif text-2xl tracking-wide uppercase transition-colors ${isActive
                        ? 'text-[#2D4438] font-semibold'
                        : 'text-[#181817] group-hover:text-[#2D4438]'
                      }`}
                  >
                    {link.label}
                  </span>
                  <p className="text-xs text-[#77736C] font-sans mt-0.5">
                    {link.subtitle}
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-[#DDD8CF] group-hover:text-[#2D4438] group-hover:translate-x-1 transition-all"
                />
              </Link>
            );
          })}
        </nav>

        {/* Feature Callout in drawer */}
        <div className="mt-8 pt-6 border-t border-[#DDD8CF]">
          <div className="bg-[#EAE5DC] p-5">
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#2D4438]">
              The Core Routine
            </span>
            <h4 className="font-serif text-lg text-[#181817] mt-1">
              The Complete Terra Method
            </h4>
            <p className="text-xs text-[#77736C] mt-1">
              Face Wash + Beard Oil. The deliberate two-step fundamental set.
            </p>
            <Link
              href="/shop/terra-set"
              onClick={closeMobileNav}
              className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#181817] hover:text-[#2D4438] mt-3"
            >
              Shop The Method &rarr;
            </Link>
          </div>

          <div className="flex items-center justify-between mt-6 text-xs text-[#77736C]">
            <Link
              href="/account"
              onClick={closeMobileNav}
              className="flex items-center gap-1.5 hover:text-[#181817]"
            >
              <User size={14} />
              <span>Customer Portal</span>
            </Link>
            <span>INR (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
