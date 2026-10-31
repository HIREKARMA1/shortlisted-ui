'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { categories, exploreNav, studentNav } from '@/lib/home/content';
import { featureIcons } from './featureStyles';
import { useFeatureGate } from './useFeatureGate';
import { useShell } from './ShellContext';

function NavButton({
  id,
  label,
  href,
  locked,
  active,
  collapsed,
  onClick,
}: {
  id: string;
  label: string;
  href?: string;
  locked?: boolean;
  active?: boolean;
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon = featureIcons[id] ?? featureIcons.explore;
  const className = `group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)] ${
    active ? 'bg-[#e7f6fd] text-[var(--brand-blue)]' : 'text-[var(--ink)] hover:bg-[var(--bg)]'
  }`;
  const inner = (
    <>
      {active ? <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-[var(--brand-sky)]" aria-hidden /> : null}
      <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} aria-hidden />
      <span className={collapsed ? 'sr-only lg:sr-only' : 'truncate'}>{label}</span>
      {locked && !collapsed ? <Lock className="ml-auto h-3.5 w-3.5 text-[var(--muted)]" aria-label="Locked" /> : null}
      {collapsed ? (
        <span className="pointer-events-none absolute left-full z-20 ml-2 hidden whitespace-nowrap rounded-lg bg-[var(--ink)] px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 lg:block">
          {label}
        </span>
      ) : null}
    </>
  );

  if (href?.startsWith('#')) {
    return (
      <a href={href} className={className} onClick={onClick} title={label}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={onClick} title={label}>
      {inner}
    </button>
  );
}

export function Sidebar() {
  const { collapsed, toggleCollapsed, mobileOpen, setMobileOpen, activeSection } = useShell();
  const router = useRouter();
  const { openFeature, ready, isLoggedIn, isPaidStudent, isStaff, session, dashboardHref } = useFeatureGate();
  const showLock = ready && !isPaidStudent && !isStaff;

  const panel = (compact: boolean) => (
    <div className="flex h-full flex-col">
      <div className={`flex h-16 items-center ${compact ? 'justify-center px-2' : 'justify-between px-4'}`}>
        <Link href="/" aria-label="Shortlisted home" className={compact ? 'grid h-10 w-10 place-items-center overflow-hidden' : ''}>
          <img
            src="/images/shortlisted-logo.png"
            alt="Shortlisted"
            width={148}
            height={36}
            className={compact ? 'h-8 w-10 object-cover object-left' : 'h-8 w-auto'}
          />
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)] lg:grid"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="h-5 w-5" strokeWidth={1.75} /> : <PanelLeftClose className="h-5 w-5" strokeWidth={1.75} />}
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4" aria-label="Primary">
        <div>
          <p className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] ${compact ? 'sr-only' : ''}`}>
            Explore
          </p>
          <ul className="space-y-0.5">
            {exploreNav.map((item) => (
              <li key={item.id}>
                <NavButton
                  id={item.id}
                  label={item.label}
                  href={item.href.startsWith('#') ? item.href : undefined}
                  collapsed={compact}
                  active={item.href === `#${activeSection}`}
                  onClick={() => {
                    setMobileOpen(false);
                    if (item.id === 'trial') {
                      const feature = categories.find((entry) => entry.id === 'trial');
                      if (feature) openFeature(feature);
                    } else if (!item.href.startsWith('#')) {
                      router.push(item.href);
                    }
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={`px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] ${compact ? 'sr-only' : ''}`}>
            For students
          </p>
          <ul className="space-y-0.5">
            {studentNav.map((item) => (
              <li key={item.id}>
                <NavButton
                  id={item.id}
                  label={item.title}
                  locked={showLock}
                  collapsed={compact}
                  onClick={() => openFeature(item)}
                />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-[var(--border)] p-3">
        {ready && isLoggedIn && session ? (
          <Link
            href={dashboardHref}
            className={`flex items-center gap-2 rounded-xl px-2 py-2 hover:bg-[var(--bg)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)] ${compact ? 'justify-center' : ''}`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand-blue)] text-sm font-bold text-white">
              {(session.userName || 'S').slice(0, 1).toUpperCase()}
            </span>
            {compact ? null : (
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-[var(--ink)]">{session.userName || 'Account'}</span>
                <span className="block text-xs text-[var(--brand-sky)]">Go to dashboard</span>
              </span>
            )}
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex items-center justify-center rounded-full bg-[var(--brand-orange)] px-3 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]"
          >
            {compact ? 'Go' : 'Login / Sign up'}
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--border)] bg-[var(--surface)] transition-[width] duration-200 lg:block ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
        aria-label="Sidebar"
      >
        {panel(collapsed)}
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-[#0B1B33]/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-[var(--surface)] shadow-xl" aria-label="Sidebar">
            {panel(false)}
          </aside>
        </div>
      ) : null}
    </>
  );
}
