import { Suspense } from 'react';
import { ForgotPasswordFormView } from '@/components/auth/ForgotPasswordFormView';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordFormView />
    </Suspense>
  );
}
