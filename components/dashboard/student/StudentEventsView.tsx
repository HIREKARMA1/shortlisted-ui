'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  CalendarClock,
  Clock3,
  Globe2,
  Home,
  MapPin,
  Search,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { cn } from '@/lib/utils';
import {
  categoryLabelKey,
  eventLocationLabel,
  eventTabToStatus,
  formatEventDateBadge,
  formatEventDateTime,
  stripHtml,
  type EventTab,
  type StudentEventListItem,
  type StudentEventListResponse,
} from '@/lib/events';

const MEDIA_BACKDROPS = [
  'bg-[#0B2C6B]',
  'bg-[#E8B923]',
  'bg-[#C9D7F2]',
  'bg-[#D6E4F7]',
  'bg-[#1F4E8C]',
  'bg-[#F0C94A]',
];

function categoryDotClass(category?: string | null) {
  const key = (category || '').toLowerCase();
  if (key.includes('webinar') || key.includes('seminar')) return 'bg-emerald-500';
  if (key.includes('workshop') || key.includes('technical') || key.includes('coding')) return 'bg-orange-500';
  if (key.includes('career') || key.includes('placement') || key.includes('fair') || key.includes('drive')) {
    return 'bg-amber-500';
  }
  if (key.includes('technology') || key.includes('hackathon') || key.includes('ai')) return 'bg-sky-500';
  return 'bg-[#003399]';
}

function mediaBackdropClass(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash + seed.charCodeAt(i) * (i + 1)) % MEDIA_BACKDROPS.length;
  return MEDIA_BACKDROPS[hash];
}

function EventCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <div className="h-[148px] bg-slate-200 sm:h-[160px]" />
      <div className="space-y-2 p-3.5">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-4 w-5/6 rounded bg-slate-100" />
        <div className="h-3 w-3/5 rounded bg-slate-100" />
        <div className="h-8 w-full rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}

