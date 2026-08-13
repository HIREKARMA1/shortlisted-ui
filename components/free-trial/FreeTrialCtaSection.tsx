'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { PageContainer } from '@/components/layout/Shell';
import { CtaLink } from '@/components/ui/CtaLink';

export function FreeTrialCtaSection() {
  const { t } = useTranslation();
  const imageUrl = t('freeTrial.cta.imageUrl').trim();

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-12 lg:py-14">
      <PageContainer>
        <div className="grid overflow-hidden rounded-2xl border border-[#e8ecf1] shadow-[0_10px_40px_rgba(15,23,42,0.06)] lg:grid-cols-2">
          <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[400px]">
            <div className="absolute inset-0 flex" aria-hidden>
              <span className="w-[18%] bg-brand-blue" />
              <span className="w-[18%] bg-[#133d7d]" />
              <span className="w-[18%] bg-brand-orange" />
              <span className="w-[18%] bg-brand-red" />
              <span className="flex-1 bg-brand-green" />
            </div>
            <div className="absolute inset-0 flex items-end justify-center px-3 pt-8">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={t('freeTrial.cta.imageAlt')}
                  className="ft-cutout relative z-10 h-full max-h-full w-auto max-w-[92%] object-contain object-bottom"
                />
              ) : null}
            </div>
          </div>

          <div className="relative flex flex-col justify-center bg-white px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
            <div
              className="pointer-events-none absolute bottom-6 right-6 h-[4.5rem] w-[4.5rem]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, #1b52a4 1.55px, transparent 1.65px)',
                backgroundSize: '9px 9px',
                opacity: 0.35,
              }}
              aria-hidden
            />

            <h2 className="max-w-md font-serif text-[1.75rem] font-extrabold leading-tight text-ink-primary sm:text-3xl lg:text-[2.2rem]">
              {t('freeTrial.cta.titleBefore')}{' '}
              <span className="text-brand-blue">{t('freeTrial.cta.titleHighlight')}</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-secondary sm:text-base">
              {t('freeTrial.cta.body')}
            </p>
            <div className="mt-8">
              <CtaLink href={t('freeTrial.cta.buttonHref')} size="lg">
                {t('freeTrial.cta.button')}
              </CtaLink>
            </div>
            <Link
              href={t('freeTrial.cta.buttonHref')}
              className="mt-3 text-sm font-medium text-brand-blue hover:underline"
            >
              {t('freeTrial.cta.redirectHint')}
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
