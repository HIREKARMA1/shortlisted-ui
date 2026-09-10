'use client';

import { useRef } from 'react';
import {
  Briefcase,
  Check,
  Landmark,
  Trophy,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { motion, useInView, type Variants } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { cn } from '@/lib/utils';

const STAT_KEYS = ['batch', 'coordinator', 'matching'] as const;
const STAT_ICONS = { batch: Users, coordinator: Trophy, matching: Briefcase } as const;

/** Aligned 1:1 comparison steps (college ↔ shortlisted) */
const COMPARISON_STEPS = [
  'registration',
  'assessment',
  'discovery',
  'alignment',
  'applications',
  'shortlisting',
  'drives',
  'interviews',
  'tracking',
  'reports',
] as const;

type StepKey = (typeof COMPARISON_STEPS)[number];

const BLUE = '#1b52a4';
const PURPLE = '#7C3AED';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: Math.min(i * 0.03, 0.28) },
  }),
};

function ComparisonCard({
  title,
  desc,
  tone,
  step,
}: {
  title: string;
  desc: string;
  tone: 'blue' | 'purple';
  step: number;
}) {
  const isRight = tone === 'purple';
  const label = String(step).padStart(2, '0');

  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-xl border bg-white px-3 py-2.5 transition-colors duration-200 sm:px-3.5 sm:py-3',
        isRight
          ? 'border-violet-100 hover:border-violet-200'
          : 'border-slate-200/90 hover:border-brand-blue/25'
      )}
    >
      <div className="flex items-start gap-2">
        <span
          className={cn(
            'mt-0.5 shrink-0 font-display text-[11px] font-bold tabular-nums leading-none',
            isRight
              ? 'bg-gradient-to-r from-[#1b52a4] to-[#7C3AED] bg-clip-text text-transparent'
              : 'text-slate-400'
          )}
        >
          {label}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                'font-display text-[12.5px] font-bold leading-snug tracking-tight sm:text-[13px]',
                isRight ? 'text-[#3B0764]' : 'text-ink-primary'
              )}
            >
              {title}
            </h4>
            {isRight ? (
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: `linear-gradient(135deg, ${BLUE}, ${PURPLE})` }}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            ) : (
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400"
                aria-hidden
              >
                <X className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
            )}
          </div>
          <p
            className={cn(
              'mt-1 line-clamp-2 text-[11.5px] leading-snug sm:text-[12px]',
              isRight ? 'text-[#5B21B6]/75' : 'text-ink-muted'
            )}
          >
            {desc}
          </p>
        </div>
      </div>
    </article>
  );
}

function ColumnHeader({
  label,
  title,
  subtitle,
  icon: Icon,
  tone,
}: {
  label: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: 'blue' | 'purple';
}) {
  const isRight = tone === 'purple';

  return (
    <div className="flex flex-col">
      <span
        className={cn(
          'inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]',
          isRight
            ? 'bg-gradient-to-r from-[#1b52a4] to-[#7C3AED] text-white'
            : 'bg-slate-100 text-slate-500'
        )}
      >
        {label}
      </span>

      <div className="mt-2.5 flex items-start gap-2.5 sm:mt-3 sm:gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10',
            isRight ? 'rounded-full' : 'rounded-xl'
          )}
          style={{
            background: isRight ? `linear-gradient(135deg, ${BLUE}, ${PURPLE})` : BLUE,
          }}
        >
          <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[15px] font-bold leading-snug tracking-tight text-ink-primary sm:text-base md:text-lg">
            {title}
            {isRight && (
              <span
                className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle"
                title="Active"
                aria-label="Active"
              />
            )}
          </h3>
          <p
            className={cn(
              'mt-0.5 text-[11.5px] leading-snug sm:text-[12.5px]',
              isRight ? 'text-[#5B21B6]/70' : 'text-ink-muted'
            )}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

/** Stats bar + college placement vs Shortlisted placement cell */
export function ImpactSection() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.08, margin: '0px 0px -32px 0px' });

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

          {/* Two-column placement comparison — no paper-like wrapper */}
          <div ref={sectionRef} className="relative w-full py-2 sm:py-4">
            {/* Header */}
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={0}
            >
              <h2 className="font-display text-[1.5rem] font-extrabold leading-[1.25] tracking-tight text-ink-primary sm:text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] lg:leading-[1.2]">
                {t('landing.impact.comparison.titleBefore')}
                <span className="bg-gradient-to-r from-[#1b52a4] via-[#5B6FE8] to-[#7C3AED] bg-clip-text text-transparent">
                  {t('landing.impact.comparison.titleHighlight')}
                </span>
              </h2>

              <p className="mx-auto mt-2.5 max-w-xl text-[13px] leading-relaxed text-ink-muted sm:mt-3 sm:max-w-2xl sm:text-[15px] md:text-base">
                {t('landing.impact.comparison.subtitle')}
              </p>
            </motion.div>

            {/* Comparison grid — flat, no outer card */}
            <motion.div
              className="relative mx-auto mt-6 w-full max-w-6xl sm:mt-8"
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              variants={fadeUp}
              custom={1}
            >
              {/* Column headers */}
              <div className="grid grid-cols-1 gap-4 border-b border-slate-200/80 pb-4 md:grid-cols-2 md:items-stretch md:gap-0 md:pb-5">
                <div className="md:border-r md:border-slate-200/80 md:pr-5 lg:pr-6">
                  <ColumnHeader
                    label={t('landing.impact.comparison.college.badge')}
                    title={t('landing.impact.comparison.college.title')}
                    subtitle={t('landing.impact.comparison.college.subtitle')}
                    icon={Landmark}
                    tone="blue"
                  />
                </div>
                <div className="relative md:pl-5 lg:pl-6">
                  <div
                    className="pointer-events-none absolute left-0 top-0 hidden h-full w-0.5 bg-gradient-to-b from-[#1b52a4] to-[#7C3AED] md:block"
                    aria-hidden
                  />
                  <ColumnHeader
                    label={t('landing.impact.comparison.shortlisted.badge')}
                    title={t('landing.impact.comparison.shortlisted.title')}
                    subtitle={t('landing.impact.comparison.shortlisted.subtitle')}
                    icon={Users}
                    tone="purple"
                  />
                </div>
              </div>

              {/* Compact step rows */}
              <ol className="mt-3 space-y-2 sm:mt-4 sm:space-y-2.5">
                {COMPARISON_STEPS.map((key: StepKey, index) => {
                  const step = index + 1;

                  return (
                    <motion.li
                      key={key}
                      custom={index + 2}
                      variants={fadeUp}
                      initial="hidden"
                      animate={inView ? 'visible' : 'hidden'}
                    >
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:items-stretch md:gap-3 lg:gap-4">
                        <ComparisonCard
                          step={step}
                          tone="blue"
                          title={t(`landing.impact.comparison.college.features.${key}.title`)}
                          desc={t(`landing.impact.comparison.college.features.${key}.desc`)}
                        />
                        <ComparisonCard
                          step={step}
                          tone="purple"
                          title={t(`landing.impact.comparison.shortlisted.features.${key}.title`)}
                          desc={t(`landing.impact.comparison.shortlisted.features.${key}.desc`)}
                        />
                      </div>
                    </motion.li>
                  );
                })}
              </ol>
            </motion.div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
