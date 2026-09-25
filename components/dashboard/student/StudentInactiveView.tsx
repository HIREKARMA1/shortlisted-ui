'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { getLoginPathForRole } from '@/lib/auth/login-routes';
import { getLockedStudentPath } from '@/lib/auth/session';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';

export function StudentInactiveView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token') || localStorage.getItem('user_type') !== 'student') {
      router.replace(getLoginPathForRole('student'));
      return;
    }

    let cancelled = false;
    api
      .getDashboard()
      .then((data) => {
        if (cancelled) return;
        const student = data.student as { access_status?: string; signup_channel?: string };
        const status = String(student?.access_status || '');
        const channel = String(student?.signup_channel || localStorage.getItem('signup_channel') || 'web');
        localStorage.setItem('access_status', status);
        localStorage.setItem('signup_channel', channel);
        if (status === 'active') {
          router.replace('/dashboard/student');
          return;
        }
        if (status !== 'inactive') {
          router.replace(getLockedStudentPath({ signupChannel: channel }));
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) router.replace(getLoginPathForRole('student'));
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!ready) return <LoadingState />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-lg rounded-2xl border border-line-default bg-white p-8 text-center shadow-card">
        <h1 className="text-2xl font-bold text-ink-primary">{t('dashboard.student.inactiveTitle')}</h1>
        <p className="mt-3 text-base text-ink-secondary">{t('dashboard.student.inactiveMessage')}</p>
        <Button className="mt-6" variant="secondary" onClick={logout}>
          {t('common.nav.logout')}
        </Button>
      </div>
    </div>
  );
}
