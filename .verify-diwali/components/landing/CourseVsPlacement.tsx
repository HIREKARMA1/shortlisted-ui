'use client';

import { X, Check } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

const courseKeys = ['classes', 'syllabus', 'exams', 'certificate'] as const;
const placementKeys = ['jobs', 'coordinator', 'tracking', 'batch'] as const;

export function CourseVsPlacement() {
  const { t } = useTranslation();

  return (
    <section id="compare" className="border-t border-line-default bg-soft py-16 sm:py-20">
      <div className="page-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{t('landing.compare.eyebrow')}</p>
          <h2 className="section-title mt-2">{t('landing.compare.title')}</h2>
          <p className="mt-3 text-ink-muted">{t('landing.compare.subtitle')}</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Course - muted / crossed feel */}
          <div className="relative overflow-hidden rounded-2xl border border-line-default bg-white p-6 opacity-90 sm:p-8">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-neutral-200/60" aria-hidden />
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              {t('landing.compare.course.label')}
            </p>
            <h3 className="mt-2 font-display text-xl font-bold text-ink-muted line-through decoration-brand-red/40">
              {t('landing.compare.course.title')}
            </h3>
            <ul className="mt-6 space-y-3">
              {courseKeys.map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm text-ink-muted">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                    <X className="h-3 w-3" />
                  </span>
                  {t(`landing.compare.course.items.${key}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Placement cell - highlighted */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-brand-blue bg-white p-6 shadow-elevated sm:p-8">
            <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-brand-blue/10" aria-hidden />
            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-brand-blue via-brand-sky to-brand-green" />
            <p className="text-xs font-bold uppercase tracking-widest text-brand-blue">
              {t('landing.compare.placement.label')}
            </p>
            <h3 className="mt-2 font-display text-xl font-extrabold text-ink-primary">
              {t('landing.compare.placement.title')}
            </h3>
            <ul className="mt-6 space-y-3">
              {placementKeys.map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm text-ink-secondary">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                    <Check className="h-3 w-3" />
                  </span>
                  {t(`landing.compare.placement.items.${key}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
