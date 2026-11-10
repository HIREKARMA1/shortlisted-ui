'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Building2,
  Calendar,
  ExternalLink,
  Globe2,
  MapPin,
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
  eventStatusKey,
  formatEventSchedule,
  isEventRegistrationClosed,
  stripHtml,
  type StudentEventDetail,
  type StudentEventReward,
} from '@/lib/events';

const REWARD_TONES = [
  'bg-sky-50 text-sky-950',
  'bg-emerald-50 text-emerald-950',
  'bg-amber-50 text-amber-950',
];

export function StudentEventDetailView({ slug }: { slug: string }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();

  const [event, setEvent] = useState<StudentEventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'not_found' | 'load' | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api
      .getStudentEvent(slug)
      .then((data) => {
        if (!cancelled) setEvent(data as StudentEventDetail);
      })
      .catch((err: { response?: { status?: number } }) => {
        if (cancelled) return;
        setEvent(null);
        setError(err?.response?.status === 404 ? 'not_found' : 'load');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const categoryKey = categoryLabelKey(event?.category);
  const categoryLabel = event?.category
    ? t(categoryKey) !== categoryKey
      ? t(categoryKey)
      : event.category.replace(/_/g, ' ')
    : null;
  const statusKey = event ? eventStatusKey(event) : 'upcoming';
  const statusLabel = t(`dashboard.studentEvents.status.${statusKey}`);
  const shortCopy = stripHtml(event?.short_description || event?.subtitle);
  const longCopy = stripHtml(event?.long_description);
  const description = shortCopy || longCopy;
  const location = event
    ? (event.mode || '').toLowerCase() === 'online'
      ? t('dashboard.studentEvents.onlineLive')
      : eventLocationLabel(event, {
          online: t('dashboard.studentEvents.online'),
          hybrid: t('dashboard.studentEvents.hybrid'),
        })
    : '';
  const LocationIcon = (event?.mode || '').toLowerCase() === 'online' ? Globe2 : MapPin;
  const registerUrl = event?.registration_url;
  const registrationClosed = event ? isEventRegistrationClosed(event) : true;
  const registerLabel =
    event?.registration_button_text?.trim() || t('dashboard.studentEvents.register');

  const rewards = useMemo(() => {
    const rows = Array.isArray(event?.rewards) ? event.rewards : [];
    return rows
      .filter((row): row is StudentEventReward => Boolean(row && (row.title || row.description)))
      .slice(0, 3);
  }, [event?.rewards]);

  return (
    <DashboardLayout role="student" title="" onLogout={logout} wideContent>
      <div className="mb-5">
        <Link
          href="/dashboard/student/events"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#003399] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('dashboard.studentEvents.backToEvents')}
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="animate-pulse space-y-4">
            <div className="h-64 rounded-2xl bg-slate-200 sm:h-80" />
            <div className="h-5 w-40 rounded-full bg-slate-100" />
            <div className="h-8 w-3/4 rounded bg-slate-100" />
            <div className="h-20 w-full rounded bg-slate-100" />
          </div>
          <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      ) : error || !event ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
          <p className="font-medium text-ink-primary">
            {error === 'not_found'
              ? t('dashboard.studentEvents.notFound')
              : t('dashboard.studentEvents.error')}
          </p>
          <Link
            href="/dashboard/student/events"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#003399] px-4 py-2 text-sm font-semibold text-white"
          >
            {t('dashboard.studentEvents.backToEvents')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="min-w-0 space-y-5">
            <div className="relative overflow-hidden rounded-2xl bg-[#0B2C6B] shadow-[0_8px_30px_rgba(15,23,42,0.12)]">
              <div className="relative w-full">
                {event.banner_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={event.banner_url}
                    alt={event.title}
                    className="block h-auto w-full object-contain object-center"
                  />
                ) : (
                  <div className="flex aspect-[16/9] w-full items-center justify-center text-white/40">
                    <Calendar className="h-16 w-16" />
                  </div>
                )}
                {categoryLabel && (
                  <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm">
                    {categoryLabel}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categoryLabel && (
                <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold capitalize text-sky-800">
                  {categoryLabel}
                </span>
              )}
              <span
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-semibold',
                  statusKey === 'live' && 'bg-emerald-100 text-emerald-800',
                  statusKey === 'upcoming' && 'bg-blue-100 text-[#003399]',
                  (statusKey === 'completed' || statusKey === 'closed') &&
                    'bg-slate-100 text-slate-600',
                  (statusKey === 'cancelled' || statusKey === 'postponed') &&
                    'bg-orange-100 text-orange-800'
                )}
              >
                {statusLabel !== `dashboard.studentEvents.status.${statusKey}`
                  ? statusLabel
                  : statusKey}
              </span>
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight text-[#003399] sm:text-3xl">
                {event.title}
              </h1>
              {description && (
                <p className="mt-3 max-w-3xl text-[15px] leading-7 text-slate-600">
                  {description}
                </p>
              )}
            </div>

            {rewards.length > 0 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5">
                <h2 className="text-base font-bold text-[#003399]">
                  {t('dashboard.studentEvents.whatYoullGet')}
                </h2>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {rewards.map((reward, index) => (
                    <div
                      key={reward.id || `${reward.title}-${index}`}
                      className={cn(
                        'rounded-xl p-3.5',
                        REWARD_TONES[index % REWARD_TONES.length]
                      )}
                    >
                      <p className="text-sm font-bold">
                        {reward.title || `Perk ${index + 1}`}
                      </p>
                      {(reward.description || reward.value) && (
                        <p className="mt-1.5 text-xs leading-5 opacity-80">
                          {stripHtml(reward.description || reward.value)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!rewards.length && longCopy && shortCopy && longCopy !== shortCopy && (
              <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)] sm:p-5">
                <h2 className="text-base font-bold text-[#003399]">
                  {t('dashboard.studentEvents.about')}
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {longCopy}
                </p>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {t('dashboard.studentEvents.dateTimeLabel')}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800">
                      {formatEventSchedule(event.event_start_date, event.event_end_date)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <LocationIcon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {t('dashboard.studentEvents.locationLabel')}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800">
                      {location}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                      {t('dashboard.studentEvents.organizerLabel')}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-5 text-slate-800">
                      {event.organizer_name || '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {registrationClosed || !registerUrl ? (
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-[#003399]/70"
                  >
                    {t('dashboard.studentEvents.registrationClosed')}
                  </button>
                ) : (
                  <a
                    href={registerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#003399] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002b80]"
                  >
                    {registerLabel}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                <Link
                  href="/dashboard/student/events"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-[#003399]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#003399] hover:bg-[#003399]/5"
                >
                  {t('dashboard.studentEvents.backToEvents')}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </DashboardLayout>
  );
}
