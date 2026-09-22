'use client';

import React, { useEffect, useState } from 'react';

export function TermsScrollspy() {
  const [activeId, setActiveId] = useState('article-01');

  useEffect(() => {
    const articles = document.querySelectorAll('main article[id]');
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      articles.forEach(article => {
        const htmlArticle = article as HTMLElement;
        const top = htmlArticle.offsetTop - 200;
        const bottom = top + htmlArticle.offsetHeight;
        const id = htmlArticle.getAttribute('id') || '';
        
        if (scrollPosition >= top && scrollPosition < bottom) {
          setActiveId(id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // setTimeout to run after initial render
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 120,
        behavior: 'smooth'
      });
    }
  };

  const navItems = [
    { id: 'article-01', num: '01', label: 'General Conditions' },
    { id: 'article-02', num: '02', label: 'Products & Pricing' },
    { id: 'article-03', num: '03', label: 'Medical Disclaimer' },
    { id: 'article-04', num: '04', label: 'Shipping & Delivery' },
    { id: 'article-05', num: '05', label: 'Returns & Refunds' },
    { id: 'article-06', num: '06', label: 'Billing & Errors' },
    { id: 'article-07', num: '07', label: 'Limitation of Liability' },
    { id: 'article-08', num: '08', label: 'Privacy Policy' },
    { id: 'article-09', num: '09', label: 'Modifications' },
  ];

  return (
    <nav className="space-y-1.5 font-mono text-xs" id="gazette-index-nav">
      {navItems.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item.id)}
            className={`group flex items-center justify-between p-2.5 rounded border transition-all text-[#111915] ${
              isActive
                ? 'bg-[#FAF7F2] border-[#C4A482]/60 text-[#8C6D46] font-semibold'
                : 'border-transparent hover:bg-[#FAF7F2] hover:border-[#C4A482]/40'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-[#8C6D46] font-semibold tracking-wider">{item.num}.</span>
              <span className={`tracking-wider ${isActive ? '' : 'group-hover:text-[#8C6D46]'} transition-colors`}>
                {item.label}
              </span>
            </div>
            <span className="text-[10px] text-[#6E7771] group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
        );
      })}
    </nav>
  );
}
