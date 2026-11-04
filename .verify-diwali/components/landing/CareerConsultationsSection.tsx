'use client';

import { Fragment } from 'react';
import {
  Compass,
  Contact2,
  MessagesSquare,
  Briefcase,
  Shield,
  ChevronRight,
  Star,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

const steps: {
  id: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  glow: string;
  numberColor: string;
}[] = [
  {
    id: 'guidance',
    icon: Compass,
    iconBg: 'bg-[#f0e8ff]',
    iconColor: 'text-[#7c5cbf]',
    glow: 'shadow-[0_8px_28px_rgba(124,92,191,0.28)]',
    numberColor: 'text-[#7c5cbf]',
  },
  {
    id: 'resume',
    icon: Contact2,
    iconBg: 'bg-[#e4f7e8]',
    iconColor: 'text-[#3d9b55]',
    glow: 'shadow-[0_8px_28px_rgba(61,155,85,0.28)]',
    numberColor: 'text-[#3d9b55]',
  },
  {
    id: 'interview',
    icon: MessagesSquare,
    iconBg: 'bg-[#fff0e0]',
    iconColor: 'text-[#e07a2f]',
    glow: 'shadow-[0_8px_28px_rgba(224,122,47,0.28)]',
    numberColor: 'text-[#e07a2f]',
  },
  {
    id: 'careerPath',
    icon: Briefcase,
    iconBg: 'bg-[#ffe8f0]',
    iconColor: 'text-[#d45a8a]',
    glow: 'shadow-[0_8px_28px_rgba(212,90,138,0.28)]',
    numberColor: 'text-[#d45a8a]',
  },
  {
    id: 'readiness',
    icon: Shield,
    iconBg: 'bg-[#e0f7f4]',
    iconColor: 'text-[#2a9b8f]',
    glow: 'shadow-[0_8px_28px_rgba(42,155,143,0.28)]',
    numberColor: 'text-[#2a9b8f]',
  },
];

function StepConnector() {
  return (
    <div
      className="relative flex h-16 w-8 shrink-0 items-center self-start sm:w-10 lg:w-12 xl:w-14"
      aria-hidden
    >
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#2a9b8f]/45" />
      <span className="relative z-10 mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#2a9b8f] text-white shadow-sm">
        <ChevronRight className="h-3 w-3" strokeWidth={3} />
      </span>
    </div>
  );
}

function ConsultationStep({
  step,
  index,
}: {
  step: (typeof steps)[number];
  index: number;
}) {
  const { t } = useTranslation();
  const Icon = step.icon;
  const number = String(index + 1).padStart(2, '0');

  return (
    <li className="group flex w-[176px] shrink-0 flex-col items-center text-center sm:w-[160px] lg:w-auto lg:min-w-0 lg:flex-1 lg:max-w-[200px]">
      <div
        className={[
          'relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white ring-1 ring-black/[0.04] transition-transform duration-300 ease-out',
          'group-hover:-translate-y-1 group-hover:scale-[1.04]',
          step.glow,
        ].join(' ')}
      >
        <span
          className={`absolute inset-1 rounded-full ${step.iconBg} opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
          aria-hidden
        />
        {step.id === 'readiness' ? (
          <span className={`relative ${step.iconColor}`}>
            <Shield className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            <Star
              className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-[42%] fill-[#fec40d] text-[#fec40d]"
              strokeWidth={0}
              aria-hidden
            />
          </span>
        ) : (
          <Icon className={`relative h-7 w-7 ${step.iconColor}`} strokeWidth={1.75} aria-hidden />
        )}
      </div>

      <span
        className={`mt-3 font-display text-sm font-extrabold tracking-wide ${step.numberColor} transition-transform duration-300 group-hover:scale-105`}
      >
        {number}
      </span>

      <h3 className="mt-1.5 font-display text-[13px] font-bold leading-snug text-brand-blue sm:text-sm">
        {t(`landing.careerConsultations.steps.${step.id}.title`)}
      </h3>

      <p className="mt-2 text-[11px] leading-relaxed text-ink-muted sm:text-xs">
        {t(`landing.careerConsultations.steps.${step.id}.desc`)}
      </p>
    </li>
  );
}

export function CareerConsultationsSection() {
  const { t } = useTranslation();

  return (
    <section
      id="career-consultations"
      className="relative border-t border-line-default bg-gradient-to-b from-neutral-50 via-white to-brand-blue/[0.03] py-14 sm:py-16"
    >
      <div
        className="pointer-events-none absolute -left-16 top-20 h-48 w-48 rounded-full bg-brand-sky/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-12 bottom-10 h-56 w-56 rounded-full bg-brand-green/10 blur-3xl"
        aria-hidden
      />

      <PageContainer className="relative">
        <div className="rounded-[1.35rem] border border-line-default/80 bg-white px-4 py-8 shadow-[0_8px_40px_rgba(15,23,42,0.06)] sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-[0.06em] text-brand-blue sm:text-3xl lg:text-[2rem]">
              {t('landing.careerConsultations.title')}
            </h2>
            <p className="mt-2.5 font-display text-base font-semibold text-[#2a9b8f] sm:text-lg">
              {t('landing.careerConsultations.subtitle')}
            </p>
          </div>

          <div className="-mx-1 mt-8 overflow-x-auto overscroll-x-contain px-1 pb-3 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-10 [&::-webkit-scrollbar]:hidden">
            <ol className="mx-auto flex w-max min-w-full items-start justify-start gap-0 px-2 sm:justify-center sm:px-0 lg:w-full lg:justify-between lg:gap-2">
              {steps.map((step, index) => (
                <Fragment key={step.id}>
                  <ConsultationStep step={step} index={index} />
                  {index < steps.length - 1 && <StepConnector />}
                </Fragment>
              ))}
            </ol>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
