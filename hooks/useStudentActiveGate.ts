'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { getLoginPathForRole } from '@/lib/auth/login-routes';

export function useStudentActiveGate() {
  const router = useRouter();

  useEffect(() => {
    const enforce = () => {
      if (!localStorage.getItem('access_token')) {
        router.replace(getLoginPathForRole('student'));
        return;
      }
      if (localStorage.getItem('user_type') !== 'student') {
        router.replace(getLoginPathForRole(localStorage.getItem('user_type')));
        return;
      }

      api
        .getDashboard()
        .then((data) => {
          const status = String((data.student as { access_status?: string })?.access_status || '');
          localStorage.setItem('access_status', status);
          if (status !== 'active') {
            router.replace('/subscribe');
          }
        })
        .catch((err) => {
          // 401 is handled by the API interceptor (refresh or force logout).
          if (axios.isAxiosError(err) && err.response?.status === 401) return;
          router.replace('/subscribe');
        });
    };

    enforce();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) enforce();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [router]);
}
