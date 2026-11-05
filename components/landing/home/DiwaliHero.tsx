'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ctaLabel } from '@/lib/home/content';
import { useTranslation } from '@/lib/i18n/context';
import { useHome, type BatchInfo } from './HomeProvider';
import { CohortCard } from './CohortCard';
import { PrimaryLink } from './primitives';

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
  if (!batch || batch.seats_remaining == null || !Number.isFinite(batch.seats_remaining)) {
    // Fallback state when backend batch API is offline or returns empty
    return { status: 'fallback', text: 'Limited seats' };
  }
  const maxSeats = typeof batch.max_seats === 'number' && Number.isFinite(batch.max_seats)
    ? Math.max(0, Math.trunc(batch.max_seats))
    : null;
  const seats = Math.max(0, Math.trunc(batch.seats_remaining));
  const openSeats = maxSeats === null ? seats : Math.min(maxSeats, seats);
  return {
    status: 'available',
    seats: openSeats,
    text: String(openSeats),
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

const DIWALI_STREAMERS = [
  { side: 'left', top: '22%', color: 'var(--brand-yellow)', width: 6, height: 34, delay: 0, duration: 1700, drop: 46, startAngle: -28, endAngle: 114 },
  { side: 'left', top: '38%', color: 'var(--brand-orange)', width: 7, height: 40, delay: 90, duration: 1850, drop: 68, startAngle: 34, endAngle: 192 },
  { side: 'left', top: '57%', color: '#fff3c4', width: 5, height: 30, delay: 180, duration: 1600, drop: 38, startAngle: -18, endAngle: 136 },
  { side: 'left', top: '72%', color: 'var(--brand-yellow)', width: 7, height: 38, delay: 270, duration: 1900, drop: 56, startAngle: 22, endAngle: 174 },
  { side: 'right', top: '24%', color: 'var(--brand-orange)', width: 7, height: 38, delay: 45, duration: 1800, drop: 52, startAngle: 26, endAngle: 176 },
  { side: 'right', top: '42%', color: 'var(--brand-yellow)', width: 5, height: 30, delay: 135, duration: 1650, drop: 40, startAngle: -24, endAngle: 126 },
  { side: 'right', top: '60%', color: '#fff3c4', width: 7, height: 40, delay: 225, duration: 1900, drop: 70, startAngle: 30, endAngle: 188 },
  { side: 'right', top: '76%', color: 'var(--brand-orange)', width: 6, height: 34, delay: 315, duration: 1750, drop: 48, startAngle: -20, endAngle: 144 },
] as const;

const DIWALI_CRACKER_BURSTS = [
  { side: 'left', left: '8%', top: '38%', color: 'var(--brand-yellow)', delay: 120 },
  { side: 'right', left: '92%', top: '34%', color: 'var(--brand-orange)', delay: 390 },
  { side: 'left', left: '15%', top: '70%', color: 'var(--brand-orange)', delay: 660 },
  { side: 'right', left: '85%', top: '68%', color: 'var(--brand-yellow)', delay: 930 },
  { side: 'center', left: '50%', top: '26%', color: 'var(--brand-orange)', delay: 1200 },
] as const;

const DIWALI_CRACKER_SPARKS = Array.from({ length: 16 }, (_, index) => {
  const angle = (index * 360) / 16;
  const radians = (angle * Math.PI) / 180;
  const distance = 58 + ((index * 13) % 35);

  return {
    dx: Math.round(Math.cos(radians) * distance),
    dy: Math.round(Math.sin(radians) * distance),
    angle: angle + 90,
  };
});

// String lights: four continuous swags with horizontal tangents at each join.
const BULB_COLORS = [
  'var(--warm-white)',
  'var(--yellow)',
  'var(--orange)',
  'var(--yellow)',
];
const STRING_LIGHTS_BULBS = Array.from({ length: 4 }).flatMap((_, swagIdx) => {
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
    const y = Math.round(
      half === 0
        ? bezier(startY, startY, 76, 76, localT) * 10
        : bezier(76, 76, endY, endY, localT) * 10,
    ) / 10;
    const globalIdx = swagIdx * 8 + bulbIdx;
    const color = BULB_COLORS[globalIdx % BULB_COLORS.length];
    const delay = -Number(((globalIdx * 0.21) % 2.7).toFixed(2));
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
      className="pointer-events-none absolute left-0 top-0 z-0 h-[72px] w-full overflow-visible sm:h-[92px]"
      style={{
        transform: 'translateY(-22px) scaleY(0.55)',
        transformOrigin: 'top',
        '--warm-white': '#fff3c4',
        '--yellow': 'var(--brand-yellow)',
        '--orange': 'var(--brand-orange)',
        '--socket': '#302315',
      } as CSSProperties}
      aria-hidden="true"
    >
      <defs>
        {STRING_LIGHTS_BULBS.map((b) => (
          <radialGradient key={`bulb-gradient-${b.id}`} id={`bulb-gradient-${b.id}`} cx="34%" cy="28%" r="76%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="24%" stopColor="var(--warm-white)" />
            <stop offset="58%" stopColor={b.color} />
            <stop offset="100%" stopColor={b.color} />
          </radialGradient>
        ))}
      </defs>
      {/* Four cubic swags meet with matching horizontal tangents. */}
      <path
        d="M 18 14 C 66.5 14 115 76 163.5 76 C 212 76 260.5 8 309 8 C 357.5 8 406 76 454.5 76 C 503 76 551.5 8 600 8 C 648.5 8 697 76 745.5 76 C 794 76 842.5 8 891 8 C 939.5 8 988 76 1036.5 76 C 1085 76 1133.5 14 1182 14"
        stroke="rgba(3,18,24,0.92)"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M 18 14 C 66.5 14 115 76 163.5 76 C 212 76 260.5 8 309 8 C 357.5 8 406 76 454.5 76 C 503 76 551.5 8 600 8 C 648.5 8 697 76 745.5 76 C 794 76 842.5 8 891 8 C 939.5 8 988 76 1036.5 76 C 1085 76 1133.5 14 1182 14"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.45"
        fill="none"
      />
      {/* The original 32 bulb positions and swags are preserved. */}
      {STRING_LIGHTS_BULBS.map((b) => (
        <g
          key={b.id}
          transform={`translate(${b.x} ${b.y}) scale(0.8) translate(${-b.x} ${-b.y})`}
          style={{ '--light-color': b.color, '--light-delay': `${b.delay}s` } as CSSProperties}
        >
          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 4} stroke="rgba(35,25,14,0.92)" strokeWidth="1.5" />
          <rect x={b.x - 3} y={b.y + 2} width="6" height="5" rx="1.4" fill="var(--socket)" />
          <ellipse
            cx={b.x}
            cy={b.y + 18}
            rx="12"
            ry="17"
            fill={b.color}
            opacity="0.24"
            className="diwali-light-halo"
          />
          <g className="diwali-twinkle">
            <path
              d={`M ${b.x} ${b.y + 3} C ${b.x + 1.6} ${b.y + 9}, ${b.x + 6} ${b.y + 17}, ${b.x + 6} ${b.y + 22} C ${b.x + 6} ${b.y + 29}, ${b.x + 3} ${b.y + 33}, ${b.x} ${b.y + 33} C ${b.x - 3} ${b.y + 33}, ${b.x - 6} ${b.y + 29}, ${b.x - 6} ${b.y + 22} C ${b.x - 6} ${b.y + 17}, ${b.x - 1.6} ${b.y + 9}, ${b.x} ${b.y + 3} Z`}
              fill={`url(#bulb-gradient-${b.id})`}
              stroke={b.color}
              strokeWidth="0.8"
              className="diwali-light-bulb"
            />
          </g>
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
  isOpening,
  onClick,
}: {
  index: number;
  step: (typeof DIYA_STEPS)[number];
  isLit: boolean;
  isOpening: boolean;
  onClick: () => void;
}) {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((c) => c + 1);
    onClick();
  };

  const delay = `${index * 0.15}s`;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isLit ? `Put out the ${step.name} diya` : `Light the ${step.name} diya`}
      aria-pressed={isLit}
      className="diwali-diya-button group relative z-0 flex min-h-[44px] min-w-[44px] shrink-0 flex-col items-center justify-start rounded-xl p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd36b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c2a5c]"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span
        className={`diwali-diya-visual relative flex shrink-0 items-center justify-center ${isOpening && isLit ? 'diwali-opening-visual' : ''}`}
        style={{ '--diwali-light-delay': delay } as CSSProperties}
      >
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
              opacity: isLit ? 1 : 0.32,
              transform: isLit ? undefined : 'scale(0.72)',
              transition: 'opacity 250ms ease, transform 250ms ease, filter 250ms ease',
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

export function DiwaliHero() {
  const { t } = useTranslation();
  const { trialHref, dashboardHref, hideTrialPromos, ready, batch, batchLoading } = useHome();
  const primary = hideTrialPromos ? dashboardHref : trialHref;
  const [isAmbientActive, setIsAmbientActive] = useState(true);
  const heroRef = useRef<HTMLElement>(null);
  const [openingDiyas, setOpeningDiyas] = useState(true);

  // The card and stats bar both use this clamped value from the active-batch API.
  const seatsAvailability = getSeatsAvailability(batch, batchLoading);
  const availableSeatCount = seatsAvailability.status === 'available' ? seatsAvailability.seats : null;
  const batchCapacity = typeof batch?.max_seats === 'number' && Number.isFinite(batch.max_seats) && batch.max_seats > 0
    ? Math.trunc(batch.max_seats)
    : null;
  const virtualDeskValue = t('landing.stats.access.value');
  const coordinatorValue = t('landing.impact.stats.coordinator.value').match(/^\d+/)?.[0] ?? '—';

  const [litDiyas, setLitDiyas] = useState<boolean[]>([true, true, true, true, true]);

  const litCount = litDiyas.filter(Boolean).length;
  const allLit = litCount === 5;

  const handleDiyaClick = (index: number) => {
    setLitDiyas((current) => {
      const next = [...current];
      next[index] = !next[index];
      return next;
    });
  };

  useEffect(() => {
    const timeout = window.setTimeout(() => setOpeningDiyas(false), 1000);
    return () => window.clearTimeout(timeout);
  }, []);

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

  return (
    <section
      ref={heroRef}
      id="home"
      className="diwali-hero-section relative flex min-h-[600px] w-full flex-col justify-between scroll-mt-[88px] bg-[linear-gradient(135deg,#0c2a5c_0%,#1b52a4_58%,#1479c4_100%)] pt-[clamp(4px,1vh,16px)]"
    >
      {/* Scoped CSS for Diwali Animations, Ambient Pausing & Reduced Motion */}
      <style jsx global>{`
        @keyframes diwali-twinkle {
          0%, 100% { opacity: 0.8; filter: brightness(0.98); }
          50% { opacity: 1; filter: brightness(1.04); }
        }
        @keyframes diwali-halo-twinkle {
          0%, 100% { opacity: 0.16; }
          50% { opacity: 0.3; }
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
        @keyframes diwali-diya-opening {
          from { opacity: 0; }
          to { opacity: 1; }
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
        @keyframes diwali-streamer-burst {
          0% {
            opacity: 0;
            transform: translate3d(var(--streamer-start-x), -8px, 0) rotate(var(--streamer-start-angle)) scale(0.72);
          }
          14% { opacity: 0.96; }
          56% {
            opacity: 0.9;
            transform: translate3d(var(--streamer-end-x), var(--streamer-drop), 0) rotate(var(--streamer-end-angle)) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate3d(var(--streamer-end-x), calc(var(--streamer-drop) + 64px), 0) rotate(var(--streamer-end-angle)) scale(0.82);
          }
        }
        @keyframes diwali-cracker-flash {
          0% { opacity: 0; transform: scale(0.15); }
          14% { opacity: 0.95; transform: scale(1); }
          100% { opacity: 0; transform: scale(3.6); }
        }
        @keyframes diwali-cracker-launch {
          0% { opacity: 0; transform: translateY(var(--cracker-rise)) scaleY(0.35); }
          12% { opacity: 1; }
          78% { opacity: 0.95; }
          100% { opacity: 0; transform: translateY(0) scaleY(1); }
        }
        @keyframes diwali-cracker-spark {
          0% { opacity: 0; transform: translate(0, 0) rotate(var(--cracker-angle)) scale(0.3, 0.5); }
          14% { opacity: 1; }
          62% { opacity: 0.9; transform: translate(var(--cracker-dx), var(--cracker-dy)) rotate(var(--cracker-angle)) scale(0.75, 1); }
          100% { opacity: 0; transform: translate(var(--cracker-dx), calc(var(--cracker-dy) + 30px)) rotate(var(--cracker-angle)) scale(0.2, 0.5); }
        }
        @keyframes diwali-success-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(255, 211, 107, 0); }
          50% { box-shadow: 0 0 22px rgba(255, 211, 107, 0.38); }
        }
        @media (min-width: 1024px) and (max-height: 800px) {
          .diwali-hero-section {
            padding-top: clamp(4px, 1vh, 8px) !important;
          }
          .diwali-journey-strip { margin-block: clamp(8px, 1.5vh, 16px); padding-block: clamp(8px, 1.5vh, 12px); }
          .diwali-stats-bar { padding-top: 10px !important; padding-bottom: 12px !important; }
          .diwali-headline {
            font-size: clamp(1.75rem, 5.2vh, 2.75rem) !important;
          }
          .diwali-hero-content { row-gap: 0.75rem !important; }
          .diwali-inner-content { padding-top: clamp(8px, 1.8vh, 16px) !important; }
          .diwali-subhead {
            font-size: 15px !important;
          }
        }
        .diwali-hero-section { min-height: 600px; }
        @media (min-width: 1024px) {
          .diwali-hero-section { height: calc(100vh - 72px); }
          @supports (height: 100svh) {
            .diwali-hero-section { height: calc(100svh - 72px); }
          }
        }
        @media (max-width: 1023px) {
          .diwali-hero-section { height: auto; min-height: calc(100vh - 72px); }
          @supports (height: 100svh) {
            .diwali-hero-section { min-height: calc(100svh - 72px); }
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
        .diwali-opening-visual {
          animation: diwali-diya-opening 280ms ease-out backwards;
          animation-delay: var(--diwali-light-delay);
        }
        section[aria-label="Active cohort"] > div:first-child > div[role="group"] > p:last-child {
          color: #c2410c !important;
        }
        .diwali-cohort-column > section[aria-label="Active cohort"] {
          margin-left: 0;
          margin-right: 0;
        }
        .diwali-cohort-column { justify-self: end; }
        .diwali-journey-strip {
          grid-template-columns: minmax(200px, 1fr) auto minmax(200px, 1fr);
          flex-shrink: 0;
          margin: clamp(8px, 2vh, 24px) 0 clamp(8px, 2vh, 28px);
          padding: clamp(8px, 1.8vh, 16px) 24px;
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
        .diwali-twinkle { opacity: 1; }
        .diwali-light-bulb {
          filter:
            drop-shadow(0 0 4px var(--light-color))
            drop-shadow(0 0 10px var(--light-color))
            drop-shadow(0 0 20px color-mix(in srgb, var(--light-color) 28%, transparent));
        }
        .diwali-light-halo {
          mix-blend-mode: screen;
          filter:
            drop-shadow(0 0 4px var(--light-color))
            drop-shadow(0 0 10px var(--light-color))
            drop-shadow(0 0 20px color-mix(in srgb, var(--light-color) 28%, transparent));
        }
        @media (prefers-reduced-motion: no-preference) {
          .diwali-twinkle {
            animation: diwali-twinkle 2.4s ease-in-out infinite;
            animation-delay: var(--light-delay);
          }
          .diwali-light-halo {
            animation: diwali-halo-twinkle 2.4s ease-in-out infinite;
            animation-delay: var(--light-delay);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .diwali-twinkle { opacity: 1; animation: none; }
          .diwali-light-halo { opacity: 0.2; animation: none; }
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
        .diwali-streamer {
          border-radius: 55% 45% 60% 40%;
          box-shadow: 0 0 9px color-mix(in srgb, var(--streamer-color) 55%, transparent);
          opacity: 0;
          transform-origin: center;
          will-change: transform, opacity;
        }
        .diwali-streamer-left { left: 0; }
        .diwali-streamer-right { right: 0; }
        .diwali-cracker-flash {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle, #fff8db 0%, var(--cracker-color) 28%, transparent 74%);
          filter: drop-shadow(0 0 9px var(--cracker-color));
          opacity: 0;
          animation: diwali-cracker-flash 950ms ease-out var(--cracker-delay) both;
        }
        .diwali-cracker-launch {
          width: 4px;
          height: 24px;
          border-radius: 999px;
          background: linear-gradient(to top, transparent, var(--cracker-color) 35%, #fff8db);
          box-shadow: 0 0 8px var(--cracker-color), 0 0 14px color-mix(in srgb, var(--cracker-color) 70%, transparent);
          opacity: 0;
          animation: diwali-cracker-launch 620ms cubic-bezier(0.2, 0.65, 0.35, 1) var(--cracker-launch-delay) both;
        }
        .diwali-cracker-spark {
          width: 4px;
          height: 18px;
          border-radius: 999px;
          background: linear-gradient(to top, transparent 0%, var(--cracker-color) 45%, #fff8db 100%);
          box-shadow: 0 0 7px var(--cracker-color), 0 0 13px var(--cracker-color);
          opacity: 0;
          transform-origin: center bottom;
          animation: diwali-cracker-spark 1250ms cubic-bezier(0.14, 0.7, 0.28, 1) var(--cracker-spark-delay) both;
        }
        .diwali-success-pulse {
          animation: diwali-success-glow 1.4s ease-in-out 1;
        }
        .ambient-paused .diwali-twinkle,
        .ambient-paused .diwali-gold-dust,
        .ambient-paused .diwali-streamer,
        .ambient-paused .diwali-cracker-flash,
        .ambient-paused .diwali-cracker-launch,
        .ambient-paused .diwali-cracker-spark {
          animation-play-state: paused !important;
        }
        @media (prefers-reduced-motion: no-preference) {
          .diwali-streamer {
            animation: diwali-streamer-burst var(--streamer-duration) cubic-bezier(0.18, 0.72, 0.32, 1) var(--streamer-delay) both;
          }
        }
        .diwali-diya-button:focus:not(:focus-visible) {
          outline: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .diwali-twinkle,
          .diwali-gold-dust,
          .diwali-flame-flicker,
          .diwali-opening-visual,
          .diwali-spark,
          .diwali-streamer,
          .diwali-cracker-flash,
          .diwali-cracker-launch,
          .diwali-cracker-spark,
          .diwali-diya-button,
          .animate-pulse,
          .animate-ping {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          .diwali-spark {
            display: none !important;
          }
          .diwali-streamer { display: none !important; }
          .diwali-crackers-layer { display: none !important; }
          .diwali-success-pulse { animation: none !important; }
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
          .diwali-journey-strip { padding-right: 16px; padding-left: 16px; }
        }
        @media (max-width: 1023px) {
          .diwali-cohort-column > section[aria-label="Active cohort"] { margin-inline: auto; }
          .diwali-journey-strip { grid-template-columns: minmax(0, 1fr); row-gap: 16px; }
          .diwali-journey-strip .diwali-diya-row { justify-content: center; gap: 12px; }
          .diwali-journey-status { width: 100%; justify-content: center; }
          .diwali-journey-status > :is(span, a) { width: 100%; }
          .diwali-journey-strip .diwali-diya-button { width: 52px; min-height: 68px; }
          .diwali-journey-strip .diwali-diya-visual { width: 40px; height: 44px; }
          .diwali-journey-strip .diwali-diya-label { font-size: 11px; line-height: 14px; }
          .diwali-bloom-lit { width: 52px; height: 52px; }
        }
        @media (max-width: 480px) {
          .diwali-inner-content {
            width: calc(100% - 24px) !important;
            padding: 44px 8px 0 !important;
          }
          .diwali-headline {
            margin-top: 0 !important;
            font-size: clamp(2rem, 9vw, 2.5rem) !important;
            line-height: 1.04 !important;
          }
          .diwali-subhead {
            max-width: 100%;
            margin-top: 12px !important;
            font-size: 15px !important;
            line-height: 1.45 !important;
            text-wrap: pretty;
          }
          .diwali-copy > p:last-of-type {
            margin-top: 10px !important;
            font-size: 13px !important;
          }
          .diwali-cta-row { margin-top: 16px !important; gap: 8px !important; }
          .diwali-trust-row { margin-top: 12px !important; gap: 6px !important; }
          .diwali-trust-row > span { padding-inline: 9px; font-size: 11px; }
          .diwali-cohort-column { padding-bottom: 8px !important; }
          .diwali-journey-strip { margin-top: 12px; margin-bottom: 12px; }
          .diwali-journey-strip { padding: 12px; }
          .diwali-journey-strip .diwali-diya-row { gap: 6px; }
          .diwali-journey-strip .diwali-diya-button { width: 50px; }
          .diwali-journey-strip .diwali-diya-visual { width: 36px; height: 40px; }
          .diwali-bloom-lit { width: 47px; height: 47px; }
          .diwali-journey-strip > div:first-child > p:first-child {
            min-width: 0 !important;
            font-size: 14px !important;
          }
          .diwali-stats-bar { padding-top: 12px !important; padding-bottom: 14px !important; }
          .diwali-stats-content { width: 100% !important; padding-inline: 4px !important; gap: 10px !important; }
          .diwali-stats-content > div p { font-size: 12px !important; line-height: 1.3; }
        }
      `}</style>

      {/* Announces the current independent diya toggle count without changing the panel layout. */}
      <div className="sr-only" aria-live="polite" role="status">
        {litCount} of 5 lit
      </div>

      {/* Main Diwali Hero Panel */}
      <div
        className={`relative flex w-full flex-1 flex-col justify-between overflow-hidden text-white ${
          isAmbientActive ? '' : 'ambient-paused'
        }`}
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

        {/* Brief Diwali streamer burst from both edges; decorative and behind hero content. */}
        <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden="true">
          {DIWALI_STREAMERS.map((streamer, index) => (
            <span
              key={`streamer-${index}`}
              className={`diwali-streamer diwali-streamer-${streamer.side} absolute block`}
              style={{
                top: streamer.top,
                width: `${streamer.width}px`,
                height: `${streamer.height}px`,
                backgroundColor: streamer.color,
                '--streamer-color': streamer.color,
                '--streamer-delay': `${streamer.delay}ms`,
                '--streamer-duration': `${streamer.duration}ms`,
                '--streamer-drop': `${streamer.drop}px`,
                '--streamer-start-x': streamer.side === 'left' ? '-30px' : '30px',
                '--streamer-end-x': streamer.side === 'left' ? 'clamp(18px, 4vw, 56px)' : 'clamp(-56px, -4vw, -18px)',
                '--streamer-start-angle': `${streamer.startAngle}deg`,
                '--streamer-end-angle': `${streamer.endAngle}deg`,
              } as CSSProperties}
            />
          ))}
        </div>

        {/* Brief, staggered Diwali cracker bursts; decorative and behind hero content. */}
        <div className="diwali-crackers-layer pointer-events-none absolute inset-0 z-[2] overflow-hidden" aria-hidden="true">
          {DIWALI_CRACKER_BURSTS.map((burst, burstIndex) => (
            <div
              key={`cracker-${burst.side}-${burstIndex}`}
              className="absolute h-0 w-0"
              style={{
                left: burst.left,
                top: burst.top,
                '--cracker-color': burst.color,
                '--cracker-rise': '40vh',
                '--cracker-launch-delay': `${burst.delay}ms`,
                '--cracker-delay': `${burst.delay + 620}ms`,
              } as CSSProperties}
            >
              <span className="diwali-cracker-launch absolute -left-[2px] -top-[12px] block" />
              <span className="diwali-cracker-flash absolute -left-[14px] -top-[14px] block" />
              {DIWALI_CRACKER_SPARKS.map((spark, sparkIndex) => (
                <span
                  key={`cracker-spark-${sparkIndex}`}
                  className="diwali-cracker-spark absolute -left-[2px] -top-[18px] block"
                  style={{
                    '--cracker-dx': `${spark.dx}px`,
                    '--cracker-dy': `${spark.dy}px`,
                    '--cracker-angle': `${spark.angle}deg`,
                    '--cracker-spark-delay': `${burst.delay + 620 + 60 + sparkIndex * 12}ms`,
                  } as CSSProperties}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="diwali-inner-content relative z-10 mx-auto flex w-[calc(100%-2rem)] max-w-[1200px] flex-1 flex-col px-6 pt-[clamp(8px,3vh,52px)] sm:w-[calc(100%-3rem)] sm:px-10">
        {/* Content grid: both columns share the hero's content edges. */}
        <div className="diwali-hero-content grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)] items-center gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          {/* Left Column Content:
              Visual Hierarchy: pill -> headline -> subhead -> greeting -> CTAs -> trust chips */}
          <div className="diwali-copy min-w-0">
            {/* 2. Headline */}
            <h1
              className="diwali-headline mt-3 font-extrabold leading-[1.06] tracking-tight text-white"
              style={{
                fontFamily: 'var(--font-home-display), Inter, sans-serif',
                fontSize: 'clamp(1.75rem, 5.2vh, 3.5rem)',
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
            <p className="diwali-subhead mt-4 max-w-[560px] text-[15px] leading-[clamp(1.3rem,2.7vh,1.6rem)] text-white sm:text-[17px]">
              Subscribe once. Join a curated batch of 12 – get AI-matched jobs from top companies, 24/7 application tracking, and a human coordinator focused on your placement every day.
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
                <span className="h-1.5 w-1.5 rounded-full bg-[#098855]" aria-hidden="true" /> Matched jobs
              </span>
            </div>

          </div>

          <div className="diwali-cohort-column relative z-10 flex w-full items-center justify-end pb-4">
            <CohortCard seatsOpen={availableSeatCount} loading={batchLoading} />
          </div>
        </div>

        <div className="diwali-journey-strip grid items-center gap-4 overflow-hidden backdrop-blur-md">
          <div className="flex min-h-[52px] flex-col justify-center gap-1">
            <p className="min-h-5 min-w-[250px] text-[15px] font-bold leading-tight text-white">
              {allLit ? 'Your career journey is lit.' : `Your career journey: ${litCount} of 5 lit`}
            </p>
            <p className="text-[13px] leading-tight text-white/90">Seats are limited per batch.</p>
          </div>

          <div className="diwali-diya-row flex items-center justify-center gap-7" role="group" aria-label="Five journey diyas">
            {DIYA_STEPS.map((step, index) => (
              <DiyaButton
                key={step.id}
                index={index}
                step={step}
                isLit={litDiyas[index]}
                isOpening={openingDiyas}
                onClick={() => handleDiyaClick(index)}
              />
            ))}
          </div>

          <div className="diwali-journey-status flex h-11 min-w-[200px] items-center justify-end">
            <Link
              href="/auth/register"
              className="inline-flex h-11 min-w-[200px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#f58020] to-[#fec40d] px-5 text-sm font-bold text-[#0B1B33] shadow-[0_12px_28px_rgba(245,128,32,0.5),0_0_24px_rgba(245,128,32,0.4)] transition hover:from-[#f58020] hover:to-[#ffd36b] hover:shadow-[0_16px_36px_rgba(245,128,32,0.65)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd36b] diwali-success-pulse"
            >
              Claim Your Seat <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        </div>
      </div>

        {/* Stats bar sits outside overflow-hidden so labels are never clipped by the hero height. */}
        <div
          className="diwali-stats-bar relative z-10 w-full shrink-0 border-t border-white/20 bg-[#071936]/80 px-4 pb-4 pt-3 backdrop-blur-md sm:px-6 sm:pb-5 sm:pt-3.5"
        >
          <dl className="diwali-stats-content mx-auto grid w-[calc(100%-2rem)] max-w-[1200px] grid-cols-2 gap-x-4 gap-y-3 px-6 sm:w-[calc(100%-3rem)] sm:gap-6 sm:px-10 lg:grid-cols-4">
            {/* Stat 1: Students per batch */}
            <div className="min-w-0 text-center sm:text-left">
              <dt className="sr-only">Students per batch</dt>
              {batchLoading ? (
                <div className="mx-auto h-7 w-[3ch] animate-pulse rounded bg-white/20 sm:mx-0" aria-label="Loading batch capacity" />
              ) : (
                <dd className="inline-block min-w-[3ch] text-center text-[26px] font-extrabold leading-none tracking-tight text-white tabular-nums sm:text-left">
                  {batchCapacity ?? '—'}
                </dd>
              )}
              <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">Students per batch</p>
            </div>

            {/* Stat 2: Seats open (Live availability sourced with skeleton & fallback states) */}
            <div className="min-w-0 text-center sm:text-left even:border-l even:border-white/20 even:pl-3 lg:border-l lg:pl-6">
              <dt className="sr-only">Seats open</dt>
              {seatsAvailability.status === 'loading' ? (
                <div className="flex flex-col items-center sm:items-start">
                  <div className="h-7 w-[3ch] animate-pulse rounded bg-white/20" />
                  <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">Checking availability...</p>
                </div>
              ) : seatsAvailability.status === 'available' ? (
                <>
                  <dd className="inline-block min-w-[3ch] text-center text-[26px] font-extrabold leading-none tracking-tight text-white tabular-nums sm:text-left">
                    {availableSeatCount}
                  </dd>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">Seats open</p>
                </>
              ) : (
                <>
                  <dd className="text-[22px] font-extrabold leading-none tracking-tight text-[#ffd36b] sm:text-[26px]">
                    Limited seats
                  </dd>
                  <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">Seats open</p>
                </>
              )}
            </div>

            {/* Stat 3: 24/7 Virtual placement desk
                NOTE: Replaced previous "60-day Placement journey" with "24/7 Virtual placement desk"
                per Phase 1.6 requirement. Needs product confirmation if this differed from legacy production site. */}
            <div className="min-w-0 border-t border-white/20 pt-3 text-center sm:text-left even:border-l even:pl-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <dt className="sr-only">Virtual placement desk</dt>
              <dd className="text-[26px] font-extrabold leading-none tracking-tight text-white tabular-nums">
                {virtualDeskValue}
              </dd>
              <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">Virtual placement desk</p>
            </div>

            {/* Stat 4: Coordinator */}
            <div className="min-w-0 border-t border-white/20 pt-3 text-center sm:text-left even:border-l even:pl-3 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
              <dt className="sr-only">Coordinator</dt>
              <dd className="text-[26px] font-extrabold leading-none tracking-tight text-white tabular-nums">
                {coordinatorValue}
              </dd>
              <p className="mt-1 text-[13px] font-medium leading-snug text-white/95">Coordinator</p>
            </div>
          </dl>
        </div>
    </section>
  );
}

export default DiwaliHero;
