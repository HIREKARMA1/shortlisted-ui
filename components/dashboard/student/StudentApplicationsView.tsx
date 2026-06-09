'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/layout/Shell';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

export function StudentApplicationsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const [apps, setApps] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api.getApplications().then(setApps).catch(() => toast.error(t('common.errors.network')));
  }, [router, t]);

  return (
    <DashboardShell
      title={t('dashboard.applications.title')}
      actions={
        <Link href="/dashboard/student" className="text-sm font-medium text-primary-600">
          ← {t('common.nav.dashboard')}
        </Link>
      }
    >
      {apps.length === 0 ? (
        <EmptyState message={t('dashboard.applications.empty')} />
      ) : (
        <div className="space-y-3">
          {apps.map((app) => (
            <div key={String(app.id)} className="flex items-center justify-between rounded-xl border border-line-default bg-white p-4">
              <div>
                <p className="font-semibold">{String(app.job_title)}</p>
                <p className="text-sm text-ink-muted">{String(app.company_name || '')}</p>
              </div>
              <Badge>{String(app.status)}</Badge>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
