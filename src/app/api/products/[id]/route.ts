import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import { requireAdmin } from '@/lib/auth';
import { products as initialSeedProducts } from '@/data/products';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const clean = id.toLowerCase().replace(/^terra-/, '');
    const withPrefix = `terra-${clean}`;

    try {
      await connectToDatabase();

      const isMongoId = mongoose.Types.ObjectId.isValid(id);
      const query = isMongoId
        ? { _id: id }
        : {
            $or: [
              { slug: id },
              { slug: clean },
              { slug: withPrefix },
              { id: id },
              { id: clean },
              { id: withPrefix },
            ],
          };

      const product = await Product.findOne(query);

      if (product) {
        return NextResponse.json({ product, source: 'mongodb' });
      }
    } catch (err: any) {
      console.warn('MongoDB fetch error, attempting fallback:', err);
    }

    // Resilient fallback to static seed products
    const fallback = initialSeedProducts.find(
      (p) =>
        p.slug === id ||
        p.slug === clean ||
        p.slug === withPrefix ||
        p.id === id ||
        p.id === clean ||
        p.id === withPrefix
    );

    if (fallback) {
      return NextResponse.json({ product: fallback, source: 'fallback' });
    }

    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve product' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, context: RouteContext) {
  try {
    const authCheck = await requireAdmin();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }

    const { id } = await context.params;
    const body = await req.json();

    if (Array.isArray(body.images)) {
      body.secondaryImage = body.images[1]?.url || '';
      if (!body.featuredImage && body.images[0]?.url) {
        body.featuredImage = body.images[0].url;
      }
    }

    await connectToDatabase();

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { slug: id };

    const updated = await Product.findOneAndUpdate(query, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const authCheck = await requireAdmin();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }

    const { id } = await context.params;

    await connectToDatabase();

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { slug: id };

    const deleted = await Product.findOneAndDelete(query);

    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
      deletedId: deleted._id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    );
  }
}
