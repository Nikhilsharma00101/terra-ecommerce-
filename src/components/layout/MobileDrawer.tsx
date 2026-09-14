'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUI } from '@/context/UIContext';
import { Logo } from '@/components/ui/Logo';
import { X, User, ShoppingBag, BookOpen, Info, ChevronRight, Heart } from 'lucide-react';

export const MobileDrawer: React.FC = () => {
  const { isMobileNavOpen, closeMobileNav } = useUI();
  const pathname = usePathname();

  if (!isMobileNavOpen) return null;

  const links = [
    { label: 'Shop Collection', href: '/shop', subtitle: 'View all our premium products', icon: ShoppingBag },
    { label: 'Journal', href: '/journal', subtitle: 'Grooming tips & articles', icon: BookOpen },
    { label: 'Wishlist', href: '/wishlist', subtitle: 'Your saved favorite items', icon: Heart },
    { label: 'Our Story', href: '/about', subtitle: 'The Terra brand philosophy', icon: Info },
    { label: 'Customer Portal', href: '/account', subtitle: 'Manage your account & orders', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#F9F8F6] text-[#181817] animate-in fade-in duration-300 overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-6 bg-white/50 backdrop-blur-md border-b border-[#EAE5DC] sticky top-0 z-10">
        <Logo variant="full" markHeight={26} />
        <button
          onClick={closeMobileNav}
          className="p-2 -mr-2 bg-[#F2EFEA] rounded-full text-[#181817] hover:bg-[#EAE5DC] hover:text-[#2D4438] transition-colors focus:outline-none"
          aria-label="Close menu"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-6 py-8 flex flex-col gap-6 overflow-hidden">
        
        {/* Navigation Cards */}
        <nav className="flex flex-col space-y-3">
          {links.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileNav}
                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                  isActive 
                    ? 'bg-white border-[#2D4438]/20 shadow-sm' 
                    : 'bg-white/60 border-transparent hover:bg-white hover:border-[#EAE5DC] hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${
                    isActive ? 'bg-[#2D4438]/10 text-[#2D4438]' : 'bg-[#F2EFEA] text-[#77736C] group-hover:bg-[#2D4438]/5 group-hover:text-[#2D4438]'
                  }`}>
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <span className="block font-serif text-xl text-[#181817]">
                      {link.label}
                    </span>
                    <span className="block text-xs text-[#77736C] mt-0.5">
                      {link.subtitle}
                    </span>
                  </div>
                </div>
                <ChevronRight 
                  size={18} 
                  className={`transition-transform duration-300 ${
                    isActive ? 'text-[#2D4438]' : 'text-[#DDD8CF] group-hover:text-[#2D4438] group-hover:translate-x-1'
                  }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
