'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Clock3, MessageSquareText, Play, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import type { MockInterview, MockInterviewSession } from './types';

export function StudentMockInterviewsView() {
  const router = useRouter();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [interviews, setInterviews] = useState<MockInterview[]>([]);
  const [sessions, setSessions] = useState<MockInterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getStudentMockInterviews(), api.getMockInterviewSessions()])
      .then(([interviewRows, sessionRows]) => {
        setInterviews(interviewRows as MockInterview[]);
        setSessions(sessionRows as MockInterviewSession[]);
      })
      .catch(() => toast.error('Unable to load mock interviews.'))
      .finally(() => setLoading(false));
  }, []);

  const start = async (interviewId: string) => {
    setStartingId(interviewId);
    try {
      const session = await api.startMockInterview(interviewId) as { id: string };
      router.push(`/mock-interviews/lobby/${session.id}`);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      toast.error(message || 'Could not start the interview.');
    } finally {
      setStartingId(null);
    }
  };

  if (loading) return <LoadingState />;
  return (
    <DashboardLayout role="student" title="Mock interviews" subtitle="Practice your answers in a realistic guided interview." onLogout={logout}>
      {sessions.some((session) => session.status !== 'done') && (
        <div className="mb-6 flex items-center justify-between gap-4 border-l-4 border-brand-orange bg-white px-4 py-3 shadow-card">
          <div className="flex items-center gap-3"><Sparkles className="h-5 w-5 text-brand-orange" /><p className="text-sm font-medium">You have an interview session in progress.</p></div>
          <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => router.push(`/mock-interviews/session/${sessions.find((session) => session.status !== 'done')?.id}`)}>Resume</Button>
        </div>
      )}
      {interviews.length === 0 ? <EmptyState message="No mock interviews are available for your batch yet." /> : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {interviews.map((interview) => (
            <article key={interview.id} className="card-surface flex min-h-64 flex-col p-6">
              <div className="flex items-start justify-between gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-blue/10 text-brand-blue"><MessageSquareText className="h-5 w-5" /></div><span className="badge-pill">{interview.difficulty}</span></div>
              <h2 className="mt-5 text-xl font-semibold text-ink-primary">{interview.title}</h2>
              <p className="mt-1 text-sm text-ink-muted">{interview.topic}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink-muted"><span className="inline-flex items-center gap-1"><Clock3 className="h-4 w-4" />{interview.duration_minutes} min</span><span>{interview.question_count} questions</span></div>
              <div className="mt-auto pt-6"><Button variant="accent" fullWidth disabled={startingId === interview.id} onClick={() => start(interview.id)}>{startingId === interview.id ? 'Preparing...' : <><Play className="mr-2 h-4 w-4" />Start practice</>}</Button></div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
