'use client';

import { Briefcase, Trophy, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
// Texture handled by `sl-brick-pattern` utility in globals.css

const STAT_KEYS = ['batch', 'coordinator', 'matching'] as const;
const STAT_ICONS = { batch: Users, coordinator: Trophy, matching: Briefcase } as const;
const TAG_KEYS = ['jobs', 'interviews', 'tracking', 'resume', 'coaching', 'network'] as const;

/** 100xdevs.com impact bento - same layout, Shortlisted content */
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

          {/* Bottom row - sm:grid-cols-5, 3 + 2 */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-5">
            <div className="relative col-span-1 flex flex-col gap-4 overflow-hidden rounded-lg rounded-bl-[44px] rounded-tr-[44px] bg-brand-green sl-brick-pattern p-6 sm:col-span-3 lg:p-8">
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {t('landing.impact.skills.title')}
                </h3>
                <p className="text-lg tracking-tight text-white">{t('landing.impact.skills.subtitle')}</p>
              </div>
              <div className="relative z-10 flex flex-wrap gap-2">
                {TAG_KEYS.map((key) => (
                  <div
                    key={key}
                    className="max-md:text-sm rounded-full bg-white px-4 py-2 text-brand-green"
                  >
                    <h4 className="text-sm font-medium leading-none md:text-base">
                      {t(`landing.impact.skills.tags.${key}`)}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative col-span-1 flex flex-col rounded-lg rounded-bl-[44px] rounded-tr-[44px] bg-brand-blue p-8 sm:col-span-2">
              <div className="relative z-10 flex flex-col gap-2">
                <h3 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {t('landing.impact.mission.title')}
                </h3>
                <p className="text-lg tracking-tight text-white">{t('landing.impact.mission.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
