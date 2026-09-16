import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroCinematic } from '@/components/home/HeroCinematic';
import { ProductMarquee } from '@/components/home/ProductMarquee';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { connectToDatabase } from '@/lib/mongodb';
import { Review as ReviewModel } from '@/models/Review';
import { Product as ProductModel } from '@/models/Product';
import { Review } from '@/types';

// Lazy-load everything below the fold — these are NOT needed for initial paint
const BundleUpsell = dynamic(() =>
  import('@/components/home/BundleUpsell').then((m) => m.BundleUpsell)
);
const DirectOrderStrip = dynamic(() =>
  import('@/components/home/DirectOrderStrip').then((m) => m.DirectOrderStrip)
);
const ReviewSection = dynamic(() =>
  import('@/components/products/ReviewSection').then((m) => m.ReviewSection)
);

// Minimal skeleton placeholders shown while lazy chunks load
const SectionSkeleton = () => (
  <div className="w-full h-[400px] bg-[#0f0f0f] animate-pulse" aria-hidden="true" />
);

export const revalidate = 60;

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

async function fetchProducts() {
  try {
    await connectToDatabase();
    const dbProducts = await ProductModel.find({ isPublished: { $ne: false } }).lean();
    return JSON.parse(JSON.stringify(dbProducts));
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function HomePage() {
  const reviews = await fetchAllReviews();
  const products = await fetchProducts();
  
  const faceWash = products.find((p: any) => p.slug === 'terra-face-wash' || p.slug === 'face-wash' || p.category === 'Face') || products[0];
  const beardOil = products.find((p: any) => p.slug === 'terra-beard-oil' || p.slug === 'beard-oil' || p.category === 'Beard') || (products.length > 1 ? products[1] : products[0]);

  return (
    <div className="flex flex-col w-full bg-[#121212]">
      {/* 01 — Hero Visual (above fold — loads immediately) */}
      <HeroCinematic faceWash={faceWash} beardOil={beardOil} />

      {/* 01.5 — Scrolling Product Marquee */}
      <ProductMarquee />

      {/* 02 — Product Showcase */}
      <ProductShowcase />

      {/* 03 — The Hard Sell (below fold — lazy loaded) */}
      <Suspense fallback={<SectionSkeleton />}>
        <BundleUpsell />
      </Suspense>

      {/* 03.5 — Direct Dispensary Strip (below fold — lazy loaded) */}
      <Suspense fallback={<SectionSkeleton />}>
        <DirectOrderStrip />
      </Suspense>

      {/* 04 — Social Proof (below fold — lazy loaded) */}
      <Suspense fallback={<SectionSkeleton />}>
        <ReviewSection
          reviews={reviews}
          title="What Our Customers Say"
          subtitle="Real feedback from guys using our products every day."
        />
      </Suspense>
    </div>
  );
}
