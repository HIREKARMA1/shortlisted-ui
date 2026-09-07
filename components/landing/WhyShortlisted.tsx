'use client';

import { useCallback, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

const cards: {
  id: string;
  titleKey: string;
  descKey: string;
  number: string;
}[] = [
  {
    id: 'agent',
    titleKey: 'landing.whyShortlisted.cards.agent.title',
    descKey: 'landing.whyShortlisted.cards.agent.desc',
    number: '01',
  },
  {
    id: 'coordinator',
    titleKey: 'landing.whyShortlisted.cards.coordinator.title',
    descKey: 'landing.whyShortlisted.cards.coordinator.desc',
    number: '02',
  },
  {
    id: 'assessments',
    titleKey: 'landing.whyShortlisted.cards.assessments.title',
    descKey: 'landing.whyShortlisted.cards.assessments.desc',
    number: '03',
  },
  {
    id: 'matching',
    titleKey: 'landing.whyShortlisted.cards.matching.title',
    descKey: 'landing.whyShortlisted.cards.matching.desc',
    number: '04',
  },
  {
    id: 'tracking',
    titleKey: 'landing.whyShortlisted.cards.tracking.title',
    descKey: 'landing.whyShortlisted.cards.tracking.desc',
    number: '05',
  },
  {
    id: 'prep',
    titleKey: 'landing.whyShortlisted.cards.prep.title',
    descKey: 'landing.whyShortlisted.cards.prep.desc',
    number: '06',
  },
  {
    id: 'batch',
    titleKey: 'landing.whyShortlisted.cards.batch.title',
    descKey: 'landing.whyShortlisted.cards.batch.desc',
    number: '07',
  },
];

const SCROLL_SPEED_PX_PER_SEC = 40;
const RESUME_DELAY_MS = 1800;
const LOOP_CARDS = [...cards, ...cards];

function HeadingSparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 0L13.8 8.2L22 10L13.8 11.8L12 20L10.2 11.8L2 10L10.2 8.2L12 0Z" />
    </svg>
  );
}

function FeatureCard({ card }: { card: (typeof cards)[number] }) {
  const { t } = useTranslation();

  return (
    <article className="group flex w-[300px] shrink-0 flex-col rounded-2xl bg-white p-7 shadow-[0_4px_24px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out hover:-translate-y-2.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] sm:w-[320px] sm:p-8">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25d0ba] text-xs font-bold tracking-wide text-white">
          {card.number}
        </span>

        <h3 className="font-display text-lg font-bold leading-snug text-brand-blue sm:text-xl">
          {t(card.titleKey)}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-[0.9375rem]">
        {t(card.descKey)}
      </p>
    </article>
  );
}

function NavArrow({
  direction,
  onClick,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
}) {
  const Icon = direction === 'left' ? ArrowLeft : ArrowRight;

  return (
    <button
      type="button"
      aria-label={direction === 'left' ? 'Previous cards' : 'Next cards'}
      onClick={onClick}
      className={[
        'absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink-primary shadow-[0_8px_24px_rgba(15,23,42,0.14)] ring-1 ring-black/5 transition-all duration-300',
        'hover:scale-105 hover:shadow-[0_12px_28px_rgba(15,23,42,0.2)]',
        'active:scale-95',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:ring-offset-2',
        'sm:h-12 sm:w-12',
        direction === 'left' ? 'left-1 sm:left-2 md:left-3' : 'right-1 sm:right-2 md:right-3',
      ].join(' ')}
    >
      <Icon className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" strokeWidth={2.25} />
    </button>
  );
}

