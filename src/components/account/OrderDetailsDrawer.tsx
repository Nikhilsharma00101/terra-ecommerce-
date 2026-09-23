import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  MessageCircle,
  RefreshCw,
  Copy,
  Star,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Use same type as PrintableTaxInvoice
import { OrderData } from './PrintableTaxInvoice';

interface OrderDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderData | null;
  onReorderItem?: (item: any) => void;
  onReorderAll?: (items: any[]) => void;
  onPrintInvoice?: () => void;
  onLeaveReview?: (item: any) => void;
  userReviews?: any[];
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  isOpen,
  onClose,
  order,
  onReorderItem,
  onReorderAll,
  onPrintInvoice,
  onLeaveReview,
  userReviews = []
}) => {
  const [copied, setCopied] = useState(false);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!order) return null;

  const isDelivered = (order as any).status === 'Delivered';
  const isShipped = (order as any).status === 'Shipped';
  const isProcessing = (order as any).status === 'Processing';
  const trackingNumber = (order as any).trackingNumber || null;

  const handleCopyAWB = () => {
    if (trackingNumber) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappMessage = encodeURIComponent(`Hi Terra team, I need assistance with Order #${order.orderNumber}`);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1C1A]/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-[#FAF9F5] shadow-2xl z-[110] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 bg-[#FFFFFF] border-b border-[#E2E3DF]">
              <div>
                <h2 className="font-serif text-2xl text-[#1A1C1A]">Order Details</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[13px] text-[#45464C] font-mono">#{order.orderNumber}</span>
                  <span className="w-1 h-1 rounded-full bg-[#E2E3DF]" />
                  <span className="text-[12px] text-[#45464C]">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-[#45464C] hover:text-[#1A1C1A] hover:bg-[#F4F4F0] rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">

              {/* Status Banner */}
              <div className="bg-[#FFFFFF] rounded-2xl p-6 border border-[#E2E3DF] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDelivered ? 'bg-[#baebd1] text-[#3e6b57]' : isShipped ? 'bg-[#F4F4F0] text-[#1A1C1A]' : 'bg-[#E2E3DF] text-[#45464C]'}`}>
                      {isDelivered && <CheckCircle2 size={16} />}
                      {isShipped && <Truck size={16} />}
                      {isProcessing && <Clock size={16} />}
                    </div>
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-[#77736C] font-semibold block">Status</span>
                      <span className="font-medium text-[15px] text-[#1A1C1A]">{(order as any).status}</span>
                    </div>
                  </div>
                  {isDelivered && (
                    <div className="text-right">
                      <span className="text-[11px] uppercase tracking-widest text-[#77736C] font-semibold block">Delivered On</span>
                      <span className="font-medium text-[15px] text-[#1A1C1A]">
                        {new Date((order as any).updatedAt || order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="relative pt-2 pb-6">
                  <div className="absolute left-0 top-3 h-1 w-full bg-[#F4F4F0] rounded-full"></div>
                  <div 
                    className="absolute left-0 top-3 h-1 bg-[#3A6753] rounded-full"
                    style={{ width: isDelivered ? '100%' : isShipped ? '66%' : '33%' }}
                  ></div>
                  <div className="relative flex justify-between">
                    {[
                      { label: 'Placed', icon: CheckCircle2, active: true },
                      { label: 'Formulated', icon: Package, active: isShipped || isDelivered },
                      { label: 'Dispatched', icon: Truck, active: isShipped || isDelivered },
                      { label: 'Delivered', icon: MapPin, active: isDelivered }
                    ].map((step, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-2 mb-2 border-2 ${step.active ? 'bg-[#3A6753] border-[#3A6753]' : 'bg-[#FFFFFF] border-[#E2E3DF]'}`} />
                        <span className={`text-[10px] uppercase tracking-wider font-semibold absolute top-8 ${step.active ? 'text-[#1A1C1A]' : 'text-[#c6c6cd]'}`}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tracking Details if Shipped */}
                {(isShipped || isDelivered) && trackingNumber && (
                  <div className="mt-8 pt-4 border-t border-[#E2E3DF] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-widest text-[#77736C] font-semibold block mb-1">Carrier Tracking</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[14px] text-[#1A1C1A]">{trackingNumber}</span>
                        <button onClick={handleCopyAWB} className="text-[#45464C] hover:text-[#3A6753] transition-colors" title="Copy AWB">
                          {copied ? <CheckCircle2 size={14} className="text-[#3A6753]" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#F4F4F0] hover:bg-[#E2E3DF] rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 text-[#1A1C1A]">
                      Track <ExternalLink size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Destination Address */}
              <div>
                <h3 className="font-serif text-lg text-[#1A1C1A] mb-3">Delivery Destination</h3>
                <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E2E3DF] shadow-sm flex flex-col gap-1 text-[13px] text-[#45464C]">
                  <p className="font-semibold text-[#1A1C1A] text-[14px]">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                  <p>{order.shippingAddress.address1} {order.shippingAddress.address2}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                  {order.customerPhone && <p className="mt-2 pt-2 border-t border-[#F4F4F0]">Phone: {order.customerPhone}</p>}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-serif text-lg text-[#1A1C1A]">Items in Shipment</h3>
                  {onReorderAll && (
                    <button 
                      onClick={() => { onReorderAll(order.items); onClose(); }}
                      className="text-[11px] uppercase font-semibold tracking-wider text-[#3A6753] hover:text-[#2a4d3e] flex items-center gap-1"
                    >
                      <RefreshCw size={12} />
                      Reorder All
                    </button>
                  )}
                </div>
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E2E3DF] shadow-sm overflow-hidden flex flex-col divide-y divide-[#E2E3DF]">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 justify-between group">
                      <div className="flex gap-4">
                        <Link href={`/shop/${item.productId}`} onClick={onClose} className="w-16 h-20 sm:w-20 sm:h-24 bg-[#F4F4F0] rounded-xl overflow-hidden shrink-0 relative border border-[#E2E3DF]">
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                        </Link>
                        <div className="flex flex-col justify-center">
                          <Link href={`/shop/${item.productId}`} onClick={onClose} className="font-medium text-[#1A1C1A] hover:text-[#3A6753] transition-colors text-[14px] sm:text-[15px]">
                            {item.name}
                          </Link>
                          <span className="text-[13px] text-[#77736C] mt-1">Qty: {item.quantity}</span>
                          <span className="font-semibold text-[#1A1C1A] mt-2">₹{item.price.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="flex sm:flex-col gap-2 items-end justify-end mt-2 sm:mt-0">
                        {onReorderItem && (
                          <button 
                            onClick={() => { onReorderItem(item); onClose(); }}
                            className="px-3 py-1.5 sm:w-full bg-[#181817] text-[#FFFFFF] rounded-lg text-[11px] uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity whitespace-nowrap text-center"
                          >
                            Buy Again
                          </button>
                        )}
                        {isDelivered && onLeaveReview && !userReviews.some(r => r.productSlug === item.productId || r.productSlug === (item as any).slug) && (
                          <button 
                            onClick={() => { onLeaveReview(item); onClose(); }}
                            className="px-3 py-1.5 sm:w-full bg-[#FFFFFF] border border-[#E2E3DF] text-[#1A1C1A] rounded-lg text-[11px] uppercase tracking-wider font-semibold hover:bg-[#F4F4F0] transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Star size={12} />
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Ledger */}
              <div>
                <h3 className="font-serif text-lg text-[#1A1C1A] mb-3">Financial Ledger</h3>
                <div className="bg-[#FFFFFF] rounded-2xl p-5 border border-[#E2E3DF] shadow-sm flex flex-col gap-3 text-[14px]">
                  <div className="flex justify-between text-[#45464C]">
                    <span>Items Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {order.discountAmount && order.discountAmount > 0 && (
                    <div className="flex justify-between text-[#3A6753]">
                      <span className="flex items-center gap-1.5">
                        Discount {(order as any).couponCode && <span className="text-[10px] font-mono uppercase bg-[#baebd1]/40 px-1.5 py-0.5 rounded-sm">{(order as any).couponCode}</span>}
                      </span>
                      <span>-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#45464C]">
                    <span>Shipping</span>
                    <span>{order.shipping === 0 ? 'Complimentary' : `₹${order.shipping.toLocaleString('en-IN')}`}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#E2E3DF] font-semibold text-[#1A1C1A] text-[16px]">
                    <span>Grand Total</span>
                    <span>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-2 pt-3 border-t border-[#F4F4F0] flex items-center justify-between text-[12px] text-[#77736C]">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#3A6753]" />
                      <span className="uppercase tracking-wider font-semibold">{order.paymentMethod} Payment</span>
                    </div>
                    <span>{(order as any).paymentStatus}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Sticky Action Bar */}
            <div className="p-4 sm:p-6 bg-[#FFFFFF] border-t border-[#E2E3DF] flex flex-col sm:flex-row gap-3">
              <button 
                onClick={onPrintInvoice}
                className="flex-1 px-4 py-3 border border-[#E2E3DF] bg-[#FFFFFF] hover:bg-[#F4F4F0] text-[#1A1C1A] rounded-xl text-[12px] uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <FileText size={16} />
                Tax Invoice
              </button>
              <a 
                href={`https://wa.me/919999999999?text=${whatsappMessage}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 px-4 py-3 bg-[#181817] text-[#FFFFFF] rounded-xl text-[12px] uppercase tracking-wider font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Need Help?
              </a>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
