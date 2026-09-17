'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import {
  getPostLoginPath,
  getSafeRedirectPath,
  readSession,
  Session,
} from '@/lib/auth/session';

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
    const redirectTo = getSafeRedirectPath(
      new URLSearchParams(window.location.search).get('redirect'),
    );
    router.replace(redirectTo ?? getPostLoginPath(session));
  }, [ready, session, router]);
}

export function useAuthenticatedGate(returnTo: string) {
  const router = useRouter();
  const { session, ready } = useSession();

  useEffect(() => {
    const enforce = () => {
      const current = readSession();
      if (!current) {
        router.replace(`/auth/login?redirect=${encodeURIComponent(returnTo)}`);
      }
    };

    if (!ready) return;
    if (!session) enforce();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) enforce();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [ready, session, router, returnTo]);

  return { session, ready, canAccess: ready && !!session };
}

export function useStudentSubscribeGate(options?: { reviewOnly?: boolean }) {
  const router = useRouter();
  const { session, ready } = useSession();
  const [accessStatus, setAccessStatus] = useState(session?.accessStatus ?? '');
  const [signupChannel, setSignupChannel] = useState(session?.signupChannel ?? 'web');
  const reviewOnly = options?.reviewOnly === true;

  useEffect(() => {
    if (!ready) return;

    const enforce = () => {
      const current = readSession();
      if (!current) {
        router.replace('/auth/login');
        return;
      }
      if (current.userType !== 'student') {
        router.replace(getPostLoginPath(current));
        return;
      }

      // Always validate with the API. Do not trust stale localStorage access_status —
      // that caused a dashboard ↔ subscribe redirect loop when the access token expired.
      api
        .getDashboard()
        .then((data) => {
          const student = data.student as {
            access_status?: string;
            signup_channel?: string;
          };
          const status = String(student?.access_status || '');
          const channel = String(student?.signup_channel || current.signupChannel || 'web');
          localStorage.setItem('access_status', status);
          localStorage.setItem('signup_channel', channel);
          setAccessStatus(status);
          setSignupChannel(channel);
          if (status === 'active') {
            router.replace('/dashboard/student');
            return;
          }
          if (reviewOnly && channel !== 'whatsapp') {
            router.replace('/subscribe');
            return;
          }
          if (!reviewOnly && channel === 'whatsapp') {
            router.replace('/subscribe/review');
          }
        })
        .catch(() => undefined);
    };

    enforce();

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) enforce();
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [ready, session, router, reviewOnly]);

  return {
    session,
    ready,
    accessStatus: accessStatus || session?.accessStatus,
    signupChannel: signupChannel || session?.signupChannel || 'web',
  };
}
