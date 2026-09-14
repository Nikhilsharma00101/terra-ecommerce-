import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'terra-face-wash',
    slug: 'face-wash',
    name: 'Terra Face Wash',
    category: 'Face',
    purpose: 'Cleanse',
    tagline: 'THE DAILY CLEANSE',
    shortDescription: 'A gentle, daily gel cleanser with Salicylic Acid and Green Tea to clear deep dirt, control excess oil, and keep your skin fresh without dryness.',
    fullDescription: 'The first step of the Terra Routine. Specially crafted for men whose skin faces daily city dust, pollution, and sweat. Terra Face Wash gently cleans deep inside pores, removes sticky excess oil, and softens beard hair without making your face feel dry or stretchy.',
    price: 699,
    size: '100ml / 3.4 fl oz',
    rating: 4.9,
    reviewCount: 248,
    images: [
      {
        url: '/images/home/hero-campaign.jpg',
        alt: 'Terra Face Wash 100ml bottle on stone plinth',
        caption: 'The Daily Cleanse in matte forest green bottle'
      },
      {
        url: '/images/home/hero-campaign.jpg',
        alt: 'Terra Daily Grooming Routine in studio setting',
        caption: 'Made for everyday morning and evening use'
      }
    ],
    featuredImage: '/images/home/hero-campaign.jpg',
    secondaryImage: '/images/home/hero-campaign.jpg',
    heroColor: '#2D4438',
    accentColor: '#3B5947',
    badge: 'Step 01 — Cleanse',
    ingredientsList: [
      'Aqua (Purified Water)',
      'Cocamidopropyl Betaine (Coconut Derived)',
      'Sodium Lauroyl Methyl Isethionate',
      'Salicylic Acid',
      'Green Tea Extract',
      'Aloe Vera Leaf Juice',
      'Vegetable Glycerin',
      'Pro-Vitamin B5 (Panthenol)',
      'Allantoin',
      'Bergamot Essential Oil',
      'Phenoxyethanol',
      'Ethylhexylglycerin'
    ],
    keyIngredients: [
      {
        name: 'Salicylic Acid',
        botanicalName: 'Beta Hydroxy Acid',
        origin: 'Willow Bark',
        role: 'Deep Pore Cleanser',
        description: 'Penetrates into oily pores to wash away trapped dust, sweat, and pollution. Helps prevent pimples and ingrown beard hairs.'
      },
      {
        name: 'Green Tea Extract',
        botanicalName: 'Camellia Sinensis',
        origin: 'Assam / Nilgiri Hills',
        role: 'Skin Soother & Cooling',
        description: 'Calms redness, shields skin from daily sun and pollution stress, and keeps your face cool and comfortable.'
      },
      {
        name: 'Pro-Vitamin B5 & Aloe',
        botanicalName: 'Panthenol & Aloe Vera',
        origin: 'Natural Plant Source',
        role: 'Hydration Lock',
        description: 'Ensures your skin retains essential moisture so your face never feels tight or dry after washing.'
      }
    ],
    ritual: [
      {
        number: '01',
        title: 'Pump & Lather',
        timing: 'Morning & Night',
        action: 'Take 1 to 2 pumps on wet palms and rub gently to work up a light, refreshing lather.',
        tip: 'Use normal or lukewarm water. Avoid hot water as it dries out facial skin.'
      },
      {
        number: '02',
        title: 'Massage Face & Beard',
        timing: '30 to 45 Seconds',
        action: 'Massage over cheeks, forehead, neck, and right through your beard to lift accumulated oil and dust.',
        tip: 'Pay special attention to your jawline and chin area.'
      },
      {
        number: '03',
        title: 'Rinse Clean',
        timing: 'Post-Cleanse',
        action: 'Rinse thoroughly with clean water and gently pat dry with a soft towel, leaving skin slightly damp.',
        tip: 'Follow immediately with Terra Beard Oil to lock in hydration.'
      }
    ],
    specs: [
      { label: 'Texture', value: 'Light foaming gel' },
      { label: 'Fragrance', value: 'Mild natural bergamot & fresh herbs' },
      { label: 'Skin Feel', value: 'Fresh, clean, non-greasy, zero tightness' },
      { label: 'Suitability', value: 'All skin types (Oily, Combination, Dry, Sensitive)' },
      { label: 'Packaging', value: 'UV-safe recyclable bottle with precise pump' }
    ],
    shippingInfo: 'Free delivery across India on orders above ₹999. Dispatched within 24 hours via express courier.',
    pairingProductSlug: 'beard-oil'
  },
  {
    id: 'terra-beard-oil',
    slug: 'beard-oil',
    name: 'Terra Beard Oil',
    category: 'Beard',
    purpose: 'Nourish',
    tagline: 'THE DAILY NOURISH',
    shortDescription: 'A premium blend of 7 cold-pressed natural oils to soften rough beard hair, stop beard itch, and keep the skin underneath healthy.',
    fullDescription: 'The second essential step in the Terra Routine. A lightweight, non-sticky beard oil made with pure Sweet Almond, Jojoba, Argan, Castor, Black Seed (Kalonji), Lavender, and Vitamin E. It absorbs quickly into beard strands to give a natural smooth feel, while calming dry skin and beard dandruff.',
    price: 899,
    size: '30ml / 1.0 fl oz',
    rating: 4.95,
    reviewCount: 312,
    images: [
      {
        url: '/images/home/hero-campaign.jpg',
        alt: 'Terra Beard Oil 30ml amber glass bottle with glass dropper',
        caption: 'The Daily Nourish in amber apothecary glass'
      },
      {
        url: '/images/home/hero-campaign.jpg',
        alt: 'Terra Daily Grooming Routine in studio setting',
        caption: 'Pure 7-oil cold-pressed formula'
      }
    ],
    featuredImage: '/images/home/hero-campaign.jpg',
    secondaryImage: '/images/home/hero-campaign.jpg',
    heroColor: '#8C6D46',
    accentColor: '#A88B63',
    badge: 'Step 02 — Nourish',
    ingredientsList: [
      'Sweet Almond Oil (Badam)',
      'Golden Jojoba Seed Oil',
      'Pure Moroccan Argan Oil',
      'Cold-Pressed Castor Oil (Arandi)',
      'Black Seed Oil (Kalonji)',
      'French Lavender Essential Oil',
      'Natural Vitamin E (Tocopherol)'
    ],
    keyIngredients: [
      {
        name: 'Sweet Almond Oil (Badam)',
        botanicalName: 'Prunus Amygdalus Dulcis',
        origin: 'Pure Cold-Pressed',
        role: 'Softener & Shine',
        description: 'Rich in natural vitamins, it softens hard, rough beard hair and makes it easily manageable throughout the day.'
      },
      {
        name: 'Golden Jojoba Oil',
        botanicalName: 'Simmondsia Chinensis',
        origin: 'Natural Seed Extract',
        role: 'Quick Absorption & Non-Sticky',
        description: 'Matches the natural oils of your skin. It absorbs in seconds without leaving any sticky or shiny film.'
      },
      {
        name: 'Pure Argan & Castor Oil',
        botanicalName: 'Argania & Ricinus',
        origin: 'Cold-Pressed',
        role: 'Root Strength & Thickness',
        description: 'Nourishes hair roots, prevents split ends, and helps your beard look fuller and well-groomed.'
      },
      {
        name: 'Black Seed (Kalonji) & Lavender',
        botanicalName: 'Nigella Sativa & Lavandula',
        origin: 'Traditional Botanical',
        role: 'Stops Itch & Calms Skin',
        description: 'Known for powerful skin soothing, it stops under-beard itching, reduces dry flakes, and provides a subtle, calm scent.'
      }
    ],
    ritual: [
      {
        number: '01',
        title: 'Take Drops in Dropper',
        timing: 'Morning or Evening',
        action: 'Take 3 to 5 drops using the precision glass dropper (for light stubble: 2-3 drops, medium beard: 4-6 drops).',
        tip: 'Best applied on a clean, towel-damp beard right after face wash.'
      },
      {
        number: '02',
        title: 'Rub in Palms',
        timing: '5 Seconds',
        action: 'Rub between your palms to warm the natural oils evenly.',
        tip: 'Enjoy the subtle, fresh herbal aroma.'
      },
      {
        number: '03',
        title: 'Apply from Roots to Tips',
        timing: '30 Seconds',
        action: 'Massage with fingers down to the skin beneath your beard first, then smooth through the length of your beard.',
        tip: 'Use a wooden beard comb to spread evenly and shape your beard.'
      }
    ],
    specs: [
      { label: 'Texture', value: 'Light, fast-absorbing natural oil' },
      { label: 'Fragrance', value: 'Subtle woody lavender & natural botanicals' },
      { label: 'Finish', value: 'Soft, well-groomed, natural matte (non-greasy)' },
      { label: 'Skin Benefit', value: 'Stops beard itch, eliminates dry flakes' },
      { label: 'Bottle', value: 'Amber UV glass with graduated dropper' }
    ],
    shippingInfo: 'Free delivery across India on orders above ₹999. Dispatched within 24 hours via express courier.',
    pairingProductSlug: 'face-wash'
  },
  {
    id: 'terra-method-bundle',
    slug: 'terra-set',
    name: 'The Complete Terra Method',
    category: 'Sets',
    purpose: 'The Method',
    tagline: 'TWO STEPS. NOTHING UNNECESSARY.',
    shortDescription: 'The complete daily routine set for men. Includes Terra Face Wash (100ml) and Terra Beard Oil (30ml) at a special combo price.',
    fullDescription: 'The complete two-step grooming routine. You do not need a shelf full of complicated bottles. True grooming is simple: Cleanse with Terra Face Wash, then Nourish with Terra Beard Oil. Together, they keep your face clean, fresh, and your beard soft and comfortable all day long.',
    price: 1399,
    compareAtPrice: 1598,
    size: '100ml Face Wash + 30ml Beard Oil',
    rating: 4.98,
    reviewCount: 520,
    images: [
      {
        url: '/images/home/hero-campaign.jpg',
        alt: 'The Complete Terra Method Set with Face Wash and Beard Oil',
        caption: 'The Daily Cleanse + The Daily Nourish together'
      },
      {
        url: '',
        alt: 'Terra Face Wash Step 01 Cleanse',
        caption: 'Step 01 — Cleanse'
      },
      {
        url: '',
        alt: 'Terra Beard Oil Step 02 Nourish',
        caption: 'Step 02 — Nourish'
      }
    ],
    featuredImage: '/images/home/hero-campaign.jpg',
    secondaryImage: '',
    heroColor: '#202A24',
    accentColor: '#C4A482',
    badge: 'Essential Routine Combo — Save ₹199',
    isBundle: true,
    ingredientsList: [
      'Complete transparency: Terra Face Wash (Salicylic Acid + Green Tea + Aloe) and Terra Beard Oil (7 Cold-Pressed Botanical Oils: Almond, Jojoba, Argan, Castor, Kalonji, Lavender, Vitamin E).'
    ],
    keyIngredients: [
      {
        name: 'Step 01: Deep Cleanse',
        role: 'Purify & Clear Oil',
        description: 'Washes away dirt, sweat, and pollutants without drying the face.'
      },
      {
        name: 'Step 02: 7-Oil Nourishment',
        role: 'Softness & Itch Relief',
        description: 'Sweet Almond, Jojoba, Argan, Castor, Black Seed, Lavender, and Vitamin E.'
      }
    ],
    ritual: [
      {
        number: '01',
        title: 'Step 01 — Cleanse',
        timing: 'Morning & Night',
        action: 'Wash face and beard with 1-2 pumps of Terra Face Wash. Rinse clean with normal water.',
        tip: 'Leaves your face clean, fresh, and ready for oil absorption.'
      },
      {
        number: '02',
        title: 'Step 02 — Nourish',
        timing: 'Right After Cleanse',
        action: 'Apply 3-5 drops of Terra Beard Oil to towel-damp beard and massage into the skin underneath.',
        tip: 'Keeps beard soft and manageable all day with zero greasy shine.'
      }
    ],
    specs: [
      { label: 'Set Contents', value: 'Terra Face Wash (100ml) + Terra Beard Oil (30ml)' },
      { label: 'Routine', value: 'Simple 2-Step Daily System (2 Minutes)' },
      { label: 'Supply', value: 'Lasts approximately 60 to 75 days of daily use' },
      { label: 'Packaging', value: 'Eco-friendly premium box with safe delivery' }
    ],
    shippingInfo: 'Free express courier delivery across India included on all Method Combo Sets.'
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentSlug: string): Product[] {
  return products.filter((p) => p.slug !== currentSlug);
}
