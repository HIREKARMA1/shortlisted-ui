'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

export function StudentDashboardView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/auth/login');
      return;
    }
    if (localStorage.getItem('access_status') !== 'active') {
      router.push('/subscribe');
      return;
    }
    api.getDashboard().then(setData).catch(() => router.push('/subscribe'));
  }, [router]);

  if (!data) return <LoadingState />;

  const student = data.student as Record<string, unknown>;
  const batch = data.batch as Record<string, unknown> | null;
  const jobs = (data.recent_jobs as Record<string, unknown>[]) || [];
  const apps = (data.active_applications as Record<string, unknown>[]) || [];

  return (
    <DashboardShell
      title={t('dashboard.student.title')}
      subtitle={t('dashboard.student.welcome', { name: String(student.name) })}
      actions={
        <>
          <Link href="/dashboard/student/jobs">
            <Button variant="secondary">{t('common.nav.jobs')}</Button>
          </Link>
          <Link href="/dashboard/student/applications">
            <Button variant="secondary">{t('common.nav.applications')}</Button>
          </Link>
          <Button variant="ghost" onClick={logout}>
            {t('common.nav.logout')}
          </Button>
        </>
      }
    >
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-ink-muted">{t('dashboard.student.stats.access')}</p>
          <p className="mt-1 text-xl font-semibold capitalize">{String(student.access_status)}</p>
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">{t('dashboard.student.stats.batch')}</p>
          <p className="mt-1 text-xl font-semibold">{batch ? String(batch.name) : t('dashboard.student.stats.batchAdminPending')}</p>
          {batch && (
            <p className="text-sm text-ink-muted">
              {t('dashboard.student.stats.batchAdmin')}: {String(batch.admin_name || '—')}
            </p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-ink-muted">{t('dashboard.student.stats.applications')}</p>
          <p className="mt-1 text-xl font-semibold">{String(data.applications_count ?? 0)}</p>
        </Card>
      </div>

      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold">{t('dashboard.student.sections.jobs')}</h2>
        {jobs.length === 0 ? (
          <EmptyState message={t('dashboard.student.empty.jobs')} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <Card key={String(job.id)}>
                <h3 className="font-semibold">{String(job.title)}</h3>
                <p className="text-sm text-ink-muted">{String(job.company_name || job.location || '')}</p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">{t('dashboard.student.sections.applications')}</h2>
        {apps.length === 0 ? (
          <EmptyState message={t('dashboard.student.empty.applications')} />
        ) : (
          apps.map((app) => (
            <div key={String(app.id)} className="mb-2 flex items-center justify-between rounded-lg border border-line-default bg-white px-4 py-3">
              <span className="font-medium">{String(app.job_title)}</span>
              <Badge>{String(app.status)}</Badge>
            </div>
          ))
        )}
      </section>
    </DashboardShell>
  );
}
