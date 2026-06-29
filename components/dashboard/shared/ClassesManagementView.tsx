'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Pencil, Trash2, Users, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { SectionHeader } from '@/components/ui/SectionHeader';

type ClassRow = Record<string, unknown>;
type BatchRow = Record<string, unknown>;
type CreateMode = 'single' | 'monthly';

const CLASS_TYPES = ['soft_skill', 'technical', 'aptitude'] as const;
const DAY_VALUES = ['0', '1', '2', '3', '4', '5', '6'] as const;
const PAGE_SIZE = 10;

function currentMonthValue(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

const EMPTY_FORM = {
  batch_id: '',
  title: '',
  trainer_name: '',
  description: '',
  class_type: 'technical',
  scheduled_at: '',
  duration_minutes: '60',
  online_link: '',
  recording_link: '',
  day_of_week: '1',
  schedule_time: '10:00',
  schedule_month: currentMonthValue(),
};

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function downloadAttendanceCsv(
  classRow: ClassRow,
  attendances: Record<string, unknown>[],
  headers: { name: string; email: string; attendedAt: string },
) {
  const meta = [
    ['Class', String(classRow.title ?? '')],
    ['Trainer', String(classRow.trainer_name ?? '')],
    ['Batch', String(classRow.batch_name ?? '')],
    ['Scheduled at', classRow.scheduled_at ? formatDate(classRow.scheduled_at) : ''],
    [],
    [headers.name, headers.email, headers.attendedAt],
  ];
  const rows = attendances.map((a) => [
    escapeCsvField(String(a.name ?? '')),
    escapeCsvField(String(a.email ?? '')),
    escapeCsvField(a.attended_at ? formatDate(a.attended_at) : ''),
  ]);
  const csv = [...meta.map((row) => row.map(escapeCsvField).join(',')), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const slug = String(classRow.title ?? 'class')
    .replace(/[^\w-]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  const link = document.createElement('a');
  link.href = url;
  link.download = `attendance-${slug || 'export'}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function toLocalInputValue(iso: unknown): string {
  if (!iso) return '';
  const date = new Date(String(iso));
  if (Number.isNaN(date.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}

function pageNumbers(totalPages: number, current: number): number[] {
  const maxButtons = 5;
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const start = Math.max(1, Math.min(current - 2, totalPages - maxButtons + 1));
  return Array.from({ length: maxButtons }, (_, i) => start + i);
}

export function ClassesManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard(role);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [createMode, setCreateMode] = useState<CreateMode>('monthly');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM, schedule_month: currentMonthValue() });
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
  const [attendanceClass, setAttendanceClass] = useState<ClassRow | null>(null);
  const [attendances, setAttendances] = useState<Record<string, unknown>[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadBatches = role === 'super_admin' ? api.listAllBatches() : api.listMyBatches();
    loadBatches
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [role, t]);

  const loadClasses = useCallback(() => {
    setLoading(true);
    api
      .getAdminClasses({ batch_id: batchFilter || undefined, filter: statusFilter })
      .then(setClasses)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
  }, [batchFilter, statusFilter, t]);

  useEffect(() => {
    if (ready) loadClasses();
  }, [ready, loadClasses]);

  useEffect(() => {
    setPage(1);
  }, [batchFilter, statusFilter]);

  const batchOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.classes.allBatches') },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, t],
  );

  const typeOptions = CLASS_TYPES.map((type) => ({
    value: type,
    label: t(`dashboard.classes.types.${type}`),
  }));

  const dayOptions = DAY_VALUES.map((day) => ({
    value: day,
    label: t(`dashboard.classes.days.${day}`),
  }));

  const { nextSevenDays, laterUpcoming } = useMemo(() => {
    if (statusFilter !== 'upcoming') {
      return { nextSevenDays: [], laterUpcoming: [] };
    }
    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const next7: ClassRow[] = [];
    const later: ClassRow[] = [];
    for (const row of classes) {
      const date = new Date(String(row.scheduled_at));
      if (Number.isNaN(date.getTime())) continue;
      if (date >= now && date <= weekEnd) {
        next7.push(row);
      } else if (date > weekEnd) {
        later.push(row);
      }
    }
    return { nextSevenDays: next7, laterUpcoming: later };
  }, [classes, statusFilter]);

  const paginatedRows = useMemo(() => {
    const source = statusFilter === 'upcoming' ? laterUpcoming : classes;
    return paginate(source, page);
  }, [classes, laterUpcoming, page, statusFilter]);

  const paginatedTotal = statusFilter === 'upcoming' ? laterUpcoming.length : classes.length;
  const totalPages = Math.max(1, Math.ceil(paginatedTotal / PAGE_SIZE));

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (createMode === 'monthly') {
        const [year, month] = form.schedule_month.split('-').map(Number);
        const result = await api.createRecurringClasses({
          batch_id: form.batch_id,
          title: form.title,
          trainer_name: form.trainer_name,
          description: form.description || undefined,
          class_type: form.class_type,
          duration_minutes: Number(form.duration_minutes),
          online_link: form.online_link,
          day_of_week: Number(form.day_of_week),
          time: form.schedule_time,
          year,
          month,
        });
        toast.success(t('dashboard.classes.recurringSuccess', { count: result.created_count }));
      } else {
        await api.createClass({
          batch_id: form.batch_id,
          title: form.title,
          trainer_name: form.trainer_name,
          description: form.description || undefined,
          class_type: form.class_type,
          duration_minutes: Number(form.duration_minutes),
          online_link: form.online_link,
          scheduled_at: new Date(form.scheduled_at).toISOString(),
        });
        toast.success(t('dashboard.classes.createSuccess'));
      }
      setForm({ ...EMPTY_FORM, schedule_month: currentMonthValue() });
      loadClasses();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(typeof msg === 'string' ? msg : t('common.errors.generic'));
    }
  };

  const startEdit = (row: ClassRow) => {
    setEditing(row);
    setEditForm({
      batch_id: String(row.batch_id),
      title: String(row.title),
      trainer_name: String(row.trainer_name || ''),
      description: String(row.description || ''),
      class_type: String(row.class_type),
      scheduled_at: toLocalInputValue(row.scheduled_at),
      duration_minutes: String(row.duration_minutes),
      online_link: String(row.online_link),
      recording_link: String(row.recording_link || ''),
      day_of_week: '1',
      schedule_time: '10:00',
      schedule_month: currentMonthValue(),
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.updateClass(String(editing.id), {
        title: editForm.title,
        trainer_name: editForm.trainer_name,
        description: editForm.description || undefined,
        class_type: editForm.class_type,
        scheduled_at: new Date(editForm.scheduled_at).toISOString(),
        duration_minutes: Number(editForm.duration_minutes),
        online_link: editForm.online_link,
        recording_link: editForm.recording_link || undefined,
      });
      toast.success(t('dashboard.classes.updateSuccess'));
      setEditing(null);
      loadClasses();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const removeClass = async (classId: string) => {
    try {
      await api.deleteClass(classId);
      toast.success(t('dashboard.classes.deleteSuccess'));
      loadClasses();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const saveRecording = async (row: ClassRow, recordingLink: string) => {
    try {
      await api.updateClass(String(row.id), { recording_link: recordingLink });
      toast.success(t('dashboard.classes.recordingSaved'));
      loadClasses();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const openAttendance = async (row: ClassRow) => {
    setAttendanceClass(row);
    setLoadingAttendance(true);
    try {
      const detail = await api.getAdminClassDetail(String(row.id));
      setAttendances((detail.attendances as Record<string, unknown>[]) || []);
    } catch {
      toast.error(t('common.errors.generic'));
      setAttendances([]);
    } finally {
      setLoadingAttendance(false);
    }
  };

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role={role}
      title={t('dashboard.classes.title')}
      subtitle={t('dashboard.classes.subtitle')}
      onLogout={logout}
    >
      <div className="card-surface mb-8 p-6">
        <SectionHeader title={t('dashboard.classes.createTitle')} className="mb-4" />
        <div className="mb-4 flex flex-wrap gap-2">
          <Button
            type="button"
            variant={createMode === 'monthly' ? 'accent' : 'secondary'}
            className="text-sm"
            onClick={() => setCreateMode('monthly')}
          >
            {t('dashboard.classes.createModeMonthly')}
          </Button>
          <Button
            type="button"
            variant={createMode === 'single' ? 'accent' : 'secondary'}
            className="text-sm"
            onClick={() => setCreateMode('single')}
          >
            {t('dashboard.classes.createModeSingle')}
          </Button>
        </div>
        {createMode === 'monthly' ? (
          <p className="mb-4 text-sm text-ink-muted">{t('dashboard.classes.createModeMonthlyHint')}</p>
        ) : null}
        <form onSubmit={submitCreate} className="grid gap-4 md:grid-cols-2">
          <Select
            label={t('dashboard.classes.filterBatch')}
            value={form.batch_id}
            onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
            options={[{ value: '', label: t('dashboard.classes.pickBatch') }, ...batchOptions.slice(1)]}
            required
          />
          <Input
            label={t('dashboard.classes.columns.title')}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Input
            label={t('dashboard.classes.columns.trainer')}
            value={form.trainer_name}
            onChange={(e) => setForm({ ...form, trainer_name: e.target.value })}
            required
          />
          <Select
            label={t('dashboard.classes.columns.type')}
            value={form.class_type}
            onChange={(e) => setForm({ ...form, class_type: e.target.value })}
            options={typeOptions}
          />
          {createMode === 'single' ? (
            <Input
              label={t('dashboard.classes.columns.scheduled')}
              type="datetime-local"
              value={form.scheduled_at}
              onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
              required
            />
          ) : (
            <>
              <Select
                label={t('dashboard.classes.dayOfWeek')}
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                options={dayOptions}
                required
              />
              <Input
                label={t('dashboard.classes.scheduleTime')}
                type="time"
                value={form.schedule_time}
                onChange={(e) => setForm({ ...form, schedule_time: e.target.value })}
                required
              />
              <Input
                label={t('dashboard.classes.scheduleMonth')}
                type="month"
                value={form.schedule_month}
                onChange={(e) => setForm({ ...form, schedule_month: e.target.value })}
                required
              />
            </>
          )}
          <Input
            label={t('dashboard.classes.columns.duration')}
            type="number"
            min={15}
            max={480}
            value={form.duration_minutes}
            onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
            required
          />
          <Input
            label={t('dashboard.classes.columns.link')}
            value={form.online_link}
            onChange={(e) => setForm({ ...form, online_link: e.target.value })}
            required
          />
          <Input
            label={t('dashboard.classes.columns.description')}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="md:col-span-2"
          />
          <Button type="submit" variant="accent" className="md:col-span-2">
            {createMode === 'monthly'
              ? t('dashboard.classes.createMonthly')
              : t('dashboard.classes.create')}
          </Button>
        </form>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Select
          label={t('dashboard.classes.filterBatch')}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          options={batchOptions}
        />
        <Select
          label={t('dashboard.classes.filterStatus')}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'upcoming' | 'completed')}
          options={[
            { value: 'upcoming', label: t('dashboard.classes.upcoming') },
            { value: 'completed', label: t('dashboard.classes.completed') },
          ]}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : statusFilter === 'upcoming' ? (
        <div className="space-y-8">
          <section>
            <SectionHeader title={t('dashboard.classes.upcomingWeekTitle')} className="mb-4" />
            {nextSevenDays.length === 0 ? (
              <EmptyState message={t('dashboard.classes.upcomingWeekEmpty')} />
            ) : (
              <ClassesTable
                rows={nextSevenDays}
                statusFilter={statusFilter}
                t={t}
                onEdit={startEdit}
                onDelete={removeClass}
                onAttendance={openAttendance}
                onSaveRecording={saveRecording}
              />
            )}
          </section>

          <section>
            <SectionHeader title={t('dashboard.classes.allUpcomingTitle')} className="mb-4" />
            {laterUpcoming.length === 0 ? (
              <EmptyState message={t('dashboard.classes.empty')} />
            ) : (
              <>
                <ClassesTable
                  rows={paginatedRows}
                  statusFilter={statusFilter}
                  t={t}
                  onEdit={startEdit}
                  onDelete={removeClass}
                  onAttendance={openAttendance}
                  onSaveRecording={saveRecording}
                />
                <Pagination
                  page={page}
                  total={laterUpcoming.length}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  t={t}
                />
              </>
            )}
          </section>
        </div>
      ) : classes.length === 0 ? (
        <EmptyState message={t('dashboard.classes.empty')} />
      ) : (
        <>
          <ClassesTable
            rows={paginatedRows}
            statusFilter={statusFilter}
            t={t}
            onEdit={startEdit}
            onDelete={removeClass}
            onAttendance={openAttendance}
            onSaveRecording={saveRecording}
          />
          <Pagination
            page={page}
            total={paginatedTotal}
            totalPages={totalPages}
            onPageChange={setPage}
            t={t}
          />
        </>
      )}

      {editing && (
        <Modal title={t('dashboard.classes.editTitle')} onClose={() => setEditing(null)}>
          <div className="space-y-3">
            <Input label={t('dashboard.classes.columns.title')} value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            <Input label={t('dashboard.classes.columns.trainer')} value={editForm.trainer_name} onChange={(e) => setEditForm({ ...editForm, trainer_name: e.target.value })} />
            <Select label={t('dashboard.classes.columns.type')} value={editForm.class_type} onChange={(e) => setEditForm({ ...editForm, class_type: e.target.value })} options={typeOptions} />
            <Input label={t('dashboard.classes.columns.scheduled')} type="datetime-local" value={editForm.scheduled_at} onChange={(e) => setEditForm({ ...editForm, scheduled_at: e.target.value })} />
            <Input label={t('dashboard.classes.columns.duration')} type="number" value={editForm.duration_minutes} onChange={(e) => setEditForm({ ...editForm, duration_minutes: e.target.value })} />
            <Input label={t('dashboard.classes.columns.link')} value={editForm.online_link} onChange={(e) => setEditForm({ ...editForm, online_link: e.target.value })} />
            {statusFilter === 'completed' && (
              <Input label={t('dashboard.classes.columns.recording')} value={editForm.recording_link} onChange={(e) => setEditForm({ ...editForm, recording_link: e.target.value })} />
            )}
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setEditing(null)}>{t('common.actions.cancel')}</Button>
            <Button variant="accent" onClick={saveEdit}>{t('common.actions.save')}</Button>
          </div>
        </Modal>
      )}

      {attendanceClass && (
        <Modal title={t('dashboard.classes.attendanceTitle', { title: String(attendanceClass.title) })} onClose={() => setAttendanceClass(null)}>
          {loadingAttendance ? (
            <LoadingState />
          ) : attendances.length === 0 ? (
            <EmptyState message={t('dashboard.classes.noAttendance')} />
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  className="text-sm"
                  onClick={() =>
                    downloadAttendanceCsv(attendanceClass, attendances, {
                      name: t('dashboard.classes.exportColumns.name'),
                      email: t('dashboard.classes.exportColumns.email'),
                      attendedAt: t('dashboard.classes.exportColumns.attendedAt'),
                    })
                  }
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t('dashboard.classes.exportAttendance')}
                </Button>
              </div>
              <div className="space-y-2">
                {attendances.map((a) => (
                  <div key={String(a.student_id)} className="rounded-lg border border-line-default px-3 py-2">
                    <p className="font-medium">{String(a.name)}</p>
                    <p className="text-sm text-ink-muted">{String(a.email)}</p>
                    <p className="text-xs text-ink-muted">{formatDate(a.attended_at)}</p>
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

type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

function ClassesTable({
  rows,
  statusFilter,
  t,
  onEdit,
  onDelete,
  onAttendance,
  onSaveRecording,
}: {
  rows: ClassRow[];
  statusFilter: 'upcoming' | 'completed';
  t: TranslateFn;
  onEdit: (row: ClassRow) => void;
  onDelete: (classId: string) => void;
  onAttendance: (row: ClassRow) => void;
  onSaveRecording: (row: ClassRow, link: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <tr>
            <th className="px-4 py-3">{t('dashboard.classes.columns.title')}</th>
            <th className="px-4 py-3">{t('dashboard.classes.columns.trainer')}</th>
            <th className="px-4 py-3">{t('dashboard.classes.columns.batch')}</th>
            <th className="px-4 py-3">{t('dashboard.classes.columns.type')}</th>
            <th className="px-4 py-3">{t('dashboard.classes.columns.scheduled')}</th>
            {statusFilter === 'upcoming' ? (
              <th className="px-4 py-3">{t('dashboard.classes.columns.link')}</th>
            ) : (
              <>
                <th className="px-4 py-3">{t('dashboard.classes.columns.attendance')}</th>
                <th className="px-4 py-3">{t('dashboard.classes.columns.recording')}</th>
              </>
            )}
            <th className="px-4 py-3">{t('dashboard.classes.columns.actions')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line-default">
          {rows.map((row) => (
            <tr key={String(row.id)} className="align-top">
              <td className="px-4 py-3">
                <p className="font-medium">{String(row.title)}</p>
                {row.description ? (
                  <p className="mt-1 text-xs text-ink-muted">{String(row.description)}</p>
                ) : null}
              </td>
              <td className="px-4 py-3">{row.trainer_name ? String(row.trainer_name) : '-'}</td>
              <td className="px-4 py-3 font-medium text-brand-blue">{String(row.batch_name)}</td>
              <td className="px-4 py-3">{t(`dashboard.classes.types.${String(row.class_type)}`)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                {formatDate(row.scheduled_at)}
                <p className="text-xs">{String(row.duration_minutes)} min</p>
              </td>
              {statusFilter === 'upcoming' ? (
                <td className="px-4 py-3">
                  <a href={String(row.online_link)} target="_blank" rel="noopener noreferrer" className="link-brand text-xs">
                    {t('dashboard.classes.openLink')}
                  </a>
                </td>
              ) : (
                <>
                  <td className="px-4 py-3">
                    <Button variant="secondary" className="text-xs" onClick={() => onAttendance(row)}>
                      <Users className="mr-1 h-3.5 w-3.5" />
                      {String(row.attendance_count ?? 0)}
                    </Button>
                  </td>
                  <td className="px-4 py-3">
                    <RecordingInput
                      value={String(row.recording_link || '')}
                      onSave={(link) => onSaveRecording(row, link)}
                      placeholder={t('dashboard.classes.recordingPlaceholder')}
                      saveLabel={t('common.actions.save')}
                    />
                  </td>
                </>
              )}
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button variant="ghost" className="px-2 py-1" onClick={() => onEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="px-2 py-1 text-brand-red"
                    onClick={() => onDelete(String(row.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({
  page,
  total,
  totalPages,
  onPageChange,
  t,
}: {
  page: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  t: TranslateFn;
}) {
  if (total <= PAGE_SIZE) return null;
  const numbers = pageNumbers(totalPages, page);
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-ink-muted">
        {t('dashboard.classes.pagination', {
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
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          {t('dashboard.classes.prev')}
        </Button>
        {numbers.map((n) => (
          <Button
            key={n}
            variant={n === page ? 'accent' : 'secondary'}
            className="min-w-9 px-3 py-1.5 text-xs"
            onClick={() => onPageChange(n)}
          >
            {n}
          </Button>
        ))}
        <Button
          variant="secondary"
          className="px-3 py-1.5 text-xs"
          disabled={page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          {t('dashboard.classes.next')}
        </Button>
      </div>
    </div>
  );
}

function RecordingInput({
  value,
  onSave,
  placeholder,
  saveLabel,
}: {
  value: string;
  onSave: (value: string) => void;
  placeholder: string;
  saveLabel: string;
}) {
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);
  return (
    <div className="flex min-w-[200px] gap-2">
      <input
        className="w-full rounded-lg border border-line-default px-2 py-1.5 text-xs"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
      <Button variant="secondary" className="shrink-0 px-2 py-1 text-xs" onClick={() => onSave(local)}>
        {saveLabel}
      </Button>
    </div>
  );
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
