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
import { navLoginClass, navRegisterClass } from '@/components/ui/nav-cta';

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

      {/* Hero + Impact - one continuous background (no seam) */}
      <div className="relative bg-gradient-to-br from-brand-blue/[0.04] via-white to-brand-orange/[0.05]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -right-24 top-8 h-64 w-64 rounded-full bg-brand-sky/10 blur-3xl" />
        </div>

        <section className="relative flex items-center">
          <PageContainer className="relative grid w-full min-w-0 items-center gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-2 lg:gap-8 lg:py-10 xl:gap-12 xl:py-12 [@media(max-height:760px)]:py-6 [@media(max-height:760px)]:lg:py-7">
          <div className="min-w-0">
            <h1 className="hero-heading font-serif font-bold tracking-tight text-ink-primary">
              <span className="block">{t('landing.hero.title1')}</span>
              <span className="mt-1 block font-serif text-brand-blue">{t('landing.hero.title2')}</span>
            </h1>
            <p className="mt-3 font-display text-base font-bold uppercase tracking-[0.14em] text-brand-orange sm:text-lg xl:text-xl">
              {t('landing.hero.title3')}
            </p>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-secondary sm:text-base">
              {t('landing.hero.subtitle')}
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/auth/register" className={`${navRegisterClass} whitespace-nowrap`}>
                {t('landing.hero.ctaPrimary')}
              </Link>
              <Link href={freeTrialHref} className={`${navLoginClass} whitespace-nowrap`}>
                {t('landing.hero.ctaFreeTrial')}
              </Link>
            </div>

            <div className="mt-6 border-t border-brand-blue/15 pt-4 [@media(max-height:760px)]:mt-4 [@media(max-height:760px)]:pt-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-blue/70">
                {t('landing.hero.trust')}
              </p>
              <dl className="mt-3 grid grid-cols-3 gap-3">
                {(['batchSize', 'support', 'access'] as const).map((key) => (
                  <div key={key}>
                    <dt className="font-display text-3xl font-extrabold text-brand-blue sm:text-4xl">
                      {t(`landing.stats.${key}.value`)}
                    </dt>
                    <dd className="mt-1 text-[10px] font-semibold uppercase leading-snug tracking-wider text-ink-muted sm:text-xs">
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
