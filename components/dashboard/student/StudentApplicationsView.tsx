'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { applicationBadgeTone } from '@/lib/status';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

export function StudentApplicationsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [apps, setApps] = useState<Record<string, unknown>[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api
      .getApplications()
      .then(setApps)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [router, t]);

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.applications.title')}
      subtitle={t('dashboard.applications.subtitle')}
      onLogout={logout}
    >
      {apps.length === 0 ? (
        <EmptyState message={t('dashboard.applications.empty')} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line-default bg-white">
          <div className="hidden border-b border-line-default bg-surface-muted px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted sm:grid sm:grid-cols-[1fr_auto]">
            <span>{t('dashboard.jobs.title')}</span>
            <span>{t('dashboard.applications.status')}</span>
          </div>
          <div className="divide-y divide-line-default">
            {apps.map((app) => (
              <div
                key={String(app.id)}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:grid sm:grid-cols-[1fr_auto]"
              >
                <div>
                  <p className="font-semibold text-ink-primary">{String(app.job_title)}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
                    <Building2 className="h-3.5 w-3.5" />
                    {String(app.company_name || '—')}
                  </p>
                </div>
                <Badge tone={applicationBadgeTone(String(app.status))}>{String(app.status)}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
