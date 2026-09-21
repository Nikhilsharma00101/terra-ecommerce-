'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const ingredients = [
  { name: 'Salicylic Acid (BHA)', desc: 'Penetrates deep into pores to clear away oil, sweat, and impurities while helping to prevent breakouts.' },
  { name: 'Green Tea Extract', desc: 'A soothing botanical that calms redness and shields your skin from daily pollution stress.' },
  { name: 'Aloe Vera & Pro-Vitamin B5', desc: 'Hydrating ingredients that lock in essential moisture so your face never feels stretchy after washing.' },
  { name: 'Coconut-Derived Cleansers', desc: 'Gentle, natural cleansers that create a rich lather without stripping the skin of its natural oils.' },
  { name: 'Bergamot Essential Oil', desc: 'Adds a fresh, mild, and natural herbal aroma to your morning and evening routine.' }
];

export const FaceWashIngredients = () => {
  return (
    <section className="py-16 bg-white relative border-t border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left Sticky Header */}
          <div className="lg:col-span-5 lg:sticky lg:top-[120px] self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-5"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#181817]/20" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#181817]/70 font-bold">
                  Key Actives
                </span>
              </div>
              <h2 className="text-[24px] sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-serif font-light whitespace-nowrap tracking-tight inline-block bg-gradient-to-r from-black via-[#990000] to-[#FF3333] bg-clip-text text-transparent pb-1">
                Effective & Gentle
              </h2>
              <p className="text-[#55524D] text-sm font-light leading-relaxed max-w-sm">
                A carefully balanced formula designed specifically for a man&apos;s everyday city life. Deeply purifying, yet incredibly gentle.
              </p>
            </motion.div>
          </div>

          {/* Right Content Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mb-12">
              {ingredients.map((ing, i) => (
                <motion.div 
                  key={ing.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex flex-col border-b border-[#E5E0D8] pb-6"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2D4438]" />
                    <h3 className="font-serif text-[#181817] text-lg">{ing.name}</h3>
                  </div>
                  <p className="text-[#77736C] text-sm leading-relaxed font-light">
                    {ing.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Sulfate-Free Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#181817] text-white p-8 rounded-2xl flex flex-col xl:flex-row items-center justify-between gap-6 shadow-xl"
            >
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-[#2D4438]/20 flex items-center justify-center shrink-0 border border-[#2D4438]/30">
                  <CheckCircle2 className="w-6 h-6 text-[#3B5947]" />
                </div>
                <div>
                  <h3 className="text-lg font-serif mb-1 tracking-wide">SULFATE-FREE FORMULA</h3>
                  <p className="text-white/60 text-[11px] font-light uppercase tracking-[0.1em]">
                    Made without harsh chemicals.
                  </p>
                </div>
              </div>
              <div className="xl:text-right max-w-sm">
                <p className="text-white/80 font-light leading-relaxed text-xs">
                  We focus on purity and performance, ensuring your daily grooming routine is safe, natural, and effective without stripping your skin.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
