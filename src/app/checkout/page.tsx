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
  Sparkles,
  SmartphoneNfc,
  CreditCard,
  Landmark
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

  // Prevent hydration mismatch FOUC by waiting for mount
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    paymentMethod: 'upi',
    saveAddress: true,
  });

  // Promo code state
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Saved Address States
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(true);

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

      // Fetch precise saved addresses
      fetch('/api/user/profile')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data?.user?.addresses?.length > 0) {
            setSavedAddresses(data.user.addresses);

            const defaultAddr = data.user.addresses.find((a: any) => a.isDefault) || data.user.addresses[0];
            setSelectedAddressId(defaultAddr.id);
            setIsAddingNewAddress(false);

            const defaultNames = defaultAddr.fullName ? defaultAddr.fullName.split(' ') : names;
            setFormData(prev => ({
              ...prev,
              firstName: defaultNames[0] || prev.firstName,
              lastName: defaultNames.slice(1).join(' ') || prev.lastName,
              address1: defaultAddr.street || prev.address1,
              city: defaultAddr.city || prev.city,
              state: defaultAddr.state || prev.state,
              postalCode: defaultAddr.postalCode || prev.postalCode,
              phone: defaultAddr.phone || prev.phone,
            }));
          }
        })
        .catch(err => console.error('Error fetching addresses:', err));
    }
  }, [user]);

  const handleAddressSelect = (addr: any) => {
    setSelectedAddressId(addr.id);
    setIsAddingNewAddress(false);

    const names = addr.fullName ? addr.fullName.split(' ') : (user?.name || '').split(' ');

    setFormData(prev => ({
      ...prev,
      firstName: names[0] || prev.firstName,
      lastName: names.slice(1).join(' ') || prev.lastName,
      address1: addr.street || '',
      city: addr.city || '',
      state: addr.state || 'Maharashtra',
      postalCode: addr.postalCode || '',
      phone: addr.phone || user?.phone || prev.phone,
    }));

    setErrors({});
  };

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
    setIsApplyingCoupon(true);
    try {
      const res = await applyCoupon(couponInput, formData.email || user?.email);
      if (!res.success) {
        setCouponError(res.error || 'Invalid coupon code. Try WELCOME10.');
      } else {
        setCouponInput('');
      }
    } finally {
      setIsApplyingCoupon(false);
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
        paymentMethod: formData.paymentMethod === 'cod' ? 'cod' : 'razorpay',
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

      // 0. Auto-Save New Address if requested
      if (user && formData.saveAddress && (!savedAddresses.length || isAddingNewAddress)) {
        try {
          await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add_address',
              address: {
                title: 'Home',
                street: formData.address1,
                city: formData.city,
                state: formData.state,
                postalCode: formData.postalCode,
                phone: formData.phone,
                isDefault: savedAddresses.length === 0, // Make default if it's their first
              }
            })
          });
        } catch (e) {
          console.error('Failed to auto-save address', e);
          // Non-blocking error, we still want to place the order
        }
      }

      // 1. Pre-emptively create the DB Order first
      const createOrderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const createOrderData = await createOrderRes.json();
      if (!createOrderRes.ok) {
        throw new Error(createOrderData.error || 'Failed to create order');
      }

      const { orderNumber, razorpayOrderId, amount, currency } = createOrderData;

      if (formData.paymentMethod !== 'cod') {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: currency,
          name: 'Terra',
          description: 'Purchase from Terra',
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              // 2. Snappy Frontend Verification
              const verifyRes = await fetch('/api/orders/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              if (verifyRes.ok) {
                clearCart();
                router.push(`/checkout/success?order=${orderNumber}&total=${total}`);
              } else {
                const verifyData = await verifyRes.json();
                alert('Payment verification failed: ' + (verifyData.error || 'Unknown error'));
                setIsProcessing(false);
              }
            } catch (err) {
              console.error(err);
              alert('Payment processing error.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            contact: formData.phone,
          },
          config: {
            display: {
              blocks: {
                default: {
                  name: 'Complete Payment',
                  instruments: [
                    {
                      method: formData.paymentMethod,
                    }
                  ]
                }
              },
              sequence: ['block.default'],
              preferences: {
                show_default_blocks: false,
              }
            }
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
        // COD logic: order is already created, just redirect
        clearCart();
        router.push(`/checkout/success?order=${orderNumber}&total=${total}`);
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

  if (isLoading || !isAuthenticated || !isMounted) {

    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm tracking-widest text-on-surface uppercase">
            Loading Checkout...
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-surface flex flex-col font-body-md text-on-surface antialiased">


        <main className="w-full bg-surface flex-1">
          <div className="flex flex-col w-full">

            {/* Top Progress Breadcrumb & Trust Strip (Full Width Desktop) */}
            <div className="w-full sm:bg-surface-container-lowest sm:shadow-sm mt-0 sm:mb-8">
              <div className="w-full px-3 sm:px-6 lg:px-12 xl:px-16 py-2 sm:py-4 flex flex-wrap items-center justify-between gap-2 sm:gap-4 bg-transparent">
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 font-label-sm sm:font-label-md text-[10px] sm:text-label-md text-on-surface">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                      <span className="material-symbols-outlined text-[13px] sm:text-[16px]">check</span>
                    </span>
                    <span className="font-semibold text-on-surface">Cart</span>
                  </div>
                  <span className="text-outline-variant mx-0.5 sm:mx-1.5">/</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-secondary-container text-on-secondary font-bold text-[11px] sm:text-[14px]">2</span>
                    <span className="font-bold text-secondary-container">Checkout</span>
                  </div>
                  <span className="text-outline-variant mx-0.5 sm:mx-1.5">/</span>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-surface-container text-on-surface-variant text-[11px] sm:text-[14px]">3</span>
                    <span className="text-on-surface-variant">Confirmation</span>
                  </div>
                </div>
                <div className="flex items-center text-on-surface-variant font-label-sm text-label-sm">
                  <div className="flex items-center gap-1 bg-surface-container-low px-2 sm:px-3 py-1 rounded-full text-on-tertiary-container font-semibold">
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span className="hidden sm:inline">Verified Merchant</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full px-0 sm:px-6 lg:px-12 xl:px-16 pb-8 md:pb-10 pt-0">

              {/* Main 2-Column Responsive Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* LEFT COLUMN: Checkout Interaction Canvas (Col 1-7 or 1-8) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-0 sm:gap-6">

                  {/* 1. Authenticated User Banner */}
                  {user && (
                    <div className="flex items-center justify-between p-4 sm:p-5 bg-surface-container-low rounded-none sm:rounded-xl shadow-sm gap-2">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-secondary-container flex-shrink-0">
                          <span className="material-symbols-outlined text-[20px]">account_circle</span>
                        </div>
                        <div className="min-w-0">
                          <span className="font-label-lg text-label-lg text-on-surface block truncate">Logged in as {user.name}</span>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="bg-surface-container-lowest text-on-tertiary-container font-label-sm text-label-sm px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 w-fit">
                          <span className="material-symbols-outlined text-[14px]">check_circle</span> <span className="hidden sm:inline">Verified</span>
                        </span>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handlePlaceOrder}>
                    {/* 2. Shipping Address Selection */}
                    <section className="bg-surface-container-lowest p-6 sm:p-7 rounded-none sm:rounded-xl shadow-sm flex flex-col gap-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container text-on-secondary font-headline-sm text-headline-sm">1</span>
                          <h2 className="font-headline-md text-headline-md text-on-surface">Select Shipping Address</h2>
                        </div>
                        {user && savedAddresses.length > 0 && (
                          <button
                            onClick={() => { setIsAddingNewAddress(!isAddingNewAddress); setSelectedAddressId(null); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-secondary-container font-label-md text-label-md rounded-lg transition-colors"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">{isAddingNewAddress ? 'close' : 'add_location_alt'}</span>
                            <span>{isAddingNewAddress ? 'Cancel' : '+ Add New Address'}</span>
                          </button>
                        )}
                      </div>

                      {/* Radio Address Cards Grid */}
                      {user && savedAddresses.length > 0 && !isAddingNewAddress && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {savedAddresses.map((addr: any) => (
                            <label
                              key={addr.id}
                              className={`relative flex flex-col justify-between p-4 sm:p-5 rounded-xl shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedAddressId === addr.id ? 'bg-surface-container-low' : 'bg-surface-container-lowest'}`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                  <input
                                    checked={selectedAddressId === addr.id}
                                    onChange={() => handleAddressSelect(addr)}
                                    className="w-4 h-4 text-secondary-container focus:ring-0 cursor-pointer accent-[#316bf3]"
                                    name="shipping_address"
                                    type="radio"
                                  />
                                  <span className="bg-secondary-container text-on-secondary font-label-sm text-label-sm px-2 py-0.5 rounded font-semibold">{addr.title || 'Address'}</span>
                                  {addr.isDefault && (
                                    <span className="bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm px-2 py-0.5 rounded font-medium">Default</span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1 mb-4">
                                <p className="font-headline-sm text-headline-sm text-on-surface">{addr.fullName || user?.name}</p>
                                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                  {addr.street}<br />
                                  {addr.city}, {addr.state} {addr.postalCode}
                                </p>
                                <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 pt-1">
                                  <span className="material-symbols-outlined text-[14px]">call</span>
                                  {addr.phone || formData.phone}
                                </p>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}

                      {/* Expandable / Manual New Address Form */}
                      {(!user || savedAddresses.length === 0 || isAddingNewAddress) && (
                        <div className="bg-surface-container-low/60 rounded-xl p-5 mt-2">
                          <div className="flex items-center gap-2 mb-5">
                            <span className="material-symbols-outlined text-secondary-container text-[20px]">edit_note</span>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface">Enter Shipping Details</h3>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Email Address</label>
                                <input name="email" onChange={handleChange} value={formData.email} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:bg-surface-container-lowest" type="email" />
                                {errors.email && <span className="text-error text-[10px] mt-1">{errors.email}</span>}
                              </div>
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Mobile Phone Number</label>
                                <input name="phone" onChange={handleChange} value={formData.phone} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" type="tel" />
                                {errors.phone && <span className="text-error text-[10px] mt-1">{errors.phone}</span>}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">First Name</label>
                                <input name="firstName" onChange={handleChange} value={formData.firstName} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" type="text" />
                                {errors.firstName && <span className="text-error text-[10px] mt-1">{errors.firstName}</span>}
                              </div>
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Last Name</label>
                                <input name="lastName" onChange={handleChange} value={formData.lastName} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" type="text" />
                                {errors.lastName && <span className="text-error text-[10px] mt-1">{errors.lastName}</span>}
                              </div>
                            </div>
                            <div>
                              <label className="block font-label-md text-label-md text-on-surface mb-1.5">Street Address</label>
                              <input name="address1" onChange={handleChange} value={formData.address1} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" placeholder="House number and street name" type="text" />
                              {errors.address1 && <span className="text-error text-[10px] mt-1">{errors.address1}</span>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">Apt / Suite / Unit (Optional)</label>
                                <input name="address2" onChange={handleChange} value={formData.address2} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" placeholder="e.g. Apt 4B" type="text" />
                              </div>
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">City</label>
                                <input name="city" onChange={handleChange} value={formData.city} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" type="text" />
                                {errors.city && <span className="text-error text-[10px] mt-1">{errors.city}</span>}
                              </div>
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">State</label>
                                <select name="state" onChange={handleChange} value={formData.state} className="w-full h-11 px-3 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none">
                                  <option value="Maharashtra">Maharashtra</option>
                                  <option value="Delhi">Delhi</option>
                                  <option value="Karnataka">Karnataka</option>
                                  <option value="Gujarat">Gujarat</option>
                                  <option value="Tamil Nadu">Tamil Nadu</option>
                                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                                  <option value="West Bengal">West Bengal</option>
                                  <option value="Kerala">Kerala</option>
                                </select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block font-label-md text-label-md text-on-surface mb-1.5">PIN Code</label>
                                <input name="postalCode" onChange={handleChange} value={formData.postalCode} className="w-full h-11 px-3.5 bg-surface-container-lowest rounded-lg font-body-md text-body-md text-on-surface focus:outline-none" type="text" />
                                {errors.postalCode && <span className="text-error text-[10px] mt-1">{errors.postalCode}</span>}
                              </div>
                            </div>
                            
                            {user && (
                              <div className="flex items-center gap-2.5 mt-2">
                                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                  <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-outline-variant text-secondary-container focus:ring-secondary-container accent-[#316bf3]"
                                    checked={formData.saveAddress}
                                    onChange={(e) => setFormData({...formData, saveAddress: e.target.checked})}
                                  />
                                  <span className="font-body-sm text-body-sm text-on-surface-variant">Save this address to my profile for future orders</span>
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </section>

                    {/* 3. Payment Selection Section */}
                    <section className="bg-surface-container-lowest p-6 sm:p-7 rounded-none sm:rounded-xl shadow-sm flex flex-col gap-6 mt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                        <div className="flex items-center gap-2.5">
                          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container text-on-secondary font-headline-sm text-headline-sm flex-shrink-0">2</span>
                          <h2 className="font-headline-md text-headline-md text-on-surface whitespace-nowrap">Payment Method</h2>
                        </div>
                        <div className="flex items-center gap-1.5 bg-surface-container text-on-tertiary-container font-label-sm text-label-sm px-2.5 py-1 rounded-full w-fit">
                          <span className="material-symbols-outlined text-[15px]">lock</span>
                          <span>Encrypted &amp; 100% Secure</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* UPI */}
                        <div onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })} className={`cursor-pointer p-4 sm:p-5 rounded-xl transition-all shadow-sm flex flex-col gap-2 border-2 ${formData.paymentMethod === 'upi' ? 'bg-surface-container-low/70 border-secondary' : 'bg-surface-container-lowest border-transparent'}`}>
                          <div className="flex items-center gap-3">
                            <input checked={formData.paymentMethod === 'upi'} readOnly className="w-4 h-4 text-secondary-container focus:ring-0 accent-[#316bf3]" type="radio" />
                            <SmartphoneNfc className="text-secondary-container" size={24} />
                            <span className="font-headline-sm text-headline-sm text-on-surface">UPI / QR</span>
                          </div>
                          <AnimatePresence>
                            {formData.paymentMethod === 'upi' && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pt-3 pl-7">
                                  <div className="bg-surface-container-lowest p-3.5 rounded-lg flex items-start gap-2.5">
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                      Pay securely using <strong className="text-on-surface font-semibold">Google Pay, PhonePe, Paytm</strong>, or any UPI app.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Credit / Debit Cards */}
                        <div onClick={() => setFormData({ ...formData, paymentMethod: 'card' })} className={`cursor-pointer p-4 sm:p-5 rounded-xl transition-all shadow-sm flex flex-col gap-2 border-2 ${formData.paymentMethod === 'card' ? 'bg-surface-container-low/70 border-secondary' : 'bg-surface-container-lowest border-transparent'}`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input checked={formData.paymentMethod === 'card'} readOnly className="w-4 h-4 text-secondary-container focus:ring-0 accent-[#316bf3]" type="radio" />
                              <CreditCard className="text-secondary-container" size={24} />
                              <span className="font-headline-sm text-headline-sm text-on-surface">Credit / Debit Card</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-60">
                              <span className="px-1.5 py-0.5 bg-surface-container-highest text-[10px] font-bold rounded shadow-2xs">VISA</span>
                              <span className="px-1.5 py-0.5 bg-surface-container-highest text-[10px] font-bold rounded shadow-2xs">MC</span>
                            </div>
                          </div>
                          <AnimatePresence>
                            {formData.paymentMethod === 'card' && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pt-3 pl-7">
                                  <div className="bg-surface-container-lowest p-3.5 rounded-lg flex items-start gap-2.5">
                                    <Lock size={16} className="text-secondary-container flex-shrink-0 mt-0.5" />
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                      You will be securely redirected to our bank-grade encrypted checkout gateway to enter your card details.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Netbanking */}
                        <div onClick={() => setFormData({ ...formData, paymentMethod: 'netbanking' })} className={`cursor-pointer p-4 sm:p-5 rounded-xl transition-all shadow-sm flex flex-col gap-2 border-2 ${formData.paymentMethod === 'netbanking' ? 'bg-surface-container-low/70 border-secondary' : 'bg-surface-container-lowest border-transparent'}`}>
                          <div className="flex items-center gap-3">
                            <input checked={formData.paymentMethod === 'netbanking'} readOnly className="w-4 h-4 text-secondary-container focus:ring-0 accent-[#316bf3]" type="radio" />
                            <Landmark className="text-secondary-container" size={24} />
                            <span className="font-headline-sm text-headline-sm text-on-surface">Netbanking</span>
                          </div>
                          <AnimatePresence>
                            {formData.paymentMethod === 'netbanking' && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pt-3 pl-7">
                                  <div className="bg-surface-container-lowest p-3.5 rounded-lg flex items-start gap-2.5">
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                      All major Indian banks are supported. You will select your bank on the next secure screen.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* COD */}
                        <div onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })} className={`cursor-pointer p-4 sm:p-5 rounded-xl transition-all shadow-sm flex flex-col gap-2 border-2 ${formData.paymentMethod === 'cod' ? 'bg-surface-container-low/70 border-secondary' : 'bg-surface-container-lowest border-transparent'}`}>
                          <div className="flex items-center gap-3">
                            <input checked={formData.paymentMethod === 'cod'} readOnly className="w-4 h-4 text-secondary-container focus:ring-0 accent-[#316bf3]" type="radio" />
                            <Banknote className="text-secondary-container" size={24} />
                            <span className="font-headline-sm text-headline-sm text-on-surface">Cash on Delivery (COD)</span>
                          </div>
                          <AnimatePresence>
                            {formData.paymentMethod === 'cod' && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="pt-3 pl-7">
                                  <div className="bg-surface-container-lowest p-3.5 rounded-lg flex items-start gap-2.5">
                                    <Truck size={16} className="text-secondary-container flex-shrink-0 mt-0.5" />
                                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                                      Pay with cash upon package arrival. Please have the exact amount ready.
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </section>

                    {/* 4. Final Checkout Button & Terms */}
                    <div className="bg-surface-container-lowest p-6 sm:p-7 rounded-none sm:rounded-xl shadow-sm flex flex-col gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full h-14 bg-secondary-container disabled:opacity-50 hover:bg-secondary text-on-secondary rounded-xl font-headline-sm text-[16px] sm:text-headline-sm flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-[0.99] cursor-pointer px-2 text-center"
                      >
                        {isProcessing ? (
                          <><span className="material-symbols-outlined animate-spin text-[20px] sm:text-[22px]">sync</span><span>Securing Transaction...</span></>
                        ) : (
                          <><span className="material-symbols-outlined text-[20px] sm:text-[22px]">lock</span><span className="truncate">Pay ₹{total.toLocaleString('en-IN')} &amp; Place Order</span></>
                        )}
                      </button>
                      <div className="text-center px-4">
                        <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                          By placing this order, you agree to VeroStore's
                          <a className="text-secondary-container font-semibold hover:underline" href="#"> Terms of Service</a>,
                          <a className="text-secondary-container font-semibold hover:underline" href="#"> Privacy Policy</a>, and
                          <a className="text-secondary-container font-semibold hover:underline" href="#"> Return Guarantee</a>.
                        </p>
                      </div>
                    </div>

                  </form>
                </div>

                {/* RIGHT COLUMN: Sticky Order Summary & Cart Overview (Col 8-12) */}
                <aside className="lg:col-span-5 xl:col-span-4 w-full flex flex-col gap-6 lg:sticky lg:top-24">
                  <div className="bg-surface-container-lowest rounded-none sm:rounded-xl p-6 shadow-sm flex flex-col gap-6">

                    {/* Summary Header */}
                    <div className="flex items-center justify-between pb-4 bg-surface-container-low px-4 py-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary-container text-[22px]">shopping_bag</span>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Order Summary ({items.length} items)</h3>
                      </div>
                    </div>

                    {/* Product Line Items */}
                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                      {items.map(({ product, quantity }) => {
                        const itemKey = product._id || product.id || product.slug;
                        return (
                          <div key={itemKey} className="flex items-center gap-3.5 group">
                            <div className="relative w-16 h-16 rounded-xl bg-surface-container-low overflow-hidden flex-shrink-0 shadow-2xs">
                              <Image src={product.featuredImage} alt={product.name} fill className="object-cover" />
                              <span className="absolute top-1 right-1 bg-primary text-on-primary font-label-sm text-label-sm w-5 h-5 rounded-full flex items-center justify-center font-bold">{quantity}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-headline-sm text-headline-sm text-on-surface truncate">{product.name}</h4>
                              <div className="flex items-center gap-2 pt-0.5">
                                <span className="font-label-sm text-label-sm text-on-surface-variant">Qty: {quantity}</span>
                                <span className="text-outline-variant">•</span>
                                <button onClick={(e) => { e.preventDefault(); removeItem(itemKey); }} className="font-label-sm text-label-sm text-error hover:underline inline-flex items-center gap-0.5" type="button">
                                  <span className="material-symbols-outlined text-[13px]">delete</span> Remove
                                </button>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Promo Code Input & Applied Chip */}
                    <div className="bg-surface-container-low p-3.5 rounded-xl space-y-3">
                      {appliedCoupon ? (
                        <>
                          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest">
                            <div className="flex items-center gap-1.5 text-on-tertiary-container font-label-md text-label-md font-semibold">
                              <span className="material-symbols-outlined text-[16px]">local_offer</span>
                              <span>{appliedCoupon}</span>
                            </div>
                            <button onClick={removeCoupon} className="font-label-sm text-label-sm text-on-surface-variant hover:text-error transition-colors flex items-center gap-0.5" type="button">
                              <span className="material-symbols-outlined text-[14px]">close</span>
                              <span>Remove</span>
                            </button>
                          </div>
                          <p className="font-body-sm text-body-sm text-on-tertiary-container flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                            Promo code applied!
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative w-full sm:flex-1">
                              <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-on-surface-variant text-[18px]">confirmation_number</span>
                              <input
                                type="text"
                                value={couponInput}
                                onChange={(e) => setCouponInput(e.target.value)}
                                className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface uppercase tracking-wider focus:outline-none"
                                placeholder="Promo code"
                              />
                            </div>
                            <button onClick={handleApplyCoupon} disabled={isApplyingCoupon} className="w-full sm:w-auto px-4 h-10 bg-primary text-white hover:bg-on-background font-label-md text-label-md rounded-lg transition-colors disabled:opacity-50 cursor-pointer" type="button">
                              {isApplyingCoupon ? '...' : 'Apply'}
                            </button>
                          </div>
                          {couponError && <p className="text-error text-[10px]">{couponError}</p>}
                        </>
                      )}
                    </div>

                    {/* Financial Breakdown Calculation */}
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                        <span>Subtotal</span>
                        <span className="text-on-surface font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between items-center font-body-md text-body-md text-on-tertiary-container">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">sell</span>
                            Discount ({appliedCoupon})
                          </span>
                          <span className="font-semibold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                        <span>Shipping</span>
                        <div className="flex items-center gap-1.5">
                          {shippingCost === 0 ? (
                            <span className="text-on-tertiary-container font-semibold">FREE</span>
                          ) : (
                            <span className="text-on-surface font-semibold">₹{shippingCost}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                        <span>Estimated Tax</span>
                        <span className="text-on-surface font-medium">₹0.00 <span className="text-outline text-label-sm">(Included)</span></span>
                      </div>

                      {/* Total Block */}
                      <div className="pt-4 mt-3 bg-surface-container-low p-4 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-headline-sm text-headline-sm text-on-surface">Final Total</p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">Includes all taxes</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-display text-on-surface tracking-tight leading-none">₹{total.toLocaleString('en-IN')}</p>
                          <span className="font-label-sm text-label-sm text-on-tertiary-container font-semibold">INR Net</span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Trust Assurance & Guarantee Box */}
                  <div className="bg-surface-container-lowest rounded-xl p-5 shadow-sm space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-secondary-container flex-shrink-0">
                        <span className="material-symbols-outlined text-[20px]">security</span>
                      </div>
                      <div>
                        <p className="font-label-md text-label-md text-on-surface">Encrypted Protection</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Compliant with Level 1 PCI-DSS financial standards.</p>
                      </div>
                    </div>
                  </div>
                </aside>

              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