function EventCard({
  event,
  t,
}: {
  event: StudentEventListItem;
  t: (path: string, params?: Record<string, string | number>) => string;
}) {
  const slug = event.slug || event.id;
  const categoryKey = categoryLabelKey(event.category);
  const categoryLabel = event.category
    ? t(categoryKey) !== categoryKey
      ? t(categoryKey)
      : event.category.replace(/_/g, ' ')
    : null;
  const description = stripHtml(event.short_description || event.subtitle);
  const location = eventLocationLabel(event, {
    online: t('dashboard.studentEvents.online'),
    hybrid: t('dashboard.studentEvents.hybrid'),
  });
  const LocationIcon = (event.mode || '').toLowerCase() === 'online' ? Globe2 : MapPin;
  const dateBadge = formatEventDateBadge(event.event_start_date);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_10px_28px_rgba(15,23,42,0.1)]">
      <div
        className={cn(
          'relative h-[148px] overflow-hidden px-4 pb-3.5 pt-3 sm:h-[160px]',
          mediaBackdropClass(event.id || slug)
        )}
      >
        {categoryLabel && (
          <span className="absolute left-2.5 top-2.5 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold capitalize text-slate-700 shadow-sm">
            <span className={cn('h-1.5 w-1.5 rounded-full', categoryDotClass(event.category))} />
            {categoryLabel}
          </span>
        )}

        <div className="flex h-full items-center justify-center pt-5">
          <div className="relative h-[82%] w-[78%] overflow-hidden rounded-none bg-white shadow-[0_8px_24px_rgba(0,0,0,0.2)] ring-1 ring-black/5">
            {event.banner_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.banner_url}
                alt=""
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-white text-[#003399]/35">
                <Calendar className="h-8 w-8" />
              </div>
            )}
          </div>
        </div>

        {dateBadge && (
          <div className="absolute bottom-2 left-2.5 z-10 flex min-w-[46px] flex-col items-center rounded-lg bg-white px-2 py-1 shadow-md">
            <span className="text-sm font-bold leading-none text-[#003399]">{dateBadge.day}</span>
            <span className="mt-0.5 text-[9px] font-bold tracking-wide text-slate-500">
              {dateBadge.month}
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3.5">
        {event.organizer_name && (
          <p className="mb-1 flex items-center gap-1.5 text-[11px] text-slate-500">
            <Home className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.organizer_name}</span>
          </p>
        )}

        <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-[#003399]">
          {event.title}
        </h3>

        <div className="mt-1.5 space-y-1 text-[11px] text-slate-600">
          <p className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{formatEventDateTime(event.event_start_date)}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <LocationIcon className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        {description && (
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-slate-500">{description}</p>
        )}

        <div className="mt-auto pt-3">
          <Link
            href={`/dashboard/student/events/${encodeURIComponent(slug)}`}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#003399] px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#002b80]"
          >
            {t('dashboard.studentEvents.viewDetails')}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function StudentEventsView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();

  const [tab, setTab] = useState<EventTab>('all');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState<StudentEventListItem[]>([]);
  const [upcoming, setUpcoming] = useState<StudentEventListItem[]>([]);
  const [eventsHubUrl, setEventsHubUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [listRes, upcomingRes] = await Promise.all([
        api.getStudentEvents({
          page,
          limit: 8,
          search: search || undefined,
          status: eventTabToStatus(tab),
        }) as Promise<StudentEventListResponse>,
        api.getStudentUpcomingEvents(3) as Promise<StudentEventListResponse>,
      ]);
      setEvents(Array.isArray(listRes?.events) ? listRes.events : []);
      setHasNext(Boolean(listRes?.has_next));
      setHasPrev(Boolean(listRes?.has_prev));
      setUpcoming(Array.isArray(upcomingRes?.events) ? upcomingRes.events : []);
      setEventsHubUrl(listRes?.events_hub_url || upcomingRes?.events_hub_url || null);
    } catch {
      setEvents([]);
      setUpcoming([]);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [page, search, tab]);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const reminder = useMemo(() => upcoming[0] || null, [upcoming]);

  const tabs: { id: EventTab; label: string; icon: typeof Calendar }[] = [
    { id: 'all', label: t('dashboard.studentEvents.tabAll'), icon: Calendar },
    { id: 'upcoming', label: t('dashboard.studentEvents.tabUpcoming'), icon: CalendarClock },
    { id: 'past', label: t('dashboard.studentEvents.tabPast'), icon: Clock3 },
  ];

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.studentEvents.title')}
      subtitle={t('dashboard.studentEvents.subtitle')}
      onLogout={logout}
      wideContent
    >
      <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative block min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('dashboard.studentEvents.searchPlaceholder')}
            className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-ink-primary shadow-sm outline-none placeholder:text-slate-400 focus:border-[#003399] focus:ring-2 focus:ring-[#003399]/15"
          />
        </label>

        <div className="flex flex-wrap gap-2 xl:shrink-0">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setPage(1);
              }}
              className={cn(
                'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                tab === id
                  ? 'border-[#003399] bg-[#003399] text-white shadow-sm'
                  : 'border-[#003399]/25 bg-white text-[#003399] hover:bg-[#003399]/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-red-200 bg-red-50/60 px-6 py-12 text-center">
              <p className="font-medium text-red-700">{t('dashboard.studentEvents.error')}</p>
              <button
                type="button"
                onClick={() => void loadEvents()}
                className="mt-4 inline-flex rounded-xl bg-[#003399] px-4 py-2 text-sm font-semibold text-white"
              >
                {t('dashboard.studentEvents.retry')}
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
              <Calendar className="mx-auto h-10 w-10 text-[#003399]/35" />
              <p className="mt-4 font-medium text-ink-primary">
                {search
                  ? t('dashboard.studentEvents.emptySearch')
                  : t('dashboard.studentEvents.empty')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} t={t} />
              ))}
            </div>
          )}

          {(hasPrev || hasNext) && !loading && !error && (
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={!hasPrev}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="mb-1 flex items-start justify-between gap-2">
              <h2 className="text-base font-bold text-[#003399]">
                {t('dashboard.studentEvents.activityTitle')}
              </h2>
            </div>
            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-600">
                {t('dashboard.studentEvents.registeredTitle')}
              </p>
              {eventsHubUrl && (
                <a
                  href={eventsHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#003399] hover:underline"
                >
                  {t('dashboard.studentEvents.viewAll')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-5 text-center">
              <p className="text-sm leading-5 text-slate-600">
                {t('dashboard.studentEvents.registeredEmpty')}
              </p>
              {eventsHubUrl && (
                <a
                  href={eventsHubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#003399] hover:underline"
                >
                  {t('dashboard.studentEvents.browseOnDisha')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-[#003399]" />
              <h2 className="text-base font-bold text-[#003399]">
                {t('dashboard.studentEvents.reminderTitle')}
              </h2>
            </div>

            {reminder ? (
              <div className="rounded-xl border border-[#003399]/10 bg-[rgba(0,51,153,0.04)] p-3.5">
                <div className="flex gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#003399]/10 text-[#003399]">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-semibold text-slate-900">
                      {reminder.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {formatEventDateTime(reminder.event_start_date)}
                    </p>
                    <Link
                      href={`/dashboard/student/events/${encodeURIComponent(reminder.slug || reminder.id)}`}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#003399] hover:underline"
                    >
                      {t('dashboard.studentEvents.viewDetails')}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-[#003399]/10 bg-[rgba(0,51,153,0.04)] px-3.5 py-5 text-center">
                <Calendar className="mx-auto h-8 w-8 text-[#003399]/40" />
                <p className="mt-2 text-sm text-slate-600">
                  {t('dashboard.studentEvents.reminderEmpty')}
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
}
