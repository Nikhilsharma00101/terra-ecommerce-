'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Frown, Droplets, Wind, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Problem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  solutionTitle: string;
  solutionDesc: string;
  productSlug: string;
  productName: string;
  color: string;
  bgImage: string;
}

const problems: Problem[] = [
  {
    id: 'beard-itch',
    icon: Frown,
    title: 'Beard Itch & Dry Flakes',
    description: 'Dry skin underneath your beard causing irritation and embarrassing white flakes on your shirt.',
    solutionTitle: 'Soothe & Nourish',
    solutionDesc: '7 cold-pressed oils instantly calm the skin, stop the itch, and eliminate dry flakes at the root.',
    productSlug: '/shop/beard-oil',
    productName: 'Terra Beard Oil',
    color: '#8C6D46',
    bgImage: '/images/problem-solved/beard-itch-bg.jpeg'
  },
  {
    id: 'oily-skin',
    icon: Droplets,
    title: 'Oily & Sticky Skin',
    description: 'Face feels greasy and heavy by mid-day, leading to clogged pores and an uncomfortable shine.',
    solutionTitle: 'Balance & Mattify',
    solutionDesc: 'Salicylic acid clears excess sebum without stripping natural moisture, leaving a fresh, matte finish.',
    productSlug: '/shop/face-wash',
    productName: 'Terra Face Wash',
    color: '#2D4438',
    bgImage: '/images/problem-solved/oily-skin-bg.jpeg'
  },
  {
    id: 'city-dust',
    icon: Wind,
    title: 'Trapped City Dust',
    description: 'Daily commute leaves a layer of microscopic pollution and dust trapped in your pores and beard.',
    solutionTitle: 'Deep Pore Detox',
    solutionDesc: 'A rich lather washes away daily grime and shields your skin against urban pollution stress.',
    productSlug: '/shop/face-wash',
    productName: 'Terra Face Wash',
    color: '#3B5947',
    bgImage: '/images/problem-solved/city-dust-bg.jpeg'
  },
  {
    id: 'rough-beard',
    icon: Sparkles,
    title: 'Hard, Rough Beard',
    description: 'Beard hair feels wiry, looks unruly, and is difficult to manage or shape in the morning.',
    solutionTitle: 'Soften & Tame',
    solutionDesc: 'Sweet almond and jojoba oils soften rough hair cuticles, making your beard smooth and manageable.',
    productSlug: '/shop/beard-oil',
    productName: 'Terra Beard Oil',
    color: '#A88B63',
    bgImage: '/images/problem-solved/rough-beard-bg.jpeg'
  }
];

