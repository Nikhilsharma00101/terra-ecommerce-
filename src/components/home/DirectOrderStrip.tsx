'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Check, Star, Zap, ShieldCheck, Truck, ArrowUpRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { Product } from '@/types';

export const DirectOrderStrip: React.FC = () => {
  const { products, getProductBySlug } = useProducts();
  const { addItem, openCart } = useCart();
  const { showToast } = useUI();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  // Helper to dynamically extract image from DB product record
  const resolveProductImage = (prod?: Product | null, fallback = '/images/home/hero-campaign.jpg'): string => {
    if (!prod) return fallback;
    if (prod.featuredImage && typeof prod.featuredImage === 'string' && prod.featuredImage.trim() !== '') {
      return prod.featuredImage;
    }
    if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
      const valid = prod.images.find((img) => img?.url && img.url.trim() !== '');
      if (valid) return valid.url;
    }
    if (prod.secondaryImage && typeof prod.secondaryImage === 'string' && prod.secondaryImage.trim() !== '') {
      return prod.secondaryImage;
    }
    return fallback;
  };

  // Resolve Products from DB
  const faceWash =
    products.find((p) => p.slug === 'terra-face-wash' || p.slug === 'face-wash' || p.category === 'Face') ||
    products[0];

  const beardOil =
    products.find((p) => p.slug === 'terra-beard-oil' || p.slug === 'beard-oil' || p.category === 'Beard') ||
    (products.length > 1 ? products[1] : products[0]);

  // Dynamically resolve Set / Bundle product from DB (prioritizing custom DB items with images)
  const bundleProduct =
    products.find((p) => (p.category === 'Sets' || p.isBundle) && (p.featuredImage || (p.images && p.images.length > 0 && p.images[0]?.url))) ||
    products.find((p) => (p.slug === 'terra-set' || p.slug === 'the-complete-terra-method') && (p.featuredImage || (p.images && p.images.length > 0 && p.images[0]?.url))) ||
    products.find((p) => p.category === 'Sets' || p.isBundle || p.slug === 'terra-set' || p.purpose === 'The Method') ||
    getProductBySlug('terra-set');

  if (!faceWash || !beardOil) return null;

  // Handle Quick Add Action
  const handleQuickAdd = (e: React.MouseEvent, productToAdd: Product, isBundleAction = false) => {
    e.preventDefault();
    e.stopPropagation();

    if (isBundleAction && !bundleProduct) {
      // Fallback: add both items if bundle record is virtual
      addItem(faceWash, 1);
      addItem(beardOil, 1);
      showToast('The Complete Method (Duo) added to bag.', 'success');
    } else {
      addItem(productToAdd, 1);
      showToast(`${productToAdd.name} added to bag.`, 'success');
    }

    const key = isBundleAction ? 'terra-set' : productToAdd.slug;
    setAddedSlug(key);
    setTimeout(() => {
      setAddedSlug(null);
    }, 1800);

    // Smoothly invite into cart review
    openCart();
  };

  // Calculate dynamic savings
  const bundleSavings = bundleProduct 
    ? (bundleProduct.compareAtPrice || (faceWash.price + beardOil.price)) - bundleProduct.price 
    : 199;

  return (
    <section className="relative bg-[#FAF8F5] border-t border-b border-[#E8E2D7] py-10 lg:py-12 select-none overflow-hidden font-sans">
      {/* Subtle Luxury Watermark Accent in Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#8B0000]/[0.03] to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Compact Architectural Header Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 mb-6 border-b border-[#E8E2D7]/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8B0000]/10 text-[#8B0000] text-[10px] font-semibold tracking-[0.25em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
                DIRECT DISPENSARY • LAB FRESH
              </span>
              <span className="text-[11px] text-gray-500 uppercase tracking-wider font-medium hidden sm:inline-block">
                BATCH 04 / DISPATCH READY
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#141414] font-light tracking-tight">
              Select Your Daily Formulation
            </h2>
          </div>

          {/* Quick Selling Propositions */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] text-gray-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Zap size={13} className="text-[#8B0000]" />
              <span>Ships Within 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck size={13} className="text-[#8B0000]" />
              <span>Free Delivery &gt; ₹999</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-[#8B0000]" />
              <span>100% Clean Actives</span>
            </div>
          </div>
        </div>

        {/* Unconventional Low-Profile Formulation Dock (3 Horizontal Slates) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">

          {/* Slate 01: Face Wash */}
          <div className="group relative bg-white border border-[#E7E1D6] hover:border-[#8B0000]/50 rounded-sm p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-row items-center gap-4">
            {/* Product Thumbnail Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xs bg-[#F4F1EA] border border-[#EAE4D9] shrink-0 overflow-hidden">
              <Image
                src={resolveProductImage(faceWash)}
                alt={faceWash.name}
                fill
                unoptimized={resolveProductImage(faceWash).startsWith('http')}
                sizes="(max-width: 768px) 120px, 140px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 bg-[#121212]/85 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 tracking-wider uppercase">
                {faceWash.purpose?.toUpperCase() || 'CLEANSE'}
              </span>
            </div>

            {/* Product Copy & Quick Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] text-[#8B0000] font-semibold tracking-wider uppercase">
                    {faceWash.size?.includes('100') ? faceWash.size.toUpperCase() : '100ML • GEL'}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-600 text-[10px] font-medium">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    <span>4.9</span>
                  </div>
                </div>

                <Link
                  href={`/shop/${faceWash.slug}`}
                  className="group/link inline-flex items-center gap-1 text-[#141414] hover:text-[#8B0000] transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-serif font-normal leading-tight truncate">
                    {faceWash.name}
                  </h3>
                  <ArrowUpRight size={13} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </Link>

                <p className="text-[11px] text-gray-500 font-light truncate mt-0.5">
                  Salicylic Acid &amp; Green Tea
                </p>
              </div>

              {/* Price & Quick Add */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0EBE2]">
                <span className="text-base font-medium text-[#141414]">
                  ₹{faceWash.price}
                </span>

                <button
                  onClick={(e) => handleQuickAdd(e, faceWash)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
                    addedSlug === faceWash.slug
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#121212] hover:bg-[#8B0000] text-white'
                  }`}
                >
                  {addedSlug === faceWash.slug ? (
                    <>
                      <Check size={12} />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={12} />
                      <span>+ ADD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Slate 02: Beard Oil */}
          <div className="group relative bg-white border border-[#E7E1D6] hover:border-[#8B0000]/50 rounded-sm p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 flex flex-row items-center gap-4">
            {/* Product Thumbnail Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xs bg-[#F4F1EA] border border-[#EAE4D9] shrink-0 overflow-hidden">
              <Image
                src={resolveProductImage(beardOil)}
                alt={beardOil.name}
                fill
                unoptimized={resolveProductImage(beardOil).startsWith('http')}
                sizes="(max-width: 768px) 120px, 140px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 bg-[#121212]/85 backdrop-blur-xs text-white text-[9px] font-semibold px-1.5 py-0.5 tracking-wider uppercase">
                {beardOil.purpose?.toUpperCase() || 'NOURISH'}
              </span>
            </div>

            {/* Product Copy & Quick Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] text-[#8B0000] font-semibold tracking-wider uppercase">
                    {beardOil.size?.includes('30') ? beardOil.size.toUpperCase() : '30ML • DROPPER'}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-600 text-[10px] font-medium">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    <span>4.95</span>
                  </div>
                </div>

                <Link
                  href={`/shop/${beardOil.slug}`}
                  className="group/link inline-flex items-center gap-1 text-[#141414] hover:text-[#8B0000] transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-serif font-normal leading-tight truncate">
                    {beardOil.name}
                  </h3>
                  <ArrowUpRight size={13} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </Link>

                <p className="text-[11px] text-gray-500 font-light truncate mt-0.5">
                  7 Pure Cold-Pressed Botanicals
                </p>
              </div>

              {/* Price & Quick Add */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F0EBE2]">
                <span className="text-base font-medium text-[#141414]">
                  ₹{beardOil.price}
                </span>

                <button
                  onClick={(e) => handleQuickAdd(e, beardOil)}
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs text-[11px] font-semibold tracking-wider uppercase transition-all duration-300 ${
                    addedSlug === beardOil.slug
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#121212] hover:bg-[#8B0000] text-white'
                  }`}
                >
                  {addedSlug === beardOil.slug ? (
                    <>
                      <Check size={12} />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={12} />
                      <span>+ ADD</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Slate 03: The Complete Routine (Hero Bundle Highlight) */}
          <div className="group relative bg-gradient-to-br from-white via-[#FCFBF8] to-[#F7F1E9] border-2 border-[#8B0000]/60 rounded-sm p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-row items-center gap-4 ring-1 ring-[#8B0000]/20">
            {/* Value Ribbon */}
            <div className="absolute -top-2.5 right-3 bg-[#8B0000] text-white text-[9px] font-bold px-2 py-0.5 rounded-xs shadow-xs tracking-wider uppercase flex items-center gap-1">
              <Star size={10} className="fill-white" />
              <span>BEST VALUE • SAVE ₹{bundleSavings}</span>
            </div>

            {/* Product Thumbnail Container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xs bg-[#EFE9DF] border border-[#DFCFC0] shrink-0 overflow-hidden">
              <Image
                src={resolveProductImage(bundleProduct)}
                alt={bundleProduct?.name || 'The Complete Terra Method'}
                fill
                unoptimized={resolveProductImage(bundleProduct).startsWith('http')}
                sizes="(max-width: 768px) 120px, 140px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-1.5 left-1.5 bg-[#8B0000] text-white text-[9px] font-semibold px-1.5 py-0.5 tracking-wider uppercase">
                {bundleProduct?.badge ? bundleProduct.badge.toUpperCase() : 'COMPLETE SET'}
              </span>
            </div>

            {/* Product Copy & Quick Actions */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] text-[#8B0000] font-semibold tracking-wider uppercase">
                    {bundleProduct?.size || 'DUO • 100ML + 30ML'}
                  </span>
                  <div className="flex items-center gap-0.5 text-amber-600 text-[10px] font-medium">
                    <Star size={11} className="fill-amber-500 text-amber-500" />
                    <span>{bundleProduct?.rating || 4.98}</span>
                  </div>
                </div>

                <Link
                  href={`/shop/${bundleProduct?.slug || 'terra-set'}`}
                  className="group/link inline-flex items-center gap-1 text-[#141414] hover:text-[#8B0000] transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-serif font-normal leading-tight truncate">
                    {bundleProduct?.name || 'The Complete Method'}
                  </h3>
                  <ArrowUpRight size={13} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                </Link>

                <p className="text-[11px] text-[#8B0000] font-medium truncate mt-0.5">
                  {bundleProduct?.tagline || 'Cleanse + Nourish Daily Regimen'}
                </p>
              </div>

              {/* Price & Quick Add */}
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#DFCFC0]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-[#141414]">
                    ₹{bundleProduct ? bundleProduct.price : 1399}
                  </span>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{bundleProduct?.compareAtPrice || (faceWash.price + beardOil.price)}
                  </span>
                </div>

                <button
                  onClick={(e) =>
                    handleQuickAdd(e, bundleProduct || faceWash, !bundleProduct)
                  }
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xs text-[11px] font-bold tracking-wider uppercase transition-all duration-300 shadow-xs ${
                    addedSlug === (bundleProduct?.slug || 'terra-set')
                      ? 'bg-[#E5D5C5] text-black border-[#E5D5C5]'
                      : 'bg-[#2A2A2A] text-white hover:bg-[#333333] border-[#333333]'
                  }`}
                >
                  {addedSlug === (bundleProduct?.slug || 'terra-set') ? (
                    <>
                      <Check size={12} />
                      <span>ADDED</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={12} />
                      <span>+ GET DUO</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Ultra-Slim Reassurance Micro-Bar */}
        <div className="mt-5 pt-4 border-t border-[#EAE4D9] flex flex-wrap items-center justify-between gap-3 text-[10px] text-gray-500 font-medium tracking-wide">
          <span>✓ AUTHENTIC BOTANICAL FORMULATIONS</span>
          <span>✓ CASH ON DELIVERY &amp; INSTANT UPI ACCEPTED</span>
          <span>✓ 30-DAY RISK-FREE SATISFACTION POLICY</span>
        </div>

      </div>
    </section>
  );
};
