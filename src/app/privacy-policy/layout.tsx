import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: "Privacy Policy | TERRA MEN'S CO.",
  description:
    "Learn how Terra Men's Co. collects, uses, and protects your personal data. We are committed to radical transparency and strict data security.",
  alternates: {
    canonical: '/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | TERRA MEN'S CO.",
    description:
      "We are committed to radical transparency. Learn how Terra Men's Co. handles your personal data.",
    url: 'https://www.terramensco.com/privacy-policy',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "TERRA MEN'S CO. Privacy Policy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "Privacy Policy | TERRA MEN'S CO.",
    description:
      "We are committed to radical transparency. Learn how Terra Men's Co. handles your personal data.",
    images: ['/images/og/og-image.jpeg'],
  },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
