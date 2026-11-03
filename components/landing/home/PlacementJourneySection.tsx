'use client';

import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from 'react';
import { Check, CheckCircle2, Clock3, LockKeyhole } from 'lucide-react';
import { PrimaryLink } from './primitives';
import { useHome } from './HomeProvider';

type StageBadge = 'AI' | 'Coordinator';
type AccessTag = 'Unlocks with full plan' | 'Free to start' | '';

type Stage = {
  id: string;
  name: string;
  title: string;
  outcome: string;
  you: string[];
  shortlisted: { text: string; badge: StageBadge }[];
  accessTag: AccessTag;
};

const STAGES: Stage[] = [
  {
    id: 'profile',
    name: 'Set up profile',
    title: 'Set up your profile',
    outcome: 'Tell Shortlisted your skills, college and the roles you want.',
    you: [
      'Register in English, Hindi or Odia',
      'Add your skills, college and target roles',
    ],
    shortlisted: [
      { text: 'Builds your readiness profile from your skills, eligibility and career preferences.', badge: 'AI' },
      { text: 'Introduces your batch of up to 12 and its coordinator after you subscribe.', badge: 'Coordinator' },
    ],
    accessTag: 'Free to start',
  },
  {
    id: 'readiness',
    name: 'Check readiness',
    title: 'Check your readiness',
    outcome: 'See where you stand and what to improve.',
    you: [
      'Take the readiness assessments',
      'Review your strengths and skill gaps',
    ],
    shortlisted: [
      { text: 'Assesses your skills and shows your strengths, skill gaps and placement readiness.', badge: 'AI' },
      { text: 'Helps you understand your results and what to work on next.', badge: 'Coordinator' },
    ],
    // TODO: confirm with the team whether assessments are free or part of the paid plan.
    accessTag: '',
  },
  {
    id: 'prepare',
    name: 'Prepare',
    title: 'Prepare for real hiring',
    outcome: 'Get ready for real interviews and applications, not just theory.',
    you: ['Practise interviews and refine your resume and profile', 'Work on your communication and interview approach'],
    shortlisted: [
      { text: 'Gives you interview practice and assessments to measure your progress.', badge: 'AI' },
      { text: 'Guides your resume, communication and interview approach.', badge: 'Coordinator' },
    ],
    accessTag: 'Unlocks with full plan',
  },
  {
    id: 'matching',
    name: 'Start applying',
    title: 'Apply to jobs assigned to your batch',
    outcome: 'Focus on openings that fit your profile instead of applying randomly.',
    you: ['Review the DISHA jobs assigned to your batch', 'Apply with one click to the roles that fit you'],
    shortlisted: [
      { text: 'Matches live DISHA openings to your profile, skills, eligibility and readiness.', badge: 'AI' },
      { text: 'Guides your applications and follow-ups.', badge: 'Coordinator' },
    ],
    accessTag: 'Unlocks with full plan',
  },
  {
    id: 'interview',
    name: 'Interview',
    title: 'Interview with support',
    outcome: 'Know where each application stands and what to do next.',
    you: ['Track shortlist and interview status in your dashboard', 'Prepare for each interview before you attend'],
    shortlisted: [
      { text: 'Keeps your shortlist and interview status updated in your dashboard, 24/7.', badge: 'AI' },
      { text: 'Helps you prepare for interviews and follow up afterwards.', badge: 'Coordinator' },
    ],
    accessTag: 'Unlocks with full plan',
  },
  {
    id: 'offer',
    name: 'Get placed',
    title: 'Track offers and get placed',
    outcome: 'Stay supported through offers until you join a role.',
    you: ['Track your offers and selection status', 'Follow up with your coordinator on next steps'],
    shortlisted: [
      { text: 'Shows your applications, interviews and offers in one place, so you always know where you stand.', badge: 'AI' },
      { text: 'Supports your follow-ups and next steps until you join a role.', badge: 'Coordinator' },
    ],
    accessTag: 'Unlocks with full plan',
  },
];

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
      <div className="journey-stepper-tabs relative z-10 grid grid-cols-6">
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
              aria-label={`Stage ${index + 1}: ${stage.name}`}
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
            </button>
          );
        })}
      </div>
    </div>
  );
}

