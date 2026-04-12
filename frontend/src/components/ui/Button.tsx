import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const sizeClasses = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-9 py-4 text-lg',
};

const variantClasses = {
  primary:
    'bg-brand text-white hover:bg-brand-hover',
  outline:
    'border-2 border-brand text-brand hover:bg-brand-light',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
