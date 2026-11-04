'use client';

import Link from 'next/link';
import { ArrowRight, LogIn, MessageCircle, UserPlus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { MarketingPageHeader } from '@/components/layout/MarketingPageHeader';

type Stat = { k: string; v: string };
type Highlight = { title: string; body: string };
type Metric = { value: string; label: string; hint: string };
type Milestone = { year: string; title: string; body: string };
type ExploreCard = { title: string; body: string; href: string; cta: string };

function readArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

const HIGHLIGHT_ACCENTS = ['bg-brand-blue', 'bg-brand-orange', 'bg-brand-green'];
const METRIC_BG = ['bg-brand-blue text-white', 'bg-brand-orange text-white', 'bg-brand-green text-white', 'bg-brand-sky text-ink-primary'];
const EXPLORE_ICONS: LucideIcon[] = [UserPlus, LogIn, MessageCircle];

export function AboutPageView() {
  const { t, tRaw } = useTranslation();

  const stats = readArray<Stat>(tRaw('pages.about.stats'));
  const highlights = readArray<Highlight>(tRaw('pages.about.highlights'));
  const metrics = readArray<Metric>(tRaw('pages.about.impact.metrics'));
  const milestones = readArray<Milestone>(tRaw('pages.about.journey.milestones'));
  const exploreCards = readArray<ExploreCard>(tRaw('pages.about.explore.cards'));

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <MarketingPageHeader
        eyebrow={t('pages.about.eyebrow')}
        title={t('pages.about.title')}
        subtitle={t('pages.about.subtitle')}
      />

      {/* Story */}
      <section className="border-b border-line-default bg-white">
        <div className="page-container py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-7">
              <p className="section-eyebrow">{t('pages.about.storyEyebrow')}</p>
              <h2 className="section-title mt-2">{t('pages.about.storyTitle')}</h2>
              <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">{t('pages.about.storyBody')}</p>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">{t('pages.about.storyBody2')}</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:col-span-5 lg:flex-col lg:items-stretch">
              {stats.map((s) => (
                <div
                  key={s.v}
                  className="flex flex-1 items-baseline gap-2 rounded-full border border-line-default bg-soft px-5 py-3 sm:min-w-[140px]"
                >
                  <span className="font-display text-2xl font-extrabold text-brand-blue">{s.k}</span>
                  <span className="text-sm text-ink-muted">{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-b border-line-default bg-soft">
        <div className="page-container py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="section-eyebrow">{t('pages.about.highlightsEyebrow')}</p>
            <h2 className="section-title mt-2">{t('pages.about.highlightsTitle')}</h2>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item, i) => (
              <li key={item.title} className="rounded-2xl border border-line-default bg-white p-6 shadow-sm">
                <span className={`inline-block h-1 w-12 rounded-full ${HIGHLIGHT_ACCENTS[i % HIGHLIGHT_ACCENTS.length]}`} />
                <h3 className="mt-4 font-display text-lg font-bold text-ink-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Impact */}
      <section className="border-b border-line-default bg-white">
        <div className="page-container py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="section-eyebrow">{t('pages.about.impact.eyebrow')}</p>
            <h2 className="section-title mt-2">{t('pages.about.impact.title')}</h2>
            <p className="mt-3 text-ink-muted">{t('pages.about.impact.subtitle')}</p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((m, i) => (
              <article
                key={m.label}
                className={`rounded-2xl p-6 shadow-sm ${METRIC_BG[i % METRIC_BG.length]}`}
              >
                <p className="font-display text-4xl font-extrabold leading-none">{m.value}</p>
                <p className="mt-3 text-sm font-bold uppercase tracking-wide opacity-95">{m.label}</p>
                <p className="mt-2 text-xs leading-relaxed opacity-80">{m.hint}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Journey - vertical timeline with step badges (Shortlisted style) */}
      <section className="border-b border-line-default bg-gradient-to-br from-brand-blue to-primary-800 text-white">
        <div className="page-container py-16 sm:py-20">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-yellow">
              {t('pages.about.journey.eyebrow')}
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">{t('pages.about.journey.title')}</h2>
            <p className="mt-3 text-white/75">{t('pages.about.journey.subtitle')}</p>
          </div>
          <ol className="mt-12 space-y-4">
            {milestones.map((m) => (
              <li
                key={m.title}
                className="flex gap-4 rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm sm:gap-6 sm:p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-bold text-ink-primary">
                  {m.year.replace('Step ', '')}
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold">{m.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Explore */}
      <section className="bg-soft">
        <div className="page-container py-16 sm:py-20">
          <div className="text-center">
            <p className="section-eyebrow">{t('pages.about.explore.eyebrow')}</p>
            <h2 className="section-title mt-2">{t('pages.about.explore.title')}</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">{t('pages.about.explore.subtitle')}</p>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {exploreCards.map((card, i) => {
              const Icon = EXPLORE_ICONS[i % EXPLORE_ICONS.length];
              return (
                <li key={card.title}>
                  <Link
                    href={card.href}
                    className="group flex h-full flex-col rounded-2xl border border-line-default bg-white p-6 transition hover:-translate-y-1 hover:shadow-elevated"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-blue/10 text-brand-blue">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-ink-primary">{card.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{card.body}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-blue group-hover:gap-2">
                      {card.cta}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
