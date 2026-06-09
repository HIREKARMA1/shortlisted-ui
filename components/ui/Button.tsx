import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  fullWidth?: boolean;
};

const variants: Record<Variant, string> = {
  primary: 'bg-primary-500 text-ink-inverse hover:bg-primary-600 shadow-sm',
  secondary: 'bg-white text-primary-600 ring-1 ring-line-default hover:bg-primary-50',
  ghost: 'bg-transparent text-ink-secondary hover:bg-surface-muted',
  danger: 'bg-state-error text-ink-inverse hover:opacity-90',
};

export function Button({ variant = 'primary', fullWidth, className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    />
  );
}
