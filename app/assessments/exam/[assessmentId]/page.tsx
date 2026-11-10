'use client';

import { useParams, useRouter } from 'next/navigation';
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
import { getInactiveStudentPath } from '@/lib/auth/session';
import { TrialUpgradeDialog, type TrialDialogMode } from '@/components/dashboard/student/TrialUpgradeDialog';
import { parseTrialError } from '@/lib/trial';

export default function StudentExamEntryPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.assessmentId as string;
  const { session, ready: sessionReady } = useSession();

  const [exam, setExam] = useState<PublicExamBrief | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [startError, setStartError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [upgradeMode, setUpgradeMode] = useState<TrialDialogMode | null>(null);
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
    if (!sessionReady || !session || session.userType !== 'student') return;
    if (session.accessStatus === 'inactive') {
      router.replace(getInactiveStudentPath());
      return;
    }
    let cancelled = false;
    api
      .getDashboard()
      .then((data) => {
        if (cancelled) return;
        const status = String((data.student as { access_status?: string })?.access_status || '');
        if (status) localStorage.setItem('access_status', status);
        if (status === 'inactive') router.replace(getInactiveStudentPath());
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [router, session, sessionReady]);

  useEffect(() => {
    if (!sessionReady) return;
    if (session?.userType === 'student' && session.accessStatus === 'inactive') return;
    loadExam();
  }, [loadExam, session?.accessStatus, session?.userType, sessionReady]);

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

  const mapStartError = (error: unknown): string => {
    const axiosError = error as {
      response?: { status?: number; data?: { detail?: string | { msg?: string }[] } };
      code?: string;
      message?: string;
    };
    const status = axiosError.response?.status;
    const rawDetail = axiosError.response?.data?.detail;
    const detail =
      typeof rawDetail === 'string'
        ? rawDetail
        : Array.isArray(rawDetail)
          ? rawDetail.map((item) => item?.msg).filter(Boolean).join(' ')
          : '';

    const trialCode = parseTrialError(detail);
    if (trialCode) {
      const message = detail.includes(':') ? detail.split(':').slice(1).join(':').trim() : detail;
      return (
        message ||
        'Your free assessment attempt has been used. Upgrade to Premium to unlock unlimited assessment attempts.'
      );
    }
    if (status === 404 || /not found/i.test(detail)) {
      return 'Assessment could not be found.';
    }
    if (status === 403 || /not authorized|only available|subscription required|batch/i.test(detail)) {
      return detail || 'You are not authorized to take this assessment.';
    }
    if (
      status === 400 &&
      /not open|not started|has ended|not currently available|window/i.test(detail)
    ) {
      return detail || 'Assessment is not currently available.';
    }
    if (status === 400 && /not ready|configuration|incomplete|sync/i.test(detail)) {
      return detail || 'Assessment configuration is incomplete.';
    }
    if (status === 400 && /session|attempt|already taken|could not open/i.test(detail)) {
      return detail || 'Exam session could not be created.';
    }
    if (status && status >= 500) {
      return 'Temporary server error. Please try again.';
    }
    if (
      !axiosError.response &&
      (axiosError.code === 'ERR_NETWORK' || /network error/i.test(axiosError.message || ''))
    ) {
      return 'Temporary server error. Please try again.';
    }
    if (detail && detail !== 'Internal Server Error' && !/network error/i.test(detail)) {
      return detail;
    }
    return 'Could not start the exam. Please try again.';
  };

  const handleStartExam = async () => {
    if (
      !session ||
      session.userType !== 'student' ||
      !exam ||
      eligibility?.can_start === false ||
      eligibility?.is_batch_member === false ||
      starting
    ) {
      return;
    }
    setStartError(null);
    setStarting(true);
    try {
      const res = await api.generateAssessmentToken(assessmentId, { expires_in_minutes: 120 });
      if (res?.exam_url) {
        window.location.href = res.exam_url as string;
        return;
      }
      if (res?.solviq_url) {
        window.location.href = res.solviq_url as string;
        return;
      }
      setStartError('Exam session could not be created. Please try again.');
    } catch (e: unknown) {
      const detail = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (parseTrialError(detail)) {
        setUpgradeMode(parseTrialError(detail) === 'TRIAL_EXPIRED' ? 'expired' : 'limit');
        return;
      }
      setStartError(mapStartError(e));
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SiteHeader />
      <TrialUpgradeDialog mode={upgradeMode} feature="assessment" onClose={() => setUpgradeMode(null)} />

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
