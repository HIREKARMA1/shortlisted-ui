'use client';

import { Fragment } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { SectionHeading } from '@/components/free-trial/SectionHeading';
import {
  JourneyArrow,
  JourneyStep,
  type JourneyStepData,
} from '@/components/free-trial/JourneyStep';

function readSteps(value: unknown): JourneyStepData[] {
  return Array.isArray(value) ? (value as JourneyStepData[]) : [];
}

export function FreeTrialJourneySection() {
  const { t, tRaw } = useTranslation();
  const steps = readSteps(tRaw('freeTrial.journey.steps'));

  return (
    <section id="how-we-help" className="border-t border-[#eef1f5] bg-white py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <SectionHeading
          title={t('freeTrial.journey.title')}
          subtitle={t('freeTrial.journey.subtitle')}
          align="center"
        />

        {/* Single row with arrows — desktop */}
        <ol className="mt-8 hidden items-stretch justify-center xl:flex">
          {steps.map((step, index) => (
            <Fragment key={step.id}>
              <JourneyStep item={step} className="flex-1 basis-0" />
              {index < steps.length - 1 && <JourneyArrow accent={step.accent} />}
            </Fragment>
          ))}
        </ol>

        {/* Stacked grid — mobile / tablet */}
        <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:hidden">
          {steps.map((step) => (
            <JourneyStep key={step.id} item={step} />
          ))}
        </ol>
      </PageContainer>
    </section>
  );
}
