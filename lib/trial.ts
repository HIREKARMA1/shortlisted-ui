export type StudentPlan = 'premium' | 'trial' | 'expired' | 'locked' | 'inactive';

export type TrialFeature = 'application' | 'class' | 'assessment';

export function parseTrialError(detail: unknown): 'TRIAL_LIMIT' | 'TRIAL_EXPIRED' | null {
  if (typeof detail !== 'string') return null;
  if (detail.startsWith('TRIAL_LIMIT:')) return 'TRIAL_LIMIT';
  if (detail.startsWith('TRIAL_EXPIRED:')) return 'TRIAL_EXPIRED';
  return null;
}

export function formatTrialDate(iso?: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
