'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { MarketingPageHeader } from '@/components/layout/MarketingPageHeader';

export type LegalPageKey = 'terms' | 'privacy' | 'refund';

type LegalSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

type LegalPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  closing?: string;
};

function readLegalContent(value: unknown): LegalPageContent | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as LegalPageContent;
  if (!data.title || !Array.isArray(data.sections)) return null;
  return data;
}

export function LegalPageView({ pageKey }: { pageKey: LegalPageKey }) {
  const { t, tRaw } = useTranslation();
  const content = readLegalContent(tRaw(`pages.legal.${pageKey}`));

  if (!content) return null;

  const showContactLink = pageKey === 'privacy' && content.closing;

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <MarketingPageHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.intro} />

      <section className="border-b border-line-default bg-white">
        <div className="page-container max-w-3xl py-12 sm:py-16">
          <div className="space-y-10">
            {content.sections.map((section) => (
              <article key={section.title}>
                <h2 className="font-display text-xl font-bold text-ink-primary sm:text-2xl">{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>

          {content.closing && (
            <p className="mt-10 border-t border-line-default pt-8 text-sm leading-relaxed text-ink-secondary sm:text-base">
              {content.closing}
              {showContactLink && (
                <>
                  {' '}
                  <Link href="/contact" className="font-semibold text-brand-blue hover:underline">
                    {t('pages.contactUs')}
                  </Link>
                  .
                </>
              )}
            </p>
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
