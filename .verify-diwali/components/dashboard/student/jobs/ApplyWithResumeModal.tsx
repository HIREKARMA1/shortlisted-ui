'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Download, FileText, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { hasResume } from '@/lib/resumeRequiredToast';
import { profileService, type StudentProfile } from '@/lib/services/profileService';
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

type ResumeChoice = 'existing' | 'new';

function resumeFileName(url: string | undefined | null): string {
  if (!url) return 'Resume.pdf';
  try {
    const path = decodeURIComponent(new URL(url).pathname);
    const name = path.split('/').filter(Boolean).pop();
    if (name) return name.includes('.') ? name : `${name}.pdf`;
  } catch {
    // ignore
  }
  return 'Resume.pdf';
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
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [choice, setChoice] = useState<ResumeChoice>('existing');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const company =
    job.company_name || job.corporate_name || t('dashboard.jobs.company');
  const existingResume = profile?.resume?.trim() || '';
  const hasExisting = Boolean(existingResume);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    setLoadingProfile(true);
    setPendingFile(null);
    setChoice('existing');
    profileService
      .getProfile()
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        setChoice(hasResume(data) ? 'existing' : 'new');
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
        setChoice('new');
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
    if (loadingProfile || submitting || isApplying) return false;
    if (choice === 'existing') return hasExisting;
    return Boolean(pendingFile);
  }, [loadingProfile, submitting, isApplying, choice, hasExisting, pendingFile]);

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
    setChoice('new');
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      if (choice === 'new' && pendingFile) {
        await profileService.uploadResume(pendingFile);
        toast.success(t('dashboard.jobs.applyModal.resumeUpdated'));
      }
      await onConfirmApply();
      onClose();
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(detail));
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
              {hasExisting && (
                <button
                  type="button"
                  onClick={() => setChoice('existing')}
                  disabled={busy}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                    choice === 'existing'
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
                        {resumeFileName(existingResume)}
                      </p>
                      <a
                        href={existingResume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded p-1 text-ink-muted hover:bg-white hover:text-brand-blue"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={t('dashboard.jobs.applyModal.download')}
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-xs text-ink-muted">{t('dashboard.jobs.applyModal.profileResume')}</p>
                  </div>
                  <span
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2',
                      choice === 'existing'
                        ? 'border-brand-green bg-brand-green'
                        : 'border-line-default bg-white'
                    )}
                    aria-hidden
                  >
                    {choice === 'existing' && <span className="h-2 w-2 rounded-full bg-white" />}
                  </span>
                </button>
              )}

              {pendingFile && (
                <button
                  type="button"
                  onClick={() => setChoice('new')}
                  disabled={busy}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition',
                    choice === 'new'
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
                      choice === 'new'
                        ? 'border-brand-green bg-brand-green'
                        : 'border-line-default bg-white'
                    )}
                    aria-hidden
                  >
                    {choice === 'new' && <span className="h-2 w-2 rounded-full bg-white" />}
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