function BulletList({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={`journey-bullet-list ${className ?? ''}`}>{children}</ul>;
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
      className={`journey-stage-content ${isActive ? 'journey-stage-active' : 'journey-stage-inactive'}`}
      role="region"
      aria-labelledby={`journey-stage-title-${stage.id}`}
      aria-hidden={isActive ? 'false' : 'true'}
    >
      <div className="journey-stage-summary">
        <div className="journey-stage-number-line">
          <span className="journey-stage-number">0{index + 1}</span>
          <span className="journey-stage-total">of 6</span>
        </div>
        <h3 id={`journey-stage-title-${stage.id}`} className="journey-stage-title">{stage.title}</h3>
        <p className="journey-stage-outcome">{stage.outcome}</p>
        {stage.accessTag && (
          <span className={`journey-access-tag ${stage.accessTag === 'Free to start' ? 'journey-access-free' : 'journey-access-plan'}`}>
            {stage.accessTag === 'Free to start'
              ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
            {stage.accessTag}
          </span>
        )}
      </div>

      <div className="journey-stage-details">
        <section className="journey-stage-section" aria-labelledby={`journey-you-${stage.id}`}>
          <h4 id={`journey-you-${stage.id}`} className="journey-panel-heading">What you do</h4>
          <BulletList className={stage.you.length > 2 ? 'journey-bullet-list-three' : 'journey-bullet-list-two'}>
            {stage.you.map((item) => (
              <li key={item} className="journey-task-card">
                <CheckCircle2 className="journey-bullet-icon" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </BulletList>
        </section>

        <section className="journey-stage-section" aria-labelledby={`journey-shortlisted-${stage.id}`}>
          <h4 id={`journey-shortlisted-${stage.id}`} className="journey-panel-heading journey-help-block-heading">How you get help</h4>
          <ul className="journey-help-list">
            {stage.shortlisted.map((item) => (
              <li key={item.text} className="journey-help-row">
                <div className="journey-help-label-column">
                  <p className="journey-help-label">
                    <span className={`journey-help-dot ${item.badge === 'AI' ? 'journey-help-dot-ai' : 'journey-help-dot-coordinator'}`} aria-hidden="true" />
                    {item.badge === 'AI' ? 'AI' : 'Your coordinator'}
                  </p>
                  <p className="journey-help-descriptor">
                    {item.badge === 'AI' ? 'Automatic, 24/7' : 'A real person for your batch'}
                  </p>
                </div>
                <p className="journey-help-description">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>
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
          <strong>Try Shortlisted free.</strong> Explore first, then subscribe once to unlock your batch of 12, a dedicated coordinator, AI-matched jobs and application tracking.
        </p>
      </div>
      <PrimaryLink
        href={href}
        className="journey-trial-cta w-full min-h-12 shrink-0 bg-gradient-to-r from-[#f58020] to-[#fec40d] font-bold text-[#0B1B33] shadow-[0_8px_20px_rgba(245,128,32,0.22)] hover:-translate-y-px hover:shadow-[0_10px_24px_rgba(245,128,32,0.3)] min-[641px]:w-auto min-[641px]:min-h-11"
      >
        Try for Free
      </PrimaryLink>
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
  };

  useEffect(() => {
    if (window.matchMedia('(min-width: 768px)').matches) return;
    tabRefs.current[activeStage]?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeStage, prefersReducedMotion]);

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

  return (
    <section
      ref={sectionRef}
      id="journey"
      aria-labelledby="journey-heading"
      className="journey-section scroll-mt-[88px] border-y bg-white py-14"
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
          overflow: hidden;
          color: var(--journey-ink);
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(15, 40, 90, 0.08);
        }
        .journey-card-content-stack {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: max-content;
          align-items: stretch;
        }
        .journey-stage-content {
          grid-area: 1 / 1 / 2 / 2;
          display: grid;
          grid-template-columns: 300px minmax(0, 1fr);
          align-items: stretch;
          min-width: 0;
          color: var(--journey-ink);
          opacity: 0;
          transform: translateY(8px);
          visibility: hidden;
          transition: opacity 200ms ease, transform 200ms ease, visibility 0s linear 200ms;
        }
        .journey-stage-active {
          visibility: visible;
          opacity: 1;
          transform: translateY(0);
          transition: opacity 200ms ease, transform 200ms ease, visibility 0s;
        }
        .journey-stage-inactive {
          pointer-events: none;
        }
        .journey-stage-summary {
          display: flex;
          min-width: 0;
          flex-direction: column;
          justify-content: space-between;
          gap: 16px;
          padding: 28px;
          color: #ffffff;
          background: linear-gradient(145deg, #1553a5, #1e6fd0);
        }
        .journey-stage-number-line { display: flex; align-items: baseline; gap: 12px; }
        .journey-stage-number {
          color: #ffffff;
          font-size: 56px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
          font-variant-numeric: tabular-nums;
        }
        .journey-stage-total {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 500;
        }
        .journey-stage-title {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }
        .journey-stage-outcome {
          color: #ffffff;
          font-size: 15px;
          line-height: 1.5;
        }
        .journey-access-tag {
          display: inline-flex;
          min-height: 40px;
          flex: 0 0 auto;
          align-self: flex-start;
          align-items: center;
          gap: 7px;
          border: 1px solid transparent;
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 14px;
          font-weight: 600;
        }
        .journey-section .journey-eyebrow,
        .journey-section .journey-panel-heading {
          color: var(--journey-blue);
        }
        .journey-section .journey-heading-hyphen {
          font-family: system-ui, sans-serif;
        }
        .journey-section .journey-subtitle {
          color: var(--journey-muted);
        }
        .journey-stage-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
          gap: 24px;
          padding: 24px 28px;
        }
        .journey-stage-section { min-width: 0; }
        .journey-panel-heading {
          margin-bottom: 12px;
          color: #1e3a8a;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          line-height: 1.4;
          text-transform: uppercase;
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
        .journey-section .journey-bullet-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .journey-section .journey-bullet-list-three { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .journey-section .journey-task-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          color: #0f172a;
          background: #f8fafc;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.5;
        }
        .journey-bullet-icon {
          width: 20px;
          height: 20px;
          flex: 0 0 auto;
          margin-top: 3px;
          color: #1b52a4;
        }
        .journey-section .journey-access-free {
          border-color: #86c9a4;
          color: #166534;
          background: #ffffff;
        }
        .journey-section .journey-access-plan {
          border-color: #f2c879;
          color: #854d0e;
          background: #ffffff;
        }
        .journey-section .journey-help-list {
          overflow: hidden;
          margin: 0;
          padding: 0;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: #ffffff;
          list-style: none;
        }
        .journey-section .journey-help-block-heading { font-size: 13px; }
        .journey-section .journey-help-row {
          display: grid;
          grid-template-columns: 190px minmax(0, 1fr);
          align-items: start;
          column-gap: 24px;
          min-width: 0;
          padding: 16px 20px;
        }
        .journey-section .journey-help-row + .journey-help-row { border-top: 1px solid #e2e8f0; }
        .journey-help-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #0f172a;
          font-size: 16px;
          font-weight: 700;
          line-height: 1.5;
        }
        .journey-help-dot {
          width: 8px;
          height: 8px;
          flex: 0 0 auto;
          border-radius: 50%;
        }
        .journey-help-dot-ai { background: #1e6fd0; }
        .journey-help-dot-coordinator { background: #d97706; }
        .journey-help-descriptor {
          margin-top: 2px;
          color: #475569;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.4;
        }
        .journey-help-description {
          min-width: 0;
          color: #1e293b;
          font-size: 16px;
          font-weight: 400;
          line-height: 1.6;
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
        @media (max-width: 767px) {
          .journey-section .journey-stepper { overflow-x: auto; overscroll-behavior-x: contain; scrollbar-width: thin; }
          .journey-section .journey-stepper-tabs { min-width: 780px; }
          .journey-section .journey-track { top: 18px; }
          .journey-stage-content { grid-template-columns: minmax(0, 1fr); }
          .journey-stage-summary { gap: 16px; padding: 20px; }
          .journey-stage-number { font-size: 40px; }
          .journey-stage-title { font-size: 24px; }
          .journey-stage-details { gap: 24px; padding: 20px; }
          .journey-section .journey-bullet-list-three { grid-template-columns: minmax(0, 1fr); }
          .journey-section .journey-bullet-list { grid-template-columns: minmax(0, 1fr); }
          .journey-section .journey-help-row { grid-template-columns: minmax(0, 1fr); gap: 6px; padding: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .journey-section .journey-stage-content { transition: none; transform: none; }
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
            Your placement journey, step by step
          </h2>
          <p className="journey-subtitle mt-2 mb-10 max-w-[720px] text-base leading-relaxed">
            Six clear stages take you from building your profile to tracking offers. AI-matched jobs, assessments and a dedicated coordinator guide every step, in a batch of 12.
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
          className="journey-card mt-6 overflow-hidden rounded-[20px] border"
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
        </div>

        <TrialStrip href={trialCtaHref} />
      </div>
    </section>
  );
}
