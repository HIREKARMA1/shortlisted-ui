'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardRole } from '@/lib/dashboard-nav';

export function useRoleGuard(role: DashboardRole) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userType = localStorage.getItem('user_type');
    if (!token || userType !== role) {
      router.push('/auth/login');
    }
  }, [router, role]);
}
