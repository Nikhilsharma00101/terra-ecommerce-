import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';
import NextTopLoader from 'nextjs-toploader';
import { GoogleAnalytics } from '@next/third-parties/google';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

export const revalidate = 60;

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#F6F3ED',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.terramensco.com'),
  title: {
    default: "TERRA MEN'S CO. | Because Men Deserve Better",
    template: "%s | TERRA MEN'S CO.",
  },
  description:
    'Disciplined luxury grooming fundamentals for skin and beard. The Terra Method: Two steps. Nothing unnecessary. Featuring Terra Face Wash and Terra Beard Oil.',
  keywords: [
    'Terra Mens Co',
    'luxury mens grooming',
    'mens skincare',
    'mens face wash',
    'mens beard oil',
    'the terra method',
    'salicylic acid face wash',
    'botanical beard oil',
    'organic grooming essentials',
  ],
  authors: [{ name: "TERRA MEN'S CO.", url: 'https://www.terramensco.com' }],
  creator: "TERRA MEN'S CO.",
  publisher: "TERRA MEN'S CO.",
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/images/logo/logo-dark.png',
    apple: '/images/logo/logo-dark.png',
  },
  openGraph: {
    title: "TERRA MEN'S CO. — Because Men Deserve Better",
    description:
      'The foundational two-step grooming method for men. Cleanse. Nourish. Nothing unnecessary.',
    type: 'website',
    url: 'https://www.terramensco.com',
    siteName: "TERRA MEN'S CO.",
    locale: 'en_US',
    images: [
      {
        url: '/images/og/og-image.jpeg',
        secureUrl: 'https://www.terramensco.com/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: "TERRA MEN'S CO. — Because Men Deserve Better",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "TERRA MEN'S CO. — Because Men Deserve Better",
    description:
      'Disciplined luxury grooming fundamentals for skin and beard. Cleanse. Nourish. Nothing unnecessary.',
    images: ['/images/og/og-image.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.terramensco.com/#organization',
      name: "TERRA MEN'S CO.",
      url: 'https://www.terramensco.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.terramensco.com/images/logo/logo-dark.png',
      },
      description: 'Disciplined luxury grooming fundamentals for skin and beard.',
      sameAs: ['https://www.instagram.com/terramensco'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.terramensco.com/#website',
      url: 'https://www.terramensco.com',
      name: "TERRA MEN'S CO.",
      publisher: {
        '@id': 'https://www.terramensco.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://www.terramensco.com/shop?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialProducts: any[] = [];
  try {
    await connectToDatabase();
    const dbProducts = await Product.find({ isPublished: { $ne: false } })
      .sort({ createdAt: -1 })
      .lean();
    if (dbProducts && dbProducts.length > 0) {
      initialProducts = JSON.parse(JSON.stringify(dbProducts));
    }
  } catch (error) {
    console.error('Failed to fetch initial products in layout:', error);
  }

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${plusJakarta.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#F6F3ED] text-[#181817] font-sans antialiased selection:bg-[#2D4438] selection:text-[#F6F3ED]"
        suppressHydrationWarning
      >
        <NextTopLoader color="crimson" showSpinner={false} />
        <ClientProviders initialProducts={initialProducts}>{children}</ClientProviders>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
      </body>
    </html>
  );
}
