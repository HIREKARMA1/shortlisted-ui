import Link from 'next/link';
import toast from 'react-hot-toast';
import type { StudentProfile } from '@/lib/services/profileService';

export const RESUME_REQUIRED_ERROR = 'RESUME_REQUIRED';

export function hasResume(profile: Pick<StudentProfile, 'resume'> | null | undefined): boolean {
  return Boolean(profile?.resume?.trim());
}

export function isResumeRequiredError(detail: unknown): boolean {
  if (detail === RESUME_REQUIRED_ERROR) return true;
  if (typeof detail === 'string') {
    const lower = detail.toLowerCase();
    return lower.includes('resume') && (lower.includes('required') || lower.includes('upload') || lower.includes('complete'));
  }
  return false;
}

export function showResumeRequiredToast(message: string, linkLabel: string) {
  toast.error(
    (t) => (
      <div className="max-w-sm text-sm leading-snug">
        <p>{message}</p>
        <Link
          href="/dashboard/student/profile#resume"
          className="mt-2 inline-block font-semibold text-brand-blue underline hover:text-brand-sky"
          onClick={() => toast.dismiss(t.id)}
        >
          {linkLabel}
        </Link>
      </div>
    ),
    { duration: 8000 }
  );
}
