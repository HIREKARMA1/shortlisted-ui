'use client';

import {
  Briefcase,
  ClipboardCheck,
  ClipboardList,
  HelpCircle,
  Compass,
  CreditCard,
  Headphones,
  Home,
  Sparkles,
  UserRound,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';

export const featureIcons: Record<string, LucideIcon> = {
  home: Home,
  trial: Sparkles,
  profile: UserRound,
  jobs: Briefcase,
  applications: ClipboardList,
  classes: Video,
  assessments: ClipboardCheck,
  batch: Users,
  support: Headphones,
  plans: CreditCard,
  faq: HelpCircle,
  explore: Compass,
};

export const toneStyles: Record<
  string,
  {
    wash: string;
    washStrong: string;
    icon: string;
    iconOnGradient: string;
    ring: string;
    border: string;
    borderSolid: string;
    gradient: string;
    accent: string;
    tileBg: string;
  }
> = {
  blue: {
    wash: 'bg-[#1b52a4]/[0.09]',
    washStrong: 'bg-[#1b52a4]/[0.14]',
    icon: 'text-[var(--brand-blue)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-blue)]',
    border: 'hover:border-[var(--brand-blue)]',
    borderSolid: 'border-[var(--brand-blue)]',
    gradient: 'from-[#1b52a4] to-[#3d74c4]',
    accent: '#1b52a4',
    tileBg: 'bg-[rgba(27,82,164,0.08)]',
  },
  sky: {
    wash: 'bg-[#00a2e5]/[0.09]',
    washStrong: 'bg-[#00a2e5]/[0.14]',
    icon: 'text-[var(--brand-sky)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-sky)]',
    border: 'hover:border-[var(--brand-sky)]',
    borderSolid: 'border-[var(--brand-sky)]',
    gradient: 'from-[#0077b6] to-[#00a2e5]',
    accent: '#00a2e5',
    tileBg: 'bg-[rgba(0,162,229,0.08)]',
  },
  yellow: {
    wash: 'bg-[#fec40d]/[0.14]',
    washStrong: 'bg-[#fec40d]/[0.22]',
    icon: 'text-[var(--ink)]',
    iconOnGradient: 'text-[var(--ink)]',
    ring: 'ring-[var(--brand-yellow)]',
    border: 'hover:border-[var(--brand-yellow)]',
    borderSolid: 'border-[var(--brand-yellow)]',
    gradient: 'from-[#fec40d] to-[#f5b400]',
    accent: '#fec40d',
    tileBg: 'bg-[rgba(254,196,13,0.12)]',
  },
  orange: {
    wash: 'bg-[#f58020]/[0.09]',
    washStrong: 'bg-[#f58020]/[0.14]',
    icon: 'text-[var(--brand-orange)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-orange)]',
    border: 'hover:border-[var(--brand-orange)]',
    borderSolid: 'border-[var(--brand-orange)]',
    gradient: 'from-[#d96a12] to-[#f58020]',
    accent: '#f58020',
    tileBg: 'bg-[rgba(245,128,32,0.08)]',
  },
  green: {
    wash: 'bg-[#098855]/[0.09]',
    washStrong: 'bg-[#098855]/[0.14]',
    icon: 'text-[var(--brand-green)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-green)]',
    border: 'hover:border-[var(--brand-green)]',
    borderSolid: 'border-[var(--brand-green)]',
    gradient: 'from-[#067048] to-[#098855]',
    accent: '#098855',
    tileBg: 'bg-[rgba(9,136,85,0.08)]',
  },
};
