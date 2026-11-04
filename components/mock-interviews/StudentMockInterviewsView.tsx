'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Clock3, Lock, MessageSquareText, Play, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { TrialUpgradeDialog, type TrialDialogMode } from '@/components/dashboard/student/TrialUpgradeDialog';
import { parseTrialError } from '@/lib/trial';
import type { MockInterview, MockInterviewSession } from './types';

type TrialLimits = {
  plan: string;
  mockUsed: number;
  mockLimit: number;
};

export function StudentMockInterviewsView() {
  const router = useRouter();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [interviews, setInterviews] = useState<MockInterview[]>([]);
  const [sessions, setSessions] = useState<MockInterviewSession[]>([]);
  const [trial, setTrial] = useState<TrialLimits | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [upgradeMode, setUpgradeMode] = useState<TrialDialogMode | null>(null);

  useEffect(() => {
    Promise.all([api.getStudentMockInterviews(), api.getMockInterviewSessions(), api.getDashboard()])
      .then(([interviewRows, sessionRows, dashboard]) => {
        setInterviews(interviewRows as MockInterview[]);
        setSessions(sessionRows as MockInterviewSession[]);
        const student = (dashboard as { student?: Record<string, unknown> }).student || {};
        const limits = (student.limits || {}) as {
          mock_interviews?: { used?: number; limit?: number };
        };
        setTrial({
          plan: String(student.plan || ''),
          mockUsed: Number(limits.mock_interviews?.used || 0),
          mockLimit: Number(limits.mock_interviews?.limit || 1),
        });
      })
      .catch(() => toast.error('Unable to load mock interviews.'))
      .finally(() => setLoading(false));
  }, []);

  const inProgress = sessions.find((session) => session.status !== 'done');
  const trialLocked =
    Boolean(trial) &&
    (trial!.plan === 'expired' ||
      ((trial!.plan === 'trial' || trial!.plan === 'locked') &&
        (trial!.mockUsed >= trial!.mockLimit || sessions.length > 0)));

  const openUpgrade = () => {
    setUpgradeMode(trial?.plan === 'expired' ? 'expired' : 'limit');
  };

  const start = async (interviewId: string) => {
    if (trialLocked && !inProgress) {
      openUpgrade();
      return;
    }
    // If trial is locked but an in-progress session exists for another interview, still block new starts.
    if (trialLocked && inProgress && inProgress.mock_interview_id !== interviewId) {
      openUpgrade();
      return;
    }
    setStartingId(interviewId);
    try {
      const session = (await api.startMockInterview(interviewId)) as { id: string };
      router.push(`/mock-interviews/lobby/${session.id}`);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      const trialCode = parseTrialError(message);
      if (trialCode) {
        setUpgradeMode(trialCode === 'TRIAL_EXPIRED' ? 'expired' : 'limit');
        return;
      }
      toast.error(message || 'Could not start the interview.');
    } finally {
      setStartingId(null);
    }
  };

  if (loading) return <LoadingState />;
  return (
    <DashboardLayout
      role="student"
      title="Mock interviews"
      subtitle="Practice your answers in a realistic guided interview."
      onLogout={logout}
    >
      {trialLocked ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-l-4 border-brand-orange bg-white px-4 py-3 shadow-card">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-brand-orange" />
            <p className="text-sm font-medium">
              {trial?.plan === 'expired'
                ? 'Your free trial has ended. Upgrade to practise mock interviews.'
                : 'You’ve used your free mock interview. Upgrade to unlock more practice.'}
            </p>
          </div>
          <Button variant="accent" className="px-3 py-2 text-xs" onClick={openUpgrade}>
            Upgrade to unlock
          </Button>
        </div>
      ) : null}

      {inProgress && (
        <div className="mb-6 flex items-center justify-between gap-4 border-l-4 border-brand-orange bg-white px-4 py-3 shadow-card">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-brand-orange" />
            <p className="text-sm font-medium">You have an interview session in progress.</p>
          </div>
          <Button
            variant="secondary"
            className="px-3 py-2 text-xs"
            onClick={() => router.push(`/mock-interviews/session/${inProgress.id}`)}
          >
            Resume
          </Button>
        </div>
      )}

      {interviews.length === 0 ? (
        <EmptyState message="No mock interviews are available for your batch yet." />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => {
            const isInProgressHere = inProgress?.mock_interview_id === interview.id;
            const lockedCard = trialLocked && !isInProgressHere;
            return (
              <article key={interview.id} className="card-surface flex min-h-64 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue">
                    {lockedCard ? <Lock className="h-5 w-5" /> : <MessageSquareText className="h-5 w-5" />}
                  </div>
                  <span className="badge-pill">{interview.difficulty}</span>
                </div>
                <h2 className="mt-5 text-xl font-semibold text-ink-primary">{interview.title}</h2>
                <p className="mt-1 text-sm text-ink-muted">{interview.topic}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink-muted">
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    {interview.duration_minutes} min
                  </span>
                  <span>{interview.question_count} questions</span>
                </div>
                <div className="mt-auto pt-6">
                  {lockedCard ? (
                    <Button variant="secondary" fullWidth onClick={openUpgrade}>
                      <Lock className="mr-2 h-4 w-4" />
                      Upgrade to unlock
                    </Button>
                  ) : isInProgressHere ? (
                    <Button
                      variant="accent"
                      fullWidth
                      onClick={() => router.push(`/mock-interviews/session/${inProgress!.id}`)}
                    >
                      Resume practice
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      fullWidth
                      disabled={startingId === interview.id}
                      onClick={() => start(interview.id)}
                    >
                      {startingId === interview.id ? (
                        'Preparing...'
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start practice
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
      <TrialUpgradeDialog
        mode={upgradeMode}
        feature="mockInterview"
        onClose={() => setUpgradeMode(null)}
      />
    </DashboardLayout>
  );
}
