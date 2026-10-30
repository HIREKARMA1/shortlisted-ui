'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { CalendarDays, ChevronDown, Info, Search, Video } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type Person = { id: string; name: string; email?: string; profile_details?: string; calendar_status: string; profile_photo_url?: string; expertise?: string };
type Booking = { id: string; interviewer: Person; start_at: string | null; end_at: string | null; status: string; meet_link?: string | null; requested_at?: string | null; timezone?: string; notification_warning?: string };

const initials = (name: string) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
const errorText = (error: unknown, fallback: string) => {
  const response = (error as { response?: { status?: number; data?: { detail?: unknown } } })?.response;
  const detail = response?.data?.detail;
  if (typeof detail === 'string') return detail;
  return error instanceof Error ? error.message : fallback;
};
const statusStyle = (status: string) => status === 'confirmed'
  ? 'bg-emerald-50 text-emerald-700'
  : status === 'rejected' || status === 'cancelled'
    ? 'bg-slate-100 text-slate-600'
    : 'bg-amber-50 text-amber-800';

function Avatar({ person, small = false }: { person: Person; small?: boolean }) {
  return <span className={'grid shrink-0 place-items-center overflow-hidden rounded-full bg-blue-100 font-semibold text-blue-700 ' + (small ? 'h-9 w-9 text-sm' : 'h-14 w-14 text-base')}>
    {person.profile_photo_url ? <img src={person.profile_photo_url} alt="" className="h-full w-full object-cover" /> : initials(person.name)}
  </span>;
}

