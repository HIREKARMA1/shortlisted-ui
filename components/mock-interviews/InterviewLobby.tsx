'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquareText } from 'lucide-react';

export function InterviewLobby({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(7);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    const redirect = window.setTimeout(() => router.replace(`/mock-interviews/session/${sessionId}`), 7000);
    return () => { window.clearInterval(timer); window.clearTimeout(redirect); };
  }, [router, sessionId]);
  return <main className="flex min-h-dvh items-center justify-center bg-surface-page p-6"><section className="w-full max-w-md text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white shadow-elevated"><MessageSquareText className="h-8 w-8" /></div><p className="mt-8 text-sm font-semibold uppercase tracking-wide text-brand-blue">Mock interview</p><h1 className="mt-2 text-3xl font-bold text-ink-primary">Your interviewer will join shortly</h1><p className="mt-3 text-ink-muted">Take a breath, choose a quiet place, and answer naturally.</p><div className="mx-auto mt-8 h-1.5 w-56 overflow-hidden rounded-full bg-line-default"><div className="h-full bg-brand-orange transition-all duration-1000" style={{ width: `${((7 - remaining) / 7) * 100}%` }} /></div><p className="mt-3 text-sm text-ink-muted">Starting in {remaining}s</p></section></main>;
}
