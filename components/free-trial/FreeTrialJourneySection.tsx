'use client';

import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { CtaLink } from '@/components/ui/CtaLink';
import { SectionHeading } from '@/components/free-trial/SectionHeading';
import { JourneyStep, type JourneyStepData } from '@/components/free-trial/JourneyStep';

function readSteps(value: unknown): JourneyStepData[] {
  return Array.isArray(value) ? (value as JourneyStepData[]) : [];
}

export function FreeTrialJourneySection() {
  const { t, tRaw } = useTranslation();
  const steps = readSteps(tRaw('freeTrial.journey.steps'));

  return (
    <section id="how-we-help" className="border-t border-line-default bg-white py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <SectionHeading
          title={t('freeTrial.journey.title')}
          subtitle={t('freeTrial.journey.subtitle')}
          align="center"
        />

        <ol className="mt-8 hidden items-start gap-2 xl:flex">
          {steps.map((step, index) => (
            <JourneyStep
              key={step.id}
              item={step}
              showConnector={index < steps.length - 1}
            />
          ))}
        </ol>

        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:hidden">
          {steps.map((step) => (
            <JourneyStep key={step.id} item={step} />
          ))}
        </ol>

        <div className="mt-8 flex justify-center">
          <CtaLink href={t('freeTrial.journey.ctaHref')} size="lg">
            {t('freeTrial.journey.cta')}
          </CtaLink>
        </div>
      </PageContainer>
    </section>
  );
}
