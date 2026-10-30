'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, UserRound } from 'lucide-react';
import { api } from '@/lib/api';

type StudentSummary = { student_id: string; name: string; email: string; profile_picture?: string | null; total_requests: number; pending_requests: number; confirmed_interviews: number; completed_interviews: number; cancelled_interviews: number; rejected_requests: number };
type StudentDetail = { student: { id: string; name: string; email: string; phone?: string | null; profile_picture?: string | null }; stats: Omit<StudentSummary, 'student_id' | 'name' | 'email' | 'profile_picture'>; interviews: any[] };
const statCards = [
  ['total_requests', 'Requests', 'bg-blue-50 text-blue-700'],
  ['confirmed_interviews', 'Confirmed', 'bg-indigo-50 text-indigo-700'],
  ['completed_interviews', 'Completed', 'bg-emerald-50 text-emerald-700'],
  ['pending_requests', 'Pending', 'bg-amber-50 text-amber-800'],
  ['cancelled_interviews', 'Cancelled', 'bg-slate-100 text-slate-700'],
  ['rejected_requests', 'Rejected', 'bg-rose-50 text-rose-700'],
] as const;
const dateText = (value?: string | null, timezone?: string) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: timezone || 'Asia/Kolkata' }) : 'Not scheduled';
const statusTone = (status: string) => status === 'completed' ? 'bg-emerald-50 text-emerald-700' : status === 'confirmed' ? 'bg-blue-50 text-blue-700' : status === 'pending' ? 'bg-amber-50 text-amber-800' : status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600';

