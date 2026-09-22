import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IIngredient {
  name: string;
  botanicalName?: string;
  origin?: string;
  role: string;
  description: string;
  image?: string;
}

export interface IRitualStep {
  number: string;
  title: string;
  timing: string;
  action: string;
  tip: string;
}

export interface IProductImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  slug: string;
  name: string;
  category: 'Face' | 'Beard' | 'Sets';
  purpose: 'Cleanse' | 'Nourish' | 'The Method';
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  rating: number;
  reviewCount: number;
  stock: number;
  isPublished: boolean;
  images: IProductImage[];
  featuredImage: string;
  secondaryImage?: string;
  heroColor?: string;
  accentColor?: string;
  badge?: string;
  ingredientsList: string[];
  keyIngredients: IIngredient[];
  ritual: IRitualStep[];
  specs: {
    label: string;
    value: string;
  }[];
  shippingInfo: string;
  pairingProductSlug?: string;
  isBundle?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IngredientSchema = new Schema<IIngredient>(
  {
    name: { type: String, required: true },
    botanicalName: { type: String },
    origin: { type: String },
    role: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  { _id: false }
);

const RitualStepSchema = new Schema<IRitualStep>(
  {
    number: { type: String, required: true },
    title: { type: String, required: true },
    timing: { type: String, default: '' },
    action: { type: String, required: true },
    tip: { type: String, default: '' },
  },
  { _id: false }
);

const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String },
  },
  { _id: false }
);

const SpecSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Face', 'Beard', 'Sets'],
      required: true,
    },
    purpose: {
      type: String,
      enum: ['Cleanse', 'Nourish', 'The Method'],
      required: true,
    },
    tagline: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    fullDescription: { type: String, default: '' },
    price: { type: Number, required: [true, 'Product price is required'], min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    size: { type: String, default: '' },
    rating: { type: Number, default: 5.0, min: 1, max: 5 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 100, min: 0 },
    isPublished: { type: Boolean, default: true },
    images: [ProductImageSchema],
    featuredImage: { type: String, required: true },
    secondaryImage: { type: String },
    heroColor: { type: String, default: '#2D4438' },
    accentColor: { type: String, default: '#3B5947' },
    badge: { type: String },
    ingredientsList: [{ type: String }],
    keyIngredients: [IngredientSchema],
    ritual: [RitualStepSchema],
    specs: [SpecSchema],
    shippingInfo: {
      type: String,
      default: 'Dispatched within 24 hours. Complimentary express courier across India.',
    },
    pairingProductSlug: { type: String },
    isBundle: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
