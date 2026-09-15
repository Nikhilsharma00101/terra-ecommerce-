'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
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
    paymentMethod: 'razorpay',
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
        couponCode: appliedCoupon || undefined,
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

      if (formData.paymentMethod !== 'cod') {
        const createOrderRes = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total * 100, currency: 'INR' })
        });
        const createOrderData = await createOrderRes.json();
        
        if (!createOrderRes.ok) throw new Error(createOrderData.error || 'Failed to create order');

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: createOrderData.amount,
          currency: createOrderData.currency,
          name: 'Terra',
          description: 'Purchase from Terra',
          order_id: createOrderData.order_id,
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature
                })
              });
              
              const verifyData = await verifyRes.json();
              
              if (verifyRes.ok) {
                const res = await fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(orderPayload),
                });
                
                let orderNumber = 'TR-IN-' + Math.floor(100000 + Math.random() * 900000);
                if (res.ok) {
                  const data = await res.json();
                  if (data.orderNumber) orderNumber = data.orderNumber;
                }
                clearCart();
                router.push(`/checkout/success?order=${orderNumber}&total=${total}`);
              } else {
                alert('Payment verification failed: ' + verifyData.error);
                setIsProcessing(false);
              }
            } catch (err) {
              console.error(err);
              alert('Payment verification error.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: '#181817'
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          alert('Payment Failed: ' + response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      } else {
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
      }
    } catch (err) {
      console.error('Order creation error:', err);
      if (formData.paymentMethod === 'cod') {
        const orderNum = 'TR-IN-' + Math.floor(100000 + Math.random() * 900000);
        clearCart();
        router.push(`/checkout/success?order=${orderNum}&total=${total}`);
      } else {
        alert('An error occurred during payment initialization.');
        setIsProcessing(false);
      }
    } finally {
      if (formData.paymentMethod === 'cod') {
        setIsProcessing(false);
      }
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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

                {/* Payment Option Selector - High-end Accordion Style */}
                <div className="border border-[#DDD8CF] divide-y divide-[#DDD8CF] bg-[#FBF9F5] shadow-sm">
                  
                  {/* Razorpay Option */}
                  <div className={`transition-colors ${formData.paymentMethod === 'razorpay' ? 'bg-[#F6F3ED]' : 'hover:bg-[#F6F3ED]'}`}>
                    <label className="flex items-center gap-4 p-5 cursor-pointer select-none">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-[#181817] shrink-0">
                        {formData.paymentMethod === 'razorpay' && (
                          <motion.div layoutId="radio-dot" className="w-2 h-2 rounded-full bg-[#181817]" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="razorpay" 
                        checked={formData.paymentMethod === 'razorpay'} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#181817] tracking-wide">
                          Credit Card, UPI, or NetBanking
                        </span>
                        <div className="flex items-center gap-1.5 opacity-100">
                          {/* Visa */}
                          <svg viewBox="0 0 32 20" className="w-8 h-5 border border-[#DDD8CF] bg-white rounded-[2px] shadow-sm" xmlns="http://www.w3.org/2000/svg">
                            <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#1434CB" fontSize="9" fontWeight="900" fontStyle="italic" fontFamily="Arial, sans-serif">VISA</text>
                          </svg>
                          {/* Mastercard */}
                          <svg viewBox="0 0 32 20" className="w-8 h-5 border border-[#DDD8CF] bg-white rounded-[2px] shadow-sm" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="10" r="5" fill="#EB001B" />
                            <circle cx="20" cy="10" r="5" fill="#F79E1B" opacity="0.9" />
                          </svg>
                          {/* Amex */}
                          <svg viewBox="0 0 32 20" className="w-8 h-5 bg-[#016FD0] border border-[#016FD0] rounded-[2px] shadow-sm" xmlns="http://www.w3.org/2000/svg">
                            <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
                          </svg>
                          {/* UPI */}
                          <svg viewBox="0 0 32 20" className="w-8 h-5 border border-[#DDD8CF] bg-white rounded-[2px] shadow-sm" xmlns="http://www.w3.org/2000/svg">
                            <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#44403C" fontSize="8" fontWeight="bold" fontFamily="Arial, sans-serif">UPI</text>
                          </svg>
                        </div>
                      </div>
                    </label>
                    
                    <AnimatePresence>
                      {formData.paymentMethod === 'razorpay' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 pt-1 ml-6 sm:ml-8">
                            <div className="flex flex-col items-center justify-center py-8 px-6 bg-white border border-[#DDD8CF] text-center gap-3 shadow-inner">
                              <div className="w-12 h-12 bg-[#2D4438]/10 text-[#2D4438] rounded-full flex items-center justify-center">
                                <ShieldCheck size={24} strokeWidth={1.5} />
                              </div>
                              <div className="space-y-1 max-w-sm">
                                <p className="text-[13px] text-[#181817] font-semibold tracking-wide">
                                  Secure Encrypted Gateway
                                </p>
                                <p className="text-[11px] text-[#77736C] leading-relaxed">
                                  After clicking "Confirm Order", you will be safely redirected to Razorpay to complete your purchase using your preferred payment method.
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* COD Option */}
                  <div className={`transition-colors ${formData.paymentMethod === 'cod' ? 'bg-[#F6F3ED]' : 'hover:bg-[#F6F3ED]'}`}>
                    <label className="flex items-center gap-4 p-5 cursor-pointer select-none">
                      <div className="relative flex items-center justify-center w-4 h-4 rounded-full border border-[#181817] shrink-0">
                        {formData.paymentMethod === 'cod' && (
                          <motion.div layoutId="radio-dot" className="w-2 h-2 rounded-full bg-[#181817]" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={formData.paymentMethod === 'cod'} 
                        onChange={handleChange} 
                        className="hidden" 
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-[13px] font-semibold text-[#181817] tracking-wide">
                          Cash on Delivery
                        </span>
                        <div className="flex items-center gap-1.5 opacity-100">
                          {/* Realistic Cash & Coins Icon */}
                          <svg viewBox="0 0 34 22" className="w-9 h-5 rounded-[2px] shadow-sm overflow-hidden" xmlns="http://www.w3.org/2000/svg">
                            {/* Back banknote (angled) */}
                            <g transform="rotate(-6 13 10)">
                              <rect x="2" y="3" width="22" height="13" rx="1.5" fill="#15803D" stroke="#14532D" strokeWidth="0.6" />
                              <rect x="3.5" y="4.5" width="19" height="10" rx="1" fill="none" stroke="#86EFAC" strokeWidth="0.4" strokeDasharray="1 1" />
                            </g>
                            {/* Front banknote */}
                            <rect x="2" y="4.5" width="22" height="13.5" rx="1.5" fill="#22C55E" stroke="#15803D" strokeWidth="0.6" />
                            <rect x="3.5" y="6" width="19" height="10.5" rx="1" fill="none" stroke="#DCFCE7" strokeWidth="0.5" />
                            {/* Banknote center medallion */}
                            <circle cx="13" cy="11.2" r="3.2" fill="#15803D" stroke="#86EFAC" strokeWidth="0.5" />
                            <text x="13" y="11.8" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" fontFamily="Arial, sans-serif">₹</text>
                            {/* Corner dots */}
                            <circle cx="4.8" cy="7.2" r="0.6" fill="#DCFCE7" />
                            <circle cx="21.2" cy="7.2" r="0.6" fill="#DCFCE7" />
                            <circle cx="4.8" cy="15.2" r="0.6" fill="#DCFCE7" />
                            <circle cx="21.2" cy="15.2" r="0.6" fill="#DCFCE7" />
                            
                            {/* Stack of Gold Coins on the right */}
                            {/* Bottom coin */}
                            <ellipse cx="26.5" cy="14.5" rx="4.5" ry="2" fill="#D97706" />
                            <ellipse cx="26.5" cy="13.8" rx="4.5" ry="1.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.4" />
                            {/* Middle coin */}
                            <ellipse cx="26.5" cy="11.8" rx="4.5" ry="2" fill="#D97706" />
                            <ellipse cx="26.5" cy="11.1" rx="4.5" ry="1.8" fill="#FBBF24" stroke="#D97706" strokeWidth="0.4" />
                            {/* Top coin */}
                            <ellipse cx="26.5" cy="9.1" rx="4.5" ry="2" fill="#D97706" />
                            <ellipse cx="26.5" cy="8.4" rx="4.5" ry="1.8" fill="#FDE047" stroke="#F59E0B" strokeWidth="0.4" />
                            <text x="26.5" y="8.8" textAnchor="middle" dominantBaseline="middle" fill="#92400E" fontSize="3.2" fontWeight="900" fontFamily="Arial, sans-serif">₹</text>
                          </svg>

                          {/* COD Badge */}
                          <svg viewBox="0 0 32 20" className="w-8 h-5 border border-[#DDD8CF] bg-white rounded-[2px] shadow-sm" xmlns="http://www.w3.org/2000/svg">
                            <rect x="2" y="2.5" width="28" height="15" rx="1" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="0.5" />
                            <text x="50%" y="56%" dominantBaseline="middle" textAnchor="middle" fill="#15803D" fontSize="7" fontWeight="bold" fontFamily="Arial, sans-serif" letterSpacing="0.4">COD</text>
                          </svg>
                        </div>
                      </div>
                    </label>

                    <AnimatePresence>
                      {formData.paymentMethod === 'cod' && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 pt-1 ml-6 sm:ml-8">
                            <div className="p-5 bg-white border border-[#DDD8CF] space-y-3 shadow-inner">
                              <div className="flex items-center gap-2 text-[#181817] text-xs font-bold uppercase tracking-wider">
                                <Banknote size={14} className="text-[#2D4438]" />
                                <span>Pay at Doorstep</span>
                              </div>
                              <p className="text-[11px] text-[#57534E] leading-relaxed">
                                Pay <strong className="text-[#181817]">₹{total}</strong> directly to the delivery executive upon arrival. We accept Cash, UPI QR scans, and standard cards at your door.
                              </p>
                              <div className="pt-3 mt-3 border-t border-[#DDD8CF] flex items-center gap-2 text-[10px] text-[#77736C]">
                                <ShieldCheck size={14} className="text-[#2D4438]" />
                                <span>Includes complimentary tamper-proof packaging</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

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
