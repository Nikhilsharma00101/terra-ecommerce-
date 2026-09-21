'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ingredient, RitualStep } from '@/types';
import { Clock, Droplet } from 'lucide-react';

interface SetIngredientsAndRitualProps {
  ingredients: Ingredient[];
  steps: RitualStep[];
  productName: string;
}

export const SetIngredientsAndRitual: React.FC<SetIngredientsAndRitualProps> = ({
  ingredients,
  steps,
  productName,
}) => {
  return (
    <section className="bg-[#FAF8F5] py-20 lg:py-32 border-t border-b border-[#E8E2D7] relative overflow-hidden">
      {/* Subtle Background Accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(45,68,56,0.05)_0%,_transparent_70%)] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(140,109,70,0.04)_0%,_transparent_70%)] pointer-events-none translate-y-1/4 -translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Sticky Header */}
          <div className="lg:col-span-4 lg:sticky lg:top-[120px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#181817]/20" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#181817]/70 font-bold">
                  Product Details
                </span>
              </div>
              
              <h2 className="text-[28px] sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-serif font-light tracking-tight inline-block bg-gradient-to-r from-black via-[#990000] to-[#FF3333] bg-clip-text text-transparent pb-1">
                Ingredients &<br className="hidden lg:block"/> Routine
              </h2>
              
              <p className="text-[#55524D] text-sm sm:text-base font-light leading-relaxed max-w-sm">
                Every element in {productName} was selected with deliberate intent. Explore the key ingredients and the daily steps required to use them.
              </p>
            </motion.div>
          </div>

          {/* Right Scrolling Content */}
          <div className="lg:col-span-8 lg:pl-10">
            
            {/* Part 1: Ingredients */}
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-2xl font-serif text-[#181817] font-light">01.</span>
                <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-[#181817]">Ingredients</h3>
                <div className="flex-1 h-[1px] bg-[#E8E2D7]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ingredients.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white border border-[#E5E0D8] p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-[#F4F1EA] rounded-full text-[#8C6D46]">
                        <Droplet size={16} />
                      </div>
                      {item.origin && (
                        <span className="text-[9px] uppercase tracking-wider text-[#77736C] font-mono">
                          {item.origin}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-xl text-[#181817] font-medium group-hover:text-[#8C6D46] transition-colors">
                      {item.name}
                    </h4>
                    {item.botanicalName && (
                      <p className="text-[10px] font-serif italic text-[#77736C] mt-0.5 mb-3">
                        {item.botanicalName}
                      </p>
                    )}
                    <span className="inline-block px-2.5 py-1 bg-[#181817] text-white text-[9px] uppercase tracking-widest font-bold rounded-full mb-3">
                      {item.role}
                    </span>
                    <p className="text-xs text-[#55524D] leading-relaxed font-light">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Part 2: Ritual */}
            <div>
              <div className="flex items-center gap-4 mb-10">
                <span className="text-2xl font-serif text-[#181817] font-light">02.</span>
                <h3 className="text-sm uppercase tracking-[0.2em] font-bold text-[#181817]">How to Use</h3>
                <div className="flex-1 h-[1px] bg-[#E8E2D7]" />
              </div>

              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#E8E2D7] before:via-[#E8E2D7] before:to-transparent">
                {steps.map((step, idx) => (
                  <motion.div 
                    key={step.number}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Timeline Node */}
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#FAF8F5] bg-[#181817] text-[#FAF8F5] font-serif shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                      0{step.number}
                    </div>

                    {/* Content Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-[#E5E0D8] shadow-sm hover:border-[#8C6D46] transition-colors">
                      <div className="flex items-center gap-2 text-[9px] uppercase tracking-wider text-[#8C6D46] font-bold mb-2">
                        <Clock size={12} />
                        <span>{step.timing}</span>
                      </div>
                      <h4 className="font-serif text-lg text-[#181817] font-medium mb-2">
                        {step.title}
                      </h4>
                      <p className="text-xs text-[#55524D] font-light leading-relaxed mb-4">
                        {step.action}
                      </p>
                      <div className="bg-[#FAF8F5] p-3 rounded-lg border border-[#E8E2D7]">
                        <p className="text-[10px] text-[#77736C] italic leading-relaxed">
                          <span className="font-semibold text-[#181817] not-italic mr-1">Pro Tip:</span>
                          {step.tip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
