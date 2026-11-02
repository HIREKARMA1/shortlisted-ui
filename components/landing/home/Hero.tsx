'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, Check, LayoutDashboard, UserRound, Users } from 'lucide-react';
import { ctaLabel } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { PrimaryLink } from './primitives';

function useCountUp(target: number | null, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target == null) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

function YellowUnderline() {
  return (
    <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 190 12" fill="none" aria-hidden>
      <path d="M2.5 8.5C45 3 100 2 187.5 7.5" stroke="#fec40d" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ProductMockup({ shift }: { shift: { x: number; y: number } }) {
  return (
    <div className="relative mx-auto flex h-[350px] w-full max-w-[490px] items-center justify-center lg:h-[390px]">
      {/* Main dashboard window */}
      <div
        className="relative w-full overflow-hidden rounded-[22px] border border-white/30 bg-white shadow-[0_28px_60px_rgba(11,27,51,0.28)] transition-transform duration-200 ease-out"
        style={{ transform: `translate(${shift.x * 0.35}px, ${shift.y * 0.35}px)` }}
      >
        {/* Window title bar */}
        <div className="flex items-center justify-between border-b border-[#E5EAF2] bg-[#F7F9FC] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#d64246]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fec40d]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#098855]" />
            <span className="ml-2 text-[11px] font-semibold tracking-wide text-[#5B6B82]">shortlisted.desk</span>
            <span className="ml-2 rounded-full border border-[#E5EAF2] bg-white px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#098855]/15 px-2 py-0.5 text-[10px] font-bold text-[#098855]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#098855] animate-pulse" /> Live Batch
          </span>
        </div>

        {/* Window interior */}
        <div className="flex h-[230px] sm:h-[250px]">
          {/* Mini sidebar */}
          <div className="flex w-14 sm:w-16 flex-col items-center gap-3 border-r border-[#E5EAF2] bg-[#F7F9FC] py-3.5">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-[#1b52a4] text-white shadow-sm">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <div className="mt-1 flex flex-col items-center gap-2">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#00a2e5]/15 text-[#00a2e5]">
                <Briefcase className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#5B6B82]/10 text-[#5B6B82]">
                <UserRound className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-[#5B6B82]/10 text-[#5B6B82]">
                <Users className="h-3.5 w-3.5" strokeWidth={2} />
              </div>
            </div>
            <div className="mt-auto h-2 w-6 rounded-full bg-[#E5EAF2]" />
          </div>

          {/* Mini main panel */}
          <div className="flex min-w-0 flex-1 flex-col justify-between p-3.5 sm:p-4">
            {/* Top row: Profile completion status (honest/neutral) */}
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#5B6B82]">Placement Desk</p>
                <p className="text-sm font-bold text-[#0B1B33] sm:text-base">Cohort Dashboard</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-[#F7F9FC] border border-[#E5EAF2] px-3 py-1.5">
                <div className="relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center">
                  <svg viewBox="0 0 56 56" className="h-12 w-12 sm:h-14 sm:w-14 -rotate-90" aria-hidden>
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
                  <span className="absolute text-[11px] sm:text-xs font-extrabold text-[#098855]">100%</span>
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-semibold text-[#5B6B82] leading-none">Profile</p>
                  <p className="text-xs sm:text-[13px] font-bold text-[#098855] leading-tight mt-0.5">Ready</p>
                </div>
              </div>
            </div>

            {/* Matched Job Row (honest/neutral) */}
            <div className="rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-2.5 transition hover:border-[#00a2e5]/50">
              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#00a2e5]/15 text-[#00a2e5]">
                    <Briefcase className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-xs font-bold text-[#0B1B33]">Software Engineer</p>
                      <span className="rounded bg-[#098855]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#098855]">
                        Match %
                      </span>
                    </div>
                    <p className="truncate text-[10px] text-[#5B6B82]">Batch role • Matched for you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interview Chip & Coordinator row */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E5EAF2]">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fec40d]/25 border border-[#fec40d]/40 px-2.5 py-1 text-[10px] font-bold text-[#1b52a4]">
                <Calendar className="h-3 w-3 text-[#f58020]" strokeWidth={2} />
                Round 1 Scheduled
              </div>
              <span className="text-[10px] font-medium text-[#5B6B82]">1 Coordinator assigned</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Floating Cards: repositioned so none overlaps any text, pill, or number */}
      {/* 1. Above the top-left edge of the mockup */}
      <div
        className="hidden sm:flex absolute -top-4 left-3 sm:left-4 z-20"
        style={{ transform: `translate(${shift.x * 0.4}px, ${shift.y * 0.4}px)` }}
      >
        <div className="sl-float flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-3.5 py-1.5 text-xs font-bold text-[#098855] shadow-[0_12px_28px_rgba(9,136,85,0.2)] backdrop-blur-sm">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#098855] text-white">
            <Check className="h-3.5 w-3.5 stroke-[2.5]" />
          </span>
          Profile ready ✓
        </div>
      </div>

      {/* 2. Overlapping the right edge only on empty space (middle of right edge) */}
      <div
        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-3 sm:-right-4 z-20"
        style={{ transform: `translate(${-shift.x * 0.4}px, ${shift.y * 0.3}px)` }}
      >
        <div className="sl-float flex items-center gap-2 rounded-2xl border border-white/80 bg-white px-3.5 py-1.5 text-xs font-bold text-[#00a2e5] shadow-[0_12px_28px_rgba(0,162,229,0.22)] backdrop-blur-sm [animation-delay:220ms]">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-[#00a2e5] text-white">
            <Briefcase className="h-3 w-3 stroke-[2.5]" />
          </span>
          Job matched
        </div>
      </div>

      {/* 3. Overlapping the bottom-left corner only on empty space (>12px clearance from Round 1 Scheduled) */}
      <div
        className="hidden sm:flex absolute -bottom-5 left-[-4px] sm:left-[-8px] z-20"
        style={{ transform: `translate(${shift.x * 0.3}px, ${-shift.y * 0.4}px)` }}
      >
        <div className="sl-float flex items-center gap-2 rounded-2xl border border-[#fec40d] bg-[#fec40d] px-3.5 py-1.5 text-xs font-bold text-[#1b52a4] shadow-[0_12px_28px_rgba(254,196,13,0.3)] backdrop-blur-sm [animation-delay:420ms]">
          <Calendar className="h-3.5 w-3.5 stroke-[2.2] text-[#f58020]" />
          Interview scheduled
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const { trialHref, dashboardHref, hideTrialPromos, ready, batch, batchLoading } = useHome();
  const primary = hideTrialPromos ? dashboardHref : trialHref;
  const [shift, setShift] = useState({ x: 0, y: 0 });
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const seats = batch?.seats_remaining ?? null;
  const seatsShown = useCountUp(seats, statsInView && !batchLoading);

  useEffect(() => {
    const node = statsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setStatsInView(true);
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { label: 'per batch', value: '12', show: true },
    { label: 'seats open', value: batchLoading || seats == null ? null : String(seatsShown), show: !batchLoading && seats != null },
    { label: 'journey', value: '60-day', show: true },
    { label: 'coordinator', value: '1', show: true },
  ].filter((item) => item.show && item.value != null);

  return (
    <section id="home" className="scroll-mt-[88px] w-full bg-[#F7F9FC] px-4 pt-6 pb-6 sm:px-6">
      <div
        className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[28px] text-white shadow-[0_24px_60px_rgba(27,82,164,0.32)]"
        style={{ background: 'linear-gradient(135deg, #1b52a4 0%, #00a2e5 100%)' }}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setShift({
            x: (event.clientX - rect.left - rect.width / 2) / 25,
            y: (event.clientY - rect.top - rect.height / 2) / 25,
          });
        }}
        onMouseLeave={() => setShift({ x: 0, y: 0 })}
      >
        {/* Glows and faint dot grid */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#fec40d]/25 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-[#f58020]/25 blur-3xl" />
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
        </div>

        {/* Content grid: left copy + right product mockup */}
        <div className="relative grid items-center gap-8 px-6 py-8 sm:px-9 sm:py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:py-12">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/35 bg-white/15 px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-md shadow-sm">

              AI Virtual Placement Cell
            </span>
            <h1
              className="mt-4 font-bold leading-[1.08] tracking-tight text-white"
              style={{
                fontFamily: 'var(--font-home-display), Inter, sans-serif',
                fontSize: 'clamp(2.35rem, 1.6rem + 2.5vw, 3.25rem)',
                letterSpacing: '-0.03em',
              }}
            >
              Get shortlisted.
              <span className="relative mt-1 inline-block">
                Get hired.
                <YellowUnderline />
              </span>
            </h1>
            <p className="mt-4 max-w-[560px] text-[14px] leading-relaxed text-white/90 sm:text-[15px]">
              Subscribe once. Join a curated batch of 12 – get AI-matched jobs from top companies, 24/7 application tracking, and a human coordinator focused on your placement every day.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {ready ? (
                <PrimaryLink
                  href={primary}
                  className="shadow-[0_12px_28px_rgba(245,128,32,0.48),0_0_20px_rgba(245,128,32,0.3)] hover:shadow-[0_16px_34px_rgba(245,128,32,0.55)]"
                >
                  {hideTrialPromos ? 'Go to dashboard' : ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </PrimaryLink>
              ) : null}
              <Link
                href="#journey"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                See how it works
              </Link>
            </div>

            {/* Space-filling brand trust chips under buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-2 pt-1 text-xs text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#fec40d]" /> Batch of 12
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00a2e5]" /> Dedicated coordinator
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 font-medium backdrop-blur-sm">
                <span className="rounded-full bg-[#098855] px-1.5 py-0.5 text-[11px] font-bold uppercase leading-none text-white">AI</span> Matched jobs
              </span>
            </div>
          </div>

          {/* Product Mockup fills the right half */}
          <ProductMockup shift={shift} />
        </div>

        {/* Translucent stats row inside bottom of hero panel */}
        <div ref={statsRef} className="relative border-t border-white/20 bg-white/10 px-6 py-3.5 backdrop-blur-md sm:px-10">
          <dl className={`grid gap-3 ${stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
            {stats.map((item, i) => (
              <div
                key={item.label}
                className={`text-center sm:text-left ${i > 0 ? 'sm:border-l sm:border-white/15 sm:pl-6' : ''}`}
              >
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{item.value}</dd>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/80">{item.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
