import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HeroCinematic } from '@/components/home/HeroCinematic';
import { ProductMarquee } from '@/components/home/ProductMarquee';
import { ProductShowcase } from '@/components/home/ProductShowcase';
import { reviews } from '@/data/reviews';

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

export default function HomePage() {
  return (
    <div className="flex flex-col w-full bg-[#121212]">
      {/* 01 — Hero Visual (above fold — loads immediately) */}
      <HeroCinematic />

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
