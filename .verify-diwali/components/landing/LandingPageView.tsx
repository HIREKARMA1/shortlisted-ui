'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteFooter } from '@/components/layout/Footer';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { useSession } from '@/hooks/useSession';
import { SiteHeader, PageContainer } from '@/components/layout/Shell';
import { BatchCohortVisual } from '@/components/landing/BatchCohortVisual';
import { ImpactSection } from '@/components/landing/ImpactSection';
import { WhyShortlisted } from '@/components/landing/WhyShortlisted';
import { PricingSection } from '@/components/landing/PricingSection';
import { CareerConsultationsSection } from '@/components/landing/CareerConsultationsSection';
import { WhatWeDoSection } from '@/components/landing/WhatWeDoSection';
import { ConnectedEcosystemSection } from '@/components/landing/ConnectedEcosystemSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { SuccessStoriesSection } from '@/components/landing/SuccessStoriesSection';
import { CommunitySection } from '@/components/landing/CommunitySection';
import { FaqSection } from '@/components/landing/FaqSection';
import { ContactSupportSection } from '@/components/landing/ContactSupportSection';
import { ArrowRight, Star } from 'lucide-react';

type BatchInfo = {
  seats_remaining?: number;
  max_seats?: number;
  batch_name?: string;
  subscription_amount_inr?: number;
  regular_amount_inr?: number;
  offer_active?: boolean;
  offer_name?: string | null;
  offer_end_date?: string | null;
  savings_inr?: number;
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
  const { isLoggedIn } = useSession();
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
  const freeTrialHref = isLoggedIn
    ? '/free-trial'
    : `/auth/login?redirect=${encodeURIComponent('/free-trial')}`;

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero + Impact */}
      <div>
        <section className="relative flex items-center bg-[#04142e]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <img
              src="https://shortlisted.s3.us-east-1.amazonaws.com/HeroSection/hero-bg.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04142e]/70 via-[#04142e]/30 to-transparent" />
          </div>

          <PageContainer className="relative z-10 grid w-full min-w-0 items-center gap-8 py-8 pb-12 sm:gap-10 sm:py-9 sm:pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-10 lg:pb-14 xl:gap-10">
          <div className="min-w-0">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm sm:px-3.5 sm:text-[12px]">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f15a2b]">
                <Star className="h-3 w-3 fill-white text-white" />
              </span>
              <span className="truncate">
                {t('landing.hero.badgeBefore')}{' '}
                <span className="font-semibold text-[#f15a2b]">{t('landing.hero.badgeHighlight')}</span>{' '}
                {t('landing.hero.badgeAfter')}
              </span>
            </span>

            <h1 className="hero-heading mt-3.5 font-display font-extrabold text-white">
              <span className="block">{t('landing.hero.title1')}</span>
              <span className="block text-[#f15a2b]">{t('landing.hero.titleHighlight')}</span>
              <span className="block">{t('landing.hero.title2')}</span>
            </h1>

            <p className="mt-3 max-w-[32rem] text-[13px] leading-relaxed text-white/75 sm:text-[14.5px] sm:leading-6">
              {t('landing.hero.subtitle')}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 rounded-full bg-[#f15a2b] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_8px_24px_rgba(241,90,43,0.35)] transition hover:bg-[#dc4e22] sm:px-6 sm:text-[12px]"
              >
                {t('landing.hero.ctaPrimary')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={freeTrialHref}
                className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#04142e]/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-white/10 sm:px-6 sm:text-[12px]"
              >
                {t('landing.hero.ctaFreeTrial')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:text-[11px]">
              {t('landing.hero.trust')}{' '}
              <span className="text-[#f15a2b]">{t('landing.hero.trustBrand')}</span>
              {' • '}
              {t('landing.hero.trustAfter')}
            </p>

            <dl className="mt-4 grid max-w-md grid-cols-3 gap-3 sm:max-w-lg sm:gap-5">
              {(['batchSize', 'support', 'access'] as const).map((key) => (
                <div key={key}>
                  <dt className="font-display text-xl font-extrabold leading-none text-white sm:text-2xl">
                    {t(`landing.stats.${key}.value`)}
                  </dt>
                  <dd className="mt-1.5 text-[9px] font-semibold uppercase tracking-wider text-white/55 sm:text-[10px]">
                    {t(`landing.stats.${key}.label`)}
                  </dd>
                </div>
              ))}
            </dl>
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
            supportBadgeLabel={t('landing.cohort.supportBadge')}
            manifestLabel={t('landing.cohort.manifest')}
            statusLabel={t('landing.cohort.statusLabel')}
            statusOpenLabel={t('landing.cohort.statusOpen')}
            statusFullLabel={t('landing.cohort.statusFull')}
            loadingLabel={t('landing.seats.loading')}
          />
          </PageContainer>
        </section>

        <div className="relative bg-gradient-to-br from-brand-blue/[0.04] via-white to-brand-orange/[0.05]">
          <ImpactSection />
        </div>
      </div>

      <WhyShortlisted />

      <PricingSection
        seats={seats}
        maxSeats={maxSeats}
        loading={loadingBatch}
        amountInr={batchInfo?.subscription_amount_inr}
        regularAmountInr={batchInfo?.regular_amount_inr}
        offerActive={Boolean(batchInfo?.offer_active)}
        savingsInr={batchInfo?.savings_inr}
      />
      <CareerConsultationsSection />
      <WhatWeDoSection />
      <ConnectedEcosystemSection />
      <TestimonialsSection testimonials={testimonials} />
      <SuccessStoriesSection stories={successStories} />
      <CommunitySection content={community} />

      <FaqSection />

      <ContactSupportSection />

      <SiteFooter />
    </main>
  );
}
