'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowRight, CalendarDays, Info, Lock, Search, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

type Person = { id: string; name: string; email?: string; profile_details?: string; calendar_status: string; profile_photo_url?: string; expertise?: string };
type Booking = {
  id: string;
  interviewer: Person;
  start_at: string | null;
  end_at: string | null;
  status: string;
  meet_link?: string | null;
  requested_at?: string | null;
  completed_at?: string | null;
  outcome?: string | null;
  rejection_reason?: string | null;
  cancellation_reason?: string | null;
  timezone?: string;
  notification_warning?: string;
};

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const errorText = (error: unknown, fallback: string) => {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } })?.response;
  const detail = response?.data?.detail;
  if (typeof detail === 'string') return detail;
  return error instanceof Error ? error.message : fallback;
};
const statusLabel = (status: string) => {
  switch (String(status || '').toLowerCase()) {
    case 'completed':
      return 'Completed';
    case 'confirmed':
      return 'Confirmed';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};
const statusStyle = (status: string) => {
  switch (String(status || '').toLowerCase()) {
    case 'completed':
      return 'bg-emerald-50 text-emerald-700';
    case 'confirmed':
      return 'bg-blue-50 text-blue-700';
    case 'pending':
      return 'bg-amber-50 text-amber-800';
    case 'rejected':
      return 'bg-rose-50 text-rose-700';
    case 'cancelled':
      return 'bg-slate-100 text-slate-600';
    default:
      return 'bg-amber-50 text-amber-800';
  }
};
const MAX_REAL_INTERVIEWS = 5;
const LOCKED_MESSAGE = 'Upgrade your plan to unlock Real Interviews.';

function Avatar({ person, size = 'md' }: { person: Person; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-sm sm:h-14 sm:w-14 sm:text-base';
  return (
    <span className={'grid shrink-0 place-items-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-700 ' + sizeClass}>
      {person.profile_photo_url ? <img src={person.profile_photo_url} alt="" className="h-full w-full object-cover" /> : initials(person.name)}
    </span>
  );
}

function RealInterviewLocked() {
  return (
    <div className="mx-auto w-full max-w-2xl py-6 sm:py-10">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Real Interviews</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">Real Interviews are locked</h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">{LOCKED_MESSAGE}</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          <li>Your free trial features stay available while Real Interviews remain locked.</li>
          <li>After your payment is verified, this section unlocks automatically.</li>
          <li>Then you can choose interviewers and request real interview schedules.</li>
        </ul>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Upgrade your plan
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
          <p className="text-xs text-slate-500 sm:ml-2">Pending or failed payments keep Real Interviews locked.</p>
        </div>
      </div>
    </div>
  );
}

export function StudentInterviews() {
  const { logout } = useAuth();
  const [people, setPeople] = useState<Person[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  const load = async () => {
    try {
      const dashboard = await api.getDashboard();
      const student = dashboard.student as { access_status?: string; plan?: string } | undefined;
      const status = String(student?.access_status || '');
      const plan = String(student?.plan || '');
      const hasAccess = status === 'active' || plan === 'premium';
      localStorage.setItem('access_status', status);
      setUnlocked(hasAccess);
      if (!hasAccess) {
        setPeople([]);
        setBookings([]);
        return;
      }

      const [interviewers, requests] = await Promise.all([
        api.get<Person[]>('/interviewers'),
        api.get<Booking[]>('/interviews/bookings'),
      ]);
      setPeople(interviewers);
      setBookings(requests);
      setSelected((current) => current || interviewers[0]?.id || '');
    } catch (error) {
      const response = (error as { response?: { status?: number; data?: { detail?: unknown } } })?.response;
      if (response?.status === 403) {
        setUnlocked(false);
        setPeople([]);
        setBookings([]);
        setMessage(typeof response.data?.detail === 'string' ? response.data.detail : LOCKED_MESSAGE);
        return;
      }
      setMessage(errorText(error, 'Could not load interviews.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => people.filter((person) =>
    `${person.name} ${person.profile_details || ''} ${person.expertise || ''}`.toLowerCase().includes(query.toLowerCase()),
  ), [people, query]);
  const selectedPerson = people.find((person) => person.id === selected);
  const usedInterviews = bookings.filter((booking) => ['pending', 'confirmed', 'completed'].includes(booking.status)).length;
  const hasInterviewCapacity = usedInterviews < MAX_REAL_INTERVIEWS;

  const submitRequest = async () => {
    if (!selectedPerson || working || !unlocked) return;
    setWorking(true);
    setMessage('');
    try {
      await api.client.post<Booking>('/interviews/bookings', { interviewer_id: selectedPerson.id }, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
      });
      setMessage(`Your interview request for ${selectedPerson.name} was sent. It will remain pending until an admin schedules it.`);
      await load();
    } catch (error) {
      const response = (error as { response?: { status?: number; data?: { detail?: unknown } } })?.response;
      if (response?.status === 403) {
        setUnlocked(false);
        setMessage(typeof response.data?.detail === 'string' ? response.data.detail : LOCKED_MESSAGE);
        return;
      }
      setMessage(errorText(error, 'Could not submit your interview request.'));
    } finally {
      setWorking(false);
    }
  };

  const cancelRequest = async (booking: Booking) => {
    if (!window.confirm(booking.status === 'pending' ? 'Cancel this interview request?' : 'Cancel this confirmed interview?')) return;
    const reason = window.prompt('Reason for cancellation (optional):');
    if (reason === null) return;
    try {
      const result = await api.post<Booking>(`/interviews/bookings/${booking.id}/cancel`, { reason: reason.trim() || null });
      setMessage(result.notification_warning || (booking.status === 'pending' ? 'Interview request cancelled.' : 'Interview cancelled.'));
      await load();
    } catch (error) {
      setMessage(errorText(error, 'Could not cancel this interview request.'));
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="student" title="" wideContent onLogout={logout}>
        <div className="py-8 text-sm text-slate-500 sm:text-base">Loading interviewers and requests…</div>
      </DashboardLayout>
    );
  }

  if (!unlocked) {
    return (
      <DashboardLayout role="student" title="" wideContent onLogout={logout}>
        <RealInterviewLocked />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student" title="" wideContent onLogout={logout}>
      <div className="w-full min-w-0 py-4 text-slate-800 sm:py-6">
        <div className="mb-5 flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">Request an Interview</h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Choose an interviewer and send a request. An admin will schedule the date and time.
            </p>
          </div>
          <label className="relative block w-full shrink-0 lg:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for interviewers…"
              className="h-10 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400 sm:h-9 sm:text-base"
            />
          </label>
        </div>

        {message && (
          <div role="status" className="mb-4 flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-800 sm:items-center sm:text-base">
            <Info className="mt-0.5 h-4 w-4 shrink-0 sm:mt-0" />
            <span className="min-w-0 flex-1 break-words">{message}</span>
            <button type="button" onClick={() => setMessage('')} className="shrink-0 rounded p-1 leading-none hover:bg-blue-100" aria-label="Dismiss">
              ×
            </button>
          </div>
        )}

        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_min(100%,340px)]">
          <section className="min-w-0 space-y-3">
            {!filtered.length ? (
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500 sm:p-6 sm:text-base">
                No interviewers match your search.
              </div>
            ) : (
              filtered.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setSelected(person.id)}
                  className={
                    'flex w-full min-w-0 flex-col gap-3 rounded-lg border bg-white p-3 text-left shadow-sm transition hover:border-blue-300 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:p-4 ' +
                    (selected === person.id ? 'border-blue-500 ring-1 ring-blue-200' : 'border-slate-200')
                  }
                >
                  <span className="flex min-w-0 items-start gap-3 sm:items-center">
                    <Avatar person={person} />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-900 sm:text-base">{person.name}</span>
                      <span className="block truncate text-xs text-slate-600 sm:text-sm">{person.expertise || person.profile_details || 'Interviewer'}</span>
                      {person.profile_details && person.expertise ? (
                        <span className="mt-1 block line-clamp-2 text-xs text-slate-500">{person.profile_details}</span>
                      ) : null}
                      <span className={'mt-1 block text-xs ' + (person.calendar_status === 'connected' ? 'text-emerald-700' : 'text-slate-500')}>
                        {person.calendar_status === 'connected' ? 'Google Calendar connected' : 'Calendar will be checked by the admin'}
                      </span>
                    </span>
                  </span>
                  <span
                    className={
                      'inline-flex w-full shrink-0 items-center justify-center rounded px-3 py-2 text-sm font-semibold sm:w-auto sm:py-1.5 ' +
                      (selected === person.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600')
                    }
                  >
                    {selected === person.id ? 'Selected' : 'Select'}
                  </span>
                </button>
              ))
            )}
          </section>

          <aside className="order-first min-w-0 rounded-lg border border-blue-200 bg-white p-3 shadow-sm sm:p-4 xl:order-none xl:sticky xl:top-4">
            <h2 className="text-sm font-semibold sm:text-base">Request Summary</h2>
            {selectedPerson ? (
              <>
                <div className="my-3 flex min-w-0 items-center gap-3 sm:my-4">
                  <Avatar person={selectedPerson} />
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{selectedPerson.name}</p>
                    <p className="truncate text-sm text-slate-500">{selectedPerson.expertise || selectedPerson.profile_details || 'Interviewer'}</p>
                  </div>
                </div>
                <hr className="my-3" />
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <p className="flex items-start gap-2 text-sm">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span className="min-w-0">
                      <b>Schedule</b>
                      <br />
                      <span className="text-slate-500">Admin selects an available date and time</span>
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-sm">
                    <Video className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                    <span className="min-w-0">
                      <b>Google Meet</b>
                      <br />
                      <span className="text-slate-500">Link provided after confirmation</span>
                    </span>
                  </p>
                </div>
                <p className="mt-4 text-sm text-slate-600">Real interviews used: {usedInterviews} of {MAX_REAL_INTERVIEWS}</p>
                {!hasInterviewCapacity && (
                  <p className="mt-2 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                    You have reached the maximum of 5 real interviews.
                  </p>
                )}
                <button
                  disabled={!selectedPerson || working || !hasInterviewCapacity}
                  onClick={() => void submitRequest()}
                  className="mt-3 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {working ? 'Sending request…' : 'Request Interview'}
                </button>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Select an interviewer to continue.</p>
            )}
          </aside>
        </div>

        <section className="mt-6 min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-3 py-3 sm:px-4">
            <h2 className="text-sm font-semibold sm:text-base">My Interview History</h2>
            <p className="text-xs text-slate-500 sm:text-sm">Track requests, confirmed meetings, and completed interviews.</p>
          </div>
          {!bookings.length ? (
            <p className="p-4 text-sm text-slate-500 sm:p-5">No interview requests yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((booking) => (
                <article key={booking.id} className="flex min-w-0 flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
                  <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <Avatar person={booking.interviewer} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{booking.interviewer.name}</p>
                      <p className="break-words text-xs text-slate-500 sm:text-sm">
                        {booking.start_at
                          ? new Date(booking.start_at).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                              timeZone: booking.timezone || 'Asia/Kolkata',
                            }) + ' · ' + (booking.timezone || 'Asia/Kolkata')
                          : `Requested ${booking.requested_at ? new Date(booking.requested_at).toLocaleDateString() : ''} · awaiting admin scheduling`}
                      </p>
                      {booking.status === 'completed' && booking.completed_at ? (
                        <p className="mt-1 text-xs font-medium text-emerald-700">
                          Completed{' '}
                          {new Date(booking.completed_at).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            timeZone: booking.timezone || 'Asia/Kolkata',
                          })}
                        </p>
                      ) : null}
                      {booking.status === 'rejected' && booking.rejection_reason ? (
                        <p className="mt-1 text-xs text-rose-700">
                          <span className="font-semibold">Reason:</span> {booking.rejection_reason}
                        </p>
                      ) : null}
                      {booking.status === 'cancelled' && booking.cancellation_reason ? (
                        <p className="mt-1 text-xs text-slate-600">
                          <span className="font-semibold">Reason:</span> {booking.cancellation_reason}
                        </p>
                      ) : null}
                      {booking.status === 'confirmed' && booking.meet_link ? (
                        <a className="mt-1 inline-block break-all text-sm font-medium text-blue-700 underline" href={booking.meet_link} target="_blank" rel="noreferrer">
                          Join Google Meet
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
                    <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + statusStyle(booking.status)}>
                      {statusLabel(booking.status)}
                    </span>
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        type="button"
                        onClick={() => void cancelRequest(booking)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-rose-300 hover:text-rose-700 sm:ml-0"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}
