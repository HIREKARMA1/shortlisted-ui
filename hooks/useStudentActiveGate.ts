'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { api } from '@/lib/api';
import { getLoginPathForRole } from '@/lib/auth/login-routes';
import { getLockedStudentPath } from '@/lib/auth/session';

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
          const student = data.student as {
            access_status?: string;
            signup_channel?: string;
          };
          const status = String(student?.access_status || '');
          const channel = String(
            student?.signup_channel || localStorage.getItem('signup_channel') || 'web',
          );
          localStorage.setItem('access_status', status);
          localStorage.setItem('signup_channel', channel);
          if (status !== 'active') {
            router.replace(getLockedStudentPath({ signupChannel: channel }));
          }
        })
        .catch((err) => {
          // 401 is handled by the API interceptor (refresh or force logout).
          if (axios.isAxiosError(err) && err.response?.status === 401) return;
          const channel = localStorage.getItem('signup_channel') || 'web';
          router.replace(getLockedStudentPath({ signupChannel: channel }));
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
