import React from 'react';
import { Printer } from 'lucide-react';

export interface OrderData {
  orderNumber: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  items: Array<{
    productId?: string;
    slug?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  shipping: number;
  total: number;
  awbCode?: string;
  trackingNumber?: string;
  courierName?: string;
  customerGst?: string;
}

interface PrintableTaxInvoiceProps {
  order: OrderData | null;
  mode?: 'preview' | 'print' | 'both';
}

const amountToWords = (amount: number): string => {
  const num = Math.round(amount || 0);
  if (num <= 0) return 'Zero Rupees Only';
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  }

  return `${convert(num).trim()} Rupees Only`;
};

const getItemHsn = (itemName: string): string => {
  const n = (itemName || '').toLowerCase();
  // Hair/beard preparations (updated to match manufacturer's 33073090)
  if (n.includes('beard') || n.includes('oil')) return '33073090';
  // Face wash, cleansers, and other skin preparations
  return '33049990';
};

const resolveOrderItemImage = (
  item: any
): { image: string; category: string; productName: string } => {
  const itemName = (item?.name || '').trim();
  const normalizedName = itemName.toLowerCase();
  
  const category = normalizedName.includes('beard')
    ? 'Beard Care'
    : normalizedName.includes('face')
    ? 'Face Care'
    : 'The Routine';
  
  return { 
    image: item?.image || '/images/home/hero-products.jpeg', 
    category, 
    productName: itemName 
  };
};

