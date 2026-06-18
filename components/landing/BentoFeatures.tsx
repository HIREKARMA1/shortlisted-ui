'use client';

import {
  Briefcase,
  UserCheck,
  ClipboardCheck,
  Users,
  Building2,
  LayoutDashboard,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';

const bentoLayout: {
  key: 'jobs' | 'coordinator' | 'tracking' | 'batch' | 'brands' | 'dashboard';
  icon: typeof Briefcase;
  span: string;
  accent: string;
}[] = [
  { key: 'jobs', icon: Briefcase, span: 'md:col-span-2 md:row-span-2', accent: 'from-brand-blue to-primary-700' },
  { key: 'coordinator', icon: UserCheck, span: '', accent: 'from-brand-sky to-brand-blue' },
  { key: 'tracking', icon: ClipboardCheck, span: '', accent: 'from-brand-green to-brand-blue' },
  { key: 'batch', icon: Users, span: '', accent: 'from-brand-orange to-brand-red' },
  { key: 'brands', icon: Building2, span: 'md:col-span-2', accent: 'from-brand-blue/90 to-brand-sky' },
  { key: 'dashboard', icon: LayoutDashboard, span: '', accent: 'from-ink-primary to-brand-blue' },
];

export function BentoFeatures() {
  const { t } = useTranslation();

  return (
    <section id="features" className="border-t border-line-default bg-white py-16 sm:py-20">
      <div className="page-container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="section-eyebrow">{t('landing.features.eyebrow')}</p>
            <h2 className="section-title mt-2">{t('landing.features.title')}</h2>
            <p className="mt-3 text-ink-muted">{t('landing.features.subtitle')}</p>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-ink-muted sm:block">
            {t('landing.features.bentoNote')}
          </p>
        </div>

        <div className="mt-10 grid auto-rows-fr gap-4 md:grid-cols-3">
          {bentoLayout.map((item) => {
            const Icon = item.icon;
            const isLarge = item.span.includes('row-span');

            return (
              <div
                key={item.key}
                className={`group relative overflow-hidden rounded-2xl border border-line-default bg-white p-6 transition hover:shadow-elevated ${item.span}`}
              >
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${item.accent} opacity-[0.08] transition group-hover:opacity-[0.14]`}
                  aria-hidden
                />
                <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} p-2.5 text-white shadow-sm`}>
                  <Icon className={isLarge ? 'h-6 w-6' : 'h-5 w-5'} />
                </div>
                <h3 className={`mt-4 font-display font-bold text-ink-primary ${isLarge ? 'text-xl' : 'text-base'}`}>
                  {t(`landing.features.items.${item.key}.title`)}
                </h3>
                <p className={`mt-2 text-ink-muted ${isLarge ? 'text-sm leading-relaxed' : 'text-xs leading-relaxed'}`}>
                  {t(`landing.features.items.${item.key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
