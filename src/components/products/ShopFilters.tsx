'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { Product } from '@/types';
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Check } from 'lucide-react';

interface ShopFiltersProps {
  products: Product[];
}

type SortOption = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

interface SortItem {
  id: SortOption;
  label: string;
  badge?: string;
}

const SORT_OPTIONS: SortItem[] = [
  { id: 'featured', label: 'Featured', badge: 'Curated' },
  { id: 'newest', label: 'Newest Releases' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated', badge: '★ 4.9+' },
];

export function ShopFilters({ products }: ShopFiltersProps) {
  const [filter, setFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [isSortOpen, setIsSortOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Esc key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSortOpen(false);
    };

    if (isSortOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSortOpen]);

  const categories = useMemo(() => {
    const cats = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    );
    return ['ALL', ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const result =
      filter === 'ALL'
        ? [...products]
        : products.filter((p) => p.category === filter);

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort(
          (a, b) =>
            new Date((b as any).createdAt || 0).getTime() -
            new Date((a as any).createdAt || 0).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [products, filter, sortBy]);

  const currentSortItem = SORT_OPTIONS.find((opt) => opt.id === sortBy);

  return (
    <>
      {/* Category Tabs + Sort Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E5E0D8]">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <span className="text-[10px] uppercase font-mono text-[#77736C] tracking-widest mr-1 shrink-0 flex items-center gap-1.5 font-bold">
            <SlidersHorizontal size={12} />
            CATEGORY:
          </span>
          {categories.map((cat) => {
            const count =
              cat === 'ALL'
                ? products.length
                : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  filter === cat
                    ? 'bg-[#181817] text-white shadow-xs'
                    : 'bg-white text-[#55524D] border border-[#E5E0D8] hover:border-[#181817]'
                }`}
              >
                {cat === 'ALL' ? `ALL (${count})` : `${cat.toUpperCase()} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Premium Sort Dropdown */}
        <div ref={dropdownRef} className="relative self-end sm:self-auto shrink-0 z-30">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            aria-expanded={isSortOpen}
            aria-haspopup="listbox"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer border select-none ${
              isSortOpen
                ? 'bg-[#181817] text-[#FAF8F5] border-[#181817] shadow-sm'
                : 'bg-white text-[#181817] border-[#E5E0D8] hover:border-[#181817] shadow-2xs'
            }`}
          >
            <ArrowUpDown size={12} className={isSortOpen ? 'text-[#C4A482]' : 'text-[#2D4438]'} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#77736C]">Sort:</span>
            <span className="font-semibold text-xs text-inherit">{currentSortItem?.label || 'Featured'}</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-300 ${isSortOpen ? 'rotate-180 text-[#C4A482]' : 'text-[#77736C]'}`}
            />
          </button>

          {/* Dropdown Menu */}
          {isSortOpen && (
            <div
              role="listbox"
              className="absolute right-0 top-full mt-2 w-56 bg-[#FAF8F5] border border-[#DDD8CF] rounded-2xl p-1.5 shadow-[0_16px_36px_-8px_rgba(0,0,0,0.18)] z-40 animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
            >
              <div className="px-3 py-1.5 border-b border-[#EAE5DC] mb-1">
                <span className="text-[9px] font-mono uppercase tracking-widest font-bold text-[#77736C]">
                  Sort Formulations
                </span>
              </div>
              <div className="space-y-0.5">
                {SORT_OPTIONS.map((opt) => {
                  const isSelected = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#2D4438] text-white font-medium shadow-xs'
                          : 'text-[#44403C] hover:bg-[#F0EAE1] hover:text-[#181817]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{opt.label}</span>
                        {opt.badge && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded-md ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-[#EAE5DC] text-[#57534E]'
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {isSelected && <Check size={13} className="text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-sm font-light text-[#55524D] bg-white border border-[#E5E0D8] rounded-2xl max-w-lg mx-auto p-8 shadow-xs">
          No formulations found matching this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product, idx) => (
            <ProductCard
              key={product._id || product.id || product.slug}
              product={product}
              priority={idx === 0}
            />
          ))}
        </div>
      )}
    </>
  );
}
