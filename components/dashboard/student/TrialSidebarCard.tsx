'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { cn } from '@/lib/utils';
import { trialUrgency, useTrialUi } from '@/components/dashboard/student/StudentTrialChrome';

const cardTone = {
  amber: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50',
  orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-[#fff3e8]',
  red: 'border-red-200 bg-gradient-to-br from-red-50 to-orange-50',
} as const;

const barTone = {
  amber: 'bg-amber-500',
  orange: 'bg-brand-orange',
  red: 'bg-brand-red',
} as const;

export function TrialSidebarCard() {
  const { t } = useTranslation();
  const { trial } = useTrialUi();
  if (!trial || (trial.plan !== 'trial' && trial.plan !== 'expired')) return null;

  const tone = trialUrgency(trial.plan, trial.daysLeft);
  const remaining = trial.plan === 'expired' ? 0 : Math.min(7, Math.max(0, trial.daysLeft));
  const width = `${(remaining / 7) * 100}%`;
  const daysLabel =
    trial.plan === 'expired'
      ? t('dashboard.trial.planExpired')
      : t('dashboard.trial.sidebarDays', { days: trial.daysLeft });

  return (
    <div className="trial-sidebar-card shrink-0 px-3 pb-3">
      <div className={cn('rounded-xl border p-3 shadow-sm', cardTone[tone])}>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-orange">
          {t('dashboard.trial.sidebarEyebrow')}
        </p>
        <p className="mt-1 text-sm font-bold text-ink-primary">{daysLabel}</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 ring-1 ring-neutral-300" aria-hidden="true">
          <div className={cn('h-full rounded-full transition-[width] duration-500', barTone[tone])} style={{ width }} />
        </div>
        <Link
          href="/subscribe"
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brand-orange px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:opacity-95"
        >
          {t('dashboard.trial.upgrade')}
        </Link>
      </div>
    </div>
  );
}
