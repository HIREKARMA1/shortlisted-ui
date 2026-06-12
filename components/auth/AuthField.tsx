'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  className?: string;
};

export function AuthField({ label, icon: Icon, error, className, type, id, ...props }: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={cn('space-y-1.5', className)}>
      <label htmlFor={inputId} className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-blue/45"
          aria-hidden
        />
        <input
          id={inputId}
          type={inputType}
          className={cn(
            'w-full rounded-xl border bg-white py-2.5 pl-10 text-sm text-ink-primary outline-none transition-shadow',
            'border-line-default placeholder:text-ink-muted/60',
            'focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/15',
            isPassword ? 'pr-10' : 'pr-3.5',
            error && 'border-brand-red focus:border-brand-red focus:ring-brand-red/15'
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-ink-muted transition-colors hover:text-brand-blue"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}
