import React from 'react';
import { ReviewSection } from '@/components/products/ReviewSection';
import { connectToDatabase } from '@/lib/mongodb';
import { Review as ReviewModel } from '@/models/Review';
import { Review } from '@/types';

async function fetchAllReviews(): Promise<Review[]> {
  try {
    await connectToDatabase();
    const dbReviews = await ReviewModel.find({ status: 'approved' }).sort({ createdAt: -1 }).lean();
    return dbReviews.map((r: any) => ({
      ...r,
      _id: r._id.toString(),
      createdAt: r.createdAt?.toISOString(),
      updatedAt: r.updatedAt?.toISOString()
    })) as Review[];
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return [];
  }
}

export async function ReviewSectionWrapper() {
  const reviews = await fetchAllReviews();
  
  return (
    <ReviewSection
      reviews={reviews}
      title="What Our Customers Say"
      subtitle="Real feedback from guys using our products every day."
    />
  );
}
