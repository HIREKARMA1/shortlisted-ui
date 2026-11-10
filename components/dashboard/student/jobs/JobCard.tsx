'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock,
  Eye,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import type { StudentJob } from '@/lib/types/studentJobs';
import {
  canApplyToJob,
  formatExperienceRange,
  formatJobDateShort,
  formatJobLocation,
  formatSalaryRange,
  getCompanyName,
  getDaysUntilDeadline,
  getJobCardScheme,
  isDeadlineExpired,
  jobTypeKey,
  translateJobType,
} from '@/lib/jobUtils';
import { cn } from '@/lib/utils';

type JobCardProps = {
  job: StudentJob;
  cardIndex?: number;
  onViewDescription: () => void;
  onApply: () => void;
  isApplying?: boolean;
  placed?: boolean;
};

export function JobCard({
  job,
  cardIndex = 0,
  onViewDescription,
  onApply,
  isApplying = false,
  placed = false,
}: JobCardProps) {
  const { t } = useTranslation();
  const scheme = getJobCardScheme(cardIndex);
  const company = getCompanyName(job);
  const typeLabel = translateJobType(t, job.job_type);
  const companyInitial = (company !== '-' ? company : job.title).charAt(0).toUpperCase();
  const isInternship = jobTypeKey(job.job_type) === 'internship';
  const payLabel = isInternship ? t('dashboard.jobs.stipend') : t('dashboard.jobs.salary');
  const salaryLabel = formatSalaryRange(
    job.salary_currency || 'INR',
    job.salary_min,
    job.salary_max,
    t('dashboard.jobs.notSpecified')
  );

  const status = job.application_status;
  const expired = isDeadlineExpired(job.application_deadline);
  const daysLeft = getDaysUntilDeadline(job.application_deadline);
  const applyDisabled = !canApplyToJob(job, { placed }) || isApplying;

  const applyLabel = (() => {
    if (isApplying) return t('common.actions.applying');
    if (status === 'applied') return t('dashboard.jobs.status.applied');
    if (status === 'selected') return t('dashboard.jobs.status.selected');
    if (status === 'rejected') return t('dashboard.jobs.status.rejected');
    if (status === 'shortlisted') return t('dashboard.jobs.status.shortlisted');
    if (status === 'pending') return t('dashboard.jobs.status.pending');
    if (expired) return t('dashboard.jobs.expired');
    return t('dashboard.jobs.applyNow');
  })();

  const closesLabel = (() => {
    if (!job.application_deadline) return null;
    const date = formatJobDateShort(job.application_deadline);
    if (daysLeft == null) return null;
    if (daysLeft < 0) return t('dashboard.jobs.closesExpired', { date });
    if (daysLeft === 0) return t('dashboard.jobs.closesToday', { date });
    return t('dashboard.jobs.closesWithDays', { date, count: daysLeft });
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="relative flex h-full flex-col rounded-2xl border border-line-default/80 bg-white p-5 shadow-card transition-shadow duration-200 hover:shadow-elevated"
      style={{ backgroundColor: scheme.cardBg }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {job.company_logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.company_logo}
              alt={company}
              className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-white/80"
            />
          ) : (
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white/80"
              style={{ backgroundColor: scheme.accent }}
            >
              {companyInitial}
            </div>
          )}
          <span className="truncate text-sm font-semibold text-ink-primary">
            {company !== '-' ? company : t('dashboard.jobs.company')}
          </span>
        </div>

        {job.job_type && (
          <span className="shrink-0 text-xs font-medium" style={{ color: scheme.muted }}>
            {typeLabel}
          </span>
        )}
      </div>

      <h3
        className="mb-3 line-clamp-2 text-xl font-bold leading-snug"
        style={{ color: scheme.accent }}
      >
        {job.title}
      </h3>

      <div
        className="mb-4 rounded-xl border border-slate-200/80 px-3.5 py-3"
        style={{ backgroundColor: scheme.softBg }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-wider"
          style={{ color: scheme.muted }}
        >
          {payLabel}
        </p>
        <p className="mt-0.5 text-xl font-bold tracking-tight" style={{ color: scheme.accent }}>
          {salaryLabel}
        </p>
      </div>

      <div className="mb-3 space-y-2 text-sm text-ink-secondary">
        <div className="flex min-w-0 items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" style={{ color: scheme.accent }} />
          <span className="truncate">{formatJobLocation(job.location)}</span>
        </div>
        <div className="flex min-w-0 items-center gap-2">
          <Briefcase className="h-4 w-4 shrink-0" style={{ color: scheme.accent }} />
          <span className="truncate">
            {formatExperienceRange(
              job.experience_min,
              job.experience_max,
              t('dashboard.jobs.notSpecified')
            )}
          </span>
        </div>
      </div>

      {job.skills_required && job.skills_required.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {job.skills_required.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-slate-200 bg-soft px-2.5 py-1 text-xs font-medium text-ink-secondary"
            >
              {skill}
            </span>
          ))}
          {job.skills_required.length > 3 && (
            <span className="rounded-full border border-slate-200 bg-soft px-2.5 py-1 text-xs font-medium text-ink-muted">
              +{job.skills_required.length - 3}
            </span>
          )}
        </div>
      )}

      {job.description && (
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-muted">{job.description}</p>
      )}

      <div className="mb-4 mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-slate-300/60 pt-3 text-xs text-ink-muted">
        {closesLabel ? (
          <div className="flex items-center gap-1.5">
            <span
              className={cn('h-2 w-2 shrink-0 rounded-full')}
              style={{ backgroundColor: expired ? '#d64246' : scheme.accent }}
            />
            <span className={cn(expired && 'text-brand-red')}>{closesLabel}</span>
          </div>
        ) : (
          <span />
        )}
        {job.created_at && (
          <span>
            {t('dashboard.jobs.posted')} {formatJobDateShort(job.created_at)}
          </span>
        )}
      </div>

      {status && status !== 'none' && (
        <div className="mb-3 text-center text-xs font-medium" style={{ color: scheme.accent }}>
          {status === 'applied' && (
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('dashboard.jobs.status.applied')}
            </span>
          )}
          {status === 'shortlisted' && (
            <span className="inline-flex items-center gap-1 text-brand-sky">
              <Users className="h-3.5 w-3.5" />
              {t('dashboard.jobs.status.shortlisted')}
            </span>
          )}
          {status === 'selected' && (
            <span className="inline-flex items-center gap-1 text-brand-green">
              <CheckCircle className="h-3.5 w-3.5" />
              {t('dashboard.jobs.status.selected')}
            </span>
          )}
          {status === 'rejected' && (
            <span className="inline-flex items-center gap-1 text-brand-red">
              <X className="h-3.5 w-3.5" />
              {t('dashboard.jobs.status.rejected')}
            </span>
          )}
          {status === 'pending' && (
            <span className="inline-flex items-center gap-1 text-brand-orange">
              <Clock className="h-3.5 w-3.5" />
              {t('dashboard.jobs.status.pending')}
            </span>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onViewDescription}
          className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-ink-primary transition hover:bg-soft"
        >
          <Eye className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{t('dashboard.jobs.exploreDetails')}</span>
        </button>
        {!placed && (
          <button
            type="button"
            onClick={onApply}
            disabled={applyDisabled}
            className="inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold text-white shadow-sm transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-55"
            style={{ backgroundColor: applyDisabled ? '#94a3b8' : scheme.accent }}
          >
            <span className="truncate">{applyLabel}</span>
            {!applyDisabled && <ArrowRight className="h-3.5 w-3.5 shrink-0" />}
          </button>
        )}
      </div>
    </motion.div>
  );
}
