'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, Check, LayoutDashboard, UserRound, Users } from 'lucide-react';
import { ctaLabel } from '@/lib/home/content';
import { useHome, type BatchInfo } from './HomeProvider';
import { PrimaryLink } from './primitives';

/**
 * Hook for smooth integer count-up animation on numerical stats.
 */
function useCountUp(target: number | null, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target == null) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 750, 1);
      setValue(Math.round(target * progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

/**
 * Typed live seat availability state derived from HomeProvider's active batch request.
 * The API is shared with production; this component only handles loading and empty responses.
 */
export type SeatsAvailabilityState =
  | { status: 'loading'; text: 'Checking availability...' }
  | { status: 'available'; seats: number; text: string }
  | { status: 'fallback'; text: 'Limited seats' };

function getSeatsAvailability(batch: BatchInfo | null, loading: boolean): SeatsAvailabilityState {
  if (loading) {
    return { status: 'loading', text: 'Checking availability...' };
  }
  if (!batch || batch.seats_remaining == null) {
    // Fallback state when backend batch API is offline or returns empty
    return { status: 'fallback', text: 'Limited seats' };
  }
  return {
    status: 'available',
    seats: batch.seats_remaining,
    text: String(batch.seats_remaining),
  };
}

// 14 rising gold dust particles with random start positions and negative delays (<= 20 on desktop, 6 on mobile)
const GOLD_DUST = [
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

// String lights: four continuous swags with horizontal tangents at each join.
const BULB_COLORS = ['#ffd36b', '#ff9a3c', '#fff3c4'];
const STRING_LIGHTS_BULBS = Array.from({ length: 4 }).flatMap((_, swagIdx) => {
  const x0 = swagIdx * 300;
  const bezier = (a: number, b: number, c: number, d: number, t: number) =>
    (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;
  return Array.from({ length: 8 }).map((_, bulbIdx) => {
    const t = ((bulbIdx + 1) / 9) * 2;
    const half = t <= 1 ? 0 : 1;
    const localT = t <= 1 ? t : t - 1;
    const startX = x0 + half * 150;
    const x = Math.round(bezier(startX, startX + 50, startX + 100, startX + 150, localT) * 10) / 10;
    const y = Math.round(bezier(half ? 76 : 8, half ? 76 : 8, half ? 8 : 76, half ? 8 : 76, localT) * 10) / 10;
    const globalIdx = swagIdx * 8 + bulbIdx;
    const color = BULB_COLORS[globalIdx % 3];
    const delay = -Number(((globalIdx * 0.375) % 3).toFixed(2));
    return { x, y, color, delay, id: `bulb-${globalIdx}` };
  });
});

// 8 outward spark trajectories for boosted diya bloom effect (PROTECTED EFFECT)
const SPARK_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const SPARKS = SPARK_ANGLES.map((deg, i) => {
  const rad = (deg * Math.PI) / 180;
  const dist = 24 + ((i * 7) % 24) + 6; // 24px - 50px
  return {
    dx: Math.round(Math.cos(rad) * dist),
    dy: Math.round(Math.sin(rad) * dist),
  };
});

// 5 Career Journey Diya Steps
const DIYA_STEPS = [
  { id: 'profile', name: 'Profile' },
  { id: 'assessment', name: 'Assessment' },
  { id: 'jobs', name: 'Jobs' },
  { id: 'interview', name: 'Interview' },
  { id: 'offer', name: 'Offer' },
] as const;

function StringLights() {
  return (
    <svg
      viewBox="0 0 1200 92"
      preserveAspectRatio="xMidYMin slice"
      className="pointer-events-none absolute left-0 top-0 z-10 h-[72px] sm:h-[92px] w-full"
      style={{ transform: 'scaleY(0.55)', transformOrigin: 'top' }}
      aria-hidden="true"
    >
      {/* Four cubic swags meet with matching horizontal tangents. */}
      <path
        d="M 0 8 C 50 8 100 76 150 76 C 200 76 250 8 300 8 C 350 8 400 76 450 76 C 500 76 550 8 600 8 C 650 8 700 76 750 76 C 800 76 850 8 900 8 C 950 8 1000 76 1050 76 C 1100 76 1150 8 1200 8"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="1.5"
        fill="none"
      />
      {/* 32 Bulbs along curve */}
      {STRING_LIGHTS_BULBS.map((b) => (
        <g key={b.id}>
          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 4} stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          {/* Halo */}
          <circle
            cx={b.x}
            cy={b.y + 7}
            r="11"
            fill={b.color}
            opacity="0.22"
          />
          {/* Bulb */}
          <circle
            cx={b.x}
            cy={b.y + 7}
            r="4.6"
            fill={b.color}
            className="diwali-twinkle"
            style={{ animationDelay: `${b.delay}s` }}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Diya component with preserved click bloom, sparks, and flame flicker.
 * Signature visual behavior strictly preserved per instructions.
 */
function DiyaButton({
  index,
  step,
  isLit,
  onClick,
}: {
  index: number;
  step: (typeof DIYA_STEPS)[number];
  isLit: boolean;
  onClick: () => void;
}) {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((c) => c + 1);
    onClick();
  };

  const delay = (index * 0.35).toFixed(2);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isLit ? `Put out the diya: ${step.name}` : `Light the diya: ${step.name}`}
      aria-pressed={isLit}
      className="diwali-diya-button group relative z-0 flex shrink-0 flex-col items-center justify-start rounded-xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd36b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c2a5c]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span className="diwali-diya-visual relative flex shrink-0 items-center justify-center">
        {/* Soft Radial Halo (Signature bloom effect - PROTECTED) */}
        <div
          className={`diwali-bloom pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${isLit ? 'diwali-bloom-lit' : ''}`}
          aria-hidden="true"
        />

        {/* Sparks flying on boost (Signature spark burst - PROTECTED) */}
        {isLit && (
          <div
            key={clickCount}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            {SPARKS.map((s, si) => (
              <span
                key={si}
                className="diwali-spark absolute h-1.5 w-1.5 rounded-full bg-[#ffd36b] shadow-[0_0_6px_#ffd36b]"
                style={
                  {
                    '--dx': `${s.dx}px`,
                    '--dy': `${s.dy}px`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        )}

        {/* Diya SVG */}
        <svg viewBox="0 0 58 62" className="h-full w-full overflow-visible" aria-hidden="true">
          <defs>
            <linearGradient id={`diyaFlame-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff3c4" />
              <stop offset="50%" stopColor="#fec40d" />
              <stop offset="100%" stopColor="#f58020" />
            </linearGradient>
            <linearGradient id={`diyaClay-${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f58020" />
              <stop offset="100%" stopColor="#a8460f" />
            </linearGradient>
          </defs>

          {/* Flame with flicker and boost glow filter */}
          <g
            className={`diwali-flame ${isLit ? 'diwali-flame-flicker' : ''}`}
            style={{
              opacity: isLit ? 1 : 0,
              transition: 'opacity 250ms ease',
              transformOrigin: '29px 36px',
              animationDelay: `${delay}s`,
              filter: isLit
                ? 'drop-shadow(0 0 8px rgba(254, 196, 13, 0.95)) drop-shadow(0 0 14px rgba(245, 128, 32, 0.8))'
                : 'none',
            }}
          >
            {/* Outer flame */}
            <path
              d="M 29 10 C 25.5 17 21 23 21 28.5 C 21 33.2 24.6 36.5 29 36.5 C 33.4 36.5 37 33.2 37 28.5 C 37 23 32.5 17 29 10 Z"
              fill={`url(#diyaFlame-${index})`}
            />
            {/* Inner bright core */}
            <path
              d="M 29 16 C 27 20.5 24 24 24 28 C 24 31 26.2 33.5 29 33.5 C 31.8 33.5 34 31 34 28 C 34 24 31 20.5 29 16 Z"
              fill="#ffffff"
              opacity="0.8"
            />
          </g>

          {/* Clay Bowl */}
          <path d="M 10 37 C 12 51 20 57 29 57 C 38 57 46 51 48 37 Z" fill={`url(#diyaClay-${index})`} />
          {/* Darker Rim Ellipse */}
          <ellipse cx="29" cy="37" rx="19" ry="4.5" fill="#c4560f" />
          {/* Wick */}
          <path d="M 29 37 L 29 33" stroke="#3b1704" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>

      <span
        className={`diwali-diya-label mt-1 h-4 whitespace-nowrap text-[12.5px] leading-4 ${
          isLit ? 'lit font-bold text-white' : 'font-semibold text-white/80'
        }`}
        aria-hidden="true"
      >
        {step.name}
      </span>
    </button>
  );
}

/**
 * Placement Desk Product Preview Mockup.
 * Features 14px body text, 16px semibold title, 92% match badge, and a 4-step progress timeline.
 */
function ProductMockup({ shift }: { shift: { x: number; y: number } }) {
  return (
    <div
      className="diwali-mockup-column relative mx-auto flex w-full max-w-[500px] flex-col items-center justify-start"
      role="region"
      aria-label="Interactive preview of Shortlisted AI virtual placement desk"
    >
      {/* Main dashboard window card with 8px translucent ring */}
      <div
        className="relative w-full overflow-hidden rounded-[20px] bg-white shadow-[0_28px_60px_rgba(11,27,51,0.28)] ring-8 ring-white/10 transition-transform duration-200 ease-out"
        style={{ transform: `translate(${shift.x * 0.35}px, ${shift.y * 0.35}px)` }}
      >
        {/* Window title bar */}
        <div className="flex flex-wrap items-center justify-between gap-x-1 gap-y-1 border-b border-[#E5EAF2] bg-[#F7F9FC] px-2 py-2.5 min-[480px]:flex-nowrap min-[480px]:px-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5 min-[480px]:flex-nowrap">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d64246]/80" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fec40d]" aria-hidden="true" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#098855]" aria-hidden="true" />
            <span className="ml-1 whitespace-nowrap text-[10px] font-semibold tracking-wide text-[#5B6B82] min-[480px]:ml-2 min-[480px]:text-xs sm:text-sm">
              shortlisted.desk
            </span>
            <span className="ml-2 rounded-full border border-[#E5EAF2] bg-white px-2 py-0.5 text-[10px] font-bold text-[#5B6B82] sm:text-xs">
              Sample preview
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#098855]/15 px-2 py-0.5 text-[10px] font-bold text-[#08734a] sm:px-2.5 sm:text-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#098855]" aria-hidden="true" /> Live Batch
          </span>
        </div>

        {/* Window interior */}
        <div className="flex">
          {/* Mini sidebar */}
          <div className="hidden w-14 flex-col items-center gap-3 border-r border-[#E5EAF2] bg-[#F7F9FC] py-4 min-[480px]:flex sm:w-16">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#1b52a4] text-white shadow-sm">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="mt-1 flex flex-col items-center gap-2.5">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#00a2e5]/15 text-[#00a2e5]">
                <Briefcase className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#5B6B82]/10 text-[#5B6B82]">
                <UserRound className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#5B6B82]/10 text-[#5B6B82]">
                <Users className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
            <div className="mt-auto h-2 w-6 rounded-full bg-[#E5EAF2]" aria-hidden="true" />
          </div>

          {/* Mini main panel */}
          <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4.5">
            {/* Top row: Profile completion status */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5B6B82] sm:text-sm">Placement Desk</p>
                <p className="text-base font-bold text-[#0B1B33] sm:text-[17px]">Cohort Dashboard</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] px-3 py-1.5">
                <div className="relative grid h-12 w-12 place-items-center sm:h-13 sm:w-13">
                  <svg viewBox="0 0 56 56" className="h-12 w-12 -rotate-90 sm:h-13 sm:w-13" aria-hidden="true">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#E5EAF2" strokeWidth="4" />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#098855"
                      strokeWidth="4"
                      strokeDasharray="138 138"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-[#08734a]">100%</span>
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-semibold leading-none text-[#5B6B82] sm:text-sm">Profile</p>
                  <p className="mt-0.5 text-xs font-bold leading-tight text-[#08734a] sm:text-sm">Ready</p>
                </div>
              </div>
            </div>

            {/* Matched Job Row (16px semibold job title, 92% match badge) */}
            <div className="my-2 rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3 transition hover:border-[#00a2e5]/50">
              <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#00a2e5]/15 text-[#00a2e5]">
                    <Briefcase className="h-4.5 w-4.5" strokeWidth={2} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-[15px] font-semibold text-[#0B1B33] sm:text-[16px]">
                        Software Engineer
                      </p>
                      <span className="rounded bg-[#098855]/15 px-2 py-0.5 text-[11px] font-bold text-[#08734a] sm:text-sm">
                        92% match
                      </span>
                    </div>
                    <p className="truncate text-[13px] font-medium text-[#5B6B82] sm:text-sm">
                      Batch role • Matched for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Chip & Coordinator row */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E5EAF2] pt-2.5">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[#fec40d]/40 bg-[#fec40d]/25 px-2.5 py-1 text-xs font-bold text-[#1b52a4]">
                <Calendar className="h-3.5 w-3.5 text-[#f58020]" strokeWidth={2} aria-hidden="true" />
                Round 1 Scheduled
              </div>
              <span className="text-xs font-medium text-[#5B6B82]">1 Coordinator assigned</span>
            </div>
          </div>
        </div>

        {/* 4-Step Progress Timeline: Profile ✓ -> Assessment ✓ -> Interview (current, pulse) -> Offer */}
        <div className="border-t border-[#E5EAF2] bg-[#F7F9FC]/90 px-4 py-2.5 pb-4">
          <p className="sr-only">
            Placement journey progress: Profile completed, Assessment completed, Interview current, Offer upcoming.
          </p>
          <div className="flex items-center justify-between text-[11px] sm:text-sm" aria-hidden="true">
            {/* Step 1: Profile */}
            <div className="flex items-center gap-1 font-semibold text-[#08734a]">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#098855] text-white">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>Profile</span>
            </div>
            <span className="h-0.5 w-4 bg-[#098855]/40 sm:w-6" />

            {/* Step 2: Assessment */}
            <div className="flex items-center gap-1 font-semibold text-[#08734a]">
              <span className="grid h-4 w-4 place-items-center rounded-full bg-[#098855] text-white">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
              </span>
              <span>Assessment</span>
            </div>
            <span className="h-0.5 w-4 bg-[#f58020]/40 sm:w-6" />

            {/* Step 3: Interview (current, highlighted, subtle pulse) */}
            <div className="flex items-center gap-1.5 font-bold text-[#1b52a4]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f58020] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#f58020]" />
              </span>
              <span className="rounded bg-[#fec40d]/30 px-1.5 py-0.5 text-[10px] font-extrabold text-[#1b52a4] sm:text-sm">
                Interview
              </span>
            </div>
            <span className="h-0.5 w-4 bg-[#E5EAF2] sm:w-6" />

            {/* Step 4: Offer */}
            <div className="flex items-center gap-1 font-medium text-[#5B6B82]/70">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-[#5B6B82]/40" />
              <span>Offer</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Floating Chips anchored snugly touching/overlapping card edges (-12px to -24px offset) */}
      {/* 1. "Assessment completed" (above top-left) */}
      <div
        className="pointer-events-none absolute -top-14 left-2 z-20 hidden sm:flex sm:left-4"
        style={{ transform: `translateX(${shift.x * 0.3}px)` }}
        aria-hidden="true"
      >
        <div className="sl-float flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-3.5 py-1.5 text-xs font-bold text-[#0B1B33] shadow-[0_12px_28px_rgba(9,136,85,0.2)] backdrop-blur-sm">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#098855] text-white">
            <Check className="h-3.5 w-3.5 stroke-[2.5]" aria-hidden="true" />
          </span>
          Assessment completed
        </div>
      </div>

      {/* Bottom chips touch the outer card edge and stay below its content. */}
      <div className="pointer-events-none relative z-20 mt-5 hidden w-full items-start justify-between px-2 sm:flex" aria-hidden="true">
        <div style={{ transform: `translateX(${shift.x * 0.25}px)` }}>
          <div className="sl-float flex items-center gap-2 rounded-2xl border border-[#fec40d] bg-[#fec40d] px-3.5 py-1.5 text-xs font-bold text-[#1b52a4] shadow-[0_12px_28px_rgba(254,196,13,0.3)] backdrop-blur-sm [animation-delay:2400ms]">
            <Calendar className="h-3.5 w-3.5 stroke-[2.2] text-[#f58020]" aria-hidden="true" />
            Interview scheduled
          </div>
        </div>
        <div style={{ transform: `translateX(${-shift.x * 0.3}px)` }}>
          <div className="sl-float flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-3.5 py-1.5 text-xs font-bold text-[#0B1B33] shadow-[0_12px_28px_rgba(0,162,229,0.22)] backdrop-blur-sm [animation-delay:1200ms]">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#00a2e5] text-white">
              <Briefcase className="h-3 w-3 stroke-[2.5]" aria-hidden="true" />
            </span>
            Job matched
          </div>
        </div>
      </div>

      {/* Compact row on mobile to prevent overflow (< 640px) */}
      <div className="pointer-events-none mt-3 flex flex-wrap justify-center gap-2 sm:hidden" aria-hidden="true">
        <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-[#071936]/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
          <Check className="h-3 w-3 text-[#098855]" aria-hidden="true" /> Assessment completed
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-white/40 bg-[#071936]/60 px-2.5 py-0.5 text-[11px] font-bold text-white backdrop-blur-sm">
          <Briefcase className="h-3 w-3 text-[#00a2e5]" aria-hidden="true" /> Job matched
        </span>
        <span className="inline-flex items-center gap-1 rounded-full border border-[#fec40d]/60 bg-[#071936]/60 px-2.5 py-0.5 text-[11px] font-bold text-[#ffd36b] backdrop-blur-sm">
          <Calendar className="h-3 w-3 text-[#f58020]" aria-hidden="true" /> Interview scheduled
        </span>
      </div>
    </div>
  );
}

export function DiwaliHero() {
  const { trialHref, dashboardHref, hideTrialPromos, ready, batch, batchLoading } = useHome();
  const primary = hideTrialPromos ? dashboardHref : trialHref;
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [statsInView, setStatsInView] = useState(false);
  const [isAmbientActive, setIsAmbientActive] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Live seats availability helper
  const seatsAvailability = getSeatsAvailability(batch, batchLoading);
  const seatsTarget = seatsAvailability.status === 'available' ? seatsAvailability.seats : null;
  const seatsShown = useCountUp(seatsTarget, statsInView && !batchLoading);

  // Keep the toggle state and its announcement in one update so rapid clicks cannot use stale state.
  const [diyaState, setDiyaState] = useState({
    lit: [false, false, false, false, false],
    announcement: '',
  });
  const { lit: litDiyas, announcement: liveAnnouncement } = diyaState;

  const litCount = litDiyas.filter(Boolean).length;
  const allLit = litCount === 5;

  const handleDiyaClick = (index: number) => {
    setDiyaState((current) => {
      const next = [...current.lit];
      next[index] = !next[index];
      const nextCount = next.filter(Boolean).length;
      const wasComplete = current.lit.every(Boolean);
      return {
        lit: next,
        announcement: nextCount === 5 && !wasComplete ? 'Your career journey is lit.' : '',
      };
    });
  };

  // Pause ambient animations when tab is hidden or hero is offscreen
  useEffect(() => {
    const handleVisibility = () => {
      setIsAmbientActive(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const node = heroRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAmbientActive(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0.1 },
    );
    observer.observe(node);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
    };
  }, []);

  // Intersection observer for stats count-up trigger
  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsInView(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="diwali-hero-section flex min-h-[calc(100svh_-_72px)] w-full items-center scroll-mt-[88px] bg-[#F7F9FC] px-4 py-4 sm:px-6"
    >
      {/* Scoped CSS for Diwali Animations, Ambient Pausing & Reduced Motion */}
      <style jsx global>{`
        @keyframes diwali-twinkle {
          0%, 100% {
            opacity: 0.85;
          }
          50% {
            opacity: 1;
          }
        }
        @keyframes diwali-gold-dust {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-420px);
            opacity: 0;
          }
        }
        @keyframes diwali-flame-flicker {
          0% {
            transform: scale(1) rotate(-1.8deg);
          }
          50% {
            transform: scale(1.08, 0.94) rotate(1.8deg);
          }
          100% {
            transform: scale(0.96, 1.05) rotate(-1.2deg);
          }
        }
        @keyframes diwali-spark {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(0.2);
            opacity: 0;
          }
        }
        @keyframes diwali-success-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 211, 107, 0); }
          50% { box-shadow: 0 0 22px rgba(255, 211, 107, 0.38); }
        }
        @media (min-width: 1024px) and (max-height: 800px) {
          .diwali-hero-section {
            padding-block: 0.5rem !important;
          }
          .diwali-headline {
            font-size: clamp(1.75rem, 3.4vw, 2.75rem) !important;
          }
          .diwali-hero-content { row-gap: 0.75rem !important; }
          .diwali-subhead {
            font-size: 15px !important;
          }
        }
        .diwali-bloom {
          width: 0;
          height: 0;
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.96);
          background: radial-gradient(circle, rgba(255, 211, 107, 0.78) 0%, rgba(245, 128, 32, 0.32) 50%, transparent 75%);
          transition: width 300ms ease, height 300ms ease, opacity 300ms ease, transform 300ms ease;
        }
        .diwali-bloom-lit {
          width: 62px;
          height: 62px;
          opacity: 0.9;
          transform: translate(-50%, -50%) scale(1);
        }
        .diwali-journey-strip {
          grid-template-columns: minmax(200px, 1fr) auto minmax(200px, 1fr);
          margin: 24px 48px 28px;
          padding: 16px 24px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 22px;
          background-color: rgba(7, 25, 54, 0.35);
          background-image: linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08));
        }
        .diwali-journey-strip .diwali-diya-button {
          width: 64px;
          min-height: 80px;
        }
        .diwali-journey-strip .diwali-diya-visual {
          width: 48px;
          height: 52px;
        }
        .diwali-journey-strip .diwali-diya-row { gap: 28px; }
        .diwali-journey-strip .diwali-diya-label {
          margin-top: 4px;
          font-size: 12.5px;
          font-weight: 600;
          line-height: 16px;
          color: rgba(255, 255, 255, 0.82);
        }
        .diwali-journey-strip .diwali-diya-label.lit { color: #ffffff; font-weight: 700; }
        .diwali-twinkle {
          animation: diwali-twinkle 3s ease-in-out infinite;
        }
        .diwali-gold-dust {
          animation: diwali-gold-dust 12s linear infinite;
        }
        .diwali-flame-flicker {
          animation: diwali-flame-flicker 1.7s ease-in-out infinite alternate;
        }
        .diwali-spark {
          animation: diwali-spark 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }
        .diwali-success-pulse {
          animation: diwali-success-glow 1.4s ease-in-out 1;
        }
        .ambient-paused .diwali-twinkle,
        .ambient-paused .diwali-gold-dust,
        .ambient-paused .sl-float {
          animation-play-state: paused !important;
        }
        .diwali-diya-button:focus:not(:focus-visible) {
          outline: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .diwali-twinkle,
          .diwali-gold-dust,
          .diwali-flame-flicker,
          .diwali-spark,
          .diwali-diya-button,
          .sl-float,
          .animate-pulse,
          .animate-ping {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          .diwali-spark {
            display: none !important;
          }
          .diwali-success-pulse {
            animation: none !important;
          }
          .diwali-flame {
            transition: none !important;
          }
          .diwali-bloom-lit {
            opacity: 0.7 !important;
            transform: translate(-50%, -50%) scale(1) !important;
            transition: none !important;
          }
          .diwali-bloom { transition: none !important; }
        }
        @media (max-width: 1100px) {
          .diwali-journey-strip { margin-right: 24px; margin-left: 24px; padding-right: 16px; padding-left: 16px; }
        }
        @media (max-width: 1023px) {
          .diwali-journey-strip { grid-template-columns: minmax(0, 1fr); row-gap: 16px; margin-right: 16px; margin-left: 16px; }
          .diwali-journey-strip .diwali-diya-row { justify-content: center; gap: 12px; }
          .diwali-journey-strip .diwali-diya-button { width: 52px; min-height: 68px; }
          .diwali-journey-strip .diwali-diya-visual { width: 40px; height: 44px; }
          .diwali-journey-strip .diwali-diya-label { font-size: 11px; line-height: 14px; }
          .diwali-journey-status { width: 100%; justify-content: center; }
          .diwali-journey-status > :is(span, a) { width: 100%; }
          .diwali-bloom-lit { width: 52px; height: 52px; }
        }
        @media (max-width: 480px) {
          .diwali-journey-strip { margin-right: 12px; margin-left: 12px; padding: 12px; }
          .diwali-journey-strip .diwali-diya-row { gap: 6px; }
          .diwali-journey-strip .diwali-diya-button { width: 50px; }
          .diwali-journey-strip .diwali-diya-visual { width: 36px; height: 40px; }
          .diwali-bloom-lit { width: 47px; height: 47px; }
        }
      `}</style>

      {/* Screen reader live announcement for progressive diya lighting */}
      <div className="sr-only" aria-live="polite" role="status">
        {liveAnnouncement}
      </div>

      {/* Main Diwali Hero Panel */}
      <div
        className={`relative mx-auto flex w-full max-w-[1200px] flex-col overflow-visible rounded-[28px] text-white shadow-[0_24px_60px_-24px_rgba(12,42,92,0.55)] ${
          isAmbientActive ? '' : 'ambient-paused'
        }`}
        style={{ background: 'linear-gradient(135deg, #0c2a5c 0%, #1b52a4 58%, #1479c4 100%)' }}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setShift({
            x: (event.clientX - rect.left - rect.width / 2) / 25,
            y: (event.clientY - rect.top - rect.height / 2) / 25,
          });
        }}
        onMouseLeave={() => setShift({ x: 0, y: 0 })}
      >
        {/* String Lights along top border */}
        <StringLights />

        {/* Atmospheric Overlays */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          {/* Radial glow from bottom-left */}
          <div
            className="absolute -bottom-24 -left-20 h-[520px] w-[520px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(245,128,32,0.55) 0%, rgba(245,128,32,0.2) 42%, transparent 62%)',
              filter: 'blur(32px)',
            }}
          />
          {/* Small yellow glow at top-right */}
          <div
            className="absolute -right-16 -top-16 h-80 w-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(254,196,13,0.22) 0%, transparent 70%)',
              filter: 'blur(28px)',
            }}
          />
          {/* Faint white dot grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Gold Dust Particles (capped to <= 20 desktop, <= 8 mobile) */}
          {GOLD_DUST.map((p, i) => (
            <div
              key={i}
              className={`diwali-gold-dust absolute rounded-full bg-[#ffd36b] ${p.desktopOnly ? 'hidden md:block' : ''}`}
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                bottom: p.bottom,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        {/* Content grid: columns share a top edge; the right preview aligns with the badge. */}
        <div className="diwali-hero-content relative z-10 grid min-w-0 grid-cols-[minmax(0,1fr)] items-center gap-6 px-6 pt-[72px] sm:px-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Left Column Content:
              Visual Hierarchy: pill -> headline -> subhead -> greeting -> CTAs -> trust chips */}
          <div className="diwali-copy min-w-0">
            {/* 1. Badge Pill: "Happy Diwali 2026" */}
            <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-[#071936]/40 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#ffd36b] shadow-[0_0_8px_#ffd36b]" aria-hidden="true" />
              Happy Diwali 2026
            </span>

            {/* 2. Headline */}
            <h1
              className="diwali-headline mt-3 font-extrabold leading-[1.06] tracking-tight text-white"
              style={{
                fontFamily: 'var(--font-home-display), Inter, sans-serif',
                fontSize: 'clamp(2rem, 4.8vw, 3.5rem)',
                letterSpacing: '-0.03em',
                maxWidth: '15ch',
              }}
            >
              Light up your career{' '}
              <span className="text-[#ffd36b] drop-shadow-[0_2px_12px_rgba(255,211,107,0.35)]">
                this Diwali.
              </span>
            </h1>

            {/* 3. One-line subheadline; keep hero messaging focused on placements. */}
            <p className="diwali-subhead mt-4 max-w-lg text-[15px] leading-relaxed text-white sm:text-[17px]">
              Sign in free, then subscribe once for AI-matched jobs and a dedicated coordinator.
            </p>

            <p className="mt-3 border-l-[3px] border-[#ffd36b] py-0.5 pl-3 text-[14px] leading-relaxed text-white/[0.78]">
              Wishing you a bright and prosperous Diwali from Team Shortlisted.
            </p>

            {/* 4. CTAs */}
            <div className="diwali-cta-row mt-6 flex flex-wrap items-center gap-3">
              {ready && (
                <PrimaryLink
                  href={primary}
                  className="bg-gradient-to-r from-[#f58020] to-[#fec40d] font-bold text-[#0B1B33] focus-visible:outline-white shadow-[0_12px_28px_rgba(245,128,32,0.5),0_0_24px_rgba(245,128,32,0.4)] transition hover:from-[#f58020] hover:to-[#ffd36b] hover:shadow-[0_16px_36px_rgba(245,128,32,0.65)]"
                >
                  {hideTrialPromos ? 'Go to dashboard' : ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </PrimaryLink>
              )}
              <Link
                href="#journey"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 bg-[#071936]/40 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#071936]/60 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                See how it works
              </Link>
            </div>

            {/* 5. Brand Trust Chips */}
            <div className="diwali-trust-row relative z-10 mt-5 flex flex-wrap items-center gap-2 text-xs text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#071936]/40 px-3 py-1 font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fec40d]" aria-hidden="true" /> Batch of 12
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#071936]/40 px-3 py-1 font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00a2e5]" aria-hidden="true" /> Dedicated coordinator
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-[#071936]/40 px-3 py-1 font-medium backdrop-blur-sm">
                <span className="rounded-full bg-[#098855] px-1.5 py-0.5 text-[11px] font-bold uppercase leading-none text-white">
                  AI
                </span>{' '}
                Matched jobs
              </span>
            </div>

          </div>

          {/* Right Column: Product Preview Mockup */}
          <ProductMockup shift={shift} />
        </div>

        <div className="diwali-journey-strip grid items-center gap-4 overflow-hidden backdrop-blur-md">
          <div className="flex min-h-[52px] flex-col justify-center gap-1">
            <p className="text-[15px] font-bold leading-tight text-white">
              {allLit ? 'Your career journey is lit.' : 'Light the 5 diyas of your journey'}
            </p>
            <p className="text-[13px] leading-tight text-white/90">
              {allLit ? 'Seats are limited per batch.' : 'Tap each diya'}
            </p>
          </div>

          <div className="diwali-diya-row flex items-center justify-center gap-7" role="group" aria-label="Five journey diyas">
            {DIYA_STEPS.map((step, index) => (
              <DiyaButton
                key={step.id}
                index={index}
                step={step}
                isLit={litDiyas[index]}
                onClick={() => handleDiyaClick(index)}
              />
            ))}
          </div>

          <div className="diwali-journey-status flex h-11 min-w-[200px] items-center justify-end">
            {allLit ? (
              <Link
                href="/auth/register"
                className="inline-flex h-11 min-w-[200px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f58020] to-[#fec40d] px-5 text-sm font-bold text-[#0B1B33] shadow-[0_12px_28px_rgba(245,128,32,0.5),0_0_24px_rgba(245,128,32,0.4)] transition hover:from-[#f58020] hover:to-[#ffd36b] hover:shadow-[0_16px_36px_rgba(245,128,32,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd36b] diwali-success-pulse"
              >
                Claim your seat <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <span className="inline-flex h-11 min-w-[100px] items-center justify-center rounded-full border border-white/30 bg-[#071936]/35 px-4 text-sm font-semibold text-white">
                {litCount} of 5 lit
              </span>
            )}
          </div>
        </div>

        {/* Translucent stats bar:
            High contrast WCAG AA background (bg-[#071936]/80), dividers, tabular numerals */}
        <div
          ref={statsRef}
          className="relative z-10 shrink-0 border-t border-white/20 bg-[#071936]/80 px-6 py-4 backdrop-blur-md sm:px-10"
        >
          <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {/* Stat 1: Students per batch */}
            <div className="text-center sm:text-left">
              <dt className="sr-only">Students per batch</dt>
              <dd className="inline-block min-w-[3ch] text-center text-[26px] font-extrabold leading-tight tracking-tight text-white tabular-nums sm:text-left">
                12
              </dd>
              <p className="mt-0.5 text-[13px] font-medium text-white/95">Students per batch</p>
            </div>

            {/* Stat 2: Seats open (Live availability sourced with skeleton & fallback states) */}
            <div className="text-center sm:text-left even:border-l even:border-white/20 even:pl-3 lg:border-l lg:pl-6">
              <dt className="sr-only">Seats open</dt>
              {seatsAvailability.status === 'loading' ? (
                <div className="flex flex-col items-center sm:items-start">
                  <div className="h-7 w-[3ch] animate-pulse rounded bg-white/20" />
                  <p className="mt-1 text-[13px] font-medium text-white/95">Checking availability...</p>
                </div>
              ) : seatsAvailability.status === 'available' ? (
                <>
                  <dd className="inline-block min-w-[3ch] text-center text-[26px] font-extrabold leading-tight tracking-tight text-white tabular-nums sm:text-left">
                    {seatsShown}
                  </dd>
                  <p className="mt-0.5 text-[13px] font-medium text-white/95">Seats open</p>
                </>
              ) : (
                <>
                  <dd className="text-[22px] sm:text-[26px] font-extrabold leading-tight tracking-tight text-[#ffd36b]">
                    Limited seats
                  </dd>
                  <p className="mt-0.5 text-[13px] font-medium text-white/95">Seats open</p>
                </>
              )}
            </div>

            {/* Stat 3: 24/7 Virtual placement desk
                NOTE: Replaced previous "60-day Placement journey" with "24/7 Virtual placement desk"
                per Phase 1.6 requirement. Needs product confirmation if this differed from legacy production site. */}
            <div className="border-t border-white/20 pt-4 text-center sm:text-left even:border-l even:pl-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <dt className="sr-only">Virtual placement desk</dt>
              <dd className="text-[26px] font-extrabold leading-tight tracking-tight text-white tabular-nums">
                24/7
              </dd>
              <p className="mt-0.5 text-[13px] font-medium text-white/95">Virtual placement desk</p>
            </div>

            {/* Stat 4: Coordinator */}
            <div className="border-t border-white/20 pt-4 text-center sm:text-left even:border-l even:pl-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <dt className="sr-only">Coordinator</dt>
              <dd className="text-[26px] font-extrabold leading-tight tracking-tight text-white tabular-nums">
                1
              </dd>
              <p className="mt-0.5 text-[13px] font-medium text-white/95">Coordinator</p>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default DiwaliHero;