export function InterviewStudentRecords() {
  const [rows, setRows] = useState<StudentSummary[]>([]);
  const [search, setSearch] = useState('');
  const [withRequests, setWithRequests] = useState(false);
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [status, setStatus] = useState('all');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [openingStudent, setOpeningStudent] = useState<string | null>(null);

  const load = async () => {
    try {
      const query = new URLSearchParams();
      if (search.trim()) query.set('search', search.trim());
      if (withRequests) query.set('students_with_requests', 'true');
      setRows(await api.get<StudentSummary[]>(`/admin/interview-students?${query.toString()}`));
    } catch (error: any) { setMessage(error?.response?.data?.detail || 'Could not load student records.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [search, withRequests]);

  const openStudent = async (student: StudentSummary) => {
    setMessage('');
    setOpeningStudent(student.student_id);
    try {
      setDetail(await api.get<StudentDetail>(`/admin/interview-students/${student.student_id}/history`));
    } catch (error: any) { setMessage(error?.response?.data?.detail || 'Could not load this student’s interview history.'); }
    finally { setOpeningStudent(null); }
  };
  const filteredHistory = useMemo(() => detail?.interviews.filter((row) => status === 'all' || row.status === status) || [], [detail, status]);

  return <section className="space-y-4">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">Student Records</h2><p className="mt-1 text-sm text-slate-500">Interview totals are calculated from saved requests and their current status.</p></div>
      <div className="flex flex-wrap gap-2"><label className="relative"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name, email, or student ID" className="h-9 w-64 rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm" /></label><label className="flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-600"><input type="checkbox" checked={withRequests} onChange={(e) => setWithRequests(e.target.checked)} /> Has interviews</label></div>
    </div>
    {message && <p role="status" className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>}
    {loading ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading student records…</div> : !rows.length ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No students match this search.</div> : <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm"><table className="w-full min-w-[980px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Student', 'Student ID', 'Requests', 'Confirmed', 'Completed', 'Cancelled', 'Rejected', ''].map((title) => <th key={title} className="px-3 py-3 font-semibold">{title}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row) => <tr key={row.student_id} className="hover:bg-slate-50"><td className="px-3 py-3"><span className="flex items-center gap-2.5">{row.profile_picture ? <img src={row.profile_picture} alt="" className="h-9 w-9 rounded-full object-cover" /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><UserRound className="h-4 w-4" /></span>}<span><b className="block text-slate-800">{row.name}</b><span className="text-xs text-slate-500">{row.email}</span></span></span></td><td className="px-3 py-3 font-mono text-xs text-slate-500">{row.student_id}</td><td className="px-3 py-3">{row.total_requests}</td><td className="px-3 py-3 text-indigo-700">{row.confirmed_interviews}</td><td className="px-3 py-3 text-emerald-700">{row.completed_interviews}</td><td className="px-3 py-3">{row.cancelled_interviews}</td><td className="px-3 py-3 text-rose-700">{row.rejected_requests}</td><td className="px-3 py-3"><button disabled={openingStudent === row.student_id} onClick={() => void openStudent(row)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50">{openingStudent === row.student_id ? 'Loading…' : 'View history'}</button></td></tr>)}</tbody></table></div>}

    {detail && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDetail(null); }}><section role="dialog" aria-modal="true" className="max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-t-2xl bg-slate-50 p-4 shadow-2xl sm:rounded-2xl sm:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3"><button onClick={() => setDetail(null)} aria-label="Close student history" className="rounded-md border border-slate-200 bg-white p-2 text-slate-600"><ArrowLeft className="h-4 w-4" /></button>{detail.student.profile_picture ? <img src={detail.student.profile_picture} alt="" className="h-12 w-12 rounded-full object-cover" /> : <span className="grid h-12 w-12 place-items-center rounded-full bg-blue-100 text-blue-700"><UserRound className="h-5 w-5" /></span>}<div><h3 className="text-xl font-bold text-slate-900">{detail.student.name}</h3><p className="text-sm text-slate-500">{detail.student.email}{detail.student.phone ? ` · ${detail.student.phone}` : ''} · ID {detail.student.id}</p></div></div><select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm">{['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'].map((value) => <option key={value} value={value}>{value === 'all' ? 'All statuses' : value[0].toUpperCase() + value.slice(1)}</option>)}</select></header>
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">{statCards.map(([key, label, tone]) => <div key={key} className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-xs text-slate-500">{label}</p><p className={'mt-1 inline-flex rounded px-2 py-0.5 text-lg font-bold ' + tone}>{detail.stats[key]}</p></div>)}</div>
      <div className="space-y-3">{filteredHistory.map((row: any) => <article key={row.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-2"><div><h4 className="font-semibold text-slate-900">{row.interviewer.name} <span className="font-normal text-slate-500">· {row.interviewer.expertise || 'Interviewer'}</span></h4><p className="mt-1 text-sm text-slate-600">Requested {dateText(row.requested_at)}{row.start_at && ` · Interview ${dateText(row.start_at, row.timezone)} (${row.duration_minutes} min)`}</p>{row.confirmed_at && <p className="text-xs text-slate-500">Confirmed {dateText(row.confirmed_at)}</p>}{row.completed_at && <p className="text-xs text-slate-500">Completed {dateText(row.completed_at)}</p>}</div><span className={'rounded-full px-2.5 py-1 text-xs font-semibold capitalize ' + statusTone(row.status)}>{row.status}</span></div>
        {row.meet_link && row.status === 'confirmed' && <a href={row.meet_link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-semibold text-blue-700 underline">Open Meet link</a>}{row.outcome && <p className="mt-2 text-sm"><b>Outcome:</b> {row.outcome}</p>}{row.feedback && <p className="mt-1 text-sm text-slate-600"><b>Feedback:</b> {row.feedback}</p>}{row.admin_notes && <p className="mt-1 rounded-md bg-blue-50 p-2 text-sm text-slate-700"><b>Admin notes:</b> {row.admin_notes}</p>}{row.cancellation_reason && <p className="mt-1 text-sm text-slate-600"><b>Cancellation reason:</b> {row.cancellation_reason}</p>}{row.rejection_reason && <p className="mt-1 text-sm text-slate-600"><b>Rejection reason:</b> {row.rejection_reason}</p>}
        <div className="mt-3 flex flex-wrap gap-2">{row.history?.map((event: any) => <span key={event.id} title={event.note || event.action} className="rounded-md bg-slate-50 px-2 py-1 text-xs text-slate-600">{event.action.replaceAll('_', ' ')} · {dateText(event.created_at)}</span>)}</div>
      </article>)}{!filteredHistory.length && <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No interviews with this status.</div>}</div>
    </section></div>}
  </section>;
}
