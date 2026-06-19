'use client';

import { useState } from 'react';
import { Code2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

const cards = [
  { id: 'cohorts', titleKey: 'landing.whyShortlisted.cards.cohorts.title', descKey: 'landing.whyShortlisted.cards.cohorts.desc' },
  { id: 'support', titleKey: 'landing.whyShortlisted.cards.support.title', descKey: 'landing.whyShortlisted.cards.support.desc' },
  { id: 'matching', titleKey: 'landing.whyShortlisted.cards.matching.title', descKey: 'landing.whyShortlisted.cards.matching.desc' },
  { id: 'tracking', titleKey: 'landing.whyShortlisted.cards.tracking.title', descKey: 'landing.whyShortlisted.cards.tracking.desc' },
] as const;

type Card = (typeof cards)[number];

function WhyCard({ card, active }: { card: Card; active: boolean }) {
  const { t } = useTranslation();

  return (
    <article
      className={[
        'flex min-h-[280px] w-full flex-col rounded-2xl p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-h-[300px] sm:p-10',
        active
          ? 'scale-[1.02] bg-[#212263] text-white shadow-lg'
          : 'scale-[0.98] bg-white text-ink-secondary opacity-35 shadow-sm',
      ].join(' ')}
    >
      <div
        className={[
          'flex h-11 w-11 items-center justify-center rounded-full',
          active ? 'bg-white text-[#212263]' : 'bg-[#25d0ba] text-white',
        ].join(' ')}
      >
        <Code2 className="h-5 w-5" strokeWidth={2.5} />
      </div>

      <h3
        className={[
          'mt-5 font-display text-2xl font-bold leading-tight sm:text-[2rem]',
          active ? 'text-white' : 'text-ink-primary',
        ].join(' ')}
      >
        {t(card.titleKey)}
      </h3>

      <div className={['mt-3 h-[2px] w-12 rounded-full', active ? 'bg-[#3ec2ff]' : 'bg-[#25d0ba]'].join(' ')} />

      <p
        className={[
          'mt-4 flex-1 text-sm leading-relaxed sm:text-base',
          active ? 'text-white/85' : 'text-ink-muted',
        ].join(' ')}
      >
        {t(card.descKey)}
      </p>
    </article>
  );
}

export function WhyShortlisted() {
  const { t } = useTranslation();
  const [active, setActive] = useState(1);

  const center = cards[active];
  const left = cards[(active - 1 + cards.length) % cards.length];
  const right = cards[(active + 1) % cards.length];
  const visibleCards = [left, center, right];

  return (
    <section className="w-full border-t border-white/70 bg-[#f3f4f6] py-16 sm:py-20">
      <div className="mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-brand-blue sm:text-5xl">
            {t('landing.whyShortlisted.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base text-ink-secondary sm:text-lg">
            {t('landing.whyShortlisted.subtitle')}
          </p>
        </div>

        {/* Mobile: swipe / drag scroll carousel */}
        <div className="md:hidden">
          <div
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {cards.map((card) => (
              <div key={card.id} className="w-[calc(100vw-3rem)] max-w-full shrink-0 snap-center">
                <WhyCard card={card} active />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: 3-card carousel with arrows */}
        <div className="relative hidden overflow-hidden md:block">
          <div className="grid grid-cols-3 gap-5 lg:gap-6">
            {visibleCards.map((card, index) => (
              <div key={`${card.id}-${index}`}>
                <WhyCard card={card} active={index === 1} />
              </div>
            ))}
          </div>

          <button
            aria-label="Previous"
            onClick={() => setActive((p) => (p - 1 + cards.length) % cards.length)}
            className="absolute left-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-500 text-white shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setActive((p) => (p + 1) % cards.length)}
            className="absolute right-0 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-500 text-white shadow-lg"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
