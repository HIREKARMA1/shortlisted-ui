'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

const faqKeys = ['ai', 'course', 'batch', 'jobs', 'support', 'refund'] as const;

export function FaqSection() {
  const { t } = useTranslation();
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenKey((current) => (current === key ? null : key));
  };

  return (
    <section className="w-full bg-[#f3f4f6]">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-2 text-center">
          <h2 className="font-display text-3xl font-bold text-brand-blue md:text-4xl lg:text-5xl">
            {t('landing.faq.title')}
          </h2>
          <p className="text-base text-ink-muted md:text-lg">{t('landing.faq.subtitle')}</p>
        </div>

        <div className="w-full">
          {faqKeys.map((key) => {
            const isOpen = openKey === key;
            return (
              <div key={key} className="border-b border-line-default last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 rounded-md py-4 text-left text-lg font-bold text-brand-blue outline-none transition-all hover:no-underline focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                >
                  <span className="pr-2">{t(`landing.faq.items.${key}.q`)}</span>
                  <ChevronDown
                    className={[
                      'mt-1 h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200',
                      isOpen ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </button>
                <div
                  className={[
                    'overflow-hidden text-base leading-relaxed text-ink-muted transition-all duration-200',
                    isOpen ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0',
                  ].join(' ')}
                >
                  <p>{t(`landing.faq.items.${key}.a`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
