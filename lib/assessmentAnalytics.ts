/** Helpers for admin assessment analytics (scores, evaluation state). */

export type AssessmentRoundLike = {
  config?: { num_questions?: number } | null;
};

export type AssessmentLike = {
  rounds?: AssessmentRoundLike[];
  passing_criteria?: { overall_percentage?: number } | null;
  end_time?: string | null;
};

export type AttemptLike = {
  status?: string;
  total_score?: number | null;
  percentage?: number | null;
  started_at?: string | null;
  submitted_at?: string | null;
  solviq_attempt_id?: string | null;
  result_data?: { rounds?: unknown[] } | null;
  total_questions?: number | null;
  proctoring_snapshot_count?: number | null;
  proctoring_snapshots?: unknown[] | null;
};

export type AttemptResultState = 'evaluated' | 'in_progress' | 'awaiting_results' | 'not_finished';

const EVALUATED_STATUSES = new Set(['COMPLETED', 'PASSED', 'FAILED', 'SUBMITTED']);

export function getTotalQuestionsFromAssessment(assessment?: AssessmentLike | null): number {
  if (!assessment?.rounds?.length) return 0;
  return assessment.rounds.reduce((sum, round) => {
    const n = round.config?.num_questions;
    return sum + (typeof n === 'number' && n > 0 ? n : 0);
  }, 0);
}

/** Max score denominator: prefer evaluated result_data, else configured question count. */
export function getAttemptMaxScore(attempt: AttemptLike, assessment?: AssessmentLike | null): number {
  if (attempt.total_questions && attempt.total_questions > 0) {
    return attempt.total_questions;
  }

  const rounds = attempt.result_data?.rounds;
  if (Array.isArray(rounds) && rounds.length > 0) {
    const fromResults = rounds.reduce((sum: number, round: unknown) => {
      const r = round as { total_score?: number; questions?: { max_score?: number }[] };
      if (typeof r.total_score === 'number' && r.total_score > 0) return sum + r.total_score;
      if (Array.isArray(r.questions)) {
        return (
          sum +
          r.questions.reduce((qSum, q) => qSum + (typeof q.max_score === 'number' ? q.max_score : 1), 0)
        );
      }
      return sum;
    }, 0);
    if (fromResults > 0) return fromResults;
  }

  if (
    typeof attempt.total_score === 'number' &&
    typeof attempt.percentage === 'number' &&
    attempt.percentage > 0
  ) {
    return Math.round(attempt.total_score / (attempt.percentage / 100));
  }

  const configured = getTotalQuestionsFromAssessment(assessment);
  return configured > 0 ? configured : 0;
}

export function isAttemptEvaluated(attempt: AttemptLike): boolean {
  if (attempt.submitted_at) return true;
  if (attempt.result_data?.rounds?.length) return true;
  const status = (attempt.status || '').toUpperCase();
  return EVALUATED_STATUSES.has(status);
}

function hasProctoringEvidence(attempt: AttemptLike): boolean {
  if (typeof attempt.proctoring_snapshot_count === 'number' && attempt.proctoring_snapshot_count > 0) {
    return true;
  }
  return Array.isArray(attempt.proctoring_snapshots) && attempt.proctoring_snapshots.length > 0;
}

function isAssessmentWindowEnded(assessment?: AssessmentLike | null): boolean {
  if (!assessment?.end_time) return false;
  const end = new Date(assessment.end_time).getTime();
  return Number.isFinite(end) && Date.now() > end;
}

/**
 * Distinguishes:
 * - evaluated: scores received
 * - awaiting_results: evidence of Solviq progress, scores not synced yet
 * - in_progress: exam window still open, student started, no scores yet
 * - not_finished: exam window ended and student never completed / no Solviq result
 */
export function getAttemptResultState(
  attempt: AttemptLike,
  assessment?: AssessmentLike | null
): AttemptResultState {
  if (isAttemptEvaluated(attempt)) return 'evaluated';

  if (attempt.solviq_attempt_id || hasProctoringEvidence(attempt)) {
    return 'awaiting_results';
  }

  if (isAssessmentWindowEnded(assessment)) {
    return 'not_finished';
  }

  return 'in_progress';
}

export function getAttemptResultLabel(state: AttemptResultState): string {
  switch (state) {
    case 'evaluated':
      return 'EVALUATED';
    case 'awaiting_results':
      return 'AWAITING RESULTS';
    case 'in_progress':
      return 'IN PROGRESS';
    case 'not_finished':
      return 'NOT FINISHED';
  }
}

export function getAttemptResultBadgeClass(state: AttemptResultState): string {
  switch (state) {
    case 'evaluated':
      return 'bg-blue-600 text-white';
    case 'awaiting_results':
      return 'bg-amber-100 text-amber-800';
    case 'in_progress':
      return 'bg-sky-100 text-sky-800';
    case 'not_finished':
      return 'bg-slate-200 text-slate-700';
  }
}

export function getAttemptResultHint(state: AttemptResultState): string {
  switch (state) {
    case 'evaluated':
      return '';
    case 'awaiting_results':
      return 'Student likely finished on Solviq, but scores have not synced yet. Try Pull results from Solviq.';
    case 'in_progress':
      return 'Student started the exam. Waiting for them to finish, or for Solviq to send scores.';
    case 'not_finished':
      return 'Exam window ended and this student did not complete the test. No score will appear.';
  }
}

export function getPassingPercentage(assessment?: AssessmentLike | null): number {
  return assessment?.passing_criteria?.overall_percentage ?? 60;
}

export function getPassFailLabel(
  attempt: AttemptLike,
  assessment?: AssessmentLike | null
): 'PASS' | 'FAIL' | 'PENDING' | 'INCOMPLETE' {
  const state = getAttemptResultState(attempt, assessment);
  if (state === 'not_finished') return 'INCOMPLETE';
  if (state === 'awaiting_results' || state === 'in_progress') return 'PENDING';
  if (!isAttemptEvaluated(attempt)) return 'PENDING';
  const threshold = getPassingPercentage(assessment);
  const status = (attempt.status || '').toUpperCase();
  if (status === 'PASSED') return 'PASS';
  if (status === 'FAILED') return 'FAIL';
  if (typeof attempt.percentage === 'number') {
    return attempt.percentage >= threshold ? 'PASS' : 'FAIL';
  }
  return 'PENDING';
}

export function getPassFailBadgeClass(label: 'PASS' | 'FAIL' | 'PENDING' | 'INCOMPLETE'): string {
  switch (label) {
    case 'PASS':
      return 'border border-brand-green/30 bg-brand-green/10 text-brand-green';
    case 'FAIL':
      return 'border border-brand-red/30 bg-brand-red/10 text-brand-red';
    case 'INCOMPLETE':
      return 'border border-slate-300 bg-slate-100 text-slate-700';
    default:
      return 'border border-line bg-soft text-ink-secondary';
  }
}

export function formatAttemptScore(attempt: AttemptLike, assessment?: AssessmentLike | null): string {
  const max = getAttemptMaxScore(attempt, assessment);
  if (!isAttemptEvaluated(attempt)) {
    return max > 0 ? `- / ${max}` : '-';
  }
  const score = typeof attempt.total_score === 'number' ? attempt.total_score.toFixed(1) : '-';
  return max > 0 ? `${score} / ${max}` : String(score);
}

export function formatAttemptPercentage(attempt: AttemptLike): string {
  if (!isAttemptEvaluated(attempt) || typeof attempt.percentage !== 'number') {
    return '-';
  }
  return `${attempt.percentage.toFixed(1)}%`;
}
