export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discountAmount?: number;
  couponCode?: string;
  shipping: number;
  total: number;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state?: string;
    postalCode: string;
  };
  paymentMethod: string;
}

const escapeHtml = (str: string) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const generateOrderConfirmationHtml = (order: OrderEmailData, isPaymentSuccess = false): string => {
  const safeCustomerName = escapeHtml(order.customerName.trim());
  
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #E5E0D8; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #111111;">
        <strong>${escapeHtml(item.name)}</strong><br/>
        <span style="color: #666666; font-size: 12px;">Qty: ${item.quantity}</span>
      </td>
      <td style="padding: 16px 0; border-bottom: 1px solid #E5E0D8; text-align: right; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #111111;">
        ₹${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  let addressHtml = '';
  if (order.shippingAddress) {
    const s = order.shippingAddress;
    const safeAddress1 = escapeHtml(s.address1);
    const safeAddress2 = s.address2 ? escapeHtml(s.address2) : '';
    const safeCity = escapeHtml(s.city);
    const safeState = s.state ? escapeHtml(s.state) : '';
    const safePincode = escapeHtml(s.postalCode || '');
    
    addressHtml = `
      <div style="margin-top: 30px; padding: 20px; background-color: #F9F9F9; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #111111;">Shipping Address</h3>
        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
          ${escapeHtml(s.firstName)} ${escapeHtml(s.lastName)}<br/>
          ${safeAddress1}<br/>
          ${safeAddress2 ? safeAddress2 + '<br/>' : ''}
          ${safeCity}, ${safeState} ${safePincode}
        </p>
      </div>
    `;
  }

  const title = isPaymentSuccess ? 'Payment Successful' : 'Order Confirmed';
  const subtitle = isPaymentSuccess 
    ? `We have successfully received your payment of ₹${order.total.toFixed(2)}. Your order is now being prepared for shipment.` 
    : `Thank you for your order! We're preparing it for shipment.`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Terra Men's Co. Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F4F4;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F4F4F4; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #E5E0D8; border-radius: 8px; overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background-color: #111111; padding: 40px 20px;">
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 0.3em; color: #FFFFFF; text-transform: uppercase;">
                TERRA<sup style="font-family: sans-serif; font-size: 0.5em;">&trade;</sup>
              </h1>
              <p style="margin: 10px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; letter-spacing: 0.2em; color: #A88B68; text-transform: uppercase;">
                Men's Co.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; font-family: 'Georgia', serif; font-size: 28px; color: #111111; font-weight: normal; text-align: center;">${title}</h2>
              <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 15px; color: #666666; line-height: 1.6; text-align: center;">
                Hi ${safeCustomerName},<br/><br/>
                ${subtitle}<br/>
                Your order number is <strong style="color: #111111;">${order.orderNumber}</strong>.
              </p>

              <h3 style="margin: 0 0 15px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #111111; border-bottom: 2px solid #111111; padding-bottom: 10px;">Order Summary</h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${itemsHtml}
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #666666;">Subtotal</td>
                  <td align="right" style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #111111;">₹${order.subtotal.toFixed(2)}</td>
                </tr>
                ${order.discountAmount && order.discountAmount > 0 ? `
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #9B111E;">Discount (${escapeHtml(order.couponCode || '')})</td>
                  <td align="right" style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #9B111E;">-₹${order.discountAmount.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #666666;">Shipping</td>
                  <td align="right" style="padding: 8px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #111111;">${order.shipping === 0 ? 'Free' : `₹${order.shipping.toFixed(2)}`}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #111111; border-top: 1px solid #E5E0D8;">Total</td>
                  <td align="right" style="padding: 16px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #111111; border-top: 1px solid #E5E0D8;">₹${order.total.toFixed(2)}</td>
                </tr>
              </table>

              ${addressHtml}

              <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid #E5E0D8; text-align: center;">
                <p style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #111111; font-weight: bold;">7-Day Returns</p>
                <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.5;">
                  We accept returns within 7 days of delivery for un-opened, sealed boxes only.<br/>
                  If you have any questions, simply reply to this email.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="background-color: #111111; padding: 20px; color: #999999; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px;">
              &copy; ${new Date().getFullYear()} Terra Men's Co. All rights reserved.<br/>
              Sri Sai Enterprises, GSTIN: 07ELZPS4500M1Z9
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
