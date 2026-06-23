import type { Metadata } from 'next';
import { LegalPageView } from '@/components/pages/LegalPageView';

export const metadata: Metadata = {
  title: 'Refund & Cancellation Policy | Shortlisted',
  description: 'Refund and cancellation policy for Shortlisted subscriptions.',
};

export default function Page() {
  return <LegalPageView pageKey="refund" />;
}
