import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type CtaVariant = 'primary' | 'outline' | 'white';
type CtaSize = 'md' | 'lg';

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: CtaVariant;
  size?: CtaSize;
  className?: string;
  showArrow?: boolean;
};

const variants: Record<CtaVariant, string> = {
  primary:
    'bg-brand-blue text-white hover:bg-primary-600 shadow-sm focus-visible:ring-2 focus-visible:ring-brand-sky focus-visible:ring-offset-2',
  outline:
    'border-2 border-brand-blue bg-white text-brand-blue hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-brand-sky',
  white:
    'bg-white text-brand-blue hover:bg-primary-50 shadow-sm focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-blue',
};

const sizes: Record<CtaSize, string> = {
  md: 'rounded-lg px-5 py-2.5 text-sm',
  lg: 'rounded-lg px-7 py-3.5 text-base',
};

export function CtaLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className,
  showArrow = true,
}: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all',
        variants[variant],
        sizes[size],
        className,
      )}
    >
      <span>{children}</span>
      {showArrow && <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />}
    </Link>
  );
}
