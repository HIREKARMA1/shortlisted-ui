'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { ClipboardCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { useTrialUi } from '@/components/dashboard/student/StudentTrialChrome';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  StudentAssessmentCard,
  type StudentAssessmentItem,
} from '@/components/assessments/StudentAssessmentCard';
import { cn } from '@/lib/utils';

export function StudentAssessmentsView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const { trial } = useTrialUi();
  const [assessments, setAssessments] = useState<StudentAssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);

  const assessmentLimit = trial?.limits?.assessments;
  const showTrialQuota = trial?.plan === 'trial' || trial?.plan === 'expired';
  const trialExhausted =
    showTrialQuota &&
    typeof assessmentLimit?.used === 'number' &&
    typeof assessmentLimit?.limit === 'number' &&
    assessmentLimit.used >= assessmentLimit.limit;

  useEffect(() => {
    setLoading(true);
    api
      .getStudentAssessments()
      .then((rows) => setAssessments(rows as StudentAssessmentItem[]))
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.studentAssessments.title')}
      subtitle={t('dashboard.studentAssessments.subtitle')}
      onLogout={logout}
    >
      {showTrialQuota && assessmentLimit ? (
        <div
          className={cn(
            'mb-6 rounded-xl border px-4 py-3 text-sm',
            trialExhausted
              ? 'border-amber-200 bg-amber-50 text-amber-950'
              : 'border-blue-100 bg-blue-50 text-blue-950'
          )}
        >
          <p className="font-medium">
            {t('dashboard.studentAssessments.trialQuota', {
              used: String(assessmentLimit.used ?? 0),
              limit: String(assessmentLimit.limit ?? 1),
            })}
          </p>
          {trialExhausted ? (
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed">
                {t('dashboard.studentAssessments.trialQuotaExhausted')}
              </p>
              <Link
                href="/subscribe"
                className="inline-flex shrink-0 items-center justify-center rounded-md bg-brand-orange px-4 py-2 text-xs font-bold uppercase tracking-wide text-white"
              >
                {t('dashboard.studentAssessments.upgradePremium')}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-24 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <ClipboardCheck className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">
            {t('dashboard.studentAssessments.empty')}
          </h3>
          <p className="mx-auto max-w-sm text-gray-500">
            {t('dashboard.studentAssessments.solviqNote')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assessments.map((row, index) => (
            <StudentAssessmentCard
              key={row.id}
              assessment={row}
              cardIndex={index}
              statusLabel={t(`dashboard.studentAssessments.status.${row.status_label}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
