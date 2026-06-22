'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronDown, Filter } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  StudentAssessmentCard,
  type StudentAssessmentItem,
} from '@/components/assessments/StudentAssessmentCard';
import { cn } from '@/lib/utils';

type AssessmentFilter = 'pending' | 'given';

const FILTER_OPTIONS: AssessmentFilter[] = ['pending', 'given'];

export function StudentAssessmentsView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [assessments, setAssessments] = useState<StudentAssessmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<AssessmentFilter>('pending');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getStudentAssessments()
      .then((rows) => setAssessments(rows as StudentAssessmentItem[]))
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredAssessments = useMemo(() => {
    return assessments.filter((row) =>
      filter === 'given' ? row.has_given || row.has_completed : !(row.has_given || row.has_completed)
    );
  }, [assessments, filter]);

  const filterLabel =
    filter === 'given'
      ? t('dashboard.studentAssessments.filterGiven')
      : t('dashboard.studentAssessments.filterPending');

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.studentAssessments.title')}
      subtitle={t('dashboard.studentAssessments.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 flex justify-end">
        <div className="relative" ref={filterRef}>
          <button
            type="button"
            onClick={() => setFilterOpen((open) => !open)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:border-gray-300"
          >
            <Filter className="h-4 w-4" />
            {t('dashboard.studentAssessments.filter')}
            <span className="text-brand-blue">{filterLabel}</span>
            <ChevronDown className={cn('h-4 w-4 transition-transform', filterOpen && 'rotate-180')} />
          </button>

          {filterOpen && (
            <div className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFilter(option);
                    setFilterOpen(false);
                  }}
                  className={cn(
                    'w-full px-4 py-2.5 text-left text-sm transition-colors',
                    filter === option
                      ? 'bg-blue-50 font-semibold text-brand-blue'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {option === 'given'
                    ? t('dashboard.studentAssessments.filterGiven')
                    : t('dashboard.studentAssessments.filterPending')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-gray-200 bg-gray-100"
            />
          ))}
        </div>
      ) : filteredAssessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-4 py-24 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <Filter className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-1 text-lg font-semibold text-gray-900">
            {filter === 'given'
              ? t('dashboard.studentAssessments.emptyGiven')
              : t('dashboard.studentAssessments.empty')}
          </h3>
          <p className="mx-auto max-w-sm text-gray-500">
            {t('dashboard.studentAssessments.solviqNote')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAssessments.map((row, index) => (
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
