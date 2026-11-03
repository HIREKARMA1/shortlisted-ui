'use client';

import { Check } from 'lucide-react';
import type { CSSProperties } from 'react';
import { ctaLabel, plans } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { OutlineLink, PrimaryLink, Reveal, SectionHeading } from './primitives';

const PLANS_BULB_COLORS = ['var(--plans-warm-white)', 'var(--plans-yellow)', 'var(--plans-orange)', 'var(--plans-yellow)'];
const PLANS_GOLD_DUST = [
  { left: '7%', bottom: '16%', size: 3, duration: 11, delay: -2.3, desktopOnly: false },
  { left: '15%', bottom: '24%', size: 4, duration: 14, delay: -7.1, desktopOnly: false },
  { left: '24%', bottom: '12%', size: 2.5, duration: 9, delay: -4.5, desktopOnly: false },
  { left: '33%', bottom: '22%', size: 3.5, duration: 16, delay: -11.2, desktopOnly: false },
  { left: '42%', bottom: '14%', size: 2, duration: 12, delay: -5.8, desktopOnly: false },
  { left: '50%', bottom: '28%', size: 4.5, duration: 18, delay: -9.4, desktopOnly: false },
  { left: '58%', bottom: '18%', size: 3, duration: 10, delay: -3.2, desktopOnly: true },
  { left: '67%', bottom: '22%', size: 2.5, duration: 15, delay: -13.6, desktopOnly: true },
  { left: '74%', bottom: '14%', size: 4, duration: 13, delay: -6.7, desktopOnly: true },
  { left: '81%', bottom: '26%', size: 2, duration: 17, delay: -8.9, desktopOnly: true },
  { left: '88%', bottom: '12%', size: 3.5, duration: 11, delay: -1.4, desktopOnly: true },
  { left: '94%', bottom: '30%', size: 2.8, duration: 14, delay: -10.5, desktopOnly: true },
  { left: '20%', bottom: '34%', size: 3.2, duration: 12, delay: -8.1, desktopOnly: true },
  { left: '78%', bottom: '38%', size: 4.2, duration: 15, delay: -4.9, desktopOnly: true },
];
const PLANS_STRING_LIGHTS_BULBS = Array.from({ length: 4 }).flatMap((_, swagIdx) => {
  const swagWidth = 291;
  const halfWidth = swagWidth / 2;
  const x0 = 18 + swagIdx * swagWidth;
  const bezier = (a: number, b: number, c: number, d: number, t: number) =>
    (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
  return Array.from({ length: 8 }).map((_, bulbIdx) => {
    const t = ((bulbIdx + 1) / 9) * 2;
    const half = t <= 1 ? 0 : 1;
    const localT = t <= 1 ? t : t - 1;
    const startX = x0 + half * halfWidth;
    const third = halfWidth / 3;
    const x = Math.round(bezier(startX, startX + third, startX + third * 2, startX + halfWidth, localT) * 10) / 10;
    const startY = swagIdx === 0 ? 14 : 8;
    const endY = swagIdx === 3 ? 14 : 8;
    const y = Math.round((half === 0 ? bezier(startY, startY, 76, 76, localT) : bezier(76, 76, endY, endY, localT)) * 10) / 10;
    const globalIdx = swagIdx * 8 + bulbIdx;
    return {
      x,
      y,
      color: PLANS_BULB_COLORS[globalIdx % PLANS_BULB_COLORS.length],
      delay: -Number(((globalIdx * 0.21) % 2.7).toFixed(2)),
      id: `plans-bulb-${globalIdx}`,
    };
  });
});

function PlansStringLights() {
  return (
    <svg
      viewBox="0 0 1200 92"
      preserveAspectRatio="xMidYMin slice"
      className="plans-string-lights pointer-events-none absolute left-0 top-0 z-[1] h-[72px] w-full overflow-visible sm:h-[92px]"
      style={{
        transform: 'scaleY(0.55)',
        transformOrigin: 'top',
        '--plans-warm-white': '#fff3c4',
        '--plans-yellow': 'var(--brand-yellow)',
        '--plans-orange': 'var(--brand-orange)',
        '--plans-socket': '#302315',
      } as CSSProperties}
      aria-hidden="true"
    >
      <defs>
        {PLANS_STRING_LIGHTS_BULBS.map((bulb) => (
          <radialGradient key={`plans-gradient-${bulb.id}`} id={`plans-gradient-${bulb.id}`} cx="34%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="24%" stopColor="var(--plans-warm-white)" />
            <stop offset="58%" stopColor={bulb.color} />
            <stop offset="100%" stopColor={bulb.color} />
          </radialGradient>
        ))}
      </defs>
      <path d="M 18 14 C 66.5 14 115 76 163.5 76 C 212 76 260.5 8 309 8 C 357.5 8 406 76 454.5 76 C 503 76 551.5 8 600 8 C 648.5 8 697 76 745.5 76 C 794 76 842.5 8 891 8 C 939.5 8 988 76 1036.5 76 C 1085 76 1133.5 14 1182 14" stroke="rgba(3,18,24,0.92)" strokeWidth="1.5" fill="none" />
      <path d="M 18 14 C 66.5 14 115 76 163.5 76 C 212 76 260.5 8 309 8 C 357.5 8 406 76 454.5 76 C 503 76 551.5 8 600 8 C 648.5 8 697 76 745.5 76 C 794 76 842.5 8 891 8 C 939.5 8 988 76 1036.5 76 C 1085 76 1133.5 14 1182 14" stroke="rgba(255,255,255,0.12)" strokeWidth="0.45" fill="none" />
      {PLANS_STRING_LIGHTS_BULBS.map((bulb) => (
        <g key={bulb.id} transform={`translate(${bulb.x} ${bulb.y}) scale(0.8) translate(${-bulb.x} ${-bulb.y})`} style={{ '--plans-light-color': bulb.color, '--plans-light-delay': `${bulb.delay}s` } as CSSProperties}>
          <line x1={bulb.x} y1={bulb.y} x2={bulb.x} y2={bulb.y + 4} stroke="rgba(35,25,14,0.92)" strokeWidth="1.5" />
          <rect x={bulb.x - 3} y={bulb.y + 2} width="6" height="5" rx="1.4" fill="var(--plans-socket)" />
          <ellipse cx={bulb.x} cy={bulb.y + 18} rx="12" ry="17" fill={bulb.color} opacity=".24" className="plans-diwali-light-halo" />
          <g className="plans-diwali-twinkle">
            <path
              d={`M ${bulb.x} ${bulb.y + 3} C ${bulb.x + 1.6} ${bulb.y + 9}, ${bulb.x + 6} ${bulb.y + 17}, ${bulb.x + 6} ${bulb.y + 22} C ${bulb.x + 6} ${bulb.y + 29}, ${bulb.x + 3} ${bulb.y + 33}, ${bulb.x} ${bulb.y + 33} C ${bulb.x - 3} ${bulb.y + 33}, ${bulb.x - 6} ${bulb.y + 29}, ${bulb.x - 6} ${bulb.y + 22} C ${bulb.x - 6} ${bulb.y + 17}, ${bulb.x - 1.6} ${bulb.y + 9}, ${bulb.x} ${bulb.y + 3} Z`}
              fill={`url(#plans-gradient-${bulb.id})`}
              stroke={bulb.color}
              strokeWidth=".8"
              className="plans-diwali-light-bulb"
            />
          </g>
        </g>
      ))}
    </svg>
  );
}

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
    <section id="plans" className="relative isolate w-full overflow-hidden scroll-mt-[88px] border-y border-white/10 bg-[linear-gradient(135deg,#0c2a5c_0%,#1b52a4_58%,#1479c4_100%)] py-14" aria-label="Plans and pricing">
      <style jsx global>{`
        @keyframes plans-diwali-twinkle {
          0%, 100% { opacity: 0.8; filter: brightness(0.98); }
          50% { opacity: 1; filter: brightness(1.04); }
        }
        @keyframes plans-diwali-halo-twinkle {
          0%, 100% { opacity: 0.16; }
          50% { opacity: 0.3; }
        }
        @keyframes plans-diwali-gold-dust {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 0.85; }
          85% { opacity: 0.85; }
          100% { transform: translateY(-420px); opacity: 0; }
        }
        .plans-diwali-twinkle { opacity: 1; }
        .plans-diwali-light-bulb {
          filter: drop-shadow(0 0 4px var(--plans-light-color)) drop-shadow(0 0 10px var(--plans-light-color)) drop-shadow(0 0 20px color-mix(in srgb, var(--plans-light-color) 28%, transparent));
        }
        .plans-diwali-light-halo {
          mix-blend-mode: screen;
          filter: drop-shadow(0 0 4px var(--plans-light-color)) drop-shadow(0 0 10px var(--plans-light-color)) drop-shadow(0 0 20px color-mix(in srgb, var(--plans-light-color) 28%, transparent));
        }
        .plans-diwali-gold-dust { animation: plans-diwali-gold-dust 12s linear infinite; }
        @media (prefers-reduced-motion: no-preference) {
          .plans-diwali-twinkle { animation: plans-diwali-twinkle 2.4s ease-in-out infinite; animation-delay: var(--plans-light-delay); }
          .plans-diwali-light-halo { animation: plans-diwali-halo-twinkle 2.4s ease-in-out infinite; animation-delay: var(--plans-light-delay); }
        }
        @media (prefers-reduced-motion: reduce) {
          .plans-diwali-twinkle { opacity: 1; animation: none; }
          .plans-diwali-light-halo { opacity: 0.2; animation: none; }
          .plans-diwali-gold-dust { animation: none; }
        }
      `}</style>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -bottom-24 -left-20 h-[520px] w-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(245,128,32,0.55) 0%, rgba(245,128,32,0.2) 42%, transparent 62%)', filter: 'blur(32px)' }} />
        <div className="absolute -right-16 -top-16 h-80 w-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(254,196,13,0.22) 0%, transparent 70%)', filter: 'blur(28px)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        {PLANS_GOLD_DUST.map((particle, index) => (
          <span
            key={`plans-dust-${index}`}
            className={`plans-diwali-gold-dust absolute rounded-full bg-[#ffd36b] ${particle.desktopOnly ? 'hidden md:block' : ''}`}
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              bottom: particle.bottom,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
      <PlansStringLights />
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="PRICING"
            title="Simple, transparent plans"
            subtitle="Explore the free trial page first, then subscribe once to unlock the full placement cell."
            light
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
