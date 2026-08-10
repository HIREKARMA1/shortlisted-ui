'use client';

import { Briefcase, Trophy, Users, Check, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

const STAT_KEYS = ['batch', 'coordinator', 'matching'] as const;
const STAT_ICONS = { batch: Users, coordinator: Trophy, matching: Briefcase } as const;
const COMPARISON_ROW_KEYS = [
  'pool',
  'competition',
  'support',
  'attention',
  'opportunities',
  'timing',
  'process',
  'resources',
  'visibility',
  'schedule',
] as const;

/** 100xdevs.com impact bento - stats bar + college vs Shortlisted comparison */
export function ImpactSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-8 sm:py-10">
      <PageContainer>
        <div className="flex flex-col gap-6">
          {/* Stats bar - bg-primary rounded-tr-[140px] */}
          <div className="mx-auto w-full rounded-lg rounded-tr-[140px] bg-brand-blue py-8">
            <div className="grid h-full grid-cols-1 divide-y-2 divide-white/80 px-4 py-4 sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0 md:grid-cols-3">
              {STAT_KEYS.map((key) => {
                const Icon = STAT_ICONS[key];
                return (
                  <div
                    key={key}
                    className="flex items-center justify-start gap-x-5 px-8 py-5 md:py-0"
                  >
                    <div className="-mt-4 rounded-bl-[10px] rounded-tr-[10px] bg-white/20 p-2.5">
                      <Icon className="h-6 w-6 text-brand-yellow" strokeWidth={2} />
                    </div>
                    <div className="flex flex-col">
                      <div className="text-4xl font-semibold text-neutral-200">
                        {t(`landing.impact.stats.${key}.value`)}
                      </div>
                      <div className="text-neutral-200/70">{t(`landing.impact.stats.${key}.label`)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* College Placement Cell vs Shortlisted */}
          <div className="w-full">
            <h3 className="text-center text-2xl font-bold tracking-tight text-brand-blue sm:text-3xl md:text-4xl">
              {t('landing.impact.comparison.title')}
            </h3>

            <div className="mt-5 overflow-hidden rounded-lg rounded-bl-[44px] rounded-tr-[44px] border border-line-default bg-white shadow-sm sm:mt-6">
              <div
                className="grid grid-cols-2 border-b border-line-default"
                role="row"
              >
                <div className="border-r border-line-default bg-soft px-3 py-3.5 sm:px-5 sm:py-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-muted sm:text-xs">
                    {t('landing.impact.comparison.collegeHeader')}
                  </p>
                </div>
                <div className="bg-brand-blue px-3 py-3.5 sm:px-5 sm:py-4">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-white sm:text-xs">
                    {t('landing.impact.comparison.shortlistedHeader')}
                  </p>
                </div>
              </div>

              {COMPARISON_ROW_KEYS.map((key, index) => (
                <div
                  key={key}
                  className={[
                    'grid grid-cols-2',
                    index < COMPARISON_ROW_KEYS.length - 1 ? 'border-b border-line-default' : '',
                  ].join(' ')}
                  role="row"
                >
                  <div className="flex items-start gap-2 border-r border-line-default px-3 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red sm:h-5 sm:w-5">
                      <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={2.5} />
                    </span>
                    <p className="text-[13px] leading-snug text-ink-muted sm:text-sm sm:leading-relaxed">
                      {t(`landing.impact.comparison.rows.${key}.college`)}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 bg-brand-blue/[0.03] px-3 py-3 sm:gap-3 sm:px-5 sm:py-3.5">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green sm:h-5 sm:w-5">
                      <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3" strokeWidth={2.5} />
                    </span>
                    <p className="text-[13px] font-medium leading-snug text-ink-secondary sm:text-sm sm:leading-relaxed">
                      {t(`landing.impact.comparison.rows.${key}.shortlisted`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
