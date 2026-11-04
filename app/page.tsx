import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { HomePage } from '@/components/landing/home/HomePage';

export const metadata: Metadata = {
  title: 'Shortlisted - AI Virtual Placement Cell | 60-Day Placement Journey',
  description:
    'Structured 60-day virtual placement cell for students. Small batches of 12, dedicated coordinator, expert-led training, and AI-matched jobs.',
  keywords: [
    'placement cell',
    'campus placement',
    'virtual placement cell',
    'interview preparation',
    'batch of 12',
    'job matching',
    'shortlisted',
  ],
  openGraph: {
    title: 'Shortlisted - AI Virtual Placement Cell | 60-Day Placement Journey',
    description:
      'Structured 60-day virtual placement cell for students. Small batches of 12, dedicated coordinator, expert-led training, and AI-matched jobs.',
    url: 'https://shortlisted.today',
    siteName: 'Shortlisted',
    type: 'website',
    images: [
      {
        url: '/images/shortlisted-logo.png',
        width: 800,
        height: 600,
        alt: 'Shortlisted Placement Cell',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shortlisted - AI Virtual Placement Cell',
    description:
      'Structured 60-day virtual placement cell for students. Small batches of 12, dedicated coordinator, expert-led training, and AI-matched jobs.',
  },
};

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-home-display',
  display: 'swap',
});

export default function Page() {
  return (
    <div className={display.variable}>
      <HomePage />
    </div>
  );
}
