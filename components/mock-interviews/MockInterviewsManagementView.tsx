'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Layers, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import type { MockInterview, MockInterviewDetail, MockInterviewQuestion } from './types';

const EMPTY_FORM = {
  title: '',
  topic: '',
  difficulty: 'intermediate',
  duration_minutes: '30',
  number_of_questions: '5',
  focus_areas: '',
};

export function MockInterviewsManagementView({ role }: { role: DashboardRole }) {
  const { ready } = useRoleGuard(role);
  const { logout } = useAuth();
  const [rows, setRows] = useState<MockInterview[]>([]);
  const [batches, setBatches] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selected, setSelected] = useState<MockInterviewDetail | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [assignTarget, setAssignTarget] = useState<MockInterview | null>(null);
  const [assignBatchIds, setAssignBatchIds] = useState<string[]>([]);
  const [assigning, setAssigning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [interviews, batchRows] = await Promise.all([
        api.getAdminMockInterviews(),
        role === 'super_admin'
          ? api.listAllBatches({ includeFreeTrial: true })
          : api.listMyBatches({ includeFreeTrial: true }),
      ]);
      setRows(interviews as MockInterview[]);
      setBatches(batchRows as Record<string, unknown>[]);
    } catch {
      toast.error('Unable to load mock interviews.');
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (ready) load();
  }, [ready, load]);

  useEffect(() => {
    const hasGenerating = rows.some((row) => row.status === 'generating');
    if (!hasGenerating) return;
    const timer = window.setInterval(load, 3000);
    return () => window.clearInterval(timer);
  }, [rows, load]);

  const create = async () => {
    if (!form.title.trim() || !form.topic.trim()) {
      toast.error('Title and topic are required.');
      return;
    }
    setCreating(true);
    try {
      await api.createMockInterview({
        title: form.title.trim(),
        topic: form.topic.trim(),
        difficulty: form.difficulty,
        duration_minutes: Number(form.duration_minutes),
        number_of_questions: Number(form.number_of_questions),
        focus_areas: form.focus_areas.split(',').map((value) => value.trim()).filter(Boolean),
      });
      setForm(EMPTY_FORM);
      toast.success('Mock interview created. Question generation started.');
      load();
    } catch {
      toast.error('Could not create the mock interview.');
    } finally {
      setCreating(false);
    }
  };

  const openDetail = async (id: string) => {
    setOpeningId(id);
    try {
      setSelected((await api.getAdminMockInterview(id)) as MockInterviewDetail);
    } catch {
      toast.error('Could not load interview questions.');
    } finally {
      setOpeningId(null);
    }
  };

  const openAssign = (row: MockInterview) => {
    setAssignTarget(row);
    setAssignBatchIds(row.batch_ids?.length ? [...row.batch_ids] : row.batch_id ? [row.batch_id] : []);
  };

  const saveAssign = async () => {
    if (!assignTarget) return;
    setAssigning(true);
    try {
      await api.assignMockInterviewBatches(assignTarget.id, assignBatchIds);
      toast.success(
        assignBatchIds.length
          ? `Assigned to ${assignBatchIds.length} batch${assignBatchIds.length === 1 ? '' : 'es'}.`
          : 'Removed all batch assignments.',
      );
      setAssignTarget(null);
      load();
    } catch {
      toast.error('Could not update batch assignments.');
    } finally {
      setAssigning(false);
    }
  };

  const updateQuestion = async (question: MockInterviewQuestion, changes: Partial<MockInterviewQuestion>) => {
    if (!selected) return;
    try {
      await api.updateMockInterviewQuestion(selected.id, question.id, changes);
      setSelected((await api.getAdminMockInterview(selected.id)) as MockInterviewDetail);
      load();
    } catch {
      toast.error('Could not save the question.');
    }
  };

  if (!ready || loading) return <LoadingState />;

  const allBatchIds = batches.map((batch) => String(batch.id));
  const allAssignSelected =
    allBatchIds.length > 0 && allBatchIds.every((id) => assignBatchIds.includes(id));
  const toggleAssignBatch = (batchId: string) =>
    setAssignBatchIds((current) =>
      current.includes(batchId) ? current.filter((id) => id !== batchId) : [...current, batchId],
    );

  return (
    <DashboardLayout
      role={role}
      title="Mock interviews"
      subtitle="Create once, review questions, then assign the same interview to batches."
      onLogout={logout}
    >
      <section className="mb-8 border-b border-line-default pb-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Input
            label="Interview title"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Frontend practice"
          />
          <Input
            label="Topic"
            value={form.topic}
            onChange={(event) => setForm({ ...form, topic: event.target.value })}
            placeholder="React"
          />
          <Select
            label="Difficulty"
            value={form.difficulty}
            onChange={(event) => setForm({ ...form, difficulty: event.target.value })}
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />
          <Input
            label="Duration (minutes)"
            type="number"
            min="5"
            max="180"
            value={form.duration_minutes}
            onChange={(event) => setForm({ ...form, duration_minutes: event.target.value })}
          />
          <Input
            label="Questions"
            type="number"
            min="1"
            max="20"
            value={form.number_of_questions}
            onChange={(event) => setForm({ ...form, number_of_questions: event.target.value })}
          />
          <Input
            label="Focus areas"
            value={form.focus_areas}
            onChange={(event) => setForm({ ...form, focus_areas: event.target.value })}
            placeholder="hooks, performance"
          />
          <div className="flex items-end md:col-span-2 xl:col-span-3">
            <Button variant="accent" className="w-full sm:w-auto" disabled={creating} onClick={create}>
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">Create interview</span>
            </Button>
          </div>
        </div>
      </section>

      {rows.length === 0 ? (
        <EmptyState message="No mock interviews have been created yet." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => {
            const names = row.batch_names?.length
              ? row.batch_names
              : row.batch_name
                ? [row.batch_name]
                : [];
            return (
              <article key={row.id} className="card-surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-ink-primary">{row.title}</h2>
                    <p className="mt-1 text-sm text-ink-muted">
                      {row.topic} · {row.difficulty}
                    </p>
                  </div>
                  <span className="badge-pill">{row.status}</span>
                </div>
                <div className="mt-4 space-y-1 text-sm text-ink-muted">
                  <p>
                    {names.length
                      ? names.length <= 2
                        ? names.join(', ')
                        : `${names.length} batches`
                      : 'Not assigned to any batch'}
                  </p>
                  <p>
                    {row.question_count}/{row.number_of_questions} questions · {row.duration_minutes} min
                  </p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    className="px-3 py-2 text-xs"
                    disabled={openingId === row.id}
                    onClick={() => openDetail(row.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="ml-1">View questions</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="px-3 py-2 text-xs"
                    onClick={() => openAssign(row)}
                  >
                    <Layers className="h-4 w-4" />
                    <span className="ml-1">Assign to batches</span>
                  </Button>
                  {row.status !== 'published' && (
                    <Button
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={async () => {
                        await api.generateMockInterviewQuestions(row.id);
                        load();
                      }}
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="ml-1">Generate</span>
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    className="px-3 py-2 text-xs"
                    onClick={async () => {
                      if (window.confirm(`Delete ${row.title}?`)) {
                        await api.deleteMockInterview(row.id);
                        load();
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-1">Delete</span>
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title || 'Interview review'}
        maxWidth="4xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                {selected.questions.length} questions · {selected.status}
              </p>
              <div className="flex gap-2">
                {selected.status === 'published' ? (
                  <Button
                    variant="secondary"
                    onClick={async () => {
                      await api.unpublishMockInterview(selected.id);
                      setSelected((await api.getAdminMockInterview(selected.id)) as MockInterviewDetail);
                      load();
                    }}
                  >
                    Unpublish
                  </Button>
                ) : (
                  <Button
                    variant="accent"
                    disabled={selected.questions.length === 0 || selected.status === 'generating'}
                    onClick={async () => {
                      await api.publishMockInterview(selected.id);
                      setSelected((await api.getAdminMockInterview(selected.id)) as MockInterviewDetail);
                      load();
                    }}
                  >
                    Publish
                  </Button>
                )}
              </div>
            </div>
            {selected.questions.map((question) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onSave={updateQuestion}
                onDelete={async () => {
                  await api.deleteMockInterviewQuestion(selected.id, question.id);
                  setSelected((await api.getAdminMockInterview(selected.id)) as MockInterviewDetail);
                  load();
                }}
                onRegenerate={async () => {
                  await api.regenerateMockInterviewQuestion(selected.id, question.id);
                  toast.success('Question regeneration started.');
                  load();
                }}
              />
            ))}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={Boolean(assignTarget)}
        onClose={() => setAssignTarget(null)}
        title={assignTarget ? `Assign “${assignTarget.title}”` : 'Assign to batches'}
        maxWidth="lg"
      >
        {assignTarget && (
          <div className="space-y-4">
            <p className="text-sm text-ink-secondary">
              Choose batches that should see this interview. Questions stay the same — nothing is regenerated.
            </p>
            <fieldset className="space-y-2 rounded-lg border border-line-default bg-white p-3">
              <legend className="px-1 text-sm font-medium text-ink-secondary">Batches</legend>
              <label className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
                <input
                  type="checkbox"
                  checked={allAssignSelected}
                  disabled={!allBatchIds.length}
                  onChange={() => setAssignBatchIds(allAssignSelected ? [] : allBatchIds)}
                />
                All batches ({allBatchIds.length})
              </label>
              <div className="max-h-56 space-y-2 overflow-y-auto border-t border-line-default pt-2">
                {batches.map((batch) => {
                  const id = String(batch.id);
                  const isFreeTrial =
                    String(batch.batch_type || '') === 'free_trial' || Boolean(batch.is_unlimited);
                  return (
                    <label key={id} className="flex items-center gap-2 text-sm text-ink-secondary">
                      <input
                        type="checkbox"
                        checked={assignBatchIds.includes(id)}
                        onChange={() => toggleAssignBatch(id)}
                      />
                      <span>
                        {String(batch.name)}
                        {isFreeTrial ? ' (Free Trial)' : ''}
                      </span>
                    </label>
                  );
                })}
                {!batches.length && <p className="text-xs text-ink-muted">No batches available.</p>}
              </div>
              <p className="text-xs text-ink-muted">{assignBatchIds.length} selected</p>
            </fieldset>
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setAssignTarget(null)}>
                Cancel
              </Button>
              <Button variant="accent" disabled={assigning} onClick={saveAssign}>
                {assigning ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                <span className={assigning ? 'ml-2' : ''}>Save assignments</span>
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

function QuestionEditor({
  question,
  onSave,
  onDelete,
  onRegenerate,
}: {
  question: MockInterviewQuestion;
  onSave: (question: MockInterviewQuestion, changes: Partial<MockInterviewQuestion>) => Promise<void>;
  onDelete: () => Promise<void>;
  onRegenerate: () => Promise<void>;
}) {
  const [text, setText] = useState(question.text);
  return (
    <div className="border-t border-line-default pt-4">
      <div className="flex gap-3">
        <span className="mt-2 text-sm font-semibold text-brand-blue">{question.order_index}</span>
        <textarea
          className="min-h-20 flex-1 rounded-md border border-line-default p-3 text-sm"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <div className="flex flex-col gap-2">
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onSave(question, { text })}>
            Save
          </Button>
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={onRegenerate}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="danger" className="px-3 py-2 text-xs" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-muted">Key points: {question.key_points.join(' · ')}</p>
    </div>
  );
}
