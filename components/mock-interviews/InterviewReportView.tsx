'use client';

import { useEffect, useState } from 'react';
import type React from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Loader2, Target } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';

type Report = { overall_score: number; breakdown: { questions_answered?: number; strengths?: string[]; weaknesses?: string[]; suggestions?: string[] }; summary?: string };

export function InterviewReportView({ sessionId }: { sessionId: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [waiting, setWaiting] = useState(true);
  useEffect(() => { const load = async () => { try { setReport(await api.getMockInterviewReport(sessionId) as Report); setWaiting(false); } catch (error: unknown) { const status = (error as { response?: { status?: number } })?.response?.status; if (status !== 202) setWaiting(false); } }; load(); const timer = window.setInterval(load, 2500); return () => window.clearInterval(timer); }, [sessionId]);
  if (waiting && !report) return <main className="flex min-h-dvh items-center justify-center bg-surface-page"><div className="text-center"><Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-blue" /><h1 className="mt-5 text-2xl font-semibold">Preparing your interview report</h1><p className="mt-2 text-ink-muted">We are turning your responses into actionable feedback.</p></div></main>;
  if (!report) return <main className="flex min-h-dvh items-center justify-center bg-surface-page"><div className="text-center"><AlertCircle className="mx-auto h-8 w-8 text-brand-red" /><h1 className="mt-5 text-2xl font-semibold">Report unavailable</h1><Link href="/dashboard/student/mock-interviews"><Button className="mt-5" variant="secondary">Back to mock interviews</Button></Link></div></main>;
  const scorePercent = Math.round(report.overall_score * 10);
  return <main className="min-h-dvh bg-surface-page px-4 py-10"><section className="mx-auto max-w-4xl"><Link href="/dashboard/student/mock-interviews" className="text-sm font-semibold text-brand-blue">Back to mock interviews</Link><div className="mt-6 border-b border-line-default pb-8"><p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">Practice report</p><h1 className="mt-2 text-3xl font-bold text-ink-primary">Here is how your interview went</h1><p className="mt-3 max-w-2xl text-ink-muted">{report.summary}</p></div><div className="mt-8 grid gap-5 md:grid-cols-[220px_1fr]"><div className="card-surface flex flex-col items-center justify-center p-6"><div className="text-5xl font-bold text-brand-blue">{scorePercent}%</div><p className="mt-2 text-sm text-ink-muted">Overall score</p><p className="mt-4 text-xs text-ink-muted">{report.breakdown.questions_answered || 0} responses evaluated</p></div><div className="grid gap-5"><FeedbackCard icon={<CheckCircle2 className="h-5 w-5 text-green-600" />} title="Strengths" items={report.breakdown.strengths || []} empty="Complete another practice round to surface more strengths." /><FeedbackCard icon={<Target className="h-5 w-5 text-brand-orange" />} title="Next practice focus" items={[...(report.breakdown.weaknesses || []), ...(report.breakdown.suggestions || [])]} empty="Keep practising concise, example-led explanations." /></div></div></section></main>;
}

function FeedbackCard({ icon, title, items, empty }: { icon: React.ReactNode; title: string; items: string[]; empty: string }) { return <section className="card-surface p-5"><div className="flex items-center gap-2"><span>{icon}</span><h2 className="font-semibold text-ink-primary">{title}</h2></div><ul className="mt-4 space-y-2 text-sm leading-6 text-ink-secondary">{(items.length ? items : [empty]).map((item, index) => <li key={index} className="flex gap-2"><span className="text-brand-blue">•</span><span>{item}</span></li>)}</ul></section>; }
