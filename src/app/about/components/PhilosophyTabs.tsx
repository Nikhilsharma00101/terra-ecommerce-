'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

export const philosophyTabs = [
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

export function PhilosophyTabs() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
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
  );
}
