'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { IndianRupee, Receipt } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { StatCard } from '@/components/ui/StatCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type PaymentRow = Record<string, unknown>;
type Batch = Record<string, unknown>;

function formatDate(value: unknown): string {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function formatAmount(paise: unknown, currency: unknown): string {
  if (paise == null) return '—';
  const amount = Number(paise) / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: String(currency || 'INR'),
  }).format(amount);
}

export function SuperAdminRevenueView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('super_admin');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [report, setReport] = useState<Record<string, unknown> | null>(null);
  const [batchFilter, setBatchFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .listAllBatches()
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [t]);

  const loadReport = () => {
    setLoading(true);
    api
      .getRevenueReport({
        batch_id: batchFilter || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      })
      .then(setReport)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (ready) loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, batchFilter, dateFrom, dateTo]);

  const batchOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.superAdminRevenue.allBatches') },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, t],
  );

  const payments = (report?.payments as PaymentRow[]) || [];

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="super_admin"
      title={t('dashboard.superAdminRevenue.title')}
      subtitle={t('dashboard.superAdminRevenue.subtitle')}
      onLogout={logout}
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t('dashboard.superAdminRevenue.totalRevenue')}
          value={formatAmount(report?.total_revenue_paise, report?.currency)}
          accent="green"
          icon={IndianRupee}
        />
        <StatCard
          label={t('dashboard.superAdminRevenue.paymentCount')}
          value={String(report?.payment_count ?? 0)}
          accent="sky"
          icon={Receipt}
        />
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Select
          label={t('dashboard.superAdminRevenue.filterBatch')}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          options={batchOptions}
        />
        <Input
          label={t('dashboard.superAdminRevenue.dateFrom')}
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <Input
          label={t('dashboard.superAdminRevenue.dateTo')}
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : payments.length === 0 ? (
        <EmptyState message={t('dashboard.superAdminRevenue.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">{t('dashboard.superAdminRevenue.columns.date')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminRevenue.columns.student')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminRevenue.columns.batch')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminRevenue.columns.amount')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminRevenue.columns.provider')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminRevenue.columns.transaction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-default">
              {payments.map((row) => (
                <tr key={String(row.payment_id)}>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDate(row.paid_at)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{String(row.student_name)}</p>
                    <p className="text-xs text-ink-muted">{String(row.student_email)}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-blue">
                    {String(row.batch_name || '—')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">
                    {formatAmount(row.amount_paise, row.currency)}
                  </td>
                  <td className="px-4 py-3 uppercase text-ink-muted">{String(row.payment_provider)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                    {String(row.gateway_payment_id || '—')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
