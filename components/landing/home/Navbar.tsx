'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getPostLoginPath } from '@/lib/auth/session';
import { useSession } from '@/hooks/useSession';
import { useTranslation } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { navHeaderExploreClass, navHeaderLoginClass, navExploreClass, navLoginClass } from '@/components/ui/nav-cta';
import { useShell } from './ShellContext';

const SUCCESS_STORIES_URL = 'https://www.hirekarma.in/impact';
const EXPLORE_US_URL = 'https://www.hirekarma.in/';

export function Navbar() {
  const { mobileOpen, setMobileOpen, activeSection } = useShell();
  const { ready, isLoggedIn, session } = useSession();
  const { t } = useTranslation();
  const pathname = usePathname() ?? '/';
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const dashboardHref = session ? getPostLoginPath(session) : '/auth/login';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Body scroll lock and focus trap for mobile drawer
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileOpen(false);
        }
        if (e.key === 'Tab' && drawerRef.current) {
          const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
            'a, button, input, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      window.addEventListener('keydown', onKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', onKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileOpen, setMobileOpen]);

  const navLinks = [
    { id: 'home', label: 'Home', href: isHome ? '#home' : '/' },
    { id: 'plans', label: 'Plans', href: isHome ? '#plans' : '/#plans' },
    { id: 'support', label: 'Support', href: '/support' },
  ];

  const handleLinkClick = (id: string, href: string) => {
    setMobileOpen(false);
    if (!isHome) return;
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } else if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isLinkActive = (id: string) => {
    if (id === 'support') {
      return pathname === '/support' || pathname.startsWith('/support/');
    }
    if (!isHome) return false;
    if (id === 'home') {
      return (
        !activeSection ||
        activeSection === 'home' ||
        activeSection === 'journey' ||
        activeSection === 'desk' ||
        activeSection === 'trainers' ||
        activeSection === 'stories'
      );
    }
    return activeSection === id;
  };

  const SuccessStoriesBtn = (
    <a
      href={SUCCESS_STORIES_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={navHeaderLoginClass}
    >
      {t('common.nav.successStories')}
    </a>
  );

  const ExploreUsBtn = (
    <a
      href={EXPLORE_US_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={navHeaderExploreClass}
    >
      {t('common.nav.exploreUs')}
    </a>
  );

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b border-[#E5EAF2] ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(11,27,51,0.06)]' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6">
        {/* Left: Shortlisted logo + Center/Left links */}
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          {isHome ? (
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('home', '#home');
              }}
              aria-label="Shortlisted home"
              className="flex items-center shrink-0"
            >
              <img
                src="/images/shortlisted-logo.png"
                alt="Shortlisted"
                width={216}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </a>
          ) : (
            <Link href="/" aria-label="Shortlisted home" className="flex items-center shrink-0">
              <img
                src="/images/shortlisted-logo.png"
                alt="Shortlisted"
                width={216}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
          )}

          {/* Desktop Nav Links: Home, Plans, Support */}
          <nav className="hidden min-[900px]:flex items-center gap-6 lg:gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.id);
              const className = `relative py-6 text-[15px] font-medium transition-colors ${
                active ? 'text-[#1b52a4]' : 'text-[var(--ink)] hover:text-[#00a2e5]'
              }`;
              const underline = active ? (
                <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[#00a2e5]" aria-hidden />
              ) : null;

              if (link.href.startsWith('#') && isHome) {
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id, link.href);
                    }}
                    className={className}
                  >
                    {link.label}
                    {underline}
                  </a>
                );
              }

              return (
                <Link key={link.id} href={link.href} className={className}>
                  {link.label}
                  {underline}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Desktop Actions — search UI hidden; Ctrl/Cmd+K still opens CommandPalette via ShellProvider */}
        <div className="hidden min-[900px]:flex items-center gap-2.5 lg:gap-3">
          <LanguageSwitcher />
          {SuccessStoriesBtn}
          {ExploreUsBtn}

          {ready && isLoggedIn && session ? (
            <Link
              href={dashboardHref}
              className="inline-flex items-center gap-2 rounded-full border border-[#E5EAF2] bg-[#F7F9FC] pl-1.5 pr-4 py-1 hover:border-[#00a2e5]/50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a2e5]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1b52a4] text-xs font-bold text-white shadow-sm">
                {(session.userName || 'S').slice(0, 1).toUpperCase()}
              </span>
              <span className="text-xs font-bold text-[#1b52a4]">Go to dashboard</span>
            </Link>
          ) : ready ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-full border border-[#1b52a4] px-4 py-1.5 text-sm font-semibold text-[#1b52a4] hover:bg-[#1b52a4]/[0.06] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a2e5]"
              >
                Sign up
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-full bg-[#1b52a4] px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-[#153f80] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a2e5]"
              >
                Sign in
              </Link>
            </div>
          ) : null}
        </div>

        {/* Mobile Controls (<900px) */}
        <div className="flex min-[900px]:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5EAF2] text-[#0B1B33] hover:bg-[#F7F9FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a2e5]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (<900px) */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[72px] z-50 min-[900px]:hidden">
          <div
            className="absolute inset-0 bg-[#0B1B33]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />

          <div
            ref={drawerRef}
            className="relative w-full border-b border-[#E5EAF2] bg-white px-5 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200"
          >
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const active = isLinkActive(link.id);
                const className = `flex h-12 items-center px-4 rounded-xl text-base font-semibold transition-colors ${
                  active
                    ? 'bg-[#00a2e5]/10 text-[#1b52a4]'
                    : 'text-[var(--ink)] hover:bg-[#F7F9FC] hover:text-[#00a2e5]'
                }`;

                if (link.href.startsWith('#') && isHome) {
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleLinkClick(link.id, link.href);
                      }}
                      className={className}
                    >
                      {link.label}
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 flex flex-col gap-2.5 border-t border-[#E5EAF2] pt-5">
              <LanguageSwitcher variant="menu" />
              <a
                href={SUCCESS_STORIES_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={`${navLoginClass} text-center`}
              >
                {t('common.nav.successStories')}
              </a>
              <a
                href={EXPLORE_US_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className={`${navExploreClass} text-center`}
              >
                {t('common.nav.exploreUs')}
              </a>

              {ready && isLoggedIn && session ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-[#1b52a4] text-sm font-semibold text-white shadow-sm"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs font-bold text-white">
                    {(session.userName || 'S').slice(0, 1).toUpperCase()}
                  </span>
                  Go to dashboard
                </Link>
              ) : ready ? (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-[#1b52a4] text-sm font-semibold text-white shadow-sm hover:bg-[#153f80] transition"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 w-full items-center justify-center rounded-full border border-[#1b52a4] text-sm font-semibold text-[#1b52a4] hover:bg-[#1b52a4]/[0.06] transition"
                  >
                    Sign up
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
