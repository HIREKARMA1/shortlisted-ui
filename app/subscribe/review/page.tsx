'use client';

import { Clock3 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useStudentSubscribeGate } from '@/hooks/useSession';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';

export default function SubscribeReviewPage() {
  const { logout } = useAuth();
  const { ready, session } = useStudentSubscribeGate({ reviewOnly: true });

  if (!ready || !session) return null;

  return (
    <AuthLayout
      fitViewport
      kicker="WhatsApp enrollment"
      title="Your account is under review"
      subtitle="You can access your Shortlisted dashboard after the team verifies your payment."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-amber-100 p-2 text-amber-700">
            <Clock3 className="h-5 w-5" />
          </div>
          <div className="space-y-2">
            <Text as="h2" className="text-lg font-semibold text-slate-900">
              Verification in progress
            </Text>
            <Text className="text-sm text-slate-600">
              Thank you for choosing HireKarma. Our team is reviewing the payment you shared on
              WhatsApp. Once approved, your placement cell dashboard will unlock automatically —
              just sign in again.
            </Text>
          </div>
        </div>
        <Button type="button" variant="secondary" className="w-full" onClick={logout}>
          Sign out
        </Button>
      </div>
    </AuthLayout>
  );
}
