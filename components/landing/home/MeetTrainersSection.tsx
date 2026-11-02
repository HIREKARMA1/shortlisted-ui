'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2 } from 'lucide-react';
import freeTrialEn from '@/content/en/freeTrial.json';
import { Reveal, SectionHeading } from './primitives';

// Verified training domain mapped from real freeTrial.json approach items
const trainerCurriculum: Record<string, { topic: string; description: string }> = {
  shiladitya: {
    topic: 'Soft Skills & Communication',
    description: 'Communication, confidence, interview skills, and professional workplace behaviour.',
  },
  dhananjay: {
    topic: 'Aptitude & Problem Solving',
    description: 'Quantitative ability, logical reasoning, and structured analytical problem-solving.',
  },
  rahul: {
    topic: 'Technical Fundamentals',
    description: 'Role-relevant technical concepts, live problem solving, and mock coding rounds.',
  },
};

export function MeetTrainersSection() {
  const trainers = freeTrialEn.trainers?.items ?? [];

  // Conditional render: only render if real trainer data exists
  if (!trainers.length) return null;

  return (
    <section id="trainers" className="scroll-mt-[88px] w-full bg-white border-y border-[#E5EAF2]/60 py-14" aria-label="Meet your trainers">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="INDUSTRY TRAINERS"
              title="Learn directly from industry mentors"
              subtitle="Experienced trainers who coach your batch through communication, aptitude, and live technical rounds."
            />
            <Link
              href="/free-trial#trainers"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--brand-blue)] hover:text-[var(--brand-sky)] transition-colors pb-1"
            >
              Explore training topics in free trial <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>

        {/* Grid of trainer cards: equal heights in row with p-6 padding */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {trainers.slice(0, 3).map((trainer, idx) => {
          const curriculum = trainerCurriculum[trainer.id] ?? {
            topic: trainer.role,
            description: 'Dedicated guidance throughout your 60-day placement preparation journey.',
          };

          return (
            <Reveal key={trainer.id} delay={idx * 0.06} className="flex h-full">
              <article className="group flex h-full w-full flex-col justify-between rounded-[20px] border border-[#E5EAF2] bg-white p-6 shadow-[0_4px_16px_rgba(11,27,51,0.03)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(11,27,51,0.07)]">
                <div>
                  {/* Top row: Avatar + Name + Left-aligned role pill */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img
                        src={trainer.imageUrl}
                        alt={trainer.name}
                        className="h-14 w-14 rounded-full object-cover border-2 border-[#E5EAF2] bg-[#F7F9FC] shadow-sm"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          if (e.currentTarget.nextElementSibling) {
                            (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'grid';
                          }
                        }}
                      />
                      <div
                        className="hidden h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[#1b52a4] to-[#00a2e5] text-lg font-bold text-white shadow-sm"
                        aria-hidden
                      >
                        {trainer.name.charAt(0)}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[17px] font-bold text-[var(--ink)] leading-snug">
                        {trainer.name}
                      </h3>
                      {/* Role pill aligned to the exact left edge under the trainer name */}
                      <div className="mt-1">
                        <span className="inline-block rounded-full bg-[var(--brand-blue)]/10 px-2.5 py-0.5 text-[11px] font-bold text-[var(--brand-blue)] leading-tight">
                          {trainer.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Real curriculum topic and description from freeTrial.json */}
                  <div className="mt-5 rounded-xl border border-[#E5EAF2] bg-[#F7F9FC] p-3.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[var(--ink)] mb-1">
                      <BookOpen className="h-3.5 w-3.5 text-[var(--brand-blue)]" />
                      <span>{curriculum.topic}</span>
                    </div>
                    <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                      {curriculum.description}
                    </p>
                  </div>

                  {/* Real batch mentorship commitments from freeTrial.json approach */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-[var(--ink)]">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#098855] shrink-0" />
                      <span>Interactive batch sessions & doubt clearing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#098855] shrink-0" />
                      <span>Direct feedback on interview readiness</span>
                    </div>
                  </div>
                </div>

                {/* Bottom link: aligned across all cards */}
                <div className="mt-6 pt-3 border-t border-[#E5EAF2]">
                  <Link
                    href="/free-trial#trainers"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-blue)] hover:text-[var(--brand-sky)] transition-colors"
                  >
                    <span>View preparation topics</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}

