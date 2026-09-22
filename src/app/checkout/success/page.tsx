'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2, ArrowRight, Package, ShieldCheck,
  MapPin, Headset, Clock, TrendingUp, CheckSquare, Send, Info, FileText, Gift, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

// Expanded Order Data based on MongoDB schema
interface OrderData {
  orderNumber: string;
  customerName: string;
  customerPhone?: string;
  total: number;
  subtotal: number;
  shipping: number;
  discountAmount?: number;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  status: string;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderRef = params.get('order');

    if (!orderRef) {
      setError('No order reference found.');
      setLoading(false);
      return;
    }

    // Fetch authoritative order data
    fetch(`/api/orders/${encodeURIComponent(orderRef)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then((data) => {
        if (data.order) {
          setOrder(data.order);
        } else {
          setError('Order details could not be loaded.');
        }
      })
      .catch(() => {
        setError('Failed to retrieve full order details.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Trigger Confetti once loading finishes and order is successfully set
  useEffect(() => {
    if (!loading && order) {
      setShowConfetti(true);
      // Let it rain for 7 seconds, then stop new particles from spawning
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-20 sm:py-32 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="font-headline-sm text-on-surface-variant flex items-center gap-2"
        >
          <Package className="animate-spin" /> Verifying Order Details...
        </motion.div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-background py-20 sm:py-32 flex items-center justify-center px-4">
        <div className="text-center max-w-md p-8 bg-surface-container-low rounded-3xl shadow-sm border border-outline-variant">
          <p className="text-on-surface-variant mb-6 font-body-md">{error}</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-8 py-3.5 rounded-xl font-label-lg hover:bg-secondary/90 transition-colors w-full"
          >
            <span>Return to Shop</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const orderDate = new Date(order.createdAt).toLocaleString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Calculate some visual details
  const firstName = order.customerName.split(' ')[0];
  const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media screen {
          #invoice-printable { display: none !important; }
        }
        @media print {
          body, html { background-color: white !important; color: black !important; margin: 0 !important; padding: 0 !important; }
          #printable-tax-invoice { display: block !important; }
          #screen-content { display: none !important; }
          @page { margin: 0.5cm; }
        }
      `}} />

      {/* CONFETTI OVERLAY */}
      {showConfetti && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 99999, pointerEvents: 'none' }}>
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={800}
            gravity={0.09}
            initialVelocityY={25}
            tweenDuration={7000}
            colors={['#D4AF37', '#C5A059', '#F3E5AB', '#2D4438', '#000000', '#ffffff', '#85f8c4']}
          />
        </div>
      )}

      {/* PRINT-ONLY INVOICE (Hooks into globals.css #printable-tax-invoice rules) */}
      <div id="printable-tax-invoice" className="hidden print:block p-10 bg-white text-black font-sans">
        <div className="max-w-4xl mx-auto flex flex-col gap-8 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-300 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img src="/images/logo/logo-dark.png" alt="Terra Mens" className="h-7 w-auto object-contain" />
                <h1 className="text-3xl font-bold tracking-widest uppercase">TERRA MENS</h1>
              </div>
              <p className="text-[10px] tracking-widest uppercase text-gray-800 font-bold mt-1">Sri Sai Enterprises</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Tax Invoice</h2>
              <p className="text-sm text-gray-600 mt-1">Original for Recipient</p>
            </div>
          </div>

          {/* Details Row */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1 text-sm">
              <p><span className="font-semibold w-24 inline-block">Order No:</span> {order.orderNumber}</p>
              <p><span className="font-semibold w-24 inline-block">Order Date:</span> {orderDate}</p>
              <p><span className="font-semibold w-24 inline-block">Payment:</span> {order.paymentMethod.toUpperCase()}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-right">
              <p className="font-semibold text-gray-800">Sold By:</p>
              <p>Sri Sai Enterprises</p>
              <p>C-5/39, G/f, Khand-42/16, Plot No. 6, Karawal Nagar Road</p>
              <p>New Delhi, North East Delhi - 110094</p>
              <p>GSTIN: 07ELZPS4500M1Z9</p>
              <p>Email: info@terramensco.com</p>
            </div>
          </div>

          {/* Address Row */}
          <div className="grid grid-cols-2 gap-8 border-t border-gray-300 pt-6">
            <div className="flex flex-col gap-1 text-sm">
              <p className="font-semibold text-gray-800 mb-1">Billing / Shipping Address:</p>
              <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
              <p>{order.shippingAddress.address1} {order.shippingAddress.address2}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
              {order.customerPhone && <p>Phone: {order.customerPhone}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-800">
                  <th className="py-2 font-semibold">Product</th>
                  <th className="py-2 font-semibold">SKU / Ref</th>
                  <th className="py-2 font-semibold text-center">Qty</th>
                  <th className="py-2 font-semibold text-right">Price</th>
                  <th className="py-2 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-200">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3 text-gray-500 uppercase">{item.productId.slice(0, 8)}</td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">₹{item.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-right font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div className="flex justify-end mt-4">
            <div className="w-64 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{order.shipping === 0 ? 'Free' : `₹${order.shipping.toLocaleString('en-IN')}`}</span>
              </div>
              <div className="flex justify-between border-t border-gray-800 pt-2 font-bold text-base mt-1">
                <span>Total Amount</span>
                <span>₹{order.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                Amount includes GST (18%) where applicable.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-gray-500 border-t border-gray-200 pt-6">
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
            <p className="mt-1">Thank you for choosing Terra Botanicals.</p>
          </div>
        </div>
      </div>

      {/* REGULAR SCREEN CONTENT */}
      <div className="w-full bg-background flex flex-col min-h-screen text-on-surface overflow-x-hidden">
        {/* Top Notification Bar */}
        <div className="w-full bg-surface-container-lowest border-b border-surface-container-highest/30 px-4 sm:px-6 py-2 sm:py-2.5 text-center relative z-10">
          <p className="font-label-sm text-[10px] sm:text-xs tracking-widest sm:tracking-[0.2em] text-secondary uppercase font-semibold flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>ORDER CONFIRMED</span>
            <span className="text-outline/40 hidden sm:inline">|</span>
            <span>FREE EXPRESS DELIVERY</span>
          </p>
        </div>

        <main className="w-full relative flex-1 pb-20">
          {/* Subtle ambient background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-primary-container/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
          <div className="absolute top-48 right-1/4 w-[420px] h-[280px] bg-secondary-container/10 blur-[110px] rounded-full pointer-events-none -z-10"></div>

          <div className="w-full px-4 sm:px-8 xl:px-12 py-12 flex flex-col gap-12">

            {/* HERO & GRATITUDE ARCHITECTURE */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4 w-full">

              {/* Left side: Thank you message */}
              <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 w-full">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-surface-container-highest max-w-full"
                >
                  <span className="flex h-2 w-2 rounded-full bg-secondary animate-pulse shrink-0"></span>
                  <span className="font-label-sm text-xs text-secondary uppercase tracking-[0.25em] font-semibold truncate">
                    Order Confirmed
                  </span>
                  <CheckCircle2 size={15} className="text-secondary shrink-0" />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="flex flex-col gap-3 w-full"
                >
                  <h1 className="font-headline-lg text-4xl sm:text-5xl lg:text-6xl tracking-tight text-on-surface leading-tight break-words hyphens-auto">
                    Thank You, {firstName}.<br />
                    <span className="italic font-normal text-secondary block mt-2 text-3xl sm:text-4xl lg:text-5xl">Your order is confirmed.</span>
                  </h1>
                  <p className="font-body-lg text-lg text-outline max-w-2xl mt-4 leading-relaxed">
                    We have received your order <strong className="text-on-surface font-semibold tracking-wider break-all">#{order.orderNumber}</strong>. We are now processing it and will ship it out soon.
                  </p>
                </motion.div>
              </div>

              {/* Right side: Founder Note and Actions */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                {/* Founder Note Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="w-full bg-surface-container-low rounded-xl p-6 text-left relative overflow-hidden shadow-xl"
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-primary-container"></div>
                  <div className="flex flex-col gap-4 pl-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                        <CheckSquare size={20} className="text-secondary" />
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container text-outline font-label-sm text-xs uppercase tracking-wider shrink-0">
                        <Clock size={14} className="text-secondary" /> Ships in 12h
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-xs text-secondary tracking-widest uppercase font-semibold">A Note from Our Team</span>
                      <p className="font-body-md text-on-surface-variant italic mt-2 leading-relaxed">
                        “Every product we ship represents our commitment to quality. Thank you for choosing us.”
                      </p>
                      <span className="font-label-sm text-[10px] text-outline mt-3 uppercase tracking-wider">— The Terra Team</span>
                    </div>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full"
                >
                  <Link
                    href="/account"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary-container hover:bg-tertiary-container text-white font-label-sm text-xs uppercase tracking-widest transition-all shadow-md rounded-lg font-semibold text-center"
                  >
                    <TrendingUp size={16} />
                    Track Order
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-xs uppercase tracking-widest transition-all rounded-lg font-semibold text-center"
                  >
                    <FileText size={16} className="text-secondary" />
                    Invoice (PDF)
                  </button>
                  <Link
                    href="/shop"
                    className="sm:col-span-2 inline-flex items-center justify-center gap-2 px-5 py-4 bg-transparent border border-surface-container-highest hover:bg-surface-container text-on-surface font-label-sm text-xs uppercase tracking-widest transition-colors font-semibold rounded-lg"
                  >
                    Return to Catalogue <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>
            </section>

            {/* ORDER DETAILS & REAL-TIME MANIFEST */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">

              {/* Left: Order Manifest & Items (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">

                {/* Manifest Header Card */}
                <div className="bg-surface-container-low rounded-xl p-6 shadow-md flex flex-col gap-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-surface-container-highest/60">
                    <div className="flex items-center gap-2">
                      <Package size={22} className="text-secondary" />
                      <span className="font-label-sm text-xs tracking-widest uppercase text-on-surface font-bold">Order Summary</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-surface-container-highest text-secondary font-label-sm text-[10px] tracking-wider uppercase font-bold">
                        Paid via {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-body-sm text-sm">
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-[10px] uppercase text-outline tracking-wider font-semibold">Order Number</span>
                      <span className="font-mono text-on-surface font-bold tracking-wider mt-1 break-all">#{order.orderNumber}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[10px] uppercase text-outline tracking-wider font-semibold">Date</span>
                      <span className="font-body-sm text-on-surface mt-1 break-words">{orderDate}</span>
                    </div>
                    <div className="flex flex-col col-span-2 sm:col-span-1">
                      <span className="font-label-sm text-[10px] uppercase text-outline tracking-wider font-semibold">Shipping Method</span>
                      <span className="font-body-sm text-secondary flex items-center gap-1.5 mt-1 font-medium">
                        <Send size={14} /> Express Air
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Ordered Mosaic */}
                <div className="flex flex-col gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="bg-surface-container-low rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-surface-container transition-colors shadow-sm overflow-hidden">
                      <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-container-lowest rounded-md overflow-hidden shrink-0 relative border border-surface-container-highest">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-container-high text-outline">
                              <Package size={24} />
                            </div>
                          )}
                          <span className="absolute top-1 left-1 bg-surface-container-highest/90 backdrop-blur-sm text-on-surface font-label-sm text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold rounded-sm">
                            Qty {item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="font-label-sm text-[10px] text-secondary tracking-widest uppercase font-semibold mb-1">Product</span>
                          <h3 className="font-headline-sm text-base sm:text-lg text-on-surface font-semibold leading-snug truncate">{item.name}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 sm:mt-1.5 text-outline font-body-sm text-xs">
                            <span className="truncate">Ref: {item.productId.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right self-start sm:self-center shrink-0 mt-2 sm:mt-0">
                        <span className="font-mono text-lg sm:text-xl text-on-surface font-semibold">₹{item.price.toLocaleString('en-IN')}</span>
                        <span className="block font-label-sm text-[10px] text-outline uppercase tracking-wider mt-0.5">Incl. GST</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bespoke Inscribed Gift Box Included (Luxury touch) */}
                <div className="bg-surface-container-high rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-md bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                      <Gift size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[10px] text-secondary uppercase tracking-widest font-bold">Free Gift</span>
                      <p className="font-body-md text-on-surface font-medium mt-0.5">Complimentary Gift Box included with your order</p>
                    </div>
                  </div>
                  <span className="font-label-sm text-xs text-secondary uppercase tracking-wider font-bold shrink-0 bg-surface-container-lowest px-3 py-1 rounded-md">Free</span>
                </div>

                {/* Financial Breakdown Sheet */}
                <div className="bg-surface-container-low rounded-xl p-6 flex flex-col gap-3 font-body-sm text-sm">
                  <div className="flex justify-between text-outline">
                    <span>Item Subtotal ({itemsCount} items)</span>
                    <span className="text-on-surface font-mono font-medium">₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discountAmount && order.discountAmount > 0 && (
                    <div className="flex justify-between text-outline">
                      <span>Discount</span>
                      <span className="text-primary font-mono font-medium">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-outline">
                    <span>Express Shipping</span>
                    {order.shipping === 0 ? (
                      <span className="text-secondary font-label-sm uppercase tracking-wider font-bold text-xs pt-0.5">Free</span>
                    ) : (
                      <span className="text-on-surface font-mono font-medium">₹{order.shipping.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-outline">
                    <span>Taxes</span>
                    <span className="text-on-surface font-mono font-medium text-xs pt-0.5">Included in total</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-surface-container-highest/60">
                    <div className="flex flex-col">
                      <span className="font-label-sm text-[11px] uppercase tracking-widest text-on-surface font-bold">Total Paid</span>
                      <span className="font-body-sm text-[11px] text-outline mt-1">{order.paymentMethod.toUpperCase()} Payment Successful</span>
                    </div>
                    <span className="font-mono text-secondary font-bold text-3xl">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Right: Dispatch Journey & Destination (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6">

                {/* Live Dispatch Tracker */}
                <div className="bg-surface-container-low rounded-xl p-6 shadow-md flex flex-col gap-5">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest/60">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-secondary" />
                      <span className="font-label-sm text-xs tracking-widest uppercase text-on-surface font-bold">Order Status</span>
                    </div>
                    <span className="font-label-sm text-[10px] text-primary uppercase font-bold tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Live Update
                    </span>
                  </div>

                  {/* Vertical Timeline Sequence */}
                  <div className="relative pl-7 flex flex-col gap-6 pt-2">
                    <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-surface-container-highest"></div>

                    {/* Step 1 */}
                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center ring-4 ring-surface-container-low">
                        <CheckCircle2 size={14} className="text-on-secondary stroke-[3px]" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-sm text-sm text-on-surface font-bold">1. Order Placed</span>
                          <span className="font-label-sm text-[10px] text-outline">Done</span>
                        </div>
                        <p className="font-body-sm text-xs text-outline mt-1">We have received your payment and order details.</p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative flex items-start gap-4">
                      <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center ring-4 ring-surface-container-low animate-pulse">
                        <ShieldCheck size={14} className="text-on-primary" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-sm text-sm text-primary font-bold">2. Processing Order</span>
                          <span className="font-label-sm text-[10px] text-secondary font-semibold">In Progress</span>
                        </div>
                        <p className="font-body-sm text-xs text-on-surface-variant mt-1">Your items are being packed and prepared for shipping.</p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative flex items-start gap-4 opacity-50">
                      <div className="absolute -left-7 top-1 w-6 h-6 rounded-full bg-surface-container-highest flex items-center justify-center ring-4 ring-surface-container-low">
                        <Send size={12} className="text-outline" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-2">
                          <span className="font-headline-sm text-sm text-on-surface font-medium">3. Ready to Ship</span>
                        </div>
                        <p className="font-body-sm text-xs text-outline mt-1">Waiting to be picked up by our delivery partner.</p>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Card */}
                  <div className="bg-surface-container rounded-lg p-4 mt-3 flex items-start gap-3 border border-surface-container-highest/30">
                    <MapPin size={20} className="text-secondary shrink-0 mt-0.5" />
                    <div className="flex flex-col font-body-sm text-sm">
                      <span className="font-label-sm text-[10px] uppercase text-outline tracking-wider font-semibold mb-1">Shipping Address</span>
                      <span className="text-on-surface font-semibold">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
                      <span className="text-outline mt-1">{order.shippingAddress.address1} {order.shippingAddress.address2}</span>
                      <span className="text-outline">{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.postalCode}</span>
                      {order.customerPhone && (
                        <span className="text-on-surface-variant font-label-sm text-[11px] mt-2 tracking-wider">
                          Ph: {order.customerPhone.slice(0, 3)}XXXXX{order.customerPhone.slice(-2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Concierge Fast Link Card */}
                <div className="bg-surface-container-low rounded-xl p-5 flex items-center justify-between gap-4 border border-surface-container-highest/40 hover:border-secondary/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-secondary shrink-0">
                      <Headset size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[15px] text-on-surface font-bold">Need Help?</span>
                      <p className="font-body-sm text-xs text-outline mt-0.5">Our support team is available 24/7.</p>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-secondary font-label-sm text-xs uppercase tracking-widest font-bold shrink-0 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Chat</span>
                  </a>
                </div>
              </div>
            </section>


          </div>
        </main>
      </div>
    </>
  );
}
