'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  Eye,
  FileText,
  XCircle,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import type { StudentApplication } from '@/lib/types/studentJobs';
import { formatJobDate, getCompanyName } from '@/lib/jobUtils';
import { applicationBadgeTone } from '@/lib/status';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

type SortField = 'job_title' | 'company_name' | 'status' | 'applied_at' | 'interview_date';
type SortOrder = 'asc' | 'desc';

type StudentApplicationTableProps = {
  applications: StudentApplication[];
  loading?: boolean;
};

function statusIcon(status: string) {
  const s = status.toLowerCase();
  if (s.includes('select')) return <CheckCircle className="h-4 w-4 text-brand-green" />;
  if (s.includes('reject')) return <XCircle className="h-4 w-4 text-brand-red" />;
  if (s.includes('shortlist')) return <CheckCircle className="h-4 w-4 text-brand-sky" />;
  return <Clock className="h-4 w-4 text-brand-blue" />;
}

export function StudentApplicationTable({ applications, loading = false }: StudentApplicationTableProps) {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortField>('applied_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);

  const statusLabel = (status: string) => {
    const key = `dashboard.applications.statuses.${status.toLowerCase()}`;
    const label = t(key);
    return label === key ? status.charAt(0).toUpperCase() + status.slice(1) : label;
  };

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const sorted = useMemo(() => {
    const rows = [...applications];
    rows.sort((a, b) => {
      const pick = (app: StudentApplication) => {
        if (sortBy === 'company_name') return getCompanyName(app).toLowerCase();
        if (sortBy === 'job_title') return (app.job_title || '').toLowerCase();
        if (sortBy === 'status') return app.status.toLowerCase();
        if (sortBy === 'applied_at') return app.applied_at || '';
        if (sortBy === 'interview_date') return app.interview_date || '';
        return '';
      };
      const av = pick(a);
      const bv = pick(b);
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return rows;
  }, [applications, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageRows = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-muted transition hover:text-brand-blue"
    >
      {children}
      {sortBy === field &&
        (sortOrder === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />)}
    </button>
  );

  if (loading) {
    return (
      <div className="card-surface p-6">
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-surface-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line-default bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-line-default bg-surface-muted">
            <tr>
              <th className="px-5 py-3 text-left">
                <SortButton field="job_title">{t('dashboard.applications.columns.jobTitle')}</SortButton>
              </th>
              <th className="px-5 py-3 text-left">
                <SortButton field="company_name">{t('dashboard.applications.columns.company')}</SortButton>
              </th>
              <th className="px-5 py-3 text-left">
                <SortButton field="status">{t('dashboard.applications.columns.status')}</SortButton>
              </th>
              <th className="px-5 py-3 text-left">
                <SortButton field="applied_at">{t('dashboard.applications.columns.appliedAt')}</SortButton>
              </th>
              <th className="px-5 py-3 text-left">
                <SortButton field="interview_date">{t('dashboard.applications.columns.interview')}</SortButton>
              </th>
              <th className="px-5 py-3 text-center">{t('dashboard.applications.columns.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-default">
            {pageRows.map((app, index) => {
              const company = getCompanyName(app);
              return (
                <motion.tr
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="transition hover:bg-primary-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                        <FileText className="h-5 w-5 text-brand-blue" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-ink-primary">{app.job_title || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-ink-secondary">
                      <Building2 className="h-4 w-4 shrink-0 text-ink-muted" />
                      <span>{company}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {statusIcon(app.status)}
                      <Badge tone={applicationBadgeTone(app.status)}>{statusLabel(app.status)}</Badge>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-ink-secondary">
                      <Calendar className="h-4 w-4 text-ink-muted" />
                      {formatJobDate(app.applied_at)}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-ink-secondary">
                    {app.interview_date ? formatJobDate(app.interview_date) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {app.status.toLowerCase() === 'selected' && app.offer_letter_url ? (
                        <>
                          <Button
                            variant="secondary"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => window.open(app.offer_letter_url!, '_blank', 'noopener,noreferrer')}
                          >
                            <Eye className="mr-1 h-3.5 w-3.5" />
                            {t('dashboard.applications.viewOffer')}
                          </Button>
                          <a
                            href={app.offer_letter_url}
                            download
                            className={cn(
                              'inline-flex items-center rounded-md border border-line-default px-3 py-1.5 text-xs font-semibold text-brand-green transition hover:border-brand-green hover:bg-green-50'
                            )}
                          >
                            <Download className="mr-1 h-3.5 w-3.5" />
                            {t('dashboard.applications.downloadOffer')}
                          </a>
                        </>
                      ) : app.status.toLowerCase() === 'selected' ? (
                        <span className="text-xs text-ink-muted">{t('dashboard.applications.offerPending')}</span>
                      ) : app.status.toLowerCase() === 'rejected' ? (
                        <span className="text-xs text-brand-red">{t('dashboard.applications.rejected')}</span>
                      ) : (
                        <span className="text-xs text-ink-muted">{statusLabel(app.status)}</span>
                      )}
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line-default px-5 py-3">
          <p className="text-sm text-ink-muted">
            {t('dashboard.applications.pagination', {
              from: String((page - 1) * PAGE_SIZE + 1),
              to: String(Math.min(page * PAGE_SIZE, sorted.length)),
              total: String(sorted.length),
            })}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="px-3 py-1.5"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-ink-secondary">
              {t('dashboard.applications.page', { page: String(page), total: String(totalPages) })}
            </span>
            <Button
              variant="secondary"
              className="px-3 py-1.5"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
