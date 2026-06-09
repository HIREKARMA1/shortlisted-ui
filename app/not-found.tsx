import Link from 'next/link';
import { BrandStripe } from '@/components/ui/BrandStripe';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface-page">
      <BrandStripe />
      <div className="flex min-h-[calc(100vh-4px)] flex-col items-center justify-center px-4 text-center">
        <p className="font-display text-6xl font-bold text-brand-blue">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold text-ink-primary">Page not found</h1>
        <p className="mt-2 max-w-md text-ink-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="mt-8">
          <Button variant="accent">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}
