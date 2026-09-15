import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "About The Terra Method | Brand Philosophy & Formulation Standards",
  description:
    'Learn about Terra Men\'s Co. and The Terra Method: disciplined luxury grooming fundamentals crafted with clinically proven bio-compatibles, cold-pressed botanicals, and radical ingredient transparency.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About The Terra Method | TERRA MEN'S CO.",
    description:
      'Disciplined luxury grooming fundamentals. Two steps. No unnecessary steps, no synthetic fragrances, no compromise.',
    url: 'https://www.terramensco.com/about',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "The Terra Method — Philosophy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "About The Terra Method | TERRA MEN'S CO.",
    description:
      'Disciplined luxury grooming fundamentals. Two steps. No unnecessary steps.',
    images: ['/images/og/og-image.jpeg'],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: "About The Terra Method",
  url: 'https://www.terramensco.com/about',
  description:
    'Disciplined luxury grooming fundamentals crafted with clinically proven bio-compatibles and cold-pressed botanicals.',
  mainEntity: {
    '@type': 'Organization',
    name: "TERRA MEN'S CO.",
    url: 'https://www.terramensco.com',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {children}
    </>
  );
}
