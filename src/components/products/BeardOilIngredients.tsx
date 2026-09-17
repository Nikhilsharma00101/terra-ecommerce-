'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const ingredients = [
  { name: 'Argan Oil', desc: 'Helps nourish and condition beard hair for a softer, smoother feel.' },
  { name: 'Castor Oil', desc: 'Helps condition and soften rough-feeling beard hair.' },
  { name: 'Jojoba Oil', desc: 'Helps moisturise and smooth the beard for a more manageable feel.' },
  { name: 'Almond Oil', desc: 'Helps nourish and condition dry-feeling beard hair.' },
  { name: 'Black Seed Oil', desc: 'Helps nourish the beard and the skin underneath.' },
  { name: 'Vitamin E', desc: 'An antioxidant ingredient that helps support the conditioning properties of the formula.' },
  { name: 'Lavender Oil', desc: 'Adds a pleasant aromatic experience to your beard-care routine.' }
];

export const BeardOilIngredients = () => {
  return (
    <section className="py-24 bg-white relative border-t border-[#E5E0D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6D46] font-bold block mb-4">
            Powered By Nature&apos;s Nourishing Oils
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#181817] mb-6 font-light">
            7 Premium Cold-Pressed Oils
          </h2>
          <p className="text-[#55524D] text-lg font-light leading-relaxed">
            A thoughtfully formulated beard oil designed for everyday beard care. We selected the finest natural oils to condition, soften, and smooth.
          </p>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-20">
          {ingredients.map((ing, i) => (
            <motion.div 
              key={ing.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-6 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#8C6D46]" />
                <h3 className="font-serif text-[#181817] text-lg">{ing.name}</h3>
              </div>
              <p className="text-[#77736C] text-sm leading-relaxed font-light">
                {ing.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* BHT-Free Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-[#181817] text-white p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-[#8C6D46]/20 flex items-center justify-center shrink-0 border border-[#8C6D46]/30">
              <CheckCircle2 className="w-7 h-7 text-[#A88B63]" />
            </div>
            <div>
              <h3 className="text-xl font-serif mb-1 tracking-wide">BHT-FREE FORMULA</h3>
              <p className="text-white/60 text-sm font-light uppercase tracking-[0.1em]">
                Made without added BHT.
              </p>
            </div>
          </div>
          <div className="md:text-right max-w-sm">
            <p className="text-white/80 font-light leading-relaxed text-sm">
              We focus on purity and performance, ensuring your daily grooming routine is safe, natural, and effective.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
