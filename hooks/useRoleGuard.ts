'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { getLoginPathForRole } from '@/lib/auth/login-routes';

export function useRoleGuard(role: DashboardRole) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    if (!token || userType !== role) {
      router.push(getLoginPathForRole(role));
    } else {
      setReady(true);
    }
  }, [router, role]);

  return { ready };
}
