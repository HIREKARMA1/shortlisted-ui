'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  FileText,
  Lock,
  Users,
} from 'lucide-react';
import { useHome } from './HomeProvider';
import { Reveal, SectionHeading } from './primitives';
import { useFeatureGate } from './useFeatureGate';

export function PlacementDeskSection() {
  const { batch, batchLoading } = useHome();
  const { openFeature } = useFeatureGate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const openSeats = batch?.seats_remaining ?? null;
  const maxSeats = batch?.max_seats ?? 12;

  const features = [
    {
      id: 'profile',
      title: 'Profile & resume',
      benefit: 'Complete your profile once to attach it to all batch applications.',
      badge: 'Full plan',
      badgeClass: 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]',
      accentColor: '#1b52a4',
      linkText: 'Unlock with plan',
      href: '/dashboard/student/profile',
      access: 'fullPlan' as const,
      preview: (isHovered: boolean) => (
        <div className="flex h-[250px] flex-col justify-between rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
            <span className="text-[11px] font-bold text-[#5B6B82]">Application Readiness</span>
            <span className="rounded-full bg-white border border-[#E5EAF2] px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>

          <div className="my-auto flex items-center justify-between py-2">
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-[#0B1B33] font-medium">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#098855] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
                <span>Name & contact</span>
              </div>
              <div className="flex items-center gap-2 text-[#0B1B33] font-medium">
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#098855] text-white">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
                <span>Branch & skills</span>
              </div>
              <div className="flex items-center gap-2 text-[#5B6B82] font-medium">
                <span className={`grid h-3.5 w-3.5 place-items-center rounded-full transition-colors ${isHovered ? 'bg-[#098855] text-white' : 'border border-[#5B6B82]/40 text-transparent'}`}>
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
                <span>Resume PDF</span>
              </div>
            </div>

            {/* Circular readiness meter (~56px with short percentage fully inside) */}
            <div className="flex flex-col items-center shrink-0 pr-1">
              <div className="relative grid h-14 w-14 place-items-center">
                <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90" aria-hidden>
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#E5EAF2" strokeWidth="4" />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="#098855"
                    strokeWidth="4"
                    strokeDasharray={isHovered ? '138 138' : '110 138'}
                    strokeLinecap="round"
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                <span className="absolute text-xs font-extrabold text-[#098855]">
                  {isHovered ? '100%' : '80%'}
                </span>
              </div>
              <span className="mt-1 text-[10px] font-bold text-[#098855]">
                {isHovered ? 'Ready' : 'Profile'}
              </span>
              <span className="text-[9px] text-[#5B6B82]">Your status</span>
            </div>
          </div>
          <span className="text-[10px] text-[#5B6B82] text-center">Required before batch applications</span>
        </div>
      ),
    },
    {
      id: 'jobs',
      title: 'Matched jobs',
      benefit: 'AI-matched roles chosen directly for your batch cohort.',
      badge: 'Full plan',
      badgeClass: 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]',
      accentColor: '#f58020',
      linkText: 'Unlock with plan',
      href: '/dashboard/student/jobs',
      access: 'fullPlan' as const,
      preview: () => (
        <div className="relative flex h-[250px] flex-col justify-between overflow-hidden rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-[#00a2e5]/15 px-1.5 py-0.5 text-[11px] font-bold uppercase text-[#00a2e5] leading-none">
                AI
              </span>
              <span className="text-[11px] font-bold text-[#5B6B82]">Matched Feed</span>
            </div>
            <span className="rounded-full bg-white border border-[#E5EAF2] px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>

          {/* 2 clearly visible skeleton job rows with reduced blur so shapes read crisply */}
          <div className="my-auto space-y-2.5 opacity-65">
            {/* Job Row 1 */}
            <div className="rounded-lg border border-[#E5EAF2] bg-white p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-[#E5EAF2]" />
                  <div className="space-y-1">
                    <div className="h-2.5 w-24 rounded bg-[#CBD5E1]" />
                    <div className="h-2 w-16 rounded bg-[#E5EAF2]" />
                  </div>
                </div>
                <div className="h-4 w-12 rounded-full bg-[#E5EAF2]" />
              </div>
            </div>

            {/* Job Row 2 */}
            <div className="rounded-lg border border-[#E5EAF2] bg-white p-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-[#E5EAF2]" />
                  <div className="space-y-1">
                    <div className="h-2.5 w-28 rounded bg-[#CBD5E1]" />
                    <div className="h-2 w-20 rounded bg-[#E5EAF2]" />
                  </div>
                </div>
                <div className="h-4 w-12 rounded-full bg-[#E5EAF2]" />
              </div>
            </div>
          </div>

          {/* Centered Lock Chip */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/65 backdrop-blur-[0.5px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-blue)]/25 bg-white px-3.5 py-1 text-[11px] font-bold text-[var(--brand-blue)] shadow-sm">
              <Lock className="h-3 w-3" /> Unlocks when you subscribe
            </span>
          </div>
          <span className="text-[10px] text-[#5B6B82] text-center">Batch-specific job roles</span>
        </div>
      ),
    },
    {
      id: 'applications',
      title: 'Application tracking',
      benefit: 'Follow each application from shortlisted to interview and offer.',
      badge: 'Full plan',
      badgeClass: 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]',
      accentColor: '#098855',
      linkText: 'Unlock with plan',
      href: '/dashboard/student/applications',
      access: 'fullPlan' as const,
      preview: (isHovered: boolean) => (
        <div className="flex h-[250px] flex-col justify-between rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
            <span className="text-[11px] font-bold text-[#5B6B82]">Application Pipeline</span>
            <span className="rounded-full bg-white border border-[#E5EAF2] px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>

          {/* 4-step status stepper */}
          <div className="my-auto flex items-center justify-between text-[10px] font-bold py-4">
            <div className="flex flex-col items-center gap-1">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#098855] text-white shadow-sm">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>
              <span className="text-[#098855]">Applied</span>
            </div>
            <div className="h-0.5 flex-1 bg-[#098855]" />

            <div className="flex flex-col items-center gap-1">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-[#098855] text-white shadow-sm">
                <Check className="h-3.5 w-3.5 stroke-[3]" />
              </span>
              <span className="text-[#098855]">Shortlisted</span>
            </div>
            <div className={`h-0.5 flex-1 transition-colors duration-300 ${isHovered ? 'bg-[#00a2e5]' : 'bg-[#E5EAF2]'}`} />

            <div className="flex flex-col items-center gap-1">
              <span className={`grid h-6 w-6 place-items-center rounded-full transition-colors duration-300 ${isHovered ? 'bg-[#00a2e5] text-white' : 'border border-[#5B6B82] bg-white text-[#5B6B82]'}`}>
                3
              </span>
              <span className={isHovered ? 'text-[#00a2e5]' : 'text-[#5B6B82]'}>Interview</span>
            </div>
            <div className="h-0.5 flex-1 bg-[#E5EAF2]" />

            <div className="flex flex-col items-center gap-1">
              <span className="grid h-6 w-6 place-items-center rounded-full border border-[#E5EAF2] bg-white text-[#5B6B82]">
                4
              </span>
              <span className="text-[#5B6B82]">Offer</span>
            </div>
          </div>
          <span className="text-[10px] text-[#5B6B82] text-center">4 automated hiring milestones</span>
        </div>
      ),
    },
    {
      id: 'classes',
      title: 'Classes & trainers',
      benefit: 'Join batch classes and learn with your dedicated trainers.',
      badge: 'After sign-in',
      badgeClass: 'bg-[#098855]/15 text-[#098855]',
      accentColor: '#00a2e5',
      linkText: 'Preview classes',
      href: '/free-trial',
      access: 'signIn' as const,
      preview: () => (
        <div className="flex h-[250px] flex-col justify-between rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
            <span className="text-[11px] font-bold text-[#5B6B82]">Live Cohort Training</span>
            <span className="rounded-full bg-white border border-[#E5EAF2] px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>

          <div className="my-auto space-y-3 py-2">
            <div className="rounded-lg border border-[#E5EAF2] bg-white p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#0B1B33]">Trainer session</span>
                <span className="rounded-full bg-[#00a2e5]/15 px-2 py-0.5 text-[10px] font-bold text-[#00a2e5]">Soft Skills & Tech</span>
              </div>
              <p className="mt-1 text-[11px] text-[#5B6B82]">Trainer: Shiladitya Sinha • Dedicated Guide</p>
            </div>

            {/* Attendance progress meter */}
            <div className="rounded-lg border border-[#E5EAF2] bg-white p-2.5 space-y-1.5">
              <div className="flex justify-between text-[11px] text-[#5B6B82]">
                <span>Attendance progress</span>
                <span className="font-semibold text-[#098855]">Tracked live</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E5EAF2]">
                <div className="h-full w-3/4 rounded-full bg-[#098855]" />
              </div>
            </div>
          </div>
          <span className="text-[10px] text-[#5B6B82] text-center">Batch classes with live attendance</span>
        </div>
      ),
    },
    {
      id: 'assessments',
      title: 'Assessments',
      benefit: 'Take AI-enabled tests to measure readiness before real interviews.',
      badge: 'Full plan',
      badgeClass: 'bg-[var(--brand-blue)]/10 text-[var(--brand-blue)]',
      accentColor: '#fec40d',
      linkText: 'Unlock with plan',
      href: '/dashboard/student/assessments',
      access: 'fullPlan' as const,
      preview: (isHovered: boolean) => (
        <div className="flex h-[250px] flex-col justify-between rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
            <span className="text-[11px] font-bold text-[#5B6B82]">Evaluation Meter</span>
            <span className="rounded-full bg-white border border-[#E5EAF2] px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>

          <div className="my-auto space-y-3 py-2">
            <div className="rounded-lg border border-[#E5EAF2] bg-white p-3 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-[#00a2e5]/15 px-1.5 py-0.5 text-[11px] font-bold uppercase text-[#00a2e5] leading-none">
                    AI
                  </span>
                  <span className="text-[10px] font-bold text-[#5B6B82]">enabled</span>
                </div>
                <p className="text-xs font-bold text-[#0B1B33]">Readiness Score</p>
                <p className="text-[10px] text-[#5B6B82]">Speed & Accuracy</p>
              </div>
              <div className="text-right">
                <div className="h-2.5 w-20 rounded bg-[#E5EAF2] mb-1">
                  <div className={`h-full rounded bg-[var(--brand-blue)] transition-all duration-300 ${isHovered ? 'w-4/5' : 'w-3/5'}`} />
                </div>
                <span className="text-[11px] font-bold text-[var(--brand-blue)]">{isHovered ? '82% Ready' : '65% Score'}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-[#5B6B82] text-center">Comprehensive interview readiness</span>
        </div>
      ),
    },
    {
      id: 'batch',
      title: 'Batch of 12',
      benefit: 'Small cohorts with one coordinator staying with your group.',
      badge: 'Public cohort info',
      badgeClass: 'bg-[#00a2e5]/15 text-[#00a2e5]',
      accentColor: '#1b52a4',
      linkText: 'View batch status',
      href: '#plans',
      access: 'public' as const,
      preview: (isHovered: boolean) => (
        <div className="flex h-[250px] flex-col justify-between rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5">
          <div className="flex items-center justify-between border-b border-[#E5EAF2] pb-2">
            <span className="text-[11px] font-bold text-[#5B6B82]">Cohort Ring (12 Seats)</span>
            <span className="rounded-full bg-white border border-[#E5EAF2] px-2 py-0.5 text-[9px] font-bold text-[#5B6B82]">
              Sample preview
            </span>
          </div>

          {/* Fixed square area with center coordinator and true circle */}
          <div className="my-auto py-1">
            <div className="relative mx-auto flex h-[140px] w-[140px] items-center justify-center">
              {/* Center coordinator avatar */}
              <div className="flex flex-col items-center justify-center pointer-events-none">
                <div
                  className={`grid h-8 w-8 place-items-center rounded-full transition-transform ${
                    isHovered ? 'bg-[#00a2e5] text-white scale-110' : 'bg-[#1b52a4] text-white'
                  } shadow-sm`}
                >
                  <Users className="h-4 w-4" />
                </div>
                <span className="mt-1 text-[8px] font-bold text-[#1b52a4] leading-none">Coordinator</span>
              </div>

              {/* 12 outer dots evenly on a true circle (30° apart, radius 48px, dot size 10px) */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = ((i * 30 - 90) * Math.PI) / 180;
                const radius = 48;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isTaken = openSeats != null ? i < (maxSeats - openSeats) : i < 2;
                return (
                  <div
                    key={i}
                    className={`absolute h-2.5 w-2.5 rounded-full transition-all ${
                      isTaken
                        ? 'bg-[#1b52a4]'
                        : 'border-2 border-[#098855] bg-[#098855]/20'
                    }`}
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                    title={`Seat ${i + 1}: ${isTaken ? 'Reserved' : 'Open'}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Seats open caption below the ring with >=12px clearance from ring and from box border */}
          <div className="mb-0.5 text-center text-xs font-bold text-[#098855]">
            {batchLoading ? 'Loading cohort seats...' : openSeats != null ? `${openSeats} of ${maxSeats} seats open` : '10 of 12 seats open'}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="desk" className="scroll-mt-[88px] w-full bg-[#F7F9FC] py-14" aria-label="Placement desk tools">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="YOUR PLACEMENT DESK"
            title="Everything in your placement desk"
            subtitle="Real tools designed specifically for your 60-day journey from preparation to offers."
          />
        </Reveal>

        {/* 6 Feature Cards (3×2 Desktop, 2×3 Tablet, 1×6 Mobile) - Equal height in each row */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {features.map((feat, index) => {
          const isHovered = hoveredCard === feat.id;
          return (
            <Reveal key={feat.id} delay={index * 0.04} className="flex h-full">
              <div
                role="button"
                tabIndex={0}
                onClick={() => {
                  const featureObj = {
                    id: feat.id,
                    href: feat.href,
                    title: feat.title,
                    caption: '',
                    description: feat.benefit,
                    access: feat.access,
                    tone: 'blue' as const,
                    group: 'student' as const,
                  };
                  openFeature(featureObj);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const featureObj = {
                      id: feat.id,
                      href: feat.href,
                      title: feat.title,
                      caption: '',
                      description: feat.benefit,
                      access: feat.access,
                      tone: 'blue' as const,
                      group: 'student' as const,
                    };
                    openFeature(featureObj);
                  }
                }}
                onMouseEnter={() => setHoveredCard(feat.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] border bg-white p-6 shadow-[0_6px_20px_rgba(11,27,51,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(11,27,51,0.08)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)] ${
                  isHovered ? 'border-[#00a2e5]/50' : 'border-[#E5EAF2]'
                }`}
              >
                {/* Colored top accent bar */}
                <div
                  className="absolute left-0 top-0 h-1.5 w-full transition-opacity"
                  style={{ backgroundColor: feat.accentColor }}
                />

                <div>
                  {/* Status badge and title */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-[17px] font-bold text-[var(--ink)] leading-snug">
                      {feat.id === 'jobs' ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="rounded-full bg-[var(--brand-blue)]/10 px-1.5 py-0.5 text-[11px] font-bold uppercase text-[var(--brand-blue)] leading-none">
                            AI
                          </span>
                          <span>Matched jobs</span>
                        </span>
                      ) : feat.id === 'assessments' ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="rounded-full bg-[var(--brand-blue)]/10 px-1.5 py-0.5 text-[11px] font-bold uppercase text-[var(--brand-blue)] leading-none">
                            AI
                          </span>
                          <span>Assessments</span>
                        </span>
                      ) : (
                        feat.title
                      )}
                    </h3>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${feat.badgeClass}`}>
                      {feat.badge}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed sm:min-h-[36px]">
                    {feat.benefit}
                  </p>

                  {/* HTML/SVG Mini Preview */}
                  <div className="my-4">{feat.preview(isHovered)}</div>
                </div>

                {/* Bottom action trigger with varied contextual link text */}
                <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[var(--brand-blue)] transition-colors group-hover:text-[var(--brand-sky)]">
                  <span>{feat.linkText}</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Reveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}
