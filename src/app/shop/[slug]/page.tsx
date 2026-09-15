import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfoPanel } from '@/components/products/ProductInfoPanel';
import { IngredientStory } from '@/components/products/IngredientStory';
import { RitualSteps } from '@/components/products/RitualSteps';
import { ReviewSection } from '@/components/products/ReviewSection';
import { getReviewsByProduct } from '@/data/reviews';
import { ArrowRight } from 'lucide-react';
import { products as fallbackProducts } from '@/data/products';
import { Product } from '@/types';

// ISR: revalidate this page every 60 seconds
export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Pre-render the known product slugs at build time
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const dbProducts = await ProductModel.find({ isPublished: { $ne: false } })
      .select('slug')
      .lean();
    return dbProducts.map((p: any) => ({ slug: p.slug }));
  } catch {
    // Fall back to static data slugs if DB is unavailable at build time
    return fallbackProducts.map((p) => ({ slug: p.slug }));
  }
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) return { title: 'Product Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terramensco.com';
  const primaryImage = product.featuredImage || product.images?.[0]?.url || '/images/og/og-image.jpeg';
  const fullImageUrl = primaryImage.startsWith('http') ? primaryImage : `${baseUrl}${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`;
  const description = product.shortDescription || product.tagline || `Shop ${product.name} by Terra Men's Co.`;

  return {
    title: `${product.name} | TERRA MEN'S CO.`,
    description,
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | TERRA MEN'S CO.`,
      description,
      url: `${baseUrl}/shop/${product.slug}`,
      siteName: "TERRA MEN'S CO.",
      images: [
        {
          url: fullImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | TERRA MEN'S CO.`,
      description,
      images: [fullImageUrl],
    },
  };
}

// Server-side product fetcher — no spinner, no client fetch
async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    await connectToDatabase();
    const dbProduct = await ProductModel.findOne({
      $or: [{ slug }, { id: slug }, { _id: slug.length === 24 ? slug : undefined }],
      isPublished: { $ne: false },
    }).lean();
    if (dbProduct) return JSON.parse(JSON.stringify(dbProduct)) as Product;
  } catch {
    // fall through to static fallback
  }

  // Fallback to static catalog data
  const clean = slug.toLowerCase().replace(/^terra-/, '');
  const withPrefix = `terra-${clean}`;
  return (
    fallbackProducts.find(
      (p) =>
        p.slug === slug ||
        p.slug === clean ||
        p.slug === withPrefix ||
        p.id === slug ||
        p.id === clean ||
        p.id === withPrefix
    ) ?? null
  );
}

async function fetchPairingProduct(pairingSlug: string): Promise<Product | null> {
  try {
    await connectToDatabase();
    const dbProduct = await ProductModel.findOne({ slug: pairingSlug }).lean();
    if (dbProduct) return JSON.parse(JSON.stringify(dbProduct)) as Product;
  } catch {
    // fall through
  }
  return fallbackProducts.find((p) => p.slug === pairingSlug) ?? null;
}

export default async function DynamicProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    notFound();
  }

  const pairingProduct = product.pairingProductSlug
    ? await fetchPairingProduct(product.pairingProductSlug)
    : null;

  const reviews = getReviewsByProduct(product.slug);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terramensco.com';
  const primaryImage = product.featuredImage || product.images?.[0]?.url || '/images/og/og-image.jpeg';
  const productImageUrl = primaryImage.startsWith('http') ? primaryImage : `${baseUrl}${primaryImage.startsWith('/') ? '' : '/'}${primaryImage}`;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0
      ? product.images.map(img => img.url.startsWith('http') ? img.url : `${baseUrl}${img.url.startsWith('/') ? '' : '/'}${img.url}`)
      : [productImageUrl],
    description: product.shortDescription || product.fullDescription || product.tagline,
    sku: product.id || product.slug,
    mpn: product.id || product.slug,
    brand: {
      '@type': 'Brand',
      name: "TERRA MEN'S CO.",
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}/shop/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2028-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.stock !== undefined
          ? product.stock > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: "TERRA MEN'S CO.",
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || 4.9,
      reviewCount: product.reviewCount || (reviews.length > 0 ? reviews.length : 124),
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${baseUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: `${baseUrl}/shop/${product.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F9F8F5] text-[#181817] pt-6 sm:pt-8 lg:pt-10 select-none">
      {/* Schema.org Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 text-[10px] uppercase tracking-[0.25em] text-[#77736C] flex items-center flex-wrap">
        <Link href="/" className="hover:text-[#181817] transition-colors">Home</Link>
        <span className="mx-2.5 opacity-40">/</span>
        <Link href="/shop" className="hover:text-[#181817] transition-colors">Shop</Link>
        <span className="mx-2.5 opacity-40">/</span>
        <span className="text-[#181817] font-semibold truncate">{product.name}</span>
      </div>

      {/* Main PDP Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Media Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-[155px]">
            <ProductGallery
              images={
                product.images && product.images.length > 0
                  ? product.images
                  : [
                      {
                        url: product.featuredImage,
                        alt: product.name,
                        caption: product.tagline,
                      },
                    ]
              }
              productName={product.name}
            />
          </div>

          {/* Product Information Panel */}
          <div className="lg:col-span-6">
            <ProductInfoPanel product={product} />
          </div>
        </div>
      </section>

      {/* Ingredient Storytelling */}
      {product.keyIngredients && product.keyIngredients.length > 0 && (
        <IngredientStory
          ingredients={product.keyIngredients}
          productName={product.name}
        />
      )}

      {/* Application Ritual */}
      {product.ritual && product.ritual.length > 0 && (
        <RitualSteps
          steps={product.ritual}
          title={`${product.name.toUpperCase()} RITUAL`}
          subtitle="Disciplined daily application instructions."
        />
      )}

      {/* Pairing Banner */}
      {pairingProduct && (
        <section className="py-16 sm:py-20 bg-[#F4F1EB] border-t border-b border-[#E2DDD5] relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(45,68,56,0.04)_0%,_transparent_70%)] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-white border border-[#E5E0D8] p-7 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-28 h-36 sm:w-32 sm:h-40 bg-[#FAF8F5] relative shrink-0 border border-[#E5E0D8] rounded-xl overflow-hidden group p-2">
                <Image
                  src={pairingProduct.featuredImage}
                  alt={pairingProduct.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold text-[#2D4438] block mb-2">
                  Recommended Routine Pairing
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#181817] font-light">
                  Pair with {pairingProduct.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#55524D] mt-2 max-w-xl font-light leading-relaxed">
                  {pairingProduct.shortDescription}
                </p>
              </div>

              <Link
                href={`/shop/${pairingProduct.slug}`}
                className="group relative bg-[#181817] hover:bg-[#2D4438] text-white px-7 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 shrink-0 flex items-center gap-2.5 rounded-xl shadow-xs"
              >
                <span>EXPLORE COMPANION</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <ReviewSection
        reviews={reviews}
        title={`${product.name.toUpperCase()} REVIEWS`}
        subtitle="Verified client testimonials."
        hideFilters={true}
        theme="light"
      />
    </div>
  );
}
