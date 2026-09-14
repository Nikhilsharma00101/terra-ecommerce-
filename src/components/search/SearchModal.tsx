'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/context/CartContext';
import { journalArticles } from '@/data/journal';
import { Search, X, Loader2 } from 'lucide-react';
import { Product } from '@/types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch } = useUI();
  const { addItem } = useCart();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      // Fetch dynamic products from API
      setLoadingProducts(true);
      fetch('/api/products')
        .then((res) => (res.ok ? res.json() : { products: [] }))
        .then((data) => {
          setProducts(data.products || []);
        })
        .catch((err) => console.error('Search modal product fetch error:', err))
        .finally(() => setLoadingProducts(false));
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          (p.tagline && p.tagline.toLowerCase().includes(cleanQuery)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(cleanQuery)) ||
          (p.ingredientsList && p.ingredientsList.some((i) => i.toLowerCase().includes(cleanQuery))) ||
          (p.keyIngredients &&
            p.keyIngredients.some(
              (k) =>
                k.name.toLowerCase().includes(cleanQuery) ||
                k.role.toLowerCase().includes(cleanQuery)
            ))
      )
    : [];

  const matchedArticles = cleanQuery
    ? journalArticles.filter(
        (a) =>
          a.title.toLowerCase().includes(cleanQuery) ||
          a.excerpt.toLowerCase().includes(cleanQuery) ||
          a.category.toLowerCase().includes(cleanQuery) ||
          a.keyTakeaways.some((t) => t.toLowerCase().includes(cleanQuery))
      )
    : [];

  const trendingTerms = [
    'The Method',
    'Salicylic Acid',
    'Beard Oil',
    'Cleanse',
    'Jojoba',
    'Morning Routine',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F6F3ED]/98 backdrop-blur-md animate-in fade-in duration-200">
      <div className="max-w-4xl mx-auto px-6 py-8 sm:py-16 min-h-screen flex flex-col">
        {/* Top bar with close button */}
        <div className="flex items-center justify-between pb-8 border-b border-[#DDD8CF]">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#77736C] font-semibold">
            TERRA SEARCH
          </span>
          <button
            onClick={closeSearch}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#181817] hover:text-[#2D4438] transition-colors p-2"
            aria-label="Close search"
          >
            <span>CLOSE</span>
            <X size={18} />
          </button>
        </div>

        {/* Large Search Input */}
        <div className="py-8">
          <div className="relative flex items-center">
            <Search size={26} className="text-[#77736C] absolute left-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, ingredients, articles..."
              className="w-full bg-transparent border-b-2 border-[#181817] pl-10 pr-4 py-4 text-xl sm:text-3xl font-serif text-[#181817] placeholder-[#A39E96] focus:outline-none tracking-wide"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[#77736C] hover:text-[#181817] p-2 absolute right-0"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Quick Suggestions / Trending Searches */}
          {!query && (
            <div className="mt-8">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#77736C] font-medium block mb-3">
                EXPLORE BY ESSENTIALS
              </span>
              <div className="flex flex-wrap gap-2">
                {trendingTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="bg-[#EAE5DC] hover:bg-[#181817] hover:text-[#F6F3ED] text-[#181817] text-xs px-3.5 py-1.5 transition-colors uppercase tracking-wider font-medium cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results Display */}
        {query && (
          <div className="flex-1 space-y-12 pb-16">
            {/* Products results */}
            {loadingProducts ? (
              <div className="py-6 flex items-center gap-2 text-xs font-semibold text-[#57534E]">
                <Loader2 size={16} className="animate-spin text-[#2D4438]" />
                <span>Searching catalog...</span>
              </div>
            ) : matchedProducts.length > 0 ? (
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#77736C] font-semibold block mb-4">
                  PRODUCTS ({matchedProducts.length})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchedProducts.map((product) => (
                    <div
                      key={product._id || product.id || product.slug}
                      className="bg-[#FBF9F5] border border-[#DDD8CF] p-4 flex gap-4 items-center group"
                    >
                      <div className="w-20 h-24 bg-[#EAE5DC] relative shrink-0 overflow-hidden">
                        <Image
                          src={product.featuredImage}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-[9px] uppercase tracking-widest text-[#2D4438] font-semibold">
                          {product.tagline}
                        </span>
                        <h4 className="font-serif text-lg text-[#181817] font-medium">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#77736C] mt-0.5 font-mono">
                          ₹{product.price} • {product.size}
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                          <Link
                            href={`/shop/${product.slug}`}
                            onClick={closeSearch}
                            className="text-[10px] uppercase tracking-widest text-[#181817] font-semibold hover:text-[#2D4438] underline"
                          >
                            DISCOVER
                          </Link>
                          <button
                            onClick={() => {
                              addItem(product);
                              closeSearch();
                            }}
                            className="text-[10px] uppercase tracking-widest text-[#2D4438] font-semibold hover:underline cursor-pointer"
                          >
                            + ADD TO BAG
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Articles results */}
            {matchedArticles.length > 0 && (
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#77736C] font-semibold block mb-4">
                  JOURNAL & RITUAL ({matchedArticles.length})
                </span>
                <div className="space-y-4">
                  {matchedArticles.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/journal/${article.slug}`}
                      onClick={closeSearch}
                      className="block bg-[#FBF9F5] border border-[#DDD8CF] p-5 hover:border-[#181817] transition-all group"
                    >
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#77736C] mb-1">
                        <span>{article.category}</span>
                        <span>{article.readTime}</span>
                      </div>
                      <h4 className="font-serif text-xl text-[#181817] group-hover:text-[#2D4438] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-xs text-[#77736C] mt-1.5 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center text-[10px] uppercase tracking-widest text-[#181817] font-semibold mt-3 group-hover:translate-x-1 transition-transform">
                        Read Story &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No results state */}
            {!loadingProducts && matchedProducts.length === 0 && matchedArticles.length === 0 && (
              <div className="py-12 text-center">
                <p className="font-serif text-2xl text-[#77736C] font-light">
                  No results found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[#99948D] mt-2 max-w-sm mx-auto">
                  Try searching for &ldquo;Cleanse&rdquo;, &ldquo;Beard Oil&rdquo;, &ldquo;Method&rdquo;, or &ldquo;Ritual&rdquo;.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
