'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { AuthLayout } from '@/components/layout/AuthLayout';

const REASONS: Record<string, string> = {
  missing_code: 'Google did not return a sign-in code. Please try again.',
  exchange_failed: 'Google sign-in could not be completed. Please try again.',
  callback_error: 'Google sign-in could not be completed. Please try again.',
  google_auth_unauthorized: 'That Google session expired. Please sign in again.',
  google_auth_forbidden: 'This account cannot sign in with Google.',
  google_auth_conflict: 'This email is already linked to a different Google account.',
  google_auth_failed: 'Google sign-in failed. Please try again.',
};

function AuthErrorContent() {
  const reason = useSearchParams().get('reason') || 'google_auth_failed';
  return (
    <AuthLayout kicker="Sign in" title="Google sign-in stopped" subtitle={REASONS[reason] || REASONS.google_auth_failed}>
      <Link href="/auth/login" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-brand-blue text-sm font-bold uppercase tracking-wide text-white">
        Back to sign in
      </Link>
    </AuthLayout>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
