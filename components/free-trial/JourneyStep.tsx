import { ArrowRight } from 'lucide-react';
import { getLucideIcon } from '@/lib/icons';
import {
  BrandAccent,
  accentBgClass,
  isBrandAccent,
} from '@/lib/brand-accent';
import { cn } from '@/lib/utils';

export type JourneyStepData = {
  id: string;
  title: string;
  accent?: string;
  icon?: string;
  bullets?: string[];
};

type JourneyStepProps = {
  item: JourneyStepData;
  showConnector?: boolean;
};

export function JourneyStep({ item, showConnector = false }: JourneyStepProps) {
  const accent: BrandAccent = isBrandAccent(item.accent) ? item.accent : 'blue';
  const Icon = getLucideIcon(item.icon);
  const bullets = Array.isArray(item.bullets) ? item.bullets : [];

  return (
    <li className="relative flex min-w-0 flex-1 flex-col items-center">
      <div className="flex w-full flex-col items-center text-center">
        <div className="relative flex items-center justify-center">
          <div className="grid h-[4.75rem] w-[4.75rem] place-items-center rounded-2xl border border-[#e5eaf0] bg-[#f7f9fc]">
            <span
              className={cn(
                'grid h-12 w-12 place-items-center rounded-full text-white shadow-sm',
                accentBgClass(accent),
                accent === 'yellow' && 'text-ink-primary',
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2.25} />
            </span>
          </div>

          {showConnector ? (
            <span className="absolute left-[calc(100%+0.35rem)] top-1/2 hidden -translate-y-1/2 text-brand-blue xl:inline-flex">
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} aria-hidden />
            </span>
          ) : null}
        </div>

        <h3 className="mt-3.5 font-serif text-sm font-bold text-ink-primary">
          {item.title}
        </h3>
        <ul className="mt-2 w-full space-y-1 px-1 text-left">
          {bullets.map((bullet) => (
            <li key={bullet} className="flex gap-1.5 text-[11px] leading-snug text-ink-muted sm:text-xs">
              <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-ink-muted/60" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
