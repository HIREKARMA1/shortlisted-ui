'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { InterviewDateTimePicker } from './InterviewDateTimePicker';

type InterviewRequest = {
  id: string;
  status: string;
  requested_at: string | null;
  start_at: string | null;
  end_at: string | null;
  notification_warning?: string;
  interviewer: { id: string; name: string; email?: string; timezone?: string; calendar_status?: string };
  student: { name: string; email: string };
};
type Availability = 'unchecked' | 'checking' | 'available' | 'busy' | 'error';

const localDateTime = (date: Date, timezone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
};
const addLocalMinutes = (value: string, minutes: number) => {
  const [date, time] = value.split('T');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const total = hour * 60 + minute + minutes;
  const next = new Date(Date.UTC(year, month - 1, day, Math.floor(total / 60), total % 60));
  const pad = (number: number) => String(number).padStart(2, '0');
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}T${pad(next.getUTCHours())}:${pad(next.getUTCMinutes())}`;
};

export function InterviewBookingRequests({ onUpdated }: { onUpdated?: () => void }) {
  const [requests, setRequests] = useState<InterviewRequest[]>([]);
  const [slots, setSlots] = useState<Record<string, string>>({});
  const [availability, setAvailability] = useState<Record<string, Availability>>({});
  const [working, setWorking] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setRequests(await api.get<InterviewRequest[]>('/admin/interview-bookings'));
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not load pending interview requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const checkAvailability = async (request: InterviewRequest) => {
    const value = slots[request.id];
    if (!value || value.startsWith('T')) return;
    setWorking(request.id);
    setMessage('');
    setAvailability((previous) => ({ ...previous, [request.id]: 'checking' }));
    try {
      const end = addLocalMinutes(value, 60);
      const result = await api.get<{ available: boolean }>(
        `/admin/interviewers/${request.interviewer.id}/availability?start=${encodeURIComponent(value)}&end=${encodeURIComponent(end)}`,
      );
      setAvailability((previous) => ({ ...previous, [request.id]: result.available ? 'available' : 'busy' }));
    } catch (error: any) {
      setAvailability((previous) => ({ ...previous, [request.id]: 'error' }));
      setMessage(error?.response?.data?.detail || 'Could not check this interviewer’s calendar.');
    } finally {
      setWorking(null);
    }
  };

  const confirm = async (request: InterviewRequest) => {
    const start = slots[request.id];
    if (!start || start.startsWith('T') || availability[request.id] !== 'available') return;
    setWorking(request.id);
    setMessage('');
    try {
      const confirmed = await api.post<InterviewRequest>(`/admin/interview-bookings/${request.id}/confirm`, { start_at: start });
      await load();
      setMessage(confirmed.notification_warning || `Interview with ${request.student.name} confirmed.`);
      onUpdated?.();
    } catch (error: any) {
      setAvailability((previous) => ({ ...previous, [request.id]: 'unchecked' }));
      setMessage(error?.response?.data?.detail || 'Could not confirm the interview. Refresh availability and try again.');
    } finally {
      setWorking(null);
    }
  };

  const reject = async (request: InterviewRequest) => {
    const reason = window.prompt(`Optional rejection reason for ${request.student.name}:`);
    if (reason === null) return;
    setWorking(request.id);
    setMessage('');
    try {
      await api.post(`/admin/interview-bookings/${request.id}/reject`, { reason: reason.trim() || null });
      await load();
      setMessage(`Request from ${request.student.name} rejected.`);
      onUpdated?.();
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not reject this interview request.');
    } finally {
      setWorking(null);
    }
  };

  return <section className="mx-auto w-full space-y-4 px-4 pb-8 sm:px-6" style={{ maxWidth: '1480px' }}>
    <div className="flex items-end justify-between gap-3">
      <div><h2 className="text-2xl font-bold text-slate-900">Interview Requests</h2><p className="mt-1 text-sm text-slate-500">Review student requests, check calendar availability, then confirm or reject.</p></div>
      <button type="button" onClick={() => void load()} className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Refresh</button>
    </div>
    {message && <p role="status" className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>}
    {loading ? <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading interview requests…</div> : !requests.length ? <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No pending interview requests.</div> :
      <div className="space-y-3">{requests.map((request) => {
        const state = availability[request.id] || 'unchecked';
        const connected = request.interviewer.calendar_status === 'connected';
        const disabled = working === request.id;
        return <article key={request.id} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-800">{request.status}</span><time className="text-xs text-slate-500">Requested {request.requested_at ? new Date(request.requested_at).toLocaleString() : '—'}</time></div>
            <h3 className="text-base font-semibold text-slate-900">{request.student.name}</h3>
            <p className="text-sm text-slate-600">{request.student.email}</p>
            <div className="border-t border-slate-100 pt-2 text-sm"><span className="font-medium text-slate-700">Selected interviewer: </span>{request.interviewer.name}{request.interviewer.email ? ` · ${request.interviewer.email}` : ''}</div>
            <p className={'text-xs ' + (connected ? 'text-emerald-700' : 'text-rose-700')}>{connected ? 'Google Calendar connected' : 'Google Calendar is not connected; confirmation is unavailable'}</p>
          </div>
          <div className="space-y-2 rounded-md bg-slate-50 p-3">
            <label className="block text-sm font-medium text-slate-700">Choose interview date and time (60 minutes · {request.interviewer.timezone || 'interviewer local time'})
              <InterviewDateTimePicker value={slots[request.id] || ''} min={localDateTime(new Date(Date.now() + 60_000), request.interviewer.timezone || 'Asia/Kolkata')} onChange={(value) => { setSlots((previous) => ({ ...previous, [request.id]: value })); setAvailability((previous) => ({ ...previous, [request.id]: 'unchecked' })); }} />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" disabled={!connected || !slots[request.id] || slots[request.id]?.startsWith('T') || disabled} onClick={() => void checkAvailability(request)} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{state === 'checking' ? 'Checking…' : 'Check availability'}</button>
              <button type="button" disabled={state !== 'available' || disabled} onClick={() => void confirm(request)} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{disabled && state === 'available' ? 'Confirming…' : 'Confirm interview'}</button>
              <button type="button" disabled={disabled} onClick={() => void reject(request)} className="rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50">Reject</button>
            </div>
            {state === 'available' && <p className="text-sm font-medium text-emerald-700">This slot is available. Confirmation checks availability again.</p>}
            {state === 'busy' && <p className="text-sm font-medium text-rose-700">This slot conflicts with the interviewer’s calendar.</p>}
            {state === 'error' && <p className="text-sm font-medium text-rose-700">Availability could not be verified; confirmation is disabled.</p>}
          </div>
        </article>;
      })}</div>}
  </section>;
}
