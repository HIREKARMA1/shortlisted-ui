'use client';

import type { ReactNode } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

function SkillDevelopmentArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-[4.5rem] w-auto sm:h-20" aria-hidden>
      <rect x="28" y="52" width="64" height="6" rx="2" fill="#e8e0f5" />
      <rect x="36" y="38" width="48" height="16" rx="2" fill="#7c5cbf" />
      <rect x="40" y="41" width="40" height="10" rx="1" fill="#f5f0ff" />
      <circle cx="60" cy="22" r="10" fill="#c4b0e8" />
      <path d="M48 48c0-8 5-14 12-14s12 6 12 14" fill="#9b7fd4" />
      <rect x="54" y="58" width="12" height="8" rx="1" fill="#a890d4" />
    </svg>
  );
}

function PrePlacementArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-[4.5rem] w-auto sm:h-20" aria-hidden>
      <rect x="72" y="18" width="28" height="36" rx="2" fill="#d4eed9" />
      <rect x="76" y="22" width="20" height="3" rx="1" fill="#3d9b55" />
      <rect x="76" y="28" width="16" height="2" rx="1" fill="#7cbc8a" />
      <rect x="76" y="33" width="18" height="2" rx="1" fill="#7cbc8a" />
      <circle cx="58" cy="24" r="8" fill="#8bc99a" />
      <path d="M46 52c2-10 7-16 12-16s10 6 12 16" fill="#3d9b55" />
      <circle cx="30" cy="48" r="5" fill="#b8ddc0" />
      <path d="M22 66c1-7 4-11 8-11s7 4 8 11" fill="#5aaf6e" />
      <circle cx="48" cy="50" r="5" fill="#b8ddc0" />
      <path d="M40 68c1-7 4-11 8-11s7 4 8 11" fill="#5aaf6e" />
      <circle cx="66" cy="50" r="5" fill="#b8ddc0" />
      <path d="M58 68c1-7 4-11 8-11s7 4 8 11" fill="#5aaf6e" />
    </svg>
  );
}

function EmployabilityArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-[4.5rem] w-auto sm:h-20" aria-hidden>
      <rect x="22" y="62" width="22" height="10" rx="1" fill="#3b7dd8" />
      <rect x="40" y="48" width="22" height="24" rx="1" fill="#5a94e0" />
      <rect x="58" y="34" width="22" height="38" rx="1" fill="#7aabeb" />
      <circle cx="78" cy="22" r="7" fill="#f0c4a8" />
      <path d="M68 44c2-8 6-12 10-12s8 4 10 12" fill="#e07a2f" />
      <path d="M84 20l6-10 2 4 4-2-4 12z" fill="#e85a4f" />
      <circle cx="90" cy="10" r="3" fill="#e85a4f" />
    </svg>
  );
}

function EmployerConnectArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-[4.5rem] w-auto sm:h-20" aria-hidden>
      <circle cx="40" cy="28" r="9" fill="#9bd4ce" />
      <path d="M26 56c2-12 8-18 14-18s12 6 14 18" fill="#2a9b8f" />
      <circle cx="80" cy="28" r="9" fill="#7ec4bc" />
      <path d="M66 56c2-12 8-18 14-18s12 6 14 18" fill="#1f857a" />
      <path
        d="M48 48c4 4 12 4 16 0"
        fill="none"
        stroke="#148f84"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect x="44" y="42" width="10" height="8" rx="1" fill="#3aada0" />
      <rect x="66" y="42" width="10" height="8" rx="1" fill="#2a9b8f" />
    </svg>
  );
}

function CampusEngagementArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-[4.5rem] w-auto sm:h-20" aria-hidden>
      <rect x="48" y="18" width="48" height="50" rx="2" fill="#d4e4f7" />
      <rect x="54" y="26" width="8" height="8" rx="1" fill="#3b7dd8" />
      <rect x="68" y="26" width="8" height="8" rx="1" fill="#3b7dd8" />
      <rect x="82" y="26" width="8" height="8" rx="1" fill="#3b7dd8" />
      <rect x="54" y="40" width="8" height="8" rx="1" fill="#5a94e0" />
      <rect x="68" y="40" width="8" height="8" rx="1" fill="#5a94e0" />
      <rect x="82" y="40" width="8" height="8" rx="1" fill="#5a94e0" />
      <rect x="68" y="54" width="10" height="14" rx="1" fill="#2a5a9e" />
      <circle cx="34" cy="42" r="8" fill="#f0b8cc" />
      <path d="M22 68c2-12 7-18 12-18s10 6 12 18" fill="#d45a8a" />
      <rect x="30" y="52" width="8" height="16" rx="1" fill="#c44878" />
    </svg>
  );
}

