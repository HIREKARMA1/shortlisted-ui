'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';
import { CONTACT_GLOBE_ARCS, CONTACT_GLOBE_CONFIG } from '@/lib/contact-globe-data';

const World = dynamic(() => import('@/components/ui/globe').then((mod) => mod.World), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded-full bg-white/5" aria-hidden />,
});

export const ContactGlobeVisual = memo(function ContactGlobeVisual() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px] lg:max-w-none">
      <World globeConfig={CONTACT_GLOBE_CONFIG} data={CONTACT_GLOBE_ARCS} />
    </div>
  );
});
