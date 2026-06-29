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

const CLASS_TYPES = ['soft_skill', 'technical', 'aptitude'] as const;
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

export function ClassesManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard(role);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const [editForm, setEditForm] = useState({ ...EMPTY_FORM });
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

  const createClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createClass({
        ...form,
        duration_minutes: Number(form.duration_minutes),
        scheduled_at: new Date(form.scheduled_at).toISOString(),
      });
      toast.success(t('dashboard.classes.createSuccess'));
      setForm({ ...EMPTY_FORM });
      loadClasses();
    } catch {
      toast.error(t('common.errors.generic'));
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
        <form onSubmit={createClass} className="grid gap-4 md:grid-cols-2">
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
          <Input
            label={t('dashboard.classes.columns.scheduled')}
            type="datetime-local"
            value={form.scheduled_at}
            onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
            required
          />
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
            {t('dashboard.classes.create')}
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
      ) : classes.length === 0 ? (
        <EmptyState message={t('dashboard.classes.empty')} />
      ) : (
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
              {classes.map((row) => (
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
                        <Button variant="secondary" className="text-xs" onClick={() => openAttendance(row)}>
                          <Users className="mr-1 h-3.5 w-3.5" />
                          {String(row.attendance_count ?? 0)}
                        </Button>
                      </td>
                      <td className="px-4 py-3">
                        <RecordingInput
                          value={String(row.recording_link || '')}
                          onSave={(link) => saveRecording(row, link)}
                          placeholder={t('dashboard.classes.recordingPlaceholder')}
                          saveLabel={t('common.actions.save')}
                        />
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" className="px-2 py-1" onClick={() => startEdit(row)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-brand-red"
                        onClick={() => removeClass(String(row.id))}
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
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
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
