import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  Sparkles,
  Droplets,
  Leaf,
  CheckCircle2,
  Lock,
  XCircle,
  Check,
  Star,
  FlaskConical
} from 'lucide-react';
import { connectToDatabase } from '@/lib/mongodb';
import { Product as ProductModel } from '@/models/Product';
import { Product } from '@/types';
import { PhilosophyTabs } from './components/PhilosophyTabs';
import { FaqAccordion } from './components/FaqAccordion';
import { AboutQuickBuyButton } from './components/AboutQuickBuyButton';

export const metadata: Metadata = {
  title: "About The Terra Method",
  description:
    'Learn about Terra Men\'s Co. and The Terra Method: disciplined luxury grooming fundamentals crafted with clinically proven bio-compatibles, cold-pressed botanicals, and radical ingredient transparency.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: "About The Terra Method | TERRA MEN'S CO.",
    description:
      'Disciplined luxury grooming fundamentals. Two steps. No unnecessary steps, no synthetic fragrances, no compromise.',
    url: 'https://www.terramensco.com/about',
    siteName: "TERRA MEN'S CO.",
    images: [
      {
        url: '/images/og/og-image.jpeg',
        width: 1200,
        height: 630,
        alt: "The Terra Method — Philosophy",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@terramensco',
    title: "About The Terra Method | TERRA MEN'S CO.",
    description:
      'Disciplined luxury grooming fundamentals. Two steps. No unnecessary steps.',
    images: ['/images/og/og-image.jpeg'],
  },
};

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: "About The Terra Method",
  url: 'https://www.terramensco.com/about',
  description:
    'Disciplined luxury grooming fundamentals crafted with clinically proven bio-compatibles and cold-pressed botanicals.',
  mainEntity: {
    '@type': 'Organization',
    name: "TERRA MEN'S CO.",
    url: 'https://www.terramensco.com',
  },
};

function resolveProductImage(prod?: Product | null): string {
  if (!prod) return '/images/home/hero-products.jpeg';
  if (prod.featuredImage && typeof prod.featuredImage === 'string' && prod.featuredImage.trim() !== '') {
    return prod.featuredImage;
  }
  if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
    const validImg = prod.images.find((img) => img?.url && img.url.trim() !== '');
    if (validImg) return validImg.url;
  }
  if (prod.secondaryImage && typeof prod.secondaryImage === 'string' && prod.secondaryImage.trim() !== '') {
    return prod.secondaryImage;
  }
  return '/images/home/hero-products.jpeg';
}

