'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { accessBadgeTone } from '@/lib/status';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type StudentRow = Record<string, unknown>;

function formatDate(value: unknown): string {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function formatAmount(paise: unknown, currency: unknown): string {
  if (paise == null || paise === '') return '—';
  const amount = Number(paise) / 100;
  const code = String(currency || 'INR');
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: code }).format(amount);
}

export function AdminStudentsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [batches, setBatches] = useState<StudentRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [ready, setReady] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);

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
    setLoadingStudents(true);
    api
      .getCoordinatorStudents(batchFilter || undefined)
      .then(setStudents)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoadingStudents(false));
  }, [ready, batchFilter, t]);

  const batchOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.adminStudents.allBatches') },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, t],
  );

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="admin"
      title={t('dashboard.adminStudents.title')}
      subtitle={t('dashboard.adminStudents.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 max-w-xs">
        <Select
          label={t('dashboard.adminStudents.filterBatch')}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          options={batchOptions}
        />
      </div>

      {loadingStudents ? (
        <LoadingState />
      ) : students.length === 0 ? (
        <EmptyState message={t('dashboard.adminStudents.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.name')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.email')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.batch')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.joined')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.payment')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.paymentDate')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.applied')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.selected')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.offers')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.lastLogin')}</th>
                <th className="px-4 py-3">{t('dashboard.adminStudents.columns.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-default">
              {students.map((row) => {
                const offers = (row.offer_letters as Record<string, unknown>[]) || [];
                return (
                  <tr key={`${String(row.batch_id)}-${String(row.student_id)}`} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-primary">{String(row.name)}</p>
                      {row.college ? (
                        <p className="text-xs text-ink-muted">{String(row.college)}</p>
                      ) : null}
                      {row.branch ? (
                        <p className="text-xs text-ink-muted">{String(row.branch)}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      <p>{String(row.email)}</p>
                      {row.phone ? <p className="text-xs">{String(row.phone)}</p> : null}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-blue">{String(row.batch_name)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDate(row.joined_at)}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {formatAmount(row.payment_amount_paise, row.payment_currency)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                      {formatDate(row.payment_date)}
                    </td>
                    <td className="px-4 py-3 text-center">{String(row.jobs_applied ?? 0)}</td>
                    <td className="px-4 py-3 text-center">{String(row.jobs_selected ?? 0)}</td>
                    <td className="px-4 py-3">
                      {offers.length === 0 ? (
                        <span className="text-ink-muted">—</span>
                      ) : (
                        <div className="space-y-1">
                          {offers.map((offer, index) => (
                            <a
                              key={`${String(offer.url)}-${index}`}
                              href={String(offer.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-brand block text-xs"
                            >
                              {String(offer.job_title || offer.company_name || t('dashboard.adminStudents.offerLetter'))}
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                      {formatDate(row.last_login)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={accessBadgeTone(String(row.access_status))}>
                        {String(row.access_status)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
