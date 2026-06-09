'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import { config } from '@/lib/config';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';

export function BrandLogo() {
  const { t } = useTranslation();
  return (
    <Link href="/" className="font-display text-xl font-bold text-primary-600">
      {t('common.brand.name')}
    </Link>
  );
}

export function SiteHeader() {
  const { t } = useTranslation();

  return (
    <header className="border-b border-line-default bg-white">
      <div className="page-container flex items-center justify-between gap-4 py-4">
        <BrandLogo />
        <div className="flex items-center gap-3">
          <div className="hidden w-36 sm:block">
            <LanguageSwitcher />
          </div>
          <Link href="/auth/login" className="text-sm font-medium text-ink-secondary hover:text-primary-600">
            {t('common.nav.login')}
          </Link>
          <Link href="/auth/register">
            <Button>{t('common.nav.register')}</Button>
          </Link>
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
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
