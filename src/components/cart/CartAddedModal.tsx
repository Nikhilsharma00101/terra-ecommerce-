'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import {
  Check,
  X,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
} from 'lucide-react';

const AUTO_DISMISS_DURATION = 6500; // 6.5 seconds

export const CartAddedModal: React.FC = () => {
  const {
    lastAddedItem,
    isAddedNotificationOpen,
    closeAddedNotification,
    subtotal,
    totalItems,
    remainingForFreeShipping,
    freeShippingProgress,
  } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(AUTO_DISMISS_DURATION);

  // Reset timer on new item added
  useEffect(() => {
    if (isAddedNotificationOpen && lastAddedItem) {
      setProgress(100);
      remainingTimeRef.current = AUTO_DISMISS_DURATION;
      startTimeRef.current = Date.now();
    }
  }, [isAddedNotificationOpen, lastAddedItem?.timestamp]);

  // Handle countdown & progress bar with pause on hover
  useEffect(() => {
    if (!isAddedNotificationOpen) return;

    if (isHovered) {
      // Paused: calculate elapsed time
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Running
    startTimeRef.current = Date.now();
    const intervalTime = 50;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentRemaining = Math.max(0, remainingTimeRef.current - elapsed);
      const pct = (currentRemaining / AUTO_DISMISS_DURATION) * 100;
      setProgress(pct);

      if (currentRemaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        closeAddedNotification();
      }
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAddedNotificationOpen, isHovered, closeAddedNotification]);

  const product = lastAddedItem?.product;
  const quantity = lastAddedItem?.quantity || 1;
  const itemTotal = product ? product.price * quantity : 0;

  return (
    <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-[120] w-[calc(100vw-32px)] sm:w-[410px] pointer-events-none select-none">
      <AnimatePresence>
        {isAddedNotificationOpen && product && (
          <motion.div
            key={lastAddedItem?.timestamp || 'cart-modal'}
            initial={{ opacity: 0, y: -20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="pointer-events-auto bg-[#FAF8F5]/98 backdrop-blur-xl border border-[#E5E0D8] rounded-2xl shadow-[0_20px_50px_rgba(24,24,23,0.18)] overflow-hidden"
          >
            {/* Top Accent Gradient Ribbon */}
            <div className="h-1 w-full bg-gradient-to-r from-[#2D4438] via-[#C4A482] to-[#2D4438]" />

            <div className="p-4 sm:p-5 space-y-4">
              {/* Header: Verified checkmark + Title + Close Button */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]/80">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#2D4438]/10 text-[#2D4438] flex items-center justify-center shrink-0">
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[#2D4438] block leading-none">
                      Added To Your Bag
                    </span>
                    <span className="text-[9px] text-[#77736C] font-mono mt-0.5 block">
                      Direct Botanical Formulation
                    </span>
                  </div>
                </div>

                <button
                  onClick={closeAddedNotification}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#99948D] hover:text-[#181817] hover:bg-[#EAE5DC]/60 transition-colors cursor-pointer"
                  aria-label="Close notification"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Product Info Inset Vessel Card */}
              <div className="bg-white/90 border border-[#E5E0D8] rounded-xl p-3 flex items-center gap-3.5 shadow-2xs">
                <div className="w-16 h-20 bg-[#F4F1EB] rounded-lg border border-[#DDD8CF] relative overflow-hidden shrink-0 p-1">
                  <Image
                    src={product.featuredImage || '/images/home/hero-campaign.jpg'}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[#2D4438] bg-[#2D4438]/8 px-2 py-0.5 rounded-full inline-block mb-1">
                    {product.category || 'Essential'}
                  </span>
                  <h4 className="font-serif text-sm sm:text-base text-[#181817] font-medium leading-snug truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#55524D] mt-1">
                    <span className="bg-[#FAF8F5] border border-[#DDD8CF] px-1.5 py-0.5 rounded text-[10px]">
                      Qty: {quantity}
                    </span>
                    <span>•</span>
                    <span className="font-bold text-[#181817]">
                      ₹{itemTotal.toLocaleString('en-IN')}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="line-through text-[#99948D] text-[10px]">
                        ₹{(product.compareAtPrice * quantity).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Free Express Delivery Progress Indicator */}
              <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  {remainingForFreeShipping > 0 ? (
                    <div className="flex items-center gap-1.5 text-[#55524D]">
                      <Truck size={13} className="text-[#2D4438]" />
                      <span>
                        Add <strong className="text-[#181817] font-mono font-bold">₹{remainingForFreeShipping}</strong> for Free Delivery
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[#2D4438] font-semibold text-[11px]">
                      <Sparkles size={13} />
                      <span>Complimentary Express Delivery Unlocked</span>
                    </div>
                  )}
                  <span className="font-mono text-[10px] text-[#77736C]">
                    ₹{subtotal} / ₹999
                  </span>
                </div>

                <div className="h-1.5 bg-[#EAE5DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2D4438] to-[#3B5B4C] transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons: View Bag / Checkout / Continue */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/cart"
                  onClick={closeAddedNotification}
                  className="w-full bg-[#181817] hover:bg-[#2D4438] text-white py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.99] cursor-pointer"
                >
                  <ShoppingBag size={14} />
                  <span>View Shopping Bag ({totalItems})</span>
                  <ArrowRight size={13} />
                </Link>

                <div className="flex items-center justify-between px-1 pt-1">
                  <Link
                    href="/checkout"
                    onClick={closeAddedNotification}
                    className="text-xs font-bold uppercase tracking-[0.16em] text-[#2D4438] hover:text-[#181817] transition-colors flex items-center gap-1"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight size={11} />
                  </Link>

                  <button
                    onClick={closeAddedNotification}
                    className="text-[10px] uppercase font-semibold tracking-wider text-[#77736C] hover:text-[#181817] transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Subtle Auto-Dismiss Countdown Bar */}
            <div className="h-0.5 w-full bg-[#E5E0D8]/60">
              <div
                className="h-full bg-[#2D4438]/50 transition-all ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
