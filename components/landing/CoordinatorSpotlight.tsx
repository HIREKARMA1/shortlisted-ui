'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, Phone, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

export function CoordinatorSpotlight() {
  const { t } = useTranslation();

  const channels = [
    { icon: Phone, key: 'call' as const },
    { icon: MessageCircle, key: 'whatsapp' as const },
    { icon: Users, key: 'batch' as const },
  ];

  const stats = ['students', 'applications', 'placements'] as const;

  return (
    <section className="relative overflow-hidden border-t border-line-default bg-white py-16 sm:py-20">
      <div
        className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-blue/[0.04] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-brand-orange/[0.05] blur-3xl"
        aria-hidden
      />

      <PageContainer className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-blue">
              {t('landing.coordinator.eyebrow')}
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-brand-blue sm:text-5xl sm:leading-tight">
              {t('landing.coordinator.title')}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-secondary sm:text-lg">
              {t('landing.coordinator.subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {channels.map(({ icon: Icon, key }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-white px-4 py-2.5 text-sm font-semibold text-ink-primary shadow-sm"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-blue/10">
                    <Icon className="h-4 w-4 text-brand-blue" />
                  </span>
                  {t(`landing.coordinator.channels.${key}`)}
                </span>
              ))}
            </div>

            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-brand-blue px-6 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-primary-600"
            >
              {t('landing.coordinator.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:ml-auto">
            <article
              className="relative overflow-hidden rounded-2xl border border-brand-blue/10 bg-white p-7 sm:p-8"
              style={{
                boxShadow: '0 12px 35px rgba(27,82,164,0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <span className="inline-flex rounded-full bg-brand-orange/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-orange">
                {t('landing.coordinator.card.badge')}
              </span>

              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue to-primary-700 font-display text-2xl font-extrabold text-white shadow-md">
                  1:12
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">
                    {t('landing.coordinator.card.role')}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-ink-primary">
                    {t('landing.coordinator.card.name')}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {t('landing.coordinator.card.desc')}
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4 border-y border-line-default py-6">
                {stats.map((stat) => (
                  <div key={stat} className="text-center">
                    <p className="font-display text-2xl font-extrabold text-brand-blue sm:text-3xl">
                      {t(`landing.coordinator.card.stats.${stat}.value`)}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                      {t(`landing.coordinator.card.stats.${stat}.label`)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-brand-blue/[0.04] px-5 py-4">
                <p className="text-sm italic leading-relaxed text-ink-secondary">
                  &ldquo;{t('landing.coordinator.card.quote')}&rdquo;
                </p>
              </div>
            </article>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
