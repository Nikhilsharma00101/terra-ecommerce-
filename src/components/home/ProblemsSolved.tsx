'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Frown, Droplets, Wind, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

export const ProblemsSolved = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="pt-20 pb-32 bg-[#F9F8F5] relative overflow-hidden border-t border-[#E5E0D8]">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(#E5E0D8_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(45,68,56,0.06)_0%,_transparent_60%)] -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-[50px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(140,109,70,0.06)_0%,_transparent_60%)] translate-x-1/3 translate-y-1/3 pointer-events-none blur-[50px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-12 h-[1px] bg-[#D1C9BE]" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#77736C] font-semibold">
              The Reality
            </span>
            <div className="w-12 h-[1px] bg-[#D1C9BE]" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-[#181817] mb-8 font-light tracking-tight leading-tight"
          >
            Men's grooming shouldn't be <br className="hidden md:block" />
            <span className="italic opacity-80">complicated.</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#55524D] text-lg font-light leading-relaxed max-w-xl mx-auto"
          >
            We engineered Terra to eliminate the most common, everyday frustrations—simply, effectively, and naturally.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCard(problem.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative h-[280px] rounded-2xl cursor-pointer group"
              style={{ perspective: 1000 }}
            >
              <div
                className="w-full h-full transition-all duration-700"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: hoveredCard === problem.id ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front of Card (The Problem) */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-b from-white to-[#FAF8F5] border border-[#E5E0D8] rounded-2xl p-8 flex flex-col justify-center items-center text-center transition-all duration-500 group-hover:border-[#D1C9BE] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] shadow-sm overflow-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Subtle Background Numbering */}
                  <span className="absolute -top-4 -right-2 text-[120px] font-serif italic text-black/[0.02] font-bold pointer-events-none select-none">
                    0{index + 1}
                  </span>

                  <div className="w-14 h-14 rounded-full border border-[#E5E0D8] bg-white flex items-center justify-center mb-6 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)] relative z-10">
                    <problem.icon className="w-6 h-6 text-[#77736C] stroke-[1.5]" />
                  </div>
                  
                  <h3 className="text-xl font-serif text-[#181817] mb-3 font-light relative z-10">{problem.title}</h3>
                  <p className="text-[#77736C] text-[13px] leading-relaxed max-w-[260px] font-light relative z-10">
                    {problem.description}
                  </p>
                  
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center w-full">
                    <div className="h-[1px] w-8 bg-[#E5E0D8] absolute top-1/2 -translate-y-1/2 left-8 hidden sm:block" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#77736C] flex items-center gap-2 group-hover:text-[#181817] transition-colors relative z-10">
                      Hover to solve <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="h-[1px] w-8 bg-[#E5E0D8] absolute top-1/2 -translate-y-1/2 right-8 hidden sm:block" />
                  </div>
                </div>

                {/* Back of Card (The Solution) */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden rounded-2xl p-8 flex flex-col justify-between overflow-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    transform: 'rotateY(180deg)',
                    backgroundColor: problem.color
                  }}
                >
                  <div 
                    className="absolute inset-0 w-full h-full opacity-60 mix-blend-overlay"
                    style={{
                      backgroundImage: `url('${problem.bgImage}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div 
                    className="absolute inset-0 w-full h-full"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom right, rgba(0,0,0,0.3), rgba(0,0,0,0.8))'
                    }}
                  />
                  <div className="flex flex-col items-start text-left relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs uppercase tracking-widest font-medium text-white/80">
                        Terra Solution
                      </span>
                    </div>
                    <h3 className="text-2xl font-medium text-white mb-3">{problem.solutionTitle}</h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-6">
                      {problem.solutionDesc}
                    </p>
                  </div>
                  
                  <Link 
                    href={problem.productSlug}
                    className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors w-fit group/link bg-black/20 px-4 py-2 rounded-full hover:bg-black/40 relative z-10"
                  >
                    Solved by {problem.productName}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
