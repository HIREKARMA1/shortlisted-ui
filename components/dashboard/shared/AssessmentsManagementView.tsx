'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ClipboardCheck, RefreshCw, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { SectionHeader } from '@/components/ui/SectionHeader';

type BatchRow = Record<string, unknown>;
type AssessmentRow = Record<string, unknown>;

const ROUND_TYPES = [
  { value: 'aptitude', label: 'Aptitude' },
  { value: 'soft_skills', label: 'Soft skills' },
  { value: 'technical_mcq', label: 'Technical MCQ' },
  { value: 'coding', label: 'Coding' },
];

const EMPTY_FORM = {
  batch_id: '',
  assessment_name: '',
  instructions: '',
  start_time: '',
  end_time: '',
  total_duration_minutes: '60',
  passing_percentage: '60',
  round_type: 'aptitude',
  round_name: 'Aptitude Round',
  round_duration: '30',
  num_questions: '35',
};

function formatDate(value: unknown): string {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function toIsoDatetime(localValue: string): string {
  return new Date(localValue).toISOString();
}

export function AssessmentsManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard(role);
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [batchFilter, setBatchFilter] = useState('');
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  useEffect(() => {
    const loadBatches = role === 'super_admin' ? api.listAllBatches() : api.listMyBatches();
    loadBatches
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [role, t]);

  const loadAssessments = useCallback(() => {
    setLoading(true);
    api
      .getAdminAssessments(batchFilter || undefined)
      .then(setAssessments)
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
  }, [batchFilter, t]);

  useEffect(() => {
    if (!ready) return;
    loadAssessments();
  }, [ready, loadAssessments]);

  const batchOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.assessments.allBatches') },
      ...batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    ],
    [batches, t],
  );

  const createFormBatchOptions = useMemo(
    () => batches.map((b) => ({ value: String(b.id), label: String(b.name) })),
    [batches],
  );

  const createAssessment = async () => {
    if (!form.batch_id || !form.assessment_name || !form.start_time || !form.end_time) {
      toast.error(t('dashboard.assessments.fillRequired'));
      return;
    }
    setCreating(true);
    try {
      await api.createAssessment({
        batch_id: form.batch_id,
        assessment_name: form.assessment_name.trim(),
        instructions: form.instructions.trim() || undefined,
        start_time: toIsoDatetime(form.start_time),
        end_time: toIsoDatetime(form.end_time),
        total_duration_minutes: Number(form.total_duration_minutes) || 60,
        passing_percentage: Number(form.passing_percentage) || 60,
        rounds: [
          {
            round_number: 1,
            round_type: form.round_type,
            round_name: form.round_name.trim() || 'Round 1',
            duration_minutes: Number(form.round_duration) || 30,
            config: {
              num_questions: Number(form.num_questions) || 35,
              difficulty: 'medium',
            },
            is_mandatory: true,
          },
        ],
      });
      toast.success(t('dashboard.assessments.createSuccess'));
      setForm({ ...EMPTY_FORM });
      loadAssessments();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setCreating(false);
    }
  };

  const syncAssessment = async (id: string) => {
    setSyncingId(id);
    try {
      await api.syncAssessmentToSolviq(id);
      toast.success(t('dashboard.assessments.syncSuccess'));
      loadAssessments();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('dashboard.assessments.syncFailed');
      toast.error(String(msg));
    } finally {
      setSyncingId(null);
    }
  };

  const deleteAssessment = async (id: string) => {
    if (!window.confirm(t('dashboard.assessments.deleteConfirm'))) return;
    setDeletingId(id);
    try {
      await api.deleteAssessment(id);
      toast.success(t('dashboard.assessments.deleteSuccess'));
      loadAssessments();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setDeletingId(null);
    }
  };

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role={role}
      title={t('dashboard.assessments.title')}
      subtitle={t('dashboard.assessments.subtitle')}
      onLogout={logout}
    >
      <div className="card-surface mb-8 p-6">
        <SectionHeader title={t('dashboard.assessments.createTitle')} className="mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Select
            label={t('dashboard.assessments.batch')}
            value={form.batch_id}
            onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
            options={[{ value: '', label: t('dashboard.assessments.selectBatch') }, ...createFormBatchOptions]}
          />
          <Input
            label={t('dashboard.assessments.name')}
            value={form.assessment_name}
            onChange={(e) => setForm({ ...form, assessment_name: e.target.value })}
          />
          <Input
            label={t('dashboard.assessments.duration')}
            type="number"
            min={1}
            value={form.total_duration_minutes}
            onChange={(e) => setForm({ ...form, total_duration_minutes: e.target.value })}
          />
          <Input
            label={t('dashboard.assessments.startTime')}
            type="datetime-local"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
          />
          <Input
            label={t('dashboard.assessments.endTime')}
            type="datetime-local"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
          />
          <Input
            label={t('dashboard.assessments.passing')}
            type="number"
            min={0}
            max={100}
            value={form.passing_percentage}
            onChange={(e) => setForm({ ...form, passing_percentage: e.target.value })}
          />
          <Select
            label={t('dashboard.assessments.roundType')}
            value={form.round_type}
            onChange={(e) => setForm({ ...form, round_type: e.target.value })}
            options={ROUND_TYPES}
          />
          <Input
            label={t('dashboard.assessments.roundName')}
            value={form.round_name}
            onChange={(e) => setForm({ ...form, round_name: e.target.value })}
          />
          <Input
            label={t('dashboard.assessments.roundDuration')}
            type="number"
            min={1}
            value={form.round_duration}
            onChange={(e) => setForm({ ...form, round_duration: e.target.value })}
          />
          <Input
            label={t('dashboard.assessments.numQuestions')}
            type="number"
            min={1}
            value={form.num_questions}
            onChange={(e) => setForm({ ...form, num_questions: e.target.value })}
          />
          <div className="md:col-span-2 lg:col-span-3">
            <Input
              label={t('dashboard.assessments.instructions')}
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
            />
          </div>
        </div>
        <Button variant="accent" className="mt-4" onClick={createAssessment} disabled={creating}>
          {creating ? t('common.actions.loading') : t('dashboard.assessments.createCta')}
        </Button>
      </div>

      <div className="mb-6 max-w-xs">
        <Select
          label={t('dashboard.assessments.filterBatch')}
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          options={batchOptions}
        />
      </div>

      {loading ? (
        <LoadingState />
      ) : assessments.length === 0 ? (
        <EmptyState message={t('dashboard.assessments.empty')} />
      ) : (
        <div className="space-y-4">
          {assessments.map((row) => {
            const id = String(row.id);
            const synced = Boolean(row.is_published_to_solviq);
            return (
              <div key={id} className="card-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-brand-blue" />
                      <h3 className="font-semibold text-ink-primary">{String(row.assessment_name)}</h3>
                      <Badge tone={synced ? 'success' : 'warning'}>
                        {synced ? 'Solviq' : 'Pending sync'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">
                      {String(row.batch_name)} · {String(row.round_count)} round(s) ·{' '}
                      {String(row.attempt_count)} attempt(s)
                    </p>
                    <p className="mt-2 text-xs text-ink-muted">
                      {formatDate(row.start_time)} → {formatDate(row.end_time)}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {!synced ? (
                      <Button
                        variant="secondary"
                        className="text-xs"
                        disabled={syncingId === id}
                        onClick={() => syncAssessment(id)}
                      >
                        <RefreshCw className={`mr-1 h-3.5 w-3.5 ${syncingId === id ? 'animate-spin' : ''}`} />
                        {t('dashboard.assessments.sync')}
                      </Button>
                    ) : null}
                    <Button
                      variant="secondary"
                      className="text-xs text-brand-red"
                      disabled={deletingId === id || Number(row.attempt_count) > 0}
                      onClick={() => deleteAssessment(id)}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      {t('dashboard.assessments.delete')}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
