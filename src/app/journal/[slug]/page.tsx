import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticleBySlug, journalArticles } from '@/data/journal';
import { JournalArticleClient } from './JournalArticleClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static routes at build time for fast delivery and instant indexing
export async function generateStaticParams() {
  return journalArticles.map((article) => ({
    slug: article.slug,
  }));
}

// Dynamic Server Metadata for SEO and Social Sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found | The Terra Journal' };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://terra-ecommerce.vercel.app';
  const coverImage = article.coverImage || '/images/og/og-image.jpeg';
  const fullCoverUrl = coverImage.startsWith('http')
    ? coverImage
    : `${baseUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`;

  const description = article.excerpt || article.subtitle || `Read ${article.title} on The Terra Journal.`;

  return {
    title: `${article.title} | The Terra Journal`,
    description,
    alternates: {
      canonical: `/journal/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | The Terra Journal`,
      description,
      url: `${baseUrl}/journal/${article.slug}`,
      siteName: "TERRA MEN'S CO.",
      type: 'article',
      publishedTime: article.date,
      authors: [article.author || 'Terra Editorial'],
      tags: article.tags,
      images: [
        {
          url: fullCoverUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | The Terra Journal`,
      description,
      images: [fullCoverUrl],
    },
  };
}

export default async function JournalSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://terra-ecommerce.vercel.app';
  const coverImage = article.coverImage || '/images/og/og-image.jpeg';
  const fullCoverUrl = coverImage.startsWith('http')
    ? coverImage
    : `${baseUrl}${coverImage.startsWith('/') ? '' : '/'}${coverImage}`;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.subtitle,
    image: [fullCoverUrl],
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: article.author || "TERRA MEN'S CO.",
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: "TERRA MEN'S CO.",
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo/logo-dark.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/journal/${article.slug}`,
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
        name: 'Journal',
        item: `${baseUrl}/journal`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${baseUrl}/journal/${article.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <JournalArticleClient slug={slug} />
    </>
  );
}
