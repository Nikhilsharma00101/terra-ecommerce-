import { JournalArticle } from '@/types';

export const journalArticles: JournalArticle[] = [
  {
    slug: 'why-your-beard-starts-with-your-skin',
    title: 'Why a Great Beard Starts with Healthy Skin',
    subtitle: 'The simple connection between clean facial skin and strong, soft beard hair.',
    category: 'Skin Science',
    readTime: '4 min read',
    audioReadMinutes: 4,
    date: 'August 14, 2026',
    author: 'Terra Editorial',
    excerpt: 'Most men think beard roughness or itch is just a hair problem. In reality, it almost always begins with dry, clogged skin underneath.',
    quote: 'You cannot cultivate a healthy forest in depleted soil. Your beard is only as resilient as the stratum corneum beneath it.',
    coverImage: '/images/journal/beard_skin_science.png',
    featured: true,
    tags: ['Skin Biology', 'Follicle Health', 'Beard Care'],
    content: [
      {
        heading: 'The Root Underneath',
        paragraph: 'Every single beard hair grows from roots located just beneath the surface of your skin. When city dust, pollution, and sweat collect on your face, the hair follicles get congested. This leads to micro-inflammation, beard itch, and brittle, rough beard hair.'
      },
      {
        heading: 'Why Regular Soaps Fail',
        paragraph: 'Ordinary bathing soaps use harsh sulfate detergents that strip away your skin’s natural lipid barrier, leaving your face dry, flaky, and tight. Then, using thick synthetic hair silicone products only coats the outer shaft without nourishing the root. The solution lies in biocompatible cleansing—a mild, acid-balanced cleanser like Terra Face Wash, followed by non-comedogenic botanical oils like Jojoba and Argan.'
      },
      {
        heading: 'The Daily Two-Minute Routine',
        paragraph: 'Wash your face twice daily with lukewarm water and a gentle cleanser. While your beard is still slightly towel-damp, apply 3 to 4 drops of cold-pressed plant oils, massaging deep into the dermis beneath. Comb gently to align hair cuticles and seal in moisture.'
      }
    ],
    keyTakeaways: [
      'Healthy beard growth requires clean, unclogged skin beneath the hair shaft.',
      'Harsh body soaps cause lipid striping, leading to rebound oiliness and severe itch.',
      'Lightweight botanical plant oils absorb fast without leaving a greasy sheen.'
    ],
    relatedProductSlug: 'beard-oil'
  },
  {
    slug: 'the-case-for-a-simpler-grooming-routine',
    title: 'The Case for a Simpler Grooming Routine',
    subtitle: 'Why men don’t need an 8-step routine—and what works best.',
    category: 'Philosophy',
    readTime: '3 min read',
    audioReadMinutes: 3,
    date: 'July 28, 2026',
    author: 'Terra Editorial',
    excerpt: 'The modern grooming industry has become crowded with dozens of redundant bottles. But high-performance skin health relies on just two focused fundamentals.',
    quote: 'Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.',
    coverImage: '/images/journal/products-flat.jpeg',
    featured: false,
    tags: ['Minimalism', 'Essentialism', 'Daily Practice'],
    content: [
      {
        heading: 'The Problem with Too Many Products',
        paragraph: 'Over the past decade, men have been sold elaborate 10-step daily regimens featuring synthetic toners, harsh chemical peels, and heavy silicones. Layering disparate active ingredients frequently disrupts the skin’s mantle, triggering breakouts and wasting precious morning time.'
      },
      {
        heading: 'The Power of Botanical Fundamentals',
        paragraph: 'Terra was built upon a fundamental truth: men do not need more complexity, they need higher purity. By combining a targeted pore-clearing cleanser with a nutrient-dense 7-oil botanical elixir, your entire grooming ritual takes under two minutes.'
      },
      {
        heading: 'Consistency Over Complexity',
        paragraph: 'A simple, unshakeable routine is effortless to maintain every day. When you practice quality fundamentals twice daily, you cultivate clean skin, a soft beard, and quiet confidence.'
      }
    ],
    keyTakeaways: [
      'Layering excessive chemical products alters skin pH and strips essential moisture.',
      'A streamlined 2-step methodology provides superior results with zero wasted effort.',
      'Daily discipline in fundamentals creates sustainable, long-term skin health.'
    ],
    relatedProductSlug: 'the-method'
  },
  {
    slug: 'building-a-better-two-step-morning-routine',
    title: 'Building an Easy 2-Step Morning Routine',
    subtitle: 'How to take care of your face and beard in just two minutes every morning.',
    category: 'Daily Routine',
    readTime: '4 min read',
    audioReadMinutes: 4,
    date: 'July 12, 2026',
    author: 'Terra Editorial',
    excerpt: 'A practical, disciplined morning routine to keep your face fresh, clear excess oil, and keep your beard soft all day.',
    quote: 'The morning ritual sets the cadence for your entire day. Keep it crisp, deliberate, and effective.',
    coverImage: '/images/journal/morning_routine_mirror.png',
    featured: false,
    tags: ['Morning Ritual', 'Skincare Habits', 'Effortless Style'],
    content: [
      {
        heading: 'Step 1: Cleanse with Normal Water',
        paragraph: 'Splash your face with cool or lukewarm water. Dispense 1 to 2 pumps of Terra Face Wash into damp palms and lather into a silky micro-foam. Massage gently over your forehead, cheeks, and beard area for 30 to 45 seconds to dissolve overnight sebum.'
      },
      {
        heading: 'The Transition: Keep It Slightly Damp',
        paragraph: 'Pat your face gently with a clean waffle towel. Do not rub aggressively. Leaving hair follicles slightly damp facilitates capillary action, allowing natural oils to spread evenly without tugging.'
      },
      {
        heading: 'Step 2: Nourish with Pure Plant Oils',
        paragraph: 'Warm 3 to 5 drops of Terra Beard Oil between your palms. Press firmly onto the skin beneath your beard first, then sweep upward through the length of your facial hair to seal in hydration.'
      }
    ],
    keyTakeaways: [
      'Spend 45 seconds massaging cleanser to lift impurities without over-drying.',
      'Apply oil to damp facial hair for optimal lipid distribution.',
      'Finish with a natural wooden comb for uniform distribution.'
    ],
    relatedProductSlug: 'face-wash'
  }
];

export function getArticleBySlug(slug: string): JournalArticle | undefined {
  return journalArticles.find((a) => a.slug === slug);
}

export function getRelatedArticles(currentSlug: string, limit = 2): JournalArticle[] {
  return journalArticles.filter((a) => a.slug !== currentSlug).slice(0, limit);
}
