import { Review } from '@/types';

export const reviews: Review[] = [
  {
    id: 'rev-1',
    author: 'Rohan Sharma',
    avatarInitials: 'RS',
    location: 'Bengaluru, Karnataka',
    skinType: 'Oily & Combination',
    rating: 5,
    date: 'August 18, 2026',
    title: 'Cleans deeply without drying out my face.',
    content: 'Living in Bangalore with daily bike commutes used to leave my face full of dust and grease. The Terra Face Wash cleans thoroughly, controls oil around the T-zone, and does not make the skin tight like regular soaps. Highly recommended.',
    verified: true,
    productName: 'Terra Face Wash',
    productSlug: 'face-wash',
    helpfulCount: 34,
    isSpotlight: true
  },
  {
    id: 'rev-2',
    author: 'Vikramaditya Iyer',
    avatarInitials: 'VI',
    location: 'Mumbai, Maharashtra',
    skinType: 'Sensitive & Coarse Beard',
    rating: 5,
    date: 'August 12, 2026',
    title: 'Non-sticky beard oil that actually absorbs fast.',
    content: 'In Mumbai’s humid weather, most beard oils feel like sticky cooking oil. Terra Beard Oil is genuinely lightweight, absorbs in a minute, and completely stopped my beard itching. The mild lavender scent is very classy.',
    verified: true,
    productName: 'Terra Beard Oil',
    productSlug: 'beard-oil',
    helpfulCount: 42,
    isSpotlight: true
  },
  {
    id: 'rev-3',
    author: 'Aditya Verma',
    avatarInitials: 'AV',
    location: 'New Delhi (NCR)',
    skinType: 'All Skin Types',
    rating: 5,
    date: 'August 04, 2026',
    title: 'The two-step method is all I ever needed.',
    content: 'I used to buy toners and moisturizers that just cluttered my bathroom shelf. Switching to the Terra 2-Step Method took less than 2 minutes every morning, and my skin and beard look noticeably healthier in two weeks.',
    verified: true,
    productName: 'The Complete Terra Method',
    productSlug: 'terra-set',
    helpfulCount: 59,
    isSpotlight: true
  },
  {
    id: 'rev-4',
    author: 'Karan Mehra',
    avatarInitials: 'KM',
    location: 'Pune, Maharashtra',
    skinType: 'Normal to Dry',
    rating: 5,
    date: 'July 29, 2026',
    title: 'Subtle, natural fragrance and premium feel.',
    content: 'The packaging and bottle quality feel truly international. No loud synthetic perfumes—just pure cold-pressed botanicals that leave a healthy, natural matte finish on my beard.',
    verified: true,
    productName: 'Terra Beard Oil',
    productSlug: 'beard-oil',
    helpfulCount: 18,
    isSpotlight: false
  },
  {
    id: 'rev-5',
    author: 'Siddharth Rao',
    avatarInitials: 'SR',
    location: 'Hyderabad, Telangana',
    skinType: 'Combination',
    rating: 5,
    date: 'July 21, 2026',
    title: 'Best combo set for daily routine.',
    content: 'Ordered The Method set. Fast delivery in Hyderabad within 2 days. The face wash clears excess oil and the beard oil softens rough beard hair effortlessly. Great value at ₹1,399.',
    verified: true,
    productName: 'The Complete Terra Method',
    productSlug: 'terra-set',
    helpfulCount: 27,
    isSpotlight: false
  },
  {
    id: 'rev-6',
    author: 'Devendra Kapoor',
    avatarInitials: 'DK',
    location: 'Chandigarh, Punjab',
    skinType: 'Sensitive Skin',
    rating: 5,
    date: 'July 15, 2026',
    title: 'Zero breakouts, instant clarity.',
    content: 'Most cleansers aggravate my sensitive skin with heavy artificial foam. Terra Face Wash has a rich natural lather from coconut glucoside and witch hazel that calms redness immediately.',
    verified: true,
    productName: 'Terra Face Wash',
    productSlug: 'face-wash',
    helpfulCount: 21,
    isSpotlight: false
  },
  {
    id: 'rev-7',
    author: 'Nikhil Kashyap',
    avatarInitials: 'NK',
    location: 'Gurugram, Haryana',
    skinType: 'Coarse Beard Routine',
    rating: 5,
    date: 'July 02, 2026',
    title: 'Refined, non-greasy, and truly essential.',
    content: 'As someone who dislikes heavy skincare routines, Terra’s minimalistic philosophy hits the sweet spot. Two steps, top-tier botanical ingredients, zero clutter.',
    verified: true,
    productName: 'The Complete Terra Method',
    productSlug: 'terra-set',
    helpfulCount: 31,
    isSpotlight: false
  }
];

export function getReviewsByProduct(slug: string): Review[] {
  if (!slug || slug === 'terra-set') return reviews;
  return reviews.filter((r) => r.productSlug === slug);
}
