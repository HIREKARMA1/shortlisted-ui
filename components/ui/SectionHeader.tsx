import { cn } from '@/lib/utils';

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-10 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
        <h2 className={cn('section-title', eyebrow && 'mt-2')}>{title}</h2>
        {subtitle && <p className="mt-3 text-ink-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
