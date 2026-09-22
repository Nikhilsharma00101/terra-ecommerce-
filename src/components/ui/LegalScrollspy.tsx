'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

export interface LegalSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export function LegalScrollspy({
  sections,
  theme = 'light' // 'light' for privacy policy, 'dark' for terms
}: {
  sections: LegalSection[];
  theme?: 'light' | 'dark';
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((sec) => {
        const el = document.getElementById(sec.id);
        return { id: sec.id, offset: el ? el.getBoundingClientRect().top : 0 };
      });

      const current = offsets.filter((o) => o.offset < 300).pop();
      if (current) setActiveSection(current.id);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  return (
    <div className={`sticky top-32 space-y-2 border-l border-[#E8E2D7] pl-6 py-2`}>
      {sections.map((sec) => {
        const isActive = activeSection === sec.id;
        
        // Colors based on theme
        const activeTextColor = isLight ? 'text-[#181817]' : 'text-[#141414]';
        const inactiveTextColor = 'text-[#77736C] hover:text-[#55524D]';
        const activeIconBg = 'bg-white border border-[#E8E2D7] shadow-sm text-[#2D4438]';
        const inactiveIconBg = 'bg-transparent text-[#77736C] group-hover:text-[#55524D]';

        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className={`w-full text-left group flex items-center justify-between py-3 transition-colors cursor-pointer ${
              isActive ? activeTextColor : inactiveTextColor
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg transition-colors ${isActive ? activeIconBg : inactiveIconBg}`}>
                {sec.icon}
              </div>
              <div>
                <span className={`block text-xs font-semibold uppercase tracking-wider font-mono mb-1 ${isActive ? activeTextColor : ''}`}>
                  {sec.title}
                </span>
                <span className="block text-[10px] text-[#A39D93] font-light">
                  {sec.subtitle}
                </span>
              </div>
            </div>
            <ChevronRight
              size={14}
              className={`transition-transform duration-300 ${
                isActive ? 'translate-x-1 text-[#2D4438]' : 'opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
