'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Building2, MapPin, Users, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { applicationBadgeTone } from '@/lib/status';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type JobRow = Record<string, unknown>;
type Applicant = Record<string, unknown>;

export function AdminJobsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [batches, setBatches] = useState<JobRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [ready, setReady] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token') || localStorage.getItem('user_type') !== 'admin') {
      router.push('/auth/login');
      return;
    }
    api
      .listMyBatches()
      .then(setBatches)
      .catch(() => router.push('/auth/login'))
      .finally(() => setReady(true));
  }, [router]);

  useEffect(() => {
    if (!ready) return;
    setLoadingJobs(true);
    api
      .getAdminJobs(batchFilter || undefined)
      .then(setJobs)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoadingJobs(false));
  }, [ready, batchFilter, t]);

  const batchOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.adminJobs.allBatches') },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, t],
  );

  const openApplicants = async (job: JobRow) => {
    setSelectedJob(job);
    setSelectedApplicant(null);
    setLoadingApplicants(true);
    try {
      const data = await api.getJobApplicants(String(job.id), String(job.batch_id));
      setApplicants(data);
    } catch {
      toast.error(t('common.errors.generic'));
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const closeApplicants = () => {
    setSelectedJob(null);
    setApplicants([]);
    setSelectedApplicant(null);
  };

  if (!ready) return <LoadingState />;

  const student = selectedApplicant?.student as Record<string, unknown> | undefined;

  return (
    <DashboardLayout
      role="admin"
      title={t('dashboard.adminJobs.title')}
      subtitle={t('dashboard.adminJobs.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 max-w-xs">
        <Select
          label={t('dashboard.adminJobs.filterBatch')}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          options={batchOptions}
        />
      </div>

      {loadingJobs ? (
        <LoadingState />
      ) : jobs.length === 0 ? (
        <EmptyState message={t('dashboard.adminJobs.empty')} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line-default bg-white">
          <div className="hidden border-b border-line-default bg-surface-muted px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted md:grid md:grid-cols-5 md:gap-4">
            <span>{t('dashboard.adminJobs.columns.title')}</span>
            <span>{t('dashboard.adminJobs.columns.company')}</span>
            <span>{t('dashboard.adminJobs.columns.location')}</span>
            <span>{t('dashboard.adminJobs.columns.batch')}</span>
            <span>{t('dashboard.adminJobs.columns.actions')}</span>
          </div>
          <div className="divide-y divide-line-default">
            {jobs.map((job) => (
              <div
                key={`${String(job.batch_id)}-${String(job.id)}`}
                className="px-4 py-4 md:grid md:grid-cols-5 md:items-center md:gap-4"
              >
                <p className="font-medium text-ink-primary">{String(job.title)}</p>
                <p className="mt-1 text-sm text-ink-muted md:mt-0">
                  {job.company_name ? (
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      {String(job.company_name)}
                    </span>
                  ) : (
                    '—'
                  )}
                </p>
                <p className="mt-1 text-sm text-ink-muted md:mt-0">
                  {job.location ? (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {String(job.location)}
                    </span>
                  ) : (
                    '—'
                  )}
                </p>
                <p className="mt-1 text-sm font-medium text-brand-blue md:mt-0">{String(job.batch_name)}</p>
                <div className="mt-3 md:mt-0">
                  <Button variant="secondary" className="text-xs" onClick={() => openApplicants(job)}>
                    <Users className="mr-1.5 h-3.5 w-3.5" />
                    {t('dashboard.adminJobs.viewApplicants')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-elevated">
            <div className="flex items-center justify-between border-b border-line-default px-5 py-4">
              <div>
                <h3 className="font-semibold text-ink-primary">{String(selectedJob.title)}</h3>
                <p className="text-sm text-ink-muted">
                  {t('dashboard.adminJobs.applicantsFor', { batch: String(selectedJob.batch_name) })}
                </p>
              </div>
              <button type="button" onClick={closeApplicants} className="rounded-lg p-2 hover:bg-surface-muted">
                <X className="h-5 w-5 text-ink-muted" />
              </button>
            </div>

            <div className="grid max-h-[calc(90vh-4rem)] gap-0 overflow-hidden md:grid-cols-2">
              <div className="overflow-y-auto border-b border-line-default p-4 md:border-b-0 md:border-r">
                {loadingApplicants ? (
                  <LoadingState />
                ) : applicants.length === 0 ? (
                  <EmptyState message={t('dashboard.adminJobs.noApplicants')} />
                ) : (
                  <div className="space-y-2">
                    {applicants.map((app) => {
                      const s = app.student as Record<string, unknown>;
                      return (
                        <button
                          key={String(app.application_id)}
                          type="button"
                          onClick={() => setSelectedApplicant(app)}
                          className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                            selectedApplicant?.application_id === app.application_id
                              ? 'border-brand-sky bg-primary-50'
                              : 'border-line-default hover:border-brand-sky'
                          }`}
                        >
                          <p className="font-medium">{String(s.name)}</p>
                          <p className="text-sm text-ink-muted">{String(s.email)}</p>
                          <div className="mt-2">
                            <Badge tone={applicationBadgeTone(String(app.status))}>{String(app.status)}</Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="overflow-y-auto p-4">
                {selectedApplicant && student ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-brand-blue">{t('dashboard.adminJobs.profileTitle')}</h4>
                    <dl className="space-y-3 text-sm">
                      {[
                        ['name', student.name],
                        ['email', student.email],
                        ['phone', student.phone],
                        ['college', student.college],
                        ['branch', student.branch],
                        ['graduation_year', student.graduation_year],
                        ['skills', student.skills],
                        ['preferred_roles', student.preferred_roles],
                      ].map(([key, value]) =>
                        value ? (
                          <div key={key}>
                            <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                              {t(`dashboard.adminJobs.profile.${key}`)}
                            </dt>
                            <dd className="mt-1 text-ink-primary">{String(value)}</dd>
                          </div>
                        ) : null,
                      )}
                    </dl>
                    {Boolean(student.resume_url) && (
                      <a
                        href={String(student.resume_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-brand text-sm"
                      >
                        {t('dashboard.adminJobs.viewResume')}
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-ink-muted">{t('dashboard.adminJobs.selectApplicant')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
