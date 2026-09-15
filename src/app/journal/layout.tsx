import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "The Terra Journal | Men's Grooming Science & Routine Guides",
  description:
    'Evidence-based skin science, beard care guides, and routine breakdowns written by the Terra Men\'s Co. formulation team.',
  alternates: {
    canonical: '/journal',
  },
  openGraph: {
    title: "The Terra Journal | TERRA MEN'S CO.",
    description:
      'Evidence-based skin science, beard care guides, and routine breakdowns.',
    url: 'https://www.terramensco.com/journal',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "The Terra Journal",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Terra Journal | TERRA MEN'S CO.",
    description:
      'Evidence-based skin science, beard care guides, and routine breakdowns.',
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function JournalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
