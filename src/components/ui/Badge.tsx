import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'subtle' | 'green' | 'dark' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'subtle',
  className = '',
}) => {
  const styles = {
    subtle: 'bg-[#EAE5DC] text-[#4A4742]',
    green: 'bg-[#2D4438] text-[#F6F3ED]',
    dark: 'bg-[#181817] text-[#F6F3ED]',
    outline: 'border border-[#DDD8CF] text-[#77736C] bg-transparent',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] font-medium ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
