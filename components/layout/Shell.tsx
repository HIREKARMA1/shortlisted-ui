'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { getPostLoginPath } from '@/lib/auth/session';
import { config } from '@/lib/config';
import { useSession } from '@/hooks/useSession';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { BrandStripe } from '@/components/ui/BrandStripe';

export function BrandLogo() {
  const { t } = useTranslation();
  return (
    <Link href="/" className="font-display text-xl font-bold text-brand-blue">
      {t('common.brand.name')}
    </Link>
  );
}

export function SiteHeader() {
  const { t } = useTranslation();
  const { session, ready } = useSession();
  const profilePath = session ? getPostLoginPath(session) : '/auth/login';

  return (
    <header className="sticky top-0 z-50 border-b border-line-default bg-white/95 backdrop-blur">
      <BrandStripe />
      <div className="page-container flex items-center justify-between gap-4 py-3 sm:py-4">
        <BrandLogo />
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#how-it-works" className="text-sm font-medium text-ink-secondary hover:text-brand-blue">
            {t('common.nav.howItWorks')}
          </a>
          <a href="#features" className="text-sm font-medium text-ink-secondary hover:text-brand-blue">
            {t('common.nav.features')}
          </a>
          <a href="#pricing" className="text-sm font-medium text-ink-secondary hover:text-brand-blue">
            {t('common.nav.pricing')}
          </a>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden w-36 sm:block">
            <LanguageSwitcher />
          </div>
          {ready && session ? (
            <Link href={profilePath}>
              <Button variant="secondary" className="gap-2 text-sm sm:px-4">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {session.userName || t('common.nav.profile')}
                </span>
              </Button>
            </Link>
          ) : (
            ready && (
              <>
                <Link href="/auth/login" className="link-brand hidden sm:inline">
                  {t('common.nav.login')}
                </Link>
                <Link href="/auth/register">
                  <Button variant="accent" className="text-sm sm:px-5">
                    {t('common.nav.register')}
                  </Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}

export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`page-container py-8 sm:py-12 ${className}`}>{children}</div>;
}

export function DashboardShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-page">
      <header className="border-b border-line-default bg-white">
        <BrandStripe />
        <div className="page-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <BrandLogo />
            <p className="mt-1 text-sm text-ink-muted">{config.app.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-36">
              <LanguageSwitcher />
            </div>
            {actions}
          </div>
        </div>
      </header>
      <PageContainer>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line-default pb-6">
          <div>
            <h1 className="section-title">{title}</h1>
            {subtitle && <p className="mt-1 text-ink-secondary">{subtitle}</p>}
          </div>
        </div>
        {children}
      </PageContainer>
    </div>
  );
}
