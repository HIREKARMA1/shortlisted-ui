import type { Metadata } from 'next';
import { LegalPageView } from '@/components/pages/LegalPageView';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Shortlisted',
  description: 'Terms and conditions for using the Shortlisted placement program by HireKarma.',
};

export default function Page() {
  return <LegalPageView pageKey="terms" />;
}
