import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { products } from '@/data/products';
import { requireAdmin } from '@/lib/auth';

export async function POST() {
  try {
    // SECURITY: Require admin in production
    if (process.env.NODE_ENV === 'production') {
      const authCheck = await requireAdmin();
      if (authCheck.errorResponse) {
        return authCheck.errorResponse;
      }
    }

    await connectToDatabase();

    let createdCount = 0;
    let updatedCount = 0;

    for (const p of products) {
      const existing = await Product.findOne({ slug: p.slug });

      const productDoc = {
        slug: p.slug,
        name: p.name,
        category: p.category,
        purpose: p.purpose,
        tagline: p.tagline,
        shortDescription: p.shortDescription,
        fullDescription: p.fullDescription,
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        size: p.size,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: 100,
        isPublished: true,
        images: p.images,
        featuredImage: p.featuredImage,
        secondaryImage: p.secondaryImage,
        heroColor: p.heroColor,
        accentColor: p.accentColor,
        badge: p.badge,
        ingredientsList: p.ingredientsList,
        keyIngredients: p.keyIngredients,
        ritual: p.ritual,
        specs: p.specs,
        shippingInfo: p.shippingInfo,
        pairingProductSlug: p.pairingProductSlug,
        isBundle: p.isBundle,
      };

      if (existing) {
        // Preserve user's custom images and prices if already in the database
        if (existing.images && existing.images.length > 0 && existing.images[0]?.url) {
          productDoc.images = existing.images;
          productDoc.featuredImage = existing.featuredImage;
          productDoc.secondaryImage = existing.secondaryImage;
        }
        if (existing.price) {
          productDoc.price = existing.price;
        }
        await Product.updateOne({ slug: p.slug }, { $set: productDoc });
        updatedCount++;
      } else {
        await Product.create(productDoc);
        createdCount++;
      }
    }

    return NextResponse.json({
      message: `Database sync complete. Created ${createdCount} new products, updated ${updatedCount} existing products.`,
      createdCount,
      updatedCount,
      total: products.length,
    });
  } catch (error: any) {
    console.error('Seed products error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed products into database.' },
      { status: 500 }
    );
  }
}
