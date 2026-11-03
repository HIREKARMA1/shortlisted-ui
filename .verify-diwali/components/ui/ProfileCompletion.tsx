'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProfileCompletionProps = {
  completion: number;
  completionData?: {
    completed_fields: string[];
    missing_fields: string[];
    total_fields: number;
    completed_count: number;
    core_percentage?: number;
    extended_percentage?: number;
    can_apply_for_jobs?: boolean;
  };
  className?: string;
};

function progressColor(percentage: number) {
  if (percentage >= 80) return 'bg-brand-green';
  if (percentage >= 60) return 'bg-brand-yellow';
  if (percentage >= 40) return 'bg-brand-orange';
  return 'bg-brand-red';
}

function textColor(percentage: number) {
  if (percentage >= 80) return 'text-brand-green';
  if (percentage >= 60) return 'text-brand-orange';
  if (percentage >= 40) return 'text-brand-orange';
  return 'text-brand-red';
}

function formatField(name: string) {
  if (name === 'phone') return 'Contact number';
  return name
    .replace(/_/g, ' ')
    .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
}

export function ProfileCompletion({ completion, completionData, className }: ProfileCompletionProps) {
  const completedCount = completionData?.completed_count ?? 0;
  const totalFields = completionData?.total_fields ?? 0;
  const completedFieldsList = completionData?.completed_fields ?? [];
  const missingFieldsList = completionData?.missing_fields ?? [];

  return (
    <div
      className={cn(
        'rounded-xl border border-line-default bg-white p-6 shadow-card',
        className
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-ink-primary">Profile Completion</h3>
          <p className="text-sm text-ink-muted">Complete your profile to increase your chances</p>
        </div>
        <div className="text-right">
          <div className={cn('text-2xl font-bold', textColor(completion))}>{completion}%</div>
          <div className="text-xs text-ink-muted">
            {completedCount} of {totalFields} fields
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-3 w-full rounded-full bg-surface-muted">
          <div
            className={cn('h-3 rounded-full transition-all duration-500', progressColor(completion))}
            style={{ width: `${completion}%` }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {completionData?.core_percentage != null && (
        <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-line-default bg-primary-50/50 p-3">
            <p className="text-xs font-medium uppercase text-ink-muted">Basic Info (75%)</p>
            <p className="mt-1 font-semibold text-brand-blue">{completionData.core_percentage}%</p>
          </div>
          <div className="rounded-lg border border-line-default bg-secondary-50/50 p-3">
            <p className="text-xs font-medium uppercase text-ink-muted">Other sections (25%)</p>
            <p className="mt-1 font-semibold text-brand-blue">{completionData.extended_percentage ?? 0}%</p>
          </div>
        </div>
      )}

      {completionData?.can_apply_for_jobs === false && (
        <div className="mb-4 rounded-lg border border-brand-orange/30 bg-brand-orange/5 p-3 text-sm text-ink-secondary">
          Complete your name, contact number, and resume to apply for jobs.
        </div>
      )}

      <div className="space-y-4">
        {completedFieldsList.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-brand-green">
              <CheckCircle className="h-4 w-4" />
              <span>Completed ({completedFieldsList.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {completedFieldsList.slice(0, 6).map((field) => (
                <div
                  key={field}
                  className="rounded bg-green-50 px-2 py-1 text-xs text-ink-secondary"
                >
                  {formatField(field)}
                </div>
              ))}
              {completedFieldsList.length > 6 && (
                <div className="px-2 py-1 text-xs text-ink-muted">
                  +{completedFieldsList.length - 6} more
                </div>
              )}
            </div>
          </div>
        )}

        {missingFieldsList.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-brand-red">
              <AlertCircle className="h-4 w-4" />
              <span>Missing ({missingFieldsList.length})</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {missingFieldsList.slice(0, 6).map((field) => (
                <div key={field} className="rounded bg-red-50 px-2 py-1 text-xs text-ink-secondary">
                  {formatField(field)}
                </div>
              ))}
              {missingFieldsList.length > 6 && (
                <div className="px-2 py-1 text-xs text-ink-muted">
                  +{missingFieldsList.length - 6} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {completion < 100 && (
        <div className="mt-6 rounded-lg border border-brand-sky/30 bg-primary-50 p-4">
          <h5 className="mb-2 text-sm font-medium text-brand-blue">Tips to complete your profile</h5>
          <ul className="space-y-1 text-xs text-ink-secondary">
            <li>• Add your full name</li>
            <li>• Add your 10-digit contact number</li>
            <li>• Upload your resume (PDF)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
