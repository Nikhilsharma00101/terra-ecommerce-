import { Product } from '@/types';

export const products: Product[] = [
  {
    id: 'terra-face-wash',
    slug: 'terra-face-wash',
    name: 'Terra Face Wash',
    category: 'Face',
    purpose: 'Cleanse',
    tagline: 'DEEP PORE CLARITY, ZERO TIGHTNESS',
    shortDescription: 'A gentle, daily gel cleanser with Salicylic Acid and Green Tea to clear deep dirt, control excess oil, and keep your skin fresh without dryness.',
    fullDescription: 'The first step of the Terra Routine. Specially crafted for men whose skin faces daily city dust, pollution, and sweat. Terra Face Wash gently cleans deep inside pores, removes sticky excess oil, and softens beard hair without making your face feel dry or stretchy.',
    price: 259,
    compareAtPrice: 399,
    size: '100ml',
    rating: 5,
    reviewCount: 0,
    images: [
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789548703/terra-products/bi8lfhpm57rnnfmruti6.jpg',
        alt: 'Terra Face Wash 100ml bottle on stone plinth',
        caption: 'The Daily Cleanse in matte forest green bottle'
      },
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789548469/terra-products/uolqbgtd4l6imbdg9rmr.jpg',
        alt: 'Terra Daily Grooming Routine in studio setting',
        caption: 'Made for everyday morning and evening use'
      }
    ],
    featuredImage: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789548703/terra-products/bi8lfhpm57rnnfmruti6.jpg',
    secondaryImage: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789548469/terra-products/uolqbgtd4l6imbdg9rmr.jpg',
    heroColor: '#2D4438',
    accentColor: '#3B5947',
    badge: '',
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
        name: 'Salicylic Acid (BHA)',
        role: 'Deep Pore Cleanser',
        description: 'Penetrates deep into pores to clear away oil, sweat, and impurities while helping to prevent breakouts.'
      },
      {
        name: 'Green Tea Extract',
        role: 'Skin Soother',
        description: 'A soothing botanical that calms redness and shields your skin from daily pollution stress.'
      },
      {
        name: 'Aloe Vera & Pro-Vitamin B5',
        role: 'Hydration Lock',
        description: 'Hydrating ingredients that lock in essential moisture so your face never feels stretchy after washing.'
      },
      {
        name: 'Coconut-Derived Cleansers',
        role: 'Gentle Cleansing',
        description: 'Gentle, natural cleansers that create a rich lather without stripping the skin of its natural oils.'
      },
      {
        name: 'Bergamot Essential Oil',
        role: 'Aroma',
        description: 'Adds a fresh, mild, and natural herbal aroma to your morning and evening routine.'
      }
    ],
    ritual: [
      {
        number: '01',
        title: 'Pump & Lather',
        timing: 'Morning & Night',
        action: "Take 1 to 2 pumps of Terra Men's Co. Face Wash onto wet palms and rub gently to work up a light lather.",
        tip: 'Use normal or lukewarm water. Avoid hot water as it dries out facial skin.'
      },
      {
        number: '02',
        title: 'Massage & Rinse',
        timing: '30 Seconds',
        action: 'Massage over your face, neck, and right through your beard. Rinse thoroughly with clean water and gently pat dry.',
        tip: 'Follow immediately with Terra Beard Oil while your beard is slightly damp to lock in maximum hydration.'
      }
    ],
    specs: [
      { label: 'Benefit', value: 'Deeply Cleanses Pores' },
      { label: 'Benefit', value: 'Controls Excess Oil & Breakouts' },
      { label: 'Benefit', value: 'Hydrates & Calms' },
      { label: 'Formula', value: 'Sulfate-Free Formula' },
      { label: 'Skin Feel', value: 'Fresh, clean, non-greasy, zero tightness' }
    ],
    shippingInfo: 'Dispatched within 24 hours. Complimentary express courier across India.',
    pairingProductSlug: 'terra-beard-oil'
  },
  {
    id: 'terra-beard-oil',
    slug: 'terra-beard-oil',
    name: 'Terra Beard Oil',
    category: 'Beard',
    purpose: 'Nourish',
    tagline: '7 COLD-PRESSED BOTANICALS, ZERO GREASE',
    shortDescription: 'A premium blend of 7 cold-pressed natural oils to soften rough beard hair, stop beard itch, and keep the skin underneath healthy.',
    fullDescription: 'The second essential step in the Terra Routine. A lightweight, non-sticky beard oil made with pure Sweet Almond, Jojoba, Argan, Castor, Black Seed (Kalonji), Lavender, and Vitamin E. It absorbs quickly into beard strands to give a natural smooth feel, while calming dry skin and beard dandruff.',
    price: 449,
    compareAtPrice: 599,
    size: '30ml',
    rating: 5,
    reviewCount: 0,
    images: [
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789399134/terra-products/pzyjt7swzrdqpnhuienc.jpg',
        alt: 'Terra Beard Oil 30ml amber glass bottle with glass dropper',
        caption: 'Premium Beard Oil in amber apothecary glass'
      },
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789546610/terra-products/cgmaugqsgaknq3tv2zx4.jpg',
        alt: 'Terra Beard Oil studio shot',
        caption: 'Formulated with nourishing oils and Vitamin E'
      },
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789546336/terra-products/v5fh4jhtco0ezx5ritzr.jpg',
        alt: 'Terra Beard Oil detail shot',
        caption: '7 Cold-Pressed Botanical Oils'
      },
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789548596/terra-products/c6xpl9vacvf6yinqhcui.png',
        alt: 'Terra Beard Oil ingredients flat lay',
        caption: 'Zero Grease Formula'
      }
    ],
    featuredImage: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789399134/terra-products/pzyjt7swzrdqpnhuienc.jpg',
    secondaryImage: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789546610/terra-products/cgmaugqsgaknq3tv2zx4.jpg',
    heroColor: '#2D4438',
    accentColor: '#3B5947',
    badge: 'bestseller',
    ingredientsList: [
      'Argan Oil',
      'Castor Oil',
      'Jojoba Oil',
      'Almond Oil',
      'Black Seed Oil',
      'Vitamin E (Tocopherol)',
      'Lavender Oil',
      'Fragrance'
    ],
    keyIngredients: [
      {
        name: 'Argan Oil',
        role: 'Nourish',
        description: 'Helps nourish and condition beard hair for a softer, smoother feel.'
      },
      {
        name: 'Castor Oil',
        role: 'Condition',
        description: 'Helps condition and soften rough-feeling beard hair.'
      },
      {
        name: 'Jojoba Oil',
        role: 'Moisturise',
        description: 'Helps moisturise and smooth the beard for a more manageable feel.'
      },
      {
        name: 'Almond Oil',
        role: 'Condition',
        description: 'Helps nourish and condition dry-feeling beard hair.'
      },
      {
        name: 'Black Seed Oil',
        role: 'Nourish Skin',
        description: 'Helps nourish the beard and the skin underneath.'
      },
      {
        name: 'Vitamin E',
        role: 'Antioxidant',
        description: 'An antioxidant ingredient that helps support the conditioning properties of the formula.'
      },
      {
        name: 'Lavender Oil',
        role: 'Aroma',
        description: 'Adds a pleasant aromatic experience to your beard-care routine.'
      }
    ],
    ritual: [
      {
        number: '01',
        title: 'Take Drops',
        timing: 'Daily',
        action: "Take a few drops of Terra Men's Co. Beard Oil onto your palm.",
        tip: 'Apply after washing your face or beard for a smooth, conditioned feel.'
      },
      {
        number: '02',
        title: 'Rub & Massage',
        timing: 'As Needed',
        action: 'Rub between your palms and gently massage through your beard, from roots to ends.',
        tip: 'Use daily or whenever your beard feels dry or rough.'
      }
    ],
    specs: [
      { label: 'Benefit', value: 'Nourishes & Conditions' },
      { label: 'Benefit', value: 'Helps Reduce Dryness & Soothes Itch' },
      { label: 'Benefit', value: 'Makes Beard Smooth & Manageable' },
      { label: 'Finish', value: 'Natural-Looking Shine' },
      { label: 'Formula', value: 'BHT-Free Formula for everyday care' }
    ],
    shippingInfo: 'Dispatched within 24 hours. Complimentary express courier across India.',
    pairingProductSlug: 'terra-face-wash'
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
    price: 699,
    compareAtPrice: 999,
    size: '100ml Face Wash + 30ml Beard Oil',
    rating: 4.98,
    reviewCount: 520,
    images: [
      {
        url: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789658731/terra-products/jc8fueqkwlfju7x5n4so.jpg',
        alt: 'The Complete Terra Method Set with Face Wash and Beard Oil',
        caption: 'The Daily Cleanse + The Daily Nourish together'
      }
    ],
    featuredImage: 'https://res.cloudinary.com/rh7aum3g/image/upload/v1789658731/terra-products/jc8fueqkwlfju7x5n4so.jpg',
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
