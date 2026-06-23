import type { Metadata } from 'next';
import { LegalPageView } from '@/components/pages/LegalPageView';

export const metadata: Metadata = {
  title: 'Privacy Policy | Shortlisted',
  description: 'Privacy policy for the Shortlisted placement program by HireKarma.',
};

export default function Page() {
  return <LegalPageView pageKey="privacy" />;
}
