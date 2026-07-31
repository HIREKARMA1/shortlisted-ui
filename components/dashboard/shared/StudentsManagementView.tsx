'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { GraduationCap, Pencil, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import { accessBadgeTone } from '@/lib/status';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { exportCoordinatorStudentsToCSV, type CoordinatorStudentExport } from '@/utils/exportToExcel';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ManagementPageHeader } from '@/components/dashboard/shared/ManagementPageHeader';
import {
  EditPaymentModal,
  type EditablePayment,
} from '@/components/dashboard/shared/EditPaymentModal';
import { ExportCsvButton } from '@/components/dashboard/shared/management/ExportCsvButton';
import { ManagementSearchInput } from '@/components/dashboard/shared/management/ManagementSearchInput';
import {
  alternatingRowClass,
  ManagementPagination,
  paginateItems,
  StudentAvatar,
} from '@/components/dashboard/shared/management/ManagementPagination';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type StudentRow = Record<string, unknown>;

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function formatAmount(paise: unknown, currency: unknown): string {
  if (paise == null || paise === '') return '-';
  const amount = Number(paise) / 100;
  const code = String(currency || 'INR');
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: code }).format(amount);
}

function toEditablePayment(row: StudentRow): EditablePayment {
  return {
    student_id: String(row.student_id || ''),
    payment_id: row.payment_id ? String(row.payment_id) : null,
    student_name: String(row.name || ''),
    student_email: String(row.email || ''),
    amount_paise: row.payment_amount_paise != null ? Number(row.payment_amount_paise) : null,
    paid_at: row.payment_date ? String(row.payment_date) : null,
    utr: row.payment_utr ? String(row.payment_utr) : null,
    collected_by: row.payment_collected_by ? String(row.payment_collected_by) : null,
    note: row.payment_note ? String(row.payment_note) : null,
    receipt_url: row.payment_receipt_url ? String(row.payment_receipt_url) : null,
  };
}

function mapStudentRow(row: StudentRow): CoordinatorStudentExport {
  return {
    name: String(row.name || ''),
    email: String(row.email || ''),
    phone: row.phone ? String(row.phone) : undefined,
    college: row.college ? String(row.college) : undefined,
    branch: row.branch ? String(row.branch) : undefined,
    graduation_year: row.graduation_year != null ? Number(row.graduation_year) : undefined,
    batch_name: row.batch_name ? String(row.batch_name) : undefined,
    joined_at: row.joined_at ? String(row.joined_at) : undefined,
    payment_amount_paise: row.payment_amount_paise != null ? Number(row.payment_amount_paise) : null,
    payment_currency: row.payment_currency ? String(row.payment_currency) : undefined,
    payment_mode: row.payment_mode ? String(row.payment_mode) : undefined,
    payment_date: row.payment_date ? String(row.payment_date) : undefined,
    jobs_applied: Number(row.jobs_applied ?? 0),
    jobs_selected: Number(row.jobs_selected ?? 0),
    offer_letters: (row.offer_letters as CoordinatorStudentExport['offer_letters']) || [],
    last_login: row.last_login ? String(row.last_login) : undefined,
    access_status: row.access_status ? String(row.access_status) : undefined,
  };
}

