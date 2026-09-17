import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { Order } from '@/models/Order';
import { getAuthUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productSlug = searchParams.get('productSlug');
    const status = searchParams.get('status');
    const finalStatus = status !== null ? status : 'approved';

    await connectToDatabase();

    const query: any = {};
    if (productSlug && productSlug !== 'all') {
      query.productSlug = productSlug;
    }
    
    // Only return approved reviews to the public, unless explicitly asked otherwise (for admin)
    if (finalStatus && finalStatus !== 'all' && finalStatus !== '') {
      query.status = finalStatus;
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews.' },
      { status: 500 }
    );
  }
}

  export async function POST(req: NextRequest) {
    try {
      const authUser = await getAuthUser();
      if (!authUser) {
        return NextResponse.json(
          { error: 'Please sign in to submit a review.' },
          { status: 401 }
        );
      }
  
      const body = await req.json();
      const { author, email, rating, title, content, productName, productSlug, skinType, location } = body;
  
      if (!author || !rating || !title || !content || !productSlug || !productName) {
        return NextResponse.json(
          { error: 'Missing required review fields.' },
          { status: 400 }
        );
      }
  
      await connectToDatabase();
  
      // Verify that the user has a "Delivered" order for this product
      const userOrders = await Order.find({
        $or: [{ userId: authUser.userId }, { customerEmail: authUser.email.toLowerCase() }],
        status: 'Delivered',
      });
  
      let hasPurchased = false;
      for (const order of userOrders) {
        if (order.items && order.items.some((item: any) => item.productId === productSlug || item.name === productName)) {
          hasPurchased = true;
          break;
        }
      }
  
      if (!hasPurchased) {
        return NextResponse.json(
          { error: 'You can only review products that have been delivered to you.' },
          { status: 403 }
        );
      }
  
      const initials = author
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
  
      const newReview = await Review.create({
        id: `rev-user-${Date.now()}`,
        author,
        email: authUser.email,
        location: location || 'Verified Practitioner',
        rating: Number(rating),
        date: new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(new Date()),
        title,
        content,
        verified: true, // We already verified the purchase!
        productName,
        productSlug,
        helpfulCount: 0,
        skinType: skinType || 'Not Specified',
        avatarInitials: initials || 'TP',
        status: 'pending', // High-end ecommerce flow: reviews must be approved
      });

    // We don't need to revalidate yet because it's pending, but it's good practice.
    revalidatePath(`/shop/${productSlug}`);

    return NextResponse.json(
      { message: 'Review submitted successfully. Pending verification.', review: newReview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Submit review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review.' },
      { status: 500 }
    );
  }
}
