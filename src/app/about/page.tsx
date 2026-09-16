'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  Sparkles,
  ChevronDown,
  Droplets,
  Leaf,
  CheckCircle2,
  Lock,
  XCircle,
  ShoppingBag,
  Check,
  Star,
  FlaskConical
} from 'lucide-react';

function resolveProductImage(prod?: Product | null): string {
  if (!prod) return '/images/home/hero-campaign.jpg';
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
  return '/images/home/hero-campaign.jpg';
}

export default function AboutPage() {
  const { products } = useProducts();
  const { addItem, openCart } = useCart();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [addedProductSlug, setAddedProductSlug] = useState<string | null>(null);

  // Find The Method bundle or fallback flagship product from live DB
  const bundleProduct =
    products.find((p) => p.slug === 'terra-set' || p.isBundle || p.category === 'Sets') ||
    products.find((p) => p.slug === 'face-wash' || p.category === 'Face') ||
    products[0];

  const handleQuickBuy = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(prod, 1);
    setAddedProductSlug(prod.slug);
    setTimeout(() => {
      setAddedProductSlug(null);
      openCart();
    }, 1200);
  };

  const philosophyTabs = [
    {
      id: 'excess',
      label: 'THE PROBLEM WITH EXCESS',
      title: 'The Fallacy of the 10-Step Regimen',
      excerpt:
        'The modern grooming market was built to sell redundant bottles, not dermal results. Layering competing synthetic actives alters skin pH, causes contact redness, and creates friction every morning.',
      detail:
        'We eliminated the fluff. Facial grooming does not require artificial toners, alcohol splashes, or chemical fragrance extenders. It requires just two bio-compatible fundamentals practiced daily with discipline.',
      image: '/images/journal/products-flat.jpeg',
      tag: 'Minimalist Architecture',
    },
    {
      id: 'restraint',
      label: 'THE POWER OF RESTRAINT',
      title: 'Formulating Dermal Biocompatibility',
      excerpt:
        'Terra relies on balanced purification paired with first cold-pressed botanical lipids. By utilizing plant oils that mirror natural sebum molecularly, absorption happens in under 90 seconds without grease.',
      detail:
        'A targeted Salicylic cleanser dissolves trapped pollution and sebum from pores, while seven nutrient-dense plant oils fortify coarse facial hair down to the follicle beneath.',
      image: '/images/journal/morning_routine_mirror.png',
      tag: 'Cellular Compatibility',
    },
    {
      id: 'craft',
      label: 'MATERIALITY & CRAFT',
      title: 'Heavy UV Apothecary Glass Preservation',
      excerpt:
        'Pure cold-pressed botanicals are sensitive to sunlight and oxidation. We house our formulations exclusively in dark amber and forest green apothecary glass to shield against photolytic degradation.',
      detail:
        'Beyond chemistry, heavy glass feels substantial and intentional in your hands every morning—grounding your sink counter with quiet elegance and zero loud plastic marketing.',
      image: '/images/about-page/hero-section.jpeg',
      tag: 'Sustainable Tactility',
    },
  ];

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

  const faqs = [
    {
      q: 'Why does Terra advocate for only two products?',
      a: 'We believe men do not need an endless shelf of complicated bottles. By formulating a high-potency, pore-clearing cleanser and pairing it with a bio-compatible seven-oil botanical elixir, we address dermal purification and hair conditioning completely in just four minutes each day.',
    },
    {
      q: 'Can I use Terra Face Wash if I don’t have a full beard?',
      a: 'Absolutely. Terra Face Wash is engineered for all men’s facial skin, whether clean-shaven, stubbled, or fully bearded. It clears overnight sebum, lifts city pollution, and prevents post-shave ingrown hairs and bumps.',
    },
    {
      q: 'Will Terra Beard Oil leave my face feeling oily or greasy?',
      a: 'No. Our formula is built with lightweight, cold-pressed plant oils like Golden Jojoba and Sweet Almond that mirror human skin sebum. It absorbs cleanly into the dermis in under 90 seconds, leaving a soft, natural matte touch with zero greasy shine.',
    },
    {
      q: 'Are Terra formulations suitable for all skin types, including sensitive skin?',
      a: 'Yes. Every formula is acid-balanced and crafted for daily use across all skin types—including sensitive, dry, oily, and acne-prone skin. We strictly exclude harsh sulfates, synthetic fragrances, and pore-clogging mineral oils to ensure gentle, non-irritating care.',
    },
    {
      q: 'What is your shipping and satisfaction policy?',
      a: 'We provide complimentary express delivery across India on all orders above ₹999. Orders are packed in recyclable cardboard and dispatched within 24 hours. If you are not satisfied within 30 days of daily use, our team offers a hassle-free refund.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#181817] pb-24 selection:bg-[#2D4438] selection:text-white">
      
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
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#E8E2D7]">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] font-mono font-semibold text-[#2D4438] block mb-2">
                Core Convictions
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl text-[#181817] font-light">
                Our Formulative Truths
              </h2>
            </div>

            {/* Interactive Tabs Switcher */}
            <div className="flex flex-wrap gap-2">
              {philosophyTabs.map((tab, idx) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === idx
                      ? 'bg-[#181817] text-white shadow-xs'
                      : 'bg-white text-[#55524D] border border-[#E8E2D7] hover:border-[#181817] hover:text-[#181817]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Tab Content Card */}
          {(() => {
            const current = philosophyTabs[activeTab];
            return (
              <div className="bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-12 shadow-xs transition-all duration-500">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#8C6D46] uppercase tracking-widest font-semibold border border-[#8C6D46]/30 px-3 py-1 rounded-full inline-block bg-[#FAF8F5]">
                        Principle 0{activeTab + 1}
                      </span>
                      <span className="text-[10px] font-mono text-[#2D4438] uppercase tracking-wider">
                        {current.tag}
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl text-[#181817] font-medium leading-snug">
                      {current.title}
                    </h3>

                    <p className="font-serif text-lg text-[#77736C] italic font-light leading-relaxed">
                      &quot;{current.excerpt}&quot;
                    </p>

                    <p className="text-xs sm:text-sm text-[#55524D] leading-relaxed font-light">
                      {current.detail}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#2D4438] font-semibold">
                      <CheckCircle2 size={16} />
                      <span>Verified Terra Formulation Standard</span>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative aspect-4/3 w-full bg-[#EAE5DC] rounded-2xl border border-[#E8E2D7] overflow-hidden shadow-xs">
                      <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}
        </div>

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

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'bg-[#FAF8F5] border-[#2D4438] shadow-xs'
                        : 'bg-white border-[#E8E2D7] hover:border-[#181817]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-serif text-lg sm:text-xl text-[#181817] font-medium cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[#8C6D46] font-semibold">
                          0{i + 1}.
                        </span>
                        <span>{faq.q}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-[#77736C] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-[#2D4438]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#E8E2D7]/60">
                        <p className="text-xs sm:text-sm text-[#55524D] font-light leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* LIVE DB FORMULATION CALL TO ACTION CONVERSION CARD                        */}
        {/* ========================================================================= */}
        {bundleProduct && (
          <div className="bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-12 shadow-sm">
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-[#1A1918] overflow-hidden relative shrink-0 border border-[#E8E2D7] shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveProductImage(bundleProduct)}
                    alt={bundleProduct.name}
                    className="w-full h-full object-cover"
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
                    <span className="font-bold text-[#181817]">₹{bundleProduct.price}</span>
                    {bundleProduct.compareAtPrice && bundleProduct.compareAtPrice > bundleProduct.price && (
                      <span className="text-xs text-[#77736C] line-through">
                        ₹{bundleProduct.compareAtPrice}
                      </span>
                    )}
                    {bundleProduct.rating && (
                      <span className="text-xs text-[#8C6D46] flex items-center gap-0.5">
                        <Star size={11} className="fill-[#8C6D46]" />
                        {bundleProduct.rating} ({bundleProduct.reviewCount})
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#77736C] font-light max-w-md">
                    Two deliberate formulations. Four minutes every morning. Clean facial skin and soft, resilient facial hair.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
                <button
                  onClick={(e) => handleQuickBuy(e, bundleProduct)}
                  className="bg-[#181817] text-white px-7 py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-[#2D4438] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {addedProductSlug === bundleProduct.slug ? (
                    <>
                      <Check size={14} className="text-[#C4A482]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      <span>Order Now • ₹{bundleProduct.price}</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/shop/${bundleProduct.slug}`}
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
