import { Linkedin, Youtube } from 'lucide-react';
import { MediaImage } from '@/components/ui/MediaImage';
import {
  BrandAccent,
  accentTextClass,
  isBrandAccent,
} from '@/lib/brand-accent';
import { cn } from '@/lib/utils';

export type TrainerCardData = {
  id: string;
  name: string;
  role: string;
  bio: string;
  highlights?: string[];
  imageUrl?: string;
  accent?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
};

type TrainerCardProps = {
  item: TrainerCardData;
  linkedinAria: string;
  youtubeAria: string;
};

export function TrainerCard({ item, linkedinAria, youtubeAria }: TrainerCardProps) {
  const accent: BrandAccent = isBrandAccent(item.accent) ? item.accent : 'blue';
  const linkedin = item.linkedinUrl?.trim();
  const youtube = item.youtubeUrl?.trim();
  const highlights = Array.isArray(item.highlights) ? item.highlights : [];

  return (
    <article className="flex h-full flex-col gap-5 rounded-xl border border-[#e8ecf1] bg-white p-5 shadow-[0_4px_18px_rgba(15,23,42,0.05)] sm:flex-row sm:items-start sm:gap-6 sm:p-6">
      <div className="mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full bg-neutral-950 ring-4 ring-[#f3f6fa] sm:mx-0 sm:h-32 sm:w-32">
        <MediaImage
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full"
          imgClassName="object-cover object-top"
          rounded="rounded-full"
        />
      </div>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <h3 className={cn('font-serif text-lg font-bold sm:text-xl', accentTextClass(accent))}>
          {item.name}
        </h3>
        <p className={cn('mt-1 text-sm font-semibold', accentTextClass(accent))}>{item.role}</p>

        {highlights.length > 0 ? (
          <ul className="mt-3 space-y-1.5 text-left text-sm leading-relaxed text-ink-muted">
            {highlights.map((line) => (
              <li key={line} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.bio}</p>
        )}

        <div className="mt-4 flex items-center justify-center gap-2.5 sm:justify-start">
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={linkedinAria}
              className="grid h-8 w-8 place-items-center rounded-md border border-line-default text-[#0A66C2] transition hover:bg-primary-50"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line-default text-[#0A66C2] opacity-45">
              <Linkedin className="h-4 w-4" />
            </span>
          )}
          {youtube ? (
            <a
              href={youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={youtubeAria}
              className="grid h-8 w-8 place-items-center rounded-md border border-line-default text-brand-red transition hover:bg-[#fdecec]"
            >
              <Youtube className="h-4 w-4" />
            </a>
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-md border border-line-default text-brand-red opacity-45">
              <Youtube className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
