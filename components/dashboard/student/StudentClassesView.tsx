'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Calendar, ExternalLink, Video } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type ClassRow = Record<string, unknown>;

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

export function StudentClassesView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [loading, setLoading] = useState(false);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const loadClasses = () => {
    setLoading(true);
    api
      .getStudentClasses(statusFilter)
      .then(setClasses)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const joinClass = async (classId: string) => {
    setJoiningId(classId);
    try {
      const result = await api.joinClass(classId);
      toast.success(t('dashboard.studentClasses.attendanceMarked'));
      window.open(String(result.online_link), '_blank', 'noopener,noreferrer');
      loadClasses();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(msg);
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.studentClasses.title')}
      subtitle={t('dashboard.studentClasses.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 max-w-xs">
        <Select
          label={t('dashboard.studentClasses.filterStatus')}
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
        <EmptyState message={t('dashboard.studentClasses.empty')} />
      ) : (
        <div className="space-y-4">
          {classes.map((row) => (
            <div key={String(row.id)} className="card-surface p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Video className="h-5 w-5 text-brand-blue" />
                    <h2 className="text-lg font-semibold text-ink-primary">{String(row.title)}</h2>
                    <Badge tone="sky">{t(`dashboard.classes.types.${String(row.class_type)}`)}</Badge>
                    {row.student_attended ? (
                      <Badge tone="success">{t('dashboard.studentClasses.attended')}</Badge>
                    ) : null}
                  </div>
                  {row.description ? (
                    <p className="mt-2 text-sm text-ink-muted">{String(row.description)}</p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-ink-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      {formatDate(row.scheduled_at)}
                    </span>
                    <span>{String(row.duration_minutes)} min</span>
                    {row.trainer_name ? (
                      <span>{t('dashboard.classes.columns.trainer')}: {String(row.trainer_name)}</span>
                    ) : null}
                    <span className="font-medium text-brand-blue">{String(row.batch_name)}</span>
                  </div>
                </div>

                {statusFilter === 'upcoming' ? (
                  <Button
                    variant="accent"
                    disabled={!row.link_active || joiningId === String(row.id)}
                    onClick={() => joinClass(String(row.id))}
                  >
                    {joiningId === String(row.id)
                      ? t('dashboard.studentClasses.joining')
                      : row.link_active
                        ? t('dashboard.studentClasses.joinClass')
                        : t('dashboard.studentClasses.linkInactive')}
                  </Button>
                ) : row.recording_link ? (
                  <a
                    href={String(row.recording_link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium link-brand"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t('dashboard.studentClasses.watchRecording')}
                  </a>
                ) : (
                  <span className="text-sm text-ink-muted">{t('dashboard.studentClasses.noRecording')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
