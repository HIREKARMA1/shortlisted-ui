'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { assessmentBasePath } from '@/lib/assessmentDashboard';
import { api } from '@/lib/api';

type ManagedDetail = {
  id: string;
  assessment_name: string;
  description?: string | null;
  instructions?: string | null;
  external_id?: string;
  disha_assessment_id?: string;
  source?: string;
  total_duration_minutes?: number;
  total_questions?: number;
  total_students?: number;
  attempts_started?: number;
  attempts_completed?: number;
  attempts_evaluated?: number;
  attempts_pending_evaluation?: number;
  results_published?: boolean;
  results_published_at?: string | null;
  visibility?: string;
  is_visible?: boolean;
  is_removed?: boolean;
  status?: string;
  rounds?: Array<{
    round_number?: number;
    round_name?: string;
    round_type?: string;
    duration_minutes?: number;
  }>;
};

type ResultsPayload = {
  results_published?: boolean;
  summary?: {
    attempts_evaluated?: number;
    attempts_pending_evaluation?: number;
    attempts_completed?: number;
  };
  attempts?: Array<Record<string, unknown>>;
};

export function AssessmentManagementDetailPage({ role }: { role: DashboardRole }) {
  const params = useParams();
  const assessmentId = params.id as string;
  const basePath = assessmentBasePath(role);

  const [detail, setDetail] = useState<ManagedDetail | null>(null);
  const [results, setResults] = useState<ResultsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);
  const [confirm, setConfirm] = useState<'hide' | 'unhide' | 'delete' | 'publish' | 'unpublish' | null>(
    null
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [managed, resultPayload] = await Promise.all([
        api.getAssessmentManagementDetail(assessmentId),
        api.getAssessmentManagementResults(assessmentId).catch(() => null),
      ]);
      setDetail(managed as ManagedDetail);
      setResults(resultPayload as ResultsPayload | null);
    } catch (err: unknown) {
      const detailMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(typeof detailMsg === 'string' ? detailMsg : 'Failed to load assessment');
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  useEffect(() => {
    if (assessmentId) load();
  }, [assessmentId, load]);

  const runAction = async () => {
    if (!confirm || !detail) return;
    setActing(true);
    try {
      if (confirm === 'hide') {
        await api.setAssessmentVisibility(detail.id, false);
        toast.success('Assessment hidden from students');
      } else if (confirm === 'unhide') {
        await api.setAssessmentVisibility(detail.id, true);
        toast.success('Assessment is visible again');
      } else if (confirm === 'delete') {
        await api.softRemoveAssessment(detail.id);
        toast.success('Assessment removed from Shortlisted');
      } else if (confirm === 'publish') {
        await api.publishAssessmentResults(detail.id);
        toast.success('Results published');
      } else if (confirm === 'unpublish') {
        await api.unpublishAssessmentResults(detail.id);
        toast.success('Results unpublished');
      }
      setConfirm(null);
      await load();
    } catch (err: unknown) {
      const detailMsg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(typeof detailMsg === 'string' ? detailMsg : 'Action failed');
    } finally {
      setActing(false);
    }
  };

  const hidden = detail?.visibility === 'hidden' || detail?.is_visible === false;
  const removed = Boolean(detail?.is_removed) || detail?.status === 'DELETED';
  const pendingEval = Number(results?.summary?.attempts_pending_evaluation || detail?.attempts_pending_evaluation || 0);
  const evaluated = Number(results?.summary?.attempts_evaluated || detail?.attempts_evaluated || 0);

  const confirmCopy = (() => {
    switch (confirm) {
      case 'hide':
        return {
          title: 'Hide assessment?',
          message:
            'Students will no longer see this assessment and cannot start new attempts. Existing attempts are preserved.',
          confirmText: 'Hide',
          variant: 'warning' as const,
        };
      case 'unhide':
        return {
          title: 'Unhide assessment?',
          message: 'Eligible students will be able to see and start this assessment again.',
          confirmText: 'Unhide',
          variant: 'warning' as const,
        };
      case 'delete':
        return {
          title: 'Remove assessment from Shortlisted?',
          message:
            'Are you sure you want to remove this assessment from Shortlisted? Students will no longer be able to access it. Existing assessment attempts and results will be preserved according to the retention policy.',
          confirmText: 'Remove',
          variant: 'danger' as const,
        };
      case 'publish':
        return {
          title: 'Publish results?',
          message: `Are you sure you want to publish the results? Students will be able to view their results after publication. Evaluated: ${evaluated}. Pending evaluation: ${pendingEval}.`,
          confirmText: 'Publish results',
          variant: 'info' as const,
        };
      case 'unpublish':
        return {
          title: 'Unpublish results?',
          message: 'Students will no longer see scores. Attempt and evaluation data are preserved.',
          confirmText: 'Unpublish',
          variant: 'warning' as const,
        };
      default:
        return null;
    }
  })();

  return (
    <DashboardLayout role={role} title="Assessment Management">
      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-brand-blue" />
        </div>
      ) : error || !detail ? (
        <div className="space-y-4">
          <Link href={basePath}>
            <Button variant="secondary" className="normal-case tracking-normal">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            {error || 'Assessment not found'}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <Link href={basePath}>
                <Button variant="secondary" className="!px-3 !py-2">
                  <ArrowLeft size={18} />
                </Button>
              </Link>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {detail.source || 'assessment'} · {removed ? 'Deleted' : hidden ? 'Hidden' : 'Visible'}
                </p>
                <h1 className="text-2xl font-bold text-slate-900">{detail.assessment_name}</h1>
                <p className="mt-1 font-mono text-xs text-slate-500">
                  {detail.external_id || detail.disha_assessment_id || detail.id}
                </p>
              </div>
            </div>
            {!removed && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="normal-case tracking-normal"
                  onClick={() => setConfirm(hidden ? 'unhide' : 'hide')}
                >
                  {hidden ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                  {hidden ? 'Unhide' : 'Hide'}
                </Button>
                {detail.results_published ? (
                  <Button
                    variant="secondary"
                    className="normal-case tracking-normal"
                    onClick={() => setConfirm('unpublish')}
                  >
                    Unpublish results
                  </Button>
                ) : (
                  <Button
                    className="normal-case tracking-normal"
                    onClick={() => setConfirm('publish')}
                  >
                    Publish results
                  </Button>
                )}
                <Button
                  variant="danger"
                  className="normal-case tracking-normal"
                  onClick={() => setConfirm('delete')}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
            {[
              ['Students', detail.total_students ?? 0],
              ['Started', detail.attempts_started ?? 0],
              ['Completed', detail.attempts_completed ?? 0],
              ['Evaluated', evaluated],
              ['Pending eval', pendingEval],
              ['Duration', `${detail.total_duration_minutes ?? 0}m`],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Details</h2>
              <p className="mt-3 text-sm text-slate-700 whitespace-pre-wrap">
                {detail.description?.trim() || 'No description provided.'}
              </p>
              <h3 className="mt-5 text-sm font-semibold text-slate-900">Instructions</h3>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">
                {detail.instructions?.trim() || 'No instructions provided.'}
              </p>
              <p className="mt-4 text-xs text-slate-500">
                Results: {detail.results_published ? 'Published' : 'Not published'}
                {detail.results_published_at ? ` · ${new Date(detail.results_published_at).toLocaleString()}` : ''}
              </p>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Rounds</h2>
              {detail.rounds && detail.rounds.length > 0 ? (
                <ul className="mt-3 space-y-2">
                  {detail.rounds.map((round, idx) => (
                    <li
                      key={`${round.round_number}-${idx}`}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm"
                    >
                      <span className="font-medium text-slate-900">
                        Round {round.round_number}: {round.round_name}
                      </span>
                      <span className="ml-2 text-slate-500">
                        {round.round_type} · {round.duration_minutes}m
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-500">No round details available.</p>
              )}
              <p className="mt-4 text-sm text-slate-600">
                Total questions: {detail.total_questions ?? '—'}
              </p>
            </section>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Attempts & results</h2>
              <span className="text-xs font-medium text-slate-500">
                {results?.attempts?.length || 0} rows
              </span>
            </div>
            {!results?.attempts?.length ? (
              <p className="mt-4 text-sm text-slate-500">No attempts yet.</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Student Details</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Score</th>
                      <th className="px-3 py-2">Evaluation</th>
                      <th className="px-3 py-2">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {results.attempts.map((row) => {
                      const name =
                        typeof row.student_name === 'string' && row.student_name.trim()
                          ? row.student_name.trim()
                          : null;
                      const email =
                        typeof row.email === 'string' && row.email.trim() ? row.email.trim() : null;
                      const phone =
                        typeof row.phone === 'string' && row.phone.trim() ? row.phone.trim() : null;
                      return (
                        <tr key={String(row.attempt_id)}>
                          <td className="px-3 py-2">
                            <div className="font-semibold text-slate-900">{name || 'Unknown student'}</div>
                            {email ? (
                              <div className="text-xs text-slate-600">{email}</div>
                            ) : (
                              <div className="text-xs text-slate-400">Email unavailable</div>
                            )}
                            {phone ? (
                              <div className="text-xs text-slate-600">{phone}</div>
                            ) : (
                              <div className="text-xs text-slate-400">Phone unavailable</div>
                            )}
                          </td>
                          <td className="px-3 py-2">{String(row.status || '—')}</td>
                          <td className="px-3 py-2">
                            {row.percentage != null ? `${row.percentage}%` : '—'}
                          </td>
                          <td className="px-3 py-2">
                            {row.evaluation_pending
                              ? 'Pending'
                              : row.is_evaluated
                                ? 'Evaluated'
                                : '—'}
                          </td>
                          <td className="px-3 py-2">
                            {row.submitted_at
                              ? new Date(String(row.submitted_at)).toLocaleString()
                              : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}

      {confirmCopy && (
        <ConfirmationModal
          isOpen={!!confirm}
          onClose={() => setConfirm(null)}
          onConfirm={runAction}
          title={confirmCopy.title}
          message={confirmCopy.message}
          confirmText={confirmCopy.confirmText}
          isLoading={acting}
          variant={confirmCopy.variant}
        />
      )}
    </DashboardLayout>
  );
}