export function StudentInterviews() {
  const { logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selected, setSelected] = useState('');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const load = async () => {
    try {
      const [interviewers, requests] = await Promise.all([
        api.get<Person[]>('/interviewers'),
        api.get<Booking[]>('/interviews/bookings'),
      ]);
      setPeople(interviewers);
      setBookings(requests);
      setSelected((current) => current || interviewers[0]?.id || '');
    } catch (error) {
      setMessage(errorText(error, 'Could not load interviews.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);
  useEffect(() => {
    if (!profileMenuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !profileMenuRef.current?.contains(event.target)) setProfileMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setProfileMenuOpen(false); };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileMenuOpen]);

  const filtered = useMemo(() => people.filter((person) =>
    `${person.name} ${person.profile_details || ''} ${person.expertise || ''}`.toLowerCase().includes(query.toLowerCase()),
  ), [people, query]);
  const selectedPerson = people.find((person) => person.id === selected);
  const activeRequest = bookings.find((booking) => booking.interviewer.id === selected && ['pending', 'confirmed'].includes(booking.status));

  const submitRequest = async () => {
    if (!selectedPerson || working) return;
    setWorking(true);
    setMessage('');
    try {
      await api.client.post<Booking>('/interviews/bookings', { interviewer_id: selectedPerson.id }, {
        headers: { 'Idempotency-Key': crypto.randomUUID() },
      });
      setMessage(`Your interview request for ${selectedPerson.name} was sent. It will remain pending until an admin schedules it.`);
      await load();
    } catch (error) {
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

  if (loading) return <div className="p-8 text-base text-slate-500">Loading interviewers and requests…</div>;

  return <div className="min-h-screen bg-slate-50 text-slate-800">
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-7">
      <label className="relative block w-full max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search for interviewers…" className="h-9 w-full rounded-md border border-slate-200 pl-9 pr-3 text-base outline-none focus:border-blue-400" /></label>
      <div ref={profileMenuRef} className="relative ml-4"><button type="button" aria-label="Student menu" aria-expanded={profileMenuOpen} onClick={() => setProfileMenuOpen((open) => !open)} className="flex items-center gap-2 text-base text-slate-800"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-sm text-white">S</span><span className="hidden sm:inline">Student</span><ChevronDown className={'h-3.5 w-3.5 transition-transform ' + (profileMenuOpen ? 'rotate-180' : '')} /></button>{profileMenuOpen && <div role="menu" className="absolute right-0 top-11 z-50 w-40 rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"><button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); logout(); }} className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50">Sign out</button></div>}</div>
    </header>
    <main className="mx-auto max-w-[1500px] p-4 md:p-6">
      <div className="mb-5"><h1 className="text-3xl font-bold text-slate-900">Request an Interview</h1><p className="mt-1 text-base text-slate-500">Choose an interviewer and send a request. An admin will schedule the date and time.</p></div>
      {message && <div role="status" className="mb-4 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-base text-blue-800"><Info className="h-4 w-4 shrink-0" />{message}<button onClick={() => setMessage('')} className="ml-auto">×</button></div>}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-3">
          {!filtered.length ? <div className="rounded-lg border border-slate-200 bg-white p-6 text-base text-slate-500">No interviewers match your search.</div> : filtered.map((person) => <button key={person.id} type="button" onClick={() => setSelected(person.id)} className={'flex w-full items-center justify-between gap-3 rounded-lg border bg-white p-4 text-left shadow-sm transition hover:border-blue-300 ' + (selected === person.id ? 'border-blue-500 ring-1 ring-blue-200' : 'border-slate-200')}>
            <span className="flex min-w-0 items-center gap-3"><Avatar person={person} /><span className="min-w-0"><span className="block truncate text-base font-semibold text-slate-900">{person.name}</span><span className="block truncate text-sm text-slate-600">{person.expertise || person.profile_details || 'Interviewer'}</span><span className="mt-1 block text-xs text-slate-500">{person.profile_details && person.expertise ? person.profile_details : ''}</span><span className={'mt-1 block text-xs ' + (person.calendar_status === 'connected' ? 'text-emerald-700' : 'text-slate-500')}>{person.calendar_status === 'connected' ? 'Google Calendar connected' : 'Calendar will be checked by the admin'}</span></span></span>
            <span className={'shrink-0 rounded px-3 py-1.5 text-sm font-semibold ' + (selected === person.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600')}>{selected === person.id ? 'Selected' : 'Select'}</span>
          </button>)}
        </section>
        <aside className="rounded-lg border border-blue-200 bg-white p-4 shadow-sm">
          <h2 className="text-base font-semibold">Request Summary</h2>
          {selectedPerson ? <>
            <div className="my-4 flex items-center gap-3"><Avatar person={selectedPerson} /><div><p className="font-semibold">{selectedPerson.name}</p><p className="text-sm text-slate-500">{selectedPerson.expertise || selectedPerson.profile_details || 'Interviewer'}</p></div></div>
            <hr className="my-3" />
            <p className="flex items-start gap-2 text-sm"><CalendarDays className="h-4 w-4 text-blue-600" /><span><b>Schedule</b><br /><span className="text-slate-500">Admin selects an available date and time</span></span></p>
            <p className="mt-3 flex items-start gap-2 text-sm"><Video className="h-4 w-4 text-blue-600" /><span><b>Google Meet</b><br /><span className="text-slate-500">Link provided after confirmation</span></span></p>
            {activeRequest ? <p className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">You already have a {activeRequest.status} request with this interviewer.</p> : <button disabled={!selectedPerson || working} onClick={() => void submitRequest()} className="mt-5 w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">{working ? 'Sending request…' : 'Request Interview'}</button>}
          </> : <p className="mt-4 text-sm text-slate-500">Select an interviewer to continue.</p>}
        </aside>
      </div>
      <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3"><h2 className="text-base font-semibold">My Interview Requests</h2><p className="text-sm text-slate-500">Track approval and confirmed interview details.</p></div>
        {!bookings.length ? <p className="p-5 text-sm text-slate-500">No interview requests yet.</p> : <div className="divide-y divide-slate-100">{bookings.map((booking) => <article key={booking.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-3"><Avatar person={booking.interviewer} small /><div><p className="font-semibold text-slate-900">{booking.interviewer.name}</p><p className="text-sm text-slate-500">{booking.start_at ? new Date(booking.start_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: booking.timezone || 'Asia/Kolkata' }) + ' · ' + (booking.timezone || 'Asia/Kolkata') : `Requested ${booking.requested_at ? new Date(booking.requested_at).toLocaleDateString() : ''} · awaiting admin scheduling`}</p>{booking.status === 'confirmed' && booking.meet_link && <a className="text-sm font-medium text-blue-700 underline" href={booking.meet_link} target="_blank" rel="noreferrer">Join Google Meet</a>}</div></div>
          <div className="flex items-center gap-2"><span className={'rounded-full px-3 py-1 text-xs font-semibold capitalize ' + statusStyle(booking.status)}>{booking.status}</span>{['pending', 'confirmed'].includes(booking.status) && <button type="button" onClick={() => void cancelRequest(booking)} className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:border-rose-300 hover:text-rose-700">Cancel</button>}</div>
        </article>)}</div>}
      </section>
    </main>
  </div>;
}

