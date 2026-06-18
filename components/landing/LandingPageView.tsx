'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { SiteHeader, PageContainer } from '@/components/layout/Shell';
import { BatchCohortVisual } from '@/components/landing/BatchCohortVisual';
import { ImpactSection } from '@/components/landing/ImpactSection';
import { WhyShortlisted } from '@/components/landing/WhyShortlisted';
import { PricingSection } from '@/components/landing/PricingSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { SuccessStoriesSection } from '@/components/landing/SuccessStoriesSection';
import { CommunitySection } from '@/components/landing/CommunitySection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CourseVsPlacement } from '@/components/landing/CourseVsPlacement';
import { PlacementPipeline } from '@/components/landing/PlacementPipeline';
import { CoordinatorSpotlight } from '@/components/landing/CoordinatorSpotlight';
import { navLoginClass, navRegisterClass } from '@/components/ui/nav-cta';

type BatchInfo = {
  seats_remaining?: number;
  max_seats?: number;
  batch_name?: string;
  subscription_amount_inr?: number;
  has_open_batch?: boolean;
};

type Testimonial = {
  id: string;
  name: string;
  batch_name: string;
  feedback: string;
  image_url: string;
};

type SuccessStory = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
};

type CommunityContent = {
  collage_url: string | null;
  gallery: { id: string; image_url: string }[];
};

export function LandingPageView() {
  const { t } = useTranslation();
  const [batchInfo, setBatchInfo] = useState<BatchInfo | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [community, setCommunity] = useState<CommunityContent>({ collage_url: null, gallery: [] });
  const [loadingBatch, setLoadingBatch] = useState(true);

  useEffect(() => {
    api
      .getActiveBatch()
      .then(setBatchInfo)
      .catch(() => setBatchInfo(null))
      .finally(() => setLoadingBatch(false));
    api
      .getTestimonials()
      .then((rows) => setTestimonials(Array.isArray(rows) ? rows : []))
      .catch(() => setTestimonials([]));
    api
      .getSuccessStories()
      .then((rows) => setSuccessStories(Array.isArray(rows) ? rows : []))
      .catch(() => setSuccessStories([]));
    api
      .getCommunity()
      .then((data) =>
        setCommunity({
          collage_url: data?.collage_url ?? null,
          gallery: Array.isArray(data?.gallery) ? data.gallery : [],
        }),
      )
      .catch(() => setCommunity({ collage_url: null, gallery: [] }));
  }, []);

  const seats = batchInfo?.seats_remaining ?? 0;
  const maxSeats = batchInfo?.max_seats ?? 12;

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero + Impact — one continuous background (no seam) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-blue/[0.04] via-white to-brand-orange/[0.05]">
        <div
          className="pointer-events-none absolute -right-24 top-8 h-64 w-64 rounded-full bg-brand-sky/10 blur-3xl"
          aria-hidden
        />

        {/* Hero — keep a bit shorter so Impact peeks in first screen */}
        <section className="relative flex lg:h-[calc(100dvh-10rem)] lg:items-center">
          <PageContainer className="relative grid w-full items-center gap-8 py-6 sm:gap-10 lg:grid-cols-2 lg:gap-12 lg:py-8">
          <div>
            <h1 className="font-serif text-[2.35rem] font-bold leading-[1.06] tracking-tight text-ink-primary sm:text-[3.4rem] lg:text-[4rem]">
              <span className="block">{t('landing.hero.title1')}</span>
              <span className="sl-bracket mt-0.5 block font-serif text-brand-blue">{t('landing.hero.title2')}</span>
            </h1>
            <p className="mt-2 font-display text-base font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-lg">
              {t('landing.hero.title3')}
            </p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-secondary sm:text-[0.95rem]">
              {t('landing.hero.subtitle')}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/auth/register" className={`${navRegisterClass} px-5 py-2.5`}>
                {t('landing.hero.ctaPrimary')}
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md border-2 border-primary bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide text-primary shadow-sm"
              >
                {t('landing.hero.ctaSecondary')}
              </Link>
            </div>

            <div className="mt-6 border-t border-brand-blue/15 pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-blue/70">
                {t('landing.hero.trust')}
              </p>
              <dl className="mt-3 grid grid-cols-3 gap-3">
                {(['batchSize', 'support', 'access'] as const).map((key) => (
                  <div key={key}>
                    <dt className="font-display text-2xl font-extrabold text-brand-blue sm:text-3xl">
                      {t(`landing.stats.${key}.value`)}
                    </dt>
                    <dd className="mt-1 text-[9px] font-semibold uppercase leading-snug tracking-wider text-ink-muted sm:text-[10px]">
                      {t(`landing.stats.${key}.label`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <BatchCohortVisual
            seatsRemaining={seats}
            maxSeats={batchInfo?.max_seats ?? 12}
            batchName={batchInfo?.batch_name}
            loading={loadingBatch}
            eyebrowLabel={t('landing.cohort.eyebrow')}
            primaryLeadLabel={t('landing.cohort.primaryLead')}
            coordinatorRoleLabel={t('landing.cohort.coordinatorRole')}
            seatsLabel={t('landing.cohort.seatsOpen')}
            manifestLabel={t('landing.cohort.manifest')}
            statusLabel={t('landing.cohort.statusLabel')}
            statusOpenLabel={t('landing.cohort.statusOpen')}
            statusFullLabel={t('landing.cohort.statusFull')}
            loadingLabel={t('landing.seats.loading')}
          />
          </PageContainer>
        </section>

        <ImpactSection />
      </div>

      <WhyShortlisted />

      <PricingSection
        seats={seats}
        maxSeats={maxSeats}
        loading={loadingBatch}
        amountInr={batchInfo?.subscription_amount_inr}
      />
      <TestimonialsSection testimonials={testimonials} />
      <SuccessStoriesSection stories={successStories} />
      <CommunitySection content={community} />

      <CourseVsPlacement />
      <PlacementPipeline />
      <CoordinatorSpotlight />

      <FaqSection />

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
