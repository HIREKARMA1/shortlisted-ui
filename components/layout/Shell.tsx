'use client';

import Link from 'next/link';
import { useState } from 'react';
import { User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { getPostLoginPath } from '@/lib/auth/session';
import { config } from '@/lib/config';
import { useSession } from '@/hooks/useSession';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { navLoginClass, navRegisterClass } from '@/components/ui/nav-cta';

export function BrandLogo({ className = '', showBadge = false }: { className?: string; showBadge?: boolean }) {
  const { t } = useTranslation();
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
        SHORT<span className="text-primary">LISTED</span>
      </span>
      {showBadge && (
        <span className="hidden rounded-md bg-brand-orange/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-orange sm:inline">
          {t('common.brand.badge')}
        </span>
      )}
    </Link>
  );
}

/** Port of lakshya-ui/components/landing/Navbar.tsx - same classes, Shortlisted routes */
export function SiteHeader() {
  const { t } = useTranslation();
  const { session, ready } = useSession();
  const [open, setOpen] = useState(false);
  const pathname = usePathname() ?? '/';
  const profilePath = session ? getPostLoginPath(session) : '/auth/login';

  const links: { k: string; href: string; external?: boolean }[] = [
    { k: 'about', href: '/about' },
    { k: 'successStories', href: 'https://www.hirekarma.in/impact', external: true },
    { k: 'contact', href: '/contact' },
  ];

  const UserChip = (
    <Link
      href={profilePath}
      className="flex items-center gap-2 rounded-full border border-line bg-soft/50 py-1 pl-1 pr-3 transition hover:border-primary"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-white">
        <User className="h-4 w-4" />
      </span>
      <span className="max-w-[100px] truncate text-sm font-semibold text-ink sm:max-w-[140px]">
        {session?.userName || t('common.nav.profile')}
      </span>
    </Link>
  );

  const LoginBtn = (
    <Link href="/auth/login" className={navLoginClass}>
      {t('common.nav.login')}
    </Link>
  );

  const RegisterBtn = (
    <Link href="/auth/register" className={navRegisterClass}>
      {t('common.nav.register')}
    </Link>
  );

  const RightActions = () => {
    if (!ready) return null;
    if (session) return UserChip;
    return (
      <>
        {RegisterBtn}
        {LoginBtn}
      </>
    );
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:py-3.5">
        <BrandLogo />

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => {
            if (l.external) {
              return (
                <a
                  key={l.k}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-ink/80 transition hover:text-primary"
                >
                  {t(`common.nav.${l.k}`)}
                </a>
              );
            }

            const path = l.href.split('#')[0];
            const active = pathname === path || pathname.startsWith(`${path}/`);

            return (
              <Link
                key={l.k}
                href={l.href}
                className={`text-sm font-medium transition hover:text-primary ${
                  active ? 'text-primary' : 'text-ink/80'
                }`}
              >
                {t(`common.nav.${l.k}`)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <RightActions />
        </div>

        <button
          type="button"
          aria-label="Menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
            <span className="block h-0.5 w-5 bg-ink" />
          </span>
        </button>
      </div>

      {open && (
        <div className="overflow-visible border-t border-line bg-white md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col overflow-visible px-4 py-3">
            {links.map((l) =>
              l.external ? (
                <a
                  key={l.k}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 text-sm font-medium text-ink"
                >
                  {t(`common.nav.${l.k}`)}
                </a>
              ) : (
                <Link
                  key={l.k}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-line/60 py-3 text-sm font-medium text-ink"
                >
                  {t(`common.nav.${l.k}`)}
                </Link>
              )
            )}
            <div className="mt-3 flex flex-col gap-2">
              <LanguageSwitcher variant="menu" />
              {session ? (
                <Link href={profilePath} onClick={() => setOpen(false)} className="flex justify-center py-2">
                  {UserChip}
                </Link>
              ) : (
                ready && (
                  <>
                    <Link
                      href="/auth/register"
                      onClick={() => setOpen(false)}
                      className={`${navRegisterClass} text-center`}
                    >
                      {t('common.nav.register')}
                    </Link>
                    <Link
                      href="/auth/login"
                      onClick={() => setOpen(false)}
                      className={`${navLoginClass} text-center`}
                    >
                      {t('common.nav.login')}
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function PageContainer({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`page-container ${className}`}>{children}</div>;
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
    <div className="min-h-screen bg-soft">
      <header className="border-b border-line bg-white">
        <div className="brand-stripe" aria-hidden="true">
          <div>
            <div className="flex-1 bg-brand-blue" />
            <div className="flex-1 bg-brand-sky" />
            <div className="flex-1 bg-brand-yellow" />
            <div className="flex-1 bg-brand-orange" />
            <div className="flex-1 bg-brand-red" />
            <div className="flex-1 bg-brand-green" />
          </div>
        </div>
        <div className="page-container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <BrandLogo />
            <p className="mt-1 text-sm text-muted-foreground">{config.app.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {actions}
          </div>
        </div>
      </header>
      <PageContainer className="py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <h1 className="section-title">{title}</h1>
            {subtitle && <p className="mt-2 text-ink-secondary">{subtitle}</p>}
          </div>
        </div>
        {children}
      </PageContainer>
    </div>
  );
}
