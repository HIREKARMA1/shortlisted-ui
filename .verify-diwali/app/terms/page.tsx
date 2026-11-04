import type { Metadata } from 'next';
import { LegalPageView } from '@/components/pages/LegalPageView';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Shortlisted',
  description: 'Terms and conditions for the HireKarma Shortlisted Program, covering training, attendance, assessments, and placement support.',
};

export default function Page() {
  return <LegalPageView pageKey="terms" />;
}
