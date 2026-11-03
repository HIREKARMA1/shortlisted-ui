'use client';

import type { ReactNode } from 'react';
import { CommandPalette } from './CommandPalette';
import { useHome } from './HomeProvider';
import { Navbar } from './Navbar';
import { Modal, PrimaryLink } from './primitives';
import { ShellProvider, useShell } from './ShellContext';

function UnlockModal() {
  const { unlockOpen, setUnlockOpen, pendingTargetHref } = useShell();
  const { subscribeHref, isLoggedIn } = useHome();
  const targetRedirect = pendingTargetHref || subscribeHref;
  return (
    <Modal open={unlockOpen} title="Subscribe to unlock" onClose={() => setUnlockOpen(false)}>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        Jobs, classes, assessments, and your dashboard open with the one-time plan.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <button type="button" onClick={() => setUnlockOpen(false)} className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--ink)]">
          Not now
        </button>
        <PrimaryLink
          href={isLoggedIn ? subscribeHref : `/auth/login?redirect=${encodeURIComponent(targetRedirect)}`}
          onClick={() => setUnlockOpen(false)}
        >
          {isLoggedIn ? 'Subscribe' : 'Sign in to unlock'}
        </PrimaryLink>
      </div>
    </Modal>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      <CommandPalette />
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