export const PrintableTaxInvoice: React.FC<PrintableTaxInvoiceProps> = ({ order, mode = 'both' }) => {
  if (!order) return null;

  const orderShipping = order.shipping || 0;
  const orderGrandTotal = order.total || 0;
  const orderDiscount = order.discountAmount || 0;
  const appliedCoupon = order.couponCode || '';
  const itemsSubtotal = order.items?.reduce((acc: number, it: any) => acc + ((it.price || 0) * (it.quantity || 1)), 0) || 0;
  const totalItemsCount = order.items?.reduce((acc: number, it: any) => acc + (it.quantity || 1), 0) || 0;
  const totalTaxable = Math.round((orderGrandTotal / 1.18) * 100) / 100;
  const totalGst = Math.round((orderGrandTotal - totalTaxable) * 100) / 100;
  const cgst = Math.round((totalGst / 2) * 100) / 100;
  const sgst = Math.round((totalGst - cgst) * 100) / 100;
  const customerState = order.shippingAddress?.state || 'Delhi';
  const isDelhi = customerState.toLowerCase().includes('delhi');

  const customerName = order.customerName || (order.shippingAddress?.firstName ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}` : 'Customer');

  return (
    <>
      {(mode === 'preview' || mode === 'both') && (
        <div className="p-4 sm:p-8 bg-[#EAE5DC]/50 flex justify-center no-print">
          <div className="bg-white border border-[#DDD8CF] shadow-xl p-6 sm:p-10 max-w-4xl w-full text-black text-xs space-y-6">
            
            {/* Top Bar with Print Callout */}
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#2D4438] font-bold block">
                  Document Preview
                </span>
                <h4 className="font-serif text-xl font-bold text-black">
                  Formal Tax Invoice #{order.orderNumber}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#2D4438] hover:bg-[#181817] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Printer size={14} /> Print Now
              </button>
            </div>

            {/* Letterhead */}
            <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <img src="/images/logo/logo-dark.png" alt="Terra Mens" className="h-7 w-auto object-contain" />
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-[#181817]">TERRA MENS</h1>
                </div>
                <p className="text-[10px] tracking-widest uppercase text-[#555] font-semibold">
                  Sri Sai Enterprises
                </p>
                <p className="text-[11px] text-[#444] mt-2 leading-relaxed">
                  C-5/39, G/f, Khand-42/16, Plot No. 6, Karawal Nagar Road<br />
                  New Delhi, North East Delhi - 110094 (State Code: 07)<br />
                  <strong>GSTIN:</strong> 07ELZPS4500M1Z9 | <strong>PAN:</strong> ELZPS4500M<br />
                  <strong>Reverse Charge:</strong> No<br />
                  Email: info@terramensco.com
                </p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 text-right min-w-64 space-y-1">
                <span className="inline-block bg-[#181817] text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
                  Original For Recipient
                </span>
                <h3 className="font-bold text-sm text-black pt-1">TAX INVOICE</h3>
                <p className="text-[11px] text-gray-700">
                  <strong>Invoice No:</strong> INV-{order.orderNumber}
                </p>
                <p className="text-[11px] text-gray-700">
                  <strong>Invoice Date:</strong> {new Date(order.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN')}
                </p>
                <p className="text-[11px] text-gray-700">
                  <strong>Order No:</strong> #{order.orderNumber}
                </p>
                {(order.awbCode || order.trackingNumber) && (
                  <>
                    <p className="text-[11px] text-gray-700">
                      <strong>Courier:</strong> {order.courierName || 'Standard'}
                    </p>
                    <p className="text-[11px] text-gray-700">
                      <strong>AWB:</strong> {order.awbCode || order.trackingNumber}
                    </p>
                  </>
                )}
                <p className="text-[11px] text-gray-700">
                  <strong>Place of Supply:</strong> {customerState}
                </p>
              </div>
            </div>

            {/* Buyer & Consignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b pb-6">
              <div className="p-3 bg-gray-50/70 border border-gray-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#2D4438] block tracking-wider">
                  Billed To (Buyer)
                </span>
                <p className="font-bold text-sm text-black">{customerName}</p>
                <p className="text-gray-700 text-[11px] leading-relaxed">
                  {order.shippingAddress?.address1}
                  {order.shippingAddress?.address2 && `, ${order.shippingAddress?.address2}`}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
                  <br />
                  {order.shippingAddress?.country || 'India'}
                </p>
                <p className="text-[11px] text-gray-600 pt-1">
                  Email: <strong>{order.customerEmail || 'N/A'}</strong><br />
                  Phone: <strong>{order.customerPhone || 'N/A'}</strong>
                  {order.customerGst && <><br />GSTIN: <strong>{order.customerGst}</strong></>}
                </p>
              </div>

              <div className="p-3 bg-gray-50/70 border border-gray-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#2D4438] block tracking-wider">
                  Shipped To (Consignee)
                </span>
                <p className="font-bold text-sm text-black">
                  {order.shippingAddress?.firstName
                    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`
                    : customerName}
                </p>
                <p className="text-gray-700 text-[11px] leading-relaxed">
                  {order.shippingAddress?.address1}
                  {order.shippingAddress?.address2 && `, ${order.shippingAddress?.address2}`}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
                </p>
                <p className="text-[11px] text-gray-600 pt-1">
                  Carrier: <strong>{order.courierName || 'Standard'}</strong><br />
                  AWB / Tracking: <strong>{order.awbCode || order.trackingNumber || 'Pending Dispatch'}</strong>
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[600px] text-left border-collapse border border-gray-300 text-[11px]">
                <thead>
                  <tr className="bg-gray-100 text-gray-800 border-b border-gray-300 font-bold uppercase text-[10px]">
                    <th className="p-2 border border-gray-300 text-center w-10">#</th>
                    <th className="p-2 border border-gray-300 text-center w-14">Image</th>
                    <th className="p-2 border border-gray-300">Description of Goods</th>
                    <th className="p-2 border border-gray-300 text-center">HSN</th>
                    <th className="p-2 border border-gray-300 text-center">Qty</th>
                    <th className="p-2 border border-gray-300 text-right">Unit Rate</th>
                    <th className="p-2 border border-gray-300 text-right">Taxable Val</th>
                    <th className="p-2 border border-gray-300 text-right">GST (18%)</th>
                    <th className="p-2 border border-gray-300 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((it: any, idx: number) => {
                    const itemInfo = resolveOrderItemImage(it);
                    const gross = it.price * it.quantity;
                    const taxable = Math.round((gross / 1.18) * 100) / 100;
                    const gst = Math.round((gross - taxable) * 100) / 100;
                    return (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="p-2 border border-gray-200 text-center font-mono">{idx + 1}</td>
                        <td className="p-2 border border-gray-200 text-center">
                          <div className="w-10 h-10 border border-gray-200 bg-gray-50 overflow-hidden mx-auto">
                            <img
                              src={itemInfo.image}
                              alt={it.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                        <td className="p-2 border border-gray-200 font-medium">
                          <span className="font-serif font-bold text-black text-xs block">{it.name}</span>
                          <span className="text-[10px] text-gray-500">{itemInfo.category}</span>
                        </td>
                        <td className="p-2 border border-gray-200 text-center font-mono text-[10px]">
                          {getItemHsn(it.name)}
                        </td>
                        <td className="p-2 border border-gray-200 text-center font-bold">{it.quantity}</td>
                        <td className="p-2 border border-gray-200 text-right font-mono">₹{it.price}</td>
                        <td className="p-2 border border-gray-200 text-right font-mono">₹{taxable}</td>
                        <td className="p-2 border border-gray-200 text-right font-mono">₹{gst}</td>
                        <td className="p-2 border border-gray-200 text-right font-bold font-mono">₹{gross}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 border border-gray-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-700 block">
                    Amount in Words:
                  </span>
                  <p className="font-serif italic font-bold text-black text-xs">
                    INR {amountToWords(orderGrandTotal)}
                  </p>
                </div>

                <div className="p-3 bg-gray-50 border border-gray-200 space-y-1 text-[11px] text-gray-600">
                  <p><strong>Payment Mode:</strong> {order.paymentMethod || 'Prepaid / Online UPI'}</p>
                  <p><strong>Payment Status:</strong> {order.paymentStatus === 'Paid' ? 'PAID IN FULL' : 'PENDING ON DELIVERY'}</p>
                  <p><strong>Total Items:</strong> {totalItemsCount} units</p>
                </div>
              </div>

              <div className="border border-gray-200 divide-y divide-gray-200 text-[11px]">
                <div className="flex justify-between p-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-mono">₹{itemsSubtotal}</span>
                </div>
                {orderDiscount > 0 && (
                  <div className="flex justify-between p-2 text-emerald-700">
                    <span className="text-gray-600 font-medium">Discount {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                    <span className="font-mono font-medium">- ₹{orderDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between p-2">
                  <span className="text-gray-600">Shipping & Handling</span>
                  <span className="font-mono">
                    {orderShipping === 0 ? 'FREE' : `₹${orderShipping}`}
                  </span>
                </div>
                <div className="flex justify-between p-2 border-t border-gray-300">
                  <span className="text-gray-800 font-medium">Total Taxable Value</span>
                  <span className="font-mono font-medium">₹{totalTaxable}</span>
                </div>
                {isDelhi ? (
                  <>
                    <div className="flex justify-between p-2">
                      <span className="text-gray-600">CGST (9.00%)</span>
                      <span className="font-mono">₹{cgst}</span>
                    </div>
                    <div className="flex justify-between p-2">
                      <span className="text-gray-600">SGST (9.00%)</span>
                      <span className="font-mono">₹{sgst}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between p-2">
                    <span className="text-gray-600">IGST (18.00%)</span>
                    <span className="font-mono">₹{totalGst}</span>
                  </div>
                )}
                <div className="flex justify-between p-3 bg-gray-100 font-bold text-sm text-black">
                  <span>Grand Total</span>
                  <span className="font-mono text-base">₹{orderGrandTotal}</span>
                </div>
              </div>
            </div>

            {/* Terms and Signatory */}
            <div className="pt-6 border-t border-gray-200 flex flex-wrap justify-between items-end gap-6 text-[10px] text-gray-600">
              <div className="max-w-md space-y-1">
                <p className="font-bold text-gray-800 uppercase">Declaration & Terms:</p>
                <p>1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</p>
                <p>2. Due to the cosmetic nature of our products, we do not accept returns or exchanges.</p>
                <p>3. This is an electronically generated and authenticated computer document.</p>
              </div>
              <div className="text-center p-3 border border-gray-300 min-w-56 bg-gray-50/50">
                <p className="text-[10px] text-gray-500 mb-6">For SRI SAI ENTERPRISES</p>
                <div className="border-t border-dashed border-gray-400 pt-1 font-bold text-black">
                  Authorized Signatory
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {(mode === 'print' || mode === 'both') && (
        <div id="printable-tax-invoice" className="hidden print:block p-8 bg-white text-black font-sans">
        {/* Header Letterhead */}
        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <img src="/images/logo/logo-dark.png" alt="Terra Mens" className="h-7 w-auto object-contain" />
              <h1 className="font-serif text-3xl font-bold tracking-tight text-black">TERRA MENS</h1>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-gray-800 font-bold">
              Sri Sai Enterprises
            </p>
            <p className="text-xs text-gray-700 mt-1 leading-snug">
              C-5/39, G/f, Khand-42/16, Plot No. 6, Karawal Nagar Road<br />
              New Delhi, North East Delhi - 110094 (State Code: 07)<br />
              <strong>GSTIN:</strong> 07ELZPS4500M1Z9 | <strong>PAN:</strong> ELZPS4500M<br />
              <strong>Reverse Charge:</strong> No<br />
              Email: info@terramensco.com
            </p>
          </div>
          <div className="text-right border border-gray-400 p-2.5 bg-gray-50 min-w-56 text-xs space-y-0.5">
            <span className="inline-block bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
              Tax Invoice
            </span>
            <p className="pt-1"><strong>Invoice No:</strong> INV-{order.orderNumber}</p>
            <p><strong>Invoice Date:</strong> {new Date(order.createdAt || '2024-01-01T00:00:00.000Z').toLocaleDateString('en-IN')}</p>
            <p><strong>Order ID:</strong> #{order.orderNumber}</p>
            {(order.awbCode || order.trackingNumber) && (
              <>
                <p><strong>Courier:</strong> {order.courierName || 'Standard'}</p>
                <p><strong>AWB:</strong> {order.awbCode || order.trackingNumber}</p>
              </>
            )}
            <p><strong>Place of Supply:</strong> {customerState}</p>
          </div>
        </div>

        {/* Billed To and Shipped To */}
        <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3 mb-5 text-xs">
          <div className="pr-3 border-r border-gray-300 space-y-1">
            <p className="font-bold text-[10px] uppercase tracking-wider text-gray-600">Billed To (Buyer):</p>
            <p className="font-bold text-sm text-black">{customerName}</p>
            <p className="text-gray-700 leading-snug">
              {order.shippingAddress?.address1}
              {order.shippingAddress?.address2 && `, ${order.shippingAddress?.address2}`}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}<br />
              {order.shippingAddress?.country || 'India'}
            </p>
            <p className="text-gray-600 pt-1">
              Email: <strong>{order.customerEmail || 'N/A'}</strong> | Phone: <strong>{order.customerPhone || 'N/A'}</strong>
              {order.customerGst && <><br />GSTIN: <strong>{order.customerGst}</strong></>}
            </p>
          </div>

          <div className="pl-3 space-y-1">
            <p className="font-bold text-[10px] uppercase tracking-wider text-gray-600">Shipped To (Consignee):</p>
            <p className="font-bold text-sm text-black">
              {order.shippingAddress?.firstName
                ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName || ''}`
                : customerName}
            </p>
            <p className="text-gray-700 leading-snug">
              {order.shippingAddress?.address1}
              {order.shippingAddress?.address2 && `, ${order.shippingAddress?.address2}`}<br />
              {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
            </p>
            <p className="text-gray-600 pt-1">
              Dispatch Carrier: <strong>{order.courierName || 'Standard'}</strong><br />
              AWB Tracking: <strong>{order.awbCode || order.trackingNumber || 'Pending Dispatch'}</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <table className="w-full border-collapse border border-gray-400 text-xs mb-5">
          <thead>
            <tr className="bg-gray-100 text-black border-b border-gray-400 font-bold uppercase text-[10px]">
              <th className="p-2 border border-gray-400 text-center w-8">#</th>
              <th className="p-2 border border-gray-400 text-center w-14">Image</th>
              <th className="p-2 border border-gray-400 text-left">Item Description</th>
              <th className="p-2 border border-gray-400 text-center">HSN</th>
              <th className="p-2 border border-gray-400 text-center w-12">Qty</th>
              <th className="p-2 border border-gray-400 text-right">Unit Rate</th>
              <th className="p-2 border border-gray-400 text-right">Taxable Val</th>
              <th className="p-2 border border-gray-400 text-right">GST (18%)</th>
              <th className="p-2 border border-gray-400 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((it: any, idx: number) => {
              const itemInfo = resolveOrderItemImage(it);
              const gross = it.price * it.quantity;
              const taxable = Math.round((gross / 1.18) * 100) / 100;
              const gst = Math.round((gross - taxable) * 100) / 100;
              return (
                <tr key={idx} className="border-b border-gray-300">
                  <td className="p-2 border border-gray-300 text-center font-mono">{idx + 1}</td>
                  <td className="p-1 border border-gray-300 text-center">
                    <div className="w-10 h-10 border border-gray-300 bg-gray-100 overflow-hidden mx-auto">
                      <img
                        src={itemInfo.image}
                        alt={it.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-2 border border-gray-300">
                    <span className="font-bold text-black block">{it.name}</span>
                    <span className="text-[10px] text-gray-600">{itemInfo.category}</span>
                  </td>
                  <td className="p-2 border border-gray-300 text-center font-mono text-[10px]">
                    {getItemHsn(it.name)}
                  </td>
                  <td className="p-2 border border-gray-300 text-center font-bold">{it.quantity}</td>
                  <td className="p-2 border border-gray-300 text-right font-mono">₹{it.price}</td>
                  <td className="p-2 border border-gray-300 text-right font-mono">₹{taxable}</td>
                  <td className="p-2 border border-gray-300 text-right font-mono">₹{gst}</td>
                  <td className="p-2 border border-gray-300 text-right font-bold font-mono">₹{gross}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Calculations and Words */}
        <div className="grid grid-cols-2 gap-4 border border-gray-300 p-3 mb-6 text-xs">
          <div className="space-y-3">
            <div className="p-2 bg-gray-50 border border-gray-200">
              <p className="text-[10px] uppercase font-bold text-gray-600">Amount in Words:</p>
              <p className="font-serif italic font-bold text-black text-xs pt-0.5">
                INR {amountToWords(orderGrandTotal)}
              </p>
            </div>

            <div className="text-[11px] text-gray-700 space-y-1">
              <p><strong>Payment Method:</strong> {order.paymentMethod || 'Prepaid / Online UPI'}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus === 'Paid' ? 'PAID IN FULL' : order.paymentStatus === 'Failed' ? 'PAYMENT FAILED / CANCELLED' : 'CASH ON DELIVERY (PENDING)'}</p>
              <p><strong>Total Items Count:</strong> {totalItemsCount} units</p>
            </div>
          </div>

          <div className="border border-gray-300 divide-y divide-gray-300 text-xs">
            <div className="flex justify-between p-1.5">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-mono">₹{itemsSubtotal}</span>
            </div>
            {orderDiscount > 0 && (
              <div className="flex justify-between p-1.5 text-emerald-800">
                <span className="font-medium">Discount {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                <span className="font-mono font-medium">- ₹{orderDiscount}</span>
              </div>
            )}
            <div className="flex justify-between p-1.5">
              <span className="text-gray-600">Shipping Charges</span>
              <span className="font-mono">{orderShipping === 0 ? 'FREE' : `₹${orderShipping}`}</span>
            </div>
            <div className="flex justify-between p-1.5 border-t border-gray-400">
              <span className="font-medium">Total Taxable Value</span>
              <span className="font-mono font-medium">₹{totalTaxable}</span>
            </div>
            {isDelhi ? (
              <>
                <div className="flex justify-between p-1.5">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="font-mono">₹{cgst}</span>
                </div>
                <div className="flex justify-between p-1.5">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="font-mono">₹{sgst}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between p-1.5">
                <span className="text-gray-600">IGST (18%)</span>
                <span className="font-mono">₹{totalGst}</span>
              </div>
            )}
            <div className="flex justify-between p-2 bg-gray-100 font-bold text-sm text-black">
              <span>Grand Total</span>
              <span className="font-mono">₹{orderGrandTotal}</span>
            </div>
          </div>
        </div>

        {/* Terms & Authorized Signature */}
        <div className="border-t border-gray-300 pt-4 flex justify-between items-end text-[10px] text-gray-600">
          <div className="max-w-md space-y-0.5">
            <p className="font-bold text-black uppercase">Declaration:</p>
            <p>1. We declare that this invoice shows the actual price of the goods described.</p>
            <p>2. Due to the cosmetic nature of our products, we do not accept returns or exchanges.</p>
            <p>3. This is a computer-generated invoice and requires no physical signature.</p>
          </div>
          <div className="text-center p-2.5 border border-gray-400 min-w-52">
            <p className="text-[10px] text-gray-500 mb-6">For SRI SAI ENTERPRISES</p>
            <p className="border-t border-dashed border-gray-400 pt-1 font-bold text-black">
              Authorized Signatory
            </p>
          </div>
        </div>
        </div>
      )}
    </>
  );
};
