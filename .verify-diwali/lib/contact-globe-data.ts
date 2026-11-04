import type { GlobeConfig } from '@/components/ui/globe';

type Arc = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

const arcColors = ['#00DDB3', '#38bdf8', '#6366f1', '#60a5fa'];

export const CONTACT_GLOBE_CONFIG: GlobeConfig = {
  pointSize: 4,
  globeColor: '#010C39',
  showAtmosphere: true,
  atmosphereColor: '#FFFFFF',
  atmosphereAltitude: 0.12,
  emissive: '#010C39',
  emissiveIntensity: 0.12,
  shininess: 0.9,
  polygonColor: 'rgba(255,255,255,0.65)',
  ambientLight: '#38bdf8',
  directionalLeftLight: '#ffffff',
  directionalTopLight: '#ffffff',
  pointLight: '#ffffff',
  arcTime: 1200,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 20.2961, lng: 85.8245 },
  autoRotate: true,
  autoRotateSpeed: 0.6,
};

export const CONTACT_GLOBE_ARCS: Arc[] = [
  { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 12.9716, endLng: 77.5946, arcAlt: 0.2, color: arcColors[0] },
  { order: 1, startLat: 19.076, startLng: 72.8777, endLat: 22.5726, endLng: 88.3639, arcAlt: 0.25, color: arcColors[1] },
  { order: 2, startLat: 20.2961, startLng: 85.8245, endLat: 28.6139, endLng: 77.209, arcAlt: 0.2, color: arcColors[2] },
  { order: 2, startLat: 13.0827, startLng: 80.2707, endLat: 17.385, endLng: 78.4867, arcAlt: 0.15, color: arcColors[3] },
  { order: 3, startLat: 28.6139, startLng: 77.209, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.35, color: arcColors[0] },
  { order: 3, startLat: 19.076, startLng: 72.8777, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.3, color: arcColors[1] },
  { order: 4, startLat: 12.9716, startLng: 77.5946, endLat: 25.2048, endLng: 55.2708, arcAlt: 0.25, color: arcColors[2] },
  { order: 4, startLat: 22.5726, startLng: 88.3639, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: arcColors[3] },
  { order: 5, startLat: 20.2961, startLng: 85.8245, endLat: 40.7128, endLng: -74.006, arcAlt: 0.45, color: arcColors[0] },
  { order: 5, startLat: 28.6139, startLng: 77.209, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.4, color: arcColors[1] },
  { order: 6, startLat: 17.385, startLng: 78.4867, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.35, color: arcColors[2] },
  { order: 6, startLat: 13.0827, startLng: 80.2707, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.25, color: arcColors[3] },
  { order: 7, startLat: 20.2961, startLng: 85.8245, endLat: 19.076, endLng: 72.8777, arcAlt: 0.15, color: arcColors[0] },
  { order: 7, startLat: 12.9716, startLng: 77.5946, endLat: 20.2961, endLng: 85.8245, arcAlt: 0.2, color: arcColors[1] },
];
