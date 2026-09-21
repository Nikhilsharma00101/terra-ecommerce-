/**
 * Utility to send Telegram notifications for new orders.
 */
export async function sendAdminTelegramNotification(orderData: any) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram notification skipped: Bot Token or Chat ID missing in .env');
      return;
    }

    // Format the items list beautifully
    const itemsList = orderData.items && Array.isArray(orderData.items) 
      ? orderData.items.map((item: any) => 
          `▫️ <b>${item.name}</b>\n      └ Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}`
        ).join('\n\n')
      : 'N/A';

    let address = 'N/A';
    if (orderData.shippingAddress) {
       address = `${orderData.shippingAddress.address1}\n${orderData.shippingAddress.address2 ? orderData.shippingAddress.address2 + '\n' : ''}${orderData.shippingAddress.city}, ${orderData.shippingAddress.state || ''} - ${orderData.shippingAddress.postalCode}`;
    }

    const orderDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // Format the message using HTML parse mode for better structure
    const message = `🎉 <b>NEW ORDER RECEIVED!</b> 🎉
━━━━━━━━━━━━━━━━━━━━
<b>Order ID:</b> <code>${orderData.orderNumber}</code>
<b>Date:</b> ${orderDate}

👤 <b>CUSTOMER DETAILS</b>
━━━━━━━━━━━━━━━━━━━━
<b>Name:</b> ${orderData.customerName}
<b>Email:</b> ${orderData.customerEmail || 'N/A'}
<b>Phone:</b> ${orderData.customerPhone || 'N/A'}

🛍️ <b>ORDER SUMMARY</b>
━━━━━━━━━━━━━━━━━━━━
${itemsList}

<b>Subtotal:</b> ₹${orderData.subtotal || orderData.total}
<b>Discount:</b> -₹${orderData.discountAmount || 0} ${orderData.couponCode ? `(<i>${orderData.couponCode}</i>)` : ''}
<b>Shipping:</b> ₹${orderData.shipping || 0}
━━━━━━━━━━━━━━━━━━━━
<b>TOTAL PAID:</b> <b>₹${orderData.total}</b>

💳 <b>PAYMENT INFO</b>
━━━━━━━━━━━━━━━━━━━━
<b>Method:</b> ${orderData.paymentMethod?.toUpperCase()}${orderData.razorpayPaymentId ? `\n<b>Txn ID:</b> <code>${orderData.razorpayPaymentId}</code>` : ''}

📍 <b>SHIPPING ADDRESS</b>
━━━━━━━━━━━━━━━━━━━━
<b>${orderData.shippingAddress?.firstName || ''} ${orderData.shippingAddress?.lastName || ''}</b>
${address}
`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Telegram API failed:`, errorData);
    } else {
      console.log('Admin Telegram notification sent successfully for order:', orderData.orderNumber);
    }
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}
