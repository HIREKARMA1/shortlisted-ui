'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHome } from './HomeProvider';

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
    <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6" aria-label="Student stories">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--ink)]">Student stories</h2>
        {cards.length > 1 ? (
          <div className="flex gap-2">
            <button type="button" aria-label="Previous story" onClick={() => setIndex((current) => (current - 1 + cards.length) % cards.length)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" aria-label="Next story" onClick={() => setIndex((current) => (current + 1) % cards.length)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </div>
      <ul className="grid gap-3 sm:grid-cols-3">
        {visible.slice(0, Math.min(3, cards.length)).map((card) => {
          const inner = (
            <>
              <div className="flex items-center gap-2">
                {card.image ? (
                  <img src={card.image} alt="" width={40} height={40} className="h-10 w-10 rounded-xl object-cover" />
                ) : (
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--brand-blue)] text-sm font-bold text-white">
                    {card.title.slice(0, 1)}
                  </span>
                )}
                <span>
                  <span className="block text-sm font-semibold text-[var(--ink)]">{card.title}</span>
                  <span className="block text-xs text-[var(--muted)]">{card.meta}</span>
                </span>
              </div>
              {card.body ? <p className="mt-2 line-clamp-3 text-sm text-[var(--muted)]">“{card.body}”</p> : null}
            </>
          );
          return (
            <li key={card.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_8px_20px_rgba(11,27,51,0.04)]">
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
    </section>
  );
}
