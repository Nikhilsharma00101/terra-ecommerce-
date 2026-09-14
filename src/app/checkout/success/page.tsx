import React from 'react';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, Sparkles, Truck } from 'lucide-react';

interface SuccessPageProps {
  searchParams: Promise<{ order?: string; total?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order || 'TR-IN-782941';
  const total = params.total || '1399';

  return (
    <div className="min-h-screen bg-[#F6F3ED] py-20 sm:py-32 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 w-full">
        <div className="bg-[#FBF9F5] border border-[#DDD8CF] p-8 sm:p-14 text-center space-y-8">
          {/* Success Checkmark */}
          <div className="w-16 h-16 bg-[#EAE5DC] text-[#2D4438] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle size={32} />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#2D4438] block mb-2">
              ORDER CONFIRMED
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#181817] font-light">
              Thank You for Your Order.
            </h1>
            <p className="text-xs sm:text-sm text-[#77736C] mt-2 font-light">
              Your order has been received and is being prepared for dispatch. SMS and WhatsApp tracking updates will be sent to your mobile number.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-[#F6F3ED] border border-[#DDD8CF] p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CF]">
              <span className="text-xs uppercase tracking-wider text-[#77736C]">Order Reference</span>
              <span className="font-mono text-sm font-bold text-[#181817]">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CF]">
              <span className="text-xs uppercase tracking-wider text-[#77736C]">Total Amount Paid</span>
              <span className="font-mono text-sm font-bold text-[#2D4438]">₹{total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#77736C]">Estimated Delivery</span>
              <span className="text-xs font-semibold text-[#181817] uppercase tracking-wider flex items-center gap-1.5">
                <Truck size={14} className="text-[#2D4438]" />
                2 to 4 Business Days (Pan-India)
              </span>
            </div>
          </div>

          {/* Quick Ritual Note */}
          <div className="bg-[#EAE5DC] p-5 text-left border-l-2 border-[#2D4438]">
            <span className="text-[10px] uppercase tracking-widest text-[#2D4438] font-bold block mb-1">
              HOW TO START YOUR ROUTINE
            </span>
            <p className="text-xs text-[#55514B] font-light leading-relaxed">
              When your package arrives, start on morning one: 1 pump of Face Wash over damp skin, followed by 3-5 drops of Beard Oil into towel-damp facial hair. Two simple minutes every day.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/shop"
              className="bg-[#181817] text-[#F6F3ED] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2D4438] transition-all flex items-center justify-center gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/account"
              className="bg-transparent border border-[#DDD8CF] text-[#181817] px-8 py-4 text-xs font-medium uppercase tracking-[0.16em] hover:border-[#181817] transition-all flex items-center justify-center"
            >
              TRACK IN CLIENT DASHBOARD
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
