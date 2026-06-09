'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { SiteHeader, PageContainer } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';

type BatchInfo = {
  seats_remaining?: number;
  subscription_amount_inr?: number;
  has_open_batch?: boolean;
};

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto max-w-3xl text-center">
      <Text variant="badge">{t('landing.hero.badge')}</Text>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink-primary sm:text-5xl">
        {t('landing.hero.title')}
      </h1>
      <Text variant="subtitle" className="mx-auto mt-5 max-w-2xl">
        {t('landing.hero.subtitle')}
      </Text>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/auth/register">
          <Button className="px-8">{t('landing.hero.ctaPrimary')}</Button>
        </Link>
        <Link href="/auth/login">
          <Button variant="secondary" className="px-8">
            {t('landing.hero.ctaSecondary')}
          </Button>
        </Link>
      </div>
    </section>
  );
}

export function SeatsAvailabilityCard() {
  const { t } = useTranslation();
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);

  useEffect(() => {
    api.getActiveBatch().then(setBatchInfo).catch(() => setBatchInfo(null));
  }, []);

  if (!batchInfo) return null;

  return (
    <Card className="mx-auto mt-10 max-w-md text-center">
      <Text variant="muted">{t('landing.seats.label')}</Text>
      <p className="mt-2 font-display text-4xl font-bold text-primary-600">
        {batchInfo.seats_remaining ?? 0}
      </p>
      {batchInfo.subscription_amount_inr != null && (
        <Text variant="muted" className="mt-2">
          {t('landing.seats.subscription')}: {t('landing.seats.currency', { amount: batchInfo.subscription_amount_inr })}
        </Text>
      )}
    </Card>
  );
}

export function LandingPageView() {
  return (
    <main className="min-h-screen bg-surface-page">
      <SiteHeader />
      <PageContainer className="py-16 sm:py-24">
        <HeroSection />
        <SeatsAvailabilityCard />
      </PageContainer>
    </main>
  );
}
