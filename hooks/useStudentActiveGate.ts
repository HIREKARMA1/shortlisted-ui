'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export function useStudentActiveGate() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/auth/login');
      return;
    }
    if (localStorage.getItem('user_type') !== 'student') {
      router.push('/auth/login');
      return;
    }

    api
      .getDashboard()
      .then((data) => {
        const status = String((data.student as { access_status?: string })?.access_status || '');
        localStorage.setItem('access_status', status);
        if (status !== 'active') {
          router.push('/subscribe');
        }
      })
      .catch(() => router.push('/subscribe'));
  }, [router]);
}
