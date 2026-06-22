'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  StudentExamInstructions,
  type PublicExamBrief,
  type StudentExamEligibility,
} from '@/components/assessments/StudentExamInstructions';
import { SiteHeader } from '@/components/layout/Shell';
import { useSession } from '@/hooks/useSession';
import { api } from '@/lib/api';

export default function StudentExamEntryPage() {
  const params = useParams();
  const assessmentId = params.assessmentId as string;
  const { session, ready: sessionReady } = useSession();

  const [exam, setExam] = useState<PublicExamBrief | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [eligibility, setEligibility] = useState<StudentExamEligibility | null>(null);
  const [eligibilityLoading, setEligibilityLoading] = useState(true);

  const examPath = `/assessments/exam/${assessmentId}`;
  const loginUrl = useMemo(
    () => `/auth/login?type=student&redirect=${encodeURIComponent(examPath)}`,
    [examPath]
  );
  const registerUrl = useMemo(
    () => `/auth/register?type=student&redirect=${encodeURIComponent(examPath)}`,
    [examPath]
  );

  const loadExam = useCallback(async () => {
    if (!assessmentId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const data =
        session?.userType === 'student'
          ? await api.getStudentExam(assessmentId)
          : await api.getPublicAssessment(assessmentId);
      setExam({
        ...data,
        disha_assessment_id: data.disha_assessment_id || data.external_id,
        total_questions: data.total_questions ?? 0,
        round_count: data.round_count ?? data.rounds?.length ?? 0,
        rounds: data.rounds ?? [],
      });
    } catch (e: unknown) {
      setExam(null);
      const detail = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setLoadError(
        typeof detail === 'string'
          ? detail
          : 'This exam link is invalid or the assessment is not open for students.'
      );
    } finally {
      setLoading(false);
    }
  }, [assessmentId, session?.userType]);

  useEffect(() => {
    if (!sessionReady) return;
    loadExam();
  }, [loadExam, sessionReady]);

  useEffect(() => {
    let cancelled = false;
    const loadEligibility = async () => {
      if (!session || session.userType !== 'student' || !assessmentId) {
        setEligibility(null);
        setEligibilityLoading(false);
        return;
      }
      setEligibilityLoading(true);
      try {
        const data = await api.getAssessmentEligibility(assessmentId);
        if (!cancelled) setEligibility(data);
      } catch {
        if (!cancelled) setEligibility(null);
      } finally {
        if (!cancelled) setEligibilityLoading(false);
      }
    };
    if (sessionReady) loadEligibility();
    return () => {
      cancelled = true;
    };
  }, [assessmentId, session, sessionReady]);

  const handleStartExam = async () => {
    if (
      !session ||
      session.userType !== 'student' ||
      !exam ||
      eligibility?.can_start === false ||
      eligibility?.is_batch_member === false
    ) {
      return;
    }
    setStartError(null);
    setStarting(true);
    try {
      const res = await api.generateAssessmentToken(assessmentId, { expires_in_minutes: 120 });
      if (res?.solviq_url) {
        window.location.href = res.solviq_url as string;
        return;
      }
      setStartError('Could not start the exam. Please try again.');
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        (e as Error)?.message ||
        'Could not start the exam.';
      setStartError(typeof msg === 'string' ? msg : 'Could not start the exam.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />

      {loading || !sessionReady ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 pt-20 text-gray-600">
          <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
          <p className="text-sm font-medium">Loading exam instructions…</p>
        </div>
      ) : loadError || !exam ? (
        <div className="mx-auto max-w-lg px-4 pb-12 pt-28">
          <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{loadError || 'Exam not available.'}</p>
          </div>
        </div>
      ) : (
        <div className="pt-4">
          <StudentExamInstructions
            exam={exam}
            authLoading={!sessionReady}
            isAuthenticated={!!session}
            isStudent={session?.userType === 'student'}
            loginUrl={loginUrl}
            registerUrl={registerUrl}
            startError={startError}
            starting={starting}
            onStart={handleStartExam}
            eligibility={eligibility}
            eligibilityLoading={eligibilityLoading}
            onScheduleReached={() => loadExam()}
          />
        </div>
      )}
    </div>
  );
}
