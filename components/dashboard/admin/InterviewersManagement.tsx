'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, CalendarDays, Check, ChevronDown, Clock3, Edit3, Plus, Search, Trash2, UserRound, X, Users, Video, ClipboardList, History, GraduationCap } from 'lucide-react';
import { api } from '@/lib/api';
import { LoadingState } from '@/components/ui/LoadingState';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { InterviewBookingRequests } from '@/components/dashboard/admin/InterviewBookingRequests';
import { InterviewHistoryPanel } from '@/components/dashboard/admin/InterviewHistoryPanel';
import { InterviewStudentRecords } from '@/components/dashboard/admin/InterviewStudentRecords';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

type Interviewer = { id: string; name: string; email: string; profile_details?: string; profile_photo_url?: string | null; timezone: string; is_active: boolean; calendar_status: string; calendar_connected_email?: string; interview_count?: number; last_activity?: string | null };
type Overview = { total_interviewers: number; connected_calendars: number; pending_requests: number; confirmed_interviews: number; completed_interviews: number; cancelled_rejected_requests: number; cancelled_requests: number; rejected_requests: number };
type AdminTab = 'overview' | 'interviewers' | 'requests' | 'history' | 'students';
const empty = { name: '', email: '', profile_details: '', timezone: 'Asia/Kolkata', is_active: true };
const emptyOverview: Overview = { total_interviewers: 0, connected_calendars: 0, pending_requests: 0, confirmed_interviews: 0, completed_interviews: 0, cancelled_rejected_requests: 0, cancelled_requests: 0, rejected_requests: 0 };

function connectionStatus(status: string) {
  if (status === 'connected') return { label: 'Connected', tone: 'bg-emerald-50 text-emerald-700 ring-emerald-200', icon: Check };
  if (status === 'authorization_expired') return { label: 'Authorization Expired', tone: 'bg-amber-50 text-amber-700 ring-amber-200', icon: AlertCircle };
  if (status === 'needs_attention') return { label: 'Needs Attention', tone: 'bg-amber-50 text-amber-700 ring-amber-200', icon: AlertCircle };
  return { label: 'Not Connected', tone: 'bg-rose-50 text-rose-700 ring-rose-200', icon: AlertCircle };
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || '?';
}

