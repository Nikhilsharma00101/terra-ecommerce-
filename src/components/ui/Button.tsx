import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'green' | 'sand';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-[0.16em] uppercase transition-all duration-300 select-none cursor-pointer text-center';

  const sizeStyles = {
    sm: 'text-[10px] py-2.5 px-4',
    md: 'text-xs py-3.5 px-7',
    lg: 'text-xs sm:text-sm py-4 px-9',
  };

  const variantStyles = {
    primary:
      'bg-[#181817] text-[#F6F3ED] border border-[#181817] hover:bg-[#2D4438] hover:border-[#2D4438] hover:text-[#F6F3ED]',
    secondary:
      'bg-transparent text-[#181817] border border-[#181817] hover:bg-[#181817] hover:text-[#F6F3ED]',
    green:
      'bg-[#2D4438] text-[#F6F3ED] border border-[#2D4438] hover:bg-[#181817] hover:border-[#181817]',
    sand:
      'bg-[#D8C3A5] text-[#181817] border border-[#D8C3A5] hover:bg-[#181817] hover:text-[#F6F3ED]',
    ghost:
      'bg-transparent text-[#181817] px-0 border-b border-[#181817] hover:opacity-70 !p-0',
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
