'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { getJobListingStatus, normalizeApplication, normalizeJob } from '@/lib/jobUtils';
import { isResumeRequiredError, showResumeRequiredToast } from '@/lib/resumeRequiredToast';
import type { StudentJob } from '@/lib/types/studentJobs';
import { cn } from '@/lib/utils';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ApplyWithResumeModal } from '@/components/dashboard/student/jobs/ApplyWithResumeModal';
import { JobCard } from '@/components/dashboard/student/jobs/JobCard';
import { JobDescriptionModal } from '@/components/dashboard/student/jobs/JobDescriptionModal';
import {
  ManagementPagination,
  getTotalPages,
  paginateItems,
} from '@/components/dashboard/shared/management/ManagementPagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';

type StatusFilter = 'all' | 'open' | 'expired';

const STATUS_FILTERS: StatusFilter[] = ['all', 'open', 'expired'];
const PAGE_SIZE_OPTIONS = [20, 30, 50] as const;
const DEFAULT_PAGE_SIZE = 20;

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
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [ready, setReady] = useState(false);
  const autoApplyAttempted = useRef(false);
  const filterRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize]);

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const searched = !q
      ? jobs
      : jobs.filter((job) => {
          const company = (job.company_name || job.corporate_name || '').toLowerCase();
          return (
            job.title.toLowerCase().includes(q) ||
            company.includes(q) ||
            String(job.location || '').toLowerCase().includes(q)
          );
        });

    const byStatus =
      statusFilter === 'all'
        ? searched
        : searched.filter((job) => getJobListingStatus(job) === statusFilter);

    return [...byStatus].sort((a, b) => {
      const aOpen = getJobListingStatus(a) === 'open' ? 0 : 1;
      const bOpen = getJobListingStatus(b) === 'open' ? 0 : 1;
      return aOpen - bOpen;
    });
  }, [jobs, search, statusFilter]);

  const totalPages = getTotalPages(filteredJobs.length, pageSize);
  const safePage = Math.min(page, totalPages);
  const pageJobs = paginateItems(filteredJobs, safePage, pageSize);

  const statusFilterLabel =
    statusFilter === 'open'
      ? t('dashboard.jobs.filterOpen')
      : statusFilter === 'expired'
        ? t('dashboard.jobs.filterExpired')
        : t('dashboard.jobs.filterAll');

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.jobs.title')}
      subtitle={t('dashboard.jobs.subtitle')}
      onLogout={logout}
    >
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('dashboard.jobs.searchPlaceholder')}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300"
            >
              <Filter className="h-4 w-4" />
              {t('dashboard.jobs.filter')}
              <span className="text-brand-blue">{statusFilterLabel}</span>
              <ChevronDown className={cn('h-4 w-4 transition-transform', filterOpen && 'rotate-180')} />
            </button>

            {filterOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {STATUS_FILTERS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setStatusFilter(option);
                      setFilterOpen(false);
                    }}
                    className={cn(
                      'w-full px-4 py-2.5 text-left text-sm transition-colors',
                      statusFilter === option
                        ? 'bg-blue-50 font-semibold text-brand-blue'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {option === 'open'
                      ? t('dashboard.jobs.filterOpen')
                      : option === 'expired'
                        ? t('dashboard.jobs.filterExpired')
                        : t('dashboard.jobs.filterAll')}
                  </button>
                ))}
              </div>
            )}
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-ink-secondary">
            <span className="whitespace-nowrap font-medium">{t('dashboard.jobs.pageSize')}</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-brand-blue"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <EmptyState message={t('dashboard.jobs.empty')} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageJobs.map((job, index) => (
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

          {filteredJobs.length > pageSize && (
            <div className="mt-4 overflow-hidden rounded-xl border border-line-default bg-white">
              <ManagementPagination
                page={safePage}
                total={filteredJobs.length}
                pageSize={pageSize}
                onPageChange={setPage}
                summary={t('dashboard.jobs.pagination', {
                  from: String((safePage - 1) * pageSize + 1),
                  to: String(Math.min(safePage * pageSize, filteredJobs.length)),
                  total: String(filteredJobs.length),
                })}
                prevLabel={t('dashboard.jobs.prev')}
                nextLabel={t('dashboard.jobs.next')}
              />
            </div>
          )}
        </>
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
