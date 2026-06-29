'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  Download,
  Eye,
  GraduationCap,
  Mail,
  Phone,
  User,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { applicationBadgeTone } from '@/lib/status';
import { exportAppliedStudentsToCSV, type AppliedStudentExport } from '@/utils/exportToExcel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

type ApplicantRow = Record<string, unknown>;
type JobRow = Record<string, unknown>;

type AppliedStudentsModalProps = {
  job: JobRow | null;
  applicants: ApplicantRow[];
  loading: boolean;
  onClose: () => void;
};

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapApplicantToExport(app: ApplicantRow, batchName?: string): AppliedStudentExport {
  const student = (app.student as Record<string, unknown>) || {};
  return {
    id: String(student.id || app.application_id || ''),
    name: String(student.name || ''),
    email: String(student.email || ''),
    phone: student.phone ? String(student.phone) : undefined,
    college: student.college ? String(student.college) : undefined,
    branch: student.branch ? String(student.branch) : undefined,
    graduation_year:
      student.graduation_year != null ? Number(student.graduation_year) : undefined,
    skills: student.skills ? String(student.skills) : undefined,
    preferred_roles: student.preferred_roles ? String(student.preferred_roles) : undefined,
    batch_name: batchName,
    applied_at: app.applied_at ? String(app.applied_at) : undefined,
    status: app.status ? String(app.status) : undefined,
    resume_url: student.resume_url ? String(student.resume_url) : undefined,
  };
}

