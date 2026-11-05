'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileText, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { parseTrialError } from '@/lib/trial';
import { useTranslation } from '@/lib/i18n/context';
import {
  profileService,
  type StudentUploadedResume,
} from '@/lib/services/profileService';
import type { StudentJob } from '@/lib/types/studentJobs';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type ApplyWithResumeModalProps = {
  job: StudentJob;
  isOpen: boolean;
  isApplying: boolean;
  onClose: () => void;
  onConfirmApply: () => Promise<void>;
};

type ResumeChoice =
  | { type: 'existing'; resumeId: string }
  | { type: 'new' };

function resumeDisplayName(resume: StudentUploadedResume): string {
  const raw = (resume.original_filename || '').trim() || 'Resume.pdf';
  const name = raw.split(/[\\/]/).pop() || raw;
  if (/^[a-f0-9]{24,}(\.[a-z0-9]+)?$/i.test(name)) return 'Resume.pdf';
  return name;
}

export function ApplyWithResumeModal({
  job,
  isOpen,
  isApplying,
  onClose,
  onConfirmApply,
}: ApplyWithResumeModalProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [resumes, setResumes] = useState<StudentUploadedResume[]>([]);
  const [choice, setChoice] = useState<ResumeChoice | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const company =
    job.company_name || job.corporate_name || t('dashboard.jobs.company');

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoadingProfile(true);
    setPendingFile(null);
    setChoice(null);
    profileService
      .getResumes()
      .then((data) => {
        if (cancelled) return;
        const list = data.resumes || [];
        setResumes(list);
        const current = list.find((item) => item.is_current) || list[0];
        setChoice(current ? { type: 'existing', resumeId: current.id } : { type: 'new' });
      })
      .catch(() => {
        if (cancelled) return;
        setResumes([]);
        setChoice({ type: 'new' });
        toast.error(t('common.errors.network'));
      })
      .finally(() => {
        if (!cancelled) setLoadingProfile(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, t]);

  const canSubmit = useMemo(() => {
    if (loadingProfile || submitting || isApplying || !choice) return false;
    if (choice.type === 'existing') return resumes.some((item) => item.id === choice.resumeId);
    return Boolean(pendingFile);
  }, [loadingProfile, submitting, isApplying, choice, resumes, pendingFile]);

  const handleFilePick = (file: File | null) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error(t('dashboard.jobs.applyModal.pdfOnly'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('dashboard.jobs.applyModal.maxSize'));
      return;
    }
    setPendingFile(file);
    setChoice({ type: 'new' });
  };

  const handleSubmit = async () => {
    if (!canSubmit || !choice) return;
    setSubmitting(true);
    try {
      if (choice.type === 'new' && pendingFile) {
        await profileService.uploadResume(pendingFile);
        toast.success(t('dashboard.jobs.applyModal.resumeUpdated'));
      } else if (choice.type === 'existing') {
        const selected = resumes.find((item) => item.id === choice.resumeId);
        if (selected && !selected.is_current) {
          await profileService.setCurrentResume(selected.id);
        }
      }
      await onConfirmApply();
      onClose();
    } catch (err: unknown) {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      if (parseTrialError(detail)) return;
      toast.error(String(detail || t('common.errors.generic')));
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const busy = submitting || isApplying;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-resume-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t('dashboard.jobs.applyModal.close')}
        onClick={() => !busy && onClose()}
        disabled={busy}
      />

      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-line-default bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line-default px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="apply-resume-modal-title" className="text-lg font-semibold text-ink-primary">
                {t('dashboard.jobs.applyModal.title', { company })}
              </h2>
              <p className="mt-0.5 text-sm text-ink-muted">{job.title}</p>
            </div>
            <button
              type="button"
              onClick={() => !busy && onClose()}
              disabled={busy}
              className="rounded-lg p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink-primary disabled:opacity-50"
              aria-label={t('dashboard.jobs.applyModal.close')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full w-2/3 rounded-full bg-brand-blue" />
          </div>
          <p className="mt-1.5 text-right text-xs text-ink-muted">
            {t('dashboard.jobs.applyModal.stepLabel')}
          </p>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <div>
            <h3 className="text-base font-semibold text-ink-primary">
              {t('dashboard.jobs.applyModal.resumeLabel')}
              <span className="text-brand-red">*</span>
            </h3>
            <p className="mt-1 text-sm text-ink-muted">{t('dashboard.jobs.applyModal.resumeHint')}</p>
          </div>

          {loadingProfile ? (
            <div className="flex items-center gap-2 py-8 text-sm text-ink-secondary">
              <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
              {t('dashboard.jobs.applyModal.loading')}
            </div>
          ) : (
            <>
              {resumes.length > 0 && (
                <div className="space-y-2">
                  {resumes.map((resume) => {
                    const selected =
                      choice?.type === 'existing' && choice.resumeId === resume.id;
                    return (
                      <button
                        key={resume.id}
                        type="button"
                        onClick={() => setChoice({ type: 'existing', resumeId: resume.id })}
                        disabled={busy}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                          selected
                            ? 'border-brand-green bg-green-50/60 shadow-sm'
                            : 'border-line-default bg-white hover:border-brand-blue/40'
                        )}
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-xs font-bold text-brand-red">
                          PDF
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-ink-primary">
                              {resumeDisplayName(resume)}
                            </p>
                            <a
                              href={resume.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 rounded p-1 text-ink-muted hover:bg-white hover:text-brand-blue"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={t('dashboard.jobs.applyModal.download')}
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </div>
                          <p className="text-xs text-ink-muted">
                            {resume.is_current
                              ? t('dashboard.jobs.applyModal.profileResume')
                              : 'Saved resume'}
                          </p>
                        </div>
                        <span
                          className={cn(
                            'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                            selected
                              ? 'border-brand-green bg-brand-green'
                              : 'border-line-default bg-white'
                          )}
                          aria-hidden
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {pendingFile && (
                <button
                  type="button"
                  onClick={() => setChoice({ type: 'new' })}
                  disabled={busy}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                    choice?.type === 'new'
                      ? 'border-brand-green bg-green-50/60 shadow-sm'
                      : 'border-line-default bg-white hover:border-brand-blue/40'
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-blue/10">
                    <FileText className="h-5 w-5 text-brand-blue" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-primary">{pendingFile.name}</p>
                    <p className="text-xs text-ink-muted">
                      {t('dashboard.jobs.applyModal.newUpload')} ·{' '}
                      {(pendingFile.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      choice?.type === 'new'
                        ? 'border-brand-green bg-brand-green'
                        : 'border-line-default bg-white'
                    )}
                    aria-hidden
                  >
                    {choice?.type === 'new' && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>
              )}

              <div className="border-y border-line-default py-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    handleFilePick(e.target.files?.[0] ?? null);
                    e.target.value = '';
                  }}
                />
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full border border-brand-blue bg-white px-5 py-2 text-sm font-semibold text-brand-blue transition hover:bg-primary-50 disabled:opacity-50"
                >
                  {t('dashboard.jobs.applyModal.uploadResume')}
                </button>
                <p className="mt-2 text-xs text-ink-muted">{t('dashboard.jobs.applyModal.uploadHint')}</p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line-default bg-surface-muted/40 px-5 py-4">
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('dashboard.jobs.applyModal.cancel')}
          </Button>
          <Button onClick={() => void handleSubmit()} disabled={!canSubmit}>
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('dashboard.jobs.applyModal.submitting')}
              </>
            ) : (
              t('dashboard.jobs.applyModal.submit')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
