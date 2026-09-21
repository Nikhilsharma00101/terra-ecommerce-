'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, journalArticles } from '@/data/journal';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import {
  ArrowLeft,
  Clock,
  ArrowRight,
  CheckCircle2,
  Share2,
  Bookmark,
  Check,
  BookOpen,
  Sparkles,
  Calendar,
  Tag,
  ShoppingBag,
  Plus,
  Star,
  ShieldCheck,
  Leaf,
  Layers,
  Flame,
  FlaskConical
} from 'lucide-react';

const BOOKMARK_STORAGE_KEY = 'terra_journal_bookmarks';

// Safe image resolver from live MongoDB Product instance
function resolveProductImage(prod?: Product | null, index = 0): string {
  if (!prod) return '/images/home/hero-products.jpeg';
  if (prod.images && Array.isArray(prod.images) && prod.images.length > index && prod.images[index]?.url) {
    return prod.images[index].url;
  }
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

interface JournalArticleClientProps {
  slug: string;
}

export function JournalArticleClient({ slug }: JournalArticleClientProps) {
  const article = getArticleBySlug(slug);
  const { products } = useProducts();
  const { addItem, openCart } = useCart();

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Sync bookmark state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      if (saved) {
        const slugs: string[] = JSON.parse(saved);
        setIsBookmarked(slugs.includes(slug));
      }
    } catch (err) {
      console.error('Failed to load bookmark', err);
    }
  }, [slug]);

  // Scroll Progress and active section detector
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }

      if (article && article.content) {
        article.content.forEach((_, idx) => {
          const el = document.getElementById(`section-${idx}`);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 160 && rect.bottom >= 100) {
              setActiveSection(idx);
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  if (!article) {
    notFound();
  }

  // Dynamic live DB formulation matching this article
  const relatedDbProduct = useMemo(() => {
    return findRelatedDbProduct(article.relatedProductSlug, products);
  }, [article.relatedProductSlug, products]);

  const currentIndex = journalArticles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? journalArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < journalArticles.length - 1 ? journalArticles[currentIndex + 1] : null;
  const otherArticles = journalArticles.filter((a) => a.slug !== article.slug);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
      const slugs: string[] = saved ? JSON.parse(saved) : [];
      let nextSlugs: string[];
      if (slugs.includes(article.slug)) {
        nextSlugs = slugs.filter((s) => s !== article.slug);
        setIsBookmarked(false);
      } else {
        nextSlugs = [...slugs, article.slug];
        setIsBookmarked(true);
      }
      localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(nextSlugs));
    } catch (err) {
      console.error('Failed to save bookmark', err);
    }
  };

  const handleShare = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuickBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!relatedDbProduct) return;
    addItem(relatedDbProduct, 1);
    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
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

  const savingsAmount =
    relatedDbProduct &&
    relatedDbProduct.compareAtPrice &&
    relatedDbProduct.compareAtPrice > relatedDbProduct.price
      ? relatedDbProduct.compareAtPrice - relatedDbProduct.price
      : 0;

  return (
    <article className="min-h-screen bg-[#FAF8F5] text-[#181817] pb-24 selection:bg-[#2D4438] selection:text-white relative">
      
      {/* Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[#E8E2D7]/50">
        <div
          className="h-full bg-[#2D4438] transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Sticky Navigation Sub-Bar */}
      <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#E8E2D7] py-3 px-4 sm:px-8 transition-all">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <Link
            href="/journal"
            className="inline-flex items-center text-xs uppercase tracking-wider text-[#77736C] hover:text-[#181817] transition-colors gap-2 font-medium cursor-pointer shrink-0"
          >
            <ArrowLeft size={14} />
            <span>Back to Journal</span>
          </Link>

          {/* Center Formulation Quick Indicator */}
          {relatedDbProduct && (
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1 bg-[#FAF8F5] border border-[#E8E2D7] rounded-full text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#2D4438]" />
              <span className="text-[#77736C]">Formulation:</span>
              <span className="font-semibold text-[#181817] font-serif">{relatedDbProduct.name}</span>
              <span className="text-[#2D4438] font-bold">₹{relatedDbProduct.price}</span>
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleBookmark}
              className="p-2 rounded-xl border border-[#E8E2D7] text-[#77736C] hover:text-[#181817] hover:border-[#181817] transition-all bg-white cursor-pointer"
              title={isBookmarked ? 'Remove bookmark' : 'Save article'}
            >
              <Bookmark size={15} className={isBookmarked ? 'fill-[#181817] text-[#181817]' : ''} />
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-[#181817] text-white px-3.5 py-2 rounded-xl hover:bg-[#2D4438] transition-colors shadow-xs cursor-pointer"
            >
              {copied ? <Check size={14} className="text-[#C4A482]" /> : <Share2 size={14} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        
        {/* Article Header */}
        <header className="max-w-3xl mx-auto space-y-6 mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8E2D7] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2D4438] shadow-xs">
            <span>{article.category}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#77736C]">
              <Clock size={11} />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#181817] font-light leading-[1.1] tracking-tight">
            {article.title}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#77736C] font-light italic leading-relaxed max-w-2xl mx-auto">
            "{article.subtitle}"
          </p>

          <div className="flex items-center justify-center gap-4 pt-4 text-xs font-mono text-[#77736C]">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {article.date}
            </span>
            <span>•</span>
            <span>By {article.author}</span>
          </div>
        </header>

        {/* Hero Cover Image */}
        <div className="relative aspect-16/9 sm:aspect-21/9 w-full rounded-3xl overflow-hidden border border-[#E8E2D7] shadow-xs mb-14 bg-[#EAE5DC]">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1024px"
          />
        </div>

        {/* Content Layout (Sidebar TOC + Article Body) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
          
          {/* Table of Contents / Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6 sticky top-24 h-fit">
            
            {/* TOC Card */}
            <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#2D4438] border-b border-[#E8E2D7] pb-3">
                <BookOpen size={14} />
                <span>In This Article</span>
              </div>
              <ul className="space-y-3 text-xs">
                {article.content.map((sec, idx) => (
                  <li key={idx}>
                    <a
                      href={`#section-${idx}`}
                      className={`transition-colors flex items-start gap-2 group/toc font-mono text-[11px] ${
                        activeSection === idx
                          ? 'text-[#2D4438] font-bold'
                          : 'text-[#77736C] hover:text-[#181817]'
                      }`}
                    >
                      <span className={`${activeSection === idx ? 'text-[#2D4438]' : 'text-[#8C6D46]'} font-semibold`}>
                        0{idx + 1}.
                      </span>
                      <span className="group-hover/toc:translate-x-0.5 transition-transform">
                        {sec.heading || `Section ${idx + 1}`}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* DYNAMIC DB FORMULATION COMPANION SIDEBAR WIDGET */}
            {relatedDbProduct && (
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-[#E8E2D7] pb-2.5">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#2D4438] font-bold flex items-center gap-1">
                    <FlaskConical size={12} />
                    COMPANION FORMULATION
                  </span>
                  <span className="text-[9px] font-mono text-[#77736C]">LAB DB</span>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-20 bg-[#1A1918] relative rounded-xl overflow-hidden shrink-0 border border-[#E8E2D7]">
                    <img
                      src={resolveProductImage(relatedDbProduct, activeImageIndex)}
                      alt={relatedDbProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-mono text-[#77736C] block">
                      {relatedDbProduct.category} • {relatedDbProduct.size}
                    </span>
                    <h5 className="font-serif text-sm text-[#181817] font-medium leading-tight truncate">
                      {relatedDbProduct.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1 font-mono">
                      <span className="text-xs font-bold text-[#181817]">₹{relatedDbProduct.price}</span>
                      {relatedDbProduct.rating && (
                        <span className="text-[10px] text-[#8C6D46] flex items-center gap-0.5">
                          <Star size={9} className="fill-[#8C6D46]" />
                          {relatedDbProduct.rating}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleQuickBuy}
                    className="flex-1 bg-[#181817] text-white py-2 px-3 rounded-xl text-[10px] uppercase tracking-wider font-semibold hover:bg-[#2D4438] transition-colors flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    {addedToCart ? <Check size={12} /> : <Plus size={12} />}
                    <span>{addedToCart ? 'Added' : 'Add to Bag'}</span>
                  </button>

                  <Link
                    href={`/shop/${relatedDbProduct.slug}`}
                    className="p-2 rounded-xl border border-[#E8E2D7] text-[#181817] hover:border-[#181817] transition-colors"
                    title="View details"
                  >
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}

            {/* Pull Quote Widget */}
            {article.quote && (
              <div className="bg-[#2D4438] text-white rounded-2xl p-6 space-y-3 shadow-xs">
                <span className="text-[10px] uppercase tracking-widest font-mono text-[#C4A482] font-semibold block">
                  Core Axiom
                </span>
                <p className="font-serif italic text-sm text-[#DDD8CF] leading-relaxed">
                  "{article.quote}"
                </p>
              </div>
            )}

          </aside>

          {/* Main Article Body */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Key Takeaways Card */}
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#E8E2D7] p-6 sm:p-8 shadow-xs border-l-4 border-l-[#2D4438]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} className="text-[#8C6D46]" />
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#2D4438]">
                    Key Takeaways & Dermal Principles
                  </span>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-[#55524D]">
                  {article.keyTakeaways.map((takeaway, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-[#2D4438] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prose Content Sections */}
            <div className="space-y-10 text-[#4A4742] text-sm sm:text-base leading-relaxed">
              {article.content.map((section, idx) => (
                <section key={idx} id={`section-${idx}`} className="space-y-4 scroll-mt-24">
                  {section.heading && (
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium pt-4 border-t border-[#E8E2D7] flex items-center gap-3">
                      <span className="font-mono text-xs text-[#8C6D46] font-normal">0{idx + 1}</span>
                      <span>{section.heading}</span>
                    </h2>
                  )}

                  <p
                    className={`leading-loose font-light ${
                      idx === 0
                        ? 'first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-serif first-letter:pr-3 first-letter:text-[#2D4438] first-letter:font-normal'
                        : ''
                    }`}
                  >
                    {section.paragraph}
                  </p>
                </section>
              ))}
            </div>

            {/* Pull Quote Box */}
            {article.quote && (
              <div className="my-10 p-8 sm:p-10 bg-white rounded-3xl border border-[#E8E2D7] text-center shadow-xs">
                <blockquote className="font-serif text-2xl sm:text-3xl text-[#181817] font-light italic leading-snug">
                  "{article.quote}"
                </blockquote>
                <div className="w-12 h-0.5 bg-[#8C6D46] mx-auto mt-5 opacity-60" />
              </div>
            )}

            {/* Tags */}
            {article.tags && (
              <div className="pt-6 border-t border-[#E8E2D7] flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#77736C]">Tags:</span>
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-3 py-1 bg-white border border-[#E8E2D7] text-[#55524D] rounded-lg inline-flex items-center gap-1"
                  >
                    <Tag size={10} className="text-[#8C6D46]" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* EXPANDED DYNAMIC PERSISTENT DB FORMULATION SECTION */}
            {relatedDbProduct && (
              <div className="mt-14 pt-10 border-t border-[#E8E2D7]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#2D4438] flex items-center gap-1.5 font-mono">
                    <FlaskConical size={14} />
                    COMPANION BOTANICAL FORMULATION (LIVE DISPENSARY)
                  </span>
                  <span className="text-[10px] font-mono text-[#8C6D46] uppercase font-semibold">
                    DISCUSSED IN ESSAY
                  </span>
                </div>

                <div className="bg-white rounded-3xl border border-[#E8E2D7] p-6 sm:p-8 shadow-sm group hover:border-[#181817] transition-all">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Product Image Box with Multi-Image Support */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="w-full aspect-square max-w-[260px] bg-[#1A1918] rounded-2xl overflow-hidden relative border border-[#E8E2D7] shadow-xs">
                        <img
                          src={resolveProductImage(relatedDbProduct, activeImageIndex)}
                          alt={relatedDbProduct.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {savingsAmount > 0 && (
                          <span className="absolute top-3 left-3 bg-[#8B0000] text-white text-[9px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full font-mono">
                            SAVE ₹{savingsAmount}
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                          {relatedDbProduct.size}
                        </span>
                      </div>

                      {/* Thumbnail Switcher if DB Product has multiple images */}
                      {relatedDbProduct.images && relatedDbProduct.images.length > 1 && (
                        <div className="flex items-center gap-2 mt-3">
                          {relatedDbProduct.images.slice(0, 4).map((img, i) => (
                            <button
                              key={i}
                              onClick={() => setActiveImageIndex(i)}
                              className={`w-9 h-9 rounded-lg overflow-hidden border transition-all ${
                                activeImageIndex === i
                                  ? 'border-[#2D4438] ring-2 ring-[#2D4438]/20 scale-105'
                                  : 'border-[#E8E2D7] opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={img.url} alt="view" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Metadata & Actions */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-[10px] uppercase font-mono tracking-wider text-[#2D4438] font-bold">
                          <span>{relatedDbProduct.category}</span>
                          <span>•</span>
                          <span>{relatedDbProduct.purpose}</span>
                          {relatedDbProduct.badge && (
                            <>
                              <span>•</span>
                              <span className="text-[#8C6D46]">{relatedDbProduct.badge}</span>
                            </>
                          )}
                        </div>

                        <h4 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium mt-1">
                          {relatedDbProduct.name}
                        </h4>

                        {/* Price & Rating */}
                        <div className="flex items-center gap-3 mt-2 font-mono">
                          <span className="text-xl font-bold text-[#181817]">₹{relatedDbProduct.price}</span>
                          {relatedDbProduct.compareAtPrice &&
                            relatedDbProduct.compareAtPrice > relatedDbProduct.price && (
                              <span className="text-xs text-[#77736C] line-through">
                                ₹{relatedDbProduct.compareAtPrice}
                              </span>
                            )}
                          {relatedDbProduct.rating && (
                            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E8E2D7] text-xs text-[#8C6D46]">
                              <Star size={11} className="fill-[#8C6D46]" />
                              <span className="font-bold">{relatedDbProduct.rating}</span>
                              <span className="text-[#77736C]">({relatedDbProduct.reviewCount} reviews)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#55524D] leading-relaxed font-light">
                        {relatedDbProduct.shortDescription || relatedDbProduct.fullDescription}
                      </p>

                      {/* DB Key Ingredients highlight */}
                      {relatedDbProduct.keyIngredients && relatedDbProduct.keyIngredients.length > 0 && (
                        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E8E2D7] space-y-2">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#2D4438] font-bold flex items-center gap-1">
                            <Leaf size={11} />
                            FORMULATED BOTANICAL ACTIVES
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {relatedDbProduct.keyIngredients.slice(0, 2).map((ing, idx) => (
                              <div key={idx} className="font-mono text-[11px] text-[#55524D]">
                                <span className="font-bold text-[#181817] block">{ing.name}</span>
                                <span className="text-[10px] text-[#77736C] line-clamp-1">{ing.role}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                          onClick={handleQuickBuy}
                          className="bg-[#181817] text-white px-6 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-[#2D4438] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          {addedToCart ? (
                            <>
                              <Check size={14} className="text-[#C4A482]" />
                              <span>Added to Bag</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={14} />
                              <span>Add to Bag • ₹{relatedDbProduct.price}</span>
                            </>
                          )}
                        </button>

                        <Link
                          href={`/shop/${relatedDbProduct.slug}`}
                          className="border border-[#E8E2D7] text-[#181817] px-5 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider hover:border-[#181817] transition-colors flex items-center gap-1.5 cursor-pointer bg-white"
                        >
                          <span>Full Specifications</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-mono text-[#77736C] pt-1">
                        <span className="flex items-center gap-1">
                          <ShieldCheck size={12} className="text-[#2D4438]" />
                          Dermatologically Tested
                        </span>
                        <span>•</span>
                        <span>Free Shipping Above ₹999</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Next / Previous Article Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-10 border-t border-[#E8E2D7]">
              {prevArticle ? (
                <Link
                  href={`/journal/${prevArticle.slug}`}
                  className="bg-white rounded-2xl border border-[#E8E2D7] p-5 block group hover:border-[#181817] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#77736C] mb-1.5 flex items-center gap-1">
                    <ArrowLeft size={12} /> Previous Dispatch
                  </div>
                  <div className="font-serif text-base text-[#181817] font-medium group-hover:text-[#2D4438] transition-colors line-clamp-1">
                    {prevArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <Link
                  href={`/journal/${nextArticle.slug}`}
                  className="bg-white rounded-2xl border border-[#E8E2D7] p-5 text-right block group hover:border-[#181817] hover:shadow-xs transition-all cursor-pointer"
                >
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#77736C] mb-1.5 flex items-center justify-end gap-1">
                    Next Dispatch <ArrowRight size={12} />
                  </div>
                  <div className="font-serif text-base text-[#181817] font-medium group-hover:text-[#2D4438] transition-colors line-clamp-1">
                    {nextArticle.title}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>

          </div>
        </div>

        {/* Sister Dispatches Grid */}
        {otherArticles.length > 0 && (
          <div className="mt-20 pt-14 border-t border-[#E8E2D7]">
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E8E2D7]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2D4438]" />
                <h3 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium">
                  Sister Dispatches
                </h3>
              </div>
              <Link
                href="/journal"
                className="text-xs font-semibold uppercase tracking-wider text-[#2D4438] hover:text-[#181817] transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All Articles</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherArticles.slice(0, 2).map((other) => {
                const otherProd = findRelatedDbProduct(other.relatedProductSlug, products);

                return (
                  <article
                    key={other.slug}
                    className="bg-white rounded-2xl border border-[#E8E2D7] overflow-hidden flex flex-col justify-between group hover:border-[#181817] hover:shadow-md transition-all duration-300"
                  >
                    <div>
                      <Link href={`/journal/${other.slug}`} className="block relative aspect-16/10 bg-[#EAE5DC] overflow-hidden">
                        <Image
                          src={other.coverImage}
                          alt={other.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div className="absolute top-3.5 left-3.5 bg-[#181817]/90 text-white text-[9px] uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                          {other.category}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={11} />
                          {other.readTime}
                        </div>
                      </Link>

                      <div className="p-6">
                        <div className="text-[10px] text-[#77736C] font-mono mb-2">
                          {other.date} • {other.author}
                        </div>
                        <Link href={`/journal/${other.slug}`}>
                          <h4 className="font-serif text-xl text-[#181817] font-medium group-hover:text-[#2D4438] transition-colors mb-2">
                            {other.title}
                          </h4>
                        </Link>
                        <p className="text-xs text-[#55524D] leading-relaxed line-clamp-2 font-light">
                          {other.excerpt}
                        </p>

                        {otherProd && (
                          <div className="mt-3 p-2 bg-[#FAF8F5] rounded-xl border border-[#E8E2D7] flex items-center gap-2 text-[10px] font-mono">
                            <span className="text-[#2D4438] font-bold">DISPENSARY:</span>
                            <span className="truncate text-[#181817]">{otherProd.name}</span>
                            <span className="ml-auto font-bold text-[#181817]">₹{otherProd.price}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-0 border-t border-[#E8E2D7] mt-2 pt-4 flex items-center justify-between">
                      <Link
                        href={`/journal/${other.slug}`}
                        className="inline-flex items-center text-xs uppercase tracking-wider font-semibold text-[#181817] group-hover:text-[#2D4438] transition-colors cursor-pointer"
                      >
                        <span>Read Dispatch</span>
                        <ArrowRight size={13} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Bi-Weekly Dispatch Signup */}
        <div className="mt-16 bg-white rounded-3xl border border-[#E8E2D7] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#2D4438] font-bold block mb-2">
            The Terra Dispatch
          </span>
          <h4 className="font-serif text-2xl sm:text-3xl text-[#181817] font-medium mb-3">
            Never miss a formulation insight
          </h4>
          <p className="text-xs text-[#77736C] leading-relaxed max-w-md mx-auto mb-6">
            Get practical skin biology essays and ritual notes delivered to your inbox every other Sunday.
          </p>
          {newsletterSubscribed ? (
            <div className="p-3.5 bg-[#2D4438]/10 text-[#2D4438] rounded-xl text-xs font-medium font-mono flex items-center justify-center gap-2">
              <Check size={16} />
              <span>Subscribed! Welcome to the dispatch list.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-[#FAF8F5] border border-[#E8E2D7] rounded-xl px-4 py-3 text-xs text-[#181817] placeholder-[#77736C] focus:outline-none focus:border-[#181817] flex-1 font-mono"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className={`px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold transition-colors shadow-xs relative ${
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
                  'Join'
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </article>
  );
}
