import type { StudentApplication, StudentJob } from '@/lib/types/studentJobs';

export type JobCardScheme = {
  bg: string;
  border: string;
  hover: string;
};

/** Rotating card backgrounds using Shortlisted brand palette */
export const JOB_CARD_SCHEMES: JobCardScheme[] = [
  { bg: 'bg-primary-50', border: 'border-primary-100', hover: 'hover:border-brand-blue' },
  { bg: 'bg-secondary-50', border: 'border-secondary-100', hover: 'hover:border-brand-sky' },
  { bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:border-brand-orange' },
  { bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:border-brand-green' },
  { bg: 'bg-yellow-50', border: 'border-yellow-200', hover: 'hover:border-brand-yellow' },
  { bg: 'bg-primary-50', border: 'border-primary-200', hover: 'hover:border-brand-blue' },
];

export function getJobCardScheme(index: number): JobCardScheme {
  return JOB_CARD_SCHEMES[index % JOB_CARD_SCHEMES.length];
}

export function normalizeJob(raw: Record<string, unknown>, applicationStatus?: string): StudentJob {
  const location = raw.location;
  return {
    id: String(raw.id),
    title: String(raw.title || ''),
    company_name: raw.company_name ? String(raw.company_name) : null,
    corporate_name: raw.corporate_name ? String(raw.corporate_name) : null,
    location: Array.isArray(location)
      ? location.map(String)
      : location
        ? String(location)
        : null,
    job_type: raw.job_type ? String(raw.job_type) : null,
    salary_min: raw.salary_min != null ? Number(raw.salary_min) : null,
    salary_max: raw.salary_max != null ? Number(raw.salary_max) : null,
    salary_currency: raw.salary_currency ? String(raw.salary_currency) : 'INR',
    application_deadline: raw.application_deadline ? String(raw.application_deadline) : null,
    description: raw.description ? String(raw.description) : null,
    requirements: raw.requirements ? String(raw.requirements) : null,
    responsibilities: raw.responsibilities ? String(raw.responsibilities) : null,
    industry: raw.industry ? String(raw.industry) : null,
    skills_required: Array.isArray(raw.skills_required)
      ? raw.skills_required.map(String)
      : null,
    experience_min: raw.experience_min != null ? Number(raw.experience_min) : null,
    experience_max: raw.experience_max != null ? Number(raw.experience_max) : null,
    created_at: raw.created_at ? String(raw.created_at) : null,
    can_apply: raw.can_apply !== false,
    application_status: applicationStatus || (raw.application_status ? String(raw.application_status) : null),
  };
}

export function normalizeApplication(raw: Record<string, unknown>): StudentApplication {
  return {
    id: String(raw.id),
    job_id: String(raw.job_id),
    job_title: raw.job_title ? String(raw.job_title) : null,
    company_name: raw.company_name ? String(raw.company_name) : null,
    corporate_name: raw.corporate_name ? String(raw.corporate_name) : null,
    status: String(raw.status || 'applied'),
    applied_at: raw.applied_at ? String(raw.applied_at) : null,
    updated_at: raw.updated_at ? String(raw.updated_at) : null,
    interview_date: raw.interview_date ? String(raw.interview_date) : null,
    offer_letter_url: raw.offer_letter_url ? String(raw.offer_letter_url) : null,
  };
}

export function getCompanyName(job: StudentJob | StudentApplication): string {
  return (
    job.company_name ||
    ('corporate_name' in job ? job.corporate_name : null) ||
    '—'
  );
}

export function formatJobLocation(location?: string | string[] | null): string {
  if (!location) return '—';
  if (Array.isArray(location)) return location.filter(Boolean).join(', ') || '—';
  return location;
}

export function formatSalaryRange(
  currency = 'INR',
  min?: number | null,
  max?: number | null,
  notSpecified = 'Not specified'
): string {
  if (min == null && max == null) return notSpecified;
  const fmt = (n: number) => n.toLocaleString('en-IN');
  if (min != null && max != null) return `${currency} ${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `${currency} ${fmt(min)}+`;
  if (max != null) return `${currency} up to ${fmt(max)}`;
  return notSpecified;
}

export function formatExperienceRange(
  min?: number | null,
  max?: number | null,
  notSpecified = 'Not specified'
): string {
  if (min == null && max == null) return notSpecified;
  if (min != null && max != null) return `${min}–${max} years`;
  if (min != null) return `${min}+ years`;
  if (max != null) return `Up to ${max} years`;
  return notSpecified;
}

export function formatJobDate(value?: string | null): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function isDeadlineExpired(deadline?: string | null): boolean {
  if (!deadline) return false;
  const d = new Date(deadline);
  return !Number.isNaN(d.getTime()) && d < new Date();
}

export function isDeadlineNear(deadline?: string | null): boolean {
  if (!deadline) return false;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return false;
  const diffDays = Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  return diffDays <= 7 && diffDays > 0;
}

export function canApplyToJob(job: StudentJob): boolean {
  if (job.application_status && job.application_status !== 'none') return false;
  if (isDeadlineExpired(job.application_deadline)) return false;
  return job.can_apply !== false;
}

export function jobTypeKey(jobType?: string | null): string {
  if (!jobType) return 'unknown';
  return jobType.toLowerCase().replace(/\s+/g, '_');
}

export function translateJobType(
  t: (path: string) => string,
  jobType?: string | null
): string {
  if (!jobType) return t('dashboard.jobs.notSpecified');
  const key = `dashboard.jobs.jobTypes.${jobTypeKey(jobType)}`;
  const label = t(key);
  return label === key ? jobType.replace(/_/g, ' ') : label;
}
