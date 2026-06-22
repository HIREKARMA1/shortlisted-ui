'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { AssessmentList } from '@/components/admin/AssessmentList';
import { AssessmentDetailsModal } from '@/components/admin/assessments/AssessmentDetailsModal';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { assessmentBasePath } from '@/lib/assessmentDashboard';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { api } from '@/lib/api';

export function AssessmentsListPage({ role }: { role: DashboardRole }) {
  const basePath = assessmentBasePath(role);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ status: 'all', mode: 'all', search: '' });
  const [selectedAssessment, setSelectedAssessment] = useState<any | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchAssessments = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminAssessments();
      setAssessments(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load assessments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter((assessment) => {
    if (filters.status !== 'all' && assessment.status !== filters.status) return false;
    if (filters.mode !== 'all' && assessment.mode !== filters.mode) return false;
    if (
      filters.search &&
      !assessment.assessment_name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout role={role} title="Assessments">
      <div className="min-h-screen space-y-8 bg-transparent">
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center lg:gap-6">
            <div className="min-w-0 flex-1">
              <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
                Assessments & Exams
              </h1>
              <p className="mb-3 text-lg text-gray-600">
                Create multi-round tests, share exam links, and review student analytics.
              </p>
            </div>
            <Link href={`${basePath}/create`}>
              <Button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 font-semibold normal-case tracking-normal shadow-md transition-all hover:bg-purple-700 hover:shadow-lg sm:w-auto">
                <Plus size={20} strokeWidth={2.5} />
                <span>Create Assessment</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search assessments..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 outline-none transition-all placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <svg
                className="absolute left-3.5 top-3 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <select
              value={filters.mode}
              onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Modes</option>
              <option value="ADMIN">Admin</option>
              <option value="HIRING">Hiring</option>
            </select>
          </div>
        </div>

        {error && !isLoading && (
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <svg
              className="h-5 w-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {error}
          </div>
        )}

        <AssessmentList
          assessments={filteredAssessments}
          loading={isLoading}
          basePath={basePath}
          onEdit={(id) => {
            window.location.href = `${basePath}/${id}/edit`;
          }}
          onView={(id) => {
            const assessment = assessments.find((a) => a.id === id);
            if (assessment) {
              setSelectedAssessment(assessment);
              setIsViewModalOpen(true);
            }
          }}
          onDelete={async (id) => {
            try {
              await api.deleteAssessment(id);
              fetchAssessments();
            } catch {
              alert('Failed to delete assessment');
            }
          }}
        />

        <AssessmentDetailsModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          assessment={selectedAssessment}
        />
      </div>
    </DashboardLayout>
  );
}
