import React from 'react';
import { Ingredient } from '@/types';
import { Leaf, Sparkles } from 'lucide-react';

interface IngredientStoryProps {
  ingredients: Ingredient[];
  productName: string;
}

export const IngredientStory: React.FC<IngredientStoryProps> = ({
  ingredients,
  productName,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-[#F4F1EB] border-t border-b border-[#E2DDD5] relative overflow-hidden select-none">
      {/* Subtle organic warmth in background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(45,68,56,0.05)_0%,_transparent_60%)] pointer-events-none -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(196,164,130,0.08)_0%,_transparent_60%)] pointer-events-none translate-y-1/3 -translate-x-1/4" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D4438]/8 border border-[#2D4438]/15 mb-3">
            <Sparkles size={12} className="text-[#2D4438]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4438]">
              BOTANICAL ARCHITECTURE
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181817] font-light leading-tight tracking-tight">
            Key Ingredients & Physiology
          </h2>
          <p className="text-xs sm:text-sm text-[#55524D] mt-3 font-light leading-relaxed">
            Every element in {productName} was selected with deliberate intent. No synthetic fillers, no artificial perfumes—only high-potency, cold-pressed botanicals and biocompatible actives that honor the skin barrier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ingredients.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E5E0D8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#2D4438]/40 transition-all duration-300 group rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-[#2D4438] font-bold bg-[#2D4438]/8 px-2.5 py-0.5 rounded-full">
                    0{idx + 1}
                  </span>
                  {item.origin && (
                    <span className="text-[10px] uppercase tracking-wider text-[#77736C] font-mono">
                      {item.origin}
                    </span>
                  )}
                </div>

                <h3 className="font-serif text-2xl text-[#181817] font-medium group-hover:text-[#2D4438] transition-colors duration-300">
                  {item.name}
                </h3>

                {item.botanicalName && (
                  <p className="text-[11px] font-serif italic text-[#77736C] mt-0.5">
                    {item.botanicalName}
                  </p>
                )}

                <div className="my-3.5 py-1 px-3 bg-[#F5F2EA] inline-block text-[9px] uppercase tracking-widest text-[#2D4438] font-bold border border-[#E2DDD5] rounded-full">
                  {item.role}
                </div>

                <p className="text-xs text-[#55524D] leading-relaxed mt-2 font-light">
                  {item.description}
                </p>
              </div>

              <div className="pt-5 mt-6 border-t border-[#E5E0D8] flex items-center gap-2 text-[10px] text-[#77736C] uppercase tracking-widest font-mono">
                <Leaf size={13} className="text-[#2D4438]" />
                <span>Cold-extracted active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
