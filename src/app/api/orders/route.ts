import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationHtml } from '@/lib/email/templates';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { sendAdminTelegramNotification } from '@/lib/telegram';

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

    const query: any = {};

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

/**
 * Creates a new order.
 * Flow:
 * 1. Validates the request payload (required fields, lengths).
 * 2. Enforces authentication (`getAuthUser`).
 * 3. Fetches authoritative prices and stock from the database (prevents client-side price manipulation).
 * 4. Checks stock availability for requested quantities.
 * 5. Applies coupons (e.g. WELCOME10) and calculates final totals (subtotal, shipping, discounts).
 * 6. Performs an idempotency check to prevent duplicate orders within a 60-second window.
 * 7. Enforces COD limits (maximum amount, maximum pending orders).
 * 8. Saves the order in the database and initiates Razorpay integration if applicable.
 * 
 * @param {NextRequest} req - The incoming HTTP request.
 * @returns {NextResponse} JSON response with the order details or an error message.
 */
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
          { error: `Invalid quantity for item. Quantity must be between 1 and 100.` },
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
          { error: 'One or more products could not be found. Please refresh and try again.' },
          { status: 400 }
        );
      }

      if (dbProduct.stock < quantity) {
        return NextResponse.json(
          { error: `Product "${dbProduct.name}" is out of stock or does not have enough quantity available.` },
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
      if (code === 'WELCOME10') {
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
      }
    }

    const freeShippingThreshold = 0;
    const shippingCost = (calculatedSubtotal - discountAmount) >= freeShippingThreshold ? 0 : 75;
    const calculatedTotal = Math.max(0, calculatedSubtotal - discountAmount + shippingCost);

    // H-3: Generate unique order number using cryptographically secure random bytes
    const generateShortId = (length: number) => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const bytes = crypto.randomBytes(length);
      return Array.from(bytes, (b) => chars[b % chars.length]).join('');
    };

    // Retry loop for the (rare) collision case
    let orderNumber = '';
    let orderAttempts = 0;
    do {
      orderNumber = `TR-${generateShortId(8)}`;
      orderAttempts++;
    } while ((await Order.exists({ orderNumber })) && orderAttempts < 5);

    if (orderAttempts >= 5) {
      return NextResponse.json(
        { error: 'Unable to generate a unique order number. Please try again.' },
        { status: 500 }
      );
    }

    // I-1: Idempotency check — prevent duplicate orders within 60s window
    const recentDuplicate = await Order.findOne({
      customerEmail: customerEmail.toLowerCase().trim(),
      total: calculatedTotal,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });
    if (recentDuplicate) {
      return NextResponse.json(
        {
          message: 'Order already placed.',
          orderNumber: recentDuplicate.orderNumber,
          razorpayOrderId: recentDuplicate.razorpayOrderId || null,
          amount: Math.round(recentDuplicate.total * 100),
          currency: 'INR',
        },
        { status: 200 }
      );
    }

    // M-4: COD fraud protection — limit pending COD orders
    if (paymentMethod === 'cod') {
      const pendingCodOrders = await Order.countDocuments({
        customerEmail: customerEmail.toLowerCase().trim(),
        paymentMethod: 'cod',
        status: { $in: ['Confirmation', 'Packed', 'Dispatched', 'Out for delivery'] },
      });
      if (pendingCodOrders >= 2) {
        return NextResponse.json(
          { error: 'You already have pending Cash on Delivery orders. Please wait for them to be delivered before placing a new COD order.' },
          { status: 400 }
        );
      }

      // Cap COD order amount
      if (calculatedTotal > 5000) {
        return NextResponse.json(
          { error: 'Cash on Delivery is available for orders up to ₹5,000. Please use online payment for higher amounts.' },
          { status: 400 }
        );
      }
    }

    // L-2: Validate input lengths
    const maxFieldLength = 500;
    const maxNameLength = 100;
    if (
      customerName.trim().length > maxNameLength ||
      customerEmail.trim().length > maxNameLength ||
      (shippingAddress.address1 && shippingAddress.address1.length > maxFieldLength) ||
      (shippingAddress.address2 && shippingAddress.address2.length > maxFieldLength) ||
      (shippingAddress.city && shippingAddress.city.length > maxNameLength) ||
      (shippingAddress.firstName && shippingAddress.firstName.length > maxNameLength) ||
      (shippingAddress.lastName && shippingAddress.lastName.length > maxNameLength)
    ) {
      return NextResponse.json(
        { error: 'One or more fields exceed the maximum allowed length.' },
        { status: 400 }
      );
    }

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
      status: 'Confirmation',
      paymentStatus: 'Pending',
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

    let razorpayOrderId = null;

    // For COD, decrement stock immediately. For Razorpay, stock is decremented upon payment verification.
    if (paymentMethod === 'cod') {
      const bulkOperations = validatedItems.map((item) => ({
        updateOne: {
          filter: {
            $or: [
              { _id: item.productId.length === 24 ? item.productId : null },
              { slug: item.productId }
            ]
          },
          update: { $inc: { stock: -item.quantity } },
        },
      }));

      // Clean up invalid object ids from filter just to be safe
      bulkOperations.forEach(op => {
        if (!op.updateOne.filter.$or[0]._id) {
          op.updateOne.filter.$or.shift();
        }
      });

      if (bulkOperations.length > 0) {
        await Product.bulkWrite(bulkOperations);
      }
    }

    if (paymentMethod !== 'cod') {
      const key_id = (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '').trim();
      const key_secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

      if (!key_id || !key_secret) {
        throw new Error('Razorpay keys are missing.');
      }

      const razorpay = new Razorpay({ key_id, key_secret });

      const rzpOrder = await razorpay.orders.create({
        amount: Math.round(calculatedTotal * 100),
        currency: 'INR',
        receipt: newOrder._id.toString(),
      });

      if (!rzpOrder) {
        throw new Error('Failed to create Razorpay Order.');
      }

      razorpayOrderId = rzpOrder.id;
      newOrder.razorpayOrderId = razorpayOrderId;
      await newOrder.save();
    }

    // --- NODEMAILER ORDER CONFIRMATION ---
    // Only send email immediately if it's Cash on Delivery.
    // For Razorpay, we send the email from the verify/webhook endpoints AFTER payment is confirmed.
    if (paymentMethod === 'cod') {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: Number(process.env.EMAIL_SERVER_PORT) || 465,
          secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
          auth: {
            user: process.env.EMAIL_SERVER_USER || 'Info@terramensco.com',
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_FROM || 'Info@terramensco.com',
          to: customerEmail.toLowerCase().trim(),
          subject: `Terra Men's Co - Order Confirmation ${orderNumber}`,
          html: generateOrderConfirmationHtml({
            orderNumber,
            customerName,
            customerEmail: customerEmail.toLowerCase().trim(),
            items: validatedItems,
            subtotal: calculatedSubtotal,
            discountAmount,
            couponCode: appliedCoupon,
            shipping: shippingCost,
            total: calculatedTotal,
            shippingAddress: {
              firstName: shippingAddress.firstName,
              lastName: shippingAddress.lastName || '',
              address1: shippingAddress.address1,
              address2: shippingAddress.address2,
              city: shippingAddress.city,
              state: shippingAddress.state,
              postalCode: shippingAddress.postalCode
            },
            paymentMethod: 'cod'
          }, false),
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
        // We deliberately do not throw here, so the order still successfully completes for the user.
      }

      // Send Telegram notification to Admin
      await sendAdminTelegramNotification(newOrder);
    } // End if (paymentMethod === 'cod')

    return NextResponse.json(
      {
        message: 'Order created successfully',
        orderNumber: newOrder.orderNumber,
        razorpayOrderId: razorpayOrderId,
        amount: Math.round(calculatedTotal * 100),
        currency: 'INR',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while placing your order. Please try again.' },
      { status: 500 }
    );
  }
}
