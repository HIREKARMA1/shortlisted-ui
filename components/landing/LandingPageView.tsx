'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Briefcase,
  LayoutDashboard,
  Target,
  Building2,
  ClipboardCheck,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { SiteHeader, PageContainer } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { SectionHeader } from '@/components/ui/SectionHeader';

type BatchInfo = {
  seats_remaining?: number;
  subscription_amount_inr?: number;
  has_open_batch?: boolean;
};

const featureIcons = [Briefcase, UserCheck, ClipboardCheck, Users, Building2, LayoutDashboard];
const stepKeys = ['register', 'subscribe', 'batch', 'apply'] as const;
const featureKeys = ['jobs', 'coordinator', 'tracking', 'batch', 'brands', 'dashboard'] as const;
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

  return (
    <main className="min-h-screen bg-surface-page">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-60" aria-hidden />
        <PageContainer className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <Text variant="badge">{t('landing.hero.badge')}</Text>
            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-brand-blue sm:text-5xl lg:text-6xl">
              {t('landing.hero.title')}
            </h1>
            <Text variant="subtitle" className="mx-auto mt-6 max-w-2xl text-lg">
              {t('landing.hero.subtitle')}
            </Text>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link href="/auth/register">
                <Button variant="accent" className="px-8 py-3 text-base">
                  {t('landing.hero.ctaPrimary')}
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="secondary" className="px-8 py-3 text-base">
                  {t('landing.hero.ctaSecondary')}
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-muted">{t('landing.hero.trust')}</p>
          </div>

          <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-3">
            {(['batchSize', 'support', 'access'] as const).map((key) => (
              <div key={key} className="card-surface p-5 text-center">
                <p className="font-display text-3xl font-bold text-brand-blue">
                  {t(`landing.stats.${key}.value`)}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{t(`landing.stats.${key}.label`)}</p>
              </div>
            ))}
          </div>

          <div className="card-accent-sky mx-auto mt-10 max-w-md p-6 text-center">
            {loadingBatch ? (
              <Text variant="muted">{t('landing.seats.loading')}</Text>
            ) : batchInfo ? (
              <>
                <Text variant="muted">{t('landing.seats.label')}</Text>
                <p className="mt-2 font-display text-5xl font-bold text-brand-sky">
                  {batchInfo.seats_remaining ?? 0}
                </p>
                {batchInfo.subscription_amount_inr != null && (
                  <p className="mt-3 text-sm font-semibold text-brand-orange">
                    {t('landing.seats.subscription')}:{' '}
                    {t('landing.seats.currency', { amount: batchInfo.subscription_amount_inr })}
                  </p>
                )}
                {(batchInfo.seats_remaining ?? 0) === 0 && (
                  <p className="mt-3 text-sm text-brand-red">{t('landing.seats.full')}</p>
                )}
              </>
            ) : null}
          </div>
        </PageContainer>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-line-default bg-white py-16 sm:py-20">
        <PageContainer>
          <SectionHeader
            title={t('landing.howItWorks.title')}
            subtitle={t('landing.howItWorks.subtitle')}
            className="text-center [&>div]:mx-auto [&>div]:text-center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stepKeys.map((key, i) => (
              <div key={key} className="card-surface relative p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-ink-primary">
                  {t(`landing.howItWorks.steps.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">
                  {t(`landing.howItWorks.steps.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-20">
        <PageContainer>
          <SectionHeader
            title={t('landing.features.title')}
            subtitle={t('landing.features.subtitle')}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[i];
              return (
                <div key={key} className="card-surface group p-6 transition-shadow hover:shadow-elevated">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-brand-blue transition-colors group-hover:bg-brand-sky group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{t(`landing.features.items.${key}.title`)}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{t(`landing.features.items.${key}.desc`)}</p>
                </div>
              );
            })}
          </div>
        </PageContainer>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-line-default bg-white py-16 sm:py-20">
        <PageContainer>
          <SectionHeader
            title={t('landing.pricing.title')}
            subtitle={t('landing.pricing.subtitle')}
            className="text-center [&>div]:mx-auto [&>div]:text-center"
          />
          <div className="card-accent-orange mx-auto max-w-lg p-8">
            <div className="text-center">
              <Target className="mx-auto h-10 w-10 text-brand-orange" />
              <h3 className="mt-4 font-display text-xl font-semibold">{t('landing.pricing.planName')}</h3>
              {batchInfo?.subscription_amount_inr != null && (
                <p className="mt-3 font-display text-4xl font-bold text-brand-blue">
                  {t('landing.seats.currency', { amount: batchInfo.subscription_amount_inr })}
                </p>
              )}
            </div>
            <ul className="mt-8 space-y-3">
              {pricingIncludes.map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm text-ink-secondary">
                  <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
                  {t(`landing.pricing.includes.${key}`)}
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="mt-8 block">
              <Button variant="accent" fullWidth className="py-3">
                {t('landing.pricing.cta')}
              </Button>
            </Link>
            <p className="mt-4 text-center text-xs text-ink-muted">{t('landing.pricing.note')}</p>
          </div>
        </PageContainer>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <PageContainer className="max-w-3xl">
          <SectionHeader title={t('landing.faq.title')} />
          <div className="space-y-4">
            {faqKeys.map((key) => (
              <details key={key} className="card-surface group p-5">
                <summary className="cursor-pointer list-none font-medium text-ink-primary marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {t(`landing.faq.items.${key}.q`)}
                    <ChevronRight className="h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-90" />
                  </span>
                </summary>
                <p className="mt-3 text-sm text-ink-muted">{t(`landing.faq.items.${key}.a`)}</p>
              </details>
            ))}
          </div>
        </PageContainer>
      </section>

      {/* Final CTA */}
      <section className="border-t border-line-default bg-brand-blue py-16 text-white sm:py-20">
        <PageContainer className="text-center">
          <h2 className="font-display text-3xl font-bold">{t('landing.cta.title')}</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">{t('landing.cta.subtitle')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/auth/register">
              <Button variant="accent" className="px-8 py-3">
                {t('landing.cta.primary')}
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="secondary" className="border-white/30 bg-white/10 px-8 py-3 text-white hover:bg-white/20">
                {t('landing.cta.secondary')}
              </Button>
            </Link>
          </div>
        </PageContainer>
      </section>

      <SiteFooter />
    </main>
  );
}
