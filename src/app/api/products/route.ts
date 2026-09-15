import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { products as initialSeedProducts } from '@/data/products';

// Cache GET responses for 60 seconds, allow stale for 5 minutes while revalidating
export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const purpose = searchParams.get('purpose');
    const search = searchParams.get('search');
    const includeUnpublished = searchParams.get('all') === 'true';

    try {
      await connectToDatabase();

      // Check total products count in MongoDB
      const totalCount = await Product.countDocuments();
      if (totalCount === 0) {
        console.log('MongoDB products collection empty. Seeding initial catalog...');
        await Product.insertMany(
          initialSeedProducts.map((p) => ({
            ...p,
            isPublished: true,
          }))
        );
      }

      const query: any = {};
      if (!includeUnpublished) {
        query.isPublished = { $ne: false };
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (purpose && purpose !== 'All') {
        query.purpose = purpose;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { tagline: { $regex: search, $options: 'i' } },
        ];
      }

      const dbProducts = await Product.find(query).sort({ createdAt: -1 });

      return NextResponse.json(
        {
          products: dbProducts,
          source: 'mongodb',
          count: dbProducts.length,
        },
        {
          headers: {
            'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    } catch (dbError: any) {
      console.error('MongoDB query error:', dbError);
      return NextResponse.json(
        { error: 'Database connection failed. Please check MongoDB configuration.', products: [] },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch products', products: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Admin role check
    const authCheck = await requireAdmin();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }

    const body = await req.json();
    const {
      name,
      slug,
      category,
      purpose,
      price,
      compareAtPrice,
      size,
      tagline,
      shortDescription,
      fullDescription,
      featuredImage,
      secondaryImage,
      stock,
      badge,
      heroColor,
      accentColor,
      ingredientsList,
      keyIngredients,
      ritual,
      specs,
      shippingInfo,
      pairingProductSlug,
      isBundle,
    } = body;

    if (!name || !price || !category || !purpose) {
      return NextResponse.json(
        { error: 'Name, price, category, and purpose are required.' },
        { status: 400 }
      );
    }

    const productSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    await connectToDatabase();

    // Check slug uniqueness
    const existing = await Product.findOne({ slug: productSlug });
    if (existing) {
      return NextResponse.json(
        { error: `A product with slug '${productSlug}' already exists.` },
        { status: 409 }
      );
    }

    const newProduct = await Product.create({
      name,
      slug: productSlug,
      category,
      purpose,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      size: size || '100ml',
      tagline: tagline || '',
      shortDescription: shortDescription || '',
      fullDescription: fullDescription || '',
      featuredImage: featuredImage || (Array.isArray(body.images) && body.images[0]?.url),
      secondaryImage: secondaryImage || (Array.isArray(body.images) && body.images[1]?.url) || '/images/home/hero-campaign.jpg',
      images: Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : [
            {
              url: featuredImage,
              alt: name,
              caption: tagline || name,
            },
          ],
      stock: stock !== undefined ? Number(stock) : 100,
      isPublished: true,
      badge: badge || undefined,
      heroColor: heroColor || '#2D4438',
      accentColor: accentColor || '#3B5947',
      ingredientsList: Array.isArray(ingredientsList)
        ? ingredientsList
        : ingredientsList
        ? ingredientsList.split(',').map((s: string) => s.trim())
        : [],
      keyIngredients: keyIngredients || [],
      ritual: ritual || [],
      specs: specs || [],
      shippingInfo:
        shippingInfo ||
        'Dispatched within 24 hours. Complimentary express courier across India.',
      pairingProductSlug,
      isBundle: Boolean(isBundle),
    });

    // Revalidate paths so changes reflect immediately
    revalidatePath('/shop');
    revalidatePath('/');

    return NextResponse.json(
      { message: 'Product created successfully', product: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product.' },
      { status: 500 }
    );
  }
}
