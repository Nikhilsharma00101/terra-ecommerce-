'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { journalArticles } from '@/data/journal';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import {
  ArrowRight,
  Clock,
  Search,
  BookOpen,
  Bookmark,
  Sparkles,
  SlidersHorizontal,
  Share2,
  Check,
  Calendar,
  Tag,
  BookmarkCheck,
  X,
  Star,
  ShoppingBag,
  Plus,
  Layers,
  FlaskConical
} from 'lucide-react';

const BOOKMARK_STORAGE_KEY = 'terra_journal_bookmarks';

// Safe image resolver from live MongoDB Product instance
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

// Resolver to match article's related product from dynamic DB catalog
function findRelatedDbProduct(relatedSlug: string | undefined, products: Product[]): Product | undefined {
  if (!products || products.length === 0) return undefined;
  if (!relatedSlug) return products[0];

  const clean = relatedSlug.toLowerCase().replace('terra-', '');
  return (
    products.find((p) => {
      const pSlug = (p.slug || '').toLowerCase();
      const pId = (p.id || p._id || '').toString().toLowerCase();
      const pName = (p.name || '').toLowerCase();
      return (
        pSlug === relatedSlug ||
        pSlug === clean ||
        pSlug.includes(clean) ||
        pId === relatedSlug ||
        pId === clean ||
        pName.includes(clean)
      );
    }) || products[0]
  );
}

