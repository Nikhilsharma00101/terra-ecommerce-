'use client';

import React from 'react';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';

export const ProductMarquee: React.FC = () => {
  const { products, getProductBySlug } = useProducts();
  
  const faceWash =
    products.find(p => p.slug === 'terra-face-wash' || p.slug === 'face-wash' || p.category === 'Face') || products[0];
  const beardOil =
    products.find(p => p.slug === 'terra-beard-oil' || p.slug === 'beard-oil' || p.category === 'Beard') || (products.length > 1 ? products[1] : products[0]);

  if (!faceWash || !beardOil) return null;

  // Duplicate items many times to create a seamless infinite scroll effect
  const marqueeItems = Array(10).fill([faceWash, beardOil]).flat();

  return (
    <section className="w-full bg-[#0a0a0a] border-y border-white/5 overflow-hidden relative flex items-center h-14 sm:h-16 z-30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      
      {/* Inject custom CSS for the infinite marquee animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-strip {
          display: flex;
          width: fit-content;
          animation: marquee-scroll 40s linear infinite;
        }
      `}} />

      {/* Gradient masks on edges for smooth fade out */}
      <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      {/* The scrolling track */}
      <div className="animate-marquee-strip hover:[animation-play-state:paused]">
        {marqueeItems.map((product, index) => (
          <Link
            key={`${product.id || product.slug}-${index}`}
            href={`/shop/${product.slug || product.id}`}
            className="flex items-center gap-3 sm:gap-4 px-6 sm:px-10 group cursor-pointer shrink-0"
          >
            {/* Dynamic Product Image */}
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/10 group-hover:border-[#DC143C] transition-colors duration-500 shrink-0">
              <img 
                src={product.featuredImage || product.images?.[0]?.url || '/images/home/hero-products.jpeg'} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
              />
            </div>
            
            {/* Typography */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[#DC143C] text-[8px] sm:text-[9px] uppercase tracking-[0.2em] font-bold">
                {product.name === faceWash.name ? 'Step 01' : 'Step 02'}
              </span>
              <span className="text-gray-400 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-medium whitespace-nowrap group-hover:text-white transition-colors duration-300">
                {product.name}
              </span>
            </div>

            {/* Separator icon */}
            <span className="text-white/10 ml-6 sm:ml-10 text-[10px] shrink-0">✦</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
