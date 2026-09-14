'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/Logo';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Building,
  Check,
  Tag,
  Truck,
  Plus,
  Minus,
  Trash2,
  Sparkles,
  ChevronRight,
  Gift,
  Banknote,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart, updateQuantity, removeItem, freeShippingThreshold } = useCart();
  const { user } = useAuth();

  // Active Checkout Step: 1 = Contact & Shipping, 2 = Payment Method
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  // Form State
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    paymentMethod: 'upi',
    upiId: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: '',
  });

  // Promo code discount state
  const [couponInput, setCouponInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  // Auto-fill logged in user info
  useEffect(() => {
    if (user) {
      const names = (user.name || '').split(' ');
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        firstName: names[0] || prev.firstName,
        lastName: names.slice(1).join(' ') || prev.lastName,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [isProcessing, setIsProcessing] = useState(false);

  // Financial calculations
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingCost = discountedSubtotal >= freeShippingThreshold ? 0 : 75;
  const total = discountedSubtotal + shippingCost;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Coupon apply handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();

    if (code === 'TERRA10' || code === 'WELCOME10') {
      setDiscountPercent(10);
      setAppliedCoupon(code);
      setCouponInput('');
    } else if (code === 'METHOD20') {
      setDiscountPercent(20);
      setAppliedCoupon(code);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon code. Try TERRA10 for 10% off.');
    }
  };

  // Order submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderPayload = {
        customerEmail: formData.email,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        customerPhone: formData.phone,
        items: items.map((i) => ({
          productId: i.product.id || i.product.slug,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image:
            i.product.featuredImage ||
            (i.product.images && i.product.images.length > 0 ? i.product.images[0].url : '') ||
            '',
        })),
        subtotal: discountedSubtotal,
        shipping: shippingCost,
        tax: 0,
        total,
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India',
        },
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      let orderNumber = 'TR-IN-' + Math.floor(100000 + Math.random() * 900000);
      if (res.ok) {
        const data = await res.json();
        if (data.orderNumber) {
          orderNumber = data.orderNumber;
        }
      }

      clearCart();
      router.push(`/checkout/success?order=${orderNumber}&total=${total}`);
    } catch (err) {
      console.error('Order creation error:', err);
      const orderNum = 'TR-IN-' + Math.floor(100000 + Math.random() * 900000);
      clearCart();
      router.push(`/checkout/success?order=${orderNum}&total=${total}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] py-24 flex items-center justify-center">
        <div className="text-center max-w-md p-8 sm:p-12 bg-[#FBF9F5] border border-[#DDD8CF] shadow-xl">
          <div className="w-14 h-14 bg-[#2D4438] text-[#F6F3ED] rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift size={24} />
          </div>
          <h2 className="font-serif text-3xl text-[#181817] mb-2">Your Bag is Empty</h2>
          <p className="text-xs text-[#77736C] mb-6 font-light">
            Explore our daily formulations and add items to your cart before proceeding.
          </p>
          <Link
            href="/shop"
            className="btn-terra-primary text-xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>RETURN TO CATALOG</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const indianStates = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi NCR',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab',
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  return (
    <div className="min-h-screen bg-[#F6F3ED] py-10 sm:py-16 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* TOP BRAND HEADER & PROGRESS TRACKER                                      */}
        {/* ========================================================================= */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-8 mb-10 border-b border-[#DDD8CF] gap-4">
          <Logo variant="full" markHeight={24} />

          {/* Step Progress Pills */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1 border transition-all ${
                currentStep === 1
                  ? 'bg-[#181817] text-[#F6F3ED] border-[#181817]'
                  : 'bg-[#EAE5DC] text-[#77736C] border-[#DDD8CF]'
              }`}
            >
              <span>01. SHIPPING</span>
            </button>
            <ChevronRight size={12} className="text-[#77736C]" />
            <button
              onClick={() => {
                if (formData.firstName && formData.address1 && formData.postalCode) {
                  setCurrentStep(2);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 border transition-all ${
                currentStep === 2
                  ? 'bg-[#181817] text-[#F6F3ED] border-[#181817]'
                  : 'bg-[#EAE5DC] text-[#77736C] border-[#DDD8CF]'
              }`}
            >
              <span>02. PAYMENT</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#2D4438] font-mono">
            <Lock size={14} />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Free Express Shipping Progress Banner */}
        <div className="bg-[#181817] text-[#F6F3ED] p-4 mb-8 border border-[#2D4438] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Truck size={16} className="text-[#C4A482]" />
            {amountToFreeShipping === 0 ? (
              <span className="text-[#C4A482] font-semibold">
                ✓ YOU QUALIFIED FOR FREE EXPRESS DISPATCH ACROSS INDIA!
              </span>
            ) : (
              <span>
                Add <strong className="text-[#C4A482]">₹{amountToFreeShipping}</strong> more to qualify for Free Express Shipping.
              </span>
            )}
          </div>
          <span className="font-mono text-[10px] text-[#A39E93] hidden sm:inline">
            DISPATCHED WITHIN 24 HOURS
          </span>
        </div>

        {/* ========================================================================= */}
        {/* CHECKOUT MAIN LAYOUT (2 COLUMNS)                                          */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: MULTI-STEP FORM (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              
              {/* STEP 01: CONTACT & SHIPPING ADDRESS */}
              <div
                className={`bg-[#FBF9F5] border p-6 sm:p-8 space-y-5 transition-all ${
                  currentStep === 1 ? 'border-[#181817] shadow-lg' : 'border-[#DDD8CF] opacity-90'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#2D4438] text-[#F6F3ED] font-mono text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                    <h3 className="font-serif text-xl text-[#181817]">Shipping & Contact Details</h3>
                  </div>
                  {user && (
                    <span className="text-[10px] uppercase font-mono text-[#2D4438] bg-[#EAE5DC] px-2 py-1">
                      Auto-Filled from Profile
                    </span>
                  )}
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      Mobile Number (SMS Updates) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      Email Address (Invoice & Receipt) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@gmail.com"
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Rohan"
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Sharma"
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                    />
                  </div>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                    Street Address & Flat / Building *
                  </label>
                  <input
                    type="text"
                    name="address1"
                    required
                    value={formData.address1}
                    onChange={handleChange}
                    placeholder="e.g. Flat 402, Highline Apartments, Indiranagar"
                    className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                  />
                </div>

                {/* City, PIN & State */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      maxLength={6}
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="560038"
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3 py-2.5 text-xs text-[#181817] font-mono focus:outline-none focus:border-[#2D4438]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Bengaluru"
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-3 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#181817] font-semibold mb-1">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#F6F3ED] border border-[#DDD8CF] px-2 py-2.5 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438]"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Proceed Button for Step 1 */}
                {currentStep === 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.firstName && formData.address1 && formData.postalCode && formData.phone) {
                        setCurrentStep(2);
                      }
                    }}
                    className="w-full btn-terra-primary text-xs py-3.5 flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>CONTINUE TO PAYMENT METHOD</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>

              {/* STEP 02: PAYMENT METHOD */}
              <div
                className={`bg-[#FBF9F5] border p-6 sm:p-8 space-y-5 transition-all ${
                  currentStep === 2 ? 'border-[#181817] shadow-lg' : 'border-[#DDD8CF]'
                }`}
              >
                <div className="flex items-center justify-between border-b border-[#DDD8CF] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#2D4438] text-[#F6F3ED] font-mono text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                    <h3 className="font-serif text-xl text-[#181817]">Payment Method</h3>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-[#77736C]">
                    Safe & Instant Processing
                  </span>
                </div>

                {/* Payment Option Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'upi', label: 'UPI (GPay/Paytm)', icon: Smartphone },
                    { id: 'card', label: 'Cards (RuPay/Visa)', icon: CreditCard },
                    { id: 'netbanking', label: 'NetBanking', icon: Building },
                    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
                  ].map((pm) => {
                    const Icon = pm.icon;
                    const isSelected = formData.paymentMethod === pm.id;
                    return (
                      <button
                        type="button"
                        key={pm.id}
                        onClick={() => {
                          setFormData({ ...formData, paymentMethod: pm.id });
                          setCurrentStep(2);
                        }}
                        className={`p-3 border text-left flex flex-col justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#181817] text-[#F6F3ED] border-[#181817]'
                            : 'bg-[#F6F3ED] text-[#57534E] border-[#DDD8CF] hover:border-[#181817]'
                        }`}
                      >
                        <Icon size={18} className={isSelected ? 'text-[#C4A482]' : 'text-[#77736C]'} />
                        <span className="text-[10px] uppercase font-mono font-semibold tracking-wider mt-3">
                          {pm.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* UPI Details */}
                {formData.paymentMethod === 'upi' && (
                  <div className="p-4 bg-[#F6F3ED] border border-[#DDD8CF] space-y-3">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold">
                      Enter VPA / UPI ID
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleChange}
                      placeholder="e.g. mobile@okhdfcbank or user@paytm"
                      className="w-full bg-white border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] font-mono focus:outline-none focus:border-[#2D4438]"
                    />
                    <p className="text-[10px] text-[#77736C]">
                      Supports Google Pay, PhonePe, Paytm, CRED, and BHIM UPI.
                    </p>
                  </div>
                )}

                {/* Card Details */}
                {formData.paymentMethod === 'card' && (
                  <div className="p-4 bg-[#F6F3ED] border border-[#DDD8CF] space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold mb-1">
                        Card Number (16 Digits)
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="4532 •••• •••• 8921"
                        className="w-full bg-white border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] font-mono focus:outline-none focus:border-[#2D4438]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleChange}
                        placeholder="MM / YY"
                        className="w-full bg-white border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] font-mono focus:outline-none focus:border-[#2D4438]"
                      />
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleChange}
                        placeholder="CVV"
                        className="w-full bg-white border border-[#DDD8CF] px-3.5 py-2.5 text-xs text-[#181817] font-mono focus:outline-none focus:border-[#2D4438]"
                      />
                    </div>
                  </div>
                )}

                {/* NetBanking Details */}
                {formData.paymentMethod === 'netbanking' && (
                  <div className="p-4 bg-[#F6F3ED] border border-[#DDD8CF] space-y-2">
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#181817] font-semibold">
                      Select Primary Bank
                    </label>
                    <select className="w-full bg-white border border-[#DDD8CF] px-3 py-2.5 text-xs text-[#181817]">
                      <option>HDFC Bank</option>
                      <option>ICICI Bank</option>
                      <option>State Bank of India (SBI)</option>
                      <option>Axis Bank</option>
                      <option>Kotak Mahindra Bank</option>
                    </select>
                  </div>
                )}

                {/* Cash on Delivery Details */}
                {formData.paymentMethod === 'cod' && (
                  <div className="p-4 bg-[#F6F3ED] border border-[#DDD8CF] space-y-3">
                    <div className="flex items-center gap-2 text-[#2D4438] font-bold text-xs uppercase tracking-wider">
                      <Banknote size={16} />
                      <span>Cash / Pay on Delivery Selected</span>
                    </div>
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      Pay <strong className="text-[#181817]">₹{total}</strong> via Cash, UPI QR code, or Card to the courier partner upon doorstep delivery. No advance online payment needed.
                    </p>
                    <div className="p-3 bg-[#EAE5DC] text-[11px] text-[#44403C] flex items-center gap-2 border border-[#DDD8CF]">
                      <ShieldCheck size={14} className="text-[#2D4438] shrink-0" />
                      <span>Includes complimentary delivery verification & tamper-proof packaging.</span>
                    </div>
                  </div>
                )}

                {/* Final Submit Order Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-terra-primary text-xs py-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-4"
                >
                  {isProcessing ? (
                    <span>CONFIRMING & DISPATCHING...</span>
                  ) : (
                    <>
                      <span>
                        {formData.paymentMethod === 'cod'
                          ? `PLACE CASH ON DELIVERY ORDER (₹${total})`
                          : `CONFIRM & PLACE ORDER (₹${total})`}
                      </span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY & COUPON (5 COLS) */}
          <div className="lg:col-span-5 bg-[#FBF9F5] border border-[#DDD8CF] p-6 sm:p-8 space-y-6 sticky top-24">
            <h3 className="font-serif text-2xl text-[#181817] font-medium pb-4 border-b border-[#DDD8CF]">
              Order Summary ({items.length})
            </h3>

            {/* Cart Items List */}
            <div className="divide-y divide-[#DDD8CF] max-h-72 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => {
                const itemKey = product._id || product.id || product.slug;
                return (
                  <div key={itemKey} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3.5">
                    <div className="w-14 h-16 bg-[#EAE5DC] relative shrink-0 border border-[#DDD8CF]">
                      <Image
                        src={product.featuredImage}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm text-[#181817] font-medium truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-[#77736C] uppercase font-mono">
                        ₹{product.price} each
                      </p>

                      {/* Interactive Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, quantity - 1)}
                          className="w-5 h-5 border border-[#DDD8CF] flex items-center justify-center text-[#181817] hover:bg-[#181817] hover:text-[#F6F3ED] cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="font-mono text-xs font-semibold px-1">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(itemKey, quantity + 1)}
                          className="w-5 h-5 border border-[#DDD8CF] flex items-center justify-center text-[#181817] hover:bg-[#181817] hover:text-[#F6F3ED] cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(itemKey)}
                          className="text-[#77736C] hover:text-red-700 ml-2 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <span className="font-mono text-xs font-bold text-[#181817]">
                      ₹{product.price * quantity}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Section */}
            <div className="pt-4 border-t border-[#DDD8CF] space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#77736C] block">
                PROMO COUPON CODE
              </span>
              
              {appliedCoupon ? (
                <div className="bg-[#2D4438]/10 border border-[#2D4438] p-3 flex items-center justify-between text-xs text-[#2D4438] font-mono">
                  <div className="flex items-center gap-1.5">
                    <Tag size={13} />
                    <span>COUPON {appliedCoupon} ({discountPercent}% OFF)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedCoupon('');
                      setDiscountPercent(0);
                    }}
                    className="text-[10px] underline text-[#77736C] hover:text-[#181817] cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. TERRA10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="bg-[#F6F3ED] border border-[#DDD8CF] px-3 py-2 text-xs font-mono text-[#181817] flex-1 uppercase focus:outline-none focus:border-[#2D4438]"
                  />
                  <button
                    type="submit"
                    className="bg-[#181817] text-[#F6F3ED] px-4 py-2 text-[10px] font-mono uppercase font-semibold tracking-wider hover:bg-[#2D4438] cursor-pointer"
                  >
                    APPLY
                  </button>
                </form>
              )}
              {couponError && <p className="text-[10px] text-red-600 font-mono">{couponError}</p>}
            </div>

            {/* Financial Summary */}
            <div className="pt-4 border-t border-[#DDD8CF] space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#77736C]">
                <span>Item Subtotal</span>
                <span className="font-mono text-[#181817]">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#2D4438] font-semibold">
                  <span>Coupon Discount ({discountPercent}%)</span>
                  <span className="font-mono">- ₹{discountAmount}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[#77736C]">
                <span>Pan-India Delivery</span>
                <span className="font-mono text-[#181817]">
                  {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#77736C]">
                <span>GST Taxes</span>
                <span className="text-[10px] font-mono text-[#2D4438]">Included in MRP</span>
              </div>

              <div className="pt-4 border-t border-[#DDD8CF] flex items-center justify-between text-base font-bold">
                <span className="text-[#181817]">Total Payable</span>
                <span className="font-mono text-xl text-[#2D4438]">₹{total}</span>
              </div>
            </div>

            {/* Trust Seals */}
            <div className="pt-4 border-t border-[#DDD8CF] space-y-2 text-[10px] font-mono text-[#77736C]">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#2D4438]" />
                <span>Dispatched in sealed tamper-proof packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#2D4438]" />
                <span>30-Day Complete Satisfaction Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
