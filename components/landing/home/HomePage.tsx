'use client';

import { useState, type CSSProperties } from 'react';
import { categories, homeTokenVars } from '@/lib/home/content';
import { AppShell } from './AppShell';
import { CategoryGrid } from './CategoryGrid';
import { FaqAndContact } from './FaqAndContact';
import { FeatureSpotlight } from './FeatureSpotlight';
import { FeaturedCarousel } from './FeaturedCarousel';
import { Hero } from './Hero';
import { HomeProvider } from './HomeProvider';
import { HowItWorks } from './HowItWorks';
import { PlansAndBatch } from './PlansAndBatch';
import { Stories } from './Stories';

export function HomePage() {
  const [selected, setSelected] = useState(categories[0].id);

  return (
    <HomeProvider>
      <div className="sl-home min-h-screen bg-[var(--bg)] text-[var(--ink)]" style={homeTokenVars as CSSProperties}>
        <AppShell>
          <Hero />
          <CategoryGrid selected={selected} onSelect={setSelected} />
          <FeatureSpotlight selected={selected} />
          <FeaturedCarousel />
          <HowItWorks />
          <PlansAndBatch />
          <Stories />
          <FaqAndContact />
        </AppShell>
      </div>
    </HomeProvider>
  );
}
