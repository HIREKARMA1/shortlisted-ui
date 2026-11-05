'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Check,
  Download,
  Eye,
  FileText,
  Loader2,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  profileService,
  type StudentUploadedResume,
} from '@/lib/services/profileService';
import { cn } from '@/lib/utils';

type StudentResumeSectionProps = {
  className?: string;
  reloadToken?: number;
  onCurrentChange?: (resumeUrl: string | null) => void;
};

function displayName(resume: StudentUploadedResume): string {
  const raw = (resume.original_filename || '').trim() || 'Resume.pdf';
  const name = raw.split(/[\\/]/).pop() || raw;
  if (/^[a-f0-9]{24,}(\.[a-z0-9]+)?$/i.test(name)) return 'Resume.pdf';
  return name;
}

export function StudentResumeSection({ className, reloadToken = 0, onCurrentChange }: StudentResumeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumes, setResumes] = useState<StudentUploadedResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadResumes = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) setLoading(true);
      const data = await profileService.getResumes();
      setResumes(data.resumes || []);
      const current = (data.resumes || []).find((item) => item.is_current);
      onCurrentChange?.(current?.file_url || null);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to load resumes';
      toast.error(String(msg));
    } finally {
      setLoading(false);
    }
  }, [onCurrentChange]);

  useEffect(() => {
    void loadResumes(reloadToken === 0);
  }, [loadResumes, reloadToken]);

  const handleUpload = async (file: File | null) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be less than 5MB.');
      return;
    }
    setUploading(true);
    try {
      await profileService.uploadResume(file);
      toast.success('Resume uploaded and set as current.');
      await loadResumes();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Failed to upload resume.';
      toast.error(String(msg));
    } finally {
      setUploading(false);
    }
  };

  const handleSetCurrent = async (resume: StudentUploadedResume) => {
    if (resume.is_current) return;
    setBusyId(resume.id);
    try {
      await profileService.setCurrentResume(resume.id);
      toast.success('Current resume updated.');
      await loadResumes();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Could not update current resume.';
      toast.error(String(msg));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (resume: StudentUploadedResume) => {
    const confirmed = window.confirm(
      resume.is_current
        ? 'Remove this current resume? Another saved resume will become current if available.'
        : 'Remove this resume from your profile?'
    );
    if (!confirmed) return;
    setBusyId(resume.id);
    try {
      await profileService.deleteResume(resume.id);
      toast.success('Resume removed.');
      await loadResumes();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        'Could not remove resume.';
      toast.error(String(msg));
    } finally {
      setBusyId(null);
    }
  };

  const current = resumes.find((item) => item.is_current) || null;
  const previous = resumes.filter((item) => !item.is_current);

  return (
    <section
      id="resume-upload"
      className={cn(
        'scroll-mt-24 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_8px_24px_rgba(30,64,175,0.05)] sm:p-6',
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-blue-600">
            <FileText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-slate-900">Resume</h2>
            <p className="text-sm text-slate-500">
              Manage your resumes. The current resume is used for applications by default.
            </p>
          </div>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(event) => {
              void handleUpload(event.target.files?.[0] ?? null);
              event.currentTarget.value = '';
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Upload resume
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
          Loading resumes…
        </div>
      ) : resumes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center">
          <p className="font-medium text-slate-700">No resumes yet</p>
          <p className="mt-1 text-sm text-slate-500">Upload a PDF resume to complete your profile.</p>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Upload resume
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {current && (
            <ResumeRow
              resume={current}
              busy={busyId === current.id}
              onSetCurrent={() => void handleSetCurrent(current)}
              onDelete={() => void handleDelete(current)}
            />
          )}

          {previous.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Saved resumes
              </p>
              <div className="space-y-2">
                {previous.map((resume) => (
                  <ResumeRow
                    key={resume.id}
                    resume={resume}
                    busy={busyId === resume.id}
                    onSetCurrent={() => void handleSetCurrent(resume)}
                    onDelete={() => void handleDelete(resume)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function ResumeRow({
  resume,
  busy,
  onSetCurrent,
  onDelete,
}: {
  resume: StudentUploadedResume;
  busy: boolean;
  onSetCurrent: () => void;
  onDelete: () => void;
}) {
  const name = displayName(resume);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border px-4 py-3 sm:flex-row sm:items-center',
        resume.is_current
          ? 'border-emerald-200 bg-emerald-50/70'
          : 'border-slate-200 bg-white'
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div
          className={cn(
            'grid h-10 w-10 shrink-0 place-items-center rounded-lg text-xs font-bold',
            resume.is_current ? 'bg-emerald-100 text-emerald-700' : 'bg-red-50 text-brand-red'
          )}
        >
          PDF
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-slate-900">{name}</p>
            {resume.is_current && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                <Check className="h-3 w-3" />
                Current resume
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {resume.is_current
              ? 'Used by default for job applications'
              : 'Saved on your profile'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
        <a
          href={resume.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700"
        >
          <Eye className="h-3.5 w-3.5" />
          View
        </a>
        <a
          href={resume.file_url}
          target="_blank"
          rel="noopener noreferrer"
          download={name}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 transition hover:bg-white hover:text-blue-700"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
        {!resume.is_current && (
          <button
            type="button"
            disabled={busy}
            onClick={onSetCurrent}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Star className="h-3.5 w-3.5" />}
            Make current
          </button>
        )}
        <button
          type="button"
          disabled={busy}
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Remove
        </button>
      </div>
    </div>
  );
}
