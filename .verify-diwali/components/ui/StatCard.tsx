import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const borderAccent = {
  blue: 'border-t-brand-blue',
  sky: 'border-t-brand-sky',
  green: 'border-t-brand-green',
  orange: 'border-t-brand-orange',
  yellow: 'border-t-brand-yellow',
  red: 'border-t-brand-red',
} as const;

const textAccent = {
  blue: 'text-brand-blue',
  sky: 'text-brand-sky',
  green: 'text-brand-green',
  orange: 'text-brand-orange',
  yellow: 'text-brand-yellow',
  red: 'text-brand-red',
} as const;

export function StatCard({
  label,
  value,
  hint,
  accent = 'blue',
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: keyof typeof borderAccent;
  icon?: LucideIcon;
}) {
  return (
    <div className={cn('card-surface border-t-4 p-5', borderAccent[accent])}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-ink-muted">{label}</p>
          <p className={cn('mt-1 truncate text-2xl font-semibold', textAccent[accent])}>{value}</p>
          {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-surface-muted p-2.5">
            <Icon className={cn('h-5 w-5', textAccent[accent])} />
          </div>
        )}
      </div>
    </div>
  );
}
