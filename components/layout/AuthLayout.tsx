'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { BrandStripe } from '@/components/ui/BrandStripe';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { CheckCircle2 } from 'lucide-react';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const highlights = [
    t('auth.layout.highlight1'),
    t('auth.layout.highlight2'),
    t('auth.layout.highlight3'),
  ];

  return (
    <div className="min-h-screen bg-surface-page">
      <BrandStripe />
      <div className="grid min-h-[calc(100vh-4px)] lg:grid-cols-2">
        <div className="relative hidden flex-col justify-between bg-brand-blue p-10 text-white lg:flex">
          <div>
            <Link href="/" className="font-display text-2xl font-bold text-white">
              {t('common.brand.name')}
            </Link>
            <p className="mt-2 text-sm text-white/80">{t('common.brand.tagline')}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">{t('auth.layout.panelTitle')}</h2>
            <p className="mt-4 max-w-md text-white/85">{t('auth.layout.panelSubtitle')}</p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/60">{t('landing.footer.poweredBy')}</p>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <Link href="/" className="font-display text-lg font-bold text-brand-blue lg:hidden">
              {t('common.brand.name')}
            </Link>
            <div className="ml-auto w-36">
              <LanguageSwitcher />
            </div>
          </div>
          <div className="flex flex-1 items-center justify-center px-4 pb-12 sm:px-8">
            <div className="w-full max-w-md">
              <h1 className="font-display text-2xl font-semibold text-ink-primary">{title}</h1>
              {subtitle && <p className="mt-2 text-ink-secondary">{subtitle}</p>}
              <div className="card-surface mt-6 p-6 shadow-card">{children}</div>
              {footer && <div className="mt-4 text-center text-sm text-ink-muted">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
