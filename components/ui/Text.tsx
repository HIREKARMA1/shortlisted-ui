import { cn } from '@/lib/utils';

type TextProps = {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'label';
  variant?: 'body' | 'muted' | 'label' | 'title' | 'subtitle' | 'badge';
  className?: string;
  children: React.ReactNode;
};

const variants = {
  body: 'text-sm text-ink-primary',
  muted: 'text-sm text-ink-muted',
  label: 'text-sm font-medium text-ink-secondary',
  title: 'font-display text-2xl font-semibold tracking-tight text-ink-primary',
  subtitle: 'text-base text-ink-secondary',
  badge: 'badge-pill',
};

export function Text({ as: Tag = 'p', variant = 'body', className, children }: TextProps) {
  return <Tag className={cn(variants[variant], className)}>{children}</Tag>;
}
