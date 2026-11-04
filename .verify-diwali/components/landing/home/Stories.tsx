'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHome } from './HomeProvider';
import { Reveal, SectionHeading } from './primitives';

export function Stories() {
  const { testimonials, stories, storiesLoading } = useHome();
  const [index, setIndex] = useState(0);
  if (storiesLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6" aria-hidden>
        <div className="h-28 animate-pulse rounded-2xl bg-[var(--surface)]" />
      </div>
    );
  }

  const cards =
    testimonials.length > 0
      ? testimonials.map((item) => ({
          id: item.id,
          title: item.name,
          meta: item.batch_name,
          body: item.feedback,
          image: item.image_url,
          href: undefined as string | undefined,
        }))
      : stories.map((item) => ({
          id: item.id,
          title: item.title,
          meta: 'Success story',
          body: '',
          image: item.thumbnail_url,
          href: item.video_url,
        }));

  if (cards.length === 0) return null;
  const visible = [0, 1, 2].map((offset) => cards[(index + offset) % cards.length]);

  return (
    <section id="stories" className="scroll-mt-[88px] w-full bg-[#F7F9FC] py-14" aria-label="Stories from the batch">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="STORIES"
            title="Stories from the batch"
            subtitle="Published stories and feedback from students who walked the 60-day placement journey."
          />
          {cards.length > 1 ? (
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => setIndex((current) => (current - 1 + cards.length) % cards.length)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--brand-sky)]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={() => setIndex((current) => (current + 1) % cards.length)}
                className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] transition-all hover:border-[var(--brand-sky)]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </div>
      </Reveal>
      <ul className="grid gap-4 sm:grid-cols-3">
        {visible.slice(0, Math.min(3, cards.length)).map((card) => {
          const inner = (
            <>
              <div className="flex items-center gap-3">
                {card.image ? (
                  <img src={card.image} alt="" width={44} height={44} className="h-11 w-11 rounded-full object-cover border border-[#E5EAF2]" />
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-[var(--brand-blue)] text-sm font-bold text-white">
                    {card.title.slice(0, 1)}
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-[var(--ink)]">{card.title}</span>
                  <span className="block truncate text-xs text-[var(--muted)]">{card.meta}</span>
                </span>
              </div>
              {card.body ? <p className="mt-3 line-clamp-3 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">“{card.body}”</p> : null}
            </>
          );
          return (
            <li key={card.id} className="rounded-[20px] border border-[#E5EAF2] bg-white p-5 shadow-[0_4px_16px_rgba(11,27,51,0.03)] hover:shadow-[0_12px_28px_rgba(11,27,51,0.06)] transition-all duration-200">
              {card.href ? (
                <a href={card.href} target="_blank" rel="noreferrer" className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)]">
                  {inner}
                </a>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
      </div>
    </section>
  );
}
