'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Flag,
  Lock,
  Trophy,
  Users,
} from 'lucide-react';
import freeTrialEn from '@/content/en/freeTrial.json';
import { useHome } from './HomeProvider';
import { Reveal, SectionHeading } from './primitives';
import { useFeatureGate } from './useFeatureGate';

// Exact 6 stages from the free trial page data
const stages = freeTrialEn.journey.steps;

const stageIcons = [Flag, BookOpen, BarChart3, Briefcase, Users, Trophy];

// 2-3 small chips linking to related features for each stage
const stageChips: Record<string, { label: string; href?: string; featureId?: string }[]> = {
  start: [
    { label: 'Classes', featureId: 'classes' },
    { label: 'Trainer sessions', href: '/free-trial#trainers' },
    { label: 'Batch kickoff', href: '/free-trial' },
  ],
  practice: [
    { label: 'Assessments', featureId: 'assessments' },
    { label: 'Skill evaluation', featureId: 'assessments' },
    { label: 'Progress tracking', featureId: 'profile' },
  ],
  improve: [
    { label: 'Profile & resume', featureId: 'profile' },
    { label: 'Readiness check', featureId: 'assessments' },
    { label: 'Trainer guidance', href: '/free-trial#trainers' },
  ],
  opportunities: [
    { label: 'Matched jobs', featureId: 'jobs' },
    { label: 'Batch roles', featureId: 'jobs' },
    { label: 'Direct applications', featureId: 'applications' },
  ],
  interviews: [
    { label: 'Application tracking', featureId: 'applications' },
    { label: 'Mock rounds', featureId: 'classes' },
    { label: 'Coordinator review', featureId: 'batch' },
  ],
  placed: [
    { label: 'Offer letters', featureId: 'applications' },
    { label: '60-day milestone', href: '#plans' },
    { label: 'Placement success', href: '#plans' },
  ],
};

