'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter out invalid/empty images and fallback to safe default if needed
  const validImages = (images && images.length > 0)
    ? images.filter((img) => img && img.url && img.url.trim() !== '')
    : [];

  const displayImages = validImages.length > 0
    ? validImages.slice(0, 6)
    : [
        {
          url: '/images/home/hero-campaign.jpg',
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
      {/* Main Presentation Stage — Controlled vertical height */}
      <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] bg-white border border-[#E5E0D8] rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden group flex items-center justify-center">
        {/* Ambient subtle warm gradient in image canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FBF9F5] via-white to-[#F6F3ED]/40 pointer-events-none" />

        <div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center">
          <Image
            src={currentImage.url}
            alt={currentImage.alt || productName}
            fill
            priority
            className="object-contain sm:object-cover p-2 transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Sequence Badge Counter — Minimal Luxury Light Pill */}
        {displayImages.length > 1 && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#181817] text-[10px] font-mono font-semibold tracking-widest px-3 py-1 rounded-full border border-[#E5E0D8] shadow-xs z-10">
            {selectedIndex + 1} / {displayImages.length}
          </div>
        )}

        {/* Zoom Hint Icon */}
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md border border-[#E5E0D8] flex items-center justify-center text-[#77736C] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-xs pointer-events-none">
          <ZoomIn size={14} />
        </div>

        {/* Next / Previous Circular Controls */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#181817] backdrop-blur-md transition-all duration-200 cursor-pointer border border-[#E5E0D8] hover:border-[#181817] shadow-sm hover:shadow-md z-10 rounded-full flex items-center justify-center group/btn active:scale-95"
              aria-label="Previous Image"
            >
              <ChevronLeft size={18} className="group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#181817] backdrop-blur-md transition-all duration-200 cursor-pointer border border-[#E5E0D8] hover:border-[#181817] shadow-sm hover:shadow-md z-10 rounded-full flex items-center justify-center group/btn active:scale-95"
              aria-label="Next Image"
            >
              <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Caption Pill */}
        {currentImage.caption && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-4 sm:right-auto bg-white/90 backdrop-blur-md text-[#55524D] text-[10px] uppercase tracking-[0.16em] px-3.5 py-1.5 font-mono z-10 border border-[#E5E0D8] rounded-full shadow-xs truncate max-w-[90%]">
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
    </div>
  );
};
