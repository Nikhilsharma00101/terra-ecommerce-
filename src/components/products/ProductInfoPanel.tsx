'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Accordion } from '@/components/ui/Accordion';
import { Star, Plus, Minus, Heart, Truck, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ProductInfoPanelProps {
  product: Product;
}

export const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const productId = product._id || product.id || product.slug;
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const isWished =
    isInWishlist(productId) ||
    (product.id && isInWishlist(product.id)) ||
    (product._id && isInWishlist(product._id)) ||
    (product.slug && isInWishlist(product.slug));

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push('/checkout');
  };

  const discountAmount = product.compareAtPrice && product.compareAtPrice > product.price
    ? product.compareAtPrice - product.price
    : 0;

  const accordionItems = [
    {
      id: 'desc',
      title: 'FORMULATION & PHILOSOPHY',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-[#55524D]">
          <p>{product.fullDescription}</p>
          <div className="bg-[#F5F2EA] p-3.5 border-l-2 border-[#2D4438] text-[11px] italic text-[#44413D] rounded-r-md">
            Part of The Terra Method. Formulated without sulfates, parabens, synthetic dyes, or unnecessary fillers.
          </div>
        </div>
      ),
    },
    {
      id: 'how-to-use',
      title: 'APPLICATION RITUAL',
      content: (
        <div className="space-y-4 text-xs">
          {product.ritual.map((step) => (
            <div key={step.number} className="border-b border-[#E5E0D8] pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between text-[#181817] font-bold mb-1">
                <span>{step.number}. {step.title}</span>
                <span className="text-[10px] text-[#2D4438] bg-[#2D4438]/10 px-2 py-0.5 rounded font-mono font-medium">{step.timing}</span>
              </div>
              <p className="text-[#55524D] mt-1">{step.action}</p>
              <p className="text-[#8B0000] font-medium text-[11px] mt-1.5 flex items-center gap-1.5">
                <span className="font-bold">PRO TIP:</span> {step.tip}
              </p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'ingredients',
      title: 'FULL INGREDIENTS (INCI)',
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-[#55524D]">
          <div className="font-mono text-[11px] bg-white p-3.5 border border-[#E5E0D8] text-[#55524D] rounded-lg shadow-2xs leading-relaxed">
            {product.slug === 'face-wash' || product.name.toLowerCase().includes('face wash') 
              ? [
                  'Purified Water',
                  'Sodium Lauroyl Sarcosinate',
                  'Glycerin',
                  'Decyl Glucoside',
                  'Cocamidopropyl Betaine',
                  'Niacinamide',
                  'Triethanolamine',
                  'Acrylates / C10-30 Alkylacrylate Crosspolymer',
                  'Phenoxyethanol (and) Ethylhexylglycerin',
                  'Sodium Hyaluronate',
                  'Salicylic Acid',
                  'Sodium Bicarbonate',
                  'Zinc Pyrrolidone Carboxylic Acid',
                  'Camellia Sinensis Leaf Extract',
                  'Aloe Barbadensis Leaf Extract',
                  'Melaleuca Alternifolia Leaf Extract',
                  'Sodium Pyrrolidone Carboxylic Acid',
                  'Fragrance',
                  'Disodium Ethylenediaminetetraacetate'
                ].join(', ')
              : product.slug === 'beard-oil' || product.name.toLowerCase().includes('beard oil')
              ? [
                  'Caprylic / Capric Triglyceride',
                  'Fragrance',
                  'Prunus Amygdalus (Almond) Dulcis Oil',
                  'Simmondsia Chinensis (Jojoba) Seed Oil',
                  'Argania Spinosa (Argan) Kernel Oil',
                  'Ricinus Communis (Castor) Seed Oil',
                  'Tocpherol',
                  'Nigella Sativa Seed Oil',
                  'Lavandula (Lavender), Angustifolia Oil'
                ].join(', ')
              : product.ingredientsList?.join(', ')}
          </div>
          <p className="text-[11px] text-[#8C877D] italic">
            *100% transparent ingredient disclosure. No hidden fragrances or proprietary dilutions.
          </p>
          <p className="text-[10px] text-[#8C877D] leading-relaxed mt-2 border-t border-[#E5E0D8] pt-2">
            <strong>Disclaimer:</strong> Our products are formulated for external use only and are not intended to diagnose, treat, cure, or prevent any disease. Because everyone's skin is different, we highly recommend reviewing the ingredient list for any personal allergens and performing a patch test on a small area of skin 24 hours before full application. If irritation occurs, discontinue use immediately and consult a physician.
          </p>
        </div>
      ),
    },
    {
      id: 'specs',
      title: 'SPECIFICATIONS & DESIGN',
      content: (
        <div className="divide-y divide-[#E5E0D8] text-xs">
          {product.specs.map((spec, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <span className="text-[#77736C] font-mono text-[11px] uppercase tracking-wider">{spec.label}</span>
              <span className="text-[#181817] font-medium text-right max-w-[60%]">{spec.value}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'shipping',
      title: 'SHIPPING & GUARANTEE',
      content: (
        <div className="space-y-2 text-xs text-[#55524D] leading-relaxed">
          <p>{product.shippingInfo}</p>
          <p>We believe in the quality of Terra fundamentals. If this product does not transform your daily routine within 30 days, receive a full refund with zero friction.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col space-y-5 select-none">
      {/* Category & Rating Row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.25em] font-bold text-[#2D4438] bg-[#2D4438]/8 border border-[#2D4438]/20 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D4438]" />
          {product.badge || `${product.category} • ${product.purpose}`}
        </span>

        <div className="flex items-center gap-2 text-xs text-[#181817]">
          <div className="flex text-[#C4A482]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={13} className="fill-[#C4A482] text-[#C4A482]" />
            ))}
          </div>
          <span className="font-mono font-bold text-[12px]">{product.rating}</span>
          <span className="text-[#77736C] text-[11px]">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Title & Tagline */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181817] font-light leading-[1.12] tracking-tight">
          {product.name}
        </h1>
        <p className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#77736C] pt-1">
          {product.tagline} • {product.size}
        </p>
      </div>

      {/* Price Block */}
      <div className="flex items-baseline flex-wrap gap-3 py-3.5 border-y border-[#E5E0D8]">
        <span className="font-mono text-2xl sm:text-3xl font-bold text-[#181817]">
          ₹{product.price}
        </span>
        {product.compareAtPrice && (
          <span className="font-mono text-sm text-[#8C877D] line-through">
            ₹{product.compareAtPrice}
          </span>
        )}
        {discountAmount > 0 && (
          <span className="bg-[#8B0000]/10 text-[#8B0000] border border-[#8B0000]/20 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Save ₹{discountAmount}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-[0.1em] text-[#77736C] ml-auto">
          Taxes Included • Free Express Shipping
        </span>
      </div>

      {/* Short Summary */}
      <p className="text-xs sm:text-sm text-[#55524D] leading-relaxed font-light">
        {product.shortDescription}
      </p>

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center border border-[#DDD8CF] bg-white h-12 px-2 shrink-0 rounded-xl shadow-2xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-[#77736C] hover:text-[#181817] transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="px-3 font-mono text-sm font-bold text-[#181817]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 text-[#77736C] hover:text-[#181817] transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to Bag CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#181817] hover:bg-[#2D4438] text-white h-12 px-6 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-xl shadow-sm hover:shadow-md cursor-pointer active:scale-[0.99]"
          >
            {addedToast ? (
              <span className="flex items-center gap-1.5 text-[#C4A482]">
                <CheckCircle2 size={15} /> ADDED TO BAG
              </span>
            ) : (
              <>
                <span>ADD TO BAG</span>
                <span className="font-mono opacity-70 font-normal tracking-normal">• ₹{product.price * quantity}</span>
              </>
            )}
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => toggleWishlist(productId)}
            className="border border-[#DDD8CF] bg-white h-12 w-12 flex items-center justify-center text-[#181817] hover:border-[#181817] transition-colors shrink-0 rounded-xl shadow-2xs cursor-pointer active:scale-95"
            aria-label="Save to wishlist"
          >
            <Heart
              size={18}
              className={isWished ? 'fill-[#8B0000] text-[#8B0000]' : 'text-[#181817]'}
            />
          </button>
        </div>

        {/* Buy Now Direct */}
        <button
          onClick={handleBuyNow}
          className="w-full relative overflow-hidden group bg-[#8B0000] hover:bg-[#A50000] text-white py-3.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl shadow-sm hover:shadow-md active:scale-[0.99]"
        >
          <span className="relative z-10">BUY NOW — INSTANT CHECKOUT</span>
          <div className="absolute inset-0 bg-white/15 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out pointer-events-none" />
        </button>
      </div>

      {/* Trust reassurance cards */}
      <div className="grid grid-cols-3 gap-2.5 py-4 border-t border-b border-[#E5E0D8]">
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center text-center p-2 rounded-lg bg-white border border-[#E5E0D8]/60 shadow-2xs">
          <Truck size={15} className="text-[#2D4438] shrink-0" />
          <span className="text-[10px] text-[#55524D] font-medium tracking-wider uppercase">Fast Delivery</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center text-center p-2 rounded-lg bg-white border border-[#E5E0D8]/60 shadow-2xs">
          <ShieldCheck size={15} className="text-[#2D4438] shrink-0" />
          <span className="text-[10px] text-[#55524D] font-medium tracking-wider uppercase">Clean Botanical</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center text-center p-2 rounded-lg bg-white border border-[#E5E0D8]/60 shadow-2xs">
          <RefreshCw size={15} className="text-[#2D4438] shrink-0" />
          <span className="text-[10px] text-[#55524D] font-medium tracking-wider uppercase">30-Day Guarantee</span>
        </div>
      </div>

      {/* Accordion disclosures */}
      <div className="pt-1">
        <Accordion items={accordionItems} defaultOpenId="desc" theme="light" />
      </div>
    </div>
  );
};
