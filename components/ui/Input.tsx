import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, readOnly, disabled, ...props }: InputProps) {
  const inputId = id || props.name;
  const isLocked = Boolean(readOnly || disabled);
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        readOnly={readOnly}
        disabled={disabled}
        className={cn(
          'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-shadow',
          isLocked
            ? 'cursor-not-allowed border-line-default bg-slate-50 text-ink-muted'
            : 'border-line-default bg-white focus:border-brand-sky focus:ring-2 focus:ring-secondary-100',
          error && 'border-brand-red focus:border-brand-red focus:ring-red-100',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}
