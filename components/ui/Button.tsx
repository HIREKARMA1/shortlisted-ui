import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-blue text-white hover:bg-primary-600 shadow-sm focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2 font-bold uppercase tracking-wide',
  secondary:
    'border border-ink-primary/15 bg-white text-ink-primary hover:border-brand-blue hover:text-brand-blue focus-visible:ring-2 focus-visible:ring-brand-sky font-semibold',
  accent:
    'bg-brand-orange text-white hover:opacity-95 shadow-sm focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 font-bold uppercase tracking-wide',
  ghost: 'bg-transparent text-ink-secondary hover:bg-soft hover:text-brand-blue font-medium',
  danger:
    'bg-brand-red text-white hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 font-semibold',
};

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
}
