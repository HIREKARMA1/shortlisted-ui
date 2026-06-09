'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { getPostLoginPath, readSession, Session } from '@/lib/auth/session';

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(readSession());
    setReady(true);
  }, []);

  return { session, ready, isLoggedIn: !!session };
}

export function useGuestOnly() {
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    if (!ready || !session) return;
    router.replace(getPostLoginPath(session));
  }, [ready, session, router]);
}

export function useStudentSubscribeGate() {
  const router = useRouter();
  const { session, ready } = useSession();
  const [accessStatus, setAccessStatus] = useState(session?.accessStatus ?? '');

  useEffect(() => {
    if (!ready) return;
    if (!session) {
      router.replace('/auth/login');
      return;
    }
    if (session.userType !== 'student') {
      router.replace(getPostLoginPath(session));
      return;
    }
    if (session.accessStatus === 'active') {
      router.replace('/dashboard/student');
      return;
    }

    api
      .getDashboard()
      .then((data) => {
        const status = (data.student as { access_status?: string })?.access_status;
        if (status === 'active') {
          localStorage.setItem('access_status', 'active');
          setAccessStatus('active');
          router.replace('/dashboard/student');
        }
      })
      .catch(() => undefined);
  }, [ready, session, router]);

  return { session, ready, accessStatus: accessStatus || session?.accessStatus };
}
