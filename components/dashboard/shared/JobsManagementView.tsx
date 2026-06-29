'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Briefcase, Building2, Eye, MapPin, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { AppliedStudentsModal } from '@/components/dashboard/shared/AppliedStudentsModal';
import { ManagementPageHeader } from '@/components/dashboard/shared/ManagementPageHeader';
import { ManagementSearchInput } from '@/components/dashboard/shared/management/ManagementSearchInput';
import {
  alternatingRowClass,
  ManagementPagination,
  paginateItems,
} from '@/components/dashboard/shared/management/ManagementPagination';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type JobRow = Record<string, unknown>;
type Applicant = Record<string, unknown>;

export function JobsManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard(role);
  const [batches, setBatches] = useState<JobRow[]>([]);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobRow | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    const loadBatches = role === 'super_admin' ? api.listAllBatches() : api.listMyBatches();
    loadBatches
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [role, t]);

  useEffect(() => {
    if (!ready) return;
    setLoadingJobs(true);
    api
      .getAdminJobs(batchFilter || undefined)
      .then(setJobs)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoadingJobs(false));
  }, [ready, batchFilter, t]);

  useEffect(() => {
    setPage(1);
  }, [batchFilter, searchTerm]);

  const batchOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.adminJobs.allBatches') },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, t],
  );

  const filteredJobs = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return jobs;
    return jobs.filter((job) => {
      const haystack = [job.title, job.company_name, job.location, job.batch_name]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      return haystack.some((value) => value.includes(query));
    });
  }, [jobs, searchTerm]);

  const paginatedJobs = useMemo(() => paginateItems(filteredJobs, page), [filteredJobs, page]);

  const openApplicants = async (job: JobRow) => {
    setSelectedJob(job);
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
  };

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout role={role} title="" subtitle="" onLogout={logout}>
      <div className="space-y-6">
        <ManagementPageHeader
          title={t('dashboard.adminJobs.title')}
          subtitle={t('dashboard.adminJobs.subtitle')}
          tags={[
            {
              label: t('dashboard.adminJobs.statsJobs', { count: filteredJobs.length }),
              icon: Briefcase,
              tone: 'primary',
            },
            {
              label: t('dashboard.adminJobs.statsBatches', { count: batches.length }),
              icon: Users,
              tone: 'blue',
            },
          ]}
        />

        <div className="rounded-xl border border-line-default bg-white p-6 shadow-card">
          <div className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
            <ManagementSearchInput
              label={t('dashboard.adminJobs.searchLabel')}
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('dashboard.adminJobs.searchPlaceholder')}
            />
            <Select
              label={t('dashboard.adminJobs.filterBatch')}
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              options={batchOptions}
            />
          </div>
        </div>

        {loadingJobs ? (
          <LoadingState />
        ) : filteredJobs.length === 0 ? (
          <EmptyState message={t('dashboard.adminJobs.empty')} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-line-default bg-white shadow-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className="px-4 py-3">{t('dashboard.adminJobs.columns.title')}</th>
                    <th className="px-4 py-3">{t('dashboard.adminJobs.columns.company')}</th>
                    <th className="px-4 py-3">{t('dashboard.adminJobs.columns.location')}</th>
                    <th className="px-4 py-3">{t('dashboard.adminJobs.columns.batch')}</th>
                    <th className="px-4 py-3">{t('dashboard.adminJobs.columns.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedJobs.map((job, index) => (
                    <tr
                      key={`${String(job.batch_id)}-${String(job.id)}`}
                      className={`border-b border-line-default ${alternatingRowClass(index)}`}
                    >
                      <td className="px-4 py-4">
                        <p className="font-medium text-ink-primary">{String(job.title)}</p>
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        {job.company_name ? (
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 className="h-4 w-4" />
                            {String(job.company_name)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        {job.location ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {String(job.location)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-4 py-4 font-medium text-brand-blue">{String(job.batch_name)}</td>
                      <td className="px-4 py-4">
                        <Button variant="secondary" className="text-xs" onClick={() => openApplicants(job)}>
                          <Eye className="mr-1.5 h-3.5 w-3.5" />
                          {t('dashboard.adminJobs.viewApplicants')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ManagementPagination
              page={page}
              total={filteredJobs.length}
              onPageChange={setPage}
              summary={t('dashboard.adminJobs.pagination', {
                from: filteredJobs.length === 0 ? 0 : (page - 1) * 10 + 1,
                to: Math.min(page * 10, filteredJobs.length),
                total: filteredJobs.length,
              })}
              prevLabel={t('dashboard.adminJobs.prev')}
              nextLabel={t('dashboard.adminJobs.next')}
            />
          </div>
        )}
      </div>

      <AppliedStudentsModal
        job={selectedJob}
        applicants={applicants}
        loading={loadingApplicants}
        onClose={closeApplicants}
      />
    </DashboardLayout>
  );
}
