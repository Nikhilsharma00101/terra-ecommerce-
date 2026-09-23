'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products so we can cross-reference the wishlist IDs
  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : { products: [] }))
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => console.error('Failed to load products for wishlist:', err))
      .finally(() => setLoading(false));
  }, []);

  const wishlistedProducts = products.filter(
    (p) => (p._id && wishlist.includes(p._id)) || (p.id && wishlist.includes(p.id)) || (p.slug && wishlist.includes(p.slug))
  );

  const getProductImage = (p: any): string => {
    if (p?.featuredImage && typeof p.featuredImage === 'string' && p.featuredImage.trim() !== '') {
      return p.featuredImage;
    }
    if (p?.images && Array.isArray(p.images) && p.images.length > 0 && p.images[0]?.url) {
      return p.images[0].url;
    }
    if (p?.secondaryImage && typeof p.secondaryImage === 'string' && p.secondaryImage.trim() !== '') {
      return p.secondaryImage;
    }
    return '/images/home/hero-products.jpeg';
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1A1A1A] font-sans selection:bg-primary-container selection:text-white">
      <div className="w-full pb-20 min-h-[calc(100vh-18rem)]">
        <div className="w-full max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#888888] mb-8 font-label-caps">
            <Link href="/" className="hover:text-[#111111] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/account" className="hover:text-[#111111] transition-colors">Account</Link>
            <span>/</span>
            <span className="text-[#9B111E] font-semibold">Wishlist</span>
          </nav>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#E5E0D8] pb-8 mb-10 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="font-serif text-3xl sm:text-4xl text-[#111111] font-semibold tracking-tight">My Wishlist</h1>
                <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold tracking-wider font-label-caps uppercase bg-[#F0EBE1] text-[#7A1F26] border border-[#E3DACB]">
                  {authLoading || loading ? '...' : `${wishlistedProducts.length} Items Saved`}
                </span>
              </div>
              <p className="text-[#666666] text-sm sm:text-base max-w-xl leading-relaxed">
                Items you have saved to purchase later. Enjoy complimentary express shipping across India on every order.
              </p>
              {!authLoading && !user && (
                <p className="text-sm font-medium text-[#9B111E] mt-2">
                  Viewing a guest wishlist. <Link href="/login?redirect=/wishlist" className="underline hover:text-black">Log in</Link> to save it permanently.
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button 
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Wishlist link copied to clipboard.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5E0D8] text-xs font-label-caps tracking-widest uppercase text-[#333333] hover:border-[#111111] hover:text-[#111111] transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">share</span>
                Share List
              </button>
            </div>
          </div>

          {loading ? (
             <div className="py-32 flex flex-col items-center justify-center text-[#888888]">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#9B111E]" />
               <p className="text-sm uppercase tracking-widest">Loading...</p>
             </div>
          ) : wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 mb-12">
              {wishlistedProducts.map((p) => {
                const imgSrc = getProductImage(p);
                const id = (p._id || p.id || p.slug) as string;
                
                return (
                  <article key={id} className="group relative bg-white border border-[#E5E0D8] p-5 sm:p-7 transition-all duration-300 hover:border-[#C8BFB0] hover:shadow-lg flex flex-col md:flex-row items-center md:items-stretch gap-6 sm:gap-8">
                    {/* Product Visual */}
                    <Link href={`/shop/product/${p.slug}`} className="relative w-full md:w-56 h-64 md:h-auto bg-[#F4F1EA] flex-shrink-0 flex items-center justify-center overflow-hidden border border-[#EDE8E0]">
                      <Image 
                        src={imgSrc}
                        alt={p.name}
                        fill
                        unoptimized={true}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    </Link>
                    
                    {/* Product Meta & Specifications */}
                    <div className="flex-1 flex flex-col justify-between w-full">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-label-caps tracking-widest uppercase text-[#9B111E] font-semibold mb-1">
                              {p.category || 'Grooming Ritual'}
                            </p>
                            <Link href={`/shop/product/${p.slug}`}>
                              <h2 className="font-serif text-xl sm:text-2xl text-[#111111] font-semibold tracking-tight hover:text-[#9B111E] transition-colors">{p.name}</h2>
                            </Link>
                            <p className="text-xs text-[#777777] mt-1 font-mono tracking-wide line-clamp-1">{p.shortDescription || 'Botanical formulation'}</p>
                          </div>
                          
                          {/* Price Box */}
                          <div className="text-right flex-shrink-0">
                            <span className="text-xl sm:text-2xl font-bold font-mono text-[#111111]">₹{p.price?.toLocaleString('en-IN') || 0}</span>
                            <span className="block text-[11px] text-[#888888] font-normal tracking-wide">Incl. of all taxes</span>
                          </div>
                        </div>
                        
                        {/* Stock Status */}
                        <div className="flex items-center gap-2 mt-3 text-xs font-medium text-[#2E7D32]">
                          <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse"></span>
                          <span>In Stock — Ships within 24 Hours</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-[#F0EBE1]">
                        <div className="flex items-center gap-2 text-xs text-[#888888]">
                          <span className="material-symbols-outlined text-[16px] text-[#777777]">local_shipping</span>
                          <span>Complimentary Doorstep Delivery</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              toggleWishlist(id);
                            }}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-label-caps tracking-widest uppercase text-[#777777] hover:text-[#9B111E] hover:bg-[#FDF2F2] transition-colors border border-transparent hover:border-[#F5C2C7]"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete_outline</span>
                            <span>Remove</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              addItem(p, 1);
                            }}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#9B111E] hover:bg-[#800020] text-white text-xs font-label-caps tracking-widest uppercase font-semibold transition-all shadow-sm active:scale-[0.99]"
                          >
                            <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
                            <span>Move to Bag</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-[#E5E0D8] p-8 mb-12">
              <div className="w-16 h-16 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#9B111E]">
                <span className="material-symbols-outlined text-3xl">favorite_border</span>
              </div>
              <h3 className="font-serif text-2xl text-[#111111] mb-2 font-semibold">Your Wishlist is Empty</h3>
              <p className="text-sm text-[#666666] max-w-sm mx-auto mb-6">Explore our curated formulations and save your signature grooming rituals.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#9B111E] text-white text-xs font-label-caps tracking-widest uppercase font-semibold hover:bg-[#800020] transition-colors">
                Discover Grooming Rituals
              </Link>
            </div>
          )}
          
          {/* Atelier Reassurance Strip */}
          <section className="border-t border-[#E5E0D8] pt-12 pb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center p-4 rounded bg-white/60 border border-[#EFECE6]">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#9B111E] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">local_shipping</span>
                </div>
                <h4 className="font-label-caps text-xs tracking-wider uppercase text-[#111111] font-bold mb-1">Free Delivery Pan-India</h4>
                <p className="text-xs text-[#666666]">Delivered to over 19,000 pin codes via express priority air.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded bg-white/60 border border-[#EFECE6]">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#9B111E] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">published_with_changes</span>
                </div>
                <h4 className="font-label-caps text-xs tracking-wider uppercase text-[#111111] font-bold mb-1">7-Day Returns</h4>
                <p className="text-xs text-[#666666]">Applicable for un-opened, sealed boxes only.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded bg-white/60 border border-[#EFECE6]">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#9B111E] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <h4 className="font-label-caps text-xs tracking-wider uppercase text-[#111111] font-bold mb-1">100% Authentic</h4>
                <p className="text-xs text-[#666666]">Pure cold-pressed botanicals formulated in our lab.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 rounded bg-white/60 border border-[#EFECE6]">
                <div className="w-12 h-12 rounded-full bg-[#FAF5EB] text-[#9B111E] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">lock</span>
                </div>
                <h4 className="font-label-caps text-xs tracking-wider uppercase text-[#111111] font-bold mb-1">Secure Payments</h4>
                <p className="text-xs text-[#666666]">Instant checkout via UPI, Cards, NetBanking, and COD.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

