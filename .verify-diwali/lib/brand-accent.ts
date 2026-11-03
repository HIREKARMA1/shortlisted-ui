import { cn } from '@/lib/utils';

export type BrandAccent = 'blue' | 'sky' | 'yellow' | 'orange' | 'red' | 'green';

const accentText: Record<BrandAccent, string> = {
  blue: 'text-brand-blue',
  sky: 'text-brand-sky',
  yellow: 'text-brand-yellow',
  orange: 'text-brand-orange',
  red: 'text-brand-red',
  green: 'text-brand-green',
};

const accentBg: Record<BrandAccent, string> = {
  blue: 'bg-brand-blue',
  sky: 'bg-brand-sky',
  yellow: 'bg-brand-yellow',
  orange: 'bg-brand-orange',
  red: 'bg-brand-red',
  green: 'bg-brand-green',
};

const accentSoft: Record<BrandAccent, string> = {
  blue: 'bg-primary-50 text-brand-blue',
  sky: 'bg-secondary-50 text-brand-sky',
  yellow: 'bg-[#fff8e0] text-[#b8860b]',
  orange: 'bg-[#fff3e8] text-brand-orange',
  red: 'bg-[#fdecec] text-brand-red',
  green: 'bg-[#e8f6ef] text-brand-green',
};

const accentBorder: Record<BrandAccent, string> = {
  blue: 'border-brand-blue/20',
  sky: 'border-brand-sky/25',
  yellow: 'border-brand-yellow/40',
  orange: 'border-brand-orange/25',
  red: 'border-brand-red/20',
  green: 'border-brand-green/20',
};

const accentCard: Record<BrandAccent, string> = {
  blue: 'bg-primary-50',
  sky: 'bg-secondary-50',
  yellow: 'bg-[#fff8e0]',
  orange: 'bg-[#fff3e8]',
  red: 'bg-[#fdecec]',
  green: 'bg-[#e8f6ef]',
};

export function isBrandAccent(value: unknown): value is BrandAccent {
  return (
    value === 'blue' ||
    value === 'sky' ||
    value === 'yellow' ||
    value === 'orange' ||
    value === 'red' ||
    value === 'green'
  );
}

export function accentTextClass(accent: BrandAccent, className?: string) {
  return cn(accentText[accent], className);
}

export function accentBgClass(accent: BrandAccent, className?: string) {
  return cn(accentBg[accent], className);
}

export function accentSoftClass(accent: BrandAccent, className?: string) {
  return cn(accentSoft[accent], className);
}

export function accentBorderClass(accent: BrandAccent, className?: string) {
  return cn(accentBorder[accent], className);
}

export function accentCardClass(accent: BrandAccent, className?: string) {
  return cn(accentCard[accent], className);
}
