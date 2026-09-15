import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { ShopFilters } from '@/components/products/ShopFilters';
import { products as fallbackProducts } from '@/data/products';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All Formulations | TERRA MEN'S CO.",
  description:
    'Browse the full Terra Men\'s Co. grooming catalog. Pure botanical face wash and beard oil — no fillers, no nonsense.',
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: "Shop All Formulations | TERRA MEN'S CO.",
    description:
      'Browse the full Terra Men\'s Co. grooming catalog. Pure botanical face wash and beard oil — no fillers, no nonsense.',
    url: 'https://www.terramensco.com/shop',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "TERRA MEN'S CO. Shop Collection",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Shop All Formulations | TERRA MEN'S CO.",
    description:
      'Browse the full Terra Men\'s Co. grooming catalog. Pure botanical face wash and beard oil — no fillers, no nonsense.',
    images: ['/images/og/og-image.jpeg'],
  },
};

async function fetchAllProducts(): Promise<Product[]> {
  try {
    await connectToDatabase();
    const dbProducts = await ProductModel.find({ isPublished: { $ne: false } })
      .sort({ createdAt: -1 })
      .lean();
    if (dbProducts && dbProducts.length > 0) {
      return JSON.parse(JSON.stringify(dbProducts)) as Product[];
    }
  } catch {
    // fall through to static fallback
  }
  return fallbackProducts;
}

export default async function ShopPage() {
  const allProducts = await fetchAllProducts();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terramensco.com';

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: "Shop All Formulations | TERRA MEN'S CO.",
    url: `${baseUrl}/shop`,
    description: 'Browse the full Terra Men\'s Co. grooming catalog. Pure botanical face wash and beard oil.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: allProducts.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/shop/${p.slug}`,
        name: p.name,
      })),
    },
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] text-[#181817] pt-4 sm:pt-6 lg:pt-8 pb-20 select-none">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#77736C] mb-6 sm:mb-8">
          <Link href="/" className="hover:text-[#181817] transition-colors">
            Home
          </Link>
          <span className="opacity-40">/</span>
          <span className="text-[#181817] font-semibold">Formulations</span>
        </div>

        {/* Interactive filters + product grid (client component) */}
        <ShopFilters products={allProducts} />

        {/* Brand Promise */}
        <div className="mt-16 sm:mt-20 p-8 sm:p-12 bg-white border border-[#E5E0D8] rounded-3xl text-center max-w-3xl mx-auto space-y-3 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D4438]/8 border border-[#2D4438]/15 mb-1">
            <CheckCircle2 size={12} className="text-[#2D4438]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4438]">
              THE TERRA FORMULATION STANDARD
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium leading-snug">
            Natural Botanicals. Clean Formulas. Honest Results.
          </h3>
          <p className="text-xs sm:text-sm text-[#55524D] leading-relaxed max-w-xl mx-auto font-light">
            Formulated without sulfates, parabens, synthetic fragrances, or mineral oil. Every batch is manufactured with cold-pressed integrity to withstand Indian heat, pollution, and humidity.
          </p>
          <div className="pt-2">
            <Link
              href="/about"
              className="text-xs font-semibold uppercase tracking-wider text-[#2D4438] hover:text-[#181817] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Learn More About Our Standards</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
