'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/StatCard';
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

  const totalStudents = batches.reduce((sum, b) => sum + Number(b.seats_filled || 0), 0);

  return (
    <DashboardLayout
      role="admin"
      title={t('dashboard.admin.title')}
      subtitle={t('dashboard.admin.subtitle')}
      onLogout={logout}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard label={t('dashboard.admin.title')} value={batches.length} accent="blue" icon={Users} />
        <StatCard
          label={t('dashboard.superAdmin.stats.students')}
          value={totalStudents}
          accent="sky"
          icon={Users}
        />
      </div>

      {batches.length === 0 ? (
        <EmptyState message={t('dashboard.admin.empty')} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => {
            const fillPct = Math.round((Number(b.seats_filled) / Number(b.max_seats || 1)) * 100);
            return (
              <Link
                key={String(b.id)}
                href={`/dashboard/admin/batches/${b.id}`}
                className="card-surface group block p-5 transition-all hover:border-brand-sky hover:shadow-elevated"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-brand-blue group-hover:text-brand-sky">{String(b.name)}</h2>
                  <ChevronRight className="h-5 w-5 text-ink-muted group-hover:text-brand-sky" />
                </div>
                <p className="mt-2 text-sm text-ink-muted">
                  {t('dashboard.admin.seats', { filled: String(b.seats_filled), max: String(b.max_seats) })}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-brand-sky transition-all"
                    style={{ width: `${fillPct}%` }}
                  />
                </div>
                <p className="mt-3 text-xs font-medium text-brand-orange">{t('dashboard.admin.viewRoster')}</p>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
