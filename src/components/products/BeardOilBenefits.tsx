'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Droplets, Sparkles, User, Sun } from 'lucide-react';

const benefits = [
  {
    icon: Leaf,
    title: 'Nourishes & Conditions',
    desc: 'Helps nourish and condition beard hair, leaving it feeling softer and smoother.'
  },
  {
    icon: Droplets,
    title: 'Helps Reduce Dryness',
    desc: 'Helps moisturise dry-feeling beard hair and improve its overall feel.'
  },
  {
    icon: Sparkles,
    title: 'Helps Soothe Itchy Feeling',
    desc: 'Helps soothe the uncomfortable itchy feeling associated with a dry beard.'
  },
  {
    icon: User,
    title: 'Smooth & Manageable',
    desc: 'Helps soften rough beard hair and makes your beard easier to groom and manage.'
  },
  {
    icon: Sun,
    title: 'Natural-Looking Shine',
    desc: 'Leaves your beard looking groomed with a healthy-looking shine.'
  }
];

export const BeardOilBenefits = () => {
  return (
    <section className="py-24 bg-[#F9F8F5] relative overflow-hidden border-t border-[#E5E0D8]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(140,109,70,0.05)_0%,_transparent_60%)] -translate-y-1/2 translate-x-1/3 pointer-events-none blur-[40px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-4 mb-6"
          >
            <div className="w-8 h-[1px] bg-[#D1C9BE]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#77736C] font-semibold">
              The Benefits
            </span>
            <div className="w-8 h-[1px] bg-[#D1C9BE]" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-[#181817] mb-6 font-light"
          >
            Why Your Beard Will Love It
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-[#E5E0D8] p-8 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center mb-6">
                <benefit.icon className="w-5 h-5 text-[#8C6D46] stroke-[1.5]" />
              </div>
              <h3 className="text-xl font-serif text-[#181817] mb-3">{benefit.title}</h3>
              <p className="text-[#55524D] text-sm leading-relaxed font-light">
                {benefit.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
