'use client';

import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import {
  ApproachColumn,
  type ApproachItemData,
} from '@/components/free-trial/ApproachColumn';
import { ResultFlowDiagram } from '@/components/free-trial/ResultFlowDiagram';

function readItems(value: unknown): ApproachItemData[] {
  return Array.isArray(value) ? (value as ApproachItemData[]) : [];
}

function readAccent(value: unknown, fallback: string): string {
  return typeof value === 'string' && value ? value : fallback;
}

function readSteps(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) {
    return value.split('→').map((step) => step.trim()).filter(Boolean);
  }
  return [];
}

export function FreeTrialApproachSection() {
  const { t, tRaw } = useTranslation();
  const humanItems = readItems(tRaw('freeTrial.approach.human.items'));
  const aiItems = readItems(tRaw('freeTrial.approach.ai.items'));
  const resultSteps = readSteps(tRaw('freeTrial.approach.resultSteps'));

  return (
    <section className="border-t border-[#eef1f5] bg-white py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-[1.65rem] font-bold tracking-tight text-[#172033] sm:text-3xl lg:text-[2.35rem]">
            {t('freeTrial.approach.title')}
          </h2>
          <p className="mt-2 text-[15px] font-bold leading-snug text-[#172033] sm:text-[17px]">
            {t('freeTrial.approach.subtitle')}
          </p>
          <p className="mx-auto mt-2 max-w-[640px] text-[13px] leading-[1.7] text-[#3f4a5a] sm:text-[14px]">
            <span className="font-semibold text-[#1b52a4]">
              {t('freeTrial.approach.intro.brand')}
            </span>
            {t('freeTrial.approach.intro.middle')}
            <span className="font-semibold text-[#1b52a4]">
              {t('freeTrial.approach.intro.highlight')}
            </span>
            <br className="hidden sm:inline" />
            {t('freeTrial.approach.intro.tail')}
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_0.92fr_1fr] lg:gap-6">
          <ApproachColumn
            title={t('freeTrial.approach.human.title')}
            accent={readAccent(tRaw('freeTrial.approach.human.accent'), 'blue')}
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
            accent={readAccent(tRaw('freeTrial.approach.ai.accent'), 'green')}
            items={aiItems}
          />
        </div>
      </PageContainer>
    </section>
  );
}
