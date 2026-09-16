'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'mark' | 'wordmark' | 'horizontal';
  theme?: 'dark' | 'light' | 'white';
  className?: string;
  color?: string;
  markHeight?: number;
  compact?: boolean;
  href?: string | null;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  theme = 'dark',
  className = '',
  color,
  markHeight = 28,
  compact = false,
  href = '/',
}) => {
  const isDarkTheme =
    theme === 'light' ||
    theme === 'white' ||
    color === '#F6F3ED' ||
    color === '#FFFFFF' ||
    color === '#DDD8CF';
  const logoSrc = isDarkTheme ? '/images/logo/logo-white.png' : '/images/logo/logo-dark.png';
  const textColor = color ? color : isDarkTheme ? '#F6F3ED' : '#181817';

  const renderLogoImage = () => (
    <div className="relative group/emblem flex items-center justify-center">
      {/* Soft Champagne Gold Ambient Backdrop Halo */}
      <div className="absolute -inset-2.5 rounded-full bg-radial from-[#C4A482]/25 via-[#E5D7C5]/15 to-transparent blur-lg opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Emblem Container with Subtle Scale & Pure Drop Shadow */}
      <div
        style={{ width: markHeight * 0.95, height: markHeight }}
        className="relative shrink-0 transition-transform duration-500 ease-out group-hover/logo:scale-[1.06]"
      >
        <Image
          src={logoSrc}
          alt="Terra Men's Co. Emblem"
          fill
          className="object-contain filter drop-shadow-xs group-hover/logo:drop-shadow-[0_4px_16px_rgba(196,164,130,0.35)] transition-all duration-500"
          sizes="120px"
          priority
        />
      </div>
    </div>
  );

  const renderWordmark = (isHorizontal = false) => (
    <div className={`flex flex-col ${isHorizontal ? 'items-start text-left' : 'items-center text-center'} leading-none select-none group/wordmark`}>
      {/* Main Brand Title: TERRA */}
      <div className="relative overflow-hidden">
        <span
          style={{ color: textColor }}
          className={`font-serif font-normal tracking-[0.4em] sm:tracking-[0.44em] uppercase transition-all duration-500 block group-hover/logo:text-[#C4A482] ${
            compact ? 'text-sm sm:text-base' : 'text-base sm:text-xl'
          }`}
        >
          TERRA
        </span>
        {/* Subtle Luxury Shimmer Reflection Wave */}
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#C4A482]/50 to-transparent -translate-x-full group-hover/logo:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />
      </div>

      {/* Subtitle Tagline: MEN'S CO. with Warm Gold Hairline Accent Lines */}
      <div className="flex items-center gap-2 mt-1.5">
        <span className="w-2 sm:w-3 h-[1px] bg-[#C4A482]/50 group-hover/logo:w-4 sm:group-hover/logo:w-5 group-hover/logo:bg-[#C4A482] transition-all duration-500" />
        <span
          style={{ color: textColor }}
          className={`font-sans font-bold tracking-[0.52em] uppercase opacity-70 transition-all duration-500 group-hover/logo:opacity-100 group-hover/logo:text-[#A88B68] ${
            compact ? 'text-[6px] sm:text-[6.5px]' : 'text-[7px] sm:text-[8px]'
          }`}
        >
          MEN’S CO.
        </span>
        <span className="w-2 sm:w-3 h-[1px] bg-[#C4A482]/50 group-hover/logo:w-4 sm:group-hover/logo:w-5 group-hover/logo:bg-[#C4A482] transition-all duration-500" />
      </div>
    </div>
  );

  const content = (
    <>
      {variant === 'mark' && renderLogoImage()}
      {variant === 'wordmark' && renderWordmark()}
      {variant === 'full' && (
        <div className="flex flex-col items-center gap-1.5">
          {renderLogoImage()}
          {renderWordmark()}
        </div>
      )}
      {variant === 'horizontal' && (
        <div className="flex items-center gap-3">
          {renderLogoImage()}
          <div className="h-6 w-[1px] bg-gradient-to-b from-transparent via-[#C4A482]/60 to-transparent group-hover/logo:via-[#C4A482] transition-colors duration-500" />
          {renderWordmark(true)}
        </div>
      )}
    </>
  );

  if (!href) {
    return (
      <div
        className={`group/logo inline-flex items-center gap-2.5 ${className}`}
        aria-label="Terra Men's Co."
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className={`group/logo inline-flex items-center gap-2.5 focus:outline-none ${className}`}
      aria-label="Terra Men's Co. Home"
    >
      {content}
    </Link>
  );
};


