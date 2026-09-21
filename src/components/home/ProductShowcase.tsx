'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { useProducts, PRODUCTS_UPDATED_EVENT } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/types';

export const ProductShowcase: React.FC = () => {
  const { products, refreshProducts } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen to product updates from admin / DB mutations
  useEffect(() => {
    const handleProductsUpdated = () => {
      if (refreshProducts) {
        refreshProducts();
      }
    };
    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleProductsUpdated);
    };
  }, [refreshProducts]);

  // Robust resolver for live database product images (Cloudinary / DB images / fallback)
  const resolveProductImage = (prod?: Product | null): string => {
    if (!prod) return '/images/home/hero-products.jpeg';
    if (prod.featuredImage && typeof prod.featuredImage === 'string' && prod.featuredImage.trim() !== '') {
      return prod.featuredImage;
    }
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0 && prod.images[0]?.url) {
      return prod.images[0].url;
    }
    if (prod.secondaryImage && typeof prod.secondaryImage === 'string' && prod.secondaryImage.trim() !== '') {
      return prod.secondaryImage;
    }
    return '/images/home/hero-products.jpeg';
  };

  // Find foundational essential products from live MongoDB catalog
  const faceWash =
    products.find(
      (p) =>
        p.slug === 'terra-face-wash' ||
        p.slug === 'face-wash' ||
        p.category === 'Face' ||
        p.purpose?.toLowerCase() === 'cleanse'
    ) || products[0];

  const beardOil =
    products.find(
      (p) =>
        p.slug === 'terra-beard-oil' ||
        p.slug === 'beard-oil' ||
        p.category === 'Beard' ||
        p.purpose?.toLowerCase() === 'nourish'
    ) || (products.length > 1 ? products[1] : products[0]);

  if (!faceWash || !beardOil) return null;

  const showcaseItems = [
    {
      product: faceWash,
      action: faceWash.purpose?.toUpperCase() || 'CLEANSE',
      badge: faceWash.badge || 'Step 01 — Cleanse',
      tagline: faceWash.tagline || 'THE DAILY CLEANSE',
      image: resolveProductImage(faceWash),
      desc: faceWash.shortDescription || faceWash.tagline || faceWash.fullDescription || '',
    },
    {
      product: beardOil,
      action: beardOil.purpose?.toUpperCase() || 'NOURISH',
      badge: beardOil.badge || 'Step 02 — Nourish',
      tagline: beardOil.tagline || 'THE DAILY NOURISH',
      image: resolveProductImage(beardOil),
      desc: beardOil.shortDescription || beardOil.tagline || beardOil.fullDescription || '',
    },
  ];

  return (
    <section className="relative py-10 lg:py-16 select-none overflow-hidden bg-white">
      {/* Dynamic Generated Botanical Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/home/essential-bg.jpeg"
          alt="Luxury Botanical Background"
          fill
          priority
          className="object-cover opacity-90"
          sizes="100vw"
        />
        {/* Very subtle wash to ensure contrast for any text */}
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* Designed Intro Section */}
        <div className="mb-8 lg:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#8B0000]/10">
          <div className="space-y-3 max-w-xl">
            {/* Kicker Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B0000]/8 border border-[#8B0000]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
              <span className="text-[#8B0000] text-[10px] font-semibold tracking-[0.3em] uppercase">
                THE ESSENTIALS
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#121212] font-light tracking-tight leading-[1.12]">
              Everything you need.<br />
              <span className="italic text-[#8B0000] font-normal relative inline-block">
                Nothing you don&apos;t.
                <span className="absolute bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#8B0000] to-transparent opacity-30" />
              </span>
            </h2>
          </div>

          {/* Right Side Context / Tagline */}
          <div className="md:text-right space-y-2 shrink-0">
            <p className="text-gray-600 text-xs sm:text-sm font-light leading-relaxed max-w-xs md:ml-auto">
              Pure botanical formulas engineered for effortless daily grooming.
            </p>
            <div className="inline-flex items-center gap-2 text-[#8B0000]/60 text-[10px] font-semibold tracking-widest uppercase">
              <span>{faceWash.purpose?.toUpperCase() || 'CLEANSE'}</span>
              <span>•</span>
              <span>{beardOil.purpose?.toUpperCase() || 'NOURISH'}</span>
            </div>
          </div>
        </div>

        {/* The Split Accordion Container */}
        <div className="flex flex-col lg:flex-row w-full h-[380px] sm:h-[420px] lg:h-[440px] shadow-2xl rounded-sm overflow-hidden bg-[#121212]">

          {showcaseItems.map((item, index) => {
            const currentActiveIndex = isMobile && activeIndex === null ? 0 : activeIndex;
            const isActive = currentActiveIndex === index;
            const isHovered = currentActiveIndex !== null;
            const productId = item.product._id || item.product.id || item.product.slug;
            const inWishlist =
              isInWishlist(item.product._id || '') ||
              isInWishlist(item.product.id || '') ||
              isInWishlist(item.product.slug || '');

            return (
              <div
                key={productId}
                className="relative overflow-hidden cursor-pointer group transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ flex: isActive ? 3 : isHovered ? 1 : 2 }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => setActiveIndex(index)}
              >
                {/* Background Image from DB */}
                <Image
                  src={item.image}
                  alt={item.product.name}
                  fill
                  unoptimized={item.image.startsWith('http')}
                  className={`object-cover transition-transform duration-1000 origin-center ${isActive ? 'scale-105' : 'scale-100'}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />

                {/* Overlays */}
                <div
                  className={`absolute inset-0 bg-black transition-opacity duration-700 ${isActive ? 'opacity-30' : 'opacity-60'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Resting State (Title, Purpose & Size) */}
                <div
                  className={`absolute inset-0 flex flex-col justify-end p-6 transition-all duration-700 ${isActive ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#DC143C] font-semibold text-xs tracking-widest uppercase">
                      {item.action}
                    </span>
                    {item.product.size && (
                      <>
                        <span className="text-white/30 text-xs">•</span>
                        <span className="text-gray-300 text-xs tracking-wider">
                          {item.product.size}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-white text-2xl md:text-3xl font-serif font-light whitespace-nowrap">
                    {item.product.name}
                  </h3>
                  {item.tagline && (
                    <p className="text-white/60 text-[11px] uppercase tracking-[0.2em] font-medium mt-1">
                      {item.tagline}
                    </p>
                  )}
                </div>

                {/* Active State (Full Live DB Details) */}
                <div
                  className={`absolute inset-0 p-6 sm:p-8 lg:p-10 flex flex-col justify-end transition-all duration-700 delay-100 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
                >
                  {/* Top Right Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(productId);
                    }}
                    aria-label="Save to Wishlist"
                    className="absolute top-5 right-5 sm:top-6 sm:right-6 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-[#8B0000] hover:border-[#8B0000] transition-colors shadow-lg"
                  >
                    <Heart
                      size={18}
                      className={inWishlist ? 'fill-white text-white' : 'text-white'}
                    />
                  </button>

                  <div className="max-w-md w-full relative z-10">
                    {/* Step & Badge metadata */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[#DC143C] font-semibold text-[10px] tracking-[0.2em] uppercase shadow-sm">
                        {item.action}
                      </span>
                      {item.badge && (
                        <>
                          <span className="text-white/30 text-[10px]">•</span>
                          <span className="text-white/80 text-[10px] tracking-[0.15em] uppercase font-medium">
                            {item.badge}
                          </span>
                        </>
                      )}
                      {item.product.size && (
                        <>
                          <span className="text-white/30 text-[10px]">•</span>
                          <span className="text-gray-300 text-[10px] tracking-wider uppercase">
                            {item.product.size}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl lg:text-4xl text-white font-serif font-light mb-2 sm:mb-3 leading-tight">
                      {item.product.name}
                    </h3>

                    {/* Live DB Description */}
                    <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-2">
                      {item.desc}
                    </p>

                    <div className="flex flex-row items-center gap-4 sm:gap-6">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-xl sm:text-2xl text-white font-light">₹{item.product.price}</span>
                        {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                          <span className="text-sm text-gray-400 line-through">₹{item.product.compareAtPrice}</span>
                        )}
                      </div>
                      <Link
                        href={`/shop/${item.product.slug}`}
                        className="inline-flex items-center justify-center gap-2.5 bg-white text-[#121212] px-6 py-3 text-xs font-bold tracking-widest uppercase hover:bg-[#DC143C] hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
