'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { cn } from '@/lib/utils';
import { BrandLogo } from './Shell';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthDecor } from '@/components/auth/AuthDecor';
import { CheckCircle2 } from 'lucide-react';

export function AuthLayout({
  title,
  subtitle,
  kicker,
  children,
  footer,
  fitViewport = false,
}: {
  title: string;
  subtitle?: string;
  kicker?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  fitViewport?: boolean;
}) {
  const { t } = useTranslation();
  const highlights = [
    t('auth.layout.highlight1'),
    t('auth.layout.highlight2'),
    t('auth.layout.highlight3'),
  ];

  return (
    <div className={cn('overflow-x-hidden bg-white', fitViewport ? 'h-dvh overflow-hidden' : 'min-h-screen')}>
      <div className={cn('grid min-w-0 lg:grid-cols-2', fitViewport ? 'h-full' : 'min-h-screen')}>
        <div className="auth-gradient-panel relative hidden min-w-0 flex-col justify-between overflow-hidden p-10 text-white lg:flex">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-brand-yellow/10" aria-hidden />
          <div className="absolute -right-16 top-20 h-48 w-48 rounded-full bg-brand-sky/30 blur-2xl" aria-hidden />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-brand-yellow/20 blur-2xl" aria-hidden />

          <div className="relative">
            <Link
              href="/"
              className="inline-block font-display text-2xl font-extrabold tracking-tight text-white"
            >
              SHORT<span className="text-brand-yellow">LISTED</span>
            </Link>
            <p className="mt-2 text-sm text-white/80">{t('common.brand.tagline')}</p>
          </div>

          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              {t('auth.layout.panelTitle')}
            </h2>
            <p className="mt-4 max-w-md text-white/85">{t('auth.layout.panelSubtitle')}</p>
            <ul className="mt-8 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/90">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-yellow" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-1.5" aria-hidden>
              <span className="h-1 w-12 bg-brand-yellow" />
              <span className="h-1 w-8 bg-brand-sky" />
              <span className="h-1 w-4 bg-brand-orange" />
              <span className="h-1 w-4 bg-brand-green" />
            </div>
          </div>

          <p className="relative text-xs text-white/60">{t('landing.footer.poweredBy')}</p>
        </div>

        <div className={cn('relative flex min-w-0 flex-col overflow-x-hidden', fitViewport && 'h-full overflow-hidden')}>
          <AuthDecor />

          <div className="flex h-1 w-full shrink-0 lg:hidden" aria-hidden>
            <span className="flex-[3] bg-brand-blue" />
            <span className="flex-1 bg-brand-sky" />
            <span className="w-8 bg-brand-yellow" />
            <span className="w-8 bg-brand-orange" />
          </div>

          <div
            className={cn(
              'relative z-10 flex shrink-0 items-center justify-between gap-4 px-4 sm:px-8',
              fitViewport ? 'py-3' : 'py-4'
            )}
          >
            <div className="lg:hidden">
              <BrandLogo />
            </div>
            <div className="ml-auto w-36">
              <LanguageSwitcher />
            </div>
          </div>

          <div
            className={cn(
              'relative z-10 flex flex-1 justify-center px-4 sm:px-8',
              fitViewport ? 'min-h-0 items-start overflow-y-auto overscroll-y-contain py-4 pb-6' : 'items-center pb-12'
            )}
          >
            <div className="w-full min-w-0 max-w-md">
              {kicker && (
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-orange">{kicker}</p>
              )}
              <h1
                className={cn(
                  'font-display font-extrabold tracking-tight text-ink-primary',
                  kicker ? 'mt-2' : '',
                  fitViewport ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                )}
              >
                {title}
              </h1>
              {subtitle && (
                <p className={cn('max-w-sm text-ink-secondary', fitViewport ? 'mt-1.5 text-sm' : 'mt-2')}>
                  {subtitle}
                </p>
              )}
              <div className={cn(fitViewport ? 'mt-4' : 'mt-6')}>
                <AuthCard>{children}</AuthCard>
              </div>
              {footer && (
                <div className={cn('text-center text-sm text-ink-muted', fitViewport ? 'mt-3' : 'mt-4')}>
                  {footer}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
