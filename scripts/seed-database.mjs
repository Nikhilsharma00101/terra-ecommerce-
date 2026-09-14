import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Read .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let uri = process.env.MONGODB_URI;

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('MONGODB_URI=')) {
      uri = trimmed.substring('MONGODB_URI='.length).trim();
      if ((uri.startsWith('"') && uri.endsWith('"')) || (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.slice(1, -1);
      }
      break;
    }
  }
}

async function seed() {
  console.log('🌱 Starting MongoDB Database Seeding...');
  if (!uri) {
    console.error('No MONGODB_URI found.');
    process.exit(1);
  }

  const conn = await mongoose.connect(uri);
  console.log(`✅ Connected to MongoDB database: "${conn.connection.name}"`);

  // 1. Seed Master Admin User
  const usersCollection = conn.connection.collection('users');
  const existingAdmin = await usersCollection.findOne({ email: 'admin@terra.com' });

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash('TerraAdmin2026!', salt);

  if (!existingAdmin) {
    await usersCollection.insertOne({
      name: 'Terra Administrator',
      email: 'admin@terra.com',
      password: hashedPassword,
      role: 'admin',
      tier: 'Terra Founder & Executive',
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log('👤 Master Admin User created: admin@terra.com / TerraAdmin2026!');
  } else {
    await usersCollection.updateOne(
      { email: 'admin@terra.com' },
      {
        $set: {
          role: 'admin',
          password: hashedPassword,
          name: 'Terra Administrator',
          tier: 'Terra Founder & Executive',
          updatedAt: new Date(),
        },
      }
    );
    console.log('👤 Master Admin User verified and refreshed: admin@terra.com');
  }

  // 2. Seed Products Catalog
  const productsCollection = conn.connection.collection('products');
  
  const initialProducts = [
    {
      slug: 'face-wash',
      name: 'Terra Face Wash',
      category: 'Face',
      purpose: 'Cleanse',
      tagline: 'THE DAILY CLEANSE',
      shortDescription: 'A gentle, daily gel cleanser with Salicylic Acid and Green Tea to clear deep dirt, control excess oil, and keep your skin fresh without dryness.',
      fullDescription: 'The first step of the Terra Routine. Specially crafted for men whose skin faces daily city dust, pollution, and sweat. Terra Face Wash gently cleans deep inside pores, removes sticky excess oil, and softens beard hair without making your face feel dry or stretchy.',
      price: 699,
      size: '200ml / 6.7 fl oz',
      rating: 4.9,
      reviewCount: 248,
      stock: 100,
      isPublished: true,
      featuredImage: '/images/products/face-wash-main.jpg',
      secondaryImage: '/images/hero/hero-campaign.jpg',
      images: [
        {
          url: '/images/products/face-wash-main.jpg',
          alt: 'Terra Face Wash 200ml bottle on stone plinth',
          caption: 'The Daily Cleanse in matte forest green bottle'
        }
      ],
      heroColor: '#2D4438',
      accentColor: '#3B5947',
      badge: 'Step 01 — Cleanse',
      ingredientsList: [
        'Aqua (Purified Water)',
        'Cocamidopropyl Betaine',
        'Sodium Lauroyl Methyl Isethionate',
        'Salicylic Acid',
        'Green Tea Extract',
        'Aloe Vera Leaf Juice',
        'Vegetable Glycerin',
        'Pro-Vitamin B5 (Panthenol)',
        'Allantoin',
        'Bergamot Essential Oil'
      ],
      shippingInfo: 'Dispatched within 24 hours. Complimentary express courier across India.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'beard-oil',
      name: 'Terra Conditioning Beard Oil',
      category: 'Beard',
      purpose: 'Nourish',
      tagline: 'WEIGHTLESS HYDRATION & SHEEN',
      shortDescription: 'A non-greasy conditioning oil crafted from Golden Jojoba and Moroccan Argan to soften coarse beard hair and soothe skin underneath.',
      fullDescription: 'Step two of the Terra Routine. A lightweight, nutrient-dense beard elixir designed to eliminate beard itch, tame stray flyaways, and provide a healthy matte luster without heavy residue.',
      price: 799,
      size: '50ml / 1.7 fl oz',
      rating: 4.95,
      reviewCount: 184,
      stock: 75,
      isPublished: true,
      featuredImage: '/images/hero/hero-campaign.jpg',
      secondaryImage: '/images/products/face-wash-main.jpg',
      images: [
        {
          url: '/images/hero/hero-campaign.jpg',
          alt: 'Terra Conditioning Beard Oil with dropper',
          caption: 'Weightless botanical hydration'
        }
      ],
      heroColor: '#2D4438',
      accentColor: '#D4AF37',
      badge: 'Step 02 — Nourish',
      ingredientsList: [
        'Simmondsia Chinensis (Jojoba) Seed Oil',
        'Argania Spinosa (Argan) Kernel Oil',
        'Prunus Amygdalus Dulcis (Sweet Almond) Oil',
        'Tocopherol (Vitamin E)',
        'Cedarwood Essential Oil',
        'Vetiver Root Oil'
      ],
      shippingInfo: 'Dispatched within 24 hours. Complimentary express courier across India.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'the-complete-terra-method',
      name: 'The Complete Terra Method',
      category: 'Sets',
      purpose: 'The Method',
      tagline: 'THE ESSENTIAL 2-STEP REGIMEN',
      shortDescription: 'The foundational pairing: Terra Face Wash (200ml) + Conditioning Beard Oil (50ml). Complete morning and evening ritual with ₹100 bundle savings.',
      fullDescription: 'The full spectrum of Terra restraint and efficacy. Step 1 gently purifies and clears urban pollution. Step 2 nourishes beard follicles and the dermal barrier. Two products. Nothing unnecessary.',
      price: 1399,
      compareAtPrice: 1498,
      size: '2-Piece Set',
      rating: 5.0,
      reviewCount: 312,
      stock: 50,
      isPublished: true,
      isBundle: true,
      featuredImage: '/images/hero/hero-campaign.jpg',
      images: [
        {
          url: '/images/hero/hero-campaign.jpg',
          alt: 'The Complete Terra Method 2-piece set',
          caption: 'Full 2-step daily ritual set'
        }
      ],
      heroColor: '#2D4438',
      accentColor: '#D4AF37',
      badge: 'Bestseller Set',
      shippingInfo: 'Dispatched within 24 hours. Complimentary express courier across India.',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  for (const prod of initialProducts) {
    await productsCollection.updateOne(
      { slug: prod.slug },
      { $set: prod },
      { upsert: true }
    );
    console.log(`📦 Seeded Product: ${prod.name} (₹${prod.price})`);
  }

  console.log('\n✨ Database seeding completed successfully!');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
