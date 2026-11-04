import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  number?: string;
  title: string;
  subtitle?: string;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  number,
  title,
  subtitle,
  intro,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <h2 className="font-serif text-[1.65rem] font-bold tracking-tight text-[#172033] sm:text-3xl lg:text-[2.35rem]">
        {number ? `${number}. ${title}` : title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-2.5 text-sm leading-relaxed text-[#6b7280] sm:text-[15px]',
            align === 'center' && 'mx-auto max-w-2xl',
          )}
        >
          {subtitle}
        </p>
      )}
      {intro && (
        <p
          className={cn(
            'mt-3 text-sm leading-relaxed text-ink-muted',
            align === 'center' && 'mx-auto max-w-3xl',
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
