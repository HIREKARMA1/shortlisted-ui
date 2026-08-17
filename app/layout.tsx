import type { Metadata } from 'next';
import { DM_Sans, Inter, Newsreader } from 'next/font/google';
import { AppProviders } from '@/components/providers/AppProviders';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Shortlisted - Your Dedicated Placement Cell',
  description: 'Subscription-based placement program by HireKarma. Curated batches, matched jobs, dedicated coordinators.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable} ${newsreader.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
