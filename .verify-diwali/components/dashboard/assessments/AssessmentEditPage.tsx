'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { AssessmentForm } from '@/components/admin/AssessmentForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { assessmentBasePath } from '@/lib/assessmentDashboard';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { utcIsoToDatetimeLocal } from '@/lib/datetime';
import { api } from '@/lib/api';

export function AssessmentEditPage({ role }: { role: DashboardRole }) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const basePath = assessmentBasePath(role);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const rows =
          role === 'super_admin' ? await api.listAllBatches() : await api.listMyBatches();
        setBatches(
          (rows as any[]).map((b) => ({
            id: String(b.id),
            name: String(b.name || b.batch_name || 'Batch'),
          }))
        );
      } catch {
        setBatches([]);
      }
    };
    loadBatches();
  }, [role]);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const data = await api.getAssessment(id);
        const batchIds =
          data.batch_ids ||
          data.passing_criteria?.batch_ids ||
          (data.batch_id ? [data.batch_id] : []);
        setInitialData({
          ...data,
          batch_id: batchIds[0] || data.batch_id || data.passing_criteria?.batch_id,
          batch_ids: batchIds,
          time_window: {
            start_time: data.start_time ? utcIsoToDatetimeLocal(data.start_time) : '',
            end_time: data.end_time ? utcIsoToDatetimeLocal(data.end_time) : '',
          },
          metadata: {
            description: data.description,
            instructions: data.instructions,
            passing_criteria: data.passing_criteria || {
              overall_percentage: 70,
              minimum_round_scores: {},
            },
            disha_assessment_id: data.disha_assessment_id || data.external_id,
          },
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessment();
  }, [id]);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await api.updateAssessment(id, formData);
      router.push(basePath);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to update assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout role={role} title="Edit Assessment">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout role={role} title="Edit Assessment">
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="max-w-md rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="mb-4 font-medium text-red-600">{error}</p>
            <Button variant="secondary" onClick={() => router.push(basePath)}>
              Back to List
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role} title="Edit Assessment">
      <div className="w-full space-y-8 pb-8">
        <div className="sticky top-0 z-10 rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
          <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
            <Link href={basePath} className="transition-colors hover:text-blue-600">
              Assessments
            </Link>
            <span>/</span>
            <span className="font-medium text-gray-900">Edit Configuration</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {initialData?.assessment_name || 'Edit Assessment'}
          </h1>
        </div>

        <AssessmentForm
          onSubmit={handleSubmit}
          loading={isSubmitting}
          mode="edit"
          initialData={initialData}
          batches={batches}
        />
      </div>
    </DashboardLayout>
  );
}
