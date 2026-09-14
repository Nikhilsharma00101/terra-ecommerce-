'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  theme?: 'light' | 'dark';
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  theme = 'light',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`divide-y border-t border-b transition-colors ${
        isLight
          ? 'divide-[#E5E0D8] border-[#E5E0D8]'
          : 'divide-white/10 border-white/10'
      }`}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-0.5">
            <button
              onClick={() => toggle(item.id)}
              className="w-full py-4 flex items-center justify-between text-left group focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
            >
              <span
                className={`text-xs uppercase tracking-[0.18em] font-semibold transition-colors ${
                  isLight
                    ? 'text-[#181817] group-hover:text-[#8B0000]'
                    : 'text-white group-hover:text-[#DC143C]'
                }`}
              >
                {item.title}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isOpen
                    ? isLight
                      ? 'rotate-180 text-[#181817]'
                      : 'rotate-180 text-white'
                    : isLight
                    ? 'text-[#8C877D]'
                    : 'text-gray-500'
                }`}
              />
            </button>
            {isOpen && (
              <div
                className={`pb-5 pt-1 text-xs sm:text-sm leading-relaxed animate-in fade-in duration-300 ${
                  isLight ? 'text-[#55524D]' : 'text-gray-400'
                }`}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