export function InterviewersManagement({ role = 'admin' }: { role?: DashboardRole }) {
  const { logout } = useAuth();
  const { ready } = useRoleGuard(role);
  const [rows, setRows] = useState<Interviewer[]>([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [overview, setOverview] = useState<Overview>(emptyOverview);
  const [form, setForm] = useState(empty);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loadError, setLoadError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [statusFilter, setStatusFilter] = useState('all');
  const [calendarFilter, setCalendarFilter] = useState('all');
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all');
  const [expertiseFilter, setExpertiseFilter] = useState('all');
  const [interviewerToDelete, setInterviewerToDelete] = useState<Interviewer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const refreshOverview = async () => {
    try { setOverview(await api.get<Overview>('/admin/interview-overview')); } catch { /* keep the last known summary */ }
  };
  const load = async () => {
    setLoadError('');
    setLoadingRows(true);
    try {
      setRows(await api.get<Interviewer[]>('/admin/interviewers'));
      await refreshOverview();
    } catch (error: any) {
      const detail = error?.response?.data?.detail;
      setLoadError(typeof detail === 'string'
        ? detail
        : 'Could not connect to the interviewer service. Check that the API server is running, then retry.');
    } finally {
      setLoadingRows(false);
    }
  };
  useEffect(() => { if (ready) void load(); }, [ready]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const outcome = params.get('calendar');
    if (!outcome) return;
    const reason = params.get('reason');
    const messages: Record<string, string> = {
      authorization_denied: 'Google Calendar connection was cancelled.',
      invalid_state: 'The Google Calendar authorization expired. Please connect again.',
      authorization_failed: 'Google could not authorize this calendar. Please try again.',
      configuration_error: 'Google Calendar is not configured correctly. Contact support.',
      invalid_callback: 'The Google Calendar response was incomplete. Please connect again.',
      connection_failed: 'Google Calendar could not be connected. Please try again.',
    };
    setDrawerOpen(false);
    setMessage(outcome === 'connected'
      ? 'Google Calendar connected successfully.'
      : messages[reason || ''] || 'Google Calendar could not be connected. Please try again.');
    window.history.replaceState(null, '', window.location.pathname);
  }, []);
  useEffect(() => () => {
    if (photoPreview?.startsWith('blob:')) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !query || [row.name, row.email, row.profile_details, row.calendar_connected_email]
        .some((value) => value?.toLowerCase().includes(query));
      const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? row.is_active : !row.is_active);
      const matchesCalendar = calendarFilter === 'all' || row.calendar_status === calendarFilter;
      const matchesExpertise = expertiseFilter === 'all' || (row.profile_details || '').toLowerCase() === expertiseFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesCalendar && matchesExpertise;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [rows, search, statusFilter, calendarFilter, expertiseFilter]);

  const selectSummary = (tab: AdminTab, filter = 'all') => {
    setActiveTab(tab);
    setDrawerOpen(false);
    if (tab === 'interviewers') {
      setCalendarFilter(filter);
      setStatusFilter('all');
      setExpertiseFilter('all');
    }
    if (tab === 'history') setHistoryStatusFilter(filter);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(empty);
    setPhotoFile(null);
    setPhotoPreview(null);
    setMessage('');
    setDrawerOpen(true);
  };
  const startEdit = (row: Interviewer) => {
    setEditing(row.id);
    setForm({ name: row.name, email: row.email, profile_details: row.profile_details || '', timezone: row.timezone, is_active: row.is_active });
    setPhotoFile(null);
    setPhotoPreview(row.profile_photo_url || null);
    setMessage('');
    setDrawerOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setSaving(true);
    let interviewerId = editing;
    try {
      if (interviewerId) {
        await api.client.patch(`/admin/interviewers/${interviewerId}`, form);
      } else {
        const created = await api.post<Interviewer>('/admin/interviewers', form);
        interviewerId = created.id;
        setEditing(interviewerId);
      }
      if (photoFile && interviewerId) {
        const upload = new FormData();
        upload.append('file', photoFile);
        await api.client.post(`/admin/interviewers/${interviewerId}/profile-photo`, upload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      setForm(empty);
      setEditing(null);
      setPhotoFile(null);
      setPhotoPreview(null);
      setDrawerOpen(false);
      await load();
    } catch (error: any) {
      if (interviewerId) {
        setEditing(interviewerId);
        await load();
      }
      setMessage(error?.response?.data?.detail || 'Could not save interviewer.');
    } finally {
      setSaving(false);
    }
  };
  const connect = async (id: string) => {
    setMessage('');
    try {
      const result = await api.post<{ authorization_url: string }>(`/admin/interviewers/${id}/connect`);
      window.location.assign(result.authorization_url);
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not start Google authorization.');
    }
  };
  const requestDeleteInterviewer = (row: Interviewer) => {
    setMessage('');
    setInterviewerToDelete(row);
  };
  const confirmDeleteInterviewer = async () => {
    if (!interviewerToDelete) return;
    setDeleting(true);
    try {
      await api.client.delete(`/admin/interviewers/${interviewerToDelete.id}`);
      if (editing === interviewerToDelete.id) {
        setDrawerOpen(false);
        setEditing(null);
      }
      setMessage(`${interviewerToDelete.name} was deleted.`);
      setInterviewerToDelete(null);
      await load();
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || 'Could not delete interviewer.');
      setInterviewerToDelete(null);
      throw error;
    } finally {
      setDeleting(false);
    }
  };
  const choosePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('Choose a JPEG, PNG, or WebP image.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMessage('Profile photos must be 2 MB or smaller.');
      return;
    }
    setMessage('');
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };
  if (!ready) return <LoadingState />;

  return <DashboardLayout role={role} title="" wideContent onLogout={logout}>
    <div className="w-full min-w-0 text-slate-800">
      <div className="grid grid-cols-1 items-start gap-4 sm:gap-5">
        <section className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="min-w-0"><h1 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">Interview Management</h1><p className="mt-1 text-sm text-slate-500">Manage interviewers, requests, and student interview history.</p></div>
            {activeTab === 'interviewers' && <button type="button" onClick={startCreate} className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"><Plus className="h-4 w-4" />Add Interviewer</button>}
          </div>

          <section aria-label="Interview management summary" className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6">
            <MetricCard label="Total Interviewers" value={overview.total_interviewers} icon={<Users className="h-5 w-5" />} tone="blue" onClick={() => selectSummary('interviewers')} />
            <MetricCard label="Connected Calendars" value={overview.connected_calendars} icon={<CalendarDays className="h-5 w-5" />} tone="green" onClick={() => selectSummary('interviewers', 'connected')} />
            <MetricCard label="Pending Requests" value={overview.pending_requests} icon={<Clock3 className="h-5 w-5" />} tone="amber" onClick={() => selectSummary('requests')} />
            <MetricCard label="Confirmed Interviews" value={overview.confirmed_interviews} icon={<Check className="h-5 w-5" />} tone="purple" onClick={() => selectSummary('history', 'confirmed')} />
            <MetricCard label="Completed Interviews" value={overview.completed_interviews} icon={<Video className="h-5 w-5" />} tone="green" onClick={() => selectSummary('history', 'completed')} />
            <MetricCard label="Cancelled / Rejected" value={overview.cancelled_rejected_requests} icon={<X className="h-5 w-5" />} tone="rose" onClick={() => selectSummary('history', 'cancelled_rejected')} />
          </section>

          <nav aria-label="Interview management sections" className="-mx-1 overflow-x-auto px-1">
            <div className="flex min-w-max gap-1 rounded-lg border border-slate-200 bg-white px-2 pt-2 shadow-sm">
            {([
              ['overview', 'Overview', 'Overview', ClipboardList], ['interviewers', 'Interviewers', 'Interviewers', Users],
              ['requests', 'Requests', 'Interview Requests', Clock3], ['history', 'History', 'Interview History', History],
              ['students', 'Students', 'Student Records', GraduationCap],
            ] as const).map(([key, shortLabel, label, Icon]) => <button key={key} type="button" onClick={() => { setActiveTab(key); setDrawerOpen(false); }} aria-current={activeTab === key ? 'page' : undefined} className={'flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 py-2.5 text-sm font-semibold transition sm:gap-2 sm:px-3 ' + (activeTab === key ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800')}><Icon className="h-4 w-4 shrink-0" /><span className="sm:hidden">{shortLabel}</span><span className="hidden sm:inline">{label}</span>{key === 'requests' && overview.pending_requests > 0 && <span className="rounded-full bg-amber-100 px-1.5 text-xs text-amber-800">{overview.pending_requests}</span>}</button>)}
            </div>
          </nav>

          {message && !drawerOpen && <div role="alert" className="rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</div>}
          {loadError && <div role="alert" className="flex flex-wrap items-center justify-between gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800"><span>{loadError}</span><button type="button" onClick={() => void load()} className="rounded border border-red-300 bg-white px-3 py-1.5 font-medium">Retry</button></div>}

          {activeTab === 'overview' && <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="text-lg font-bold text-slate-900">Interview operations</h2><p className="mt-1 text-sm text-slate-500">Review approvals and maintain accurate interview records.</p></div><CalendarDays className="h-5 w-5 shrink-0 text-blue-600" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><button onClick={() => setActiveTab('requests')} className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-left hover:border-amber-300"><span className="text-sm font-semibold text-amber-900">Pending approval</span><span className="mt-1 block text-2xl font-bold text-amber-900">{overview.pending_requests}</span><span className="mt-1 block text-xs text-amber-800">Check availability and schedule</span></button><button onClick={() => setActiveTab('history')} className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-left hover:border-blue-300"><span className="text-sm font-semibold text-blue-900">Interview history</span><span className="mt-1 block text-2xl font-bold text-blue-900">{overview.confirmed_interviews + overview.completed_interviews}</span><span className="mt-1 block text-xs text-blue-800">View outcomes, notes, and audit trail</span></button></div></div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><h2 className="font-bold text-slate-900">Calendar connections</h2><p className="mt-1 text-sm text-slate-500">Interviewers must connect Calendar before a request can be confirmed.</p><div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 p-4"><span className="text-sm text-slate-600">Connected calendars</span><span className="text-xl font-bold text-emerald-700">{overview.connected_calendars}<span className="text-sm font-normal text-slate-400"> / {overview.total_interviewers}</span></span></div><button onClick={() => setActiveTab('interviewers')} className="mt-3 text-sm font-semibold text-blue-700 hover:underline">Manage interviewers →</button></div>
          </section>}

          {activeTab === 'requests' && <InterviewBookingRequests onUpdated={() => void refreshOverview()} />}
          {activeTab === 'history' && <InterviewHistoryPanel initialFilter={historyStatusFilter} onUpdated={() => void refreshOverview()} />}
          {activeTab === 'students' && <InterviewStudentRecords />}
          {activeTab === 'interviewers' && <>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <label className="relative min-w-0 sm:col-span-2 lg:col-span-1"><span className="sr-only">Search interviewers</span><Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email…" className="h-9 w-full rounded-md border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-blue-400" /></label>
            <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
            <select aria-label="Filter by calendar" value={calendarFilter} onChange={(event) => setCalendarFilter(event.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="all">All Calendars</option><option value="connected">Connected</option><option value="not_connected">Not Connected</option><option value="authorization_expired">Authorization Expired</option></select>
            <select aria-label="Filter by expertise" value={expertiseFilter} onChange={(event) => setExpertiseFilter(event.target.value)} className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"><option value="all">All Expertise</option>{Array.from(new Set(rows.map((row) => row.profile_details).filter(Boolean))).sort().map((value) => <option key={value} value={value}>{value}</option>)}</select>
          </div>

          {loadingRows ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">Loading interviewers…</div> : filteredRows.length === 0 ? <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">{search || statusFilter !== 'all' || calendarFilter !== 'all' || expertiseFilter !== 'all' ? 'No interviewers match your filters.' : 'No interviewers yet.'}</div> : <>
          <div className="space-y-3 md:hidden">
            {filteredRows.map((row) => {
              const calendar = connectionStatus(row.calendar_status);
              const CalendarIcon = calendar.icon;
              return <article key={row.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">{row.profile_photo_url ? <img src={row.profile_photo_url} alt="" className="h-full w-full object-cover" /> : initials(row.name)}</span>
                    <div className="min-w-0"><h3 className="truncate font-semibold text-slate-800">{row.name}</h3><p className="truncate text-sm text-slate-500">{row.email}</p></div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button type="button" aria-label={'Edit ' + row.name} onClick={() => startEdit(row)} className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:text-blue-700"><Edit3 className="h-4 w-4" /></button>
                    <button type="button" aria-label={'Delete ' + row.name} onClick={() => requestDeleteInterviewer(row)} className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:border-rose-200 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div><dt className="text-xs text-slate-500">Expertise</dt><dd className="truncate font-medium text-slate-700" title={row.profile_details || undefined}>{row.profile_details || '—'}</dd></div>
                  <div><dt className="text-xs text-slate-500">Interviews</dt><dd className="font-medium text-slate-700">{row.interview_count ?? 0}</dd></div>
                  <div className="col-span-2"><dt className="text-xs text-slate-500">Google Calendar</dt><dd className="mt-1"><span className={'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ' + calendar.tone}><CalendarIcon className="h-3.5 w-3.5" />{calendar.label}</span></dd></div>
                  <div><dt className="text-xs text-slate-500">Status</dt><dd className="mt-1"><span className={'rounded-full px-2.5 py-1 text-xs font-medium ' + (row.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{row.is_active ? 'Active' : 'Inactive'}</span></dd></div>
                  <div><dt className="text-xs text-slate-500">Last Activity</dt><dd className="text-xs text-slate-600">{row.last_activity ? new Date(row.last_activity).toLocaleString() : '—'}</dd></div>
                </dl>
              </article>;
            })}
          </div>

          <section className="hidden overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"><tr><th className="px-3 py-3">Name</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Expertise</th><th className="px-3 py-3">Google Calendar</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Interviews</th><th className="px-3 py-3">Last Activity</th><th className="px-3 py-3 text-right">Actions</th></tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRows.map((row) => {
                    const calendar = connectionStatus(row.calendar_status);
                    const CalendarIcon = calendar.icon;
                    return <tr key={row.id} className="hover:bg-blue-50/30">
                      <td className="whitespace-nowrap px-3 py-3"><div className="flex items-center gap-2.5"><span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-blue-100 text-xs font-bold text-blue-700">{row.profile_photo_url ? <img src={row.profile_photo_url} alt="" className="h-full w-full object-cover" /> : initials(row.name)}</span><span className="font-semibold text-slate-800">{row.name}</span></div></td>
                      <td className="whitespace-nowrap px-3 py-3 text-slate-600">{row.email}</td>
                      <td className="max-w-40 truncate px-3 py-3 text-slate-600" title={row.profile_details || undefined}>{row.profile_details || '—'}</td>
                      <td className="whitespace-nowrap px-3 py-3"><span className={'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ' + calendar.tone}><CalendarIcon className="h-3.5 w-3.5" />{calendar.label}</span></td>
                      <td className="px-3 py-3"><span className={'rounded-full px-2.5 py-1 text-xs font-medium ' + (row.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{row.is_active ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-3 py-3 font-medium text-slate-700">{row.interview_count ?? 0}</td>
                      <td className="px-3 py-3 text-xs text-slate-500">{row.last_activity ? new Date(row.last_activity).toLocaleString() : '—'}</td>
                      <td className="whitespace-nowrap px-3 py-3"><div className="relative flex items-center justify-end gap-1"><button type="button" aria-label={'Edit ' + row.name} onClick={() => startEdit(row)} className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:text-blue-700"><Edit3 className="h-4 w-4" /></button><button type="button" aria-label={'Delete ' + row.name} onClick={() => requestDeleteInterviewer(row)} className="rounded-full border border-slate-200 p-1.5 text-slate-500 hover:border-rose-200 hover:text-rose-700"><Trash2 className="h-4 w-4" /></button></div></td>
                    </tr>;
                  })}
                </tbody>
              </table>
            </div>
          </section>
          </>}
          </>}
        </section>

        <ConfirmationModal
          isOpen={!!interviewerToDelete}
          onClose={() => { if (!deleting) setInterviewerToDelete(null); }}
          onConfirm={confirmDeleteInterviewer}
          title="Delete Interviewer?"
          message={
            interviewerToDelete
              ? `Are you sure you want to delete ${interviewerToDelete.name}? This permanently removes the interviewer and cannot be undone.`
              : 'Are you sure you want to delete this interviewer?'
          }
          confirmText="Confirm Delete"
          cancelText="Cancel"
          isLoading={deleting}
          variant="danger"
        />
        {drawerOpen && <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 p-0 sm:items-center sm:p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setDrawerOpen(false); }}><aside role="dialog" aria-modal="true" aria-labelledby="interviewer-drawer-title" className="relative z-[101] flex max-h-[94vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl sm:min-h-[480px] sm:rounded-2xl">
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 py-3"><div className="min-w-0"><h2 id="interviewer-drawer-title" className="text-base font-bold text-slate-900">{editing ? 'Edit Interviewer' : 'Add Interviewer'}</h2><p className="mt-1 text-xs text-slate-500">Enter interviewer profile and connection details.</p></div><button type="button" aria-label="Close panel" onClick={() => setDrawerOpen(false)} className="shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-100"><X className="h-4 w-4" /></button></div>
          <form onSubmit={save} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <FormField label="Full Name" required><input required autoFocus value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Enter interviewer name" className={drawerInputClass} /></FormField>
              <FormField label="Email Address" required><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="interviewer@hirekarma.in" className={drawerInputClass} /></FormField>
              <FormField label="Profile / Expertise"><div className="relative"><input list="interviewer-expertise-options" value={form.profile_details} onChange={(event) => setForm({ ...form, profile_details: event.target.value })} placeholder="Select expertise" className={drawerInputClass + ' pr-7'} /><datalist id="interviewer-expertise-options"><option value="Full Stack Developer" /><option value="Data Analyst" /><option value="System Design" /><option value="Frontend Developer" /><option value="Backend Developer" /><option value="UI/UX Designer" /><option value="Product Manager" /><option value="Other" /></datalist><ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" /></div></FormField>
              <div><span className="mb-1.5 block text-sm font-semibold text-slate-700">Profile Photo</span><div className="flex items-center gap-3"><span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-slate-100 text-slate-400">{photoPreview ? <img src={photoPreview} alt="Interviewer profile preview" className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5" />}</span><div><input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} className="hidden" /><button type="button" onClick={() => photoInputRef.current?.click()} className="rounded-md border border-blue-200 bg-white px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50">{photoPreview ? 'Change Photo' : 'Upload Photo'}</button><p className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP · Max 2 MB</p></div></div></div>
              <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(event) => setForm({ ...form, is_active: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Active interviewer
              </label>
              <div className="border-t border-slate-100 pt-3"><div className="text-sm font-semibold text-slate-800">Google Calendar</div><p className="mt-1 text-xs leading-4 text-slate-500">Connect interviewer’s Google Calendar to check availability and create events.</p>{editing ? <button type="button" onClick={() => void connect(editing)} className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-md border border-blue-200 px-3 text-xs font-semibold text-blue-700 hover:bg-blue-50"><span className="font-bold text-red-500">G</span>Connect Google Calendar</button> : <p className="mt-2 text-xs text-slate-400">Save the interviewer first to connect their calendar.</p>}</div>
              {message && <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{message}</p>}
            </div>
            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 px-4 py-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setDrawerOpen(false)} className="w-full rounded-md border border-slate-200 px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:w-auto">Cancel</button><button disabled={saving} className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto">{saving ? 'Saving…' : 'Save'}</button></div>
          </form>
        </aside></div>}
      </div>
    </div>
  </DashboardLayout>;
}
const drawerInputClass = 'h-9 w-full rounded-md border border-slate-200 px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100';

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="block text-xs font-semibold text-slate-700">{label}{required && <span className="ml-1 text-rose-500">*</span>}</span>{children}</label>;
}

function MetricCard({ label, value, icon, tone, onClick }: { label: string; value: number; icon: React.ReactNode; tone: 'blue' | 'green' | 'amber' | 'purple' | 'rose'; onClick: () => void }) {
  const styles = {
    blue: 'bg-blue-50 text-blue-600', green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600', purple: 'bg-violet-50 text-violet-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return <button type="button" onClick={onClick} aria-label={`${label}: ${value}. Click to view matching records.`} className="flex min-w-0 items-start gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 sm:items-center sm:gap-3 sm:p-4"><span className={'grid h-9 w-9 shrink-0 place-items-center rounded-full sm:h-10 sm:w-10 ' + styles[tone]}>{icon}</span><span className="min-w-0"><span className="block text-[11px] leading-tight text-slate-500 sm:truncate sm:text-xs">{label}</span><span className="mt-0.5 block text-lg font-bold text-slate-900 sm:text-xl">{value}</span></span></button>;
}


