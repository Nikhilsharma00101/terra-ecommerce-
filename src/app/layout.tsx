import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://terra-ecommerce.vercel.app'),
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
  authors: [{ name: "TERRA MEN'S CO.", url: 'https://terra-ecommerce.vercel.app' }],
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
    url: 'https://terra-ecommerce.vercel.app',
    siteName: "TERRA MEN'S CO.",
    locale: 'en_US',
    images: [
      {
        url: '/images/og/og-image.jpeg',
        secureUrl: 'https://terra-ecommerce.vercel.app/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: "TERRA MEN'S CO. — Because Men Deserve Better",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
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
      '@id': 'https://terra-ecommerce.vercel.app/#organization',
      name: "TERRA MEN'S CO.",
      url: 'https://terra-ecommerce.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://terra-ecommerce.vercel.app/images/logo/logo-dark.png',
      },
      description: 'Disciplined luxury grooming fundamentals for skin and beard.',
      sameAs: ['https://www.instagram.com/terramensco'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://terra-ecommerce.vercel.app/#website',
      url: 'https://terra-ecommerce.vercel.app',
      name: "TERRA MEN'S CO.",
      publisher: {
        '@id': 'https://terra-ecommerce.vercel.app/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://terra-ecommerce.vercel.app/shop?search={search_term_string}',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col bg-[#F6F3ED] text-[#181817] font-sans antialiased selection:bg-[#2D4438] selection:text-[#F6F3ED]"
        suppressHydrationWarning
      >
        <ClientProviders initialProducts={initialProducts}>{children}</ClientProviders>
      </body>
    </html>
  );
}
