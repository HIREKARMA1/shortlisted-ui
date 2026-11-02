import { cn } from '@/lib/utils';

type BadgeTone = 'primary' | 'sky' | 'success' | 'warning' | 'error' | 'neutral';

const tones: Record<BadgeTone, string> = {
  primary: 'bg-primary-50 text-primary-700 ring-1 ring-primary-200',
  sky: 'bg-secondary-50 text-secondary-700 ring-1 ring-secondary-200',
  success: 'bg-emerald-50 text-brand-green ring-1 ring-brand-green/30',
  warning: 'bg-amber-50 text-amber-800 ring-1 ring-brand-yellow/50',
  error: 'bg-red-50 text-brand-red ring-1 ring-brand-red/30',
  neutral: 'bg-neutral-100 text-neutral-700 ring-1 ring-neutral-200',
};

export function Badge({
  children,
  tone = 'primary',
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
