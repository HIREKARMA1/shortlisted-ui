'use client';

import { useState } from 'react';
import { faqs } from '@/lib/home/content';
import { Reveal, SectionHeading } from './primitives';

export function FaqAndContact() {
  const [open, setOpen] = useState<string[]>(faqs[0] ? [faqs[0].id] : []);

  return (
    <section id="faq" className="scroll-mt-[88px] w-full bg-[#F7F9FC] py-14" aria-label="Frequently asked questions">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              eyebrow="HELP"
              title="Frequently asked questions"
              subtitle="Quick answers to what opens after sign-in and what unlocks with your batch plan."
            />
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-sm font-bold text-[#00a2e5] hover:text-[#1b52a4] transition-colors pb-1"
            >
              Have another question? Contact us →
            </a>
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 items-start">
          {faqs.map((item, index) => {
            const expanded = open.includes(item.id);
            return (
              <Reveal key={item.id} delay={index * 0.03}>
                <div
                  className={`rounded-[20px] border transition-all duration-200 ${
                    expanded
                      ? 'border-[#00a2e5]/50 bg-white shadow-[0_8px_24px_rgba(0,162,229,0.08)]'
                      : 'border-[#E5EAF2] bg-white hover:bg-[#F7F9FC] hover:border-[#00a2e5]/30 shadow-[0_2px_12px_rgba(11,27,51,0.02)]'
                  }`}
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3.5 p-5 text-left text-[15px] font-bold text-[var(--ink)] leading-snug"
                    aria-expanded={expanded}
                    onClick={() => setOpen((current) => (
                      expanded ? current.filter((id) => id !== item.id) : [...current, item.id]
                    ))}
                  >
                    <span>{item.q}</span>
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-all duration-200 ${
                        expanded
                          ? 'bg-[#1b52a4] text-white shadow-sm'
                          : 'bg-[#00a2e5]/15 text-[#00a2e5]'
                      }`}
                      aria-hidden
                    >
                      {expanded ? '−' : '+'}
                    </span>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                      expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p className="px-5 pb-5 text-[14px] leading-relaxed text-[var(--muted)]">
                        {item.a}
                      </p>
                    </div>
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
