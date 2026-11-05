'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
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
  const [rejectTarget, setRejectTarget] = useState<InterviewRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectError, setRejectError] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const load = async () => {
    try {
      const next = await api.get<InterviewRequest[]>('/admin/interview-bookings');
      setRequests(next);
      const liveIds = new Set(next.map((request) => request.id));
      setSlots((previous) => Object.fromEntries(Object.entries(previous).filter(([id]) => liveIds.has(id))));
      setAvailability((previous) => Object.fromEntries(Object.entries(previous).filter(([id]) => liveIds.has(id))));
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
      await load();
    } finally {
      setWorking(null);
    }
  };

  const reconnectCalendar = async (request: InterviewRequest) => {
    setWorking(request.id);
    setMessage('');
    try {
      const result = await api.post<{ authorization_url: string }>(`/admin/interviewers/${request.interviewer.id}/connect`);
      window.location.assign(result.authorization_url);
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not start Google Calendar reconnection.');
      setWorking(null);
    }
  };

  const openRejectDialog = (request: InterviewRequest) => {
    setRejectTarget(request);
    setRejectReason('');
    setRejectError('');
  };

  const closeRejectDialog = () => {
    if (rejecting) return;
    setRejectTarget(null);
    setRejectReason('');
    setRejectError('');
  };

  const submitReject = async () => {
    if (!rejectTarget) return;
    const reason = rejectReason.trim();
    if (!reason) {
      setRejectError('Please enter a rejection reason for the student.');
      return;
    }
    setRejecting(true);
    setRejectError('');
    setWorking(rejectTarget.id);
    setMessage('');
    try {
      await api.post(`/admin/interview-bookings/${rejectTarget.id}/reject`, { reason });
      setMessage(`Request from ${rejectTarget.student.name} rejected.`);
      setRejectTarget(null);
      setRejectReason('');
      await load();
      onUpdated?.();
    } catch (error: any) {
      setRejectError(error?.response?.data?.detail || 'Could not reject this interview request.');
    } finally {
      setRejecting(false);
      setWorking(null);
    }
  };

  return <section className="w-full min-w-0 space-y-4">
    <div className="min-w-0">
      <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Interview Requests</h2>
      <p className="mt-1 text-sm text-slate-500">Review student requests, check calendar availability, then confirm or reject.</p>
    </div>
    {message && <p role="status" className="rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</p>}
    {loading ? <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">Loading interview requests…</div> : !requests.length ? <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">No pending interview requests.</div> :
      <div className="space-y-3">{requests.map((request) => {
        const state = availability[request.id] || 'unchecked';
        const calendarStatus = request.interviewer.calendar_status || 'not_connected';
        const connected = calendarStatus === 'connected';
        const calendarReady = connected || calendarStatus === 'needs_attention';
        const disabled = working === request.id;
        const needsReconnect = calendarStatus === 'needs_attention' || calendarStatus === 'authorization_expired' || calendarStatus === 'not_connected';
        const calendarNote = calendarStatus === 'connected'
          ? 'Google Calendar connected'
          : calendarStatus === 'needs_attention'
            ? 'Google Calendar permissions are incomplete; reconnect and approve Calendar access'
            : calendarStatus === 'authorization_expired'
              ? 'Google Calendar authorization expired; reconnect before confirming'
              : 'Google Calendar is not connected; confirmation is unavailable';
        return <article key={request.id} className="grid min-w-0 gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-800">{request.status}</span><time className="text-xs text-slate-500">Requested {request.requested_at ? new Date(request.requested_at).toLocaleString() : '—'}</time></div>
            <h3 className="break-words text-base font-semibold text-slate-900">{request.student.name}</h3>
            <p className="break-all text-sm text-slate-600">{request.student.email}</p>
            <div className="border-t border-slate-100 pt-2 text-sm"><span className="font-medium text-slate-700">Selected interviewer: </span><span className="break-words">{request.interviewer.name}{request.interviewer.email ? ` · ${request.interviewer.email}` : ''}</span></div>
            <p className={'text-xs ' + (connected ? 'text-emerald-700' : 'text-rose-700')}>{calendarNote}</p>
            {needsReconnect && <button type="button" disabled={disabled} onClick={() => void reconnectCalendar(request)} className="inline-flex rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100 disabled:opacity-50">Reconnect Google Calendar</button>}
          </div>
          <div className="min-w-0 space-y-2 rounded-md bg-slate-50 p-3">
            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">Choose interview date and time (60 minutes · {request.interviewer.timezone || 'interviewer local time'})</span>
              <InterviewDateTimePicker value={slots[request.id] || ''} min={localDateTime(new Date(Date.now() + 60_000), request.interviewer.timezone || 'Asia/Kolkata')} onChange={(value) => { setSlots((previous) => ({ ...previous, [request.id]: value })); setAvailability((previous) => ({ ...previous, [request.id]: 'unchecked' })); }} />
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <button type="button" disabled={!calendarReady || !slots[request.id] || slots[request.id]?.startsWith('T') || disabled} onClick={() => void checkAvailability(request)} className="w-full rounded-md border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{state === 'checking' ? 'Checking…' : 'Check availability'}</button>
              <button type="button" disabled={state !== 'available' || disabled} onClick={() => void confirm(request)} className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto">{disabled && state === 'available' ? 'Confirming…' : 'Confirm interview'}</button>
              <button type="button" disabled={disabled} onClick={() => openRejectDialog(request)} className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-sm font-semibold text-rose-700 disabled:opacity-50 sm:w-auto">Reject</button>
            </div>
            {state === 'available' && <p className="text-sm font-medium text-emerald-700">This slot is available. Confirmation checks availability again.</p>}
            {state === 'busy' && <p className="text-sm font-medium text-rose-700">This slot conflicts with the interviewer’s calendar.</p>}
            {state === 'error' && <p className="text-sm font-medium text-rose-700">Availability could not be verified; confirmation is disabled.</p>}
          </div>
        </article>;
      })}</div>}

    {rejectTarget && (
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-label="Close reject dialog"
          onClick={closeRejectDialog}
          disabled={rejecting}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reject-interview-title"
          className="relative mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-rose-50 p-2 text-rose-600">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h3 id="reject-interview-title" className="text-lg font-semibold text-slate-900">
                Reject Interview Request?
              </h3>
            </div>
            <button
              type="button"
              onClick={closeRejectDialog}
              disabled={rejecting}
              className="rounded-lg p-1 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3 px-5 py-4">
            <p className="text-sm leading-relaxed text-slate-600">
              Are you sure you want to reject the request from{' '}
              <span className="font-semibold text-slate-900">{rejectTarget.student.name}</span>?
              Enter the reason so the student can see why it was rejected.
            </p>
            <label className="block text-sm font-medium text-slate-700">
              Rejection reason <span className="text-rose-600">*</span>
              <textarea
                value={rejectReason}
                onChange={(event) => {
                  setRejectReason(event.target.value);
                  if (rejectError) setRejectError('');
                }}
                rows={4}
                maxLength={1000}
                placeholder="Explain why this interview request is being rejected…"
                className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-100"
                disabled={rejecting}
                autoFocus
              />
            </label>
            {rejectError && <p role="alert" className="text-sm text-rose-700">{rejectError}</p>}
          </div>
          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
            <Button variant="secondary" onClick={closeRejectDialog} disabled={rejecting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void submitReject()} disabled={rejecting}>
              {rejecting ? 'Rejecting…' : 'Confirm Reject'}
            </Button>
          </div>
        </div>
      </div>
    )}
  </section>;
}
