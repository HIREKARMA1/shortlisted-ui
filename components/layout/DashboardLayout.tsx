'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { cn } from '@/lib/utils';
import { BrandStripe } from '@/components/ui/BrandStripe';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { BrandLogo } from './Shell';
import { DashboardRole, getNavForRole, NavItem } from '@/lib/dashboard-nav';
import { StudentResumePrompt } from '@/components/dashboard/student/StudentResumeUploadModal';

function NavLink({ item, pathname, onNavigate }: { item: NavItem; pathname: string; onNavigate?: () => void }) {
  const { t } = useTranslation();
  const Icon = item.icon;
  const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-primary-50 text-brand-blue ring-1 ring-primary-100'
          : 'text-ink-secondary hover:bg-surface-muted hover:text-brand-blue'
      )}
    >
      <Icon className={cn('h-4 w-4', active ? 'text-brand-blue' : 'text-ink-muted')} />
      {t(item.labelKey)}
    </Link>
  );
}

export function DashboardLayout({
  role,
  title,
  subtitle,
  actions,
  children,
  onLogout,
}: {
  role: DashboardRole;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  onLogout?: () => void;
}) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = getNavForRole(role);

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line-default px-4 py-5">
        <BrandLogo />
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-muted">
          {t(`dashboard.roles.${role}`)}
        </p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => (
          <NavLink key={item.href} item={item} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
        ))}
      </nav>
      {onLogout && (
        <div className="border-t border-line-default p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-secondary hover:bg-surface-muted hover:text-brand-red"
          >
            <LogOut className="h-4 w-4" />
            {t('common.nav.logout')}
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-page">
      {role === 'student' && <StudentResumePrompt />}
      <BrandStripe />
      <div className="flex min-h-[calc(100vh-4px)]">
        <aside className="hidden w-64 shrink-0 border-r border-line-default bg-white lg:block">{sidebar}</aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-elevated">{sidebar}</aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-line-default bg-white/95 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-lg p-2 text-ink-secondary hover:bg-surface-muted lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="lg:hidden">
                  <BrandLogo />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden w-36 sm:block">
                  <LanguageSwitcher />
                </div>
                {actions}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
              {(title || subtitle) && (
                <div className="mb-8 border-b border-line-default pb-6">
                  {title ? <h1 className="section-title">{title}</h1> : null}
                  {subtitle ? <p className="mt-1 text-ink-secondary">{subtitle}</p> : null}
                </div>
              )}
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
