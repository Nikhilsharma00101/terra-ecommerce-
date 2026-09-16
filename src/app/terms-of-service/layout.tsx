import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Terms of Service | TERRA MEN'S CO.",
  description:
    "Read the Terms of Service for Terra Men's Co. Understand your rights, our product policies, billing, medical disclaimers, and how we govern our platform.",
  alternates: {
    canonical: '/terms-of-service',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Terms of Service | TERRA MEN'S CO.",
    description:
      "Understand your rights and our policies. Terra Men's Co. Terms of Service — transparent, fair, and straightforward.",
    url: 'https://www.terramensco.com/terms-of-service',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "TERRA MEN'S CO. Terms of Service",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "Terms of Service | TERRA MEN'S CO.",
    description:
      "Understand your rights and our policies. Terra Men's Co. Terms of Service.",
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
