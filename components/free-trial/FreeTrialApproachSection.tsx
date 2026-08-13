'use client';

import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { SectionHeading } from '@/components/free-trial/SectionHeading';
import {
  ApproachColumn,
  type ApproachItemData,
} from '@/components/free-trial/ApproachColumn';
import { ResultFlowDiagram } from '@/components/free-trial/ResultFlowDiagram';

function readItems(value: unknown): ApproachItemData[] {
  return Array.isArray(value) ? (value as ApproachItemData[]) : [];
}

function readSteps(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) {
    return value.split('→').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function FreeTrialApproachSection() {
  const { t, tRaw } = useTranslation();
  const humanItems = readItems(tRaw('freeTrial.approach.human.items'));
  const aiItems = readItems(tRaw('freeTrial.approach.ai.items'));
  const resultSteps = readSteps(tRaw('freeTrial.approach.resultSteps'));

  return (
    <section className="border-t border-line-default bg-soft py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <SectionHeading
          title={t('freeTrial.approach.title')}
          subtitle={t('freeTrial.approach.subtitle')}
          align="center"
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_minmax(220px,260px)_1fr] lg:items-center lg:gap-8">
          <ApproachColumn
            title={t('freeTrial.approach.human.title')}
            accent={
              typeof tRaw('freeTrial.approach.human.accent') === 'string'
                ? (tRaw('freeTrial.approach.human.accent') as string)
                : 'blue'
            }
            items={humanItems}
          />

          <ResultFlowDiagram
            label={t('freeTrial.approach.resultLabel')}
            steps={
              resultSteps.length
                ? resultSteps
                : readSteps(t('freeTrial.approach.resultFlow'))
            }
          />

          <ApproachColumn
            title={t('freeTrial.approach.ai.title')}
            accent={
              typeof tRaw('freeTrial.approach.ai.accent') === 'string'
                ? (tRaw('freeTrial.approach.ai.accent') as string)
                : 'green'
            }
            items={aiItems}
          />
        </div>
      </PageContainer>
    </section>
  );
}
