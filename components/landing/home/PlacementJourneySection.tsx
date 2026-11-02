'use client';

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Check, Clock3 } from 'lucide-react';
import { PrimaryLink } from './primitives';
import { useHome } from './HomeProvider';

type StageBadge = 'AI' | 'Coordinator';

type Stage = {
  id: string;
  name: string;
  title: string;
  startDay: number;
  endDay: number;
  outcome: string;
  you: string[];
  shortlisted: { text: string; badge: StageBadge }[];
};

// TODO: Confirm these placeholder day ranges with product before publishing.
const STAGES: Stage[] = [
  {
    id: 'profile',
    name: 'Set up profile',
    title: 'Set up your profile',
    startDay: 1,
    endDay: 5,
    outcome: 'Profile ready, coordinator assigned.',
    you: ['Sign up and add your skills and career goals.'],
    shortlisted: [
      { text: 'Builds your readiness profile', badge: 'AI' },
      { text: 'Introduces your batch of 12 and your coordinator', badge: 'Coordinator' },
    ],
  },
  {
    id: 'readiness',
    name: 'Check readiness',
    title: 'Check your readiness',
    startDay: 6,
    endDay: 15,
    outcome: 'A clear picture of where you stand.',
    you: ['Take the assessments and review your results.'],
    shortlisted: [{ text: 'Shows your strengths and skill gaps', badge: 'AI' }],
  },
  {
    id: 'prepare',
    name: 'Prepare',
    title: 'Prepare',
    startDay: 16,
    endDay: 30,
    outcome: 'An interview-ready profile.',
    you: ['Work on your gaps and polish your resume.'],
    shortlisted: [
      { text: 'Guides your profile and next steps', badge: 'Coordinator' },
      { text: 'Gives you practice rounds', badge: 'AI' },
    ],
  },
  {
    id: 'matching',
    name: 'Get matched',
    title: 'Get matched',
    startDay: 31,
    endDay: 42,
    outcome: 'Applications that fit, not random ones.',
    you: ['Apply to the roles that suit you.'],
    shortlisted: [
      { text: 'Matches live jobs to your profile through DISHA', badge: 'AI' },
      { text: 'Tracks every application in real time', badge: 'AI' },
    ],
  },
  {
    id: 'interview',
    name: 'Interview',
    title: 'Interview',
    startDay: 43,
    endDay: 55,
    outcome: 'Confident interviews and a clear status.',
    you: ['Do mock rounds, then real interviews.'],
    shortlisted: [
      { text: 'Runs practice interviews with you', badge: 'AI' },
      { text: 'Gives feedback and shortlist updates', badge: 'Coordinator' },
    ],
  },
  {
    id: 'offer',
    name: 'Get placed',
    title: 'Get placed',
    startDay: 56,
    endDay: 60,
    outcome: 'Offers tracked from start to finish.',
    you: ['Review your offers and choose your next step.'],
    shortlisted: [
      { text: 'Tracks offers and next steps', badge: 'AI' },
      { text: 'Guides your decision', badge: 'Coordinator' },
    ],
  },
];

const DAY_RANGE = (stage: Stage) => `Days ${stage.startDay}–${stage.endDay}`;

