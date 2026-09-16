'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Review } from '@/types';
import {
  Star,
  CheckCircle2,
  Quote,
  ThumbsUp,
  SlidersHorizontal,
  Sparkles,
  MessageSquarePlus,
  X,
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewSectionProps {
  reviews: Review[];
  title?: string;
  subtitle?: string;
  hideFilters?: boolean;
  theme?: 'light' | 'dark';
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  reviews: initialReviews,
  title = 'WHAT MEN ARE SAYING',
  subtitle = 'Real-world accounts from daily practitioners of the Terra Method.',
  hideFilters = false,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);

  const reviewsList = useMemo(() => {
    let list = [...pendingReviews, ...initialReviews];
    if (list.length > 0 && list.length < 5) {
      const base = [...list];
      while (list.length < 5) {
        list = [...list, ...base].map((r, i) => ({ ...r, id: `${r.id}-clone-${i}` }));
      }
    }
    return list;
  }, [initialReviews, pendingReviews]);

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Upvotes state
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    initialReviews.forEach((r) => {
      counts[r.id] = r.helpfulCount || 0;
    });
    return counts;
  });

  // Modal states
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // New review form
  const [formRating, setFormRating] = useState<number>(5);
  const [formHoverRating, setFormHoverRating] = useState<number>(0);
  const [formAuthor, setFormAuthor] = useState<string>('');
  const [formEmail, setFormEmail] = useState<string>('');
  const [formLocation, setFormLocation] = useState<string>('');
  const [formSkinType, setFormSkinType] = useState<string>('Normal / Combination');
  const [formProductSlug, setFormProductSlug] = useState<string>('terra-set');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formContent, setFormContent] = useState<string>('');

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return reviewsList;
    return reviewsList.filter((r) => r.productSlug === activeFilter);
  }, [reviewsList, activeFilter]);

  // Reset index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [activeFilter]);

  // 100% AUTOMATED 3D ROTATION (3.8 seconds per step)
  useEffect(() => {
    if (isHovered || filteredReviews.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredReviews.length);
    }, 3800);

    return () => clearInterval(interval);
  }, [isHovered, filteredReviews.length]);

  // Upvote trigger
  const toggleHelpful = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setUpvotedIds((prev) => {
      const next = new Set(prev);
      const currentCount = helpfulCounts[id] || 0;
      if (next.has(id)) {
        next.delete(id);
        setHelpfulCounts((c) => ({ ...c, [id]: Math.max(0, currentCount - 1) }));
      } else {
        next.add(id);
        setHelpfulCounts((c) => ({ ...c, [id]: currentCount + 1 }));
      }
      return next;
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit Review Handler
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAuthor || !formEmail || !formTitle || !formContent) return;

    setIsSubmitting(true);

    const productNameMap: Record<string, string> = {
      'terra-face-wash': 'Terra Face Wash',
      'terra-beard-oil': 'Terra Beard Oil',
      'terra-set': 'The Complete Terra Method',
    };

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: formAuthor,
          email: formEmail,
          location: formLocation,
          skinType: formSkinType,
          rating: formRating,
          title: formTitle,
          content: formContent,
          productSlug: formProductSlug,
          productName: productNameMap[formProductSlug] || 'The Complete Terra Method',
        }),
      });

      if (!response.ok) throw new Error('Failed to submit');

      // Optimistic UI update: instantly show the review locally
      const initials = formAuthor.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
      const newRev: Review = {
        id: `rev-pending-${Date.now()}`,
        author: formAuthor,
        avatarInitials: initials || 'TP',
        location: formLocation || 'Verified Practitioner',
        skinType: formSkinType,
        rating: formRating,
        date: 'Just now',
        title: formTitle,
        content: formContent,
        verified: true,
        productName: productNameMap[formProductSlug] || 'The Complete Terra Method',
        productSlug: formProductSlug,
        helpfulCount: 0,
      };

      setPendingReviews((prev) => [newRev, ...prev]);

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsWriteModalOpen(false);
        setFormAuthor('');
        setFormEmail('');
        setFormLocation('');
        setFormTitle('');
        setFormContent('');
        setFormRating(5);
      }, 3500);
    } catch (error) {
      console.error(error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Active Center Review Item
  const activeReview = filteredReviews[activeIndex % filteredReviews.length];

  return (
    <section id="testimonials" className={`py-12 sm:py-20 lg:py-24 border-t border-b relative overflow-hidden select-none transition-colors ${
      isLight ? 'bg-[#FAF8F5] border-[#E5E0D8]' : 'bg-[#121212] border-[#2A2A2A]'
    }`}>
      {/* Dynamic Animated Radar Ring in Background */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border rounded-full pointer-events-none animate-[spin_60s_linear_infinite] ${
        isLight ? 'border-[#2D4438]/10' : 'border-[#DC143C]/20'
      }`}>
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full blur-xs ${
          isLight ? 'bg-[#2D4438]/30' : 'bg-[#DC143C]/50'
        }`} />
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border rounded-full pointer-events-none animate-[spin_40s_linear_infinite_reverse] ${
        isLight ? 'border-[#C4A482]/20' : 'border-[#8B0000]/30'
      }`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER WITH LIVE STREAM PULSE METRIC                              */}
        {/* ========================================================================= */}
        <div className={`flex flex-col lg:flex-row lg:items-end justify-between mb-8 sm:mb-12 gap-6 pb-6 border-b ${
          isLight ? 'border-[#E5E0D8]' : 'border-[#2A2A2A]'
        }`}>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2.5">
              <span className={`flex items-center gap-1.5 px-2.5 py-0.5 text-white text-[9px] font-mono uppercase tracking-[0.2em] rounded-full ${
                isLight ? 'bg-[#2D4438]' : 'bg-[#8B0000]'
              }`}>
                <Activity size={11} className={`animate-pulse ${isLight ? 'text-[#C4A482]' : 'text-[#DC143C]'}`} />
                LIVE AUDIT STREAM
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-mono text-[#77736C] tracking-widest">
                VERIFIED PRACTITIONERS
              </span>
            </div>
            <h2 className={`font-serif text-2xl sm:text-4xl lg:text-5xl font-light ${
              isLight ? 'text-[#181817]' : 'text-white'
            }`}>
              {title}
            </h2>
            <p className={`text-xs sm:text-sm mt-1.5 sm:mt-2 font-light max-w-xl ${
              isLight ? 'text-[#55524D]' : 'text-gray-400'
            }`}>
              {subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Scorecard Badge */}
            <div className={`p-3 sm:p-3.5 flex items-center justify-between sm:justify-start gap-3 rounded-xl ${
              isLight ? 'bg-white border border-[#E5E0D8] shadow-2xs' : 'bg-[#1A1A1A] border border-[#333333]'
            }`}>
              <span className={`font-serif text-2xl sm:text-3xl font-light ${isLight ? 'text-[#181817]' : 'text-white'}`}>
                {initialReviews.length > 0 ? (initialReviews.reduce((acc, r) => acc + r.rating, 0) / initialReviews.length).toFixed(1) : '5.0'}
              </span>
              <div>
                <div className="flex text-[#C4A482]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#C4A482] text-[#C4A482]" />
                  ))}
                </div>
                <span className={`text-[10px] font-mono block mt-0.5 ${isLight ? 'text-[#77736C]' : 'text-gray-400'}`}>
                  {initialReviews.length} Verified {initialReviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsWriteModalOpen(true)}
              className={`text-white text-[11px] py-3 px-5 flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-colors rounded-xl shadow-2xs ${
                isLight ? 'bg-[#181817] hover:bg-[#2D4438]' : 'bg-[#8B0000] hover:bg-[#A50000]'
              }`}
            >
              <MessageSquarePlus size={14} />
              <span>SUBMIT ACCOUNT</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTER TABS (Hidden on dynamic product pages)                    */}
        {/* ========================================================================= */}
        {!hideFilters && (
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto -mx-4 px-4 sm:mx-0 sm:px-0">
              <span className="text-[9px] uppercase font-mono text-[#77736C] tracking-widest mr-1 shrink-0 flex items-center gap-1">
                <SlidersHorizontal size={11} />
                <span className="hidden sm:inline">PROTOCOL:</span>
              </span>
              {[
                { id: 'all', label: `ALL (${initialReviews.length})` },
                { id: 'terra-face-wash', label: 'FACE WASH' },
                { id: 'terra-beard-oil', label: 'BEARD OIL' },
                { id: 'terra-set', label: 'THE METHOD' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-[11px] font-medium uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer rounded-lg shrink-0 ${
                    activeFilter === f.id
                      ? isLight ? 'bg-[#181817] text-white' : 'bg-white text-black'
                      : isLight
                      ? 'bg-white text-[#55524D] border border-[#E5E0D8] hover:border-[#181817]'
                      : 'bg-[#1A1A1A] text-gray-400 border border-[#333333] hover:border-white hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Automated Motion Progress Pulse Dots (Desktop) */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {filteredReviews.slice(0, 8).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Jump to review ${idx + 1}`}
                  className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                    idx === activeIndex % filteredReviews.length
                      ? isLight ? 'w-7 bg-[#2D4438]' : 'w-7 bg-[#DC143C]'
                      : isLight ? 'w-2 bg-[#DDD8CF] hover:bg-[#8C877D]' : 'w-2 bg-[#333333] hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Automated Motion Progress Pulse Dots (When Filters are hidden)            */}
        {/* ========================================================================= */}
        {hideFilters && (
          <div className="flex items-center justify-center gap-1.5 mb-8 sm:mb-10">
            {filteredReviews.slice(0, 8).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to review ${idx + 1}`}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                  idx === activeIndex % filteredReviews.length
                    ? isLight ? 'w-7 bg-[#2D4438]' : 'w-7 bg-[#DC143C]'
                    : isLight ? 'w-2 bg-[#DDD8CF] hover:bg-[#8C877D]' : 'w-2 bg-[#333333] hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3D KINETIC DECK CAROUSEL ENGINE (RESPONSIVE TOUCH & DESKTOP 3D)           */}
        {/* ========================================================================= */}
        <div
          className="relative h-[390px] sm:h-[400px] w-full flex items-center justify-center perspective-[1200px] touch-pan-y overflow-x-clip"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {filteredReviews.map((rev, index) => {
            const count = filteredReviews.length;
            const currentActive = activeIndex % count;

            // Calculate relative offset around loop
            let diff = index - currentActive;
            if (diff > count / 2) diff -= count;
            if (diff < -count / 2) diff += count;

            // Compute Responsive Transform States based on mobile vs desktop
            let x = '0%';
            let scale = 1;
            let rotateY = 0;
            let zIndex = 10;
            let opacity = 0;
            let blur = '0px';

            if (isMobile) {
              if (diff === 0) {
                x = '0%';
                scale = 1;
                rotateY = 0;
                zIndex = 30;
                opacity = 1;
                blur = '0px';
              } else if (diff === 1 || (diff === -count + 1 && count > 2)) {
                x = '100%';
                scale = 0.94;
                rotateY = 0;
                zIndex = 10;
                opacity = 0;
                blur = '2px';
              } else if (diff === -1 || (diff === count - 1 && count > 2)) {
                x = '-100%';
                scale = 0.94;
                rotateY = 0;
                zIndex = 10;
                opacity = 0;
                blur = '2px';
              } else {
                x = diff > 0 ? '110%' : '-110%';
                scale = 0.85;
                rotateY = 0;
                zIndex = 5;
                opacity = 0;
                blur = '4px';
              }
            } else {
              if (diff === 0) {
                // Active Center Card
                x = '0%';
                scale = 1.05;
                rotateY = 0;
                zIndex = 30;
                opacity = 1;
                blur = '0px';
              } else if (diff === 1 || (diff === -count + 1 && count > 2)) {
                // Right Card
                x = '52%';
                scale = 0.86;
                rotateY = -18;
                zIndex = 20;
                opacity = 0.72;
                blur = '1px';
              } else if (diff === -1 || (diff === count - 1 && count > 2)) {
                // Left Card
                x = '-52%';
                scale = 0.86;
                rotateY = 18;
                zIndex = 20;
                opacity = 0.72;
                blur = '1px';
              } else if (diff === 2 || diff === -2) {
                // Background Cards
                x = diff > 0 ? '90%' : '-90%';
                scale = 0.7;
                rotateY = diff > 0 ? -30 : 30;
                zIndex = 10;
                opacity = 0.2;
                blur = '3px';
              }
            }

            const isCenter = diff === 0;

            return (
              <motion.div
                key={rev.id}
                initial={false}
                drag={isMobile ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.25}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -40 || info.velocity.x < -300) {
                    setActiveIndex((prev) => (prev + 1) % filteredReviews.length);
                  } else if (info.offset.x > 40 || info.velocity.x > 300) {
                    setActiveIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length);
                  }
                }}
                animate={{
                  x,
                  scale,
                  rotateY,
                  zIndex,
                  opacity,
                  filter: blur,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 24,
                  mass: 0.9,
                }}
                onClick={() => {
                  if (isCenter) setSelectedReview(rev);
                  else setActiveIndex(index);
                }}
                className={`absolute w-[calc(100%-2rem)] max-w-[400px] sm:max-w-none sm:w-[500px] p-5 sm:p-9 border shadow-2xl transition-colors duration-300 cursor-pointer ${
                  isLight
                    ? isCenter
                      ? 'bg-white text-[#181817] border-[#2D4438] shadow-[0_15px_40px_rgba(45,68,56,0.12)] rounded-2xl'
                      : 'bg-[#F4F1EB] text-[#55524D] border-[#E5E0D8] hover:border-[#181817] rounded-2xl'
                    : isCenter
                    ? 'bg-black text-white border-[#8B0000] shadow-[#8B0000]/20'
                    : 'bg-[#1A1A1A] text-gray-300 border-[#333333] hover:border-gray-500'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  pointerEvents: isCenter ? 'auto' : 'none',
                  visibility: isMobile ? (isCenter ? 'visible' : 'hidden') : 'visible',
                }}
              >
                {/* Visual Corner Accent Badge for Active Card */}
                {isCenter && (
                  <div className={`absolute top-0 right-0 text-white text-[9px] font-mono px-2.5 sm:px-3 py-1 uppercase tracking-widest flex items-center gap-1 ${
                    isLight ? 'bg-[#2D4438] rounded-tr-2xl rounded-bl-lg' : 'bg-[#8B0000]'
                  }`}>
                    <Sparkles size={11} className={isLight ? 'text-[#C4A482]' : 'text-[#DC143C]'} />
                    <span className="hidden xs:inline">FEATURED AUDIT</span>
                    <span className="xs:hidden">FEATURED</span>
                  </div>
                )}

                {/* Top Row: User & Product */}
                <div className={`flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b ${
                  isLight ? 'border-[#E5E0D8]' : 'border-[#333333]/50'
                }`}>
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-mono text-[11px] sm:text-xs font-bold flex items-center justify-center shadow-md shrink-0 ${
                        isLight
                          ? isCenter
                            ? 'bg-[#2D4438] text-white border border-[#3B5947]'
                            : 'bg-[#E5E0D8] text-[#55524D]'
                          : isCenter
                          ? 'bg-[#8B0000] text-white border border-[#A50000]'
                          : 'bg-[#2A2A2A] text-gray-300'
                      }`}
                    >
                      {rev.avatarInitials || rev.author.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 truncate">
                      <span
                        className={`font-medium text-xs sm:text-sm block leading-tight truncate ${
                          isLight
                            ? isCenter ? 'text-[#181817]' : 'text-[#44413D]'
                            : isCenter ? 'text-white' : 'text-gray-300'
                        }`}
                      >
                        {rev.author}
                      </span>
                      <span
                        className={`text-[9px] sm:text-[10px] font-mono block truncate ${
                          isLight
                            ? isCenter ? 'text-[#77736C]' : 'text-[#8C877D]'
                            : isCenter ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        {rev.location}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[8px] sm:text-[9px] font-mono uppercase tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 border rounded-full shrink-0 max-w-[120px] sm:max-w-none truncate ${
                      isLight
                        ? isCenter
                          ? 'bg-[#2D4438]/8 text-[#2D4438] border-[#2D4438]/20'
                          : 'bg-white text-[#77736C] border-[#E5E0D8]'
                        : isCenter
                        ? 'bg-[#8B0000]/40 text-[#DC143C] border-[#8B0000]'
                        : 'bg-[#2A2A2A] text-gray-400 border-[#333333]'
                    }`}
                  >
                    {rev.productName}
                  </span>
                </div>

                {/* Rating & Date */}
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className={`flex ${isLight ? 'text-[#C4A482]' : 'text-[#DC143C]'}`}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className={
                          isLight
                            ? 'fill-[#C4A482] text-[#C4A482]'
                            : isCenter
                            ? 'fill-[#DC143C] text-[#DC143C]'
                            : 'fill-[#8B0000] text-[#8B0000]'
                        }
                      />
                    ))}
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-mono ${
                      isLight
                        ? isCenter ? 'text-[#77736C]' : 'text-[#8C877D]'
                        : isCenter ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    {rev.date}
                  </span>
                </div>

                {/* Title Quote */}
                <h3
                  className={`font-serif text-base sm:text-xl font-medium leading-snug mb-2 sm:mb-3 line-clamp-2 ${
                    isLight
                      ? isCenter ? 'text-[#181817]' : 'text-[#44413D]'
                      : isCenter ? 'text-white' : 'text-gray-200'
                  }`}
                >
                  &ldquo;{rev.title}&rdquo;
                </h3>

                {/* Content snippet */}
                <p
                  className={`text-xs sm:text-sm font-light leading-relaxed mb-4 sm:mb-6 line-clamp-3 ${
                    isLight
                      ? isCenter ? 'text-[#55524D]' : 'text-[#77736C]'
                      : isCenter ? 'text-gray-300' : 'text-gray-400'
                  }`}
                >
                  {rev.content}
                </p>

                {/* Bottom Footer Action Row */}
                <div
                  className={`pt-3 sm:pt-4 border-t flex items-center justify-between text-xs ${
                    isLight
                      ? 'border-[#E5E0D8]'
                      : isCenter ? 'border-[#333333]' : 'border-[#333333]/50'
                  }`}
                >
                  <div className={`flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider ${
                    isLight ? 'text-[#2D4438]' : isCenter ? 'text-[#DC143C]' : 'text-[#8B0000]'
                  }`}>
                    <CheckCircle2 size={12} className={isLight ? 'text-[#2D4438]' : isCenter ? 'text-[#DC143C]' : 'text-[#8B0000]'} />
                    <span>Verified</span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReview(rev);
                      }}
                      className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest flex items-center gap-1 hover:underline cursor-pointer ${
                        isLight
                          ? 'text-[#2D4438]'
                          : isCenter ? 'text-[#DC143C]' : 'text-gray-400'
                      }`}
                    >
                      <span>Read Log</span>
                      <ArrowRight size={11} />
                    </span>

                    <button
                      onClick={(e) => toggleHelpful(rev.id, e)}
                      aria-label={`Mark review by ${rev.author} as helpful`}
                      className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-mono border transition-all cursor-pointer rounded-md ${
                        isLight
                          ? upvotedIds.has(rev.id)
                            ? 'bg-[#2D4438] text-white border-[#2D4438]'
                            : 'border-[#E5E0D8] text-[#77736C] hover:text-[#181817] hover:border-[#181817] bg-white'
                          : upvotedIds.has(rev.id)
                          ? 'bg-[#8B0000] text-white border-[#A50000]'
                          : isCenter
                          ? 'border-[#333333] text-gray-400 hover:text-white hover:border-white'
                          : 'border-[#333333] text-gray-500 hover:border-gray-400'
                      }`}
                    >
                      <ThumbsUp size={11} />
                      <span>{helpfulCounts[rev.id] || 0}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Controls: Arrows & Indicators for Mobile & Desktop */}
        <div className="flex items-center justify-between sm:justify-center gap-3 mt-4 sm:mt-6 px-4 max-w-xs mx-auto">
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + filteredReviews.length) % filteredReviews.length)}
            aria-label="Previous review"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isLight
                ? 'bg-white text-[#181817] border-[#E5E0D8] hover:border-[#181817] shadow-xs'
                : 'bg-[#1A1A1A] text-white border-[#333333] hover:border-[#8B0000]'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {filteredReviews.slice(0, Math.min(filteredReviews.length, isMobile ? 5 : 8)).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                aria-label={`Jump to review ${idx + 1}`}
                className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                  idx === activeIndex % filteredReviews.length
                    ? isLight ? 'w-6 bg-[#2D4438]' : 'w-6 bg-[#DC143C]'
                    : isLight ? 'w-2 bg-[#DDD8CF] hover:bg-[#8C877D]' : 'w-2 bg-[#333333] hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % filteredReviews.length)}
            aria-label="Next review"
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isLight
                ? 'bg-white text-[#181817] border-[#E5E0D8] hover:border-[#181817] shadow-xs'
                : 'bg-[#1A1A1A] text-white border-[#333333] hover:border-[#8B0000]'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Mobile Swipe Hint */}
        <p className="sm:hidden text-center text-[10px] font-mono text-gray-500 mt-2">
          Swipe left or right to browse accounts
        </p>

        {/* Live Active Highlight Bar below Carousel */}
        {activeReview && (
          <div className={`mt-6 sm:mt-8 p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 max-w-2xl mx-auto text-center sm:text-left rounded-xl ${
            isLight
              ? 'bg-white border border-[#E5E0D8] shadow-xs'
              : 'bg-[#1A1A1A] border border-[#333333]'
          }`}>
            <div className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0">
              <Quote size={18} className={`shrink-0 ${isLight ? 'text-[#2D4438]' : 'text-[#DC143C]'}`} />
              <div className="min-w-0 truncate">
                <p className={`text-xs font-serif font-medium truncate ${isLight ? 'text-[#181817]' : 'text-white'}`}>
                  &ldquo;{activeReview.title}&rdquo;
                </p>
                <p className={`text-[10px] font-mono truncate ${isLight ? 'text-[#77736C]' : 'text-gray-500'}`}>
                  Submitted by {activeReview.author} ({activeReview.location})
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedReview(activeReview)}
              className={`text-[10px] uppercase font-mono font-semibold tracking-widest underline whitespace-nowrap cursor-pointer shrink-0 ${
                isLight ? 'text-[#2D4438] hover:text-[#181817]' : 'text-[#DC143C] hover:text-white'
              }`}
            >
              EXPLORE FULL AUDIT →
            </button>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: WRITE / SUBMIT REVIEW DRAWER MODAL                               */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isWriteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 0 }}
              className={`border shadow-2xl max-w-xl w-full p-5 sm:p-10 relative z-10 my-auto max-h-[90vh] overflow-y-auto rounded-2xl ${
                isLight
                  ? 'bg-white border-[#E5E0D8] text-[#181817]'
                  : 'bg-[#121212] border-[#333333] text-white'
              }`}
            >
              <button
                onClick={() => setIsWriteModalOpen(false)}
                aria-label="Close dialog"
                className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-1 cursor-pointer z-20 ${
                  isLight ? 'text-[#77736C] hover:text-[#181817]' : 'text-gray-500 hover:text-white'
                }`}
              >
                <X size={20} />
              </button>

              {submitSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className={`w-14 h-14 text-white rounded-full flex items-center justify-center mx-auto ${
                    isLight ? 'bg-[#2D4438]' : 'bg-[#8B0000]'
                  }`}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className={`font-serif text-2xl ${isLight ? 'text-[#181817]' : 'text-white'}`}>Account Registered</h3>
                  <p className={`text-xs max-w-sm mx-auto font-light leading-relaxed ${isLight ? 'text-[#55524D]' : 'text-gray-400'}`}>
                    Your account has been securely logged and is currently pending verification against your order history. It will be published shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <span className={`text-[10px] uppercase font-mono tracking-widest block mb-1 ${
                      isLight ? 'text-[#2D4438]' : 'text-[#DC143C]'
                    }`}>
                      PRACTITIONER AUDIT FORM
                    </span>
                    <h3 className={`font-serif text-2xl ${isLight ? 'text-[#181817]' : 'text-white'}`}>
                      Submit Your Account
                    </h3>
                    <p className={`text-xs mt-1 font-light ${isLight ? 'text-[#55524D]' : 'text-gray-400'}`}>
                      Share your genuine feedback on Terra formulations and daily routine.
                    </p>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className={`block text-[11px] font-mono uppercase tracking-wider mb-2 ${
                      isLight ? 'text-[#55524D]' : 'text-gray-300'
                    }`}>
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormRating(star)}
                          onMouseEnter={() => setFormHoverRating(star)}
                          onMouseLeave={() => setFormHoverRating(0)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            className={`${
                              star <= (formHoverRating || formRating)
                                ? isLight ? 'fill-[#C4A482] text-[#C4A482]' : 'fill-[#DC143C] text-[#DC143C]'
                                : isLight ? 'text-[#DDD8CF]' : 'text-[#333333]'
                            }`}
                          />
                        </button>
                      ))}
                      <span className={`font-mono text-xs font-semibold ml-2 ${
                        isLight ? 'text-[#2D4438]' : 'text-[#DC143C]'
                      }`}>
                        {formRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Product Selector */}
                  <div>
                    <label className={`block text-[11px] font-mono uppercase tracking-wider mb-2 ${
                      isLight ? 'text-[#55524D]' : 'text-gray-300'
                    }`}>
                      Target Protocol / Product
                    </label>
                    <select
                      value={formProductSlug}
                      onChange={(e) => setFormProductSlug(e.target.value)}
                      className={`w-full px-4 py-2.5 text-xs rounded-lg focus:outline-none ${
                        isLight
                          ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                          : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                      }`}
                    >
                      <option value="terra-set">The Complete Terra Method</option>
                      <option value="terra-face-wash">Terra Face Wash</option>
                      <option value="terra-beard-oil">Terra Beard Oil</option>
                    </select>
                  </div>

                  {/* Name, Email & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
                        isLight ? 'text-[#55524D]' : 'text-gray-300'
                      }`}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vikram Sharma"
                        value={formAuthor}
                        onChange={(e) => setFormAuthor(e.target.value)}
                        className={`w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none ${
                          isLight
                            ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                            : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
                        isLight ? 'text-[#55524D]' : 'text-gray-300'
                      }`}>
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="For order verification"
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        className={`w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none ${
                          isLight
                            ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                            : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
                        isLight ? 'text-[#55524D]' : 'text-gray-300'
                      }`}>
                        Location / City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, MH"
                        value={formLocation}
                        onChange={(e) => setFormLocation(e.target.value)}
                        className={`w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none ${
                          isLight
                            ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                            : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Skin Type */}
                  <div>
                    <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
                      isLight ? 'text-[#55524D]' : 'text-gray-300'
                    }`}>
                      Skin / Hair Profile
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Oily T-zone, Sensitive Skin, Coarse Beard"
                      value={formSkinType}
                      onChange={(e) => setFormSkinType(e.target.value)}
                      className={`w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none ${
                        isLight
                          ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                          : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
                      isLight ? 'text-[#55524D]' : 'text-gray-300'
                    }`}>
                      Headline Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Exceptional texture and fast absorption"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className={`w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none ${
                        isLight
                          ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                          : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                      }`}
                    />
                  </div>

                  {/* Detailed Content */}
                  <div>
                    <label className={`block text-[11px] font-mono uppercase tracking-wider mb-1 ${
                      isLight ? 'text-[#55524D]' : 'text-gray-300'
                    }`}>
                      Detailed Experience / Routine Log *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe your daily usage, skin changes, aroma, or routine adjustments..."
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      className={`w-full px-3.5 py-2 text-xs rounded-lg focus:outline-none ${
                        isLight
                          ? 'bg-[#FBF9F5] border border-[#DDD8CF] text-[#181817] focus:border-[#2D4438]'
                          : 'bg-[#1A1A1A] border border-[#333333] text-white focus:border-[#8B0000]'
                      }`}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsWriteModalOpen(false)}
                      className="px-5 py-3 text-xs uppercase tracking-widest font-medium text-[#77736C] hover:text-[#181817] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`text-white px-8 py-3 text-xs uppercase tracking-[0.2em] font-semibold transition-colors rounded-xl shadow-xs ${
                        isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      } ${isLight ? 'bg-[#181817] hover:bg-[#2D4438]' : 'bg-[#8B0000] hover:bg-[#A50000]'}`}
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT ACCOUNT FOR AUDIT'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: EXPANDED FULL REVIEW READER MODAL                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 0 }}
              className={`border shadow-2xl max-w-2xl w-full p-5 sm:p-10 relative z-10 my-auto max-h-[90vh] overflow-y-auto rounded-2xl ${
                isLight
                  ? 'bg-white border-[#E5E0D8] text-[#181817]'
                  : 'bg-[#121212] border-[#333333] text-white'
              }`}
            >
              <button
                onClick={() => setSelectedReview(null)}
                aria-label="Close review dialog"
                className={`absolute top-4 right-4 sm:top-6 sm:right-6 p-1 cursor-pointer z-20 ${
                  isLight ? 'text-[#77736C] hover:text-[#181817]' : 'text-gray-500 hover:text-white'
                }`}
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full font-mono text-sm font-bold flex items-center justify-center ${
                    isLight ? 'bg-[#2D4438] text-white' : 'bg-[#8B0000] text-white'
                  }`}>
                    {selectedReview.avatarInitials || selectedReview.author.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className={`font-serif text-xl font-medium ${isLight ? 'text-[#181817]' : 'text-white'}`}>
                      {selectedReview.author}
                    </h4>
                    <p className={`text-xs font-mono ${isLight ? 'text-[#77736C]' : 'text-gray-500'}`}>
                      {selectedReview.location}
                    </p>
                  </div>
                </div>

                <div className={`flex flex-wrap items-center gap-3 pt-2 border-t ${
                  isLight ? 'border-[#E5E0D8]' : 'border-[#333333]'
                }`}>
                  <div className="flex text-[#C4A482]">
                    {[...Array(selectedReview.rating)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#C4A482] text-[#C4A482]" />
                    ))}
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-0.5 border rounded-full ${
                    isLight
                      ? 'text-[#2D4438] bg-[#2D4438]/8 border-[#2D4438]/20'
                      : 'text-white bg-[#1A1A1A] border-[#333333]'
                  }`}>
                    {selectedReview.productName}
                  </span>
                  {selectedReview.skinType && (
                    <span className={`text-xs font-mono ${isLight ? 'text-[#77736C]' : 'text-gray-500'}`}>
                      Profile: {selectedReview.skinType}
                    </span>
                  )}
                  <span className={`ml-auto text-xs font-mono ${isLight ? 'text-[#77736C]' : 'text-gray-500'}`}>
                    {selectedReview.date}
                  </span>
                </div>

                <h3 className={`font-serif text-2xl leading-snug ${isLight ? 'text-[#181817]' : 'text-white'}`}>
                  &ldquo;{selectedReview.title}&rdquo;
                </h3>

                <p className={`text-sm leading-relaxed font-light whitespace-pre-line ${
                  isLight ? 'text-[#55524D]' : 'text-gray-300'
                }`}>
                  {selectedReview.content}
                </p>

                <div className={`pt-6 border-t flex items-center justify-between ${
                  isLight ? 'border-[#E5E0D8]' : 'border-[#333333]'
                }`}>
                  {selectedReview.verified && (
                    <div className={`flex items-center gap-1.5 text-xs uppercase font-semibold tracking-wider ${
                      isLight ? 'text-[#2D4438]' : 'text-[#DC143C]'
                    }`}>
                      <CheckCircle2 size={14} />
                      <span>Verified Practitioner Account</span>
                    </div>
                  )}

                  <button
                    onClick={(e) => toggleHelpful(selectedReview.id, e)}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-mono border transition-all cursor-pointer rounded-lg ${
                      isLight
                        ? upvotedIds.has(selectedReview.id)
                          ? 'bg-[#2D4438] text-white border-[#2D4438]'
                          : 'bg-white text-[#55524D] border-[#E5E0D8] hover:border-[#181817]'
                        : upvotedIds.has(selectedReview.id)
                        ? 'bg-[#8B0000] text-white border-[#8B0000]'
                        : 'bg-transparent text-gray-300 border-[#333333] hover:border-white hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={13} />
                    <span>Helpful ({helpfulCounts[selectedReview.id] || 0})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
