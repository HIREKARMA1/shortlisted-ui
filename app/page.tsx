import { Plus_Jakarta_Sans } from 'next/font/google';
import { HomePage } from '@/components/landing/home/HomePage';

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
