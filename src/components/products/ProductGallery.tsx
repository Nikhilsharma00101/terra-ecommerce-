'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ProductImage } from '@/types';
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter out invalid/empty images and fallback to safe default if needed
  const validImages = (images && images.length > 0)
    ? images.filter((img) => img && img.url && img.url.trim() !== '')
    : [];

  const displayImages = validImages.length > 0
    ? validImages.slice(0, 6)
    : [
        {
          url: '/images/home/hero-products.jpeg',
          alt: productName,
          caption: 'Terra Essential Formulation',
        },
      ];

  const handleNext = useCallback(() => {
    if (displayImages.length <= 1) return;
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const handlePrev = useCallback(() => {
    if (displayImages.length <= 1) return;
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col gap-3.5 select-none w-full">
      {/* Top Controls Bar - Rendered ABOVE the image so it doesn't hinder the view */}
      <div className="flex items-center justify-between w-full px-1">
        {/* Sequence Badge Counter */}
        {displayImages.length > 1 ? (
          <div className="bg-white text-[#181817] text-[10px] font-mono font-semibold tracking-widest px-3 py-1.5 rounded-full border border-[#E5E0D8] shadow-xs">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        ) : <div />}

        {/* Nav Controls & Zoom Hint */}
        <div className="flex items-center gap-2">
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                className="w-9 h-9 bg-white text-[#181817] transition-all duration-200 cursor-pointer border border-[#E5E0D8] hover:border-[#181817] shadow-sm hover:shadow-md rounded-full flex items-center justify-center group/btn active:scale-95"
                aria-label="Previous Image"
              >
                <ChevronLeft size={16} className="group-hover/btn:-translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                className="w-9 h-9 bg-white text-[#181817] transition-all duration-200 cursor-pointer border border-[#E5E0D8] hover:border-[#181817] shadow-sm hover:shadow-md rounded-full flex items-center justify-center group/btn active:scale-95"
                aria-label="Next Image"
              >
                <ChevronRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
          <div 
            className="w-9 h-9 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center text-[#77736C] cursor-pointer shadow-sm hover:text-[#181817] transition-colors"
            onClick={() => setIsZoomed(true)}
            aria-label="Zoom Image"
          >
            <ZoomIn size={14} />
          </div>
        </div>
      </div>

      {/* Main Presentation Stage — Controlled vertical height */}
      <div 
        className="relative w-full bg-white border border-[#E5E0D8] rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden group flex items-center justify-center cursor-pointer"
        onClick={() => setIsZoomed(true)}
      >
        {/* Ambient subtle warm gradient in image canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9F5] via-white to-[#F6F3ED]/40 pointer-events-none" />

        <div className="relative w-full p-4 sm:p-6 flex items-center justify-center">
          {displayImages.map((img, idx) => (
            <Image
              key={idx}
              src={img.url}
              alt={img.alt || productName}
              width={1200}
              height={1200}
              priority={idx === 0}
              className={`w-full h-auto max-h-[70vh] object-contain transition-all duration-300 group-hover:scale-105 ${
                idx === selectedIndex ? 'opacity-100 z-10 relative block' : 'opacity-0 z-0 absolute inset-0 m-auto pointer-events-none'
              }`}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ))}
        </div>

        {/* Caption Pill */}
        {currentImage.caption && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto bg-white/90 backdrop-blur-md text-[#55524D] text-[10px] uppercase tracking-[0.16em] px-3.5 py-1.5 font-mono z-10 border border-[#E5E0D8] rounded-full shadow-xs truncate max-w-[90%] pointer-events-none">
            {currentImage.caption}
          </div>
        )}
      </div>

      {/* Thumbnail Bar — Compact horizontal strip below */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-16 h-16 sm:w-18 sm:h-18 bg-white border rounded-xl transition-all duration-300 cursor-pointer overflow-hidden group shrink-0 p-1 ${
                selectedIndex === idx
                  ? 'border-[#181817] ring-2 ring-[#181817]/15 shadow-sm scale-[1.02]'
                  : 'border-[#E5E0D8] opacity-70 hover:opacity-100 hover:border-[#8C877D]'
              }`}
              aria-label={`View image ${idx + 1} of ${displayImages.length}`}
            >
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#FBF9F5]">
                <Image
                  src={img.url}
                  alt={img.alt || `${productName} view ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Full Screen Zoom Modal via Portal */}
      {isZoomed && isMounted && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#181817]/95 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200 touch-none"
          onClick={() => setIsZoomed(false)}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX.current - touchEndX;
            
            if (Math.abs(diffX) > 40) { // Threshold for swipe
              if (diffX > 0) handleNext(); // Swiped left -> next
              else handlePrev(); // Swiped right -> prev
            }
            touchStartX.current = null;
          }}
        >
          <button
            type="button"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-50 bg-white/10 hover:bg-white/20 rounded-full"
            onClick={() => setIsZoomed(false)}
          >
            <X size={24} />
          </button>
          
          <div className="relative w-full max-w-5xl h-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {displayImages.map((img, idx) => (
              <Image
                key={idx}
                src={img.url}
                alt={img.alt || productName}
                fill
                className={`object-contain transition-opacity duration-300 ${
                  idx === selectedIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
                sizes="100vw"
              />
            ))}
          </div>
          
          {displayImages.length > 1 && (
             <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                  className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200 cursor-pointer rounded-full hidden sm:flex items-center justify-center group/btn active:scale-95 z-50"
                >
                  <ChevronLeft size={24} className="group-hover/btn:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNext(); }}
                  className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200 cursor-pointer rounded-full hidden sm:flex items-center justify-center group/btn active:scale-95 z-50"
                >
                  <ChevronRight size={24} className="group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
             </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
