import React from 'react';

// Define the shape based on the MongoDB Order schema used in the app
export interface OrderData {
  orderNumber: string;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
  };
  customerPhone?: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  discountAmount?: number;
  shipping: number;
  total: number;
}

interface PrintableTaxInvoiceProps {
  order: OrderData | null;
}

export const PrintableTaxInvoice: React.FC<PrintableTaxInvoiceProps> = ({ order }) => {
  if (!order) return null;

  const orderDate = new Date(order.createdAt || '2024-01-01').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
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
  );
};
