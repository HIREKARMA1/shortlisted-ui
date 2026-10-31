'use client';

import { useState } from 'react';
import { faqs } from '@/lib/home/content';
import { useShell } from './ShellContext';

export function FaqAndContact() {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  const { setContactOpen } = useShell();

  return (
    <section id="faq" className="scroll-mt-20 mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h2 className="text-lg font-semibold text-[var(--ink)]">FAQ</h2>
      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_240px]">
        <div className="space-y-2 lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
          {faqs.map((item) => {
            const expanded = open === item.id;
            return (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm font-semibold text-[var(--ink)]"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : item.id)}
                >
                  {item.q}
                  <span aria-hidden>{expanded ? '−' : '+'}</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-200 ${expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                  <div className="overflow-hidden">
                    <p className="px-3 pb-3 text-sm leading-relaxed text-[var(--muted)]">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <aside className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--ink)]">Still have questions?</h3>
            <p className="mt-1 text-sm text-[var(--muted)]">Send a note and we will reply.</p>
          </div>
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="mt-4 rounded-full bg-[var(--brand-orange)] py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]"
          >
            Contact us
          </button>
        </aside>
      </div>
    </section>
  );
}
