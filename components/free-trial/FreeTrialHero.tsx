'use client';

import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { CtaLink } from '@/components/ui/CtaLink';
import { FeatureFloatCard } from '@/components/free-trial/FeatureFloatCard';
import { getPostLoginPath, type Session } from '@/lib/auth/session';

type FeatureItem = {
  id: string;
  label: string;
  accent?: string;
  icon?: string;
};

function readFeatures(value: unknown): FeatureItem[] {
  return Array.isArray(value) ? (value as FeatureItem[]) : [];
}

function DottedRing() {
  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[88%] w-[88%] -translate-x-1/2 -translate-y-1/2 text-[#00a2e5]/40"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.55"
        strokeDasharray="0.9 1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type FreeTrialHeroProps = {
  session: Session;
};

export function FreeTrialHero({ session }: FreeTrialHeroProps) {
  const { t, tRaw } = useTranslation();
  const features = readFeatures(tRaw('freeTrial.hero.features'));
  const imageUrl = t('freeTrial.hero.imageUrl').trim();
  const ctaHref = getPostLoginPath(session);

  return (
    <section className="relative overflow-hidden bg-white">
      <PageContainer className="relative grid items-center gap-6 py-6 sm:gap-8 sm:py-8 lg:grid-cols-[0.85fr_1.2fr] lg:gap-3 lg:py-10 xl:grid-cols-[0.8fr_1.25fr]">
        {/* Left content */}
        <div className="relative z-10 w-full max-w-[560px]">
          <span className="inline-flex max-w-full items-center rounded-lg border border-[#67c5ff] bg-[#f3faff] px-3.5 py-2 text-[12px] font-semibold leading-snug text-[#1b52a4] sm:px-7 sm:py-3 sm:text-[15px] sm:leading-none">
            {t('freeTrial.hero.badge')}
          </span>

          <h1 className="mt-4 font-serif text-[2rem] font-bold leading-[1.08] tracking-tight text-[#111827] sm:mt-6 sm:text-[52px] sm:leading-[1.04] lg:text-[58px] xl:text-[62px]">
            <span className="block">{t('freeTrial.hero.titleLine1')}</span>
            <span className="block text-[#1b52a4]">{t('freeTrial.hero.titleLine2')}</span>
          </h1>

          <p className="mt-4 max-w-[480px] text-[14px] font-normal leading-[1.7] text-[#4b5563] sm:mt-6 sm:text-[16px] sm:leading-[1.75]">
            {t('freeTrial.hero.subtitle')}
          </p>

          <div className="mt-6 sm:mt-8">
            <CtaLink
              href={ctaHref}
              size="lg"
              className="h-[46px] w-full gap-2.5 rounded-[7px] bg-[#1b52a4] px-6 text-[14px] font-semibold shadow-none transition-none hover:translate-y-0 hover:bg-[#1b52a4] hover:shadow-none sm:w-auto sm:px-10"
            >
              {t('freeTrial.hero.cta')}
            </CtaLink>
          </div>
        </div>

        {/* Right visual — column on mobile so image stacks above cards */}
        <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center lg:max-w-none">
          <div className="relative aspect-[3/2] w-full max-w-[760px] sm:max-w-[820px] lg:max-w-none">
            <DottedRing />

            <div className="absolute inset-x-[2%] bottom-0 top-[2%] z-10 flex items-end justify-center lg:justify-end">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={t('freeTrial.hero.imageAlt')}
                  className="h-full w-full max-h-full object-contain object-bottom lg:object-right"
                />
              ) : (
                <div className="h-full w-full animate-pulse rounded-3xl bg-[#f5f7fa]" />
              )}
            </div>

            {/* Floating cards — tablet / desktop only */}
            <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
              {features[0] && (
                <FeatureFloatCard
                  label={features[0].label}
                  accent="#1b52a4"
                  icon={features[0].icon}
                  className="absolute left-[0%] top-[13%] w-[185px] lg:left-[-1%] xl:left-[-3%]"
                />
              )}
              {features[1] && (
                <FeatureFloatCard
                  label={features[1].label}
                  accent="#fec40d"
                  icon={features[1].icon}
                  className="absolute right-[0%] top-[17%] w-[200px] lg:right-[-1%] xl:right-[-3%]"
                />
              )}
              {features[2] && (
                <FeatureFloatCard
                  label={features[2].label}
                  accent="#098855"
                  icon={features[2].icon}
                  className="absolute bottom-[17%] left-[0%] w-[190px] lg:left-[-1%] xl:left-[-3%]"
                />
              )}
              {features[3] && (
                <FeatureFloatCard
                  label={features[3].label}
                  accent="#d64246"
                  icon={features[3].icon}
                  className="absolute bottom-[13%] right-[0%] w-[185px] lg:right-[-1%] xl:right-[-3%]"
                />
              )}
            </div>
          </div>

          {/* Mobile / small tablet feature grid — stacked under image */}
          <div className="relative z-20 mt-4 grid w-full grid-cols-2 gap-2.5 md:hidden">
            {features.map((feature) => (
              <FeatureFloatCard
                key={feature.id}
                label={feature.label}
                accent={feature.accent}
                icon={feature.icon}
                className="w-full min-w-0"
              />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
