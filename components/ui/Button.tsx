import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-blue text-ink-inverse hover:bg-primary-600 shadow-sm focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2',
  secondary:
    'bg-white text-brand-blue ring-1 ring-brand-sky/40 hover:bg-secondary-50 focus-visible:ring-2 focus-visible:ring-brand-sky',
  accent:
    'bg-brand-orange text-ink-inverse hover:opacity-95 shadow-sm focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-muted hover:text-brand-blue',
  danger:
    'bg-brand-red text-ink-inverse hover:opacity-95 focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2',
};

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
}
