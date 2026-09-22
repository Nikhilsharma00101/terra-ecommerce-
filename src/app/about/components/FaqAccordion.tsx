'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const faqs = [
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

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
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
  );
}
