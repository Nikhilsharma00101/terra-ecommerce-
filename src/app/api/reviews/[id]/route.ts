import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { getAuthUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status, title, content, rating, author, date, location } = body;

    const updateData: any = {};
    if (status) {
      if (!['approved', 'rejected', 'pending'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status value.' },
          { status: 400 }
        );
      }
      updateData.status = status;
    }
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (author !== undefined) updateData.author = author;
    if (location !== undefined) updateData.location = location;
    if (date !== undefined) {
      if (date) {
        const [year, month, day] = date.split('-');
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        updateData.date = new Intl.DateTimeFormat('en-US', { month: 'long', day: '2-digit', year: 'numeric' }).format(d);
        updateData.createdAt = d;
      }
    }

    await connectToDatabase();

    let review = null;
    
    // First try by _id if it's a valid MongoDB ObjectId
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      review = await Review.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    }

    // Fallback to string id field
    if (!review) {
      review = await Review.findOneAndUpdate(
        { id },
        { $set: updateData },
        { new: true }
      );
    }

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found.' },
        { status: 404 }
      );
    }

    // Attempt to revalidate products page
    const productSlug = review?.productSlug || 'terra-set';
    revalidatePath(`/shop/${productSlug}`);

    return NextResponse.json(
      { message: 'Review status updated successfully.', review },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update review error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update review.' },
      { status: 500 }
    );
  }
}
