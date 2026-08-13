import { Clock, User } from 'lucide-react';
import { MediaImage } from '@/components/ui/MediaImage';
import {
  BrandAccent,
  accentBgClass,
  isBrandAccent,
} from '@/lib/brand-accent';
import { cn } from '@/lib/utils';
import type { VideoQualitySource } from '@/components/free-trial/ClassVideoPlayer';

export type ClassCardData = {
  id: string;
  title: string;
  duration: string;
  level: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  videoSources?: VideoQualitySource[];
  accent?: string;
};

type ClassCardProps = {
  item: ClassCardData;
  playAria: string;
  className?: string;
  onPlay?: (item: ClassCardData) => void;
};

const PLAY_COLOR: Record<BrandAccent, string> = {
  blue: '#1b52a4',
  sky: '#00a2e5',
  yellow: '#c99200',
  orange: '#f58020',
  red: '#d64246',
  green: '#098855',
};

export function ClassCard({ item, playAria, className, onPlay }: ClassCardProps) {
  const accent: BrandAccent = isBrandAccent(item.accent) ? item.accent : 'blue';
  const hasThumb = Boolean(item.thumbnailUrl?.trim());
  const playColor = PLAY_COLOR[accent];

  return (
    <button
      type="button"
      onClick={() => onPlay?.(item)}
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-[12px] border border-[#e5eaf0] bg-white text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b52a4]/40',
        className,
      )}
    >
      <div className={cn('relative aspect-[5/4] overflow-hidden', accentBgClass(accent))}>
        {hasThumb ? (
          <MediaImage
            src={item.thumbnailUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover object-center"
            rounded="rounded-none"
          />
        ) : (
          <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/25" />
            <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-black/10" />
          </div>
        )}

        <span className="absolute bottom-[14%] left-3.5 z-10" aria-hidden>
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(15,23,42,0.16)] sm:h-[42px] sm:w-[42px]">
            <svg viewBox="0 0 24 24" className="h-8 w-8" style={{ fill: playColor }}>
              <path d="M8 5.5v13l11-6.5L8 5.5z" />
            </svg>
          </span>
        </span>
        <span className="sr-only">{playAria}</span>
      </div>

      <div className="flex flex-1 flex-col gap-2.5 px-3.5 py-3.5">
        <h3 className="font-serif text-[13px] font-bold leading-snug text-[#172033] sm:text-sm">
          {item.title}
        </h3>
        <div className="mt-auto flex w-full items-center justify-between gap-2 text-[11px] leading-none text-[#6b7280]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" strokeWidth={1.75} aria-hidden />
            <span className="font-sans tabular-nums lining-nums">{item.duration}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 shrink-0 text-[#9ca3af]" strokeWidth={1.75} aria-hidden />
            <span className="font-sans">{item.level}</span>
          </span>
        </div>
      </div>
    </button>
  );
}
