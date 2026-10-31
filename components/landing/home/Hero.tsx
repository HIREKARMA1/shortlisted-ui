'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, Check, UserRound } from 'lucide-react';
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
      const progress = Math.min((now - start) / 700, 1);
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
    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 180 10" fill="none" aria-hidden>
      <path d="M2 7C40 2 90 1 178 6" stroke="#fec40d" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function ProductMockup({ shift }: { shift: { x: number; y: number } }) {
  return (
    <div className="relative mx-auto h-[300px] w-full max-w-[420px] lg:h-[320px]">
      <div
        className="absolute inset-x-4 top-6 overflow-hidden rounded-[20px] border border-white/25 bg-white shadow-[0_24px_50px_rgba(11,27,51,0.22)] motion-safe:transition-transform sm:inset-x-8"
        style={{ transform: `translate(${shift.x * 0.4}px, ${shift.y * 0.4}px)` }}
      >
        <div className="flex h-[220px] sm:h-[240px]">
          <div className="flex w-14 flex-col gap-2 border-r border-[#E5EAF2] bg-[#F7F9FC] p-2.5 sm:w-16">
            <div className="h-2 w-10 rounded bg-[#1b52a4]/25" />
            <div className="mt-2 h-6 rounded-lg bg-[#1b52a4]/15" />
            <div className="h-6 rounded-lg bg-[#00a2e5]/15" />
            <div className="h-6 rounded-lg bg-[#E5EAF2]" />
            <div className="mt-auto h-6 rounded-lg bg-[#f58020]/20" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#5B6B82]">Dashboard</p>
                <p className="text-sm font-bold text-[#0B1B33]">Placement desk</p>
              </div>
              <div className="relative grid h-12 w-12 place-items-center">
                <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90" aria-hidden>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#E5EAF2" strokeWidth="4" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#098855" strokeWidth="4" strokeDasharray="70 88" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#098855]">80%</span>
              </div>
            </div>
            <div className="rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-2.5">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#00a2e5]/15 text-[#00a2e5]">
                  <Briefcase className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-[#0B1B33]">Matched job</p>
                  <p className="truncate text-[10px] text-[#5B6B82]">Ready for your batch</p>
                </div>
              </div>
            </div>
            <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#fec40d]/25 px-2.5 py-1 text-[10px] font-semibold text-[#0B1B33]">
              <Calendar className="h-3 w-3" strokeWidth={1.75} />
              Interview chip
            </div>
          </div>
        </div>
      </div>

      <div
        className="sl-float absolute left-0 top-0 flex items-center gap-1.5 rounded-2xl border border-white/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#098855] shadow-lg"
        style={{ transform: `translate(${shift.x}px, ${shift.y}px)` }}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={1.75} /> Profile ready ✓
      </div>
      <div
        className="sl-float absolute right-0 top-10 flex items-center gap-1.5 rounded-2xl border border-white/40 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#00a2e5] shadow-lg [animation-delay:180ms]"
        style={{ transform: `translate(${-shift.x}px, ${shift.y * 0.6}px)` }}
      >
        <Briefcase className="h-3.5 w-3.5" strokeWidth={1.75} /> Job matched
      </div>
      <div
        className="sl-float absolute bottom-2 left-6 flex items-center gap-1.5 rounded-2xl bg-[#fec40d] px-2.5 py-1.5 text-xs font-semibold text-[#0B1B33] shadow-lg [animation-delay:360ms]"
        style={{ transform: `translate(${shift.x * 0.5}px, ${-shift.y}px)` }}
      >
        <UserRound className="h-3.5 w-3.5" strokeWidth={1.75} /> Interview scheduled
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
    }, { threshold: 0.4 });
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
    <section id="home" className="scroll-mt-20 px-4 pb-2 pt-4 sm:px-6">
      <div
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[28px] text-white shadow-[0_24px_60px_rgba(27,82,164,0.28)]"
        style={{ background: 'linear-gradient(135deg, #1b52a4 0%, #00a2e5 100%)' }}
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setShift({
            x: (event.clientX - rect.left - rect.width / 2) / 28,
            y: (event.clientY - rect.top - rect.height / 2) / 28,
          });
        }}
        onMouseLeave={() => setShift({ x: 0, y: 0 })}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -right-10 -top-8 h-48 w-48 rounded-full bg-[#fec40d]/25 blur-3xl" />
          <div className="absolute -bottom-12 -left-8 h-52 w-52 rounded-full bg-[#f58020]/25 blur-3xl" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
        </div>

        <div className="relative grid items-center gap-6 px-5 py-7 sm:px-8 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:py-9">
          <div>
            <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              AI Virtual Placement Cell
            </p>
            <h1
              className="mt-4 font-bold leading-[1.05] tracking-tight text-white"
              style={{ fontFamily: 'var(--font-home-display), Inter, sans-serif', fontSize: 'clamp(2.2rem, 1.5rem + 2.4vw, 3.25rem)', letterSpacing: '-0.03em' }}
            >
              Get shortlisted.
              <span className="relative mt-1 inline-block">
                Get hired.
                <YellowUnderline />
              </span>
            </h1>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/90 sm:text-[15px]">
              Sign in free, then subscribe once for jobs, classes, and a coordinator.
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {ready ? (
                <PrimaryLink href={primary} className="shadow-[0_12px_28px_rgba(245,128,32,0.45)]">
                  {hideTrialPromos ? 'Go to dashboard' : ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </PrimaryLink>
              ) : null}
              <Link
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/45 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-white/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                See how it works
              </Link>
            </div>
          </div>
          <ProductMockup shift={shift} />
        </div>

        <div ref={statsRef} className="relative border-t border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm sm:px-8">
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <dt className="sr-only">{item.label}</dt>
                <dd className="text-lg font-bold tracking-tight text-white sm:text-xl">{item.value}</dd>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/75">{item.label}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
