'use client';

import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { FreeTrialHero } from '@/components/free-trial/FreeTrialHero';
// Temporarily hidden — restore with <FreeTrialClassesSection /> below
// import { FreeTrialClassesSection } from '@/components/free-trial/FreeTrialClassesSection';
import { FreeTrialTrainersSection } from '@/components/free-trial/FreeTrialTrainersSection';
import { FreeTrialJourneySection } from '@/components/free-trial/FreeTrialJourneySection';
import { FreeTrialApproachSection } from '@/components/free-trial/FreeTrialApproachSection';
import { FreeTrialCtaSection } from '@/components/free-trial/FreeTrialCtaSection';
import { useAuthenticatedGate } from '@/hooks/useSession';

export function FreeTrialPageView() {
  const { canAccess, session } = useAuthenticatedGate('/free-trial');

  if (!canAccess || !session) return null;

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <div className="font-serif">
        <FreeTrialHero session={session} />
        {/* Temporarily hidden — restore by uncommenting:
        <FreeTrialClassesSection />
        */}
        <FreeTrialTrainersSection />
        <FreeTrialJourneySection />
        <FreeTrialApproachSection />
        <FreeTrialCtaSection />
      </div>
      <SiteFooter />
    </main>
  );
}
