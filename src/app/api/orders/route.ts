import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import nodemailer from 'nodemailer';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to view orders.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query: any = {};

    // If admin, can see all orders or filter by status
    if (user.role === 'admin') {
      if (status && status !== 'All') {
        query.status = status;
      }
    } else {
      // Standard user can only see their own orders
      query.$or = [{ userId: user.userId }, { customerEmail: user.email.toLowerCase() }];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    // Ensure order items are populated with live DB Cloudinary product images
    const allDbProducts = await Product.find({}).lean();
    if (allDbProducts.length > 0) {
      for (const order of orders) {
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            const matchedProduct = allDbProducts.find(
              (p: any) =>
                p._id.toString() === item.productId ||
                p.slug === item.productId ||
                (item.name && p.name && p.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
                (item.name && p.slug && item.name.toLowerCase().includes(p.slug.replace('terra-', ''))) ||
                (item.name?.toLowerCase().includes('face') && p.category === 'Face') ||
                (item.name?.toLowerCase().includes('beard') && p.category === 'Beard')
            );
            if (matchedProduct) {
              const liveDbImg =
                matchedProduct.featuredImage ||
                (matchedProduct.images && matchedProduct.images.length > 0 ? matchedProduct.images[0]?.url : '') ||
                matchedProduct.secondaryImage ||
                '';
              if (liveDbImg && liveDbImg.trim() !== '') {
                item.image = liveDbImg;
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ orders, count: orders.length });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body.' },
        { status: 400 }
      );
    }

    const {
      customerEmail,
      customerName,
      customerPhone,
      items,
      paymentMethod,
      shippingAddress,
      couponCode,
    } = body;

    if (
      !customerEmail ||
      typeof customerEmail !== 'string' ||
      !customerEmail.trim() ||
      !customerName ||
      typeof customerName !== 'string' ||
      !customerName.trim() ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !shippingAddress ||
      typeof shippingAddress !== 'object' ||
      typeof shippingAddress.firstName !== 'string' ||
      !shippingAddress.firstName.trim() ||
      typeof shippingAddress.lastName !== 'string' ||
      !shippingAddress.lastName.trim() ||
      typeof shippingAddress.address1 !== 'string' ||
      !shippingAddress.address1.trim() ||
      typeof shippingAddress.city !== 'string' ||
      !shippingAddress.city.trim() ||
      typeof shippingAddress.postalCode !== 'string' ||
      !shippingAddress.postalCode.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid required order fields.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user is logged in
    const authUser = await getAuthUser();

    // Fetch authoritative prices from the database
    let calculatedSubtotal = 0;
    const validatedItems = [];
    const allDbProducts = await Product.find({}).lean();

    for (const item of items) {
      const quantity = Math.floor(item.quantity || 1);
      if (quantity < 1 || quantity > 100) {
        return NextResponse.json(
          { error: `Invalid quantity for item ${item.name || item.productId}. Quantity must be between 1 and 100.` },
          { status: 400 }
        );
      }

      const dbProduct = allDbProducts.find(
        (p: any) =>
          p._id.toString() === item.productId ||
          p.slug === item.productId
      );

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product not found: ${item.name || item.productId}. Cannot process order.` },
          { status: 400 }
        );
      }

      const price = dbProduct.price;
      calculatedSubtotal += price * quantity;

      validatedItems.push({
        productId: item.productId || item.id || item.product?.id || 'unknown',
        name: dbProduct.name,
        price: price,
        quantity: quantity,
        image:
          dbProduct.featuredImage ||
          (dbProduct.images && dbProduct.images.length > 0 ? dbProduct.images[0]?.url : '') ||
          item.image ||
          '',
      });
    }

    let discountAmount = 0;
    let appliedCoupon = '';

    if (couponCode && typeof couponCode === 'string') {
      const code = couponCode.trim().toUpperCase();
      if (code === 'TERRA10' || code === 'WELCOME10') {
        const existingOrdersCount = await Order.countDocuments({
          customerEmail: customerEmail.toLowerCase().trim()
        });
        if (existingOrdersCount > 0) {
          return NextResponse.json(
            { error: 'This coupon is only valid for your first order.' },
            { status: 400 }
          );
        }
        discountAmount = Math.round(calculatedSubtotal * 0.10);
        appliedCoupon = code;
      } else if (code === 'METHOD20') {
        discountAmount = Math.round(calculatedSubtotal * 0.20);
        appliedCoupon = code;
      } else if (code === 'TERRA100') {
        discountAmount = 100;
        appliedCoupon = code;
      }
    }

    const freeShippingThreshold = 999;
    const shippingCost = (calculatedSubtotal - discountAmount) >= freeShippingThreshold ? 0 : 75;
    const calculatedTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingCost);

    // Generate unique order number
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TR-IN-${randomDigits}`;

    const newOrder = await Order.create({
      orderNumber,
      userId: authUser?.userId ? authUser.userId : undefined,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName: customerName.trim(),
      customerPhone: typeof customerPhone === 'string' ? customerPhone.trim() : (customerPhone ? String(customerPhone).trim() : undefined),
      items: validatedItems,
      subtotal: calculatedSubtotal,
      shipping: shippingCost,
      tax: 0,
      total: calculatedTotal,
      couponCode: appliedCoupon || undefined,
      discountAmount: discountAmount,
      status: 'Processing',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod || 'upi',
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state || 'Maharashtra',
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
      },
    });

    // --- NODEMAILER ORDER CONFIRMATION ---
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) || 465,
        secure: Number(process.env.EMAIL_SERVER_PORT) === 465 || true,
        auth: {
          user: process.env.EMAIL_SERVER_USER || 'Info@terramensco.com',
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      const itemsHtml = validatedItems.map(item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #E5E0D8;">${item.name} x ${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #E5E0D8; text-align: right;">₹${item.price * item.quantity}</td>
        </tr>
      `).join('');

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Info@terramensco.com',
        to: customerEmail.toLowerCase().trim(),
        subject: `Terra Men's Co - Order Confirmation ${orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DDD8CF; background-color: #FBF9F5;">
            <h2 style="color: #181817; text-align: center;">Order Confirmed</h2>
            <p style="color: #181817;">Hi ${customerName},</p>
            <p style="color: #181817;">Thank you for your order! We're preparing it for shipment. Your order number is <strong>${orderNumber}</strong>.</p>
            
            <h3 style="color: #2D4438; margin-top: 30px; border-bottom: 1px solid #DDD8CF; padding-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; color: #181817; font-size: 14px;">
              ${itemsHtml}
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right;">Subtotal:</td>
                <td style="padding: 10px; text-align: right;">₹${calculatedSubtotal}</td>
              </tr>
              ${discountAmount > 0 ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right; color: #2D4438;">Discount (${appliedCoupon}):</td>
                <td style="padding: 10px; text-align: right; color: #2D4438;">-₹${discountAmount}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right;">Shipping:</td>
                <td style="padding: 10px; text-align: right;">${shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</td>
              </tr>
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right; font-size: 16px; border-top: 2px solid #181817;">Total:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right; font-size: 16px; border-top: 2px solid #181817;">₹${calculatedTotal}</td>
              </tr>
            </table>

            <h3 style="color: #2D4438; margin-top: 30px; border-bottom: 1px solid #DDD8CF; padding-bottom: 10px;">Shipping Details</h3>
            <p style="color: #181817; font-size: 14px; line-height: 1.6;">
              ${shippingAddress.firstName} ${shippingAddress.lastName}<br/>
              ${shippingAddress.address1} ${shippingAddress.address2 ? `<br/>${shippingAddress.address2}` : ''}<br/>
              ${shippingAddress.city}, ${shippingAddress.state || 'Maharashtra'} - ${shippingAddress.postalCode}<br/>
              ${shippingAddress.country || 'India'}
            </p>

            <hr style="border: none; border-top: 1px solid #DDD8CF; margin: 30px 0;" />
            <p style="color: #57534E; font-size: 12px; text-align: center;">If you have any questions, reply to this email or contact us at <a href="mailto:info@terramensco.com" style="color: #2D4438;">info@terramensco.com</a>.</p>
            <p style="color: #8C887B; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Terra Men's Co.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // We deliberately do not throw here, so the order still successfully completes for the user.
    }
    // --- END NODEMAILER ---

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: newOrder,
        orderNumber: newOrder.orderNumber,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}
