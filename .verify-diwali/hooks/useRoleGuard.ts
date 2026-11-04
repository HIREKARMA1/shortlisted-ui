'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { getLoginPathForRole } from '@/lib/auth/login-routes';

export function useRoleGuard(role: DashboardRole) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const enforce = () => {
      const token = localStorage.getItem('access_token');
      const userType = localStorage.getItem('user_type');
      if (!token || userType !== role) {
        setReady(false);
        router.replace(getLoginPathForRole(role));
      } else {
        setReady(true);
      }
    };

    enforce();

    // Re-check when the page is restored from bfcache (browser back/forward).
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) enforce();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [router, role]);

  return { ready };
}
