'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, Calendar, CheckCircle2, Clock, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  formatAssessmentDate,
  getAssessmentCardColorScheme,
} from '@/components/assessments/assessmentCardTheme';

export type StudentAssessmentItem = {
  id: string;
  external_id: string;
  assessment_name: string;
  instructions?: string | null;
  batch_name: string;
  start_time: string;
  end_time: string;
  total_duration_minutes: number;
  round_count: number;
  status_label: string;
  can_start: boolean;
  has_completed: boolean;
  has_given?: boolean;
  listed_only?: boolean;
  percentage?: number | null;
  results_published?: boolean;
  result_status?: string | null;
};

interface StudentAssessmentCardProps {
  assessment: StudentAssessmentItem;
  cardIndex?: number;
  statusLabel: string;
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    live: 'bg-green-50 text-green-800',
    upcoming: 'bg-yellow-50 text-yellow-800',
    completed: 'bg-blue-50 text-blue-800',
    expired: 'bg-gray-100 text-gray-700',
    missed: 'bg-red-50 text-red-800',
  };
  return colors[status] || 'bg-gray-50 text-gray-800';
}

export function StudentAssessmentCard({
  assessment,
  cardIndex = 0,
  statusLabel,
}: StudentAssessmentCardProps) {
  const cardColors = getAssessmentCardColorScheme(cardIndex);
  const examUrl = `/assessments/exam/${assessment.id}`;
  const resultsUrl = `/dashboard/student/assessments/${assessment.id}/results`;
  const showViewResults = Boolean(assessment.results_published);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        cardColors.bg,
        'rounded-xl border',
        cardColors.border,
        cardColors.hover,
        'group flex h-full flex-col transition-all duration-200 hover:shadow-md'
      )}
    >
      <div className="flex-shrink-0 border-b border-gray-200 p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="min-w-0 flex-1 pr-3">
            <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-primary-600">
              {assessment.assessment_name}
            </h3>
            <p className="mt-1 font-mono text-xs text-gray-500">{assessment.external_id}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                'rounded-full px-2 py-1 text-xs font-medium',
                getStatusColor(assessment.status_label)
              )}
            >
              {statusLabel}
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
              {assessment.batch_name}
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="truncate">{assessment.total_duration_minutes} mins</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="truncate">{assessment.round_count} Rounds</span>
          </div>
          <div className="col-span-2 flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {formatAssessmentDate(assessment.start_time)} – {formatAssessmentDate(assessment.end_time)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-4 line-clamp-3 text-sm text-gray-600">
          {assessment.instructions?.trim() || 'No description provided.'}
        </p>

        {assessment.has_completed ? (
          <p className="mb-4 text-sm font-medium text-slate-700">
            {assessment.results_published && assessment.percentage != null
              ? `Score: ${assessment.percentage}%`
              : assessment.result_status === 'evaluation_pending'
                ? 'Evaluation pending'
                : 'Completed · Results not published yet'}
          </p>
        ) : null}

        <div className="mt-auto space-y-2 pt-4">
          {assessment.listed_only ? null : (
            <>
              <Link href={examUrl} className="block w-full">
                <Button className="flex h-9 w-full items-center justify-center gap-2 bg-indigo-600 text-sm font-semibold normal-case tracking-normal hover:bg-indigo-700">
                  <FileText className="h-4 w-4" />
                  {assessment.has_completed ? 'View assessment' : 'View instructions'}
                </Button>
              </Link>
              {showViewResults ? (
                <Link href={resultsUrl} className="block w-full">
                  <Button
                    variant="secondary"
                    className="flex h-9 w-full items-center justify-center gap-2 text-sm font-semibold normal-case tracking-normal"
                  >
                    <BarChart3 className="h-4 w-4" />
                    View Results
                  </Button>
                </Link>
              ) : null}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
