'use client';

import { memo, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { CONTACT_GLOBE_ARCS, CONTACT_GLOBE_CONFIG } from '@/lib/contact-globe-data';

const CONTINENT_SHAPES = [
  [[92, 133], [108, 111], [137, 99], [162, 112], [171, 132], [153, 146], [143, 170], [126, 177], [113, 158], [98, 153]],
  [[146, 183], [164, 188], [177, 206], [172, 228], [163, 251], [153, 275], [146, 252], [140, 226]],
  [[184, 122], [204, 107], [232, 108], [250, 118], [273, 116], [298, 132], [311, 149], [293, 161], [273, 156], [256, 169], [238, 159], [222, 169], [207, 153], [190, 148]],
  [[190, 164], [209, 157], [228, 168], [235, 190], [228, 215], [219, 238], [205, 253], [194, 229], [184, 203], [182, 181]],
  [[244, 166], [259, 170], [270, 186], [264, 202], [252, 194]],
  [[266, 222], [286, 224], [302, 239], [294, 253], [275, 251], [263, 238]],
] as const;

function isInsidePolygon(x: number, y: number, polygon: readonly (readonly [number, number])[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const crosses = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (crosses) inside = !inside;
  }
  return inside;
}

const STATIC_GLOBE_DOTS = Array.from({ length: 24 * 24 }, (_, index) => {
  const x = 82 + (index % 24) * 10;
  const y = 82 + Math.floor(index / 24) * 10;
  const isOnGlobe = (x - 200) ** 2 + (y - 200) ** 2 <= 158 ** 2;
  const isLand = CONTINENT_SHAPES.some((shape) => isInsidePolygon(x, y, shape));
  return { x, y, isOnGlobe, isLand };
}).filter(({ isOnGlobe }) => isOnGlobe);

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
    setStaticMode(reduced);
    if (reduced) return;
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
          <defs>
            <radialGradient id="contact-globe-surface" cx="38%" cy="32%" r="72%">
              <stop offset="0%" stopColor="#071b4b" />
              <stop offset="72%" stopColor="#020a2b" />
              <stop offset="100%" stopColor="#01051d" />
            </radialGradient>
            <radialGradient id="contact-globe-marker-teal">
              <stop offset="0%" stopColor="#00e0b8" stopOpacity=".4" />
              <stop offset="100%" stopColor="#00e0b8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="contact-globe-marker-sky">
              <stop offset="0%" stopColor="#00a2e5" stopOpacity=".4" />
              <stop offset="100%" stopColor="#00a2e5" stopOpacity="0" />
            </radialGradient>
            <filter id="contact-globe-shadow" x="-35%" y="-35%" width="170%" height="170%">
              <feGaussianBlur stdDeviation="13" />
            </filter>
            <clipPath id="contact-globe-clip"><circle cx="200" cy="200" r="170" /></clipPath>
          </defs>

          <circle cx="200" cy="204" r="174" fill="#1388e8" opacity=".22" filter="url(#contact-globe-shadow)" />
          <circle cx="200" cy="200" r="170" fill="url(#contact-globe-surface)" stroke="#287ac4" strokeOpacity=".45" strokeWidth="1.5" />

          <g clipPath="url(#contact-globe-clip)" fill="none" stroke="#68b8f0" strokeDasharray="1 7" strokeLinecap="round" opacity=".22">
            <ellipse cx="200" cy="200" rx="58" ry="169" strokeWidth="2" />
            <ellipse cx="200" cy="200" rx="116" ry="169" strokeWidth="2" />
            <ellipse cx="200" cy="200" rx="169" ry="58" strokeWidth="2" />
            <ellipse cx="200" cy="200" rx="169" ry="112" strokeWidth="2" />
          </g>

          <g clipPath="url(#contact-globe-clip)">
            {STATIC_GLOBE_DOTS.map(({ x, y, isLand }, index) => (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={isLand ? 1.8 : 1.15}
                fill={isLand ? '#bde7ff' : '#79b9ef'}
                opacity={isLand ? 0.88 : 0.28}
              />
            ))}
            <path d="M115 184C157 126 236 112 292 151" fill="none" stroke="#00a2e5" strokeOpacity=".38" strokeWidth="1" />
            <path d="M133 238C174 276 239 280 281 237" fill="none" stroke="#00e0b8" strokeOpacity=".3" strokeWidth="1" />
          </g>

          <circle cx="140" cy="160" r="19" fill="url(#contact-globe-marker-teal)" />
          <circle cx="140" cy="160" r="5.5" fill="#00e0b8" stroke="#b5fff1" strokeWidth="1.5" />
          <circle cx="260" cy="225" r="19" fill="url(#contact-globe-marker-sky)" />
          <circle cx="260" cy="225" r="5.5" fill="#00a2e5" stroke="#c5efff" strokeWidth="1.5" />
        </svg>
      ) : visible ? <World globeConfig={CONTACT_GLOBE_CONFIG} data={CONTACT_GLOBE_ARCS} /> : <div className="aspect-square w-full rounded-full bg-white/5" />}
    </div>
  );
});
