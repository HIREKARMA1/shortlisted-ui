'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, MapPin, Briefcase } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

export function StudentJobsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [applying, setApplying] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api
      .getJobs()
      .then(setJobs)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
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

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.jobs.title')}
      subtitle={t('dashboard.jobs.subtitle')}
      onLogout={logout}
    >
      {jobs.length === 0 ? (
        <EmptyState message={t('dashboard.jobs.empty')} />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={String(job.id)} className="card-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-primary-50 p-2">
                      <Briefcase className="h-5 w-5 text-brand-blue" />
                    </div>
                    <h2 className="text-lg font-semibold text-ink-primary">{String(job.title)}</h2>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
                    {Boolean(job.company_name) && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" />
                        {String(job.company_name)}
                      </span>
                    )}
                    {Boolean(job.location) && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {String(job.location)}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="accent"
                  onClick={() => apply(String(job.id))}
                  disabled={applying === String(job.id)}
                >
                  {applying === String(job.id) ? t('common.actions.applying') : t('common.actions.apply')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
