'use client';

import { CheckCircle2, FileText, Loader2, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { hasResume } from '@/lib/resumeRequiredToast';
import { profileService } from '@/lib/services/profileService';
import { FileUpload } from '@/components/ui/FileUpload';
import { cn } from '@/lib/utils';

type StudentResumeUploadModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUploaded: (fileUrl: string) => void;
};

export function StudentResumeUploadModal({ isOpen, onClose, onUploaded }: StudentResumeUploadModalProps) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setResumeUrl(null);
      setCompleted(false);
      setUploading(false);
    }
  }, [isOpen]);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const result = (await profileService.uploadResume(file)) as { file_url?: string };
      const url = result.file_url ?? '';
      setResumeUrl(url);
      setCompleted(true);
      toast.success(t('dashboard.student.resumeModal.success'));
      window.setTimeout(() => {
        onUploaded(url);
      }, 1200);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('dashboard.student.resumeModal.uploadFailed');
      toast.error(String(msg));
    } finally {
      setUploading(false);
    }
  };

  const canClose = !uploading;

  const handleClose = () => {
    if (!canClose) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t('dashboard.student.resumeModal.dismiss')}
        onClick={handleClose}
        disabled={!canClose}
      />

      <div
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-line-default bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-line-default px-6 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-brand-blue">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h2 id="resume-modal-title" className="text-lg font-semibold text-ink-primary">
                  {t('dashboard.student.resumeModal.title')}
                </h2>
                <p className="text-sm text-ink-muted">{t('dashboard.student.resumeModal.subtitle')}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={!canClose}
              className="rounded-lg p-1.5 text-ink-muted transition hover:bg-surface-muted hover:text-ink-primary disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t('dashboard.student.resumeModal.dismiss')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 px-6 py-5">
          {completed ? (
            <div className="flex flex-col items-center rounded-lg border border-brand-green/30 bg-green-50 px-4 py-6 text-center">
              <CheckCircle2 className="mb-2 h-8 w-8 text-brand-green" />
              <p className="font-medium text-ink-primary">{t('dashboard.student.resumeModal.completeTitle')}</p>
              <p className="mt-1 text-sm text-ink-muted">{t('dashboard.student.resumeModal.completeHint')}</p>
            </div>
          ) : (
            <>
              <div className={cn(uploading && 'pointer-events-none opacity-70')}>
                <FileUpload
                  type="document"
                  currentFile={resumeUrl}
                  onFileSelect={handleUpload}
                  disabled={uploading}
                  placeholder={t('dashboard.student.resumeModal.uploadPlaceholder')}
                />
              </div>

              {uploading && (
                <div className="flex items-center gap-2 text-sm text-ink-secondary">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-blue" />
                  {t('dashboard.student.resumeModal.uploading')}
                </div>
              )}

              <p className="text-xs text-ink-muted">{t('dashboard.student.resumeModal.footerHint')}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function StudentResumePrompt() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);

  const checkResume = useCallback(async () => {
    if (typeof window === 'undefined' || !localStorage.getItem('access_token')) {
      setChecked(true);
      return;
    }
    if (pathname.startsWith('/dashboard/student/profile')) {
      setChecked(true);
      return;
    }

    try {
      const profile = await profileService.getProfile();
      if (!hasResume(profile)) {
        setOpen(true);
      }
    } catch {
      // Ignore — dashboard pages handle their own errors
    } finally {
      setChecked(true);
    }
  }, [pathname]);

  useEffect(() => {
    setChecked(false);
    checkResume();
  }, [checkResume]);

  if (!checked) return null;

  return (
    <StudentResumeUploadModal
      isOpen={open}
      onClose={() => setOpen(false)}
      onUploaded={() => setOpen(false)}
    />
  );
}
