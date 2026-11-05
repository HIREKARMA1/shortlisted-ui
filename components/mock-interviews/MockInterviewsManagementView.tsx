'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Eye, Loader2, Plus, RefreshCw, Trash2 } from 'lucide-react';
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
  batch_ids: [] as string[], title: '', topic: '', difficulty: 'intermediate', duration_minutes: '30', number_of_questions: '5', focus_areas: '',
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

  useEffect(() => { if (ready) load(); }, [ready, load]);
  useEffect(() => {
    const hasGenerating = rows.some((row) => row.status === 'generating');
    if (!hasGenerating) return;
    const timer = window.setInterval(load, 3000);
    return () => window.clearInterval(timer);
  }, [rows, load]);

  const create = async () => {
    if (!form.batch_ids.length || !form.title.trim() || !form.topic.trim()) {
      toast.error('Batch, title, and topic are required.');
      return;
    }
    setCreating(true);
    try {
      const { batch_ids, ...interviewDetails } = form;
      const results = await Promise.allSettled(batch_ids.map((batch_id) => api.createMockInterview({
        ...interviewDetails,
        batch_id,
        duration_minutes: Number(form.duration_minutes),
        number_of_questions: Number(form.number_of_questions),
        focus_areas: form.focus_areas.split(',').map((value) => value.trim()).filter(Boolean),
      })));
      const createdCount = results.filter((result) => result.status === 'fulfilled').length;
      if (createdCount === 0) throw new Error('No interviews were created.');
      setForm(EMPTY_FORM);
      toast.success(results.every((result) => result.status === 'fulfilled')
        ? `Question generation started for ${createdCount} batch${createdCount === 1 ? '' : 'es'}.`
        : `Created for ${createdCount} of ${batch_ids.length} batches. Some batches could not be created.`);
      load();
    } catch {
      toast.error('Could not create the mock interview.');
    } finally {
      setCreating(false);
    }
  };

  const openDetail = async (id: string) => {
    setOpeningId(id);
    try { setSelected(await api.getAdminMockInterview(id) as MockInterviewDetail); }
    catch { toast.error('Could not load interview questions.'); }
    finally { setOpeningId(null); }
  };

  const updateQuestion = async (question: MockInterviewQuestion, changes: Partial<MockInterviewQuestion>) => {
    if (!selected) return;
    try {
      await api.updateMockInterviewQuestion(selected.id, question.id, changes);
      setSelected(await api.getAdminMockInterview(selected.id) as MockInterviewDetail);
      load();
    } catch { toast.error('Could not save the question.'); }
  };

  if (!ready || loading) return <LoadingState />;
  const batchIds = batches.map((batch) => String(batch.id));
  const allBatchesSelected = batchIds.length > 0 && batchIds.every((id) => form.batch_ids.includes(id));
  const toggleBatch = (batchId: string) => setForm((current) => ({
    ...current,
    batch_ids: current.batch_ids.includes(batchId)
      ? current.batch_ids.filter((id) => id !== batchId)
      : [...current.batch_ids, batchId],
  }));

  return (
    <DashboardLayout role={role} title="Mock interviews" subtitle="Create, review, and publish interview practice for each batch." onLogout={logout}>
      <section className="mb-8 border-b border-line-default pb-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <fieldset className="space-y-2 rounded-lg border border-line-default bg-white p-3 xl:row-span-2">
            <legend className="px-1 text-sm font-medium text-ink-secondary">Batches</legend>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-primary">
              <input type="checkbox" checked={allBatchesSelected} disabled={!batchIds.length} onChange={() => setForm((current) => ({ ...current, batch_ids: allBatchesSelected ? [] : batchIds }))} />
              All batches ({batchIds.length})
            </label>
            <div className="max-h-36 space-y-2 overflow-y-auto border-t border-line-default pt-2">
              {batches.map((batch) => {
                const id = String(batch.id);
                const isFreeTrial = String(batch.batch_type || '') === 'free_trial' || Boolean(batch.is_unlimited);
                return <label key={id} className="flex items-center gap-2 text-sm text-ink-secondary">
                  <input type="checkbox" checked={form.batch_ids.includes(id)} onChange={() => toggleBatch(id)} />
                  <span>{String(batch.name)}{isFreeTrial ? ' (Free Trial)' : ''}</span>
                </label>;
              })}
              {!batches.length && <p className="text-xs text-ink-muted">No batches available.</p>}
            </div>
            <p className="text-xs text-ink-muted">{form.batch_ids.length} selected</p>
          </fieldset>
          <Input label="Interview title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Frontend practice" />
          <Input label="Topic" value={form.topic} onChange={(event) => setForm({ ...form, topic: event.target.value })} placeholder="React" />
          <Select label="Difficulty" value={form.difficulty} onChange={(event) => setForm({ ...form, difficulty: event.target.value })} options={[{ value: 'beginner', label: 'Beginner' }, { value: 'intermediate', label: 'Intermediate' }, { value: 'advanced', label: 'Advanced' }]} />
          <Input label="Duration (minutes)" type="number" min="5" max="180" value={form.duration_minutes} onChange={(event) => setForm({ ...form, duration_minutes: event.target.value })} />
          <Input label="Questions" type="number" min="1" max="20" value={form.number_of_questions} onChange={(event) => setForm({ ...form, number_of_questions: event.target.value })} />
          <Input label="Focus areas" value={form.focus_areas} onChange={(event) => setForm({ ...form, focus_areas: event.target.value })} placeholder="hooks, performance" />
          <div className="flex items-end"><Button variant="accent" className="w-full" disabled={creating} onClick={create}>{creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}<span className="ml-2">Create</span></Button></div>
        </div>
      </section>

      {rows.length === 0 ? <EmptyState message="No mock interviews have been created yet." /> : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <article key={row.id} className="card-surface p-5">
              <div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold text-ink-primary">{row.title}</h2><p className="mt-1 text-sm text-ink-muted">{row.topic} · {row.difficulty}</p></div><span className="badge-pill">{row.status}</span></div>
              <div className="mt-4 flex gap-4 text-sm text-ink-muted"><span>{row.batch_name}</span><span>{row.question_count}/{row.number_of_questions} questions</span><span>{row.duration_minutes} min</span></div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="secondary" className="px-3 py-2 text-xs" disabled={openingId === row.id} onClick={() => openDetail(row.id)}><Eye className="h-4 w-4" /><span className="ml-1">Review</span></Button>
                {row.status !== 'published' && <Button variant="secondary" className="px-3 py-2 text-xs" onClick={async () => { await api.generateMockInterviewQuestions(row.id); load(); }}><RefreshCw className="h-4 w-4" /><span className="ml-1">Generate</span></Button>}
                <Button variant="danger" className="px-3 py-2 text-xs" onClick={async () => { if (window.confirm(`Delete ${row.title}?`)) { await api.deleteMockInterview(row.id); load(); } }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.title || 'Interview review'} maxWidth="4xl">
        {selected && <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-ink-muted">{selected.questions.length} questions · {selected.status}</p><div className="flex gap-2">{selected.status === 'published' ? <Button variant="secondary" onClick={async () => { await api.unpublishMockInterview(selected.id); setSelected(await api.getAdminMockInterview(selected.id) as MockInterviewDetail); load(); }}>Unpublish</Button> : <Button variant="accent" disabled={selected.questions.length === 0 || selected.status === 'generating'} onClick={async () => { await api.publishMockInterview(selected.id); setSelected(await api.getAdminMockInterview(selected.id) as MockInterviewDetail); load(); }}>Publish</Button>}</div></div>
          {selected.questions.map((question) => <QuestionEditor key={question.id} question={question} onSave={updateQuestion} onDelete={async () => { await api.deleteMockInterviewQuestion(selected.id, question.id); setSelected(await api.getAdminMockInterview(selected.id) as MockInterviewDetail); load(); }} onRegenerate={async () => { await api.regenerateMockInterviewQuestion(selected.id, question.id); toast.success('Question regeneration started.'); load(); }} />)}
        </div>}
      </Modal>
    </DashboardLayout>
  );
}

function QuestionEditor({ question, onSave, onDelete, onRegenerate }: { question: MockInterviewQuestion; onSave: (question: MockInterviewQuestion, changes: Partial<MockInterviewQuestion>) => Promise<void>; onDelete: () => Promise<void>; onRegenerate: () => Promise<void> }) {
  const [text, setText] = useState(question.text);
  return <div className="border-t border-line-default pt-4"><div className="flex gap-3"><span className="mt-2 text-sm font-semibold text-brand-blue">{question.order_index}</span><textarea className="min-h-20 flex-1 rounded-md border border-line-default p-3 text-sm" value={text} onChange={(event) => setText(event.target.value)} /><div className="flex flex-col gap-2"><Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => onSave(question, { text })}>Save</Button><Button variant="secondary" className="px-3 py-2 text-xs" onClick={onRegenerate}><RefreshCw className="h-4 w-4" /></Button><Button variant="danger" className="px-3 py-2 text-xs" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button></div></div><p className="mt-2 text-xs text-ink-muted">Key points: {question.key_points.join(' · ')}</p></div>;
}
