'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardRole } from '@/lib/dashboard-nav';

export function useRoleGuard(role: DashboardRole) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    if (!token || userType !== role) {
      router.push(role === 'super_admin' ? '/auth/login/internal' : '/auth/login');
    } else {
      setReady(true);
    }
  }, [router, role]);

  return { ready };
}
