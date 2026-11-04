'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowRight, Clock, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { formatTrialDate } from '@/lib/trial';
import { cn } from '@/lib/utils';
import { TrialUpgradeDialog, type TrialDialogMode } from '@/components/dashboard/student/TrialUpgradeDialog';

const WELCOME_KEY = 'shortlisted_trial_welcome';
const LAST_DAY_KEY = 'shortlisted_trial_lastday';
const EXPIRED_KEY = 'shortlisted_trial_expired_notice';

type TrialState = {
  plan: string;
  daysLeft: number;
  endsAt: string | null;
};

type TrialUiContextValue = {
  trial: TrialState | null;
  notice: TrialDialogMode | null;
  setNotice: (mode: TrialDialogMode | null) => void;
};

const TrialUiContext = createContext<TrialUiContextValue>({
  trial: null,
  notice: null,
  setNotice: () => undefined,
});

export function useTrialUi() {
  return useContext(TrialUiContext);
}

export function trialUrgency(plan: string, daysLeft: number): 'amber' | 'orange' | 'red' {
  if (plan === 'expired' || daysLeft <= 1) return 'red';
  if (daysLeft <= 3) return 'orange';
  return 'amber';
}

const toneClasses = {
  amber: 'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950',
  orange: 'border-orange-200 bg-gradient-to-r from-orange-50 to-[#fff3e8] text-orange-950',
  red: 'border-red-200 bg-gradient-to-r from-red-50 to-orange-50 text-red-950',
} as const;

const iconTone = {
  amber: 'bg-amber-100 text-amber-700',
  orange: 'bg-[#fff3e8] text-brand-orange',
  red: 'bg-red-100 text-brand-red',
} as const;

const barTone = {
  amber: 'bg-amber-500',
  orange: 'bg-brand-orange',
  red: 'bg-brand-red',
} as const;

export function StudentTrialProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [trial, setTrial] = useState<TrialState | null>(null);
  const [notice, setNotice] = useState<TrialDialogMode | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getDashboard()
      .then((data) => {
        if (cancelled) return;
        const student = data.student as {
          plan?: string;
          trial_days_left?: number;
          trial_ends_at?: string | null;
        };
        const plan = String(student?.plan || '');
        const daysLeft = Number(student?.trial_days_left || 0);
        const endsAt = student?.trial_ends_at || null;
        setTrial({ plan, daysLeft, endsAt });

        if (plan === 'trial' && !localStorage.getItem(WELCOME_KEY)) {
          localStorage.setItem(WELCOME_KEY, '1');
          toast.success(t('dashboard.trial.started', { date: formatTrialDate(endsAt) }));
        }

        const onDashboard = pathname.startsWith('/dashboard/student');
        if (!onDashboard) return;

        if (plan === 'trial' && daysLeft <= 1) {
          const today = new Date().toISOString().slice(0, 10);
          if (localStorage.getItem(LAST_DAY_KEY) !== today) {
            localStorage.setItem(LAST_DAY_KEY, today);
            setNotice('lastDay');
          }
        }

        if (plan === 'expired' && !localStorage.getItem(EXPIRED_KEY)) {
          localStorage.setItem(EXPIRED_KEY, '1');
          setNotice('ended');
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [pathname, t]);

  return <TrialUiContext.Provider value={{ trial, notice, setNotice }}>{children}</TrialUiContext.Provider>;
}

export function StudentTrialChrome() {
  const { t } = useTranslation();
  const { trial, notice, setNotice } = useTrialUi();
  const [bannerHidden, setBannerHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = bannerRef.current?.closest('main');
    if (!scroller) return;
    const onScroll = () => setScrolled(scroller.scrollTop > 0);
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, [bannerHidden, trial]);

  if (!trial || (trial.plan !== 'trial' && trial.plan !== 'expired')) {
    return (
      <>
        <div className="pt-6" />
        {notice ? <TrialUpgradeDialog mode={notice} onClose={() => setNotice(null)} /> : null}
      </>
    );
  }

  const tone = trialUrgency(trial.plan, trial.daysLeft);
  const remaining = trial.plan === 'expired' ? 0 : Math.min(7, Math.max(0, trial.daysLeft));
  const width = `${(remaining / 7) * 100}%`;
  const title =
    trial.plan === 'expired'
      ? t('dashboard.trial.bannerExpired')
      : trial.daysLeft <= 1
        ? t('dashboard.trial.bannerLastDayTitle')
        : t('dashboard.trial.bannerFree', { days: trial.daysLeft });

  const hideBanner = () => {
    setBannerHidden(true);
  };

  return (
    <>
      {bannerHidden ? (
        <div className="pt-6" />
      ) : (
        <div
          ref={bannerRef}
          className={cn(
            'sticky top-0 z-30 -mx-4 bg-surface-page px-4 pb-6 pt-6 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8',
            scrolled && 'shadow-[0_10px_16px_-14px_rgba(15,23,42,0.45)]',
          )}
        >
          <div
            style={{ backgroundColor: '#ffffff' }}
            className={cn(
              'flex flex-wrap items-center gap-3 rounded-xl border px-4 py-3 shadow-sm',
              toneClasses[tone],
            )}
          >
            <span className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', iconTone[tone])}>
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-[12rem] flex-1">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-0.5 text-sm font-medium text-ink-secondary">{t('dashboard.trial.bannerHint')}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200 ring-1 ring-neutral-300" aria-hidden="true">
                <div className={cn('h-full rounded-full transition-[width] duration-500', barTone[tone])} style={{ width }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/subscribe"
                className="inline-flex items-center gap-1.5 rounded-md bg-brand-orange px-3 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-sm transition hover:opacity-95"
              >
                {t('dashboard.trial.upgrade')}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={hideBanner}
                className="rounded-md p-1.5 text-ink-muted transition hover:bg-white/70 hover:text-ink-primary"
                aria-label={t('dashboard.trial.bannerDismiss')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      <TrialUpgradeDialog mode={notice} onClose={() => setNotice(null)} />
    </>
  );
}
