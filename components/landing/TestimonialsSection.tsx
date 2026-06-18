'use client';

import { Quote } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';

type Testimonial = {
  id: string;
  name: string;
  batch_name: string;
  feedback: string;
  image_url: string;
};

const CARD_THEMES = [
  {
    quoteColor: 'text-brand-blue',
    batchText: 'text-brand-blue',
    initialsBg: 'bg-brand-blue/10',
    initialsText: 'text-brand-blue',
    glowColor: 'rgba(27,82,164,0.08)',
    borderColor: 'border-brand-blue/10',
  },
  {
    quoteColor: 'text-brand-orange',
    batchText: 'text-brand-orange',
    initialsBg: 'bg-brand-orange/10',
    initialsText: 'text-brand-orange',
    glowColor: 'rgba(245,128,32,0.08)',
    borderColor: 'border-brand-orange/10',
  },
  {
    quoteColor: 'text-brand-green',
    batchText: 'text-brand-green',
    initialsBg: 'bg-brand-green/10',
    initialsText: 'text-brand-green',
    glowColor: 'rgba(9,136,85,0.08)',
    borderColor: 'border-brand-green/10',
  },
  {
    quoteColor: 'text-brand-sky',
    batchText: 'text-brand-sky',
    initialsBg: 'bg-brand-sky/10',
    initialsText: 'text-brand-sky',
    glowColor: 'rgba(0,162,229,0.08)',
    borderColor: 'border-brand-sky/10',
  },
];

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useTranslation();

  if (testimonials.length === 0) return null;

  // Build a base list that repeats testimonials if needed to fill the screen width
  const baseTestimonials = [...testimonials];
  while (baseTestimonials.length > 0 && baseTestimonials.length < 6) {
    baseTestimonials.push(...testimonials);
  }

  const renderTrack = (trackId: string) => (
    <div className="flex animate-sl-marquee gap-6 py-8 pr-6 group-hover:[animation-play-state:paused]">
      {baseTestimonials.map((item, idx) => {
        const theme = CARD_THEMES[idx % CARD_THEMES.length];
        return (
          <article
            key={`${item.id}-${trackId}-${idx}`}
            className={`relative flex w-[380px] shrink-0 flex-col justify-between rounded-2xl border ${theme.borderColor} bg-white p-8 transition-transform duration-300 hover:scale-[1.02]`}
            style={{
              boxShadow: `0 12px 35px ${theme.glowColor}, 0 2px 8px rgba(0, 0, 0, 0.04)`,
            }}
          >
            <div className="flex flex-col items-center text-center">
              <Quote className={`h-9 w-9 ${theme.quoteColor}`} fill="currentColor" />
              <p className="mt-5 text-left text-[14px] leading-relaxed text-ink-secondary w-full min-h-[80px]">
                {item.feedback}
              </p>
            </div>
            
            <div className="mt-6 flex items-center gap-4 border-t border-line-default pt-5 w-full">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-12 w-12 rounded-full border border-line-default object-cover shrink-0"
                />
              ) : (
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line-default text-sm font-bold ${theme.initialsBg} ${theme.initialsText}`}>
                  {item.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <h4 className="font-display font-bold text-ink-primary">{item.name}</h4>
                <p className={`text-xs font-semibold uppercase tracking-wider ${theme.batchText}`}>
                  {item.batch_name}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );

  return (
    <section className="border-t border-line-default bg-white py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-brand-blue sm:text-5xl">
            {t('landing.testimonials.title')}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ink-secondary sm:text-lg">
            {t('landing.testimonials.subtitle')}
          </p>
        </div>

        {/* Infinite scrolling marquee wrapper */}
        <div className="relative w-full overflow-hidden mt-6 group">
          {/* Soft edge-fade overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-white via-white/50 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-white via-white/50 to-transparent" />

          <div className="flex w-max">
            {renderTrack('t1')}
            {renderTrack('t2')}
          </div>
        </div>
      </div>
    </section>
  );
}
