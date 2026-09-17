export interface Ingredient {
  name: string;
  botanicalName?: string;
  origin?: string;
  role: string;
  description: string;
  image?: string;
}

export interface RitualStep {
  number: string;
  title: string;
  timing: string;
  action: string;
  tip: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
  productName: string;
  productSlug: string;
  helpfulCount?: number;
  skinType?: string;
  avatarInitials?: string;
  isSpotlight?: boolean;
}

export interface ProductImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Product {
  id: string;
  _id?: string;
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
  images: ProductImage[];
  featuredImage: string;
  secondaryImage?: string;
  heroColor?: string;
  accentColor?: string;
  badge?: string;
  ingredientsList: string[];
  keyIngredients: Ingredient[];
  ritual: RitualStep[];
  specs: {
    label: string;
    value: string;
  }[];
  shippingInfo: string;
  pairingProductSlug?: string;
  isBundle?: boolean;
  stock?: number;
  inStock?: boolean;
  isPublished?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  excerpt: string;
  quote?: string;
  coverImage: string;
  content: {
    heading?: string;
    paragraph: string;
  }[];
  keyTakeaways: string[];
  relatedProductSlug?: string;
  tags?: string[];
  featured?: boolean;
  audioReadMinutes?: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
}
