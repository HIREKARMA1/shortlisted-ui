'use client';

import { cn } from '@/lib/utils';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import { InputHTMLAttributes, useState } from 'react';

type AuthFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  className?: string;
  compact?: boolean;
};

export function AuthField({ label, icon: Icon, error, className, compact, type, id, ...props }: AuthFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || props.name;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={cn(compact ? 'space-y-1' : 'space-y-1.5', className)}>
      <label
        htmlFor={inputId}
        className={cn(
          'font-semibold uppercase tracking-wider text-ink-muted',
          compact ? 'text-[10px]' : 'text-[11px]'
        )}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-brand-blue/45',
            compact ? 'left-3 h-3.5 w-3.5' : 'left-3.5 h-4 w-4'
          )}
          aria-hidden
        />
        <input
          id={inputId}
          type={inputType}
          className={cn(
            'w-full rounded-xl border bg-white text-sm text-ink-primary outline-none transition-shadow',
            compact ? 'py-2 pl-9' : 'py-2.5 pl-10',
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
