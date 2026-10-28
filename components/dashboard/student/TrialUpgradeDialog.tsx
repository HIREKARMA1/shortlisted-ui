'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowRight, Check, Lock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import type { TrialFeature } from '@/lib/trial';

export type TrialDialogMode = 'limit' | 'expired' | 'lastDay' | 'ended';

type TrialUpgradeDialogProps = {
  mode: TrialDialogMode | null;
  feature?: TrialFeature;
  onClose: () => void;
};

const METER_LABEL: Record<TrialFeature, string> = {
  application: 'dashboard.trial.meterApplication',
  class: 'dashboard.trial.meterClass',
  assessment: 'dashboard.trial.meterAssessment',
};

const UNLOCK_KEYS = [
  'dashboard.trial.unlockJobs',
  'dashboard.trial.unlockClasses',
  'dashboard.trial.unlockAssessments',
  'dashboard.trial.unlockSeat',
] as const;

function focusable(root: HTMLElement | null) {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
  ).filter((node) => !node.hasAttribute('disabled'));
}

export function TrialUpgradeDialog({ mode, feature = 'application', onClose }: TrialUpgradeDialogProps) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!mode) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const root = dialogRef.current;
    const nodes = focusable(root);
    (nodes[0] ?? root)?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable(dialogRef.current);
      if (!items.length) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previouslyFocused?.focus();
    };
  }, [mode]);

  if (!mode) return null;

  const title =
    mode === 'lastDay'
      ? t('dashboard.trial.lastDayTitle')
      : mode === 'ended'
        ? t('dashboard.trial.endedTitle')
        : mode === 'expired'
          ? t(`dashboard.trial.expired.${feature}Title`)
          : t(`dashboard.trial.limit.${feature}Title`);

  const body =
    mode === 'lastDay'
      ? t('dashboard.trial.lastDayBody')
      : mode === 'ended'
        ? t('dashboard.trial.endedBody')
        : mode === 'expired'
          ? t(`dashboard.trial.expired.${feature}Body`)
          : t(`dashboard.trial.limit.${feature}Body`);

  const dismiss =
    mode === 'lastDay'
      ? t('dashboard.trial.continueTrial')
      : mode === 'ended'
        ? t('dashboard.trial.continueLimited')
        : t('dashboard.trial.notNow');

  const showMeter = mode === 'limit' || mode === 'expired';
  const eyebrow = mode === 'lastDay' ? t('dashboard.trial.lastDayEyebrow') : t('dashboard.trial.eyebrow');

  return (
    <div
      className="trial-overlay-in fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-upgrade-title"
        tabIndex={-1}
        className="trial-dialog-in w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-elevated outline-none sm:p-8"
      >
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3e8] text-brand-orange">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-orange">{eyebrow}</p>
          <h2 id="trial-upgrade-title" className="mt-2 font-display text-xl font-bold tracking-tight text-ink-primary">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-secondary">{body}</p>
        </div>

        {showMeter ? (
          <div className="mt-5 rounded-xl border border-orange-100 bg-[#fff3e8] px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-ink-primary">{t(METER_LABEL[feature])}</span>
              <span className="shrink-0 font-semibold text-brand-orange">
                {mode === 'limit' ? t('dashboard.trial.meterUsed') : t('dashboard.trial.planExpired')}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white" aria-hidden="true">
              <div className="h-full w-full rounded-full bg-brand-orange" />
            </div>
          </div>
        ) : null}

        <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-muted">
          {t('dashboard.trial.unlockTitle')}
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {UNLOCK_KEYS.map((key) => (
            <li key={key} className="flex items-center gap-2.5 text-sm text-ink-secondary">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e8f6ef] text-brand-green">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
              </span>
              {t(key)}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/subscribe"
            className="inline-flex w-full items-center justify-center rounded-md bg-brand-orange px-5 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-sm transition hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
          >
            {t('dashboard.trial.upgradeNow')}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-medium text-ink-secondary transition hover:text-ink-primary"
          >
            {dismiss}
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-ink-muted">{t('dashboard.trial.trust')}</p>
      </div>
    </div>
  );
}
