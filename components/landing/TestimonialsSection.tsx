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

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  const { t } = useTranslation();

  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-line-default bg-white py-16 sm:py-20">
      <PageContainer>
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{t('landing.testimonials.eyebrow')}</p>
          <h2 className="section-title mt-2">{t('landing.testimonials.title')}</h2>
          <p className="mt-3 text-ink-muted">{t('landing.testimonials.subtitle')}</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.id} className="card-surface relative p-6">
              <Quote className="absolute right-5 top-5 h-5 w-5 text-brand-blue/20" />
              <div className="flex items-center gap-3">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-14 w-14 rounded-full border border-line-default object-cover"
                />
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-primary">{item.name}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{item.batch_name}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-secondary">{item.feedback}</p>
            </article>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