export function PlacementJourneySection() {
  const [activeStage, setActiveStage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const { openFeature } = useFeatureGate();
  const { trialHref, isLoggedIn } = useHome();
  const currentStage = stages[activeStage] ?? stages[0];
  const count = stages.length;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance every 4s with a smooth progress line
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    const duration = 4000;

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / duration) * 100, 100);
      setProgress(pct);
    }, 40);

    timerRef.current = setTimeout(() => {
      setActiveStage((prev) => (prev + 1) % count);
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [activeStage, isPaused, count]);

  const handleSelectStage = (idx: number) => {
    setActiveStage(idx);
    setProgress(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleSelectStage((idx + 1) % count);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleSelectStage((idx - 1 + count) % count);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelectStage(idx);
    }
  };

  return (
    <section
      id="journey"
      className="scroll-mt-[88px] w-full bg-white border-y border-[#E5EAF2]/60 py-14"
      aria-label="The 60-day placement journey"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="YOUR PLACEMENT JOURNEY"
              title="From sign-up to placed in 60 days"
              subtitle="A structured 60-day roadmap with expert trainers, AI assessments, and dedicated batch support."
            />
            {/* Stage completion progress bar (X of 6 fill with smooth transition) */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
              <span>Stage {activeStage + 1} of {count}</span>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#E5EAF2]">
                <div
                  className="h-full bg-[var(--brand-sky)] transition-all duration-300 ease-out"
                  style={{ width: `${((activeStage + 1) / count) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Desktop Horizontal Roadmap (Segmented Curved Path) */}
        <div className="mt-10 hidden md:block">
          <div className="relative">
            {/* SVG Connecting Path */}
            <svg
              className="absolute left-0 top-6 h-6 w-full -translate-y-1/2 overflow-visible"
              viewBox="0 0 1000 24"
              fill="none"
              preserveAspectRatio="none"
              aria-hidden
            >
              {/* Inactive background track */}
              <line
                x1="40"
                y1="12"
                x2="960"
                y2="12"
                stroke="#E5EAF2"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Active filled track */}
              <line
                x1="40"
                y1="12"
                x2={40 + (activeStage / (count - 1)) * 920}
                y2="12"
                stroke="url(#journey-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="journey-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1b52a4" />
                  <stop offset="100%" stopColor="#00a2e5" />
                </linearGradient>
              </defs>
            </svg>

            {/* 6 Stage Interactive Nodes */}
            <div className="relative z-10 grid grid-cols-6 gap-2">
              {stages.map((step, idx) => {
                const Icon = stageIcons[idx];
                const isActive = idx === activeStage;
                const isPassed = idx < activeStage;
                const isLast = idx === count - 1;

                return (
                  <button
                    key={step.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={0}
                    onClick={() => handleSelectStage(idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    className="group flex flex-col items-center text-center focus-visible:outline-none"
                  >
                    {/* Node circle */}
                    <div
                      className={`relative grid h-12 w-12 place-items-center rounded-full border-2 transition-all duration-200 ${
                        isLast
                          ? isActive
                            ? 'border-[#098855] bg-[#098855] text-white shadow-[0_0_20px_rgba(9,136,85,0.4)] scale-110'
                            : 'border-[#098855] bg-white text-[#098855] hover:bg-[#098855]/10'
                          : isActive
                          ? 'border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white shadow-[0_0_20px_rgba(27,82,164,0.35)] scale-110'
                          : isPassed
                          ? 'border-[var(--brand-sky)] bg-[var(--brand-sky)] text-white'
                          : 'border-[#E5EAF2] bg-white text-[var(--muted)] group-hover:border-[var(--brand-sky)] group-hover:text-[var(--brand-sky)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute -bottom-1 h-1.5 w-1.5 rounded-full bg-white shadow" />
                      )}
                    </div>

                    {/* Stage Title */}
                    <span
                      className={`mt-3 block text-xs font-bold transition-colors leading-tight ${
                        isActive
                          ? isLast
                            ? 'text-[#098855]'
                            : 'text-[var(--brand-blue)]'
                          : 'text-[var(--ink)] group-hover:text-[var(--brand-sky)]'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold text-[var(--muted)]">
                      Stage {idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Stepper Path */}
        <div className="mt-8 flex flex-col gap-2 md:hidden">
          <div className="grid grid-cols-6 gap-1 border-b border-[#E5EAF2] pb-3">
            {stages.map((step, idx) => {
              const Icon = stageIcons[idx];
              const isActive = idx === activeStage;
              const isLast = idx === count - 1;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleSelectStage(idx)}
                  className={`flex flex-col items-center gap-1 py-1 text-center transition-all ${
                    isActive
                      ? isLast
                        ? 'text-[#098855] font-bold'
                        : 'text-[var(--brand-blue)] font-bold'
                      : 'text-[var(--muted)]'
                  }`}
                >
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold border ${
                      isActive
                        ? isLast
                          ? 'bg-[#098855] text-white border-[#098855]'
                          : 'bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]'
                        : 'bg-white border-[#E5EAF2]'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-[10px] truncate max-w-[50px]">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detail Card (p-6 = 24px inner padding) */}
        <div className="mt-6">
          <div className="rounded-[20px] border border-[#E5EAF2] bg-white p-6 shadow-[0_8px_24px_rgba(11,27,51,0.04)] transition-all duration-300">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                      activeStage === count - 1
                        ? 'bg-[#098855]/15 text-[#098855]'
                        : 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]'
                    }`}
                  >
                    Stage {activeStage + 1} of {count}
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)]">60-Day Placement Journey</span>
                </div>

                <h3 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--ink)]">
                  {currentStage.title}
                </h3>

                {/* Real stage bullets */}
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--muted)]">
                  {currentStage.bullets?.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2 text-[var(--ink)] font-medium">
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${
                          activeStage === count - 1 ? 'text-[#098855]' : 'text-[var(--brand-sky)]'
                        }`}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 2-3 clickable chips linking to related features */}
              <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                <span className="text-xs font-semibold text-[var(--muted)] mr-1">Related tools:</span>
                {stageChips[currentStage.id]?.map((chip) => {
                  if (chip.href) {
                    return (
                      <Link
                        key={chip.label}
                        href={chip.href}
                        className="inline-flex items-center gap-1 rounded-full border border-[#E5EAF2] bg-[#F7F9FC] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition-all hover:border-[var(--brand-sky)] hover:text-[var(--brand-sky)] hover:-translate-y-0.5 active:scale-95"
                      >
                        {chip.label} <ChevronRight className="h-3 w-3" />
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() => {
                        const featureObj = { id: chip.featureId ?? 'profile', href: '/dashboard', title: chip.label, caption: '', description: '', access: 'fullPlan' as const, tone: 'blue' as const, group: 'student' as const };
                        openFeature(featureObj);
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-[#E5EAF2] bg-[#F7F9FC] px-3.5 py-1.5 text-xs font-semibold text-[var(--ink)] transition-all hover:border-[var(--brand-sky)] hover:text-[var(--brand-sky)] hover:-translate-y-0.5 active:scale-95"
                    >
                      {chip.label} <ChevronRight className="h-3 w-3" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Slim "How Access Works" Bar Under the Journey */}
        <div className="mt-5 rounded-[20px] border border-[#E5EAF2] bg-[#F7F9FC] p-4.5 sm:p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm">
            {/* Part 1 */}
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#098855]/15 text-[#098855] font-bold">
                ✓
              </span>
              <div>
                <span className="font-bold text-[var(--ink)]">Sign in free:</span>{' '}
                <span className="text-[var(--muted)]">Open the free trial page and review all 60 days with no payment.</span>
              </div>
            </div>

            <div className="hidden h-5 w-px bg-[#E5EAF2] sm:block" aria-hidden />

            {/* Part 2 */}
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--brand-blue)]/15 text-[var(--brand-blue)] font-bold">
                <Lock className="h-3.5 w-3.5" />
              </span>
              <div>
                <span className="font-bold text-[var(--ink)]">Subscribe once:</span>{' '}
                <span className="text-[var(--muted)]">Unlocks jobs, classes, assessments, application tracking, and your batch of 12.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
