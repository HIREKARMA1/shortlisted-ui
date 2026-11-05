'use client';

import type { CSSProperties } from 'react';
import { ContactSupportContent } from '@/components/contact/ContactSupportContent';
import { Navbar } from '@/components/landing/home/Navbar';
import { ShellProvider } from '@/components/landing/home/ShellContext';
import { SiteFooter } from '@/components/layout/Footer';
import { homeTokenVars } from '@/lib/home/content';

export function SupportPageView() {
  return (
    <div
      className="sl-home flex min-h-screen flex-col bg-gradient-to-br from-secondary-50/80 via-white to-primary-50 text-[var(--ink)]"
      style={homeTokenVars as CSSProperties}
    >
      <ShellProvider>
        <Navbar />
      </ShellProvider>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <ContactSupportContent variant="public" />
      </main>
      <SiteFooter />
    </div>
  );
}
