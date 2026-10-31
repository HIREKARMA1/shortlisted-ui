'use client';

import { CreditCard, Sparkles, UserRound, UserPlus } from 'lucide-react';
import { howSteps } from '@/lib/home/content';

const icons = [UserPlus, Sparkles, UserRound, CreditCard];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h2 className="text-lg font-semibold text-[var(--ink)]">How it works</h2>
      <ol className="relative mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="absolute left-6 right-6 top-7 hidden h-px bg-[var(--border)] lg:block" aria-hidden />
        {howSteps.map((step, index) => {
          const Icon = icons[index];
          return (
            <li key={step.id} className="group relative">
              <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_8px_20px_rgba(11,27,51,0.04)]">
                <span className="relative z-10 grid h-8 w-8 place-items-center rounded-full bg-[var(--brand-blue)] text-xs font-bold text-white">
                  {index + 1}
                </span>
                <Icon className="mt-3 h-5 w-5 text-[var(--brand-sky)]" strokeWidth={1.75} aria-hidden />
                <p className="mt-2 text-sm font-semibold text-[var(--ink)]">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{step.line}</p>
              </div>
              <p className="pointer-events-none absolute left-1/2 top-0 z-10 hidden w-48 -translate-x-1/2 -translate-y-[110%] rounded-lg bg-[var(--ink)] px-2 py-1.5 text-center text-xs text-white group-hover:block">
                {step.tip}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
