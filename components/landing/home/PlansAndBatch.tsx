'use client';

import { Check } from 'lucide-react';
import { ctaLabel, plans } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { OutlineLink, PrimaryLink, Reveal, SectionHeading } from './primitives';

export function PlansAndBatch() {
  const { batch, hideTrialPromos, trialHref, dashboardHref, subscribeHref } = useHome();
  const amount = batch?.subscription_amount_inr;
  const regularAmount = batch?.regular_amount_inr;
  const showOffer = Boolean(
    batch?.offer_active && amount != null && regularAmount != null && regularAmount > amount,
  );
  const savings = showOffer ? regularAmount! - amount! : 0;
  const savingsPercent = showOffer ? Math.round((savings / regularAmount!) * 100) : 0;

  return (
    <section id="plans" className="scroll-mt-[88px] w-full bg-white border-y border-[#E5EAF2]/60 py-14" aria-label="Plans and pricing">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="PRICING"
            title="Simple, transparent plans"
            subtitle="Explore the free trial page first, then subscribe once to unlock the full placement cell."
          />
        </Reveal>

        <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {/* Free Plan Card */}
          <Reveal delay={0.05} className="flex">
            <article className="flex w-full flex-col justify-between rounded-[20px] border border-[#E5EAF2] bg-white p-6 shadow-[0_8px_24px_rgba(11,27,51,0.04)] transition-all duration-200 hover:-translate-y-1">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82]">
                  LOOK AROUND FIRST
                </span>
                <h3 className="mt-1 text-xl font-bold text-[var(--ink)]">{plans.trial.name}</h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-[36px] font-extrabold tracking-tight text-[var(--ink)] leading-none">
                    Free
                  </span>
                  <span className="text-xs font-semibold text-[var(--muted)]">
                    {plans.trial.note}
                  </span>
                </div>

                <ul className="mt-5 space-y-2.5">
                  {plans.trial.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--ink)]">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#098855]/15 text-[#098855] mt-0.5">
                        <Check className="h-3 w-3 stroke-[2.5]" aria-hidden />
                      </span>
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Real FAQ note to fill vertical gap */}
                <p className="mt-4 pt-3 border-t border-[#E5EAF2] text-[11px] leading-relaxed text-[#5B6B82]">
                  No payment required. The placement journey is a roadmap, not a countdown.
                </p>
              </div>

              {/* Outlined (not filled) button pinned at the bottom */}
              <div className="mt-6 pt-2">
                <OutlineLink href={hideTrialPromos ? dashboardHref : trialHref} className="w-full">
                  {hideTrialPromos ? 'Go to dashboard' : ctaLabel}
                </OutlineLink>
              </div>
            </article>
          </Reveal>

          {/* Paid Plan Card with 2px Gradient Border */}
          <Reveal delay={0.1} className="flex">
            <div className="relative flex w-full flex-col rounded-[22px] p-[2px] bg-gradient-to-br from-[#1b52a4] to-[#00a2e5] shadow-[0_16px_36px_rgba(27,82,164,0.18)] transition-all duration-200 hover:-translate-y-1">
              <article className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[20px] bg-white p-6">
                {/* Clean soft blue header band (not a fading gradient behind text) */}
                <div
                  className="absolute top-0 inset-x-0 h-16 bg-[#00a2e5]/[0.08] border-b border-[#00a2e5]/15 rounded-t-[20px]"
                  aria-hidden
                />

                {/* Yellow Ribbon sits FULLY INSIDE top-right with 12px margin */}
                <span className="absolute top-3 right-3 z-10 rounded-full bg-[#fec40d] px-3 py-1 text-[11px] font-extrabold text-[#1b52a4] shadow-sm uppercase tracking-wider">
                  {showOffer
                    ? `${(batch?.offer_name || 'SPECIAL OFFER').toUpperCase()} · SAVE ${savingsPercent}%`
                    : plans.full.ribbon}
                </span>

                <div className="relative z-10">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1b52a4]">
                    FULL PLACEMENT CELL
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-[var(--ink)]">{plans.full.name}</h3>

                  <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    {showOffer && (
                      <span className="text-lg font-bold text-[#5B6B82] line-through decoration-[#d64246]">
                        ₹{regularAmount!.toLocaleString('en-IN')}
                      </span>
                    )}
                    <span className="text-[36px] font-extrabold tracking-tight text-[#1b52a4] leading-none">
                      {amount != null ? `₹${amount.toLocaleString('en-IN')}` : 'At checkout'}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5B6B82]">
                      one-time
                    </span>
                  </div>
                  {showOffer && (
                    <p className="mt-1 text-xs font-bold text-[#098855]">
                      Save ₹{savings.toLocaleString('en-IN')} with this offer
                    </p>
                  )}

                  <ul className="mt-5 space-y-2.5">
                    {plans.full.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-[var(--ink)]">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#098855]/15 text-[#098855] mt-0.5">
                          <Check className="h-3 w-3 stroke-[2.5]" aria-hidden />
                        </span>
                        <span className="leading-snug">
                          {item === 'AI-matched jobs' ? (
                            <span className="inline-flex items-center gap-1.5">
                              <span className="rounded-full bg-[var(--brand-blue)]/10 px-1.5 py-0.5 text-[11px] font-bold uppercase text-[var(--brand-blue)] leading-none">
                                AI
                              </span>
                              <span>Matched jobs</span>
                            </span>
                          ) : (
                            item
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Real FAQ note to fill vertical gap */}
                  <p className="mt-4 pt-3 border-t border-[#E5EAF2] text-[11px] leading-relaxed text-[#5B6B82]">
                    Terms shown at checkout. Dedicated support available before and after you subscribe.
                  </p>
                </div>

                {/* Filled orange full-width button pinned at bottom */}
                <div className="relative z-10 mt-6 pt-2">
                  <PrimaryLink href={hideTrialPromos ? dashboardHref : subscribeHref} className="w-full">
                    {hideTrialPromos ? 'Go to dashboard' : 'Claim Your Seat'}
                  </PrimaryLink>
                </div>
              </article>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  );
}
