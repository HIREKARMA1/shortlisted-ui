'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { useShell } from './ShellContext';
import { useHome } from './HomeProvider';

export function Topbar() {
  const { setMobileOpen, setPaletteOpen } = useShell();
  const { ready, isLoggedIn } = useHome();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-transparent bg-[var(--surface)]/95 px-4 backdrop-blur sm:px-6 ${
        scrolled ? 'border-[var(--border)] shadow-[0_8px_24px_rgba(11,27,51,0.06)]' : ''
      }`}
    >
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] lg:hidden"
        aria-label="Open menu"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => setPaletteOpen(true)}
        className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 text-left text-sm text-[var(--muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--brand-sky)] sm:max-w-xl"
        aria-label="Search"
      >
        <Search className="h-4 w-4 shrink-0" strokeWidth={1.75} />
        <span className="truncate">Search features and answers</span>
        <kbd className="ml-auto hidden rounded-md bg-[var(--surface)] px-1.5 text-[10px] font-semibold text-[var(--ink)] sm:inline">Ctrl K</kbd>
      </button>
      {ready && !isLoggedIn ? (
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/auth/register"
            className="hidden rounded-full border border-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-[var(--brand-blue)] sm:inline-flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]"
          >
            Sign up
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full bg-[var(--brand-blue)] px-4 py-2 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-sky)]"
          >
            Sign in
          </Link>
        </div>
      ) : null}
    </header>
  );
}
