'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AssessmentForm } from '@/components/admin/AssessmentForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { assessmentBasePath } from '@/lib/assessmentDashboard';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { api } from '@/lib/api';

export function AssessmentCreatePage({ role }: { role: DashboardRole }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchId = searchParams.get('batchId');
  const basePath = assessmentBasePath(role);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<Array<{ id: string; name: string }>>([]);
  const [batchName, setBatchName] = useState('');

  useEffect(() => {
    const loadBatches = async () => {
      try {
        const rows =
          role === 'super_admin' ? await api.listAllBatches() : await api.listMyBatches();
        const mapped = (rows as any[]).map((b) => ({
          id: String(b.id),
          name: String(b.name || b.batch_name || 'Batch'),
        }));
        setBatches(mapped);
        if (batchId) {
          const match = mapped.find((b) => b.id === batchId);
          if (match) setBatchName(match.name);
        }
      } catch {
        setBatches([]);
      }
    };
    loadBatches();
  }, [batchId, role]);

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await api.createAssessment(formData);
      const rid = response.id || response.assessment_id;
      if (rid) router.push(`${basePath}/${rid}?created=1`);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || 'Failed to create assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initialData = useMemo(
    () => ({
      ...(batchId ? { batch_id: batchId, batch_ids: [batchId] } : {}),
      ...(batchName ? { assessment_name: `${batchName} Assessment` } : {}),
    }),
    [batchId, batchName]
  );

  return (
    <DashboardLayout role={role} title="Create Assessment">
      <div className="w-full space-y-8 pb-8">
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Link href={basePath} className="transition-colors hover:text-blue-600">
                Assessments
              </Link>
              <span>/</span>
              <span className="font-medium text-gray-900">Create Assessment</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {batchName ? `Create Assessment for ${batchName}` : 'Create New Assessment'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Configure assessment details, rounds, and settings.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
        )}

        <AssessmentForm
          onSubmit={handleSubmit}
          loading={isSubmitting}
          mode="create"
          initialData={initialData}
          batches={batches}
        />
      </div>
    </DashboardLayout>
  );
}
