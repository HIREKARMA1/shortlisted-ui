'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import {
  ArrowDown,
  BarChart3,
  Bot,
  Briefcase,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Compass,
  Crosshair,
  FileStack,
  GraduationCap,
  Landmark,
  LineChart,
  ListChecks,
  Search,
  Target,
  Trophy,
  UserPlus,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { cn } from '@/lib/utils';

const STAT_KEYS = ['batch', 'coordinator', 'matching'] as const;
const STAT_ICONS = { batch: Users, coordinator: Trophy, matching: Briefcase } as const;

const COLLEGE_FEATURE_KEYS = [
  'registration',
  'assessment',
  'discovery',
  'alignment',
  'shortlisting',
  'drives',
  'interviews',
  'tracking',
  'reports',
] as const;

const COLLEGE_FEATURE_ICONS: Record<(typeof COLLEGE_FEATURE_KEYS)[number], LucideIcon> = {
  registration: UserPlus,
  assessment: ClipboardCheck,
  discovery: Search,
  alignment: Target,
  shortlisting: ListChecks,
  drives: Building2,
  interviews: CalendarClock,
  tracking: LineChart,
  reports: BarChart3,
};

const SHORTLISTED_FEATURE_KEYS = [
  'agent',
  'coordinator',
  'assessment',
  'alignment',
  'applications',
  'matching',
  'prep',
  'tracking',
  'offers',
] as const;

const SHORTLISTED_FEATURE_ICONS: Record<(typeof SHORTLISTED_FEATURE_KEYS)[number], LucideIcon> = {
  agent: Bot,
  coordinator: UserRound,
  assessment: ClipboardCheck,
  alignment: Compass,
  applications: FileStack,
  matching: Crosshair,
  prep: GraduationCap,
  tracking: ListChecks,
  offers: Trophy,
};

const BLUE = {
  base: '#1b52a4',
  soft: '#E8EEF8',
  line: '#93B4E0',
  text: '#1b52a4',
};

const PURPLE = {
  base: '#7C3AED',
  soft: '#F3EEFF',
  line: '#C4B5FD',
  text: '#6D28D9',
};

function useFadeUpOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function FadeUp({
  children,
  className,
  delayMs = 0,
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const ref = useFadeUpOnScroll<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn('sl-fade-up', className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/** Stats bar + college placement vs Shortlisted placement cell */
export function ImpactSection() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-8 pb-2 sm:pt-10 sm:pb-3">
      <PageContainer>
        <div className="flex flex-col gap-6 lg:gap-8">
          {/* Stats bar */}
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

          {/* Two-column placement comparison */}
          <div className="w-full rounded-[20px] bg-[#F8FAFC] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12">
              {/* LEFT — College Placement */}
              <FadeUp>
                <div className="flex h-full flex-col">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-blue sm:text-xs">
                    {t('landing.impact.comparison.college.label')}
                  </p>

                  <div className="mt-4 flex min-h-[4.5rem] items-start gap-3 sm:min-h-[5rem] sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue shadow-sm sm:h-14 sm:w-14">
                      <Landmark className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={1.75} />
                    </div>
                    <h3 className="max-w-[22ch] font-display text-lg font-bold leading-snug tracking-tight text-ink-primary sm:max-w-[26ch] sm:text-xl lg:text-[1.45rem] lg:leading-snug">
                      {t('landing.impact.comparison.college.headingBefore')}
                      <span className="block text-brand-blue">
                        {t('landing.impact.comparison.college.headingHighlight')}
                      </span>
                    </h3>
                  </div>

                  <ol className="relative mt-7 flex-1 space-y-0 pl-1">
                    {COLLEGE_FEATURE_KEYS.map((key, index) => {
                      const Icon = COLLEGE_FEATURE_ICONS[key];
                      const isLast = index === COLLEGE_FEATURE_KEYS.length - 1;
                      const step = index + 1;

                      return (
                        <li key={key} className="relative">
                          <FadeUp delayMs={index * 40}>
                            <div className="relative flex gap-3 sm:gap-3.5">
                              <div className="relative flex w-8 shrink-0 flex-col items-center sm:w-9">
                                <span
                                  className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-sm sm:h-9 sm:w-9 sm:text-sm"
                                  style={{ backgroundColor: BLUE.base }}
                                >
                                  {step}
                                </span>
                                {!isLast && (
                                  <span
                                    className="absolute bottom-0 left-1/2 top-8 w-[2px] -translate-x-1/2 sm:top-9"
                                    style={{ backgroundColor: BLUE.line }}
                                    aria-hidden
                                  />
                                )}
                              </div>

                              <article className="group mb-1 flex min-h-[5.5rem] min-w-0 flex-1 items-start rounded-[16px] border border-slate-200/80 bg-white p-3 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue/25 hover:shadow-[0_10px_28px_rgba(27,82,164,0.12)] sm:min-h-[5.75rem] sm:p-3.5">
                                <div className="flex w-full items-start gap-2.5 sm:gap-3">
                                  <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300 group-hover:bg-brand-blue group-hover:text-white"
                                    style={{ backgroundColor: BLUE.soft, color: BLUE.base }}
                                  >
                                    <Icon className="h-4 w-4" strokeWidth={2} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-[14px] font-bold leading-snug text-ink-primary sm:text-[15px]">
                                      {t(`landing.impact.comparison.college.features.${key}.title`)}
                                    </h4>
                                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-muted sm:text-[13px]">
                                      {t(`landing.impact.comparison.college.features.${key}.desc`)}
                                    </p>
                                  </div>
                                </div>
                              </article>
                            </div>
                          </FadeUp>

                          {!isLast && (
                            <div className="flex justify-center py-1 pl-10 sm:pl-12" aria-hidden>
                              <ArrowDown
                                className="h-3.5 w-3.5"
                                style={{ color: BLUE.base }}
                                strokeWidth={2.5}
                              />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </FadeUp>

              {/* RIGHT — Shortlisted Placement Cell */}
              <FadeUp delayMs={80}>
                <div className="flex h-full flex-col">
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.18em] sm:text-xs"
                    style={{ color: PURPLE.text }}
                  >
                    {t('landing.impact.comparison.shortlisted.label')}
                  </p>

                  <div className="mt-4 flex min-h-[4.5rem] items-start gap-3 sm:min-h-[5rem] sm:gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full shadow-sm sm:h-14 sm:w-14"
                      style={{ backgroundColor: PURPLE.base }}
                    >
                      <Users className="h-6 w-6 text-white sm:h-7 sm:w-7" strokeWidth={1.75} />
                    </div>
                    <h3 className="max-w-[22ch] font-display text-lg font-bold leading-snug tracking-tight text-ink-primary sm:max-w-[26ch] sm:text-xl lg:text-[1.45rem] lg:leading-snug">
                      {t('landing.impact.comparison.shortlisted.headingBefore')}
                      <span className="block text-brand-orange">
                        {t('landing.impact.comparison.shortlisted.headingHighlight')}
                      </span>
                    </h3>
                  </div>

                  <ol className="relative mt-7 flex-1 space-y-0 pl-1">
                    {SHORTLISTED_FEATURE_KEYS.map((key, index) => {
                      const Icon = SHORTLISTED_FEATURE_ICONS[key];
                      const isLast = index === SHORTLISTED_FEATURE_KEYS.length - 1;
                      const step = index + 1;

                      return (
                        <li key={key} className="relative">
                          <FadeUp delayMs={index * 45}>
                            <div className="relative flex gap-3 sm:gap-3.5">
                              <div className="relative flex w-8 shrink-0 flex-col items-center sm:w-9">
                                <span
                                  className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-bold text-white shadow-sm sm:h-9 sm:w-9 sm:text-sm"
                                  style={{ backgroundColor: PURPLE.base }}
                                >
                                  {step}
                                </span>
                                {!isLast && (
                                  <span
                                    className="absolute bottom-0 left-1/2 top-8 w-[2px] -translate-x-1/2 sm:top-9"
                                    style={{ backgroundColor: PURPLE.line }}
                                    aria-hidden
                                  />
                                )}
                              </div>

                              <article className="group mb-1 flex min-h-[5.5rem] min-w-0 flex-1 items-start rounded-[16px] border border-slate-200/80 bg-white p-3 shadow-[0_4px_18px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(124,58,237,0.12)] sm:min-h-[5.75rem] sm:p-3.5">
                                <div className="flex w-full items-start gap-2.5 sm:gap-3">
                                  <div
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105"
                                    style={{ backgroundColor: PURPLE.soft, color: PURPLE.base }}
                                  >
                                    <Icon className="h-4 w-4" strokeWidth={2} />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h4 className="text-[14px] font-bold leading-snug text-ink-primary sm:text-[15px]">
                                      {t(`landing.impact.comparison.shortlisted.features.${key}.title`)}
                                    </h4>
                                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-ink-muted sm:text-[13px]">
                                      {t(`landing.impact.comparison.shortlisted.features.${key}.desc`)}
                                    </p>
                                  </div>
                                </div>
                              </article>
                            </div>
                          </FadeUp>

                          {!isLast && (
                            <div className="flex justify-center py-1 pl-10 sm:pl-12" aria-hidden>
                              <ArrowDown
                                className="h-3.5 w-3.5"
                                style={{ color: PURPLE.base }}
                                strokeWidth={2.5}
                              />
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