export function WhyShortlisted() {
  const { t } = useTranslation();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rafRef = useRef<number | null>(null);
  const wrappingRef = useRef(false);

  const getLoopWidth = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 0;
    return el.scrollWidth / 2;
  }, []);

  const getStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return 320;
    const card = el.querySelector<HTMLElement>('article');
    if (!card) return 320;
    const styles = getComputedStyle(el);
    const gap = parseFloat(styles.columnGap || styles.gap || '20') || 20;
    return card.offsetWidth + gap;
  }, []);

  const pauseAuto = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const scheduleResume = useCallback((delay = RESUME_DELAY_MS) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      resumeTimerRef.current = null;
    }, delay);
  }, []);

  const wrapIfNeeded = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || wrappingRef.current) return;
    const loopWidth = getLoopWidth();
    if (loopWidth <= 0) return;

    if (el.scrollLeft >= loopWidth) {
      wrappingRef.current = true;
      el.scrollLeft -= loopWidth;
      wrappingRef.current = false;
    }
  }, [getLoopWidth]);

  const scrollByCard = useCallback(
    (direction: 'left' | 'right') => {
      const el = scrollerRef.current;
      if (!el) return;

      pauseAuto();
      scheduleResume();

      const step = getStep();
      const loopWidth = getLoopWidth();
      if (loopWidth <= 0) return;

      if (direction === 'left' && el.scrollLeft < step + 1) {
        wrappingRef.current = true;
        el.scrollLeft += loopWidth;
        wrappingRef.current = false;
      } else if (direction === 'right' && el.scrollLeft + el.clientWidth >= el.scrollWidth - step - 1) {
        wrappingRef.current = true;
        el.scrollLeft -= loopWidth;
        wrappingRef.current = false;
      }

      el.scrollBy({
        left: direction === 'left' ? -step : step,
        behavior: 'smooth',
      });
    },
    [getLoopWidth, getStep, pauseAuto, scheduleResume]
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const onScroll = () => {
      if (wrappingRef.current) return;
      if (settleTimer) clearTimeout(settleTimer);
      settleTimer = setTimeout(wrapIfNeeded, 150);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      if (settleTimer) clearTimeout(settleTimer);
    };
  }, [wrapIfNeeded]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let lastTs = performance.now();

    const tick = (ts: number) => {
      const deltaMs = Math.min(ts - lastTs, 48);
      lastTs = ts;

      if (!pausedRef.current) {
        const loopWidth = el.scrollWidth / 2;
        if (loopWidth > el.clientWidth * 0.25) {
          el.scrollLeft += (SCROLL_SPEED_PX_PER_SEC * deltaMs) / 1000;
          if (el.scrollLeft >= loopWidth) {
            wrappingRef.current = true;
            el.scrollLeft -= loopWidth;
            wrappingRef.current = false;
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    const onPointerEnterCard = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('article')) pauseAuto();
    };
    const onPointerLeaveCard = (e: PointerEvent) => {
      const leaving = (e.target as HTMLElement | null)?.closest('article');
      const entering = (e.relatedTarget as HTMLElement | null)?.closest?.('article');
      if (leaving && !entering) scheduleResume(700);
    };
    const onInteractStart = () => pauseAuto();
    const onInteractEnd = () => scheduleResume();

    el.addEventListener('pointerover', onPointerEnterCard);
    el.addEventListener('pointerout', onPointerLeaveCard as EventListener);
    el.addEventListener('pointerdown', onInteractStart);
    el.addEventListener('wheel', onInteractStart, { passive: true });
    el.addEventListener('touchstart', onInteractStart, { passive: true });
    el.addEventListener('touchend', onInteractEnd, { passive: true });

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      el.removeEventListener('pointerover', onPointerEnterCard);
      el.removeEventListener('pointerout', onPointerLeaveCard as EventListener);
      el.removeEventListener('pointerdown', onInteractStart);
      el.removeEventListener('wheel', onInteractStart);
      el.removeEventListener('touchstart', onInteractStart);
      el.removeEventListener('touchend', onInteractEnd);
    };
  }, [pauseAuto, scheduleResume]);

  return (
    <section className="w-full border-t border-white/70 bg-white pt-6 pb-12 sm:pt-8 sm:pb-14 md:pt-10 md:pb-16">
      <div className="mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="mb-7 flex items-center justify-center gap-3 sm:mb-8 sm:gap-5 md:mb-10">
          <span className="hidden h-px w-10 bg-brand-blue/25 sm:block sm:w-16 md:w-24" aria-hidden />
          <HeadingSparkle className="h-3.5 w-3.5 shrink-0 text-brand-blue/70 sm:h-4 sm:w-4" />
          <h2 className="max-w-3xl text-center font-display text-2xl font-extrabold tracking-tight text-brand-blue sm:text-3xl md:text-4xl">
            <span className="block">{t('landing.whyShortlisted.title')}</span>
            <span className="mt-1 block text-lg text-brand-orange sm:mt-1.5 sm:text-xl md:text-2xl">
              {t('landing.whyShortlisted.subtitle')}
            </span>
          </h2>
          <HeadingSparkle className="h-3.5 w-3.5 shrink-0 text-brand-blue/70 sm:h-4 sm:w-4" />
          <span className="hidden h-px w-10 bg-brand-blue/25 sm:block sm:w-16 md:w-24" aria-hidden />
        </div>

        <div className="relative">
          <NavArrow direction="left" onClick={() => scrollByCard('left')} />
          <NavArrow direction="right" onClick={() => scrollByCard('right')} />

          <div
            ref={scrollerRef}
            className="-mx-4 flex gap-5 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:gap-6 sm:px-8 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16 xl:-mx-20 xl:px-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
            aria-label={`${t('landing.whyShortlisted.title')} – ${t('landing.whyShortlisted.subtitle')}`}
          >
            {LOOP_CARDS.map((card, index) => (
              <FeatureCard key={`${card.id}-${index}`} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
