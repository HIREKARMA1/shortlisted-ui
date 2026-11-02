'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, Search, X } from 'lucide-react';
import { useHome } from './HomeProvider';
import { useShell } from './ShellContext';

export function Navbar() {
  const { setPaletteOpen, mobileOpen, setMobileOpen, activeSection } = useShell();
  const { ready, isLoggedIn, session, dashboardHref } = useHome();
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

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
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'plans', label: 'Plans', href: '#plans' },
    { id: 'support', label: 'Support', href: '/support' },
    { id: 'faq', label: 'FAQ', href: '#faq' },
  ];

  const handleLinkClick = (id: string, href: string) => {
    setMobileOpen(false);
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

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b border-[#E5EAF2] ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-[0_8px_24px_rgba(11,27,51,0.06)]' : 'bg-white'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between px-4 sm:px-6">
        {/* Left: Shortlisted logo + Center/Left links */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link
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
              width={140}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Nav Links (min-[900px]:flex) - Exactly: Home, Plans, Support, FAQ */}
          <nav className="hidden min-[900px]:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const active = isLinkActive(link.id);
              return link.href.startsWith('#') ? (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(link.id, link.href);
                  }}
                  className={`relative py-6 text-[15px] font-medium transition-colors ${
                    active ? 'text-[#1b52a4]' : 'text-[var(--ink)] hover:text-[#00a2e5]'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 inset-x-0 h-0.5 rounded-full bg-[#00a2e5]" aria-hidden />
                  )}
                </a>
              ) : (
                <Link
                  key={link.id}
                  href={link.href}
                  className="relative py-6 text-[15px] font-medium text-[var(--ink)] hover:text-[#00a2e5] transition-colors"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Desktop Actions (min-[900px]:flex) */}
        <div className="hidden min-[900px]:flex items-center gap-3">
          {/* Compact Search Button */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 rounded-full border border-[#E5EAF2] bg-[#F7F9FC] px-3.5 py-1.5 text-xs text-[#5B6B82] hover:border-[#00a2e5]/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a2e5]"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5 text-[#5B6B82]" />
            <span className="font-medium text-[#5B6B82]">Search</span>
            <kbd className="rounded bg-white border border-[#E5EAF2] px-1.5 py-0.5 text-[10px] font-semibold text-[#0B1B33]">
              Ctrl K
            </kbd>
          </button>

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
          {/* Mobile search icon-only button */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#E5EAF2] text-[#5B6B82] hover:bg-[#F7F9FC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00a2e5]"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Mobile hamburger button */}
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
          {/* Outside Backdrop */}
          <div
            className="absolute inset-0 bg-[#0B1B33]/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />

          {/* Slide-down drawer content */}
          <div
            ref={drawerRef}
            className="relative w-full border-b border-[#E5EAF2] bg-white px-5 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200"
          >
            <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
              {navLinks.map((link) => {
                const active = isLinkActive(link.id);
                return link.href.startsWith('#') ? (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.id, link.href);
                    }}
                    className={`flex h-12 items-center px-4 rounded-xl text-base font-semibold transition-colors ${
                      active
                        ? 'bg-[#00a2e5]/10 text-[#1b52a4]'
                        : 'text-[var(--ink)] hover:bg-[#F7F9FC] hover:text-[#00a2e5]'
                    }`}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex h-12 items-center px-4 rounded-xl text-base font-semibold text-[var(--ink)] hover:bg-[#F7F9FC] hover:text-[#00a2e5] transition-colors"
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-5 border-t border-[#E5EAF2] pt-5">
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
                <div className="flex flex-col gap-2.5">
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
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

