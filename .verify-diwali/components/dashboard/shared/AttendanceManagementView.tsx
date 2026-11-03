'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, X, Eye, Percent, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { SectionHeader } from '@/components/ui/SectionHeader';

type ClassRow = Record<string, unknown>;
type BatchRow = Record<string, unknown>;

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-elevated">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-surface-muted">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function AttendanceManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard(role);
  
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [summary, setSummary] = useState<{
    average_attendance_percentage: number;
    total_classes_done: number;
    total_attended: number;
    total_missed: number;
  } | null>(null);
  
  const [batchFilter, setBatchFilter] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [attendanceClass, setAttendanceClass] = useState<ClassRow | null>(null);
  const [attendances, setAttendances] = useState<Record<string, unknown>[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    const loadBatches = role === 'super_admin' ? api.listAllBatches() : api.listMyBatches();
    loadBatches
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [role, t]);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getAdminClasses({ batch_id: batchFilter || undefined, filter: 'all' }),
      api.getAttendanceSummary(batchFilter || undefined)
    ])
      .then(([classesData, summaryData]) => {
        setClasses(classesData);
        setSummary(summaryData);
      })
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (ready) {
      loadData();
    }
  }, [ready, batchFilter, t]);

  const batchOptions = [
    { value: '', label: t('dashboard.classes.allBatches') },
    ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
  ];

  const [presentStudentIds, setPresentStudentIds] = useState<Set<string>>(new Set());
  const [savingAttendance, setSavingAttendance] = useState(false);

  const viewAttendance = async (row: ClassRow) => {
    setAttendanceClass(row);
    setLoadingAttendance(true);
    try {
      const detail = await api.getAdminClassDetail(String(row.id));
      const allAttendances = (detail.attendances as Record<string, unknown>[]) || [];
      setAttendances(allAttendances);
      const presentIds = new Set(
        allAttendances.filter((a) => a.attended_at).map((a) => String(a.student_id))
      );
      setPresentStudentIds(presentIds);
    } catch {
      toast.error(t('common.errors.generic'));
      setAttendances([]);
      setPresentStudentIds(new Set());
    } finally {
      setLoadingAttendance(false);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setPresentStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(studentId)) {
        next.delete(studentId);
      } else {
        next.add(studentId);
      }
      return next;
    });
  };

  const saveAttendance = async () => {
    if (!attendanceClass) return;
    setSavingAttendance(true);
    try {
      await api.updateClassAttendance(String(attendanceClass.id), Array.from(presentStudentIds));
      toast.success(t('dashboard.classes.updateSuccess'));
      setAttendanceClass(null);
      loadData();
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setSavingAttendance(false);
    }
  };

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role={role}
      title="Attendance"
      subtitle="View attendance summary and details for classes"
      onLogout={logout}
    >
      <div className="mb-6 flex max-w-sm flex-col gap-2">
        <Select
          label={t('dashboard.classes.filterBatch')}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          options={batchOptions}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <>
          {summary && (
            <div className="mb-8 grid gap-4 md:grid-cols-4">
              <div className="card-surface flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <Percent className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-muted">Avg. Attendance</p>
                  <p className="text-2xl font-bold">{summary.average_attendance_percentage}%</p>
                </div>
              </div>
              <div className="card-surface flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-muted">Classes Done</p>
                  <p className="text-2xl font-bold">{summary.total_classes_done}</p>
                </div>
              </div>
              <div className="card-surface flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-muted">Total Attended</p>
                  <p className="text-2xl font-bold">{summary.total_attended}</p>
                </div>
              </div>
              <div className="card-surface flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <XCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-muted">Total Missed</p>
                  <p className="text-2xl font-bold">{summary.total_missed}</p>
                </div>
              </div>
            </div>
          )}

          <SectionHeader title="All Classes" className="mb-4" />
          {classes.length === 0 ? (
            <EmptyState message={t('dashboard.classes.empty')} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className="px-4 py-3">{t('dashboard.classes.columns.title')}</th>
                    <th className="px-4 py-3">{t('dashboard.classes.columns.batch')}</th>
                    <th className="px-4 py-3">{t('dashboard.classes.columns.type')}</th>
                    <th className="px-4 py-3">{t('dashboard.classes.columns.scheduled')}</th>
                    <th className="px-4 py-3">{t('dashboard.classes.columns.attendance')}</th>
                    <th className="px-4 py-3">{t('dashboard.classes.columns.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-default">
                  {classes.map((row) => (
                    <tr key={String(row.id)} className="align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium">{String(row.title)}</p>
                      </td>
                      <td className="px-4 py-3 font-medium text-brand-blue">{String(row.batch_name)}</td>
                      <td className="px-4 py-3">{t(`dashboard.classes.types.${String(row.class_type)}`)}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                        {formatDate(row.scheduled_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-brand-blue/10 px-2 py-0.5 text-xs font-medium text-brand-blue">
                          <Users className="mr-1 h-3 w-3" />
                          {String(row.attendance_count ?? 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="secondary" className="text-xs" onClick={() => viewAttendance(row)}>
                          <Eye className="mr-1 h-3.5 w-3.5" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {attendanceClass && (
        <Modal title={`Attendance: ${attendanceClass.title}`} onClose={() => setAttendanceClass(null)}>
          {loadingAttendance ? (
            <LoadingState />
          ) : attendances.length === 0 ? (
            <EmptyState message={t('dashboard.classes.noAttendance')} />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="accent"
                  className="text-sm"
                  onClick={saveAttendance}
                  disabled={savingAttendance}
                >
                  {savingAttendance ? 'Saving...' : t('common.actions.save')}
                </Button>
              </div>
              <div className="space-y-2">
                {attendances.map((a) => (
                  <div key={String(a.student_id)} className="rounded-lg border border-line-default px-3 py-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{String(a.name)}</p>
                      <p className="text-sm text-ink-muted">{String(a.email)}</p>
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2 h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                        checked={presentStudentIds.has(String(a.student_id))}
                        onChange={() => toggleAttendance(String(a.student_id))}
                      />
                      <span className="text-sm font-medium">Present</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}
    </DashboardLayout>
  );
}
