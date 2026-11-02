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
  Route,
  UserRound,
  Users,
  Video,
  type LucideIcon,
} from 'lucide-react';

export const featureIcons: Record<string, LucideIcon> = {
  home: Home,
  trial: Route,
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
    tileBgHover: string;
  }
> = {
  blue: {
    wash: 'bg-[#1b52a4]/[0.09]',
    washStrong: 'bg-[#1b52a4]/[0.14]',
    icon: 'text-[var(--brand-blue)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-blue)]',
    border: 'hover:border-[#1b52a4]',
    borderSolid: 'border-[#1b52a4]',
    gradient: 'from-[#1b52a4] to-[#2c6cd1]',
    accent: '#1b52a4',
    tileBg: 'bg-[#1b52a4]/[0.08]',
    tileBgHover: 'hover:bg-[#1b52a4]/[0.14]',
  },
  sky: {
    wash: 'bg-[#00a2e5]/[0.09]',
    washStrong: 'bg-[#00a2e5]/[0.14]',
    icon: 'text-[var(--brand-sky)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-sky)]',
    border: 'hover:border-[#00a2e5]',
    borderSolid: 'border-[#00a2e5]',
    gradient: 'from-[#0077b6] to-[#00a2e5]',
    accent: '#00a2e5',
    tileBg: 'bg-[#00a2e5]/[0.08]',
    tileBgHover: 'hover:bg-[#00a2e5]/[0.14]',
  },
  yellow: {
    wash: 'bg-[#fec40d]/[0.14]',
    washStrong: 'bg-[#fec40d]/[0.22]',
    icon: 'text-[#0B1B33]',
    iconOnGradient: 'text-[#0B1B33]',
    ring: 'ring-[var(--brand-yellow)]',
    border: 'hover:border-[#fec40d]',
    borderSolid: 'border-[#fec40d]',
    gradient: 'from-[#fec40d] to-[#f5b400]',
    accent: '#fec40d',
    tileBg: 'bg-[#fec40d]/[0.10]',
    tileBgHover: 'hover:bg-[#fec40d]/[0.18]',
  },
  orange: {
    wash: 'bg-[#f58020]/[0.09]',
    washStrong: 'bg-[#f58020]/[0.14]',
    icon: 'text-[var(--brand-orange)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-orange)]',
    border: 'hover:border-[#f58020]',
    borderSolid: 'border-[#f58020]',
    gradient: 'from-[#d96a12] to-[#f58020]',
    accent: '#f58020',
    tileBg: 'bg-[#f58020]/[0.08]',
    tileBgHover: 'hover:bg-[#f58020]/[0.14]',
  },
  green: {
    wash: 'bg-[#098855]/[0.09]',
    washStrong: 'bg-[#098855]/[0.14]',
    icon: 'text-[var(--brand-green)]',
    iconOnGradient: 'text-white',
    ring: 'ring-[var(--brand-green)]',
    border: 'hover:border-[#098855]',
    borderSolid: 'border-[#098855]',
    gradient: 'from-[#067048] to-[#098855]',
    accent: '#098855',
    tileBg: 'bg-[#098855]/[0.08]',
    tileBgHover: 'hover:bg-[#098855]/[0.14]',
  },
};
