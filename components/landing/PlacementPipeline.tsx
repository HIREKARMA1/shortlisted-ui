'use client';

import { UserPlus, CreditCard, Users, Send, Trophy } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

const steps = [
  { key: 'register', icon: UserPlus, color: 'bg-brand-sky' },
  { key: 'subscribe', icon: CreditCard, color: 'bg-brand-orange' },
  { key: 'batch', icon: Users, color: 'bg-brand-blue' },
  { key: 'apply', icon: Send, color: 'bg-brand-green' },
  { key: 'placed', icon: Trophy, color: 'bg-brand-yellow text-ink-primary' },
] as const;

export function PlacementPipeline() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="border-t border-line-default bg-white py-16 sm:py-20">
      <div className="page-container">
        <div className="max-w-2xl">
          <p className="section-eyebrow">{t('landing.howItWorks.eyebrow')}</p>
          <h2 className="section-title mt-2">{t('landing.howItWorks.title')}</h2>
          <p className="mt-3 text-ink-muted">{t('landing.howItWorks.subtitle')}</p>
        </div>

        {/* Desktop: horizontal pipeline */}
        <div className="mt-14 hidden lg:block">
          <div className="relative">
            <div className="absolute left-0 right-0 top-8 h-0.5 bg-gradient-to-r from-brand-sky via-brand-orange to-brand-yellow" aria-hidden />
            <ol className="relative flex justify-between gap-2">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <li key={step.key} className="flex max-w-[140px] flex-1 flex-col items-center text-center">
                    <div className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl ${step.color} text-white shadow-md`}>
                      <Icon className="h-7 w-7" />
                      <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-blue shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-sm font-bold text-ink-primary">
                      {t(`landing.howItWorks.steps.${step.key}.title`)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                      {t(`landing.howItWorks.steps.${step.key}.desc`)}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <ol className="relative mt-10 space-y-0 lg:hidden">
          <div className="absolute bottom-4 left-6 top-4 w-0.5 bg-gradient-to-b from-brand-sky via-brand-orange to-brand-yellow" aria-hidden />
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.key} className="relative flex gap-5 pb-8 last:pb-0">
                <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${step.color} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
                    Step {i + 1}
                  </span>
                  <h3 className="font-display font-bold text-ink-primary">
                    {t(`landing.howItWorks.steps.${step.key}.title`)}
                  </h3>
                  <p className="mt-1 text-sm text-ink-muted">
                    {t(`landing.howItWorks.steps.${step.key}.desc`)}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
