'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { carousel, categories } from '@/lib/home/content';
import { featureIcons, toneStyles } from './featureStyles';
import { useFeatureGate } from './useFeatureGate';
import { Reveal, SectionHeading } from './primitives';

function CardArt({ id }: { id: string }) {
  if (id === 'trial') {
    return (
      <svg viewBox="0 0 88 88" className="h-[88px] w-[88px] opacity-90" aria-hidden>
        <rect x="18" y="20" width="46" height="52" rx="8" fill="white" fillOpacity="0.18" />
        <path d="M28 34h26M28 44h20M28 54h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <circle cx="62" cy="28" r="12" fill="#fec40d" />
        <path d="M58 28l3 3 6-7" stroke="#0B1B33" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (id === 'profile') {
    return (
      <svg viewBox="0 0 88 88" className="h-[88px] w-[88px] opacity-90" aria-hidden>
        <rect x="22" y="16" width="44" height="56" rx="8" fill="white" fillOpacity="0.18" />
        <circle cx="44" cy="34" r="10" fill="white" fillOpacity="0.55" />
        <path d="M30 58c4-8 24-8 28 0" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (id === 'jobs') {
    return (
      <svg viewBox="0 0 88 88" className="h-[88px] w-[88px] opacity-90" aria-hidden>
        <rect x="20" y="30" width="48" height="34" rx="8" fill="white" fillOpacity="0.18" />
        <path d="M34 30v-4a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v4" stroke="white" strokeWidth="3" />
        <circle cx="62" cy="28" r="12" fill="#098855" />
        <path d="M58 28l3 3 6-7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 88 88" className="h-[88px] w-[88px] opacity-90" aria-hidden>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x = 44 + Math.cos(angle) * 26;
        const y = 44 + Math.sin(angle) * 26;
        return <circle key={i} cx={x} cy={y} r="3.2" fill="white" fillOpacity="0.75" />;
      })}
      <circle cx="44" cy="44" r="10" fill="white" fillOpacity="0.35" />
      <circle cx="44" cy="40" r="4" fill="white" />
      <path d="M37 52c2-5 12-5 14 0" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function FeaturedCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { openFeature } = useFeatureGate();
  const count = carousel.length;
  const touchX = useRef(0);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), 5000);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  return (
    <section
      className="bg-white py-12"
      aria-label="Featured"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchX.current = event.touches[0].clientX;
      }}
      onTouchEnd={(event) => {
        const delta = event.changedTouches[0].clientX - touchX.current;
        if (delta > 40) setIndex((current) => (current - 1 + count) % count);
        if (delta < -40) setIndex((current) => (current + 1) % count);
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHeading
              eyebrow="Featured"
              title="Start with what matters most"
              subtitle="A short path from the free trial page to matched jobs and your batch."
            />
            <div className="flex gap-2">
              <button type="button" aria-label="Previous" onClick={() => setIndex((current) => (current - 1 + count) % count)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Next" onClick={() => setIndex((current) => (current + 1) % count)} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)]">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {carousel.map((card, cardIndex) => {
            const feature = categories.find((item) => item.id === card.featureId);
            const Icon = featureIcons[card.featureId];
            const tone = toneStyles[card.tone];
            const active = cardIndex === index;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => feature && openFeature(feature)}
                className={`relative flex h-[190px] overflow-hidden rounded-[20px] bg-gradient-to-br ${tone.gradient} p-4 text-left text-white transition duration-200 hover:-translate-y-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)] ${
                  active ? 'scale-[1.02] shadow-[0_18px_40px_rgba(11,27,51,0.22)]' : 'shadow-[0_10px_24px_rgba(11,27,51,0.1)]'
                }`}
              >
                <div className="pointer-events-none absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)', backgroundSize: '12px 12px' }} aria-hidden />
                <div className="pointer-events-none absolute -right-6 -top-10 h-28 w-28 rotate-45 bg-white/15 blur-sm" aria-hidden />
                <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="mt-4 block text-base font-semibold leading-snug sm:text-lg">{card.title}</span>
                  <span className="mt-1 block text-sm text-white/85">{card.line}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 text-sm font-semibold">
                    Explore <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
                <div className="relative z-10 -mr-1 self-end">
                  <CardArt id={card.id} />
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex justify-center gap-1.5" role="tablist" aria-label="Featured slides">
          {carousel.map((card, dot) => (
            <button
              key={card.id}
              type="button"
              aria-label={`Show ${card.title}`}
              onClick={() => setIndex(dot)}
              className={`h-2 w-2 rounded-full ${dot === index ? 'bg-[var(--brand-sky)]' : 'bg-[var(--border)]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
