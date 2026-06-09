import { cn } from '@/lib/utils';

export function SectionHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="mt-1 text-ink-secondary">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