function TechHiringArt() {
  return (
    <svg viewBox="0 0 120 88" className="h-[4.5rem] w-auto sm:h-20" aria-hidden>
      <rect x="28" y="16" width="64" height="44" rx="3" fill="#d6e6f7" />
      <rect x="34" y="22" width="52" height="32" rx="2" fill="#f7fbff" />
      <circle cx="60" cy="38" r="10" fill="#e4f0ff" stroke="#3b7dd8" strokeWidth="2" />
      <text
        x="60"
        y="41"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fill="#3b7dd8"
        fontFamily="system-ui, sans-serif"
      >
        AI
      </text>
      <rect x="40" y="60" width="40" height="4" rx="1" fill="#a8c4e8" />
      <rect x="48" y="64" width="24" height="6" rx="1" fill="#7aa3d9" />
      <rect x="38" y="28" width="10" height="3" rx="1" fill="#9bc0eb" />
      <rect x="72" y="28" width="8" height="3" rx="1" fill="#9bc0eb" />
      <rect x="72" y="48" width="10" height="3" rx="1" fill="#9bc0eb" />
    </svg>
  );
}

const features: {
  id: string;
  accent: string;
  Illustration: () => ReactNode;
}[] = [
  { id: 'skillDevelopment', accent: 'bg-[#7c5cbf]', Illustration: SkillDevelopmentArt },
  { id: 'prePlacement', accent: 'bg-[#3d9b55]', Illustration: PrePlacementArt },
  { id: 'employability', accent: 'bg-[#e07a2f]', Illustration: EmployabilityArt },
  { id: 'employerConnect', accent: 'bg-[#2a9b8f]', Illustration: EmployerConnectArt },
  { id: 'campusEngagement', accent: 'bg-[#d45a8a]', Illustration: CampusEngagementArt },
  { id: 'techHiring', accent: 'bg-[#3b7dd8]', Illustration: TechHiringArt },
];

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
  const { t } = useTranslation();
  const { Illustration } = feature;

  return (
    <article
      className={[
        'group flex w-[200px] shrink-0 flex-col overflow-hidden rounded-xl border border-line-default/80 bg-white',
        'shadow-[0_4px_20px_rgba(15,23,42,0.06)] transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)]',
        'sm:w-[180px] lg:w-auto lg:min-w-0 lg:flex-1',
      ].join(' ')}
    >
      <div className="flex flex-1 flex-col items-center px-3.5 pb-4 pt-5 text-center sm:px-4 sm:pt-6">
        <div className="flex h-20 items-center justify-center transition-transform duration-300 group-hover:scale-105 sm:h-24">
          <Illustration />
        </div>

        <h3 className="mt-3 font-display text-[13px] font-bold leading-snug text-brand-blue sm:text-sm">
          {t(`landing.whatWeDo.features.${feature.id}.title`)}
        </h3>

        <p className="mt-2 flex-1 text-[11px] leading-relaxed text-ink-muted sm:text-xs">
          {t(`landing.whatWeDo.features.${feature.id}.desc`)}
        </p>
      </div>

      <div className={`h-[3px] w-full shrink-0 ${feature.accent}`} aria-hidden />
    </article>
  );
}

export function WhatWeDoSection() {
  const { t } = useTranslation();

  return (
    <section
      id="what-we-do"
      className="relative border-t border-line-default bg-white py-14 sm:py-16"
    >
      <div
        className="pointer-events-none absolute -right-16 top-16 h-48 w-48 rounded-full bg-brand-sky/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-12 bottom-8 h-40 w-40 rounded-full bg-[#7c5cbf]/8 blur-3xl"
        aria-hidden
      />

      <PageContainer className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-black uppercase tracking-[0.1em] text-brand-blue sm:text-4xl lg:text-[2.75rem]">
            {t('landing.whatWeDo.title')}
          </h2>
          <p className="mt-3 font-display text-base font-semibold text-brand-orange sm:mt-3.5 sm:text-lg">
            {t('landing.whatWeDo.subtitle')}
          </p>
        </div>

        <div className="-mx-1 mt-8 overflow-x-auto overscroll-x-contain pb-3 pt-3 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:mt-10 [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full items-stretch gap-3 px-2 sm:gap-4 sm:px-0 lg:w-full lg:gap-3">
            {features.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
