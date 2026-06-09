'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

export function StudentJobsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api.getJobs().then(setJobs).catch(() => toast.error(t('common.errors.network')));
  }, [router, t]);

  const apply = async (jobId: string) => {
    setApplying(jobId);
    try {
      await api.applyJob(jobId);
      toast.success(t('dashboard.jobs.applySuccess'));
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(msg);
    } finally {
      setApplying(null);
    }
  };

  return (
    <DashboardShell
      title={t('dashboard.jobs.title')}
      actions={
        <Link href="/dashboard/student" className="text-sm font-medium text-primary-600">
          ← {t('common.nav.dashboard')}
        </Link>
      }
    >
      {jobs.length === 0 ? (
        <EmptyState message={t('dashboard.jobs.empty')} />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={String(job.id)}>
              <h2 className="text-lg font-semibold">{String(job.title)}</h2>
              <p className="text-sm text-ink-muted">
                {String(job.company_name || '')} · {String(job.location || '')}
              </p>
              <Button className="mt-4" onClick={() => apply(String(job.id))} disabled={applying === String(job.id)}>
                {applying === String(job.id) ? t('common.actions.applying') : t('common.actions.apply')}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
