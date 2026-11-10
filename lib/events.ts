export type StudentEventListItem = {
  id: string;
  slug?: string | null;
  title: string;
  subtitle?: string | null;
  short_description?: string | null;
  banner_url?: string | null;
  organizer_logo_url?: string | null;
  organizer_name?: string | null;
  category?: string | null;
  mode?: string | null;
  venue?: string | null;
  event_start_date: string;
  event_end_date?: string | null;
  contest_status?: string | null;
  publication_status?: string | null;
  registration_is_open?: boolean | null;
  registration_state?: string | null;
  participant_count?: number;
  max_participants?: number | null;
  registration_url?: string | null;
  is_cancelled?: boolean;
  is_postponed?: boolean;
};

export type StudentEventReward = {
  id?: string | null;
  title?: string | null;
  description?: string | null;
  value?: string | null;
  sort_order?: number | null;
};

export type StudentEventDetail = StudentEventListItem & {
  long_description?: string | null;
  eligibility?: string | null;
  about_organizer?: string | null;
  registration_button_text?: string | null;
  registration_external_url?: string | null;
  registration_enabled?: boolean;
  support_email?: string | null;
  support_phone?: string | null;
  rewards?: StudentEventReward[] | null;
};

export type StudentEventListResponse = {
  events: StudentEventListItem[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  events_hub_url?: string;
};

export type EventTab = 'all' | 'upcoming' | 'past';

export function eventTabToStatus(tab: EventTab): string | undefined {
  if (tab === 'upcoming') return 'upcoming';
  if (tab === 'past') return 'completed';
  return undefined;
}

export function stripHtml(value?: string | null): string {
  if (!value) return '';
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatEventDateTime(value?: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatEventDateBadge(value?: string | null): { day: string; month: string } | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return {
    day: new Intl.DateTimeFormat('en-GB', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date).toUpperCase(),
  };
}

export function formatEventSchedule(
  start?: string | null,
  end?: string | null
): string {
  if (!start) return '';
  const startDate = new Date(start);
  if (Number.isNaN(startDate.getTime())) return start;

  const dayPart = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(startDate);

  const timeFmt = new Intl.DateTimeFormat('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });

  const startTime = timeFmt.format(startDate);
  if (!end) return `${dayPart} · ${startTime}`;

  const endDate = new Date(end);
  if (Number.isNaN(endDate.getTime())) return `${dayPart} · ${startTime}`;

  const sameDay = startDate.toDateString() === endDate.toDateString();
  const endTime = timeFmt.format(endDate);
  if (sameDay) {
    const startOnly = new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(startDate);
    return `${dayPart} · ${startOnly} to ${endTime}`;
  }
  return `${dayPart} · ${startTime} → ${endTime}`;
}

export function isEventRegistrationClosed(
  event: Pick<
    StudentEventDetail,
    'registration_is_open' | 'registration_state' | 'contest_status' | 'is_cancelled' | 'registration_enabled'
  >
): boolean {
  if (event.is_cancelled) return true;
  if (event.registration_enabled === false) return true;
  if (event.registration_is_open === false) return true;
  const state = (event.registration_state || '').toLowerCase();
  if (
    state === 'registration_closed' ||
    state === 'event_completed' ||
    state === 'event_started' ||
    state === 'cancelled' ||
    state === 'not_published'
  ) {
    return true;
  }
  const status = eventStatusKey(event);
  return status === 'completed' || status === 'closed' || status === 'cancelled';
}

export function eventLocationLabel(
  event: Pick<StudentEventListItem, 'mode' | 'venue'>,
  labels: { online: string; hybrid: string }
): string {
  const mode = (event.mode || '').toLowerCase();
  if (mode === 'online') return labels.online;
  if (mode === 'hybrid') {
    return event.venue ? `${labels.hybrid} · ${event.venue}` : labels.hybrid;
  }
  return event.venue || labels.online;
}

export function eventStatusKey(event: Pick<StudentEventListItem, 'contest_status' | 'registration_state' | 'is_cancelled' | 'is_postponed'>): string {
  if (event.is_cancelled) return 'cancelled';
  if (event.is_postponed) return 'postponed';
  if (event.registration_state === 'event_completed' || event.contest_status === 'closed') {
    return 'completed';
  }
  return event.contest_status || 'upcoming';
}

export function categoryLabelKey(category?: string | null): string {
  if (!category) return '';
  return `dashboard.studentEvents.category.${category}`;
}
