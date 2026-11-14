'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { homeTokenVars, isSeasonalHeroActive } from '@/lib/home/content';
import { AppShell } from './AppShell';
import { ClosingCta } from './ClosingCta';
import { DiwaliHero } from './DiwaliHero';
import { FaqAndContact } from './FaqAndContact';
import { Hero } from './Hero';
import { HomeProvider } from './HomeProvider';
import { MeetTrainersSection } from './MeetTrainersSection';
import { PlacementDeskSection } from './PlacementDeskSection';
import { PlacementJourneySection } from './PlacementJourneySection';
import { PlansAndBatch } from './PlansAndBatch';
import { Stories } from './Stories';

export function HomePage() {
  const [seasonalActive, setSeasonalActive] = useState<boolean>(() => isSeasonalHeroActive());

  useEffect(() => {
    // Check for QA override in query string: ?theme=diwali or ?theme=default
    const qaOverrideAllowed =
      process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DIWALI_THEME_QA === 'true';
    if (qaOverrideAllowed && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const themeOverride = params.get('theme');
      if (themeOverride) {
        setSeasonalActive(isSeasonalHeroActive(themeOverride));
      }
    }
  }, []);

  return (
    <HomeProvider>
      <div className="sl-home min-h-screen bg-[var(--bg)] text-[var(--ink)]" style={homeTokenVars as CSSProperties}>
        <AppShell>
          {/* Seasonal hero: Diwali when `seasonalHero.enabled` is true (and optional date window if useDateWindow).
              Turn off: set `seasonalHero.enabled = false` in `lib/home/content.ts`.
              QA: ?theme=diwali or ?theme=default (production needs NEXT_PUBLIC_DIWALI_THEME_QA=true).
          */}
          {seasonalActive ? <DiwaliHero /> : <Hero />}
          <PlacementJourneySection />
          <PlacementDeskSection />
          <MeetTrainersSection />
          <Stories />
          <PlansAndBatch />
          <FaqAndContact />
          <ClosingCta />
        </AppShell>
      </div>
    </HomeProvider>
  );
}