export function JournalClientHub() {
  const { products, loading: productsLoading } = useProducts();
  const { addItem, openCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<Set<string>>(new Set());
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [addedProductSlug, setAddedProductSlug] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) {
        setBookmarkedSlugs(new Set(JSON.parse(saved)));
      }
    } catch (err) {
      console.error('Failed to load bookmarks', err);
    }
  }, []);

  // Save bookmarks to localStorage
  const toggleBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBookmarkedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      try {
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error('Failed to save bookmark', err);
      }
      return next;
    });
  };

  // Categories & Counts
  const categories = useMemo(() => {
    const cats = ['ALL', 'Skin Science', 'Daily Routine', 'Philosophy'];
    return cats.map((cat) => {
      const count =
        cat === 'ALL'
          ? journalArticles.length
          : journalArticles.filter((a) => a.category === cat).length;
      return { name: cat, count };
    });
  }, []);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return journalArticles.filter((article) => {
      if (onlySaved && !bookmarkedSlugs.has(article.slug)) {
        return false;
      }
      const matchesCategory =
        selectedCategory === 'ALL' || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (article.tags &&
          article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, onlySaved, bookmarkedSlugs]);

  // Is viewing the standard unfiltered page?
  const isDefaultView = selectedCategory === 'ALL' && searchQuery.trim() === '' && !onlySaved;
  const featuredArticle = isDefaultView
    ? journalArticles.find((a) => a.featured) || journalArticles[0]
    : null;
  const remainingArticles = isDefaultView
    ? filteredArticles.filter((a) => a.slug !== featuredArticle?.slug)
    : filteredArticles;

  // Resolve persistent DB product for the featured article
  const featuredDbProduct = useMemo(() => {
    if (!featuredArticle) return undefined;
    return findRelatedDbProduct(featuredArticle.relatedProductSlug, products);
  }, [featuredArticle, products]);

  const handleShare = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/journal/${slug}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    setAddedProductSlug(product.slug);
    setTimeout(() => {
      setAddedProductSlug(null);
      openCart();
    }, 1200);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setIsSubscribing(true);
    // Simulate network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    setIsSubscribing(false);
    setTimeout(() => setNewsletterSubscribed(false), 5000);
  };

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
            <span className="text-[#181817] font-semibold">The Journal</span>
          </div>

          <div className="flex items-center gap-4">
            {bookmarkedSlugs.size > 0 && (
              <button
                onClick={() => {
                  setOnlySaved(!onlySaved);
                  setSelectedCategory('ALL');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium transition-all cursor-pointer ${
                  onlySaved
                    ? 'bg-[#2D4438] text-white shadow-xs'
                    : 'bg-white text-[#55524D] border border-[#E8E2D7] hover:border-[#181817]'
                }`}
              >
                <BookmarkCheck size={12} />
                <span>Saved ({bookmarkedSlugs.size})</span>
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2 text-[#2D4438]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2D4438] animate-pulse" />
              <span className="font-medium">Issue 04 • Skin Biology & Clean Rituals</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        
        {/* Editorial Masthead */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D7] text-[11px] font-medium uppercase tracking-[0.2em] text-[#2D4438] shadow-xs mb-5">
            <Sparkles size={12} className="text-[#8C6D46]" />
            <span>Publications & Formulation Science</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-[#181817] font-light tracking-tight leading-[1.05]">
            The Terra Journal
          </h1>
          
          <p className="font-serif text-lg sm:text-xl text-[#77736C] mt-4 font-light italic leading-relaxed max-w-xl mx-auto">
            Practical essays on dermal physiology, cold-pressed plant botanicals, and the discipline of essential grooming.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E8E2D7] p-3 sm:p-4 mb-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-mono text-[#77736C] tracking-widest mr-1 shrink-0 flex items-center gap-1.5 font-bold">
              <SlidersHorizontal size={12} />
              Category:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name && !onlySaved;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setOnlySaved(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#181817] text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-[#55524D] border border-[#E8E2D7] hover:border-[#181817] hover:text-[#181817]'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#E8E2D7] text-[#77736C]'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Search dispatches & topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E2D7] rounded-xl px-4 py-2.5 pl-10 pr-10 text-xs text-[#181817] placeholder-[#77736C] focus:outline-none focus:border-[#181817] transition-all"
            />
            <Search size={14} className="absolute left-3.5 top-3 text-[#77736C]" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-0.5 text-[#77736C] hover:text-[#181817] transition-colors"
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter State Banner if search or category is active */}
        {!isDefaultView && (
          <div className="mb-8 flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-[#E8E2D7]">
            <div className="flex items-center gap-2 text-xs font-medium text-[#181817]">
              <span>Showing:</span>
              <span className="font-semibold text-[#2D4438]">
                {onlySaved
                  ? 'Saved Articles'
                  : searchQuery
                  ? `Search for "${searchQuery}"`
                  : `${selectedCategory} Category`}
              </span>
              <span className="text-[#77736C]">({filteredArticles.length} found)</span>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
                setOnlySaved(false);
              }}
              className="text-[11px] uppercase font-mono tracking-wider text-[#77736C] hover:text-[#181817] underline cursor-pointer"
            >
              Reset to All
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E8E2D7] p-12 sm:p-16 text-center max-w-lg mx-auto">
            <BookOpen size={36} className="mx-auto text-[#77736C] mb-4 opacity-50" />
            <h3 className="font-serif text-2xl text-[#181817] font-medium">No dispatches found</h3>
            <p className="text-xs text-[#77736C] mt-2 leading-relaxed">
              {onlySaved
                ? 'You have not bookmarked any dispatches yet. Click the bookmark icon on any article to save it for later.'
                : `We couldn't find any articles matching "${searchQuery}". Try searching for terms like "skin", "beard", or "cleanse".`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
                setOnlySaved(false);
              }}
              className="mt-6 px-6 py-2.5 bg-[#181817] text-white rounded-xl text-xs uppercase font-semibold tracking-wider hover:bg-[#2D4438] transition-colors cursor-pointer"
            >
              View All Articles
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* HERO COVER STORY (Shown on Default Unfiltered Hub View) */}
            {featuredArticle && (
              <div className="bg-white rounded-3xl border border-[#E8E2D7] overflow-hidden shadow-xs hover:shadow-md transition-shadow group">
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  
                  {/* Image Block */}
                  <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] lg:min-h-[480px] bg-[#EAE5DC] overflow-hidden">
                    <Link href={`/journal/${featuredArticle.slug}`} className="block h-full w-full relative">
                      <Image
                        src={featuredArticle.coverImage}
                        alt={featuredArticle.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </Link>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <span className="bg-[#181817] text-white text-[9px] uppercase font-bold tracking-widest px-3 py-1 rounded-full shadow-xs">
                        Cover Story
                      </span>
                      <span className="bg-[#2D4438] text-white text-[9px] uppercase font-semibold tracking-widest px-3 py-1 rounded-full shadow-xs">
                        {featuredArticle.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90 text-xs font-mono">
                      <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                        <Clock size={12} />
                        {featuredArticle.readTime}
                      </span>
                      <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full hidden sm:inline">
                        {featuredArticle.date}
                      </span>
                    </div>
                  </div>

                  {/* Text Content Block */}
                  <div className="lg:col-span-5 p-7 sm:p-9 lg:p-11 flex flex-col justify-between space-y-6">
                    <div>
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#77736C] font-mono mb-3">
                        <Calendar size={12} />
                        <span>{featuredArticle.date}</span>
                        <span>•</span>
                        <span>{featuredArticle.author}</span>
                      </div>

                      <Link href={`/journal/${featuredArticle.slug}`} className="block group/title">
                        <h2 className="font-serif text-3xl sm:text-4xl text-[#181817] font-medium leading-[1.15] mb-3 group-hover/title:text-[#2D4438] transition-colors">
                          {featuredArticle.title}
                        </h2>
                      </Link>

                      <p className="font-serif text-base text-[#77736C] italic mb-4 font-light">
                        "{featuredArticle.subtitle}"
                      </p>

                      <p className="text-xs sm:text-sm text-[#55524D] leading-relaxed line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>

                      {/* Pull Quote */}
                      {featuredArticle.quote && (
                        <blockquote className="mt-4 border-l-2 border-[#8C6D46] pl-3 py-1 text-xs italic font-serif text-[#77736C] bg-[#FAF8F5] rounded-r-lg p-2.5">
                          "{featuredArticle.quote}"
                        </blockquote>
                      )}

                      {/* DYNAMIC DB PRODUCT COMPANION MINI-CARD */}
                      {featuredDbProduct && (
                        <div className="mt-5 p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D7] flex items-center justify-between gap-3 group/prod">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-14 rounded-xl overflow-hidden bg-[#1A1918] relative shrink-0 border border-[#E8E2D7]">
                              <Image
                                src={resolveProductImage(featuredDbProduct)}
                                alt={featuredDbProduct.name || "Product image"}
                                fill
                                className="object-cover group-hover/prod:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[#2D4438] font-bold block truncate">
                                EXPLORED FORMULATION
                              </span>
                              <Link
                                href={`/shop/${featuredDbProduct.slug}`}
                                className="font-serif text-sm text-[#181817] font-medium hover:text-[#2D4438] transition-colors truncate block"
                              >
                                {featuredDbProduct.name}
                              </Link>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-[#77736C]">
                                <span className="font-bold text-[#181817]">₹{featuredDbProduct.price}</span>
                                {featuredDbProduct.rating && (
                                  <span className="flex items-center gap-0.5 text-[#8C6D46]">
                                    <Star size={10} className="fill-[#8C6D46]" />
                                    {featuredDbProduct.rating}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(e, featuredDbProduct)}
                            className="p-2.5 bg-[#181817] text-white hover:bg-[#2D4438] rounded-xl transition-colors shrink-0 shadow-xs cursor-pointer"
                            title="Add Formulation to Bag"
                          >
                            {addedProductSlug === featuredDbProduct.slug ? (
                              <Check size={14} className="text-[#C4A482]" />
                            ) : (
                              <Plus size={14} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-5 border-t border-[#E8E2D7] flex items-center justify-between">
                      <Link
                        href={`/journal/${featuredArticle.slug}`}
                        className="bg-[#181817] text-white px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#2D4438] transition-all inline-flex items-center gap-2 group/btn shadow-xs cursor-pointer"
                      >
                        <span>Read Full Dispatch</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleShare(featuredArticle.slug, e)}
                          className="p-2.5 rounded-xl border border-[#E8E2D7] text-[#77736C] hover:text-[#181817] hover:border-[#181817] transition-all bg-white cursor-pointer"
                          title="Copy dispatch link"
                        >
                          {copiedSlug === featuredArticle.slug ? (
                            <Check size={15} className="text-[#2D4438]" />
                          ) : (
                            <Share2 size={15} />
                          )}
                        </button>
                        <button
                          onClick={(e) => toggleBookmark(featuredArticle.slug, e)}
                          className="p-2.5 rounded-xl border border-[#E8E2D7] text-[#77736C] hover:text-[#181817] hover:border-[#181817] transition-all bg-white cursor-pointer"
                          title={bookmarkedSlugs.has(featuredArticle.slug) ? 'Remove bookmark' : 'Save article'}
                        >
                          <Bookmark
                            size={15}
                            className={bookmarkedSlugs.has(featuredArticle.slug) ? 'fill-[#181817] text-[#181817]' : ''}
                          />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* CURATED ARTICLES FEED GRID */}
            {remainingArticles.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8E2D7]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#2D4438]" />
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium">
                      {isDefaultView ? 'All Dispatches' : 'Filtered Results'}
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#77736C] uppercase tracking-wider">
                    {remainingArticles.length} {remainingArticles.length === 1 ? 'Dispatch' : 'Dispatches'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {remainingArticles.map((article) => {
                    // Resolve live DB product for this specific article
                    const dbProduct = findRelatedDbProduct(article.relatedProductSlug, products);

                    return (
                      <article
                        key={article.slug}
                        className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden flex flex-col justify-between group hover:border-[#181817] hover:shadow-md transition-all duration-300"
                      >
                        <div>
                          {/* Article Image Container */}
                          <Link href={`/journal/${article.slug}`} className="block relative aspect-16/10 bg-[#EAE5DC] overflow-hidden">
                            <Image
                              src={article.coverImage}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute top-3.5 left-3.5 bg-[#181817]/90 text-white text-[9px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                              {article.category}
                            </div>
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <Clock size={11} />
                              {article.readTime}
                            </div>
                          </Link>

                          {/* Article Meta & Info */}
                          <div className="p-6">
                            <div className="flex items-center justify-between text-[10px] text-[#77736C] font-mono mb-2.5">
                              <span>{article.date}</span>
                              <span>{article.author}</span>
                            </div>

                            <Link href={`/journal/${article.slug}`}>
                              <h4 className="font-serif text-xl sm:text-2xl text-[#181817] font-medium leading-snug group-hover:text-[#2D4438] transition-colors mb-2">
                                {article.title}
                              </h4>
                            </Link>

                            <p className="text-xs text-[#55524D] leading-relaxed line-clamp-3 mb-4 font-light">
                              {article.excerpt}
                            </p>

                            {/* DYNAMIC DB PRODUCT MINI CHIP */}
                            {dbProduct && (
                              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E8E2D7] flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-9 h-10 rounded-lg overflow-hidden bg-[#1A1918] shrink-0 border border-[#E8E2D7]">
                                    <Image
                                      src={resolveProductImage(dbProduct)}
                                      alt={dbProduct.name || "Product"}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="text-[8px] uppercase tracking-wider text-[#2D4438] font-bold font-mono block">
                                      Referenced Formulation
                                    </span>
                                    <span className="text-xs font-serif font-medium text-[#181817] block truncate">
                                      {dbProduct.name}
                                    </span>
                                  </div>
                                </div>

                                <span className="text-xs font-mono font-bold text-[#181817] shrink-0">
                                  ₹{dbProduct.price}
                                </span>
                              </div>
                            )}

                            {/* Takeaway bullet if present */}
                            {article.keyTakeaways && article.keyTakeaways[0] && (
                              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E2D7] text-[11px] text-[#55524D] font-mono mt-3">
                                <span className="text-[#8C6D46] font-semibold block mb-0.5 uppercase tracking-wider text-[9px]">
                                  Core Insight
                                </span>
                                <span className="line-clamp-2">{article.keyTakeaways[0]}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Card Footer */}
                        <div className="p-6 pt-0 flex items-center justify-between border-t border-[#E8E2D7] mt-4 pt-4">
                          <Link
                            href={`/journal/${article.slug}`}
                            className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-[#181817] group-hover:text-[#2D4438] transition-colors cursor-pointer"
                          >
                            <span>Read Dispatch</span>
                            <ArrowRight size={13} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                          </Link>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => handleShare(article.slug, e)}
                              className="text-[#77736C] hover:text-[#181817] p-1.5 hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
                              title="Copy link"
                            >
                              {copiedSlug === article.slug ? <Check size={14} className="text-[#2D4438]" /> : <Share2 size={14} />}
                            </button>
                            <button
                              onClick={(e) => toggleBookmark(article.slug, e)}
                              className="text-[#77736C] hover:text-[#181817] p-1.5 hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
                              title={bookmarkedSlugs.has(article.slug) ? 'Remove bookmark' : 'Save article'}
                            >
                              <Bookmark
                                size={15}
                                className={bookmarkedSlugs.has(article.slug) ? 'fill-[#181817] text-[#181817]' : ''}
                              />
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* DYNAMIC DB FORMULATIONS IN THIS EDITION SHELF */}
        {products && products.length > 0 && (
          <div className="mt-16 sm:mt-20 pt-12 border-t border-[#E8E2D7]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#2D4438] font-bold flex items-center gap-1.5 mb-1">
                  <FlaskConical size={13} />
                  LAB CATALOG & STUDY SAMPLES
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium">
                  Formulations Explored in This Issue
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-wider font-semibold text-[#2D4438] hover:text-[#181817] transition-colors inline-flex items-center gap-1"
              >
                <span>View Full Dispensary</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((prod) => (
                <div
                  key={prod.slug || prod.id}
                  className="bg-white rounded-2xl border border-[#E8E2D7] p-5 flex items-center justify-between gap-4 group hover:border-[#181817] hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-20 bg-[#1A1918] rounded-xl overflow-hidden relative shrink-0 border border-[#E8E2D7]">
                      <Image
                        src={resolveProductImage(prod)}
                        alt={prod.name || "Product image"}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-[#2D4438] font-bold block truncate">
                        {prod.category} • {prod.size}
                      </span>
                      <Link
                        href={`/shop/${prod.slug}`}
                        className="font-serif text-base text-[#181817] font-medium hover:text-[#2D4438] transition-colors truncate block"
                      >
                        {prod.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono font-bold text-[#181817]">₹{prod.price}</span>
                        {prod.compareAtPrice && prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] font-mono text-[#77736C] line-through">
                            ₹{prod.compareAtPrice}
                          </span>
                        )}
                        {prod.rating && (
                          <span className="text-[10px] font-mono text-[#8C6D46] flex items-center gap-0.5">
                            <Star size={9} className="fill-[#8C6D46]" />
                            {prod.rating}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, prod)}
                    className="bg-[#181817] text-white p-3 rounded-xl hover:bg-[#2D4438] transition-colors shrink-0 shadow-xs cursor-pointer"
                    title="Quick Add to Bag"
                  >
                    {addedProductSlug === prod.slug ? (
                      <Check size={14} className="text-[#C4A482]" />
                    ) : (
                      <ShoppingBag size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PHILOSOPHY MANIFESTO BANNER */}
        <div className="mt-16 sm:mt-24 rounded-3xl bg-[#2D4438] text-[#FAF8F5] p-8 sm:p-16 relative overflow-hidden text-center shadow-lg">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-[10px] uppercase tracking-[0.25em] font-mono text-[#C4A482] font-semibold">
              The Terra Formulation Manifesto
            </span>
            <blockquote className="font-serif text-2xl sm:text-4xl text-white font-light italic leading-snug">
              "True grooming simplicity is not the absence of effort—it is the ultimate concentration of purpose."
            </blockquote>
            <div className="w-10 h-0.5 bg-[#C4A482] mx-auto opacity-70" />
            <p className="text-xs text-[#DDD8CF] font-mono uppercase tracking-widest">
              Rooted in botanical science • Formulated for daily consistency
            </p>
          </div>
        </div>

        {/* NEWSLETTER SUBSCRIPTION MODULE */}
        <div className="mt-12 sm:mt-16 bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-14 text-center max-w-3xl mx-auto shadow-xs">
          <div className="max-w-xl mx-auto space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#2D4438] font-semibold block">
              Bi-Weekly Editorial Digest
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#181817] font-medium">
              Join The Terra Dispatch
            </h3>
            <p className="text-xs sm:text-sm text-[#77736C] leading-relaxed">
              Concise dispatches on skin biology, cold-pressed oils, and morning ritual design delivered to your inbox every other Sunday.
            </p>

            {newsletterSubscribed ? (
              <div className="p-3.5 bg-[#2D4438]/10 text-[#2D4438] rounded-xl text-xs font-medium font-mono flex items-center justify-center gap-2">
                <Check size={16} />
                <span>You are on the dispatch list. Welcome to Terra.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 pt-3">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#FAF8F5] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs text-[#181817] placeholder-[#77736C] focus:outline-none focus:border-[#181817] flex-1 font-mono transition-all"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className={`px-7 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors shrink-0 shadow-xs relative ${
                    isSubscribing ? 'bg-[#181817] text-white opacity-90 cursor-not-allowed' : 'bg-[#181817] text-white hover:bg-[#2D4438] cursor-pointer'
                  }`}
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}

            <p className="text-[10px] text-[#77736C] font-mono">
              No promotions or noise. Unsubscribe at any time with one click.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
