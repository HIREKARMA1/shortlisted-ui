'use client';

import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { ContactSupportSection } from '@/components/landing/ContactSupportSection';

export function ContactPageView() {
  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <ContactSupportSection className="pt-8 lg:pt-12" />
      <SiteFooter />
    </main>
  );
}
