'use client';

import { FreeTrialCutoutFilter } from '@/components/free-trial/FreeTrialCutoutFilter';
import { SiteHeader } from '@/components/layout/Shell';
import { SiteFooter } from '@/components/layout/Footer';
import { FreeTrialHero } from '@/components/free-trial/FreeTrialHero';
import { FreeTrialClassesSection } from '@/components/free-trial/FreeTrialClassesSection';
import { FreeTrialTrainersSection } from '@/components/free-trial/FreeTrialTrainersSection';
import { FreeTrialJourneySection } from '@/components/free-trial/FreeTrialJourneySection';
import { FreeTrialApproachSection } from '@/components/free-trial/FreeTrialApproachSection';
import { FreeTrialCtaSection } from '@/components/free-trial/FreeTrialCtaSection';

export function FreeTrialPageView() {
  return (
    <main className="min-h-screen bg-white">
      <FreeTrialCutoutFilter />
      <SiteHeader />
      <div className="font-serif">
        <FreeTrialHero />
        <FreeTrialClassesSection />
        <FreeTrialTrainersSection />
        <FreeTrialJourneySection />
        <FreeTrialApproachSection />
        <FreeTrialCtaSection />
      </div>
      <SiteFooter />
    </main>
  );
}
