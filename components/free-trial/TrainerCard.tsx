'use client';

import { useState } from 'react';
import { BrandAccent, isBrandAccent } from '@/lib/brand-accent';

export type TrainerCardData = {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  accent?: string;
};

type TrainerTone = {
  text: string;
  tint: string;
};

const TONES: Record<BrandAccent, TrainerTone> = {
  blue: { text: '#1b52a4', tint: '#e8f1ff' },
  sky: { text: '#0086bf', tint: '#e5f6ff' },
  yellow: { text: '#a97a06', tint: '#fff6d9' },
  orange: { text: '#f58020', tint: '#fff1e4' },
  red: { text: '#d64246', tint: '#fdeaea' },
  green: { text: '#098855', tint: '#e6f6ee' },
};

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

type TrainerCardProps = {
  item: TrainerCardData;
};

export function TrainerCard({ item }: TrainerCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const tone = TONES[isBrandAccent(item.accent) ? item.accent : 'blue'];
  const imageUrl = item.imageUrl?.trim();
  const showImage = Boolean(imageUrl) && !imageFailed;

  return (
    <article className="flex h-full flex-col items-center rounded-[14px] border border-[#e7ebf1] bg-white px-5 py-6 text-center shadow-[0_4px_18px_rgba(15,23,42,0.05)] sm:py-7">
      <div
        className="grid h-[104px] w-[104px] shrink-0 place-items-center overflow-hidden rounded-full sm:h-[124px] sm:w-[124px]"
        style={{ backgroundColor: tone.tint, boxShadow: `0 0 0 5px ${tone.tint}66` }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={item.name}
            className="h-full w-full object-cover object-top"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span
            className="text-[26px] font-bold leading-none sm:text-[30px]"
            style={{ color: tone.text }}
          >
            {initialsOf(item.name)}
          </span>
        )}
      </div>

      <h3 className="mt-4 font-serif text-[17px] font-bold leading-snug text-[#172033] sm:mt-5 sm:text-[19px]">
        {item.name}
      </h3>
      <p className="mt-1 text-[12.5px] font-semibold leading-snug sm:text-[13.5px]" style={{ color: tone.text }}>
        {item.role}
      </p>
    </article>
  );
}
