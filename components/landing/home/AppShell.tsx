'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { CreditCard, Home, LayoutGrid, LogIn } from 'lucide-react';
import { ContactModal } from './ContactModal';
import { CommandPalette } from './CommandPalette';
import { Footer } from './Footer';
import { useHome } from './HomeProvider';
import { Modal, PrimaryLink } from './primitives';
import { ShellProvider, useShell } from './ShellContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

function UnlockModal() {
  const { unlockOpen, setUnlockOpen } = useShell();
  const { subscribeHref, isLoggedIn } = useHome();
  return (
    <Modal open={unlockOpen} title="Subscribe to unlock" onClose={() => setUnlockOpen(false)}>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Jobs, classes, assessments, and your dashboard open with the one-time plan.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={() => setUnlockOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--ink)]">
          Not now
        </button>
        <PrimaryLink href={subscribeHref} onClick={() => setUnlockOpen(false)}>
          {isLoggedIn ? 'Subscribe' : 'Sign in to subscribe'}
        </PrimaryLink>
      </div>
    </Modal>
  );
}

function BottomTabs() {
  const { setMobileOpen, activeSection } = useShell();
  const { isLoggedIn, dashboardHref } = useHome();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-[var(--border)] bg-[var(--surface)] px-2 py-1 lg:hidden" aria-label="Mobile">
      <a href="#home" className={`flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium ${activeSection === 'home' ? 'text-[var(--brand-sky)]' : 'text-[var(--muted)]'}`}>
        <Home className="h-5 w-5" strokeWidth={1.75} />
        Home
      </a>
      <button type="button" onClick={() => setMobileOpen(true)} className="flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-[var(--muted)]">
        <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
        Explore
      </button>
      <a href="#plans" className={`flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium ${activeSection === 'plans' ? 'text-[var(--brand-sky)]' : 'text-[var(--muted)]'}`}>
        <CreditCard className="h-5 w-5" strokeWidth={1.75} />
        Plans
      </a>
      <Link href={isLoggedIn ? dashboardHref : '/auth/login'} className="flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-[var(--muted)]">
        <LogIn className="h-5 w-5" strokeWidth={1.75} />
        {isLoggedIn ? 'Account' : 'Sign in'}
      </Link>
    </nav>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const { collapsed } = useShell();
  return (
    <div className={`min-h-screen transition-[padding] duration-200 ${collapsed ? 'lg:pl-[72px]' : 'lg:pl-[260px]'}`}>
      <Sidebar />
      <Topbar />
      <main className="pb-16 lg:pb-0">{children}</main>
      <Footer />
      <BottomTabs />
      <CommandPalette />
      <ContactModal />
      <UnlockModal />
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ShellProvider>
      <Frame>{children}</Frame>
    </ShellProvider>
  );
}
