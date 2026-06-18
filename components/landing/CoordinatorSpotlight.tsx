'use client';

import Link from 'next/link';
import { MessageCircle, Phone, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

export function CoordinatorSpotlight() {
  const { t } = useTranslation();

  const channels = [
    { icon: Phone, key: 'call' as const },
    { icon: MessageCircle, key: 'whatsapp' as const },
    { icon: Users, key: 'batch' as const },
  ];

  return (
    <section className="relative overflow-hidden border-t border-line-default">
      <div className="sl-diagonal-band absolute inset-0 bg-gradient-to-br from-brand-blue/[0.03] via-white to-brand-orange/[0.05]" aria-hidden />

      <div className="page-container relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-2">
        <div>
          <p className="section-eyebrow">{t('landing.coordinator.eyebrow')}</p>
          <h2 className="section-title mt-2">{t('landing.coordinator.title')}</h2>
          <p className="mt-4 max-w-lg text-ink-muted">{t('landing.coordinator.subtitle')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {channels.map(({ icon: Icon, key }) => (
              <span
                key={key}
                className="inline-flex items-center gap-2 rounded-full border border-line-default bg-white px-4 py-2 text-sm font-medium text-ink-secondary shadow-sm"
              >
                <Icon className="h-4 w-4 text-brand-blue" />
                {t(`landing.coordinator.channels.${key}`)}
              </span>
            ))}
          </div>

          <Link
            href="/auth/register"
            className="mt-8 inline-flex items-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-600"
          >
            {t('landing.coordinator.cta')} →
          </Link>
        </div>

        {/* Coordinator card — human-centered, not Lakshya's numbered grid */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="rounded-2xl border border-line-default bg-white p-6 shadow-elevated">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-primary-700 font-display text-xl font-extrabold text-white">
                1:12
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                  {t('landing.coordinator.card.role')}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-ink-primary">
                  {t('landing.coordinator.card.name')}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{t('landing.coordinator.card.desc')}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line-default pt-6">
              {(['students', 'applications', 'placements'] as const).map((stat) => (
                <div key={stat} className="text-center">
                  <p className="font-display text-2xl font-extrabold text-brand-blue">
                    {t(`landing.coordinator.card.stats.${stat}.value`)}
                  </p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-ink-muted">
                    {t(`landing.coordinator.card.stats.${stat}.label`)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-soft p-4">
              <p className="text-sm italic leading-relaxed text-ink-secondary">
                &ldquo;{t('landing.coordinator.card.quote')}&rdquo;
              </p>
            </div>
          </div>

          {/* Floating batch tag */}
          <div className="absolute -bottom-3 -right-3 rounded-full border border-line-default bg-brand-yellow px-4 py-2 text-xs font-bold text-ink-primary shadow-md">
            {t('landing.coordinator.card.badge')}
          </div>
        </div>
      </div>
    </section>
  );
}
