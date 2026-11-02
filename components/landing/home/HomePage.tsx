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
          {/* Seasonal hero switch:
              Renders DiwaliHero when enabled and current IST timestamp is within window
              (DIWALI_THEME_START: 2026-11-02T00:00:00+05:30 to DIWALI_THEME_END: 2026-11-12T23:59:59+05:30).
              Supports QA override: ?theme=diwali or ?theme=default.
              To turn it off permanently: set `seasonalHero.enabled = false` in `lib/home/content.ts`.
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
