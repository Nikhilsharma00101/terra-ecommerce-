import React from 'react';
import { Metadata } from 'next';
import { JournalClientHub } from './components/JournalClientHub';

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
    site: '@terramensco',
    title: "The Terra Journal | TERRA MEN'S CO.",
    description:
      'Evidence-based skin science, beard care guides, and routine breakdowns.',
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function JournalPage() {
  return <JournalClientHub />;
}