function StageStepper({
  activeStage,
  onSelect,
  onKeyDown,
  setTabRef,
}: {
  activeStage: number;
  onSelect: (index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>, index: number) => void;
  setTabRef: (index: number, element: HTMLButtonElement | null) => void;
}) {
  const progress = (activeStage / (STAGES.length - 1)) * 100;

  return (
    <div
      role="tablist"
      aria-label="Placement roadmap stages"
      className="journey-stepper relative mt-4"
    >
      <div className="journey-track" aria-hidden="true">
        <span className="journey-track-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="relative z-10 grid grid-cols-6">
        {STAGES.map((stage, index) => {
          const isActive = index === activeStage;
          const isPast = index < activeStage;

          return (
            <button
              key={stage.id}
              id={`journey-tab-${stage.id}`}
              ref={(element) => setTabRef(index, element)}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="journey-stage-panel"
              aria-label={`Stage ${index + 1}: ${stage.title}, ${DAY_RANGE(stage)}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={`journey-step group flex min-h-11 flex-col items-center px-0.5 text-center focus-visible:outline-none ${
                isActive ? 'journey-step-active' : ''
              }`}
            >
              <span
                className={`journey-step-circle grid h-10 w-10 place-items-center rounded-full border text-sm font-bold tabular-nums transition-colors duration-200 max-[640px]:h-9 max-[640px]:w-9 ${
                  isActive
                    ? 'journey-step-circle-active'
                    : isPast
                      ? 'journey-step-circle-past'
                      : 'journey-step-circle-upcoming group-hover:border-[#1456a8]'
                }`}
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <span className="journey-step-name mt-2 text-[14.5px] font-semibold leading-tight">
                {stage.name}
              </span>
              <span className="journey-step-days mt-1 text-[13px] tabular-nums leading-none">
                {DAY_RANGE(stage)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BulletList({ children }: { children: ReactNode }) {
  return <ul className="journey-bullet-list flex flex-col gap-2">{children}</ul>;
}

function StageCard({
  stage,
  index,
  isActive,
}: {
  stage: Stage;
  index: number;
  isActive: boolean;
}) {
  return (
    <div
      className={`journey-stage-content grid grid-cols-1 content-start items-start gap-5 min-[901px]:grid-cols-[1.1fr_1fr_1.2fr] min-[901px]:gap-8 ${
        isActive ? 'journey-stage-active' : 'journey-stage-inactive'
      }`}
      aria-hidden={!isActive}
    >
      <div>
        <p className="journey-stage-kicker text-[13.5px] font-bold">
          Stage {index + 1} of 6 <span aria-hidden="true">·</span> {DAY_RANGE(stage)}
        </p>
        <h3 className="mt-1.5 text-[22px] font-extrabold leading-tight tracking-[-0.02em]">
          {stage.title}
        </h3>
        <p className="mt-3 flex items-start gap-2 text-[14.5px] leading-[1.45]">
          <Check className="journey-outcome-check mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <span>{stage.outcome}</span>
        </p>
      </div>

      <div>
        <h4 className="journey-list-heading mb-2 text-[13px] font-bold">What you do</h4>
        <BulletList>
          {stage.you.map((item) => (
            <li key={item} className="journey-bullet text-[15px] leading-[1.45]">
              {item}
            </li>
          ))}
        </BulletList>
      </div>

      <div>
        <h4 className="journey-list-heading mb-2 text-[13px] font-bold">What Shortlisted does</h4>
        <ul className="journey-shortlisted-list">
          {stage.shortlisted.map((item) => (
            <li key={item.text} className="journey-shortlisted-row">
              <span className={`journey-badge ${item.badge === 'AI' ? 'journey-badge-ai' : 'journey-badge-coordinator'}`}>
                {item.badge}
              </span>
              <span className="journey-shortlisted-copy">{item.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TrialStrip({ href }: { href: string }) {
  return (
    <div className="journey-trial-strip mt-4 flex flex-col gap-3 rounded-[14px] border px-4 py-3.5 sm:px-5 min-[781px]:flex-row min-[781px]:items-center min-[781px]:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span className="journey-trial-icon grid h-10 w-10 shrink-0 place-items-center rounded-xl" aria-hidden="true">
          <Clock3 className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <p className="text-[15px] leading-[1.45]">
          <strong>7-day free trial.</strong> Start free, then subscribe once for AI-matched jobs, assessments, application tracking and a dedicated coordinator in a batch of 12.
        </p>
      </div>
      <PrimaryLink
        href={href}
        className="journey-trial-cta w-full min-h-12 shrink-0 bg-gradient-to-r from-[#f58020] to-[#fec40d] font-bold text-[#0B1B33] shadow-[0_8px_20px_rgba(245,128,32,0.22)] hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(245,128,32,0.3)] min-[641px]:w-auto min-[641px]:min-h-11"
      >
        Start 7-day free trial
      </PrimaryLink>
      {/* TODO: Confirm with product exactly what the 7-day trial includes. */}
    </div>
  );
}

export function PlacementJourneySection() {
  const [activeStage, setActiveStage] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [holdUntil, setHoldUntil] = useState(0);
  const [resumeAfter, setResumeAfter] = useState(0);
  const [progressCycle, setProgressCycle] = useState(0);
  const [schedulerTick, setSchedulerTick] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const timerRef = useRef<number | null>(null);
  const timerStartedAtRef = useRef<number | null>(null);
  const remainingMsRef = useRef(6000);
  const isHoveredRef = useRef(false);
  const isFocusWithinRef = useRef(false);
  const { trialHref, dashboardHref, hideTrialPromos } = useHome();
  const trialCtaHref = hideTrialPromos ? dashboardHref : trialHref;
  const currentStage = STAGES[activeStage];

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();
    media.addEventListener('change', updatePreference);
    return () => media.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    const updateVisibility = () => setIsTabVisible(!document.hidden);
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const selectStage = (index: number) => {
    remainingMsRef.current = 6000;
    timerStartedAtRef.current = null;
    setHoldUntil(Date.now() + 12000);
    setActiveStage(index);
    setProgressCycle((cycle) => cycle + 1);
  };

  useEffect(() => {
    const now = Date.now();
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      if (timerStartedAtRef.current !== null) {
        remainingMsRef.current = Math.max(0, remainingMsRef.current - (now - timerStartedAtRef.current));
      }
      timerStartedAtRef.current = null;
    }

    if (prefersReducedMotion || !isInView || !isTabVisible || isHovered || isFocusWithin) return;

    const resumeDeadline = Math.max(holdUntil, resumeAfter);
    if (resumeDeadline > now) {
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setSchedulerTick((tick) => tick + 1);
      }, resumeDeadline - now);
      return () => {
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = null;
      };
    }

    timerStartedAtRef.current = now;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      timerStartedAtRef.current = null;
      remainingMsRef.current = 6000;
      setActiveStage((stage) => (stage + 1) % STAGES.length);
      setProgressCycle((cycle) => cycle + 1);
    }, remainingMsRef.current);

    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      if (timerStartedAtRef.current !== null) {
        remainingMsRef.current = Math.max(0, remainingMsRef.current - (Date.now() - timerStartedAtRef.current));
      }
      timerStartedAtRef.current = null;
    };
  }, [activeStage, holdUntil, isFocusWithin, isHovered, isInView, isTabVisible, prefersReducedMotion, resumeAfter, schedulerTick]);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleStepKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const next = (index + 1) % STAGES.length;
      selectStage(next);
      tabRefs.current[next]?.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const previous = (index - 1 + STAGES.length) % STAGES.length;
      selectStage(previous);
      tabRefs.current[previous]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      selectStage(0);
      tabRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const last = STAGES.length - 1;
      selectStage(last);
      tabRefs.current[last]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectStage(index);
    }
  };

  const handleFocusOut = (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    isFocusWithinRef.current = false;
    setIsFocusWithin(false);
    setResumeAfter(isHoveredRef.current ? 0 : Date.now() + 3000);
  };

  const isAutoplayPaused = prefersReducedMotion || !isInView || !isTabVisible || isHovered || isFocusWithin || Math.max(holdUntil, resumeAfter) > Date.now();

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-heading"
      className="journey-section scroll-mt-[88px] border-y bg-white py-14"
      data-autoplay-paused={isAutoplayPaused}
      onPointerEnter={() => {
        isHoveredRef.current = true;
        setIsHovered(true);
        setResumeAfter(0);
      }}
      onPointerLeave={() => {
        isHoveredRef.current = false;
        setIsHovered(false);
        setResumeAfter(isFocusWithinRef.current ? 0 : Date.now() + 3000);
      }}
      onFocusCapture={() => {
        isFocusWithinRef.current = true;
        setIsFocusWithin(true);
        setResumeAfter(0);
      }}
      onBlurCapture={handleFocusOut}
    >
      <style jsx global>{`
        .journey-section {
          --journey-bg: #ffffff;
          --journey-card: #ffffff;
          --journey-soft: #eef5fd;
          --journey-ink: #0b1b3b;
          --journey-muted: #51607a;
          --journey-border: #dde5f0;
          --journey-blue: #1456a8;
          --journey-sky: #0ea5e9;
          --journey-green: #0f7b4f;
          --journey-amber: #9a4a05;
          color: var(--journey-ink);
          background: var(--journey-bg);
          border-color: var(--journey-border);
        }
        .journey-card {
          position: relative;
          color: var(--journey-ink);
          background: var(--journey-card);
          border-color: var(--journey-border);
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05), 0 8px 24px rgba(15, 23, 42, 0.06);
        }
        .journey-card-content-stack {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: max-content;
          align-items: start;
        }
        .journey-stage-content {
          grid-area: 1 / 1 / 2 / 2;
          color: var(--journey-ink);
          transition: opacity 220ms ease, visibility 220ms ease;
        }
        .journey-stage-active {
          visibility: visible;
          opacity: 1;
        }
        .journey-stage-inactive {
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
        }
        .journey-stage-progress-track {
          position: absolute;
          right: 32px;
          bottom: 12px;
          left: 32px;
          height: 2px;
          overflow: hidden;
          border-radius: 2px;
          background: #e6f0fb;
          pointer-events: none;
        }
        .journey-stage-progress-fill {
          display: block;
          width: 100%;
          height: 100%;
          transform: scaleX(0);
          transform-origin: left center;
          animation: journey-autoplay-progress 6000ms linear forwards;
        }
        .journey-section[data-autoplay-paused='true'] .journey-stage-progress-fill {
          animation-play-state: paused;
        }
        @keyframes journey-autoplay-progress {
          to { transform: scaleX(1); }
        }
        .journey-section .journey-eyebrow,
        .journey-section .journey-stage-kicker {
          color: var(--journey-blue);
        }
        .journey-section .journey-heading-hyphen {
          font-family: system-ui, sans-serif;
        }
        .journey-section .journey-subtitle,
        .journey-section .journey-step-days,
        .journey-section .journey-list-heading {
          color: var(--journey-muted);
        }
        .journey-section .journey-track {
          position: absolute;
          z-index: 0;
          top: 20px;
          left: 8.333333%;
          width: 83.333334%;
          height: 3px;
          overflow: hidden;
          border-radius: 999px;
          background: var(--journey-border);
        }
        .journey-section .journey-track-fill {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #1456a8, #0ea5e9);
          transition: width 350ms ease;
        }
        .journey-section .journey-step-circle-upcoming {
          color: var(--journey-muted);
          border-color: var(--journey-border);
          background: var(--journey-bg);
        }
        .journey-section .journey-step-circle-past {
          color: var(--journey-blue);
          border-color: var(--journey-blue);
          background: #e6f0fb;
        }
        .journey-section .journey-step-circle-active {
          color: #ffffff;
          border-color: var(--journey-blue);
          background: var(--journey-blue);
          box-shadow: 0 0 0 5px rgba(14, 165, 233, 0.22);
        }
        .journey-section .journey-step-name {
          color: var(--journey-muted);
          transition: color 150ms ease;
        }
        .journey-section .journey-step-active .journey-step-name {
          color: var(--journey-ink);
        }
        .journey-section .journey-step:hover .journey-step-name {
          color: var(--journey-blue);
        }
        .journey-section .journey-outcome-check {
          color: var(--journey-green);
        }
        .journey-section .journey-bullet {
          position: relative;
          padding-left: 14px;
          color: var(--journey-muted);
        }
        .journey-section .journey-bullet::before {
          position: absolute;
          top: 0.55em;
          left: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--journey-sky);
          content: '';
        }
        .journey-section .journey-badge-ai {
          color: var(--journey-blue);
          background: #e6f0fb;
        }
        .journey-section .journey-badge-coordinator {
          color: var(--journey-amber);
          background: #fdf0d9;
        }
        .journey-section .journey-shortlisted-list {
          display: grid;
          row-gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .journey-section .journey-shortlisted-row {
          display: grid;
          grid-template-columns: 96px minmax(0, 1fr);
          column-gap: 12px;
          align-items: start;
        }
        .journey-section .journey-badge {
          display: inline-flex;
          width: fit-content;
          min-height: 22px;
          align-items: center;
          justify-content: center;
          justify-self: start;
          border-radius: 999px;
          padding: 2px 10px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
          text-align: center;
        }
        .journey-section .journey-shortlisted-copy {
          min-width: 0;
          color: var(--journey-muted);
          font-size: 15px;
          line-height: 1.45;
        }
        .journey-section .journey-trial-strip {
          color: var(--journey-ink);
          border-color: #cfe0f5;
          background: var(--journey-soft);
        }
        .journey-section .journey-trial-icon {
          color: var(--journey-blue);
          background: #e6f0fb;
        }
        .journey-section :is(button, a):focus-visible {
          outline: 2px solid var(--journey-blue);
          outline-offset: 3px;
        }
        @media (max-width: 640px) {
          .journey-section .journey-step-name,
          .journey-section .journey-step-days { display: none; }
          .journey-section .journey-track { top: 18px; }
          .journey-section .journey-shortlisted-row { grid-template-columns: 84px minmax(0, 1fr); }
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-section .journey-stage-content { transition-duration: 0.01ms; }
          .journey-section .journey-stage-progress-track { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-section *,
          .journey-section *::before,
          .journey-section *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6">
        <header>
          <p className="journey-eyebrow text-[12px] font-bold uppercase tracking-[0.08em]">
            Your placement journey
          </p>
          <h2
            id="journey-heading"
            className="mt-2 text-[clamp(1.65rem,3vw,2.15rem)] font-extrabold leading-tight tracking-[-0.02em]"
          >
            Your 60<span className="journey-heading-hyphen">-</span>day placement roadmap
          </h2>
          <p className="journey-subtitle mt-2 mb-10 max-w-[720px] text-base leading-relaxed">
            Six stages, with AI-matched jobs and a dedicated coordinator in a batch of 12.
          </p>
        </header>

        <StageStepper
          activeStage={activeStage}
          onSelect={selectStage}
          onKeyDown={handleStepKeyDown}
          setTabRef={(index, element) => {
            tabRefs.current[index] = element;
          }}
        />

        <div
          id="journey-stage-panel"
          role="tabpanel"
          aria-labelledby={`journey-tab-${currentStage.id}`}
          aria-live="polite"
          className="journey-card mt-4 rounded-[20px] border px-6 py-6 min-[901px]:px-8 min-[901px]:py-8"
        >
          <div className="journey-card-content-stack">
            {STAGES.map((stage, index) => (
              <StageCard
                key={stage.id}
                stage={stage}
                index={index}
                isActive={index === activeStage}
              />
            ))}
          </div>
          {!prefersReducedMotion && (
            <div className="journey-stage-progress-track" aria-hidden="true">
              <span
                key={`${activeStage}-${progressCycle}`}
                className="journey-stage-progress-fill"
                style={{ backgroundColor: 'var(--journey-blue)' }}
              />
            </div>
          )}
        </div>

        <TrialStrip href={trialCtaHref} />
      </div>
    </section>
  );
}
