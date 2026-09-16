import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowDown } from 'lucide-react';

interface HeroProps {
  faceWash?: any;
  beardOil?: any;
}

export const HeroCinematic: React.FC<HeroProps> = ({ faceWash, beardOil }) => {
  return (
    <section className="relative min-h-[100dvh] lg:min-h-[80vh] lg:h-[85vh] w-full overflow-hidden bg-[#121212] pt-[100px] lg:pt-[120px] flex flex-col">

      {/* Background Cinematic Video Visual */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/home/hero-campaign.jpg"
          style={{ backgroundColor: '#121212' }}
          className="w-full h-full object-cover pointer-events-none"
        >
          <source src="/videos/hero/hero-section.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Extremely minimal overlay to ensure video is fully visible while keeping text readable */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.6)_100%)] pointer-events-none" />
      </div>

      {/* Deconstructed Framing Layout */}
      <div className="relative z-20 w-full flex-1 max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 pb-12 flex flex-col justify-between">

        {/* TOP ROW */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start w-full gap-8 mt-4 lg:mt-8">

          {/* Top Left: Kicker */}
          <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <span className="w-12 h-[2px] bg-[#DC143C]"></span>
            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white drop-shadow-md">
              Signature <br className="hidden lg:block" /> Collection
            </span>
          </div>

          {/* Top Right: Headline */}
          <div className="text-left lg:text-right animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h1 className="flex flex-col items-start lg:items-end gap-2">
              <span className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light tracking-wide text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                Two Steps.
              </span>
              <span className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] italic text-[#DC143C] font-normal drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                Nothing Unnecessary.
              </span>
            </h1>
            <h2 className="sr-only">Essential Men&apos;s Skincare &amp; Beard Grooming Routine by Terra Men&apos;s Co.</h2>
          </div>

        </div>

        {/* BOTTOM ROW */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end w-full gap-6 lg:gap-0">

          {/* Bottom Left: Description & CTA */}
          <div className="max-w-sm animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <p className="text-white/80 text-xs sm:text-sm font-light leading-relaxed mb-8 drop-shadow-md">
              Experience our definitive botanical routine. Precision-crafted formulations designed to cleanse deeply, nourish effortlessly, and protect daily.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-4 px-8 py-4 overflow-hidden border border-white/30 hover:border-[#DC143C] text-white text-[10px] uppercase tracking-[0.25em] group-hover:tracking-[0.32em] font-bold backdrop-blur-md transition-all duration-500 hover:shadow-[0_0_35px_rgba(220,20,60,0.5)] cursor-pointer"
              >
                {/* Expanding Liquid Background Curtain Fill */}
                <span className="absolute inset-0 bg-[#DC143C] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />

                {/* Diagonal Light Sheen Shimmer Reflection */}
                <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[350%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Button Content */}
                <span className="relative z-10 transition-colors duration-300 font-bold">
                  Shop Now
                </span>

                {/* Designer Circular Arrow Pill */}
                <span className="relative z-10 w-6 h-6 rounded-full bg-white/10 group-hover:bg-white flex items-center justify-center text-[#DC143C] group-hover:text-[#121212] group-hover:-rotate-45 transition-all duration-500 ease-out shadow-xs">
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>
          </div>

          {/* Bottom Right: Floating Circular Products & CTA */}
          <div className="flex flex-col items-start lg:items-end gap-6 animate-fade-in-up mt-0 lg:mr-[35px]" style={{ animationDelay: '700ms' }}>

            {/* The 2 Products */}
            <div className="flex gap-6 items-end -translate-y-8 sm:-translate-y-4 lg:translate-y-[45px] -translate-x-[5px]">

              {faceWash && (
                <Link href={`/shop/${faceWash.slug || faceWash.id}`} className="group flex flex-col items-center gap-3 cursor-pointer">
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="block text-white text-[9px] tracking-[0.2em] uppercase font-bold">{faceWash.name}</span>
                    <span className="block text-[#DC143C] text-[8px] uppercase tracking-widest mt-1">Step 01</span>
                  </div>

                  {/* Glowing Progressive Circular Bar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full relative flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(220,20,60,0.4)] transition-shadow duration-500">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_75%,#DC143C_100%)] animate-[spin_3s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-[2px] rounded-full overflow-hidden bg-[#121212]">
                      <Image
                        src={faceWash?.featuredImage || faceWash?.images?.[0]?.url || '/images/home/hero-campaign.jpg'}
                        alt={`Terra Men's Co. ${faceWash?.name || 'Face Wash'}`}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        priority
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </Link>
              )}

              {beardOil && (
                <Link href={`/shop/${beardOil.slug || beardOil.id}`} className="group flex flex-col items-center gap-3 cursor-pointer">
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                    <span className="block text-white text-[9px] tracking-[0.2em] uppercase font-bold">{beardOil.name}</span>
                    <span className="block text-[#DC143C] text-[8px] uppercase tracking-widest mt-1">Step 02</span>
                  </div>

                  {/* Glowing Progressive Circular Bar */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full relative flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_rgba(220,20,60,0.4)] transition-shadow duration-500">
                    <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_75%,#DC143C_100%)] animate-[spin_3s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-500" style={{ animationDelay: '-1.5s' }} />
                    <div className="absolute inset-[2px] rounded-full overflow-hidden bg-[#121212]">
                      <Image
                        src={beardOil?.featuredImage || beardOil?.images?.[0]?.url || '/images/home/hero-campaign.jpg'}
                        alt={`Terra Men's Co. ${beardOil?.name || 'Beard Oil'}`}
                        fill
                        sizes="(max-width: 640px) 64px, 80px"
                        priority
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                </Link>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
