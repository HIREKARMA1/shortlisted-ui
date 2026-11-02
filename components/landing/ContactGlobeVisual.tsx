'use client';

import { memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CONTACT_GLOBE_ARCS, CONTACT_GLOBE_CONFIG } from '@/lib/contact-globe-data';

const World = dynamic(() => import('@/components/ui/globe').then((mod) => mod.World), {
  ssr: false,
  loading: () => <div className="aspect-square w-full animate-pulse rounded-full bg-white/5" aria-hidden />,
});

export const ContactGlobeVisual = memo(function ContactGlobeVisual() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [staticMode, setStaticMode] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 899px)').matches;
    setStaticMode(reduced || small);
    if (reduced || small) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px' });
    if (hostRef.current) observer.observe(hostRef.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={hostRef} className="relative mx-auto aspect-square w-full max-w-[220px] min-[900px]:max-w-[480px]" aria-hidden="true">
      {staticMode ? (
        <svg viewBox="0 0 400 400" className="h-full w-full" role="presentation">
          <defs><radialGradient id="globeGlow"><stop offset="72%" stopColor="#01051d"/><stop offset="100%" stopColor="#071443"/></radialGradient></defs>
          <circle cx="200" cy="200" r="170" fill="url(#globeGlow)" />
          <g fill="#9bc7ff" opacity=".75">
            {Array.from({ length: 150 }, (_, i) => { const a = i * 2.399, r = 18 + Math.sqrt(i) * 12; return <circle key={i} cx={200 + Math.cos(a) * r} cy={200 + Math.sin(a) * r} r="1.2" />; })}
          </g>
          <circle cx="140" cy="160" r="7" fill="#00e0b8"/><circle cx="260" cy="225" r="7" fill="#00a2e5"/>
        </svg>
      ) : visible ? <World globeConfig={CONTACT_GLOBE_CONFIG} data={CONTACT_GLOBE_ARCS} /> : <div className="aspect-square w-full rounded-full bg-white/5" />}
    </div>
  );
});
