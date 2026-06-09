'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

export function AdminDashboardView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [batches, setBatches] = useState<Record<string, unknown>[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api
      .listMyBatches()
      .then(setBatches)
      .catch(() => router.push('/auth/login'))
      .finally(() => setReady(true));
  }, [router]);

  if (!ready) return <LoadingState />;

  return (
    <DashboardShell
      title={t('dashboard.admin.title')}
      actions={
        <Button variant="ghost" onClick={logout}>
          {t('common.nav.logout')}
        </Button>
      }
    >
      {batches.length === 0 ? (
        <EmptyState message={t('dashboard.admin.empty')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => (
            <Link
              key={String(b.id)}
              href={`/dashboard/admin/batches/${b.id}`}
              className="card-surface block p-5 transition-shadow hover:shadow-elevated"
            >
              <h2 className="font-semibold">{String(b.name)}</h2>
              <p className="text-sm text-ink-muted">
                {t('dashboard.admin.seats', { filled: String(b.seats_filled), max: String(b.max_seats) })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
