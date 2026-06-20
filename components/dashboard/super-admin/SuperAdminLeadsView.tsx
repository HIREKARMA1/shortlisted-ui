'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, IndianRupee, Phone, UserPlus, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { StatCard } from '@/components/ui/StatCard';

type LeadRow = Record<string, unknown>;

const PAGE_SIZE = 10;

function formatDate(value: unknown): string {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function profileSummary(row: LeadRow, gradLabel: (year: string) => string): string {
  const parts = [
    row.college ? String(row.college) : '',
    row.branch ? String(row.branch) : '',
    row.graduation_year ? gradLabel(String(row.graduation_year)) : '',
  ].filter(Boolean);
  return parts.join(' · ') || '—';
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function toDatetimeLocalValue(date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function exportLeadsCsv(leads: LeadRow[], gradLabel: (year: string) => string) {
  const headers = [
    'Signed up',
    'Name',
    'Email',
    'Phone',
    'College',
    'Branch',
    'Graduation year',
    'Skills',
    'Preferred roles',
    'Last login',
  ];
  const rows = leads.map((row) => [
    formatDate(row.signed_up_at),
    String(row.name ?? ''),
    String(row.email ?? ''),
    String(row.phone ?? ''),
    String(row.college ?? ''),
    String(row.branch ?? ''),
    row.graduation_year ? String(row.graduation_year) : '',
    String(row.skills ?? ''),
    String(row.preferred_roles ?? ''),
    formatDate(row.last_login),
  ]);
  const csv = [headers, ...rows].map((line) => line.map(escapeCsv).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `shortlisted-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function LeadsModal({
  lead,
  defaultAmount,
  onClose,
  onSaved,
}: {
  lead: LeadRow;
  defaultAmount: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(defaultAmount);
  const [paidAt, setPaidAt] = useState(toDatetimeLocalValue());
  const [utr, setUtr] = useState('');
  const [collectedBy, setCollectedBy] = useState('');
  const [note, setNote] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      toast.error(t('dashboard.superAdminLeads.invalidAmount'));
      return;
    }
    if (!paidAt) {
      toast.error(t('dashboard.superAdminLeads.invalidPaidAt'));
      return;
    }

    const form = new FormData();
    form.append('student_id', String(lead.student_id));
    form.append('amount_inr', String(amountNum));
    form.append('paid_at', new Date(paidAt).toISOString());
    if (utr.trim()) form.append('utr', utr.trim());
    if (collectedBy.trim()) form.append('collected_by', collectedBy.trim());
    if (note.trim()) form.append('note', note.trim());
    if (receipt) form.append('receipt', receipt);

    setSaving(true);
    try {
      await api.recordOfflinePayment(form);
      toast.success(t('dashboard.superAdminLeads.paymentRecorded'));
      onSaved();
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-elevated">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-ink-primary">{t('dashboard.superAdminLeads.modalTitle')}</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {String(lead.name)} · {String(lead.email)}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-surface-muted">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label={t('dashboard.superAdminLeads.amountInr')}
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Input
            label={t('dashboard.superAdminLeads.paidAt')}
            type="datetime-local"
            value={paidAt}
            onChange={(e) => setPaidAt(e.target.value)}
          />
          <Input
            label={t('dashboard.superAdminLeads.utr')}
            value={utr}
            onChange={(e) => setUtr(e.target.value)}
            placeholder={t('dashboard.superAdminLeads.utrPlaceholder')}
          />
          <Input
            label={t('dashboard.superAdminLeads.collectedBy')}
            value={collectedBy}
            onChange={(e) => setCollectedBy(e.target.value)}
            placeholder={t('dashboard.superAdminLeads.collectedByPlaceholder')}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-primary">
              {t('dashboard.superAdminLeads.receipt')}
            </label>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-muted file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink-primary"
            />
          </div>
          <Input
            label={t('dashboard.superAdminLeads.note')}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            {t('common.actions.cancel')}
          </Button>
          <Button variant="accent" onClick={submit} disabled={saving}>
            {saving ? t('dashboard.superAdminLeads.recording') : t('dashboard.superAdminLeads.markPaidOffline')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SuperAdminLeadsView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('super_admin');
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [defaultAmount, setDefaultAmount] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [activeLead, setActiveLead] = useState<LeadRow | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const loadLeads = useCallback(() => {
    setLoading(true);
    api
      .listLeads({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page,
        page_size: PAGE_SIZE,
      })
      .then((data) => {
        setLeads(data.leads);
        setTotal(data.total);
      })
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
  }, [dateFrom, dateTo, page, t]);

  useEffect(() => {
    api
      .getPaymentConfig()
      .then((config) => setDefaultAmount(String(config.amount_inr ?? '')))
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready) return;
    loadLeads();
  }, [ready, loadLeads]);

  useEffect(() => {
    setPage(1);
  }, [dateFrom, dateTo]);

  const gradLabel = useCallback(
    (year: string) => t('dashboard.superAdminLeads.gradYear', { year }),
    [t],
  );

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, totalPages]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await api.listLeads({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        page: 1,
        page_size: Math.max(total, 1),
      });
      if (data.leads.length === 0) {
        toast.error(t('dashboard.superAdminLeads.exportEmpty'));
        return;
      }
      exportLeadsCsv(data.leads, gradLabel);
      toast.success(t('dashboard.superAdminLeads.exportSuccess'));
    } catch {
      toast.error(t('common.errors.network'));
    } finally {
      setExporting(false);
    }
  };

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="super_admin"
      title={t('dashboard.superAdminLeads.title')}
      subtitle={t('dashboard.superAdminLeads.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t('dashboard.superAdminLeads.totalLeads')}
          value={String(total)}
          accent="orange"
          icon={UserPlus}
        />
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
          <Input
            label={t('dashboard.superAdminLeads.signupFrom')}
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label={t('dashboard.superAdminLeads.signupTo')}
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <Button variant="secondary" onClick={handleExport} disabled={exporting || total === 0}>
          <Download className="mr-2 h-4 w-4" />
          {exporting ? t('dashboard.superAdminLeads.exporting') : t('dashboard.superAdminLeads.exportCsv')}
        </Button>
      </div>

      {loading ? (
        <LoadingState />
      ) : leads.length === 0 ? (
        <EmptyState message={t('dashboard.superAdminLeads.empty')} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3">{t('dashboard.superAdminLeads.columns.signedUp')}</th>
                  <th className="px-4 py-3">{t('dashboard.superAdminLeads.columns.student')}</th>
                  <th className="px-4 py-3">{t('dashboard.superAdminLeads.columns.contact')}</th>
                  <th className="px-4 py-3">{t('dashboard.superAdminLeads.columns.profile')}</th>
                  <th className="px-4 py-3">{t('dashboard.superAdminLeads.columns.lastLogin')}</th>
                  <th className="px-4 py-3 text-right">{t('dashboard.superAdminLeads.columns.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-default">
                {leads.map((row) => (
                  <tr key={String(row.student_id)}>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                      {formatDate(row.signed_up_at)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-primary">{String(row.name)}</p>
                      <p className="text-xs text-ink-muted">{String(row.email)}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {row.phone ? (
                        <a href={`tel:${String(row.phone)}`} className="inline-flex items-center gap-1 link-brand">
                          <Phone className="h-3.5 w-3.5" />
                          {String(row.phone)}
                        </a>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted max-w-[220px] truncate">
                      {profileSummary(row, gradLabel)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                      {formatDate(row.last_login)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="accent"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                        onClick={() => setActiveLead(row)}
                      >
                        <IndianRupee className="h-3.5 w-3.5" />
                        {t('dashboard.superAdminLeads.recordPayment')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink-muted">
              {t('dashboard.superAdminLeads.pagination', {
                from: (page - 1) * PAGE_SIZE + 1,
                to: Math.min(page * PAGE_SIZE, total),
                total,
              })}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {t('dashboard.superAdminLeads.prev')}
              </Button>
              {pageNumbers.map((n) => (
                <Button
                  key={n}
                  variant={n === page ? 'accent' : 'secondary'}
                  className="min-w-9 px-3 py-1.5 text-xs"
                  onClick={() => setPage(n)}
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-xs"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                {t('dashboard.superAdminLeads.next')}
              </Button>
            </div>
          </div>
        </>
      )}

      {activeLead && (
        <LeadsModal
          lead={activeLead}
          defaultAmount={defaultAmount}
          onClose={() => setActiveLead(null)}
          onSaved={loadLeads}
        />
      )}
    </DashboardLayout>
  );
}
