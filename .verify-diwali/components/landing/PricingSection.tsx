'use client';

import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { formatAmountINR } from '@/lib/currency';

const pricingIncludes = ['batch', 'jobs', 'coordinator', 'tracking', 'dashboard'] as const;

type PricingSectionProps = {
  seats: number;
  maxSeats: number;
  loading: boolean;
  amountInr?: number;
  regularAmountInr?: number;
  offerActive?: boolean;
  savingsInr?: number;
};

export function PricingSection({
  seats,
  maxSeats,
  loading,
  amountInr,
  regularAmountInr,
  offerActive = false,
  savingsInr = 0,
}: PricingSectionProps) {
  const { t } = useTranslation();
  const enrollmentOpen = seats > 0;
  const showPromo =
    offerActive &&
    amountInr != null &&
    regularAmountInr != null &&
    regularAmountInr > amountInr;

  return (
    <section id="pricing" className="relative overflow-hidden border-t border-line-default bg-gradient-to-br from-brand-blue via-primary-700 to-brand-blue py-14 sm:py-16">
      <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-brand-yellow/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
        aria-hidden
      />

      <PageContainer className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t('landing.pricing.title')}
          </h2>
          <p className="mt-3 text-base text-white/85 sm:text-lg">{t('landing.pricing.subtitle')}</p>
        </div>

        <div className="relative mx-auto mt-10 max-w-4xl">
          <div
            className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-r from-brand-yellow via-brand-orange to-brand-sky opacity-90 blur-[2px]"
            aria-hidden
          />

          <article className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-brand-blue to-primary-700 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-yellow">
                  {t('landing.seats.subscription')}
                </p>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {t('landing.pricing.planName')}
                </h3>
              </div>
              {enrollmentOpen && !loading && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-orange px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  <Zap className="h-3.5 w-3.5" aria-hidden />
                  {t('landing.pricing.seatContext.remaining', { count: seats })}
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-5">
              <div className="flex flex-col items-center justify-center border-b border-line-default bg-gradient-to-br from-brand-blue/[0.06] via-white to-brand-sky/[0.08] px-6 py-8 text-center md:col-span-2 md:border-b-0 md:border-r">
                {amountInr != null && (
                  showPromo ? (
                    <div className="w-full max-w-[240px]">
                      <p className="text-left text-xs font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-sm">
                        {t('landing.pricing.promo.badge')}
                      </p>
                      <p className="mt-2 text-left font-display text-lg font-semibold text-ink-muted line-through decoration-brand-red/50 sm:text-xl">
                        {formatAmountINR(regularAmountInr)}
                      </p>
                      <p className="mt-0.5 text-left font-display text-5xl font-extrabold leading-none text-brand-blue sm:text-6xl">
                        {formatAmountINR(amountInr)}
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="font-display text-5xl font-extrabold leading-none text-brand-blue sm:text-6xl">
                        {t('landing.seats.currency', { amount: amountInr })}
                      </p>
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                        {t('landing.pricing.oneTime')}
                      </p>
                    </>
                  )
                )}
                {showPromo ? (
                  <div className="mt-4 max-w-[240px] space-y-2 text-left">
                    <p className="text-sm leading-relaxed text-ink-secondary">
                      {t('landing.pricing.promo.saveLine', {
                        savings: (savingsInr || regularAmountInr! - amountInr!).toLocaleString('en-IN'),
                      })}
                    </p>
                    <p className="text-xs italic leading-relaxed text-ink-muted">
                      {t('landing.pricing.promo.exclusive')}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-blue">
                      {t('landing.pricing.promo.tagline')}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 max-w-[220px] text-sm leading-relaxed text-ink-muted">
                    {t('landing.pricing.note')}
                  </p>
                )}
                <Link href="/auth/register" className="mt-6 w-full max-w-[240px]">
                  <Button variant="accent" fullWidth className="rounded-full py-3.5 text-sm shadow-lg">
                    {t('landing.pricing.cta')}
                  </Button>
                </Link>
              </div>

              <div className="px-5 py-6 sm:px-6 sm:py-8 md:col-span-3">
                <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                  {t('landing.features.title')}
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {pricingIncludes.map((key) => (
                    <li key={key} className="flex items-start gap-2.5 text-sm text-ink-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                        <ChevronRight className="h-3 w-3" />
                      </span>
                      {t(`landing.pricing.includes.${key}`)}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-xl border border-brand-blue/15 bg-brand-blue/[0.04] p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                    {t('landing.pricing.seatContext.title')}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">{t('landing.pricing.seatContext.desc')}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Array.from({ length: maxSeats }, (_, i) => {
                      const filled = i < maxSeats - seats;
                      const open = !filled && seats > 0;
                      return (
                        <span
                          key={i}
                          className={`h-3.5 w-3.5 rounded-full ${
                            filled
                              ? 'bg-brand-blue/40'
                              : open
                                ? 'bg-brand-green sl-seat-pulse'
                                : 'bg-line-default'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm font-bold text-ink-primary">
                    {loading
                      ? t('landing.seats.loading')
                      : t('landing.pricing.seatContext.remaining', { count: seats })}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </PageContainer>
    </section>
  );
}
