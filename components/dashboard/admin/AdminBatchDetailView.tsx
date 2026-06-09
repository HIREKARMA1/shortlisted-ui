'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/layout/Shell';
import { LoadingState } from '@/components/ui/LoadingState';

export function AdminBatchDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const [batch, setBatch] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    api.getBatchDetail(id).then(setBatch).catch(() => router.push('/dashboard/admin'));
  }, [id, router]);

  if (!batch) return <LoadingState />;

  const students = (batch.students as Record<string, unknown>[]) || [];

  return (
    <DashboardShell
      title={String(batch.name)}
      subtitle={t('dashboard.batchDetail.seats', {
        filled: String(batch.seats_filled),
        max: String(batch.max_seats),
      })}
      actions={
        <Link href="/dashboard/admin" className="text-sm font-medium text-primary-600">
          ← {t('common.nav.back')}
        </Link>
      }
    >
      <p className="mb-6 text-ink-secondary">
        {t('dashboard.batchDetail.coordinator', {
          name: String(batch.admin_name || t('dashboard.superAdmin.unassigned')),
        })}
      </p>
      <div className="space-y-3">
        {students.map((s) => (
          <div key={String(s.student_id)} className="rounded-lg border border-line-default bg-white px-4 py-3">
            <p className="font-medium">{String(s.name)}</p>
            <p className="text-sm text-ink-muted">
              {String(s.email)} · {String(s.access_status)}
            </p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
