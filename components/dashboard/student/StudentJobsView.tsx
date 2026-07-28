'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { normalizeApplication, normalizeJob } from '@/lib/jobUtils';
import { isResumeRequiredError, showResumeRequiredToast } from '@/lib/resumeRequiredToast';
import type { StudentJob } from '@/lib/types/studentJobs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ApplyWithResumeModal } from '@/components/dashboard/student/jobs/ApplyWithResumeModal';
import { JobCard } from '@/components/dashboard/student/jobs/JobCard';
import { JobDescriptionModal } from '@/components/dashboard/student/jobs/JobDescriptionModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';

export function StudentJobsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [jobs, setJobs] = useState<StudentJob[]>([]);
  const [appStatusByJob, setAppStatusByJob] = useState<Record<string, string>>({});
  const [applying, setApplying] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<StudentJob | null>(null);
  const [applyJobTarget, setApplyJobTarget] = useState<StudentJob | null>(null);
  const [search, setSearch] = useState('');
  const [ready, setReady] = useState(false);
  const autoApplyAttempted = useRef(false);

  const load = useCallback(async () => {
    try {
      const [jobsRaw, appsRaw] = await Promise.all([api.getJobs(), api.getApplications()]);
      const statusMap: Record<string, string> = {};
      (appsRaw as Record<string, unknown>[]).forEach((app) => {
        const normalized = normalizeApplication(app);
        statusMap[normalized.job_id] = normalized.status;
      });
      setAppStatusByJob(statusMap);
      setJobs(
        (jobsRaw as Record<string, unknown>[]).map((job) =>
          normalizeJob(job, statusMap[String(job.id)])
        )
      );
    } catch {
      toast.error(t('common.errors.network'));
    } finally {
      setReady(true);
    }
  }, [t]);

  const openApplyModal = useCallback((job: StudentJob) => {
    setApplyJobTarget(job);
  }, []);

  const submitApplication = useCallback(
    async (jobId: string) => {
      setApplying(jobId);
      try {
        await api.applyJob(jobId);
        toast.success(t('dashboard.jobs.applySuccess'));
        setAppStatusByJob((prev) => ({ ...prev, [jobId]: 'applied' }));
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId ? { ...job, application_status: 'applied' } : job
          )
        );
        setSelectedJob((prev) =>
          prev?.id === jobId ? { ...prev, application_status: 'applied' } : prev
        );
      } catch (err: unknown) {
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        if (isResumeRequiredError(detail)) {
          showResumeRequiredToast(
            t('dashboard.jobs.resumeRequired'),
            t('dashboard.jobs.uploadResumeLink')
          );
          throw err;
        }
        const msg = detail || t('common.errors.generic');
        toast.error(String(msg));
        throw err;
      } finally {
        setApplying(null);
      }
    },
    [t]
  );

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/auth/login');
      return;
    }
    load();
  }, [router, load]);

  useEffect(() => {
    if (!ready || jobs.length === 0) return;
    const jobId = searchParams.get('jobId');
    if (!jobId) return;
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return;
    setSelectedJob(job);
    if (
      searchParams.get('apply') === '1' &&
      !appStatusByJob[jobId] &&
      !autoApplyAttempted.current
    ) {
      autoApplyAttempted.current = true;
      openApplyModal(job);
    }
  }, [ready, jobs, searchParams, appStatusByJob, openApplyModal]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((job) => {
      const company = (job.company_name || job.corporate_name || '').toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        company.includes(q) ||
        String(job.location || '').toLowerCase().includes(q)
      );
    });
  }, [jobs, search]);

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.jobs.title')}
      subtitle={t('dashboard.jobs.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 rounded-xl border border-primary-100 bg-gradient-to-r from-primary-50 to-secondary-50 p-5">
        <p className="text-sm text-ink-secondary">{t('dashboard.jobs.headerHint')}</p>
        <p className="mt-1 text-lg font-semibold text-ink-primary">
          {t('dashboard.jobs.resultsCount', { count: String(filteredJobs.length) })}
        </p>
      </div>

      <div className="mb-5 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('dashboard.jobs.searchPlaceholder')}
          className="pl-10"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState message={t('dashboard.jobs.empty')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, index) => (
            <JobCard
              key={job.id}
              job={job}
              cardIndex={index}
              onViewDescription={() => setSelectedJob(job)}
              onApply={() => openApplyModal(job)}
              isApplying={applying === job.id}
            />
          ))}
        </div>
      )}

      {selectedJob && (
        <JobDescriptionModal
          job={selectedJob}
          applicationStatus={appStatusByJob[selectedJob.id]}
          onClose={() => setSelectedJob(null)}
          onApply={() => openApplyModal(selectedJob)}
          isApplying={applying === selectedJob.id}
        />
      )}

      {applyJobTarget && (
        <ApplyWithResumeModal
          job={applyJobTarget}
          isOpen={Boolean(applyJobTarget)}
          isApplying={applying === applyJobTarget.id}
          onClose={() => setApplyJobTarget(null)}
          onConfirmApply={() => submitApplication(applyJobTarget.id)}
        />
      )}
    </DashboardLayout>
  );
}