export function StudentsManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard(role);
  const [batches, setBatches] = useState<StudentRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [accessFilter, setAccessFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [ready, setReady] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [updatingStudentId, setUpdatingStudentId] = useState<string | null>(null);
  const [reassigningStudentId, setReassigningStudentId] = useState<string | null>(null);
  const [editingPayment, setEditingPayment] = useState<EditablePayment | null>(null);

  const loadStudents = useCallback(() => {
    setLoadingStudents(true);
    api
      .getCoordinatorStudents(batchFilter || undefined)
      .then(setStudents)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoadingStudents(false));
  }, [batchFilter, t]);

  useEffect(() => {
    const loadBatches = role === 'super_admin' ? api.listAllBatches() : api.listMyBatches();
    loadBatches
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [role, t]);

  useEffect(() => {
    if (!ready) return;
    loadStudents();
  }, [ready, loadStudents]);

  useEffect(() => {
    setPage(1);
  }, [batchFilter, searchTerm, accessFilter]);

  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return students.filter((row) => {
      if (accessFilter === 'active' && String(row.access_status) !== 'active') return false;
      if (accessFilter === 'inactive' && String(row.access_status) === 'active') return false;
      if (!query) return true;
      const haystack = [row.name, row.email, row.phone, row.college, row.branch]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      return haystack.some((value) => value.includes(query));
    });
  }, [students, searchTerm, accessFilter]);

  const paginatedStudents = useMemo(
    () => paginateItems(filteredStudents, page),
    [filteredStudents, page],
  );

  const updateAccessStatus = async (studentId: string, access_status: 'active' | 'inactive') => {
    setUpdatingStudentId(studentId);
    try {
      await api.updateStudentAccessStatus(studentId, access_status);
      toast.success(t('dashboard.superAdminStudents.statusUpdated'));
      loadStudents();
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setUpdatingStudentId(null);
    }
  };

  const reassignBatch = async (studentId: string, batchId: string) => {
    if (!batchId || batchId === String(students.find((s) => s.student_id === studentId)?.batch_id)) {
      return;
    }
    setReassigningStudentId(studentId);
    try {
      await api.reassignStudentBatch(studentId, batchId);
      toast.success(t('dashboard.superAdminStudents.batchUpdated'));
      loadStudents();
      if (role === 'super_admin') {
        api.listAllBatches().then(setBatches).catch(() => undefined);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setReassigningStudentId(null);
    }
  };

  const handleExport = () => {
    if (filteredStudents.length === 0) {
      toast.error(t('dashboard.adminStudents.exportEmpty'));
      return;
    }
    setExporting(true);
    try {
      const label =
        batchFilter && batches.find((b) => String(b.id) === batchFilter)
          ? String(batches.find((b) => String(b.id) === batchFilter)?.name)
          : 'Students';
      exportCoordinatorStudentsToCSV(filteredStudents.map(mapStudentRow), label);
      toast.success(t('dashboard.adminStudents.exportSuccess', { count: filteredStudents.length }));
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setExporting(false);
    }
  };

  const allBatchOptions = useMemo(
    () =>
      batches.map((b) => ({
        value: String(b.id),
        label: `${String(b.name)} (${String(b.seats_filled)}/${String(b.max_seats)})`,
      })),
    [batches],
  );

  const batchOptions = useMemo(
    () => [
      {
        value: '',
        label:
          role === 'super_admin'
            ? t('dashboard.superAdminStudents.allBatches')
            : t('dashboard.adminStudents.allBatches'),
      },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, role, t],
  );

  const titleKey = role === 'super_admin' ? 'dashboard.superAdminStudents.title' : 'dashboard.adminStudents.title';
  const subtitleKey =
    role === 'super_admin' ? 'dashboard.superAdminStudents.subtitle' : 'dashboard.adminStudents.subtitle';
  const emptyKey =
    role === 'super_admin' ? 'dashboard.superAdminStudents.empty' : 'dashboard.adminStudents.empty';
  const filterKey =
    role === 'super_admin' ? 'dashboard.superAdminStudents.filterBatch' : 'dashboard.adminStudents.filterBatch';

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout role={role} title="" subtitle="" onLogout={logout}>
      <div className="space-y-6">
        <ManagementPageHeader
          title={t(titleKey)}
          subtitle={t(subtitleKey)}
          tags={[
            {
              label: t('dashboard.adminStudents.statsTotal', { count: filteredStudents.length }),
              icon: Users,
              tone: 'primary',
            },
            {
              label: t('dashboard.adminStudents.statsActive', {
                count: filteredStudents.filter((s) => String(s.access_status) === 'active').length,
              }),
              icon: TrendingUp,
              tone: 'orange',
            },
            {
              label: t('dashboard.adminStudents.hubTag'),
              icon: GraduationCap,
              tone: 'blue',
            },
          ]}
          actions={
            <ExportCsvButton
              label={exporting ? t('dashboard.adminStudents.exporting') : t('dashboard.adminStudents.exportCsv')}
              loading={exporting}
              disabled={filteredStudents.length === 0}
              onClick={handleExport}
            />
          }
        />

        <div className="rounded-xl border border-line-default bg-white p-6 shadow-card">
          <div className="grid gap-4 md:grid-cols-3">
            <ManagementSearchInput
              label={t('dashboard.adminStudents.searchLabel')}
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={t('dashboard.adminStudents.searchPlaceholder')}
            />
            <Select
              label={t(filterKey)}
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              options={batchOptions}
            />
            <Select
              label={t('dashboard.adminStudents.filterAccess')}
              value={accessFilter}
              onChange={(e) => setAccessFilter(e.target.value as 'all' | 'active' | 'inactive')}
              options={[
                { value: 'all', label: t('dashboard.adminStudents.allAccess') },
                { value: 'active', label: t('common.status.active') },
                { value: 'inactive', label: t('common.status.inactive') },
              ]}
            />
          </div>
        </div>

        {loadingStudents ? (
          <LoadingState />
        ) : filteredStudents.length === 0 ? (
          <EmptyState message={t(emptyKey)} />
        ) : (
          <div className="overflow-hidden rounded-xl border border-line-default bg-white shadow-lg">
            <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.name')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.email')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.batch')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.joined')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.payment')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.paymentMode')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.paymentDate')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.applied')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.selected')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.offers')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.lastLogin')}</th>
                  <th className="px-4 py-3">{t('dashboard.adminStudents.columns.status')}</th>
                  {role === 'super_admin' ? (
                    <th className="px-4 py-3 text-right">
                      {t('dashboard.adminStudents.columns.actions')}
                    </th>
                  ) : null}
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((row, index) => {
                  const offers = (row.offer_letters as Record<string, unknown>[]) || [];
                  return (
                    <tr
                      key={`${String(row.batch_id)}-${String(row.student_id)}`}
                      className={`border-b border-line-default align-top ${alternatingRowClass(index)}`}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <StudentAvatar name={String(row.name)} />
                          <div>
                            <p className="font-medium text-ink-primary">{String(row.name)}</p>
                            {row.college ? <p className="text-xs text-ink-muted">{String(row.college)}</p> : null}
                            {row.branch ? <p className="text-xs text-ink-muted">{String(row.branch)}</p> : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-ink-muted">
                        <p>{String(row.email)}</p>
                        {row.phone ? <p className="text-xs">{String(row.phone)}</p> : null}
                      </td>
                      <td className="px-4 py-3">
                        {role === 'super_admin' ? (
                          <Select
                            value={String(row.batch_id)}
                            onChange={(e) => reassignBatch(String(row.student_id), e.target.value)}
                            disabled={reassigningStudentId === String(row.student_id)}
                            options={allBatchOptions}
                            className="min-w-[160px] text-xs"
                          />
                        ) : (
                          <span className="font-medium text-brand-blue">{String(row.batch_name)}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDate(row.joined_at)}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatAmount(row.payment_amount_paise, row.payment_currency)}
                      </td>
                      <td className="px-4 py-3 capitalize text-ink-muted">
                        {row.payment_mode ? String(row.payment_mode) : '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDate(row.payment_date)}</td>
                      <td className="px-4 py-3 text-center">{String(row.jobs_applied ?? 0)}</td>
                      <td className="px-4 py-3 text-center">{String(row.jobs_selected ?? 0)}</td>
                      <td className="px-4 py-3">
                        {offers.length === 0 ? (
                          <span className="text-ink-muted">-</span>
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
                                {String(
                                  offer.job_title ||
                                    offer.company_name ||
                                    t('dashboard.adminStudents.offerLetter'),
                                )}
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-muted">{formatDate(row.last_login)}</td>
                      <td className="px-4 py-3">
                        {role === 'super_admin' ? (
                          <Select
                            value={String(row.access_status) === 'active' ? 'active' : 'inactive'}
                            onChange={(e) =>
                              updateAccessStatus(
                                String(row.student_id),
                                e.target.value as 'active' | 'inactive',
                              )
                            }
                            disabled={updatingStudentId === String(row.student_id)}
                            options={[
                              { value: 'active', label: t('common.status.active') },
                              { value: 'inactive', label: t('common.status.inactive') },
                            ]}
                            className="min-w-[120px] text-xs"
                          />
                        ) : (
                          <Badge tone={accessBadgeTone(String(row.access_status))}>
                            {String(row.access_status)}
                          </Badge>
                        )}
                      </td>
                      {role === 'super_admin' ? (
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="secondary"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs"
                            onClick={() => setEditingPayment(toEditablePayment(row))}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            {t('dashboard.superAdminStudents.editPayment')}
                          </Button>
                        </td>
                      ) : null}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
            <ManagementPagination
              page={page}
              total={filteredStudents.length}
              onPageChange={setPage}
              summary={t('dashboard.adminStudents.pagination', {
                from: filteredStudents.length === 0 ? 0 : (page - 1) * 10 + 1,
                to: Math.min(page * 10, filteredStudents.length),
                total: filteredStudents.length,
              })}
              prevLabel={t('dashboard.adminStudents.prev')}
              nextLabel={t('dashboard.adminStudents.next')}
            />
          </div>
        )}

        {editingPayment ? (
          <EditPaymentModal
            payment={editingPayment}
            onClose={() => setEditingPayment(null)}
            onSaved={loadStudents}
          />
        ) : null}
      </div>
    </DashboardLayout>
  );
}
