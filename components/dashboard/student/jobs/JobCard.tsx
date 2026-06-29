'use client';

import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  X,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import type { StudentJob } from '@/lib/types/studentJobs';
import {
  canApplyToJob,
  formatExperienceRange,
  formatJobDate,
  formatJobLocation,
  formatSalaryRange,
  getCompanyName,
  getJobCardScheme,
  isDeadlineExpired,
  isDeadlineNear,
  translateJobType,
} from '@/lib/jobUtils';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type JobCardProps = {
  job: StudentJob;
  cardIndex?: number;
  onViewDescription: () => void;
  onApply: () => void;
  isApplying?: boolean;
};

export function JobCard({
  job,
  cardIndex = 0,
  onViewDescription,
  onApply,
  isApplying = false,
}: JobCardProps) {
  const { t } = useTranslation();
  const scheme = getJobCardScheme(cardIndex);
  const company = getCompanyName(job);
  const typeLabel = translateJobType(t, job.job_type);

  const status = job.application_status;
  const expired = isDeadlineExpired(job.application_deadline);
  const applyDisabled = !canApplyToJob(job) || isApplying;

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'flex h-full flex-col rounded-xl border transition-all duration-200 hover:shadow-card',
        scheme.bg,
        scheme.border,
        scheme.hover
      )}
    >
      <div className="flex-shrink-0 border-b border-line-default/60 p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-lg font-semibold text-ink-primary group-hover:text-brand-blue">
              {job.title}
            </h3>
            {company !== '-' && (
              <p className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                <Building2 className="h-4 w-4 shrink-0" />
                <span className="truncate">{company}</span>
              </p>
            )}
          </div>
          {job.job_type && (
            <span className="shrink-0 rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-brand-blue ring-1 ring-primary-100">
              {typeLabel}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-ink-secondary">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin className="h-4 w-4 shrink-0 text-brand-sky" />
            <span className="truncate">{formatJobLocation(job.location)}</span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="truncate">
              {formatSalaryRange(
                job.salary_currency || 'INR',
                job.salary_min,
                job.salary_max,
                t('dashboard.jobs.notSpecified')
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <Briefcase className="h-4 w-4 shrink-0 text-brand-blue" />
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
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.skills_required.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-md bg-white/70 px-2 py-0.5 text-xs text-ink-secondary ring-1 ring-line-default/60"
              >
                {skill}
              </span>
            ))}
            {job.skills_required.length > 3 && (
              <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs text-ink-muted">
                +{job.skills_required.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {job.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-ink-muted">{job.description}</p>
        )}

        <div className="mb-4 flex-1 space-y-1.5 text-xs text-ink-muted">
          {job.application_deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {t('dashboard.jobs.deadline')}: {formatJobDate(job.application_deadline)}
                {isDeadlineNear(job.application_deadline) && (
                  <span className="ml-1 font-medium text-brand-orange">
                    ({t('dashboard.jobs.deadlineNear')})
                  </span>
                )}
                {expired && (
                  <span className="ml-1 font-medium text-brand-red">({t('dashboard.jobs.expired')})</span>
                )}
              </span>
            </div>
          )}
          {job.created_at && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5" />
              <span>
                {t('dashboard.jobs.posted')} {formatJobDate(job.created_at)}
              </span>
            </div>
          )}
        </div>

        {status && status !== 'none' && (
          <div className="mb-3 text-center text-xs font-medium text-brand-blue">
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

        <div className="mt-auto flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1 py-2 text-xs" onClick={onViewDescription}>
            {t('dashboard.jobs.viewJd')}
          </Button>
          <Button
            variant={applyDisabled ? 'ghost' : 'accent'}
            className="flex-1 py-2 text-xs"
            onClick={onApply}
            disabled={applyDisabled}
          >
            {applyLabel}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
