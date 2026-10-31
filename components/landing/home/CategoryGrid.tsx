'use client';

import { ArrowUpRight } from 'lucide-react';
import { categories } from '@/lib/home/content';
import { featureIcons, toneStyles } from './featureStyles';
import { Reveal, SectionHeading } from './primitives';

export function CategoryGrid({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-label="Explore categories">
      <Reveal>
        <SectionHeading
          eyebrow="Explore"
          title="Everything in one placement cell"
          subtitle="Pick a feature to see what opens after sign-in or after you subscribe."
        />
      </Reveal>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {categories.map((item, index) => {
          const Icon = featureIcons[item.id];
          const tone = toneStyles[item.tone];
          const active = selected === item.id;
          return (
            <Reveal key={item.id} delay={index * 0.03}>
              <button
                type="button"
                onClick={() => onSelect(item.id)}
                aria-pressed={active}
                className={`group flex h-full w-full flex-col rounded-[20px] border border-transparent p-3.5 text-left transition duration-200 hover:-translate-y-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)] ${tone.tileBg} ${tone.border} ${
                  active
                    ? 'ring-2 ring-[var(--brand-blue)] shadow-[0_14px_32px_rgba(27,82,164,0.16)]'
                    : 'shadow-[0_8px_24px_rgba(11,27,51,0.04)] hover:shadow-[0_14px_28px_rgba(11,27,51,0.08)]'
                }`}
              >
                <span className="flex items-start justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-[14px] bg-gradient-to-br ${tone.gradient} ${tone.iconOnGradient}`}>
                    <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 -translate-x-1 text-[var(--muted)] opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden
                  />
                </span>
                <span className="mt-3 text-[15px] font-semibold text-[var(--ink)] sm:text-base">{item.title}</span>
                <span className="mt-0.5 text-xs text-[var(--muted)]">{item.caption}</span>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