const ProblemCard = ({ 
  problem, 
  index, 
  isFlipped, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  problem: Problem; 
  index: number; 
  isFlipped: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => (
  <div
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className="relative h-[270px] cursor-pointer group w-full max-w-sm mx-auto md:max-w-none"
    style={{ perspective: 1200 }}
  >
    <div
      className="w-full h-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
      style={{ 
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}
    >
      {/* Front of Card (The Problem) */}
      <div 
        className="absolute inset-0 w-full h-full bg-white/40 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center transition-all duration-500 shadow-[0_8px_32px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(139,0,0,0.15)] group-hover:bg-white/60 rounded-[4px]"
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
      >
        {/* Travelling Crimson Gradient Border */}
        <div 
           className="absolute inset-0 rounded-[4px] pointer-events-none transition-all duration-500 p-[1.5px] z-20"
           style={{
             WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             WebkitMaskComposite: 'xor',
             maskComposite: 'exclude',
           }}
        >
          <div 
            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(139,0,0,0.8) 85%, #ff4d4d 100%)',
              animation: 'border-spin 4s linear infinite',
            }}
          />
        </div>
        
        <div className="absolute top-4 right-4 text-[10px] font-semibold tracking-widest text-[#181817]/30 select-none">
          0{index + 1}
        </div>

        <div className="w-12 h-12 rounded-full bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.8)] group-hover:border-[#8B0000]/30 group-hover:shadow-md transition-all duration-500 mb-5 relative z-10">
           <problem.icon className="w-5 h-5 text-[#8B0000]" strokeWidth={1.5} />
        </div>
        
        <h3 className="text-[20px] md:text-[22px] font-serif text-[#181817] mb-3 leading-tight font-medium group-hover:text-[#8B0000] transition-colors duration-500 relative z-10">
           {problem.title}
        </h3>
        
        <div className="w-6 h-[2px] bg-[#8B0000]/20 mb-4 transition-all duration-500 group-hover:w-12 group-hover:bg-[#8B0000]/60 relative z-10" />
        
        <p className="text-[#55524D] text-[13px] leading-relaxed font-light relative z-10 px-2">
           {problem.description}
        </p>

        {/* Subtle hover edge */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#8B0000] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      </div>

      {/* Back of Card (The Solution) */}
      <div 
        className="absolute inset-0 w-full h-full p-6 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl rounded-[4px]"
        style={{ 
          backfaceVisibility: 'hidden', 
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          backgroundColor: problem.color
        }}
      >
        {/* Travelling Crimson Gradient Border */}
        <div 
           className="absolute inset-0 rounded-[4px] pointer-events-none transition-all duration-500 p-[1.5px] z-20"
           style={{
             WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
             WebkitMaskComposite: 'xor',
             maskComposite: 'exclude',
           }}
        >
          <div 
            className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-40 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'conic-gradient(from 0deg, transparent 70%, rgba(139,0,0,0.8) 85%, #ff4d4d 100%)',
              animation: 'border-spin 4s linear infinite',
            }}
          />
        </div>

        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-30 mix-blend-overlay transition-transform duration-1000 group-hover:scale-110"
          style={{ backgroundImage: `url('${problem.bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        <div className="relative z-10 flex flex-col items-center w-full">
           <CheckCircle2 className="w-6 h-6 text-white/90 mb-3" strokeWidth={1.5} />
           <span className="text-[9px] uppercase tracking-[0.3em] text-white/70 font-semibold mb-2">
             Terra Solution
           </span>
           <h3 className="text-[20px] md:text-[22px] font-serif text-white mb-3 leading-tight font-medium">
             {problem.solutionTitle}
           </h3>
           <p className="text-white/80 text-[13px] leading-relaxed font-light mb-6 px-2">
             {problem.solutionDesc}
           </p>
           
           <Link 
             href={problem.productSlug}
             className="group/link inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-[#121212] px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white w-[90%]"
           >
             Solved by {problem.productName}
             <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>
    </div>
  </div>
);

export const ProblemsSolved = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoFlipped, setIsAutoFlipped] = useState(false);

  useEffect(() => {
    // Run the auto-carousel timer unconditionally. 
    // Desktop view ignores these states (it uses hoveredCard instead), 
    // but this ensures mobile always works even if screen width detection is flaky.
    const timer = setTimeout(() => {
      if (!isAutoFlipped) {
        setIsAutoFlipped(true); // Flip current card
      } else {
        setIsAutoFlipped(false); // Unflip and move to next
        setActiveIndex((prev) => (prev + 1) % problems.length);
      }
    }, 3000); // 3 seconds per side

    return () => clearTimeout(timer);
  }, [activeIndex, isAutoFlipped]);

  return (
    <section className="pt-20 pb-32 bg-[#F9F8F5] relative overflow-hidden border-t border-[#E5E0D8]">
      <style>{`
        @keyframes border-spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/home/reality-bg.jpeg"
          alt="Premium Texture Background"
          fill
          priority
          className="object-cover opacity-70 mix-blend-multiply"
          sizes="100vw"
        />
        {/* Subtle wash to ensure text contrast */}
        <div className="absolute inset-0 bg-[#F9F8F5]/30" />
      </div>
      
      {/* Abstract gradients to layer on top of the image */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(45,68,56,0.06)_0%,_transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[50px] z-0" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(140,109,70,0.06)_0%,_transparent_60%)] translate-x-1/3 translate-y-1/3 pointer-events-none blur-[50px] z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Designed Intro Section */}
        <div className="mb-12 lg:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#8B0000]/10">
          <div className="space-y-3 max-w-xl">
            {/* Kicker Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B0000]/8 border border-[#8B0000]/15"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000] animate-pulse" />
              <span className="text-[#8B0000] text-[10px] font-semibold tracking-[0.3em] uppercase">
                THE REALITY
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#121212] font-light tracking-tight leading-[1.12]"
            >
              Men's grooming shouldn't be <br className="hidden md:block" />
              <span className="italic text-[#8B0000] font-normal relative inline-block">
                complicated.
                <span className="absolute bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-[#8B0000] to-transparent opacity-30" />
              </span>
            </motion.h2>
          </div>

          {/* Right Side Context / Tagline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:text-right space-y-2 shrink-0"
          >
            <p className="text-[#55524D] text-xs sm:text-sm font-light leading-relaxed max-w-xs md:ml-auto">
              We engineered Terra to eliminate the most common, everyday frustrations—simply, effectively, and naturally.
            </p>
            <div className="inline-flex items-center justify-start md:justify-end gap-2 text-[#8B0000]/60 text-[10px] font-semibold tracking-widest uppercase w-full">
              <span>IDENTIFY</span>
              <span>•</span>
              <span>SOLVE</span>
            </div>
          </motion.div>
        </div>

        {/* Desktop View: Single Line Grid */}
        <div className="hidden md:grid grid-cols-4 gap-6 max-w-[1400px] mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <ProblemCard
                problem={problem}
                index={index}
                isFlipped={hoveredCard === problem.id}
                onMouseEnter={() => setHoveredCard(problem.id)}
                onMouseLeave={() => setHoveredCard(null)}
              />
            </motion.div>
          ))}
        </div>

        {/* Mobile View: Auto Carousel */}
        <div className="md:hidden relative w-full overflow-hidden px-2 pb-12">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {problems.map((problem, index) => (
              <div key={problem.id} className="w-full flex-shrink-0 px-2">
                <ProblemCard
                  problem={problem}
                  index={index}
                  isFlipped={activeIndex === index ? isAutoFlipped : false}
                />
              </div>
            ))}
          </div>
          
          {/* Pagination Dots */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-8">
            {problems.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-[#2D4438] w-6' : 'bg-[#D1C9BE]'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

