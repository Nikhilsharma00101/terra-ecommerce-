import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Review } from '@/models/Review';
import { reviews as staticReviews } from '@/data/reviews';

export async function POST() {
  try {
    await connectToDatabase();

    // Clear existing reviews to prevent duplicates during seeding
    await Review.deleteMany({});

    // Map static reviews to Mongoose schema format
    const reviewsToInsert = staticReviews.map((rev) => ({
      ...rev,
      status: 'approved', // Seeded reviews are pre-approved
      email: 'seed@terramens.co', // Default dummy email for verification tracking
    }));

    // Insert all reviews
    const inserted = await Review.insertMany(reviewsToInsert);

    return NextResponse.json({
      message: 'Reviews seeded successfully',
      count: inserted.length,
      reviews: inserted,
    });
  } catch (error: any) {
    console.error('Seed reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to seed reviews', details: error.message },
      { status: 500 }
    );
  }
}
