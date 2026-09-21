'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Sparkles, User, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: Wind,
    title: 'Deeply Cleanses Pores',
    desc: 'Washes away trapped city dust, sweat, and pollution from deep within the pores.'
  },
  {
    icon: Droplets,
    title: 'Controls Excess Oil',
    desc: 'Helps clear away sticky, greasy buildup and uncomfortable mid-day shine.'
  },
  {
    icon: Sparkles,
    title: 'Prevents Breakouts',
    desc: 'Helps prevent pimples and uncomfortable ingrown beard hairs for a clearer complexion.'
  },
  {
    icon: User,
    title: 'Softens Before Shaving',
    desc: 'Gently softens the beard hair and skin, perfectly prepping your face for grooming.'
  },
  {
    icon: ShieldCheck,
    title: 'Hydrates & Calms',
    desc: 'Leaves your skin feeling refreshed, cool, and comfortably moisturized—never tight or dry.'
  }
];

export const FaceWashBenefits = () => {
  return (
    <section className="py-16 bg-[#F9F8F5] relative overflow-hidden border-t border-[#E5E0D8]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(45,68,56,0.05)_0%,_transparent_60%)] -translate-y-1/2 translate-x-1/3 pointer-events-none blur-[40px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                  The Benefits
                </span>
              </div>
              <h2 className="text-[24px] sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-serif font-light whitespace-nowrap tracking-tight inline-block bg-gradient-to-r from-black via-[#990000] to-[#FF3333] bg-clip-text text-transparent pb-1">
                Why Your Skin Will Love It
              </h2>
            </motion.div>
          </div>

          {/* Right Content Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group flex flex-col"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#E5E0D8] flex items-center justify-center mb-4 group-hover:bg-[#FAF8F5] transition-colors">
                    <benefit.icon className="w-4 h-4 text-[#2D4438] stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-serif text-[#181817] mb-2">{benefit.title}</h3>
                  <p className="text-[#55524D] text-sm leading-relaxed font-light">
                    {benefit.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
