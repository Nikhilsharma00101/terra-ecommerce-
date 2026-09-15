'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Star, CheckCircle } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';

export const BundleUpsell: React.FC = () => {
  const { products, getProductBySlug } = useProducts();
  const { addItem, openCart } = useCart();
  const { showToast } = useUI();
  const [activeVideo, setActiveVideo] = useState<'cleanse' | 'nourish'>('cleanse');
  const [inView, setInView] = useState(false);
  const sectionRef = React.useRef<HTMLElement>(null);
  const faceWashRef = React.useRef<HTMLVideoElement>(null);
  const beardOilRef = React.useRef<HTMLVideoElement>(null);

  // Only start playing when section enters the viewport
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (activeVideo === 'cleanse') {
      faceWashRef.current?.play().catch(() => {});
    } else {
      beardOilRef.current?.play().catch(() => {});
    }
  }, [activeVideo, inView]);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveVideo((prev) => (prev === 'cleanse' ? 'nourish' : 'cleanse'));
    }, 4500);
    return () => clearInterval(interval);
  }, [inView]);

  const faceWash =
    products.find((p) => p.slug === 'terra-face-wash' || p.slug === 'face-wash' || p.category === 'Face') || products[0];
  const beardOil =
    products.find((p) => p.slug === 'terra-beard-oil' || p.slug === 'beard-oil' || p.category === 'Beard') || (products.length > 1 ? products[1] : products[0]);

  if (!faceWash || !beardOil) return null;

  const bundlePrice = faceWash.price + beardOil.price - 399; // Explicit discount
  const originalPrice = faceWash.price + beardOil.price;

  const handleAddBundle = () => {
    addItem(faceWash, 1);
    addItem(beardOil, 1);
    showToast('The Complete Method added to cart.', 'success');
    openCart();
  };

  return (
    <section ref={sectionRef} className="bg-[#121212] py-24 select-none relative overflow-hidden border-t border-b border-[#2A2A2A]">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8B0000]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Massive Image / Bundle Visial */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-square w-full bg-[#0D0D0D] border border-[#333333] overflow-hidden shadow-2xl">
              {/* Ambient Glow Backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,20,60,0.15)_0%,rgba(13,13,13,0.95)_70%)] pointer-events-none" />

              {/* Main Full Uncropped Videos — preload=none until section is in view */}
              <video
                ref={faceWashRef}
                src="/videos/the-method/face-wash.mp4"
                loop
                muted
                playsInline
                preload="none"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700 ease-in-out ${
                  activeVideo === 'cleanse' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
              <video
                ref={beardOilRef}
                src="/videos/the-method/beard-oil.mp4"
                loop
                muted
                playsInline
                preload="none"
                className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700 ease-in-out ${
                  activeVideo === 'nourish' ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />

              {/* Quick Step Switcher Tabs at Bottom of the Video Card */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVideo('cleanse')}
                  className={`flex-1 py-2.5 px-3.5 backdrop-blur-md border text-left transition-all duration-500 cursor-pointer ${
                    activeVideo === 'cleanse'
                      ? 'bg-[#121212]/90 border-[#DC143C] text-white shadow-lg'
                      : 'bg-[#121212]/60 border-[#333333] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[10px] uppercase tracking-wider font-mono font-bold transition-colors duration-300 ${activeVideo === 'cleanse' ? 'text-[#DC143C]' : 'text-gray-400'}`}>
                      Step 01
                    </span>
                    {activeVideo === 'cleanse' && (
                      <span className="flex items-center gap-1.5 text-[9px] text-[#DC143C] font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C] animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white truncate">{faceWash.name}</p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveVideo('nourish')}
                  className={`flex-1 py-2.5 px-3.5 backdrop-blur-md border text-left transition-all duration-500 cursor-pointer ${
                    activeVideo === 'nourish'
                      ? 'bg-[#121212]/90 border-[#DC143C] text-white shadow-lg'
                      : 'bg-[#121212]/60 border-[#333333] text-gray-400 hover:text-white hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-[10px] uppercase tracking-wider font-mono font-bold transition-colors duration-300 ${activeVideo === 'nourish' ? 'text-[#DC143C]' : 'text-gray-400'}`}>
                      Step 02
                    </span>
                    {activeVideo === 'nourish' && (
                      <span className="flex items-center gap-1.5 text-[9px] text-[#DC143C] font-mono font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DC143C] animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-white truncate">{beardOil.name}</p>
                </button>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="absolute -top-3 right-2 sm:-top-5 sm:-right-4 lg:-top-6 lg:-right-12 bg-[#DC143C] text-white w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full flex flex-col items-center justify-center border-4 sm:border-[5px] lg:border-[6px] border-[#121212] shadow-2xl rotate-12 transform hover:rotate-0 transition-transform duration-500 z-20">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">SAVE</span>
              <span className="text-2xl sm:text-3xl font-serif">₹399</span>
            </div>
          </div>

          {/* Right Side: The Hard Sell */}
          <div className="w-full lg:w-1/2 space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-4 text-[#DC143C]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-current" />
                ))}
                <span className="text-gray-400 text-xs ml-2 uppercase tracking-widest">Over 10,000+ Sets Sold</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-serif text-white font-light leading-tight mb-4">
                The Complete<br />Method.
              </h2>
              <p className="text-gray-400 text-lg font-light leading-relaxed">
                Stop overcomplicating your routine. Get the ultimate daily face wash and premium beard oil in one discounted bundle. 
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="text-[#DC143C]" size={20} />
                <span>Deep cleans without drying skin</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="text-[#DC143C]" size={20} />
                <span>Softens beard and stops itchiness</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="text-[#DC143C]" size={20} />
                <span>Premium cold-pressed natural ingredients</span>
              </div>
            </div>

            <div className="pt-8 border-t border-[#333333]">
              <div className="flex items-end gap-4 mb-8">
                <span className="text-5xl text-white font-light font-serif">₹{bundlePrice}</span>
                <span className="text-xl text-gray-500 line-through mb-1">₹{originalPrice}</span>
              </div>

              <button
                onClick={handleAddBundle}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#DC143C] text-white px-12 py-5 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-[#121212] transition-colors shadow-[0_0_40px_rgba(220,20,60,0.3)]"
              >
                <ShoppingBag size={18} />
                Add Bundle To Cart
              </button>
            </div>
            
            <p className="text-xs text-gray-400 text-center sm:text-left mt-4 tracking-wide font-light">
              Free Express Shipping included with this order.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