function ProfilePanel({
  applicant,
  onClose,
}: {
  applicant: ApplicantRow;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const student = (applicant.student as Record<string, unknown>) || {};

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-elevated"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-primary">{t('dashboard.adminJobs.profileTitle')}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-surface-muted">
            <X className="h-5 w-5 text-ink-muted" />
          </button>
        </div>
        <dl className="space-y-3 text-sm">
          {([
            ['name', student.name],
            ['email', student.email],
            ['phone', student.phone],
            ['college', student.college],
            ['branch', student.branch],
            ['graduation_year', student.graduation_year],
            ['skills', student.skills],
            ['preferred_roles', student.preferred_roles],
          ] as [string, unknown][]).map(([key, value]) =>
            value ? (
              <div key={key}>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
                  {t(`dashboard.adminJobs.profile.${key}`)}
                </dt>
                <dd className="mt-1 text-ink-primary">{String(value)}</dd>
              </div>
            ) : null,
          )}
        </dl>
        {Boolean(student.resume_url) && (
          <a
            href={String(student.resume_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="link-brand mt-4 inline-block text-sm"
          >
            {t('dashboard.adminJobs.viewResume')}
          </a>
        )}
      </motion.div>
    </div>
  );
}

export function AppliedStudentsModal({ job, applicants, loading, onClose }: AppliedStudentsModalProps) {
  const { t } = useTranslation();
  const [profileApplicant, setProfileApplicant] = useState<ApplicantRow | null>(null);

  if (!job) return null;

  const batchName = String(job.batch_name || '');
  const companyName = job.company_name ? String(job.company_name) : undefined;

  const handleExport = () => {
    if (applicants.length === 0) {
      toast.error(t('dashboard.adminJobs.exportEmpty'));
      return;
    }
    try {
      exportAppliedStudentsToCSV(
        applicants.map((app) => mapApplicantToExport(app, batchName)),
        String(job.title || 'Job'),
        companyName,
        batchName,
      );
      toast.success(t('dashboard.adminJobs.exportSuccess'));
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-line-default p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-ink-primary">
                    {t('dashboard.adminJobs.appliedStudentsTitle')}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {t('dashboard.adminJobs.appliedStudentsSubtitle')}
                  </p>
                </div>
                <Button variant="ghost" className="px-2 py-2" onClick={onClose} aria-label="Close">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-4 rounded-lg bg-surface-muted p-4">
                <h3 className="font-medium text-ink-primary">{String(job.title)}</h3>
                {companyName ? (
                  <p className="mt-1 text-sm text-ink-muted">
                    {t('dashboard.adminJobs.companyLabel')}: {companyName}
                  </p>
                ) : null}
                <p className="mt-1 text-sm text-ink-muted">
                  {t('dashboard.adminJobs.totalApplications', { count: applicants.length })}
                </p>
                {batchName ? (
                  <p className="mt-1 text-sm text-ink-muted">
                    {t('dashboard.adminJobs.columns.batch')}: {batchName}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-6">
              {loading ? (
                <LoadingState />
              ) : applicants.length === 0 ? (
                <EmptyState message={t('dashboard.adminJobs.noApplicants')} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-line-default text-xs font-semibold uppercase tracking-wide text-ink-muted">
                        <th className="px-4 py-3">{t('dashboard.adminJobs.table.student')}</th>
                        <th className="px-4 py-3">{t('dashboard.adminJobs.table.batch')}</th>
                        <th className="px-4 py-3">{t('dashboard.adminJobs.table.education')}</th>
                        <th className="px-4 py-3">{t('dashboard.adminJobs.table.appliedDate')}</th>
                        <th className="px-4 py-3">{t('dashboard.adminJobs.table.status')}</th>
                        <th className="px-4 py-3">{t('dashboard.adminJobs.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((app) => {
                        const student = (app.student as Record<string, unknown>) || {};
                        return (
                          <tr
                            key={String(app.application_id)}
                            className="border-b border-line-default hover:bg-surface-muted/70"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-disha-500 to-brand-sky text-white">
                                  <User className="h-5 w-5" />
                                </div>
                                <div>
                                  <p className="font-medium text-ink-primary">{String(student.name)}</p>
                                  <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                                    <Mail className="h-3.5 w-3.5" />
                                    {String(student.email)}
                                  </p>
                                  {student.phone ? (
                                    <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
                                      <Phone className="h-3.5 w-3.5" />
                                      {String(student.phone)}
                                    </p>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm text-ink-muted">
                                <GraduationCap className="h-4 w-4" />
                                <span className="font-medium text-ink-primary">{batchName}</span>
                              </div>
                              {student.college ? (
                                <div className="mt-1 flex items-center gap-2 text-sm text-ink-muted">
                                  <Building2 className="h-4 w-4" />
                                  {String(student.college)}
                                </div>
                              ) : null}
                            </td>
                            <td className="px-4 py-4 text-sm text-ink-muted">
                              <p className="text-ink-primary">{student.branch ? String(student.branch) : '-'}</p>
                              {student.graduation_year ? (
                                <p>{t('dashboard.adminJobs.gradYear', { year: String(student.graduation_year) })}</p>
                              ) : null}
                              {student.skills ? <p className="line-clamp-2">{String(student.skills)}</p> : null}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-sm text-ink-muted">
                                <Calendar className="h-4 w-4" />
                                {formatDate(app.applied_at)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <Badge tone={applicationBadgeTone(String(app.status))}>{String(app.status)}</Badge>
                            </td>
                            <td className="px-4 py-4">
                              <Button
                                variant="secondary"
                                className="px-3 py-1.5 text-xs"
                                onClick={() => setProfileApplicant(app)}
                              >
                                <Eye className="mr-1.5 h-4 w-4" />
                                {t('dashboard.adminJobs.viewProfile')}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-line-default p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-ink-muted">
                {t('dashboard.adminJobs.showingApplications', { count: applicants.length })}
              </p>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={onClose}>
                  {t('common.actions.cancel')}
                </Button>
                {applicants.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleExport}
                    className="inline-flex items-center rounded-lg bg-gradient-to-r from-primary-500 to-brand-sky px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-primary-600 hover:to-brand-blue"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {t('dashboard.adminJobs.exportCsv')}
                  </button>
                ) : null}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {profileApplicant ? (
        <ProfilePanel applicant={profileApplicant} onClose={() => setProfileApplicant(null)} />
      ) : null}
    </>
  );
}
