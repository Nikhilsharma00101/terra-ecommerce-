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
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

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
    setIsApplyingPromo(true);
    try {
      const res = await applyCoupon(promoCodeInput, user?.email);
      if (!res.success) {
        setPromoError(res.error || 'Invalid coupon.');
      } else {
        setPromoCodeInput('');
      }
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    removeCoupon();
    setPromoError('');
  };

  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 75;
  const finalTotal = Math.max(0, subtotal - discountAmount + (subtotal > 0 ? shippingCost : 0));
  const totalItemCount = items.reduce((acc, curr) => acc + curr.quantity, 0);

  const grossTotal = items.reduce((acc, curr) => acc + ((curr.product.compareAtPrice || curr.product.price) * curr.quantity), 0);
  const directDiscount = grossTotal - subtotal;

  return (
    <div className="bg-[#F2F4F7] font-sans text-[#0F141C] antialiased min-h-screen flex flex-col">
      {/* Progress Header & Breadcrumb Context */}
      <section className="w-full bg-white border-b border-[#D8DEE6] px-4 md:px-8 lg:px-12 pt-4 pb-8">
        <div className="w-full flex flex-col gap-4">
          {/* Breadcrumb row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#5A6474] font-semibold">
              <Link className="hover:text-[#0F141C] transition-colors" href="/">Home</Link>
              <span>/</span>
              <span className="text-[#A81323] font-semibold">Your Cart ({totalItemCount} Items)</span>
            </nav>
            {/* Stepper */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#A81323] text-[10px] text-white font-bold">1</span>
                <span className="text-[10px] sm:text-[11px] text-[#A81323] uppercase font-bold tracking-wider sm:tracking-widest">Cart</span>
              </div>
              <span className="w-3 sm:w-6 h-[1px] bg-[#D8DEE6]"></span>
              <div className="flex items-center gap-1.5 sm:gap-2 opacity-60">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E9EDF3] text-[10px] text-[#5A6474]">2</span>
                <span className="text-[10px] sm:text-[11px] text-[#5A6474] uppercase tracking-wider font-semibold">Shipping</span>
              </div>
              <span className="w-3 sm:w-6 h-[1px] bg-[#D8DEE6]"></span>
              <div className="flex items-center gap-1.5 sm:gap-2 opacity-60">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E9EDF3] text-[10px] text-[#5A6474]">3</span>
                <span className="text-[10px] sm:text-[11px] text-[#5A6474] uppercase tracking-wider font-semibold">Payment</span>
              </div>
            </div>
          </div>
          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 pt-2">
            <div>
              <h1 className="font-serif text-[40px] leading-[48px] text-[#0F141C] uppercase tracking-tight font-semibold">Your Cart</h1>
            </div>
            <p className="font-serif text-[20px] italic text-[#5A6474] font-normal">Review your items before checkout.</p>
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 px-4">
          <div className="w-full max-w-2xl text-center bg-white border border-[#E5E0D8] p-12 shadow-sm">
            <div className="w-20 h-20 bg-[#FAF8F5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#9B111E] border border-[#EFECE6]">
              <ShoppingBag size={32} strokeWidth={1} />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#111111] font-semibold mb-3 tracking-tight">Your Cart is Empty</h2>
            <p className="text-sm text-[#666666] max-w-md mx-auto mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Explore our products and find something you like!
            </p>
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#9B111E] hover:bg-[#800020] text-white text-xs font-label-caps tracking-widest uppercase font-semibold transition-all shadow-sm">
              <ShoppingBag size={16} />
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Free Shipping Notification Banner */}
          <section className="w-full bg-[#F2F4F7] px-4 md:px-8 lg:px-12 pt-8">
            <div className="w-full">
              <div className="bg-white border border-[#D8DEE6] p-4 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex h-10 w-10 items-center justify-center bg-[#A81323]/10 text-[#A81323] shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-widest text-[#A81323] font-bold">
                        {remainingForFreeShipping > 0 ? 'Free Shipping Available' : 'Free Shipping Unlocked'}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#5A6474]">
                      {remainingForFreeShipping > 0 ? (
                        <>Add <strong className="text-[#0F141C] font-semibold">₹{remainingForFreeShipping}</strong> more to qualify for FREE shipping.</>
                      ) : (
                        <>Congratulations! You qualify for <strong className="text-[#0F141C] font-semibold">FREE Shipping</strong>.</>
                      )}
                    </p>
                  </div>
                </div>
                {/* Progress Bar Indicator */}
                <div className="w-full md:w-64 flex flex-col gap-1.5 shrink-0">
                  <div className="flex justify-between text-[10px] uppercase text-[#5A6474] font-semibold">
                    <span>Progress: {Math.min(100, Math.round(freeShippingProgress))}% Reached</span>
                    {remainingForFreeShipping === 0 && <span className="text-[#A81323] font-semibold">Unlocked</span>}
                  </div>
                  <div className="w-full h-1.5 bg-[#E9EDF3] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#A81323] to-[#C0172B] transition-all duration-700" style={{ width: `${freeShippingProgress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Main 2-Column Cart Structure */}
          <section className="w-full bg-[#F2F4F7] px-4 md:px-8 lg:px-12 py-8">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* LEFT COLUMN: Cart Items & Modifiers (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-8">

                {/* Items Table Container */}
                <div className="bg-white border border-[#D8DEE6] p-6 flex flex-col gap-6 shadow-sm">
                  {/* Column Headers */}
                  <div className="hidden sm:grid grid-cols-12 pb-3 text-[11px] uppercase tracking-wider text-[#5A6474] font-semibold border-b border-[#D8DEE6]">
                    <div className="col-span-7">Product</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-3 text-right">Subtotal</div>
                  </div>

                  {items.map(({ product, quantity }) => {
                    const itemId = product._id || product.id || product.slug;
                    return (
                      <div key={itemId} className="bg-[#F0F3F7] border border-[#D8DEE6] p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:gap-6 items-start sm:items-center">
                        {/* Product Specs */}
                        <div className="sm:col-span-7 flex gap-4 sm:gap-6 w-full">
                          <Link href={`/shop/${product.slug}`} className="relative w-20 h-20 sm:w-28 sm:h-28 bg-[#E9EDF3] shrink-0 overflow-hidden border border-[#D8DEE6]">
                            <Image alt={product.name} className="w-full h-full object-cover object-center" src={product.featuredImage || '/images/home/hero-products.jpeg'} fill />
                            {product.badge && <span className="absolute top-1 left-1 bg-[#111620]/90 text-white text-[8px] uppercase px-1.5 py-0.5 tracking-wider font-semibold">{product.badge}</span>}
                          </Link>
                          <div className="flex flex-col justify-between flex-1 min-w-0">
                            <div>
                              <span className="text-[10px] text-[#5A6474] uppercase tracking-widest font-semibold">{product.category}</span>
                              <Link href={`/shop/${product.slug}`}><h3 className="font-serif text-[16px] text-[#0F141C] font-semibold truncate hover:text-[#A81323] transition-colors">{product.name}</h3></Link>
                              <p className="text-[12px] text-[#5A6474] line-clamp-1">{product.size}</p>
                              {product.scentProfile && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <Sparkles size={14} className="text-[#A81323]" />
                                  <span className="text-[11px] text-[#5A6474] font-medium">{product.scentProfile}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="flex h-1.5 w-1.5 rounded-full bg-[#A81323]"></span>
                              <span className="text-[10px] uppercase text-[#5A6474] font-medium">In Stock</span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions Row: Quantity + Price/Remove */}
                        <div className="w-full flex items-center justify-between sm:hidden mt-2">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-white border border-[#D8DEE6] px-1 py-1">
                            <button onClick={() => updateQuantity(itemId, quantity - 1)} className="h-7 w-7 flex items-center justify-center text-[#5A6474] hover:text-[#0F141C] bg-[#F0F3F7] hover:bg-[#E9EDF3] transition-colors" type="button">
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center font-mono text-[13px] text-[#0F141C] font-bold">{quantity}</span>
                            <button onClick={() => updateQuantity(itemId, quantity + 1)} className="h-7 w-7 flex items-center justify-center text-[#5A6474] hover:text-[#0F141C] bg-[#F0F3F7] hover:bg-[#E9EDF3] transition-colors" type="button">
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="font-mono text-[18px] text-[#0F141C] font-bold">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                              </div>
                              <button onClick={() => removeItem(itemId)} className="text-[#5A6474] hover:text-[#A81323] p-1 transition-colors" title="Remove item" type="button">
                                <Trash2 size={18} />
                              </button>
                            </div>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-[#5A6474] line-through">₹{(product.compareAtPrice * quantity).toLocaleString('en-IN')}</span>
                                <span className="text-[9px] text-[#A81323] uppercase font-semibold">{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% Off</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Desktop Quantity Selector */}
                        <div className="hidden sm:col-span-2 sm:flex justify-center items-center gap-1 w-auto">
                          <div className="flex items-center bg-white border border-[#D8DEE6] px-1 py-1">
                            <button onClick={() => updateQuantity(itemId, quantity - 1)} className="h-8 w-8 flex items-center justify-center text-[#5A6474] hover:text-[#0F141C] bg-[#F0F3F7] hover:bg-[#E9EDF3] transition-colors" type="button">
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-mono text-[14px] text-[#0F141C] font-bold">{quantity}</span>
                            <button onClick={() => updateQuantity(itemId, quantity + 1)} className="h-8 w-8 flex items-center justify-center text-[#5A6474] hover:text-[#0F141C] bg-[#F0F3F7] hover:bg-[#E9EDF3] transition-colors" type="button">
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Desktop Price & Actions */}
                        <div className="hidden sm:col-span-3 sm:flex flex-col justify-between items-end w-auto">
                          <div className="text-right">
                            <span className="font-mono text-[22px] text-[#0F141C] font-bold">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <div className="flex items-center justify-end gap-1.5 text-right mt-1">
                                <span className="text-[11px] text-[#5A6474] line-through">₹{(product.compareAtPrice * quantity).toLocaleString('en-IN')}</span>
                                <span className="text-[9px] text-[#A81323] uppercase font-semibold">{Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% Off</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <button onClick={() => removeItem(itemId)} className="text-[#5A6474] hover:text-[#A81323] text-[12px] flex items-center gap-1 transition-colors" title="Remove item" type="button">
                              <Trash2 size={16} />
                              <span className="text-[10px] uppercase font-semibold hidden md:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Estimator */}
                <div className="bg-white border border-[#D8DEE6] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 shadow-sm">
                  {/* Domestic Pincode Transit Checker */}
                  <div className="bg-[#F0F3F7] border border-[#D8DEE6] p-4 sm:p-6 flex flex-col gap-3 sm:gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#0F141C] uppercase tracking-wider font-semibold flex items-center gap-1.5">
                        <Truck size={18} className="text-[#A81323]" />
                        Estimate Shipping Time
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input className="flex-1 bg-white border border-[#D8DEE6] px-4 py-2.5 font-mono text-[14px] text-[#0F141C] placeholder:text-[#5A6474] focus:outline-none focus:border-[#A81323] transition-colors" placeholder="Enter 6-Digit Indian Pincode" type="text" />
                      <button className="w-full sm:w-auto bg-[#111620] hover:bg-[#1E2530] text-white text-[11px] uppercase px-5 py-3 sm:py-2.5 tracking-widest font-semibold transition-colors" type="button">
                        Verify
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Order Summary Dock (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-28">
                {/* Master Card */}
                <div className="bg-white border border-[#D8DEE6] p-6 sm:p-8 rounded-xl shadow-sm flex flex-col gap-6">
                  
                  <div className="flex items-baseline justify-between pt-1">
                    <h2 className="text-2xl text-[#0F141C] font-semibold tracking-tight">Order Summary</h2>
                  </div>

                  {/* Line items */}
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#5A6474]">Subtotal</span>
                      <span className="font-semibold text-[#0F141C]">₹{grossTotal.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {directDiscount > 0 && (
                      <div className="flex justify-between items-center text-[15px]">
                        <span className="text-[#5A6474]">Discount</span>
                        <span className="font-semibold text-[#059669]">-₹{directDiscount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    
                    {appliedCoupon && (
                      <div className="flex justify-between items-center text-[15px]">
                        <span className="text-[#5A6474]">Coupon ({appliedCoupon})</span>
                        <div className="flex items-center">
                          <span className="font-semibold text-[#059669]">-₹{discountAmount}</span>
                          <button onClick={handleRemovePromo} className="text-[12px] text-red-500 ml-3 hover:underline">Remove</button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#5A6474]">Estimated Delivery</span>
                      {shippingCost === 0 ? (
                        <span className="text-[14px] text-[#059669] font-semibold">Free</span>
                      ) : (
                        <span className="font-semibold text-[#0F141C]">₹{shippingCost}</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center text-[15px]">
                      <span className="text-[#5A6474]">Taxes</span>
                      <span className="text-[#5A6474]">Calculated at checkout</span>
                    </div>
                  </div>

                  <hr className="border-[#D8DEE6]" />

                  {/* Coupon Code Input Box */}
                  {!appliedCoupon && (
                    <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-3 sm:gap-2">
                      <input value={promoCodeInput} onChange={(e) => { setPromoCodeInput(e.target.value); setPromoError(''); }} className="flex-1 w-full bg-white border border-[#D8DEE6] rounded-lg px-4 py-3 text-[14px] text-[#0F141C] placeholder:text-[#5A6474] focus:outline-none focus:ring-1 focus:ring-[#0F141C] transition-colors" placeholder="Enter coupon code" type="text" />
                      <button disabled={isApplyingPromo} className="w-full sm:w-auto bg-[#F0F3F7] hover:bg-[#E9EDF3] text-[#0F141C] rounded-lg px-6 py-3 text-[14px] font-semibold transition-colors border border-[#D8DEE6]" type="submit">
                        {isApplyingPromo ? '...' : 'Apply'}
                      </button>
                    </form>
                  )}
                  {promoError && <p className="text-[13px] text-red-500 font-medium -mt-4">{promoError}</p>}

                  {/* Total Calculation */}
                  <div className="flex flex-col gap-2 pt-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[18px] text-[#0F141C] font-semibold">Total</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[12px] text-[#5A6474] mr-1">INR</span>
                        <span className="text-[32px] leading-none text-[#0F141C] font-bold tracking-tight">₹{finalTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    {(discountAmount + directDiscount) > 0 && (
                      <div className="flex justify-end mt-1">
                        <span className="text-[14px] text-[#059669] font-medium bg-[#059669]/10 px-2.5 py-1 rounded-full">You saved ₹{(discountAmount + directDiscount).toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Primary Checkout CTA */}
                  <Link href={isAuthenticated ? "/checkout" : "/login?redirect=/checkout"} className="w-full bg-[#111620] hover:bg-[#1E2530] text-white rounded-xl py-4 px-6 flex items-center justify-center gap-2 transition-all duration-300 shadow-sm mt-2">
                    <span className="text-[16px] font-medium text-white">Continue to Checkout</span>
                  </Link>

                  {/* Guarantee & Verification Strip */}
                  <div className="pt-2 flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-[#5A6474]">
                      <Lock size={16} className="text-[#5A6474]" />
                      <span className="text-[13px] text-[#5A6474]">Secure checkout process</span>
                    </div>
                    <div className="flex items-center gap-3 text-[#5A6474]">
                      <Truck size={16} className="text-[#5A6474]" />
                      <span className="text-[13px] text-[#5A6474]">
                        {freeShippingThreshold > 0 
                          ? `Complimentary shipping on orders above ₹${freeShippingThreshold}` 
                          : 'Complimentary standard shipping on all orders'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Complete Your Regimen (Upsell Cross-Sell) */}
          {suggestedCompanion && (
            <section className="w-full bg-white border-t border-[#D8DEE6] px-4 md:px-8 lg:px-12 py-12">
              <div className="w-full flex flex-col gap-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="font-serif text-[32px] sm:text-[40px] leading-tight text-[#0F141C] uppercase tracking-tight font-semibold">Frequently Bought Together</h2>
                  </div>
                  <Link href="/shop" className="text-[11px] text-[#A81323] hover:text-[#0F141C] transition-colors uppercase tracking-widest flex items-center gap-1 font-semibold">
                    Shop All <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                  <div className="bg-white border border-[#D8DEE6] p-6 flex flex-col justify-between group hover:border-[#A81323] transition-all duration-300 shadow-sm">
                    <div className="flex flex-col gap-6">
                      <div className="relative w-full h-48 bg-[#E9EDF3] overflow-hidden border border-[#D8DEE6]">
                        <Image alt={suggestedCompanion.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" src={suggestedCompanion.featuredImage || '/images/home/hero-products.jpeg'} fill />
                        <span className="absolute top-2 left-2 bg-[#111620]/90 text-white text-[9px] uppercase px-2 py-0.5 tracking-wider font-semibold">Recommended</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#5A6474] uppercase tracking-widest font-semibold">{suggestedCompanion.category}</span>
                        <h4 className="font-serif text-[16px] text-[#0F141C] font-semibold">{suggestedCompanion.name}</h4>
                        <p className="text-[12px] text-[#5A6474] mt-1 line-clamp-2">A great addition to your cart.</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 mt-6 bg-[#F0F3F7] border-t border-[#D8DEE6] -mx-6 -mb-6 p-6">
                      <div>
                        <span className="font-mono text-[18px] text-[#0F141C] font-bold">₹{suggestedCompanion.price}</span>
                        {suggestedCompanion.compareAtPrice && suggestedCompanion.compareAtPrice > suggestedCompanion.price && (
                          <span className="text-[11px] text-[#5A6474] line-through ml-1.5">₹{suggestedCompanion.compareAtPrice}</span>
                        )}
                      </div>
                      <button onClick={() => addItem(suggestedCompanion, 1)} className="bg-[#111620] hover:bg-[#A81323] text-white text-[11px] uppercase px-4 py-2 tracking-widest font-semibold transition-colors flex items-center gap-1.5" type="button">
                        <Plus size={16} /> Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
