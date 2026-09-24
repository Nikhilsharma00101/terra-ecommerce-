import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroCinematic } from '@/components/home/HeroCinematic';
import { ProductMarquee } from '@/components/home/ProductMarquee';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { connectToDatabase } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { ReviewSectionWrapper } from '@/components/home/ReviewSectionWrapper';

// Lazy-load everything below the fold — these are NOT needed for initial paint
const BundleUpsell = dynamic(() =>
  import('@/components/home/BundleUpsell').then((m) => m.BundleUpsell)
);
const DirectOrderStrip = dynamic(() =>
  import('@/components/home/DirectOrderStrip').then((m) => m.DirectOrderStrip)
);
const ProblemsSolved = dynamic(() =>
  import('@/components/home/ProblemsSolved').then((m) => m.ProblemsSolved)
);

// Minimal skeleton placeholders shown while lazy chunks load
const SectionSkeleton = () => (
  <div className="w-full h-[400px] bg-[#0f0f0f] animate-pulse" aria-hidden="true" />
);

export const revalidate = 60;

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
  const products = await fetchProducts();
  
  const faceWash = products.find((p: any) => p.slug === 'terra-face-wash' || p.slug === 'face-wash' || p.category === 'Face') || products[0];
  const beardOil = products.find((p: any) => p.slug === 'terra-beard-oil' || p.slug === 'beard-oil' || p.category === 'Beard') || (products.length > 1 ? products[1] : products[0]);

  return (
    <div className="flex flex-col w-full bg-[#121212]">
      {/* 01 — Hero Visual (above fold — loads immediately) */}
      <HeroCinematic faceWash={faceWash} beardOil={beardOil} />

      {/* 01.5 — Scrolling Product Marquee */}
      <ProductMarquee faceWash={faceWash} beardOil={beardOil} />

      {/* 02 — Product Showcase */}
      <ProductShowcase faceWash={faceWash} beardOil={beardOil} />

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
        <ReviewSectionWrapper />
      </Suspense>

      {/* 05 — Problems Solved */}
      <Suspense fallback={<SectionSkeleton />}>
        <ProblemsSolved />
      </Suspense>
    </div>
  );
}
