import React from 'react';
import { RitualStep } from '@/types';
import { Clock, Sparkles } from 'lucide-react';

interface RitualStepsProps {
  steps: RitualStep[];
  title?: string;
  subtitle?: string;
}

export const RitualSteps: React.FC<RitualStepsProps> = ({
  steps,
  title = 'THE DAILY RITUAL',
  subtitle = 'Two minutes. Morning and evening.',
}) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2D4438]/8 border border-[#2D4438]/15 mb-3">
            <Sparkles size={12} className="text-[#2D4438]" />
            <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#2D4438]">
              DISCIPLINE & APPLICATION
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181817] font-light tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-[#77736C] mt-2 font-light">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white border border-[#E5E0D8] p-7 sm:p-8 relative flex flex-col justify-between hover:border-[#181817] transition-all duration-300 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-serif text-5xl text-[#E8E3DA] font-light group-hover:text-[#2D4438]/30 transition-colors">
                    0{step.number}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#2D4438] bg-[#F5F2EA] border border-[#E2DDD5] px-3 py-1 rounded-full font-mono font-medium">
                    <Clock size={12} className="text-[#2D4438]" />
                    <span>{step.timing}</span>
                  </div>
                </div>

                <h3 className="font-serif text-xl text-[#181817] font-medium mb-2.5">
                  {step.title}
                </h3>

                <p className="text-xs text-[#55524D] leading-relaxed font-light mb-6">
                  {step.action}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E0D8] bg-[#F9F7F2] -mx-7 -mb-7 sm:-mx-8 sm:-mb-8 p-5 sm:p-6">
                <span className="text-[9px] uppercase tracking-widest text-[#8B0000] font-bold block mb-1">
                  PRACTICE NOTE
                </span>
                <p className="text-[11px] text-[#55524D] italic leading-relaxed">
                  {step.tip}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
