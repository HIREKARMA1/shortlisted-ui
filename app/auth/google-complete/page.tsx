'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { getPostLoginPath, getSafeRedirectPath } from '@/lib/auth/session';
import { getSupabaseBrowserClient } from '@/lib/supabaseClient';

function GoogleCompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveSession } = useAuth();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const fail = (reason: string) => {
      router.replace(`/auth/error?reason=${encodeURIComponent(reason)}`);
    };

    const run = async () => {
      try {
        const supabase = getSupabaseBrowserClient();
        let sessionResult = await supabase.auth.getSession();
        for (let attempt = 0; attempt < 3 && !sessionResult.data.session?.access_token; attempt += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, 300));
          sessionResult = await supabase.auth.getSession();
        }
        const accessToken = sessionResult.data.session?.access_token;
        if (sessionResult.error || !accessToken) {
          fail('google_auth_failed');
          return;
        }

        const data = await api.loginWithGoogle(accessToken);
        if (data.user_type !== 'student' || !data.access_token) {
          fail('google_auth_failed');
          return;
        }
        saveSession(data);
        const redirectTo = getSafeRedirectPath(searchParams.get('redirect'));
        router.replace(
          redirectTo ??
            getPostLoginPath({
              accessToken: data.access_token,
              userType: data.user_type,
              userName: data.name,
              accessStatus: data.access_status || '',
              signupChannel: data.signup_channel || 'web',
            }),
        );
      } catch (error: unknown) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 401) fail('google_auth_unauthorized');
        else if (status === 403) fail('google_auth_forbidden');
        else if (status === 409) fail('google_auth_conflict');
        else fail('google_auth_failed');
      }
    };

    void run();
  }, [router, saveSession, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        <p className="text-sm text-ink-muted">Completing Google sign-in…</p>
      </div>
    </div>
  );
}

export default function GoogleCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      }
    >
      <GoogleCompleteContent />
    </Suspense>
  );
}
