'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Truck,
  CheckCircle2,
  ShoppingBag,
  ArrowLeft,
  Lock,
  Tag,
  Check,
} from 'lucide-react';

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    freeShippingThreshold,
    remainingForFreeShipping,
    freeShippingProgress,
    addItem,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { products, getProductBySlug } = useProducts();
  const { isAuthenticated, user } = useAuth();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState('');

  // Complementary recommendations logic
  const hasFaceWash = items.some((i) => i.product.slug === 'face-wash' || i.product.slug === 'terra-face-wash');
  const hasBeardOil = items.some((i) => i.product.slug === 'beard-oil' || i.product.slug === 'terra-beard-oil');
  const faceWash = getProductBySlug('face-wash') || products.find((p) => p.category === 'Face') || products[0];
  const beardOil = getProductBySlug('beard-oil') || products.find((p) => p.category === 'Beard') || products[1];
  const bundle = getProductBySlug('terra-set') || products.find((p) => p.isBundle || p.slug === 'terra-set');

  const suggestedCompanion = !hasBeardOil && beardOil ? beardOil : !hasFaceWash && faceWash ? faceWash : null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const res = await applyCoupon(promoCodeInput, user?.email);
    if (!res.success) {
      setPromoError(res.error || 'Invalid coupon.');
    } else {
      setPromoCodeInput('');
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoError('');
  };

  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 75;
  const finalTotal = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));
  const totalItemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-[#F9F8F5] text-[#181817] pt-3 sm:pt-6 lg:pt-8 pb-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========================================================================= */}
        {/* 1. TOP BREADCRUMB & EDITORIAL HEADER                                     */}
        {/* ========================================================================= */}
        <div className="pb-4 sm:pb-6 mb-6 sm:mb-8 border-b border-[#E5E0D8]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#77736C] mb-3">
            <Link href="/" className="hover:text-[#181817] transition-colors">Home</Link>
            <span className="opacity-40">/</span>
            <Link href="/shop" className="hover:text-[#181817] transition-colors">Shop</Link>
            <span className="opacity-40">/</span>
            <span className="text-[#181817] font-semibold">Shopping Bag</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D4438]/8 border border-[#2D4438]/15 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D4438]" />
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4438]">
                  YOUR SHOPPING BAG
                </span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl text-[#181817] font-light tracking-tight">
                Review Your Order
              </h1>
            </div>

            {items.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-[#77736C] bg-white border border-[#E5E0D8] px-3.5 py-1.5 rounded-full shadow-2xs">
                  {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'} SELECTED
                </span>
                <Link
                  href="/shop"
                  className="text-xs font-semibold uppercase tracking-wider text-[#77736C] hover:text-[#181817] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. EMPTY STATE VS ACTIVE CART                                            */}
        {/* ========================================================================= */}
        {items.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12 sm:py-20 px-6 bg-white border border-[#E5E0D8] rounded-3xl shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-full bg-[#F4F1EB] border border-[#E2DDD5] flex items-center justify-center mx-auto text-[#77736C]">
              <ShoppingBag size={32} strokeWidth={1.2} />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#181817] font-light">
                Your Selection is Empty
              </h2>
              <p className="text-xs sm:text-sm text-[#55524D] max-w-md mx-auto font-light leading-relaxed">
                Your cart is currently empty. Explore our clean, cold-pressed essentials formulated for skin and beard.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/shop"
                className="bg-[#181817] hover:bg-[#2D4438] text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-xs transition-all cursor-pointer"
              >
                EXPLORE CATALOG
              </Link>
              {bundle && (
                <button
                  onClick={() => addItem(bundle, 1)}
                  className="bg-[#FAF8F5] border border-[#DDD8CF] hover:border-[#181817] text-[#181817] px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={14} className="text-[#C4A482]" />
                  <span>ADD THE METHOD (₹{bundle.price})</span>
                </button>
              )}
            </div>

            {/* Quick mini-catalog cards */}
            <div className="pt-8 border-t border-[#E5E0D8] text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#77736C] block mb-4 text-center">
                POPULAR DISPENSARY ESSENTIALS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.slice(0, 2).map((p) => (
                  <div
                    key={p.slug}
                    className="p-3.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl flex items-center justify-between gap-3 hover:border-[#181817] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-lg border border-[#E5E0D8] relative overflow-hidden shrink-0">
                        <Image
                          src={p.featuredImage || '/images/home/hero-campaign.jpg'}
                          alt={p.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm text-[#181817] font-medium leading-tight">{p.name}</h4>
                        <span className="font-mono text-xs text-[#77736C]">₹{p.price}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addItem(p, 1)}
                      className="bg-[#181817] hover:bg-[#2D4438] text-white text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      + ADD
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ===================================================================== */}
            {/* LEFT: CART ITEMS & COMPANION RECOMMENDATION                           */}
            {/* ===================================================================== */}
            <div className="lg:col-span-7 space-y-6">

              {/* Free Shipping Progress Indicator */}
              <div className={`p-5 rounded-2xl border transition-all ${remainingForFreeShipping === 0
                  ? 'bg-[#2D4438]/8 border-[#2D4438]/20'
                  : 'bg-white border-[#E5E0D8] shadow-2xs'
                }`}>
                <div className="flex items-center justify-between text-xs tracking-wide mb-2.5">
                  {remainingForFreeShipping > 0 ? (
                    <div className="flex items-center gap-2 text-[#55524D]">
                      <Truck size={15} className="text-[#2D4438] shrink-0" />
                      <span>
                        Add <strong className="text-[#181817] font-mono font-bold">₹{remainingForFreeShipping}</strong> more to unlock <strong className="text-[#2D4438]">Free Express Delivery</strong>
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[#2D4438] font-semibold text-xs">
                      <Sparkles size={15} className="text-[#2D4438]" />
                      <span>Complimentary Express Delivery Unlocked</span>
                    </div>
                  )}
                  <span className="font-mono text-[11px] font-bold text-[#181817]">
                    ₹{subtotal} / ₹{freeShippingThreshold}
                  </span>
                </div>

                <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#2D4438] to-[#3B5947] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List Cards */}
              <div className="space-y-3.5">
                {items.map(({ product, quantity }) => {
                  const itemId = product._id || product.id || product.slug;
                  return (
                    <div
                      key={itemId}
                      className="bg-white border border-[#E5E0D8] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between shadow-2xs hover:border-[#181817]/40 transition-all group"
                    >
                      {/* Product Visual & Details */}
                      <div className="flex gap-4 sm:gap-5 items-center flex-1">
                        <Link
                          href={`/shop/${product.slug}`}
                          className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAF8F5] relative shrink-0 border border-[#E5E0D8] rounded-xl overflow-hidden p-1 group/img"
                        >
                          <Image
                            src={product.featuredImage || '/images/home/hero-campaign.jpg'}
                            alt={product.name}
                            fill
                            className="object-contain p-1 group-hover/img:scale-105 transition-transform duration-500"
                          />
                        </Link>

                        <div className="space-y-1">
                          <span className="inline-flex items-center text-[9px] uppercase tracking-[0.2em] text-[#2D4438] font-bold bg-[#2D4438]/8 px-2.5 py-0.5 rounded-full">
                            {product.badge || `${product.category} • ${product.purpose}`}
                          </span>
                          <Link href={`/shop/${product.slug}`}>
                            <h3 className="font-serif text-lg sm:text-xl text-[#181817] font-medium group-hover:text-[#2D4438] transition-colors">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-xs text-[#77736C] font-mono">
                            ₹{product.price} each • {product.size}
                          </p>
                        </div>
                      </div>

                      {/* Stepper, Total, Delete Actions */}
                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E5E0D8]/60">
                        {/* Tactile Quantity Stepper */}
                        <div className="flex items-center border border-[#DDD8CF] bg-[#FAF8F5] rounded-xl overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(itemId, quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#77736C] hover:text-[#181817] hover:bg-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span className="px-3 font-mono text-xs font-bold text-[#181817] min-w-[28px] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(itemId, quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-[#77736C] hover:text-[#181817] hover:bg-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Item Total */}
                        <span className="font-mono text-base font-bold text-[#181817] min-w-[80px] text-right">
                          ₹{(product.price * quantity).toLocaleString('en-IN')}
                        </span>

                        {/* Remove Action */}
                        <button
                          onClick={() => removeItem(itemId)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#99948D] hover:text-[#8B0000] hover:bg-[#8B0000]/8 transition-all cursor-pointer"
                          aria-label="Remove item"
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Routine Companion Upsell Card */}
              {suggestedCompanion && (
                <div className="bg-gradient-to-r from-white via-[#FAF8F5] to-[#F5F2EA] border border-[#E5E0D8] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl border border-[#E5E0D8] relative overflow-hidden shrink-0 p-1">
                      <Image
                        src={suggestedCompanion.featuredImage || '/images/home/hero-campaign.jpg'}
                        alt={suggestedCompanion.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2D4438] block mb-0.5">
                        RECOMMENDED ADD-ON
                      </span>
                      <h4 className="font-serif text-base sm:text-lg text-[#181817] font-medium leading-tight">
                        Pair with {suggestedCompanion.name}
                      </h4>
                      <p className="text-[11px] text-[#55524D] mt-0.5 line-clamp-1">
                        Complete your two-step daily routine.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addItem(suggestedCompanion, 1)}
                    className="bg-[#181817] hover:bg-[#2D4438] text-white text-[10px] font-bold uppercase tracking-[0.2em] px-5 py-3 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
                  >
                    + ADD FOR ₹{suggestedCompanion.price}
                  </button>
                </div>
              )}
            </div>

            {/* ===================================================================== */}
            {/* RIGHT: ORDER SUMMARY (STICKY DESKTOP)                                */}
            {/* ===================================================================== */}
            <div className="lg:col-span-5 lg:sticky lg:top-[155px] space-y-5">
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E0D8]">
                  <h3 className="font-serif text-2xl text-[#181817] font-light">
                    Order Summary
                  </h3>
                  <span className="text-[10px] font-mono text-[#77736C] uppercase tracking-wider">
                    SECURE CHECKOUT
                  </span>
                </div>

                {/* Subtotals & Line Items */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-[#55524D]">
                    <span>Bag Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-mono text-[#181817] font-semibold text-sm">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-[#2D4438] bg-[#2D4438]/8 px-3 py-2 rounded-lg border border-[#2D4438]/15">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Tag size={13} />
                        <span>Welcome Privilege ({appliedCoupon})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">-₹{discountAmount}</span>
                        <button
                          onClick={handleRemovePromo}
                          className="text-[10px] text-[#8B0000] hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[#55524D]">
                    <span>Pan-India Express Delivery</span>
                    <span className="font-mono font-semibold">
                      {shippingCost === 0 ? (
                        <span className="text-[#2D4438] font-bold">FREE</span>
                      ) : (
                        `₹${shippingCost}`
                      )}
                    </span>
                  </div>

                  {/* Estimated Final Total */}
                  <div className="pt-4 border-t border-[#E5E0D8] flex items-baseline justify-between">
                    <div>
                      <span className="font-serif text-xl font-normal text-[#181817] block leading-tight">
                        Estimated Total
                      </span>
                      <span className="text-[10px] text-[#77736C] uppercase tracking-wider block mt-0.5">
                        Inclusive of all taxes & GST
                      </span>
                    </div>
                    <span className="font-mono text-2xl sm:text-3xl font-bold text-[#181817]">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input Field */}
                {!appliedCoupon && (
                  <div className="space-y-4 pt-2">
                    <form onSubmit={handleApplyPromo}>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={promoCodeInput}
                            onChange={(e) => {
                              setPromoCodeInput(e.target.value);
                              setPromoError('');
                            }}
                            placeholder="PROMO CODE"
                            className="w-full bg-[#FAF8F5] border border-[#DDD8CF] px-3.5 py-3 text-xs text-[#181817] placeholder-[#99948D] uppercase tracking-wider rounded-xl focus:outline-none focus:border-[#181817] transition-colors"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-[#181817] hover:bg-[#2D4438] text-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] rounded-xl transition-colors cursor-pointer"
                        >
                          APPLY
                        </button>
                      </div>
                      {promoError && (
                        <p className="text-[11px] text-[#8B0000] mt-1.5 font-medium">{promoError}</p>
                      )}
                    </form>
                    
                    {/* High-End Available Offers Display */}
                    <div className="bg-[#FAF8F5] border border-[#DDD8CF] border-dashed rounded-xl p-4 transition-colors hover:border-[#2D4438]/40 group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex gap-3 items-start">
                          <div className="mt-0.5 bg-[#2D4438]/10 p-1.5 rounded-full text-[#2D4438]">
                            <Sparkles size={14} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-[#181817] uppercase tracking-wider mb-1">
                              Welcome Offer <span className="ml-1.5 text-[9px] bg-[#EAE5DC] px-1.5 py-0.5 rounded text-[#55524D] font-mono border border-[#DDD8CF]">WELCOME10</span>
                            </p>
                            <p className="text-[10px] text-[#55524D] leading-relaxed">
                              Enjoy 10% off your complimentary first order with us.
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => applyCoupon('WELCOME10')}
                          className="shrink-0 text-[10px] font-bold text-[#2D4438] uppercase tracking-wider hover:underline underline-offset-4 cursor-pointer mt-1"
                        >
                          APPLY
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Proceed to Checkout CTA */}
                <div className="space-y-3 pt-2">
                  <Link
                    href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"}
                    className="w-full bg-[#181817] hover:bg-[#2D4438] text-white py-4 text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <Lock size={14} className="opacity-80" />
                    <span>PROCEED TO CHECKOUT</span>
                    <ArrowRight size={14} />
                  </Link>

                  <p className="text-[10px] text-center text-[#77736C]">
                    Complimentary 30-Day Happiness Guarantee on all orders
                  </p>
                </div>

                {/* Security and Trust Strip */}
                <div className="pt-4 border-t border-[#E5E0D8] space-y-2.5 text-[11px] text-[#55524D]">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={16} className="text-[#2D4438] shrink-0" />
                    <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className="text-[#2D4438] shrink-0" />
                    <span>Accepts UPI, All Major Cards, NetBanking</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="text-[#2D4438] shrink-0" />
                    <span>100% Direct Fresh Botanical Guarantee</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
