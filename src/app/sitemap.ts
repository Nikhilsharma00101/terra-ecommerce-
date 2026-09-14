import { MetadataRoute } from 'next';
import { connectToDatabase } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { products as fallbackProducts } from '@/data/products';
import { journalArticles } from '@/data/journal';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://terramens.co';
  const currentDate = new Date();

  // 1. Core static pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/journal`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Dynamic product pages
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const dbProducts = await ProductModel.find({ isPublished: { $ne: false } })
      .select('slug updatedAt')
      .lean();

    if (dbProducts && dbProducts.length > 0) {
      productEntries = dbProducts.map((p: any) => ({
        url: `${baseUrl}/shop/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : currentDate,
        changeFrequency: 'daily',
        priority: 0.85,
      }));
    }
  } catch {
    // Fallback to static catalog products if DB is unreachable during static build
    productEntries = fallbackProducts.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    }));
  }

  // If DB products were empty, ensure fallback products are in sitemap
  if (productEntries.length === 0) {
    productEntries = fallbackProducts.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    }));
  }

  // 3. Dynamic journal articles
  const journalEntries: MetadataRoute.Sitemap = journalArticles.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...productEntries, ...journalEntries];
}
