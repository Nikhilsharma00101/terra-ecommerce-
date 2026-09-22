'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const FaceWashRitual = () => {
  return (
    <section className="py-24 bg-[#181817] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,68,56,0.15)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#3B5947] font-bold block mb-4">
          How to Use
        </span>
        <h2 className="text-4xl md:text-5xl font-serif mb-16 font-light text-[#F9F8F5]">
          Your Daily Wash Ritual
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left mb-20 relative">
          {/* Vertical divider on desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/10 -translate-x-1/2" />
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-6"
          >
            <span className="text-4xl font-serif text-white/20 italic">01</span>
            <div>
              <h3 className="text-xl font-medium mb-3 text-[#F9F8F5]">Pump & Lather</h3>
              <p className="text-white/60 font-light leading-relaxed text-sm mb-3">
                Take 1 to 2 pumps of Terra Men’s Co. Face Wash onto wet palms and rub gently to work up a light lather.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex gap-6"
          >
            <span className="text-4xl font-serif text-white/20 italic">02</span>
            <div>
              <h3 className="text-xl font-medium mb-3 text-[#F9F8F5]">Massage & Rinse</h3>
              <p className="text-white/60 font-light leading-relaxed text-sm mb-3">
                Massage over your face, neck, and right through your beard. Rinse thoroughly with clean water and gently pat dry.
              </p>
              <div className="inline-flex items-start gap-2 mt-2 bg-gradient-to-r from-[#3B5947]/30 to-transparent border-l-2 border-[#547963] pl-3 py-1">
                <span className="text-[#7EA68F] text-[10px] uppercase tracking-widest font-bold mt-[2px]">Tip:</span>
                <span className="text-[#F9F8F5]/90 text-xs font-light leading-relaxed">
                  Follow immediately with Terra Beard Oil while your beard is slightly damp to lock in maximum hydration.
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Philosophy Sign-off */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pt-16 border-t border-white/10"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-8 text-[#3B5947] font-serif text-sm sm:text-lg md:text-2xl italic mb-10">
            <span>Cleanse</span>
            <span className="text-white/20">→</span>
            <span>Purify</span>
            <span className="text-white/20">→</span>
            <span>Balance</span>
            <span className="text-white/20">→</span>
            <span>Refresh</span>
          </div>
          
          <p className="text-white/80 font-light mb-8 max-w-lg mx-auto text-sm">
            Give your face the deep clean it deserves with Terra Men’s Co. Premium Face Wash.
          </p>

          <div className="inline-flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white">TERRA MEN’S CO.™</span>
            <span className="text-xs text-white/40 italic font-serif mt-2">Men’s Grooming, Refined.</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