export default async function AboutPage() {
  let bundleProduct: any = null;
  try {
    await connectToDatabase();
    bundleProduct = await ProductModel.findOne({
      $or: [{ slug: 'terra-set' }, { isBundle: true }, { category: 'Sets' }],
    }).lean();
    if (!bundleProduct) {
      bundleProduct = await ProductModel.findOne({
        $or: [{ slug: 'face-wash' }, { category: 'Face' }],
      }).lean();
    }
    if (!bundleProduct) {
      bundleProduct = await ProductModel.findOne().lean();
    }
  } catch (error) {
    console.error('Error fetching bundle product:', error);
  }

  // Fallback serialization
  const product: Product | null = bundleProduct
    ? JSON.parse(JSON.stringify(bundleProduct))
    : null;

  const pillars = [
    {
      num: '01',
      icon: Droplets,
      title: 'Biocompatible Cleansing',
      desc: 'Acid-balanced salicylic formula that dissolves city pollution and excess sebum without stripping the skin’s lipid barrier.',
    },
    {
      num: '02',
      icon: Leaf,
      title: 'First Cold-Pressed Oils',
      desc: 'Seven raw botanical oils—including Golden Jojoba and Sweet Almond—that soften coarse beard cuticles and moisturize the skin underneath.',
    },
    {
      num: '03',
      icon: Lock,
      title: 'UV Apothecary Glass',
      desc: 'Heavy UV-protective amber glass vessels that shield delicate fatty acids from photolytic breakdown and eliminate plastic waste.',
    },
    {
      num: '04',
      icon: ShieldCheck,
      title: 'Zero Synthetic Compromise',
      desc: 'No artificial fragrances, no silicone coatings, no parabens, and no phthalates. Every active ingredient is transparently declared.',
    },
  ];

  const ingredientPillars = {
    included: [
      { name: 'Beta Hydroxy Salicylic Acid', role: 'Clears deep pore congestion & prevents ingrown hairs' },
      { name: 'Cold-Pressed Golden Jojoba', role: 'Biomimetic wax ester that mirrors natural dermal sebum' },
      { name: 'Cold-Pressed Moroccan Argan', role: 'Rich in Vitamin E to restore cuticle softness' },
      { name: 'Nilgiri Green Tea Extract', role: 'Cools inflammation and calms post-wash facial skin' },
      { name: 'Bergamot & Cedarwood Essential Oils', role: 'Clean, subtle botanical aromatics with zero synthetics' },
    ],
    excluded: [
      { name: 'Sulfate Surfactants (SLS/SLES)', reason: 'Strips the stratum corneum leading to rebound oiliness' },
      { name: 'Synthetic Silicones (Dimethicone)', reason: 'Coats hair in plastic film without nourishing the root' },
      { name: 'Parabens & Phthalates', reason: 'Chemical preservatives that disrupt dermal flora balance' },
      { name: 'Artificial Chemical Perfumes', reason: 'Common cause of skin allergies and razor burn itch' },
      { name: 'Mineral Oils & Paraffin', reason: 'Comedogenic petroleum derivatives that clog hair follicles' },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181817] pb-24 selection:bg-[#2D4438] selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-[#E8E2D7] bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-[#77736C]">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-[#181817] transition-colors">
              Home
            </Link>
            <span className="opacity-40">/</span>
            <span className="text-[#181817] font-semibold">About Terra</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[#2D4438]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2D4438] animate-pulse" />
            <span className="font-medium">Foundational Discipline & Dermal Botany</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 space-y-20 sm:space-y-28">
        
        {/* ========================================================================= */}
        {/* EDITORIAL HERO SECTION                                                    */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-14 lg:p-16 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Copy Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D7] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2D4438]">
                <Sparkles size={12} className="text-[#8C6D46]" />
                <span>Foundational Manifesto</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#181817] font-light leading-[1.05] tracking-tight">
                Cultivating Discipline in <span className="italic text-[#2D4438]">Daily Grooming.</span>
              </h1>

              <blockquote className="font-serif text-xl sm:text-2xl text-[#8C6D46] font-light italic border-l-2 border-[#8C6D46] pl-4 py-1">
                &quot;Terra does not create a new man. Terra reveals the man within.&quot;
              </blockquote>

              <p className="text-xs sm:text-sm text-[#55524D] leading-relaxed max-w-xl font-light">
                Founded on the conviction that men deserve high-potency dermal fundamentals rather than bloated 10-step market routines. We engineer two deliberate formulas designed for effortless daily execution.
              </p>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8E2D7] max-w-md font-mono">
                <div>
                  <span className="text-[#2D4438] font-bold block text-2xl">02</span>
                  <span className="text-[10px] text-[#77736C] uppercase tracking-wider block">Core Steps</span>
                </div>
                <div>
                  <span className="text-[#2D4438] font-bold block text-2xl">4 Min</span>
                  <span className="text-[10px] text-[#77736C] uppercase tracking-wider block">Daily Ritual</span>
                </div>
                <div>
                  <span className="text-[#2D4438] font-bold block text-2xl">100%</span>
                  <span className="text-[10px] text-[#77736C] uppercase tracking-wider block">Clean Botanical</span>
                </div>
              </div>
            </div>

            {/* Right Visual Frame */}
            <div className="lg:col-span-5">
              <div className="relative aspect-4/5 w-full bg-[#1A1918] rounded-3xl overflow-hidden border border-[#E8E2D7] shadow-md group">
                <Image
                  src="/images/about-page/hero-section.jpeg"
                  alt="Terra Philosophy Campaign"
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md border border-[#E8E2D7] rounded-2xl shadow-xs">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-[#2D4438] font-bold block mb-1">
                    THE TERRA METHODOLOGY
                  </span>
                  <p className="text-xs text-[#181817] font-serif italic">
                    &quot;Purify the skin barrier. Nourish the hair follicle. Master the morning.&quot;
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* CONTINUOUS BRAND TICKER STRIP */}
        <div className="rounded-2xl bg-[#2D4438] text-white py-4 px-6 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] font-mono font-medium overflow-x-auto gap-8 whitespace-nowrap scrollbar-none">
            <span className="flex items-center gap-2">
              <Sparkles size={12} className="text-[#C4A482]" />
              Purposeful Restraint
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Leaf size={12} className="text-[#C4A482]" />
              Cold-Pressed Botanicals
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Lock size={12} className="text-[#C4A482]" />
              UV Apothecary Glass
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <Droplets size={12} className="text-[#C4A482]" />
              Biocompatible Cleansing
            </span>
            <span>•</span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#C4A482]" />
              Zero Synthetic Fillers
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE PHILOSOPHY TABBED MODULE                                      */}
        {/* ========================================================================= */}
        <PhilosophyTabs />

        {/* ========================================================================= */}
        {/* TACTILE PACKAGING & CRAFT SHOWCASE (DARK FOREST CONTAINER)                */}
        {/* ========================================================================= */}
        <div className="bg-[#2D4438] text-white rounded-3xl p-8 sm:p-14 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 relative z-10">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#C4A482] font-semibold px-3 py-1 rounded-full bg-white/10 inline-block">
              Materiality & Tactile Craft
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-white font-light">
              Heavy Glass Dermal Vessels
            </h2>
            <p className="text-xs sm:text-sm text-[#DDD8CF] font-light max-w-xl mx-auto leading-relaxed">
              We reject lightweight single-use plastic bottles. Every Terra formulation is housed in dark amber apothecary glass to protect active plant lipids and elevate your morning space.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div className="bg-black/30 border border-white/15 p-6 rounded-2xl space-y-3 backdrop-blur-sm">
              <Lock size={20} className="text-[#C4A482]" />
              <h4 className="font-mono text-xs text-white font-semibold uppercase tracking-wider">
                Photolytic Shielding
              </h4>
              <p className="text-xs text-[#DDD8CF] font-light leading-relaxed">
                UV-filtered amber glass blocks damaging ultraviolet light wavelengths, preventing oxidative degradation of cold-pressed botanicals.
              </p>
            </div>

            <div className="bg-black/30 border border-white/15 p-6 rounded-2xl space-y-3 backdrop-blur-sm">
              <Compass size={20} className="text-[#C4A482]" />
              <h4 className="font-mono text-xs text-white font-semibold uppercase tracking-wider">
                Calibrated Daily Dosage
              </h4>
              <p className="text-xs text-[#DDD8CF] font-light leading-relaxed">
                Precision German-engineered pump mechanisms and glass pipettes calibrated to dispense the exact 2-minute daily dosage with zero waste.
              </p>
            </div>

            <div className="bg-black/30 border border-white/15 p-6 rounded-2xl space-y-3 backdrop-blur-sm">
              <ShieldCheck size={20} className="text-[#C4A482]" />
              <h4 className="font-mono text-xs text-white font-semibold uppercase tracking-wider">
                Infinite Recyclability
              </h4>
              <p className="text-xs text-[#DDD8CF] font-light leading-relaxed">
                100% recyclable, inert glass containers that eliminate micro-plastic leaching and permanently reduce bathroom landfill waste.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUR NON-NEGOTIABLE STANDARDS                                             */}
        {/* ========================================================================= */}
        <div className="space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#2D4438] font-semibold">
              Our Formulation Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#181817] font-medium">
              Four Non-Negotiable Commitments
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C]">
              Every single formulation batch is measured against these uncompromised benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="bg-white rounded-2xl border border-[#E8E2D7] p-6 space-y-4 hover:border-[#181817] hover:shadow-md transition-all duration-300 group shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E2D7] flex items-center justify-center text-[#2D4438] group-hover:bg-[#2D4438] group-hover:text-white transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-xs text-[#8C6D46] font-semibold">
                        {item.num}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-medium text-[#181817] group-hover:text-[#2D4438] transition-colors mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#55524D] font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E8E2D7] flex items-center gap-1.5 text-[10px] font-mono text-[#77736C]">
                    <Check size={12} className="text-[#2D4438]" />
                    <span>Active Standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INGREDIENT TRANSPARENCY COMPARISON TABLE                                 */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-12 lg:p-14 shadow-xs">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#2D4438] font-semibold">
              Transparent Dermal Chemistry
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#181817] font-medium">
              What We Formulate With vs What We Reject
            </h2>
            <p className="text-xs sm:text-sm text-[#77736C]">
              We believe ingredient lists should be clear, honest, and scientifically justified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: What We Formulate */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D7] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase font-mono font-bold text-[#2D4438] pb-3 border-b border-[#E8E2D7]">
                <CheckCircle2 size={16} />
                <span>100% Bio-Compatible Actives Included</span>
              </div>
              <ul className="space-y-3">
                {ingredientPillars.included.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2D4438] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-[#181817] font-mono">{item.name}</span>
                      <p className="text-[#55524D] text-[11px] mt-0.5 font-light">{item.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: What We Reject */}
            <div className="bg-[#FAF8F5] rounded-2xl border border-[#E8E2D7] p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase font-mono font-bold text-[#8B0000] pb-3 border-b border-[#E8E2D7]">
                <XCircle size={16} />
                <span>Permanently Excluded Irritants</span>
              </div>
              <ul className="space-y-3">
                {ingredientPillars.excluded.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] mt-1.5 shrink-0" />
                    <div>
                      <span className="font-semibold text-[#181817] font-mono">{item.name}</span>
                      <p className="text-[#55524D] text-[11px] mt-0.5 font-light">{item.reason}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS ACCORDION                                      */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-14 shadow-xs" id="faq">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-semibold text-[#2D4438]">
                Clarity & Honesty
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#181817] font-medium">
                Frequently Asked Questions
              </h2>
            </div>
            <FaqAccordion />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE DB FORMULATION CALL TO ACTION CONVERSION CARD                        */}
        {/* ========================================================================= */}
        {product && (
          <div className="bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-12 shadow-sm">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-[#1A1918] overflow-hidden relative shrink-0 border border-[#E8E2D7] shadow-xs">
                  <Image
                    src={resolveProductImage(product)}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D7] text-[10px] font-mono font-bold text-[#2D4438]">
                    <FlaskConical size={11} />
                    <span>RECOMMENDED METHOD</span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium">
                    Experience The Terra Method
                  </h3>
                  <div className="flex items-center gap-3 font-mono text-sm">
                    <span className="font-bold text-[#181817]">₹{product.price}</span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-xs text-[#77736C] line-through">
                        ₹{product.compareAtPrice}
                      </span>
                    )}
                    {product.rating && (
                      <span className="text-xs text-[#8C6D46] flex items-center gap-0.5">
                        <Star size={11} className="fill-[#8C6D46]" />
                        {product.rating} ({product.reviewCount})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#77736C] font-light max-w-md">
                    Two deliberate formulations. Four minutes every morning. Clean facial skin and soft, resilient facial hair.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                <AboutQuickBuyButton product={product} />

                <Link
                  href={`/shop/${product.slug}`}
                  className="border border-[#E8E2D7] text-[#181817] px-5 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:border-[#181817] transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
                >
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </Link>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
