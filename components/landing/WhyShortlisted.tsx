'use client';

import { useEffect, useState } from 'react';
import { Code2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

export function WhyShortlisted() {
  const { t } = useTranslation();
  const cards = [
    { id: 'cohorts', titleKey: 'landing.whyShortlisted.cards.cohorts.title', descKey: 'landing.whyShortlisted.cards.cohorts.desc' },
    { id: 'support', titleKey: 'landing.whyShortlisted.cards.support.title', descKey: 'landing.whyShortlisted.cards.support.desc' },
    { id: 'matching', titleKey: 'landing.whyShortlisted.cards.matching.title', descKey: 'landing.whyShortlisted.cards.matching.desc' },
    { id: 'tracking', titleKey: 'landing.whyShortlisted.cards.tracking.title', descKey: 'landing.whyShortlisted.cards.tracking.desc' },
  ] as const;
  const [isMobile, setIsMobile] = useState(false);
  const [active, setActive] = useState(1);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const center = cards[active];
  const left = cards[(active - 1 + cards.length) % cards.length];
  const right = cards[(active + 1) % cards.length];
  const visibleCards = isMobile ? [center] : [left, center, right];

  return (
    <section className="border-t border-white/70 bg-[#f3f4f6] py-16 sm:py-20">
      <PageContainer>
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-brand-blue sm:text-5xl">
            {t('landing.whyShortlisted.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-secondary sm:text-lg">
            {t('landing.whyShortlisted.subtitle')}
          </p>
        </div>

        <div className="relative overflow-hidden px-1 sm:px-2">
          <div className={`grid gap-4 md:gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
            {visibleCards.map((card, index) => {
              const isCenter = isMobile ? true : index === 1;
              return (
                <div
                  key={`${card.id}-${index}`}
                  className="px-2"
                >
                  <article
                    className={[
                      'h-[260px] w-full rounded-xl p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                      isCenter
                        ? 'scale-[1.01] bg-[#212263] text-white shadow-lg'
                        : 'scale-[0.97] bg-white text-ink-secondary shadow-sm opacity-35',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'flex h-11 w-11 items-center justify-center rounded-full',
                        isCenter ? 'bg-white text-[#212263]' : 'bg-[#25d0ba] text-white',
                      ].join(' ')}
                    >
                      <Code2 className="h-5 w-5" strokeWidth={2.5} />
                    </div>

                    <h3
                      className={[
                        'mt-5 font-display text-[2rem] font-bold leading-tight',
                        isCenter ? 'text-white' : 'text-ink-primary',
                      ].join(' ')}
                    >
                      {t(card.titleKey)}
                    </h3>

                    <div className={['mt-3 h-[2px] w-10 rounded-full', isCenter ? 'bg-[#3ec2ff]' : 'bg-[#25d0ba]'].join(' ')} />

                    <p className={['mt-4 text-sm leading-relaxed', isCenter ? 'text-white/85' : 'text-ink-muted'].join(' ')}>
                      {t(card.descKey)}
                    </p>
                  </article>
                </div>
              );
            })}
          </div>

          <button
            aria-label="Previous"
            onClick={() => setActive((p) => (p - 1 + cards.length) % cards.length)}
            className="absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-500 text-white shadow-lg"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            aria-label="Next"
            onClick={() => setActive((p) => (p + 1) % cards.length)}
            className="absolute right-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-500 text-white shadow-lg"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </PageContainer>
    </section>
  );
}
