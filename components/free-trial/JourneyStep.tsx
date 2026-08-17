import { ArrowRight } from 'lucide-react';
import { getLucideIcon } from '@/lib/icons';
import { BrandAccent, isBrandAccent } from '@/lib/brand-accent';
import { cn } from '@/lib/utils';

export type JourneyStepData = {
  id: string;
  title: string;
  accent?: string;
  icon?: string;
  bullets?: string[];
};

type JourneyTone = {
  surface: string;
  border: string;
  text: string;
  circle: string;
  iconText: string;
};

const TONES: Record<BrandAccent, JourneyTone> = {
  blue: {
    surface: '#f4f9ff',
    border: '#dce9fb',
    text: '#1b52a4',
    circle: '#1b52a4',
    iconText: '#ffffff',
  },
  sky: {
    surface: '#f2f9ff',
    border: '#d4e9fa',
    text: '#0b6fb4',
    circle: '#00a2e5',
    iconText: '#ffffff',
  },
  yellow: {
    surface: '#fdf9ef',
    border: '#f7e6bd',
    text: '#c99200',
    circle: '#fec40d',
    iconText: '#ffffff',
  },
  orange: {
    surface: '#fef7ef',
    border: '#fadfc4',
    text: '#f58020',
    circle: '#f58020',
    iconText: '#ffffff',
  },
  red: {
    surface: '#fdf4f4',
    border: '#f7d7d7',
    text: '#d64246',
    circle: '#d64246',
    iconText: '#ffffff',
  },
  green: {
    surface: '#f4faf7',
    border: '#cfe9dd',
    text: '#098855',
    circle: '#098855',
    iconText: '#ffffff',
  },
};

export function journeyToneOf(accent?: string): JourneyTone {
  return TONES[isBrandAccent(accent) ? accent : 'blue'];
}

type JourneyStepProps = {
  item: JourneyStepData;
  className?: string;
};

export function JourneyStep({ item, className }: JourneyStepProps) {
  const tone = journeyToneOf(item.accent);
  const Icon = getLucideIcon(item.icon);
  const bullets = Array.isArray(item.bullets) ? item.bullets : [];

  return (
    <li
      className={cn('flex min-w-0 flex-col rounded-[12px] border px-4 pb-[18px] pt-[18px]', className)}
      style={{ backgroundColor: tone.surface, borderColor: tone.border }}
    >
      <span
        className="mx-auto grid h-12 w-12 place-items-center rounded-full"
        style={{ backgroundColor: tone.circle, color: tone.iconText }}
      >
        <Icon className="h-6 w-6" strokeWidth={2.25} aria-hidden />
      </span>

      <h3
        className="mt-3.5 text-center font-serif text-[15px] font-bold leading-snug"
        style={{ color: tone.text }}
      >
        {item.title}
      </h3>

      <ul className="mt-3.5 space-y-2.5">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2 text-left text-[12.5px] leading-[1.35] text-[#4b5563]">
            <span
              className="mt-[6px] h-[3.5px] w-[3.5px] shrink-0 rounded-full"
              style={{ backgroundColor: tone.text }}
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function JourneyArrow({ accent }: { accent?: string }) {
  const tone = journeyToneOf(accent);

  return (
    <li className="flex shrink-0 items-start px-1.5 pt-[32px]" aria-hidden>
      <ArrowRight className="h-[19px] w-[19px]" strokeWidth={2.5} style={{ color: tone.text }} />
    </li>
  );
}
