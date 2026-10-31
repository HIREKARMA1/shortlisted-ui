'use client';

import { Check } from 'lucide-react';
import { ctaLabel, plans } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { PrimaryLink } from './primitives';

export function PlansAndBatch() {
  const { batch, batchLoading, hideTrialPromos, trialHref, dashboardHref, subscribeHref } = useHome();
  const amount = batch?.subscription_amount_inr;
  const max = batch?.max_seats;
  const open = batch?.seats_remaining;
  const showBatch = !batchLoading && max != null && open != null && max > 0;
  const ratio = showBatch ? Math.max(0, Math.min(1, open / max)) : 0;

  return (
    <section id="plans" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h2 className="text-lg font-semibold text-[var(--ink)]">Plans</h2>
      <div className={`mt-4 grid gap-3 ${showBatch || batchLoading ? 'lg:grid-cols-[1.4fr_0.8fr]' : ''}`}>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_8px_24px_rgba(11,27,51,0.04)]">
            <h3 className="text-base font-semibold text-[var(--ink)]">{plans.trial.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-[var(--ink)]">{plans.trial.priceLabel}</p>
            <p className="text-xs text-[var(--muted)]">{plans.trial.note}</p>
            <ul className="mt-3 space-y-1.5">
              {plans.trial.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[var(--ink)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-green)]" strokeWidth={1.75} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <PrimaryLink href={hideTrialPromos ? dashboardHref : trialHref} className="mt-4 w-full">
              {hideTrialPromos ? 'Go to dashboard' : ctaLabel}
            </PrimaryLink>
          </article>
          <article className="relative rounded-2xl border border-[var(--brand-yellow)] bg-[var(--surface)] p-4 shadow-[0_8px_24px_rgba(11,27,51,0.04)]">
            <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--brand-yellow)] px-2 py-0.5 text-[11px] font-bold text-[var(--ink)]">
              {plans.full.ribbon}
            </span>
            <h3 className="text-base font-semibold text-[var(--ink)]">{plans.full.name}</h3>
            <p className="mt-1 text-2xl font-semibold text-[var(--brand-blue)]">
              {amount != null ? `₹${amount.toLocaleString('en-IN')}` : 'At checkout'}
            </p>
            <p className="text-xs text-[var(--muted)]">{plans.full.note}</p>
            <ul className="mt-3 space-y-1.5">
              {plans.full.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[var(--ink)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-green)]" strokeWidth={1.75} aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <PrimaryLink href={hideTrialPromos ? dashboardHref : subscribeHref} className="mt-4 w-full">
              {hideTrialPromos ? 'Go to dashboard' : 'Subscribe'}
            </PrimaryLink>
          </article>
        </div>
        {batchLoading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-[var(--surface)]" aria-hidden />
        ) : showBatch ? (
          <article className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_8px_24px_rgba(11,27,51,0.04)]">
            <h3 className="text-base font-semibold text-[var(--ink)]">Batch status</h3>
            <p className="mt-2 text-2xl font-semibold text-[var(--brand-blue)]">
              {open} of {max} seats open
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--bg)]" aria-hidden>
              <div className="h-full rounded-full bg-[var(--brand-green)] transition-[width] duration-500" style={{ width: `${ratio * 100}%` }} />
            </div>
            <p className="mt-3 text-sm text-[var(--muted)]">
              {batch?.batch_name ? `${batch.batch_name} includes a coordinator for the group.` : 'A coordinator stays with your batch.'}
            </p>
          </article>
        ) : null}
      </div>
    </section>
  );
}
