'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';

type RoundQuestion = {
  question_text?: string;
  question_type?: string;
  student_answer?: unknown;
  correct_answer?: unknown;
  is_correct?: boolean | null;
  score?: number | null;
  max_score?: number | null;
  feedback?: string | null;
};

type RoundResult = {
  round_number?: number;
  round_name?: string;
  round_type?: string;
  score?: number | null;
  total_score?: number | null;
  percentage?: number | null;
  questions?: RoundQuestion[];
};

type StudentResult = {
  assessment_id: string;
  assessment_name: string;
  student_name?: string | null;
  status?: string | null;
  completed?: boolean;
  results_published?: boolean;
  total_marks?: number | null;
  marks_obtained?: number | null;
  percentage?: number | null;
  correct_answers?: number | null;
  incorrect_answers?: number | null;
  unanswered_questions?: number | null;
  rounds?: RoundResult[];
  feedback?: string | null;
  submitted_at?: string | null;
  message?: string | null;
};

function formatAnswer(value: unknown): string {
  if (value == null || value === '') return '—';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export default function StudentAssessmentResultsPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;
  const { logout } = useAuth();
  useStudentActiveGate();

  const [result, setResult] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getStudentAssessmentResult(assessmentId)
      .then((data) => {
        if (!cancelled) setResult(data as StudentResult);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        setError(
          typeof detail === 'string'
            ? detail
            : 'Results are not available for this assessment.'
        );
        setResult(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  return (
    <DashboardLayout
      role="student"
      title="Assessment results"
      subtitle="Your evaluated score for this assessment"
      onLogout={logout}
    >
      <div className="mb-4">
        <Link href="/dashboard/student/assessments">
          <Button variant="secondary" className="normal-case tracking-normal">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assessments
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
          <p className="font-semibold">Results unavailable</p>
          <p className="mt-2 leading-relaxed">{error}</p>
          {!/published/i.test(error) && !/completed/i.test(error) ? null : (
            <p className="mt-3 text-xs text-amber-800">
              If you have not finished this assessment, complete it first. If you already finished,
              wait until your coordinator publishes results.
            </p>
          )}
        </div>
      ) : !result ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
          No result found.
        </div>
      ) : (
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900">{result.assessment_name}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {result.student_name || 'Student'} · Status: {result.status || 'Completed'}
            </p>
            {result.submitted_at ? (
              <p className="mt-1 text-xs text-slate-500">
                Completed {new Date(result.submitted_at).toLocaleString()}
              </p>
            ) : null}
          </section>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Marks obtained', result.marks_obtained ?? '—'],
              ['Total marks', result.total_marks ?? '—'],
              ['Percentage', result.percentage != null ? `${result.percentage}%` : '—'],
              [
                'Correct / Incorrect',
                `${result.correct_answers ?? 0} / ${result.incorrect_answers ?? 0}`,
              ],
            ].map(([label, value]) => (
              <div key={String(label)} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </section>

          {result.feedback ? (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Feedback</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{result.feedback}</p>
            </section>
          ) : null}

          {result.rounds && result.rounds.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Round-wise results</h2>
              {result.rounds.map((round, idx) => (
                <div
                  key={`${round.round_number}-${idx}`}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold text-slate-900">
                      Round {round.round_number}: {round.round_name || round.round_type || 'Round'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {round.score ?? 0} / {round.total_score ?? '—'}
                      {round.percentage != null ? ` · ${round.percentage}%` : ''}
                    </p>
                  </div>
                  {round.questions && round.questions.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                      {round.questions.map((q, qIdx) => (
                        <li
                          key={qIdx}
                          className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm"
                        >
                          <p className="font-medium text-slate-900">
                            Q{qIdx + 1}. {q.question_text || 'Question'}
                          </p>
                          <p className="mt-1 text-slate-600">
                            Your answer: {formatAnswer(q.student_answer)}
                          </p>
                          <p className="mt-1 text-slate-600">
                            Correct answer: {formatAnswer(q.correct_answer)}
                          </p>
                          <p
                            className={
                              q.is_correct
                                ? 'mt-1 font-medium text-green-700'
                                : 'mt-1 font-medium text-red-700'
                            }
                          >
                            {q.is_correct ? 'Correct' : q.is_correct === false ? 'Incorrect' : '—'}
                            {q.score != null ? ` · ${q.score}/${q.max_score ?? '—'}` : ''}
                          </p>
                          {q.feedback ? (
                            <p className="mt-1 text-xs text-slate-500">{q.feedback}</p>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </section>
          ) : null}
        </div>
      )}
    </DashboardLayout>
  );
}
