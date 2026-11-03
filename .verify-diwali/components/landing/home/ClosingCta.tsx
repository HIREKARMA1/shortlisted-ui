'use client';

import { ArrowRight, Route } from 'lucide-react';
import { ctaLabel } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { PrimaryLink, Reveal } from './primitives';
import { useShell } from './ShellContext';

export function ClosingCta() {
  const { trialHref, dashboardHref, hideTrialPromos, ready } = useHome();
  const { setContactOpen } = useShell();
  const primaryHref = hideTrialPromos ? dashboardHref : trialHref;

  return (
    <section className="w-full bg-[#F7F9FC] pb-14" aria-label="Ready to get shortlisted">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
      <Reveal>
        <div
          className="relative min-h-[140px] overflow-hidden rounded-[28px] p-6 text-white shadow-[0_20px_50px_rgba(27,82,164,0.28)] sm:p-8"
          style={{ background: 'linear-gradient(135deg, #1b52a4 0%, #00a2e5 100%)' }}
        >
          {/* Faint dot-grid overlay & glows */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-[#fec40d]/25 blur-3xl" />
            <div className="absolute -bottom-10 left-10 h-44 w-44 rounded-full bg-[#f58020]/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
          </div>

          <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            {/* Headline and subtext */}
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                <Route className="h-3 w-3 text-[#fec40d]" />
                PLACEMENT JOURNEY
              </span>
              <h2
                className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-[28px] leading-tight"
                style={{ fontFamily: 'var(--font-home-display), Inter, sans-serif' }}
              >
                Ready to get shortlisted?
              </h2>
              <p className="mt-1 text-sm text-white/90 sm:text-[15px] leading-relaxed">
                Sign in for the free trial page or subscribe to unlock your batch.
              </p>
            </div>

            {/* CTA action buttons in high z-index layer with right padding */}
            <div className="relative z-20 flex flex-wrap items-center gap-3 pr-2 sm:pr-6 lg:mr-6">
              {ready ? (
                <PrimaryLink
                  href={primaryHref}
                  className="shadow-[0_10px_24px_rgba(245,128,32,0.45),0_0_18px_rgba(245,128,32,0.3)] hover:shadow-[0_14px_30px_rgba(245,128,32,0.55)]"
                >
                  {hideTrialPromos ? 'Go to dashboard' : ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </PrimaryLink>
              ) : null}
              <button
                type="button"
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center justify-center rounded-full border border-white/45 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                Contact us
              </button>
            </div>

            {/* Decorative illustration shifted to far right edge behind content at low opacity */}
            <div className="pointer-events-none absolute -right-20 -bottom-14 z-0 hidden lg:block opacity-10" aria-hidden>
              <svg viewBox="0 0 160 160" className="h-44 w-44" fill="none">
                <circle cx="80" cy="80" r="65" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
                <circle cx="80" cy="80" r="42" fill="white" fillOpacity="0.12" />
                <path d="M58 82L74 98L106 66" stroke="#fec40d" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </Reveal>
      </div>
    </section>
  );
}
