'use client';

import { useRouter } from 'next/navigation';
import type { FeatureAccess } from '@/lib/home/content';
import { useHome } from './HomeProvider';
import { useShell } from './ShellContext';

export function useFeatureGate() {
  const router = useRouter();
  const home = useHome();
  const shell = useShell();

  const openFeature = (feature: { href: string; access: FeatureAccess }) => {
    shell.setMobileOpen(false);
    if (home.isInactive && feature.access !== 'public') {
      router.push('/dashboard/student/inactive');
      return;
    }
    if (feature.access === 'public') {
      if (feature.href.startsWith('#')) {
        document.querySelector(feature.href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        router.push(feature.href);
      }
      return;
    }
    if (feature.access === 'signIn') {
      const targetUrl = home.isLoggedIn
        ? feature.href
        : `/auth/login?redirect=${encodeURIComponent(feature.href)}`;
      router.push(targetUrl);
      return;
    }
    if (home.isPaidStudent) {
      router.push(feature.href);
      return;
    }
    if (home.isStaff) {
      router.push(home.dashboardHref);
      return;
    }
    shell.setPendingTargetHref(feature.href);
    shell.setUnlockOpen(true);
  };

  return { openFeature, ...home };
}
