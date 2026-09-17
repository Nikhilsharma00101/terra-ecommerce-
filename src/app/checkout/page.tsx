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
  CheckCircle2,
  ArrowRight,
  Truck,
  Plus,
  Minus,
  Trash2,
  Tag,
  Gift,
  Banknote,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StandardInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  required = false,
  maxLength,
  error,
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  maxLength?: number;
  error?: string;
}) => (
  <div className="w-full">
    <label htmlFor={name} className="block text-[10px] uppercase tracking-wider text-[#181817] font-bold mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value}
      onChange={onChange}
      required={required}
      maxLength={maxLength}
      className={`w-full bg-[#FAF8F5] border ${error ? 'border-[#8B0000]' : 'border-[#DDD8CF]'} px-3.5 py-3 text-xs text-[#181817] placeholder-[#99948D] focus:outline-none focus:border-[#2D4438] transition-colors`}
    />
    {error && <p className="text-[10px] text-[#8B0000] mt-1.5 font-medium">{error}</p>}
  </div>
);

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    clearCart,
    updateQuantity,
    removeItem,
    freeShippingThreshold,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isLoading, isAuthenticated, router]);

  // Active Checkout Step: 1 = Contact & Shipping, 2 = Payment Method
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);

  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Promo code state
  const [couponInput, setCouponInput] = useState('');
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
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingCost = discountedSubtotal >= freeShippingThreshold ? 0 : 75;
  const total = discountedSubtotal + shippingCost;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.address1.trim()) newErrors.address1 = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode || formData.postalCode.length !== 6 || !/^\d{6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Enter a valid 6-digit PIN code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Coupon apply handler
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const res = await applyCoupon(couponInput, formData.email || user?.email);
    if (!res.success) {
      setCouponError(res.error || 'Invalid coupon code. Try WELCOME10.');
    } else {
      setCouponInput('');
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
            (i.product.images && i.product.images.length > 0
              ? i.product.images[0].url
              : '') ||
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
          body: JSON.stringify({ amount: total * 100, currency: 'INR' }),
        });
        const createOrderData = await createOrderRes.json();

        if (!createOrderRes.ok)
          throw new Error(createOrderData.error || 'Failed to create order');

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
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok) {
                const res = await fetch('/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(orderPayload),
                });

                let orderNumber =
                  'TR-IN-' + Math.floor(100000 + Math.random() * 900000);
                if (res.ok) {
                  const data = await res.json();
                  if (data.orderNumber) orderNumber = data.orderNumber;
                  clearCart();
                  router.push(
                    `/checkout/success?order=${orderNumber}&total=${total}`
                  );
                } else {
                  const data = await res.json();
                  alert(
                    'Order creation failed: ' + (data.error || 'Unknown error')
                  );
                  setIsProcessing(false);
                }
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
            contact: formData.phone,
          },
          theme: {
            color: '#181817',
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
            },
          },
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

        let orderNumber =
          'TR-IN-' + Math.floor(100000 + Math.random() * 900000);
        if (res.ok) {
          const data = await res.json();
          if (data.orderNumber) {
            orderNumber = data.orderNumber;
          }
          clearCart();
          router.push(`/checkout/success?order=${orderNumber}&total=${total}`);
        } else {
          const data = await res.json();
          throw new Error(data.error || 'Failed to place order');
        }
      }
    } catch (err: any) {
      console.error('Order creation error:', err);
      if (formData.paymentMethod === 'cod') {
        alert(err.message || 'An error occurred during order placement.');
        setIsProcessing(false);
      } else {
        alert(err.message || 'An error occurred during payment initialization.');
        setIsProcessing(false);
      }
    } finally {
      if (formData.paymentMethod === 'cod') {
        setIsProcessing(false);
      }
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] py-24 flex items-center justify-center">
        <div className="text-sm font-serif text-[#181817] animate-pulse">
          Preparing secure environment...
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F6F3ED] py-24 flex items-center justify-center">
        <div className="text-center max-w-md p-8 sm:p-12">
          <div className="w-16 h-16 border border-[#DDD8CF] text-[#181817] rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift size={24} strokeWidth={1} />
          </div>
          <h2 className="font-serif text-3xl text-[#181817] mb-3">
            Your Bag is Empty
          </h2>
          <p className="text-sm text-[#77736C] mb-8 font-light">
            Return to our boutique to discover formulations crafted for you.
          </p>
          <Link
            href="/shop"
            className="border-b border-[#181817] pb-1 text-xs uppercase tracking-widest text-[#181817] hover:text-[#55524D] transition-colors inline-flex items-center gap-2"
          >
            <span>Return to Catalog</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const indianStates = [
    'Andhra Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Delhi NCR',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu & Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  return (
    <div className="min-h-screen bg-[#F6F3ED] select-none text-[#181817]">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
      {/* Minimal Header */}
      <header className="py-6 px-6 lg:px-12 border-b border-[#DDD8CF] flex items-center justify-between sticky top-0 bg-[#F6F3ED]/90 backdrop-blur-md z-40">
        <Logo variant="full" markHeight={20} />
        <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-[#55524D]">
          <Lock size={12} />
          <span className="hidden sm:inline">Secure Checkout</span>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
        
        {/* Full width Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: ACCORDION FORM (7 COLS) */}
          <div className="lg:col-span-7">
            <form onSubmit={handlePlaceOrder}>
              
              {/* ACCORDION STEP 1: SHIPPING & CONTACT */}
              <div className="mb-10">
                <div
                  className={`flex items-baseline justify-between cursor-pointer pb-3 border-b-2 transition-colors ${
                    currentStep === 1
                      ? 'border-[#181817]'
                      : 'border-[#DDD8CF] hover:border-[#181817]/30'
                  }`}
                  onClick={() => setCurrentStep(1)}
                >
                  <h3
                    className={`font-serif text-2xl sm:text-3xl transition-colors ${
                      currentStep === 1 ? 'text-[#181817]' : 'text-[#99948D]'
                    }`}
                  >
                    01. Shipping & Contact
                  </h3>
                  {currentStep === 2 && (
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#2D4438] underline underline-offset-4">
                      Edit
                    </span>
                  )}
                </div>

                <AnimatePresence>
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 space-y-4">
                        {user && (
                          <div className="mb-6 inline-flex items-center gap-2 bg-[#EAE5DC] px-3 py-1.5 rounded-sm">
                            <Sparkles size={12} className="text-[#2D4438]" />
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#55524D]">
                              Auto-filled from {user.name}'s profile
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
                          <StandardInput
                            label="Email Address *"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            error={errors.email}
                          />
                          <StandardInput
                            label="Mobile Number *"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            error={errors.phone}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
                          <StandardInput
                            label="First Name *"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            error={errors.firstName}
                          />
                          <StandardInput
                            label="Last Name *"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            error={errors.lastName}
                          />
                        </div>

                        <StandardInput
                          label="Street Address, Flat / Building *"
                          name="address1"
                          value={formData.address1}
                          onChange={handleChange}
                          required
                          error={errors.address1}
                        />

                        <StandardInput
                          label="Apartment, Suite, etc. (Optional)"
                          name="address2"
                          value={formData.address2}
                          onChange={handleChange}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 sm:gap-6">
                          <StandardInput
                            label="City *"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            error={errors.city}
                          />
                          <StandardInput
                            label="PIN Code *"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            maxLength={6}
                            required
                            error={errors.postalCode}
                          />
                          <div className="w-full">
                            <label htmlFor="state" className="block text-[10px] uppercase tracking-wider text-[#181817] font-bold mb-2">
                              State *
                            </label>
                            <select
                              name="state"
                              id="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full bg-[#FAF8F5] border border-[#DDD8CF] px-3.5 py-3 text-xs text-[#181817] focus:outline-none focus:border-[#2D4438] transition-colors"
                            >
                              {indianStates.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="pt-6">
                          <button
                            type="button"
                            onClick={() => {
                              if (validateStep1()) {
                                setCurrentStep(2);
                              }
                            }}
                            className="bg-[#181817] text-[#F6F3ED] hover:bg-[#2D4438] px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center group"
                          >
                            <span>Continue to Payment</span>
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ACCORDION STEP 2: PAYMENT METHOD */}
              <div>
                <div
                  className={`pb-3 border-b-2 transition-colors ${
                    currentStep === 2
                      ? 'border-[#181817]'
                      : 'border-[#DDD8CF]'
                  }`}
                >
                  <h3
                    className={`font-serif text-2xl sm:text-3xl transition-colors ${
                      currentStep === 2 ? 'text-[#181817]' : 'text-[#99948D]'
                    }`}
                  >
                    02. Payment
                  </h3>
                </div>

                <AnimatePresence>
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 space-y-4">
                        {/* High-End Payment Selector */}
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
                                          After clicking "Place Order", you will be safely redirected to Razorpay to complete your purchase.
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
                                    <g transform="rotate(-6 13 10)">
                                      <rect x="2" y="3" width="22" height="13" rx="1.5" fill="#15803D" stroke="#14532D" strokeWidth="0.6" />
                                      <rect x="3.5" y="4.5" width="19" height="10" rx="1" fill="none" stroke="#86EFAC" strokeWidth="0.4" strokeDasharray="1 1" />
                                    </g>
                                    <rect x="2" y="4.5" width="22" height="13.5" rx="1.5" fill="#22C55E" stroke="#15803D" strokeWidth="0.6" />
                                    <rect x="3.5" y="6" width="19" height="10.5" rx="1" fill="none" stroke="#DCFCE7" strokeWidth="0.5" />
                                    <circle cx="13" cy="11.2" r="3.2" fill="#15803D" stroke="#86EFAC" strokeWidth="0.5" />
                                    <text x="13" y="11.8" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" fontFamily="Arial, sans-serif">₹</text>
                                    <circle cx="4.8" cy="7.2" r="0.6" fill="#DCFCE7" />
                                    <circle cx="21.2" cy="7.2" r="0.6" fill="#DCFCE7" />
                                    <circle cx="4.8" cy="15.2" r="0.6" fill="#DCFCE7" />
                                    <circle cx="21.2" cy="15.2" r="0.6" fill="#DCFCE7" />
                                    
                                    {/* Stack of Gold Coins */}
                                    <ellipse cx="26.5" cy="14.5" rx="4.5" ry="2" fill="#D97706" />
                                    <ellipse cx="26.5" cy="13.8" rx="4.5" ry="1.8" fill="#F59E0B" stroke="#B45309" strokeWidth="0.4" />
                                    <ellipse cx="26.5" cy="11.8" rx="4.5" ry="2" fill="#D97706" />
                                    <ellipse cx="26.5" cy="11.1" rx="4.5" ry="1.8" fill="#FBBF24" stroke="#D97706" strokeWidth="0.4" />
                                    <ellipse cx="26.5" cy="9.1" rx="4.5" ry="2" fill="#D97706" />
                                    <ellipse cx="26.5" cy="8.4" rx="4.5" ry="1.8" fill="#FDE047" stroke="#F59E0B" strokeWidth="0.4" />
                                    <text x="26.5" y="8.8" textAnchor="middle" dominantBaseline="middle" fill="#92400E" fontSize="3.2" fontWeight="900" fontFamily="Arial, sans-serif">₹</text>
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
                                      <div className="flex items-center gap-2 text-[#181817] text-[11px] font-bold uppercase tracking-wider">
                                        <Banknote size={14} className="text-[#2D4438]" />
                                        <span>Pay at Doorstep</span>
                                      </div>
                                      <p className="text-[11px] text-[#57534E] leading-relaxed">
                                        Pay <strong className="text-[#181817]">₹{total.toLocaleString('en-IN')}</strong> directly to the delivery executive upon arrival. We accept Cash, UPI QR scans, and standard cards at your door.
                                      </p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Final Submit Button */}
                        <div className="pt-8">
                          <button
                            type="submit"
                            disabled={isProcessing}
                            className="bg-[#181817] text-[#F6F3ED] hover:bg-[#2D4438] disabled:opacity-50 w-full py-4 text-sm font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 group"
                          >
                            {isProcessing ? (
                              <span className="animate-pulse">Authorizing Securely...</span>
                            ) : (
                              <>
                                <span>Place Order • ₹{total.toLocaleString('en-IN')}</span>
                                <Lock size={14} className="opacity-70" />
                              </>
                            )}
                          </button>
                          <p className="text-[10px] text-center text-[#99948D] mt-4 uppercase tracking-widest font-mono">
                            By placing your order, you agree to our Terms of Service.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: ELEGANT ORDER SUMMARY (5 COLS) */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-24 bg-white border border-[#DDD8CF] p-8 lg:p-10 shadow-sm">
              <h3 className="font-serif text-2xl text-[#181817] mb-8">
                In Your Bag
              </h3>

              {/* Minimal Cart Items List */}
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map(({ product, quantity }) => {
                  const itemKey = product._id || product.id || product.slug;
                  return (
                    <div
                      key={itemKey}
                      className="flex gap-4 items-start"
                    >
                      <div className="w-20 h-24 bg-[#FAF8F5] relative shrink-0 border border-[#DDD8CF] overflow-hidden">
                        <Image
                          src={product.featuredImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between h-24 py-1">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif text-[15px] leading-tight text-[#181817] truncate">
                              {product.name}
                            </h4>
                            <span className="font-mono text-xs text-[#181817] shrink-0">
                              ₹{(product.price * quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#77736C] uppercase font-mono mt-1">
                            Qty: {quantity}
                          </p>
                        </div>

                        {/* Quiet Controls */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => removeCoupon()}
                            className="text-[9px] uppercase font-bold text-[#77736C] hover:text-[#181817] cursor-pointer"
                          >
                            <span onClick={(e) => { e.preventDefault(); removeItem(itemKey); }}>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="w-full h-[1px] bg-[#DDD8CF] my-8" />

              {/* Coupon Code Minimalist Input */}
              <div className="mb-8">
                {appliedCoupon ? (
                  <div className="bg-[#FAF8F5] border border-[#DDD8CF] border-dashed p-3 flex items-center justify-between text-xs text-[#181817] font-mono">
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-[#2D4438]" />
                      <span>{appliedCoupon} APPLIED</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      className="text-[10px] text-[#77736C] hover:text-[#181817] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="relative">
                    <input
                      type="text"
                      placeholder="GIFT CARD OR PROMO CODE"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full border-b border-[#DDD8CF] py-2.5 text-xs text-[#181817] bg-transparent focus:outline-none focus:border-[#2D4438] placeholder-[#99948D] tracking-widest uppercase font-mono"
                    />
                    <button
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#181817] uppercase tracking-widest hover:text-[#55524D] cursor-pointer"
                    >
                      APPLY
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[10px] text-[#8B0000] mt-2 font-mono">
                    {couponError}
                  </p>
                )}
              </div>

              {/* Financial Lines */}
              <div className="space-y-3 text-sm text-[#55524D] mb-8">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#181817]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-[#2D4438]">
                    <span>Discount</span>
                    <span className="font-mono">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-mono text-[#181817]">
                    {shippingCost === 0 ? 'COMPLIMENTARY' : `₹${shippingCost}`}
                  </span>
                </div>
              </div>

              <div className="pt-6 border-t border-[#181817] flex items-center justify-between">
                <span className="text-base text-[#181817] font-medium tracking-wide">Total</span>
                <span className="font-mono text-xl text-[#181817] font-bold">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right mt-1">
                 <span className="text-[9px] text-[#99948D] uppercase font-mono tracking-widest">Includes all taxes</span>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 pt-6 border-t border-[#DDD8CF] space-y-3 text-[10px] font-mono uppercase tracking-widest text-[#77736C]">
                <div className="flex items-center gap-3">
                  <Truck size={14} className="text-[#2D4438] shrink-0" />
                  <span>Complimentary Express Dispatch</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={14} className="text-[#2D4438] shrink-0" />
                  <span>Secure 256-Bit Encrypted Checkout</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
