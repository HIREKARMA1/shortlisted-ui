'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { SiteHeader, PageContainer } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BatchCohortVisual } from '@/components/landing/BatchCohortVisual';
import { CourseVsPlacement } from '@/components/landing/CourseVsPlacement';
import { PlacementPipeline } from '@/components/landing/PlacementPipeline';
import { BentoFeatures } from '@/components/landing/BentoFeatures';
import { CoordinatorSpotlight } from '@/components/landing/CoordinatorSpotlight';
import { navLoginClass, navRegisterClass } from '@/components/ui/nav-cta';

type BatchInfo = {
  seats_remaining?: number;
  subscription_amount_inr?: number;
  has_open_batch?: boolean;
};

const faqKeys = ['course', 'batch', 'jobs', 'refund'] as const;
const pricingIncludes = ['batch', 'jobs', 'coordinator', 'tracking', 'dashboard'] as const;

export function LandingPageView() {
  const { t } = useTranslation();
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [loadingBatch, setLoadingBatch] = useState(true);

  useEffect(() => {
    api
      .getActiveBatch()
      .then(setBatchInfo)
      .catch(() => setBatchInfo(null))
      .finally(() => setLoadingBatch(false));
  }, []);

  const seats = batchInfo?.seats_remaining ?? 0;

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero — cohort-first, not marketplace-style */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-blue/[0.04] via-white to-brand-orange/[0.05]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-brand-sky/10 blur-3xl"
          aria-hidden
        />

        <PageContainer className="relative grid items-center gap-12 pb-16 pt-12 lg:grid-cols-2 lg:gap-16 lg:pb-24 lg:pt-16">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink-primary sm:text-5xl lg:text-[52px]">
              {t('landing.hero.title1')}{' '}
              <span className="sl-bracket text-brand-blue">{t('landing.hero.title2')}</span>
            </h1>
            <p className="mt-3 font-display text-2xl font-bold text-brand-orange sm:text-3xl">
              {t('landing.hero.title3')}
            </p>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-muted sm:text-lg">
              {t('landing.hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/auth/register" className={navRegisterClass}>
                {t('landing.hero.ctaPrimary')}
              </Link>
              <Link href="/auth/login" className={navLoginClass}>
                {t('landing.hero.ctaSecondary')}
              </Link>
            </div>

            <p className="mt-6 text-sm text-ink-muted">{t('landing.hero.trust')}</p>

            <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {(['batchSize', 'support', 'access'] as const).map((key) => (
                <div key={key} className="bg-white px-3 py-5 text-center sm:px-4">
                  <dt className="font-display text-2xl font-extrabold text-primary sm:text-3xl">
                    {t(`landing.stats.${key}.value`)}
                  </dt>
                  <dd className="mt-1.5 text-[11px] uppercase tracking-wider text-muted-foreground sm:text-xs">
                    {t(`landing.stats.${key}.label`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <BatchCohortVisual
            seatsRemaining={seats}
            loading={loadingBatch}
            coordinatorLabel={t('landing.cohort.coordinator')}
            seatsLabel={t('landing.cohort.seatsOpen')}
            loadingLabel={t('landing.seats.loading')}
            fullLabel={t('landing.seats.full')}
          />
        </PageContainer>
      </section>

      <CourseVsPlacement />
      <PlacementPipeline />
      <CoordinatorSpotlight />
      <BentoFeatures />

      {/* Pricing — subscription card with seat context */}
      <section id="pricing" className="border-t border-line-default sl-pricing-glow py-16 sm:py-20">
        <PageContainer>
          <SectionHeader
            eyebrow={t('landing.pricing.eyebrow')}
            title={t('landing.pricing.title')}
            subtitle={t('landing.pricing.subtitle')}
            className="text-center [&>div]:mx-auto [&>div]:text-center"
          />

          <div className="mx-auto grid max-w-3xl gap-8 lg:grid-cols-5">
            <div className="flex flex-col justify-center rounded-2xl border border-line-default bg-soft p-6 lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                {t('landing.pricing.seatContext.title')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                {t('landing.pricing.seatContext.desc')}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {Array.from({ length: 12 }, (_, i) => {
                  const filled = i < 12 - seats;
                  const open = !filled && seats > 0;
                  return (
                    <span
                      key={i}
                      className={`h-3 w-3 rounded-full ${
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
              <p className="mt-4 text-sm font-semibold text-ink-primary">
                {loadingBatch
                  ? t('landing.seats.loading')
                  : t('landing.pricing.seatContext.remaining', { count: seats })}
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line-default bg-white shadow-elevated lg:col-span-3">
              <div className="bg-brand-blue px-6 py-4 text-white">
                <h3 className="font-display text-lg font-bold">{t('landing.pricing.planName')}</h3>
                <p className="mt-1 text-sm text-white/80">{t('landing.pricing.note')}</p>
              </div>
              <div className="p-6 sm:p-8">
                {batchInfo?.subscription_amount_inr != null && (
                  <p className="font-display text-5xl font-extrabold text-brand-blue">
                    {t('landing.seats.currency', { amount: batchInfo.subscription_amount_inr })}
                    <span className="ml-2 text-base font-normal text-ink-muted">
                      {t('landing.pricing.oneTime')}
                    </span>
                  </p>
                )}
                <ul className="mt-6 space-y-3">
                  {pricingIncludes.map((key) => (
                    <li key={key} className="flex items-start gap-3 text-sm text-ink-secondary">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-green/15 text-brand-green">
                        <ChevronRight className="h-3 w-3" />
                      </span>
                      {t(`landing.pricing.includes.${key}`)}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/register" className="mt-8 block">
                  <Button variant="primary" fullWidth className="rounded-full py-3.5">
                    {t('landing.pricing.cta')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* FAQ */}
      <section className="border-t border-line-default bg-soft py-16 sm:py-20">
        <PageContainer>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeader eyebrow={t('landing.faq.eyebrow')} title={t('landing.faq.title')} />
              <p className="text-sm text-ink-muted">{t('landing.faq.sideNote')}</p>
              <Link
                href="/auth/register"
                className="mt-6 inline-flex text-sm font-semibold text-brand-blue hover:text-primary-600"
              >
                {t('landing.faq.sideCta')} →
              </Link>
            </div>
            <div className="space-y-3 lg:col-span-8">
              {faqKeys.map((key, i) => (
                <details
                  key={key}
                  className="group rounded-xl border border-line-default bg-white px-5 py-4 open:shadow-sm"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10 font-display text-sm font-bold text-brand-blue">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-display font-bold text-ink-primary">
                      {t(`landing.faq.items.${key}.q`)}
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="ml-12 mt-3 text-sm leading-relaxed text-ink-muted">
                    {t(`landing.faq.items.${key}.a`)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Final CTA — gradient band, not solid ink block */}
      <section className="relative overflow-hidden border-t border-line-default">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-primary-700 to-brand-blue" aria-hidden />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} aria-hidden />

        <PageContainer className="relative py-16 text-center sm:py-20">
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            {t('landing.cta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">{t('landing.cta.subtitle')}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-bold text-brand-blue shadow-lg transition hover:bg-white/95"
            >
              {t('landing.cta.primary')}
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full border-2 border-white/40 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t('landing.cta.secondary')}
            </Link>
          </div>
        </PageContainer>
      </section>

      <SiteFooter />
    </main>
  );
}
