import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition-shadow',
          'border-line-default focus:border-brand-sky focus:ring-2 focus:ring-secondary-100',
          error && 'border-brand-red focus:border-brand-red focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}
