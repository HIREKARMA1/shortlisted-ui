'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categories, type FeatureAccess } from '@/lib/home/content';
import { featureIcons, toneStyles } from './featureStyles';
import { useFeatureGate } from './useFeatureGate';

const badges: Record<FeatureAccess, { label: string; className: string }> = {
  signIn: { label: 'After sign-in', className: 'bg-[var(--brand-green)] text-white' },
  fullPlan: { label: 'Full plan', className: 'bg-[var(--brand-blue)] text-white' },
  public: { label: 'Public', className: 'bg-[var(--brand-sky)] text-white' },
};

export function FeatureSpotlight({ selected }: { selected: string }) {
  const feature = categories.find((item) => item.id === selected) ?? categories[0];
  const Icon = featureIcons[feature.id];
  const tone = toneStyles[feature.tone];
  const badge = badges[feature.access];
  const reduce = useReducedMotion();
  const { openFeature } = useFeatureGate();

  return (
    <div className="mx-auto max-w-6xl px-4 pb-4 sm:px-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={feature.id}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="relative flex flex-col gap-3 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-4 pl-5 shadow-[0_10px_28px_rgba(11,27,51,0.05)] sm:flex-row sm:items-center"
        >
          <span className="absolute inset-y-3 left-0 w-1 rounded-r-full" style={{ background: tone.accent }} aria-hidden />
          <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-[14px] bg-gradient-to-br ${tone.gradient} ${tone.iconOnGradient}`}>
            <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-[var(--ink)] sm:text-lg">{feature.title}</h2>
              <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}>{badge.label}</span>
            </div>
            <p className="mt-1 text-sm text-[var(--muted)]">{feature.description}</p>
          </div>
          <button
            type="button"
            onClick={() => openFeature(feature)}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-orange)] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(245,128,32,0.28)] transition hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]"
          >
            Go <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
