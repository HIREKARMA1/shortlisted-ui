'use client';

import { Fragment } from 'react';
import {
  BookOpen,
  HeartHandshake,
  Network,
  Search,
  MessagesSquare,
  Settings2,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

const steps: {
  id: string;
  icon: LucideIcon;
}[] = [
  { id: 'learn', icon: BookOpen },
  { id: 'prepare', icon: HeartHandshake },
  { id: 'connect', icon: Network },
  { id: 'discover', icon: Search },
  { id: 'engage', icon: MessagesSquare },
  { id: 'grow', icon: Settings2 },
];

const journeyKeys = [
  'talent',
  'skills',
  'readiness',
  'industry',
  'opportunity',
  'growth',
] as const;

function StepConnector() {
  return (
    <div
      className="relative flex h-16 w-5 shrink-0 items-center self-start sm:w-6 lg:w-8"
      aria-hidden
    >
      <ChevronRight className="mx-auto h-4 w-4 text-brand-blue/30" strokeWidth={2.5} />
    </div>
  );
}

function EcosystemStep({
  step,
}: {
  step: (typeof steps)[number];
}) {
  const { t } = useTranslation();
  const Icon = step.icon;

  return (
    <li className="group flex w-[148px] shrink-0 flex-col items-center text-center sm:w-[140px] lg:w-auto lg:min-w-0 lg:flex-1 lg:max-w-[160px]">
      <div
        className={[
          'relative z-10 flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-full bg-white',
          'ring-1 ring-brand-sky/15 transition-transform duration-300 ease-out',
          'shadow-[0_0_0_6px_rgba(0,162,229,0.08),0_8px_28px_rgba(0,162,229,0.22)]',
          'group-hover:-translate-y-1 group-hover:scale-[1.04]',
          'group-hover:shadow-[0_0_0_8px_rgba(0,162,229,0.12),0_14px_36px_rgba(0,162,229,0.32)]',
        ].join(' ')}
      >
        <span
          className="absolute inset-1.5 rounded-full bg-gradient-to-br from-brand-sky/15 to-brand-blue/10 opacity-90 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
        <Icon
          className="relative h-7 w-7 text-brand-blue transition-colors duration-300 group-hover:text-brand-sky"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <h3 className="mt-4 font-display text-[13px] font-extrabold uppercase tracking-[0.08em] text-brand-blue sm:text-sm">
        {t(`landing.connectedEcosystem.steps.${step.id}.title`)}
      </h3>

      <p className="mt-2 text-[11px] leading-relaxed text-ink-muted sm:text-xs">
        {t(`landing.connectedEcosystem.steps.${step.id}.desc`)}
      </p>
    </li>
  );
}

function JourneyBar() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mt-8 w-full max-w-4xl overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div
        className={[
          'mx-auto flex w-max min-w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 sm:gap-3 sm:px-8 sm:py-4',
          'bg-gradient-to-r from-brand-sky/25 via-secondary-100 to-brand-sky/30',
          'shadow-[0_0_0_1px_rgba(0,162,229,0.18),0_10px_40px_rgba(0,162,229,0.28)]',
          'transition-shadow duration-500 hover:shadow-[0_0_0_1px_rgba(0,162,229,0.28),0_14px_48px_rgba(0,162,229,0.38)]',
        ].join(' ')}
      >
        {journeyKeys.map((key, index) => (
          <Fragment key={key}>
            <span className="whitespace-nowrap font-display text-[11px] font-extrabold uppercase tracking-[0.12em] text-brand-blue sm:text-xs lg:text-sm">
              {t(`landing.connectedEcosystem.journey.${key}`)}
            </span>
            {index < journeyKeys.length - 1 && (
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-brand-blue/55 sm:h-4 sm:w-4"
                strokeWidth={2.75}
                aria-hidden
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export function ConnectedEcosystemSection() {
  const { t } = useTranslation();

  return (
    <section
      id="connected-ecosystem"
      className="relative overflow-hidden border-t border-line-default bg-gradient-to-b from-brand-sky/[0.06] via-white to-brand-blue/[0.03] py-14 sm:py-16"
    >
      <div
        className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-brand-sky/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-16 h-64 w-64 rounded-full bg-brand-blue/10 blur-3xl"
        aria-hidden
      />

      <PageContainer className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.06em] text-brand-blue sm:text-3xl lg:text-[2rem]">
            {t('landing.connectedEcosystem.title')}
          </h2>
        </div>

        <div className="-mx-1 mt-10 overflow-x-auto overscroll-x-contain px-1 pb-3 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 [&::-webkit-scrollbar]:hidden">
          <ol className="mx-auto flex w-max min-w-full items-start justify-start gap-0 px-2 sm:justify-center sm:px-0 lg:w-full lg:justify-between lg:gap-1">
            {steps.map((step, index) => (
              <Fragment key={step.id}>
                <EcosystemStep step={step} />
                {index < steps.length - 1 && <StepConnector />}
              </Fragment>
            ))}
          </ol>
        </div>

        <div className="mx-auto mt-14 max-w-3xl text-center sm:mt-16">
          <h3 className="font-display text-xl font-extrabold uppercase tracking-[0.08em] text-brand-blue sm:text-2xl lg:text-[1.75rem]">
            {t('landing.connectedEcosystem.different.title')}
          </h3>
          <p className="mt-4 text-[0.9375rem] font-medium leading-relaxed text-ink-primary sm:text-base">
            {t('landing.connectedEcosystem.different.paragraph1')}
          </p>
          <p className="mt-3 text-[0.9375rem] font-medium leading-relaxed text-ink-primary sm:text-base">
            {t('landing.connectedEcosystem.different.paragraph2')}
          </p>

          <JourneyBar />

          <p className="mx-auto mt-6 max-w-2xl text-[0.9375rem] font-medium leading-relaxed text-ink-primary sm:text-base">
            {t('landing.connectedEcosystem.different.closing')}
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
