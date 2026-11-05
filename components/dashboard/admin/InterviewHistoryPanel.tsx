'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Check, Clock3, Search, X } from 'lucide-react';
import { api } from '@/lib/api';
import { InterviewDateTimePicker } from './InterviewDateTimePicker';

type AuditEvent = { id: string; action: string; from_status?: string | null; to_status?: string | null; note?: string | null; old_start_at?: string | null; new_start_at?: string | null; created_at?: string | null; actor_type: string };
type RecordRow = { id: string; interviewer_id: string; status: string; requested_at: string | null; start_at: string | null; end_at: string | null; timezone: string; duration_minutes: number; meet_link?: string | null; cancellation_reason?: string | null; rejection_reason?: string | null; outcome?: string | null; feedback?: string | null; admin_notes?: string | null; history?: AuditEvent[]; student: { id: string; name: string; email: string }; interviewer: { name: string; expertise?: string } };
const states = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected', 'cancelled_rejected'];
const dateText = (value?: string | null, timezone?: string) => value ? new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: timezone || 'Asia/Kolkata' }) : 'Not scheduled';
const badge = (status: string) => status === 'completed' ? 'bg-emerald-50 text-emerald-700' : status === 'confirmed' ? 'bg-blue-50 text-blue-700' : status === 'pending' ? 'bg-amber-50 text-amber-800' : status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-slate-100 text-slate-600';
const localInputInZone = (date: Date, timezone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
};
const addLocalMinutes = (value: string, minutes: number) => {
  const [date, time] = value.split('T'); const [year, month, day] = date.split('-').map(Number); const [hour, minute] = time.split(':').map(Number);
  const next = new Date(Date.UTC(year, month - 1, day, hour, minute + minutes)); const pad = (number: number) => String(number).padStart(2, '0');
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}T${pad(next.getUTCHours())}:${pad(next.getUTCMinutes())}`;
};

export function InterviewHistoryPanel({ onUpdated, initialFilter = 'all' }: { onUpdated?: () => void; initialFilter?: string }) {
  const [rows, setRows] = useState<RecordRow[]>([]);
  const [filter, setFilter] = useState(initialFilter);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<RecordRow | null>(null);
  const [slot, setSlot] = useState('');
  const [available, setAvailable] = useState(false);
  const [outcome, setOutcome] = useState('');
  const [feedback, setFeedback] = useState('');
  const [notes, setNotes] = useState('');
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const query = new URLSearchParams({ status: filter });
      if (search.trim()) query.set('search', search.trim());
      setRows(await api.get<RecordRow[]>(`/admin/interview-history?${query.toString()}`));
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not load interview history.');
    } finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, [filter, search]);
  useEffect(() => { setFilter(initialFilter); }, [initialFilter]);
  useEffect(() => {
    if (!selected) return;
    setNotes(selected.admin_notes || '');
    setOutcome(selected.outcome || '');
    setFeedback(selected.feedback || '');
    setSlot('');
    setAvailable(false);
  }, [selected?.id]);

  const visible = useMemo(() => rows, [rows]);
  const checkSlot = async () => {
    if (!selected || !slot || slot.startsWith('T')) return;
    setWorking(true); setAvailable(false); setMessage('');
    try {
      const end = addLocalMinutes(slot, selected.duration_minutes || 60);
      const result = await api.get<{ available: boolean }>(`/admin/interviewers/${selected.interviewer_id}/availability?start=${encodeURIComponent(slot)}&end=${encodeURIComponent(end)}`);
      setAvailable(result.available);
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not check calendar availability.');
    } finally { setWorking(false); }
  };

  const reschedule = async () => {
    if (!selected || !slot || slot.startsWith('T') || !available) return;
    setWorking(true); setMessage('');
    try {
      const result = await api.post<RecordRow>(`/admin/interview-bookings/${selected.id}/reschedule`, { start_at: slot });
      setSelected(result); await load(); setMessage('Interview rescheduled and calendar updates sent.');
      onUpdated?.();
    } catch (error: any) { setAvailable(false); setMessage(error?.response?.data?.detail || 'Could not reschedule; check availability and retry.'); }
    finally { setWorking(false); }
  };

  const complete = async () => {
    if (!selected || working) return;
    setWorking(true); setMessage('');
    try {
      const result = await api.post<RecordRow>(`/admin/interview-bookings/${selected.id}/complete`, { outcome, feedback, admin_notes: notes });
      setSelected(result); await load();
      setMessage(`Interview with ${selected.student.name} marked as completed.`);
      onUpdated?.();
    } catch (error: any) { setMessage(error?.response?.data?.detail || 'Could not complete this interview.'); }
    finally { setWorking(false); }
  };

  const saveNotes = async () => {
    if (!selected) return;
    setWorking(true);
    try {
      const result = await api.client.patch(`/admin/interview-bookings/${selected.id}/notes`, { admin_notes: notes });
      setSelected(result.data); await load(); setMessage('Admin notes saved.');
      onUpdated?.();
    } catch (error: any) { setMessage(error?.response?.data?.detail || 'Could not save admin notes.'); }
    finally { setWorking(false); }
  };

  return <section className="min-w-0 space-y-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between"><div className="min-w-0"><h2 className="text-xl font-bold text-slate-900">Interview History</h2><p className="mt-1 text-sm text-slate-500">Search every request and interview, including status changes and scheduling actions.</p></div>
      <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap"><label className="relative min-w-0 sm:w-56"><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Student or interviewer" className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm" /></label><select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm sm:w-auto">{states.map((state) => <option key={state} value={state}>{state === 'all' ? 'All statuses' : state === 'cancelled_rejected' ? 'Cancelled / Rejected' : state[0].toUpperCase() + state.slice(1)}</option>)}</select></div>
    </div>
    {message && <p role="status" className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>}
    {loading ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading interview history…</div> : !visible.length ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No interview history matches these filters.</div> : <>
      <div className="space-y-3 md:hidden">{visible.map((row) => <article key={row.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="font-semibold text-slate-800">{row.student.name}</h3><p className="truncate text-xs text-slate-500">{row.student.email}</p></div><span className={'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ' + badge(row.status)}>{row.status}</span></div>
        <dl className="mt-3 space-y-1.5 text-sm"><div className="flex justify-between gap-2"><dt className="text-slate-500">Interviewer</dt><dd className="text-right font-medium text-slate-700">{row.interviewer.name}</dd></div><div className="flex justify-between gap-2"><dt className="text-slate-500">Requested</dt><dd className="text-right text-slate-600">{dateText(row.requested_at)}</dd></div><div className="flex justify-between gap-2"><dt className="text-slate-500">Interview</dt><dd className="text-right text-slate-600">{dateText(row.start_at, row.timezone)}</dd></div>{row.outcome && <div className="flex justify-between gap-2"><dt className="text-slate-500">Outcome</dt><dd className="text-right text-slate-700">{row.outcome}</dd></div>}</dl>
        <button onClick={() => setSelected(row)} className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50">Details</button>
      </article>)}</div>
      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr>{['Student', 'Interviewer', 'Requested', 'Interview time', 'Status', 'Outcome', ''].map((label) => <th key={label || 'actions'} className="px-4 py-3 font-semibold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{visible.map((row) => <tr key={row.id} className="hover:bg-slate-50"><td className="px-4 py-3"><span className="block font-semibold text-slate-800">{row.student.name}</span><span className="text-xs text-slate-500">{row.student.email}</span></td><td className="px-4 py-3"><span className="block font-medium">{row.interviewer.name}</span><span className="text-xs text-slate-500">{row.interviewer.expertise || 'Interviewer'}</span></td><td className="px-4 py-3 text-slate-600">{dateText(row.requested_at)}</td><td className="px-4 py-3 text-slate-600">{dateText(row.start_at, row.timezone)}</td><td className="px-4 py-3"><span className={'rounded-full px-2.5 py-1 text-xs font-semibold capitalize ' + badge(row.status)}>{row.status}</span></td><td className="px-4 py-3">{row.outcome || '—'}</td><td className="px-4 py-3"><button onClick={() => setSelected(row)} className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50">Details</button></td></tr>)}</tbody></table></div>
      </div>
    </>}

    {selected && <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <section role="dialog" aria-modal="true" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl sm:rounded-2xl sm:p-5">
        <header className="mb-4 flex items-start justify-between gap-3"><div className="min-w-0"><span className={'rounded-full px-2.5 py-1 text-xs font-semibold capitalize ' + badge(selected.status)}>{selected.status}</span><h3 className="mt-2 break-words text-lg font-bold text-slate-900 sm:text-xl">{selected.student.name} · {selected.interviewer.name}</h3><p className="mt-1 text-sm text-slate-500">Requested {dateText(selected.requested_at)} · {dateText(selected.start_at, selected.timezone)}</p></div><button aria-label="Close" onClick={() => setSelected(null)} className="shrink-0 rounded-md p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button></header>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="min-w-0 space-y-3"><h4 className="font-semibold text-slate-800">Audit history</h4>{selected.history?.length ? <ol className="space-y-3 border-l border-slate-200 pl-4">{selected.history.map((event) => <li key={event.id} className="relative"><span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-blue-500 ring-4 ring-white" /><p className="text-sm font-semibold capitalize text-slate-800">{event.action.replaceAll('_', ' ')}</p><p className="text-xs text-slate-500">{dateText(event.created_at)} · {event.actor_type}</p>{event.note && <p className="mt-1 text-sm text-slate-600">{event.note}</p>}{event.old_start_at && <p className="text-xs text-slate-500">{dateText(event.old_start_at)} → {dateText(event.new_start_at)}</p>}</li>)}</ol> : <p className="text-sm text-slate-500">No recorded actions.</p>}
            {selected.meet_link && <a href={selected.meet_link} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-700 underline">Open Google Meet</a>}
            {selected.cancellation_reason && <p className="rounded-md bg-slate-50 p-2 text-sm"><b>Cancellation reason:</b> {selected.cancellation_reason}</p>}{selected.rejection_reason && <p className="rounded-md bg-rose-50 p-2 text-sm"><b>Rejection reason:</b> {selected.rejection_reason}</p>}
          </div>
          <div className="min-w-0 space-y-3">
            {selected.status === 'confirmed' && <div className="space-y-2 rounded-lg border border-slate-200 p-3"><h4 className="flex items-center gap-2 font-semibold"><CalendarClock className="h-4 w-4 text-blue-600" />Reschedule</h4><p className="text-xs text-slate-500">Times are entered in {selected.timezone}.</p><InterviewDateTimePicker value={slot} min={localInputInZone(new Date(Date.now() + 60_000), selected.timezone)} onChange={(value) => { setSlot(value); setAvailable(false); }} /><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"><button onClick={() => void checkSlot()} disabled={!slot || slot.startsWith('T') || working} className="w-full rounded-md border border-blue-200 px-3 py-2 text-sm text-blue-700 disabled:opacity-50 sm:w-auto">Check availability</button><button onClick={() => void reschedule()} disabled={!available || working} className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto">Save new time</button></div>{available && <p className="text-xs text-emerald-700">Slot is available; server will verify again before updating Calendar.</p>}</div>}
            {selected.status === 'confirmed' && (
              <div className="space-y-2 rounded-lg border border-slate-200 p-3">
                <h4 className="flex items-center gap-2 font-semibold">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Complete interview
                </h4>
                <p className="text-xs text-slate-500">
                  You can mark this completed at any time — for example if the student did not join or the interview ended early.
                </p>
                <input
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="Outcome (optional)"
                  className="h-9 w-full rounded-md border border-slate-200 px-3 text-sm"
                />
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Student feedback or interviewer feedback"
                  rows={2}
                  className="w-full rounded-md border border-slate-200 p-2 text-sm"
                />
                <button
                  onClick={() => void complete()}
                  disabled={working}
                  className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50 sm:w-auto"
                >
                  <Clock3 className="mr-1 inline h-4 w-4" />
                  Mark completed
                </button>
              </div>
            )}
            <div className="space-y-2 rounded-lg border border-slate-200 p-3"><h4 className="font-semibold">Admin notes</h4><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full rounded-md border border-slate-200 p-2 text-sm" placeholder="Private notes for admins"/><button onClick={() => void saveNotes()} disabled={working} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50 sm:w-auto">Save notes</button></div>
          </div>
        </div>
      </section>
    </div>}
  </section>;
}
