'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Star, Heart, Plus, ArrowRight, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  priority = false,
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedToast, setAddedToast] = useState(false);

  const productId = product._id || product.id || product.slug;
  const isWished =
    isInWishlist(productId) ||
    (product.id && isInWishlist(product.id)) ||
    (product._id && isInWishlist(product._id)) ||
    (product.slug && isInWishlist(product.slug));

  const productUrl = `/shop/${product.slug}`;

  const mainImage =
    product.featuredImage ||
    (product.images && product.images.length > 0 ? product.images[0].url : '') ||
    '/images/home/hero-campaign.jpg';

  const secondaryHoverImage =
    product.images && product.images.length > 1 && product.images[1]?.url
      ? product.images[1].url
      : undefined;

  const discountAmount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? product.compareAtPrice - product.price
      : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 1800);
  };

  return (
    <div
      className="group relative flex flex-col bg-white text-[#181817] border border-[#E8E4DC] hover:border-[#181817] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 select-none"
    >
      {/* Top Image Container — Revamped with balanced aspect ratio and edge-to-edge luxury presentation */}
      <div className="relative aspect-4/3 sm:aspect-square w-full bg-[#1A1918] overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.badge ? (
            <span className="text-[9px] uppercase tracking-[0.2em] font-mono px-2.5 py-1 font-bold rounded-full bg-white/95 text-[#181817] shadow-sm backdrop-blur-xs border border-[#E5E0D8]">
              {product.badge}
            </span>
          ) : product.category ? (
            <span className="text-[9px] uppercase tracking-[0.2em] font-mono px-2.5 py-1 font-bold rounded-full bg-white/95 text-[#181817] shadow-sm backdrop-blur-xs border border-[#E5E0D8]">
              {product.category}
            </span>
          ) : null}

          {discountAmount > 0 && (
            <span className="text-[9px] uppercase tracking-[0.15em] font-mono px-2.5 py-0.5 font-bold rounded-full bg-[#8B0000] text-white shadow-sm">
              SAVE ₹{discountAmount}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(productId);
          }}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#181817] hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-sm border border-[#E5E0D8]"
          aria-label="Save to wishlist"
          title={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={14}
            className={`transition-all ${
              isWished ? 'fill-[#8B0000] text-[#8B0000]' : 'text-[#181817] hover:text-[#8B0000]'
            }`}
          />
        </button>

        {/* Product Image — Dual-layer crossfade for flicker-free hover */}
        <Link href={productUrl} className="block w-full h-full relative">
          {/* Primary image — always visible, fades out on hover if secondary exists */}
          <Image
            src={mainImage}
            alt={product.name}
            fill
            priority={priority}
            className={`object-cover transition-opacity duration-700 ease-out ${
              secondaryHoverImage ? 'group-hover:opacity-0' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {/* Secondary hover image — pre-loaded, fades in on hover */}
          {secondaryHoverImage && (
            <Image
              src={secondaryHoverImage}
              alt={`${product.name} — alternate view`}
              fill
              className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </Link>

        {/* Quick Add Bottom Bar on Hover */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
              addedToast
                ? 'bg-[#2D4438] text-white'
                : 'bg-white hover:bg-[#8B0000] text-[#181817] hover:text-white active:scale-[0.98]'
            }`}
          >
            {addedToast ? (
              <>
                <Check size={13} strokeWidth={2.5} />
                <span>ADDED TO BAG</span>
              </>
            ) : (
              <>
                <Plus size={13} strokeWidth={2.5} />
                <span>QUICK ADD TO BAG</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Section — Balanced, compact, elegant spacing */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
        <div className="space-y-2">
          {/* Rating & Category Row */}
          <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-widest text-[#77736C]">
            <span className="font-semibold">
              {product.category} {product.purpose ? `• ${product.purpose}` : ''}
            </span>
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-[#C4A482] text-[#C4A482]" />
              <span className="font-mono text-xs font-semibold text-[#181817]">
                {product.rating || 5.0}
              </span>
              {product.reviewCount ? (
                <span className="text-[#99948D]">({product.reviewCount})</span>
              ) : null}
            </div>
          </div>

          {/* Product Name */}
          <Link href={productUrl} className="block group-hover:text-[#8B0000] transition-colors">
            <h3 className="font-serif text-lg sm:text-xl font-medium leading-snug text-[#181817]">
              {product.name}
            </h3>
          </Link>

          {/* Tagline */}
          {product.tagline && (
            <p className="text-[10px] uppercase font-mono tracking-wider font-semibold text-[#8B0000] line-clamp-1">
              {product.tagline}
            </p>
          )}

          {/* Description */}
          {product.shortDescription && (
            <p className="text-xs line-clamp-2 text-[#66625C] font-light leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          {/* Key Ingredients */}
          {product.keyIngredients && product.keyIngredients.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {product.keyIngredients.slice(0, 2).map((ing) => (
                <span
                  key={ing.name}
                  className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#2D4438] border border-[#DDD8CF]"
                >
                  {ing.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer Price & Action Row */}
        <div className="pt-3 border-t border-[#EAE6DF] flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-[#181817]">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="font-mono text-xs text-[#99948D] line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.size && (
              <span className="text-[10px] font-mono text-[#77736C]">
                {product.size}
              </span>
            )}
          </div>

          <Link
            href={productUrl}
            className="text-[10px] uppercase font-mono tracking-widest font-semibold text-[#181817] group-hover:text-[#8B0000] flex items-center gap-1.5 transition-colors py-1 px-2.5 rounded-lg hover:bg-[#FAF8F5]"
          >
            <span>VIEW</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
