'use client';

import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { SectionHeading } from '@/components/free-trial/SectionHeading';
import { TrainerCard, type TrainerCardData } from '@/components/free-trial/TrainerCard';

function readTrainers(value: unknown): TrainerCardData[] {
  return Array.isArray(value) ? (value as TrainerCardData[]) : [];
}

export function FreeTrialTrainersSection() {
  const { t, tRaw } = useTranslation();
  const items = readTrainers(tRaw('freeTrial.trainers.items'));

  return (
    <section id="trainers" className="border-t border-line-default bg-white py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <SectionHeading
          title={t('freeTrial.trainers.title')}
          subtitle={t('freeTrial.trainers.subtitle')}
          align="center"
        />

        <div className="mt-8 grid gap-5 lg:grid-cols-2 lg:gap-6">
          {items.map((item) => (
            <TrainerCard
              key={item.id}
              item={item}
              linkedinAria={t('freeTrial.trainers.linkedinAria')}
              youtubeAria={t('freeTrial.trainers.youtubeAria')}
            />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
