'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { getLoginPathForRole } from '@/lib/auth/login-routes';
import { accessBadgeTone } from '@/lib/status';
import { exportBatchRosterToCSV } from '@/utils/exportToExcel';
import { ExportCsvButton } from '@/components/dashboard/shared/management/ExportCsvButton';
import {
  alternatingRowClass,
  StudentAvatar,
} from '@/components/dashboard/shared/management/ManagementPagination';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

export function AdminBatchDetailView() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [batch, setBatch] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token') || localStorage.getItem('user_type') !== 'admin') {
      router.push(getLoginPathForRole('admin'));
      return;
    }
    api.getBatchDetail(id).then(setBatch).catch(() => router.push('/dashboard/admin'));
  }, [id, router]);

  if (!batch) return <LoadingState />;

  const students = (batch.students as Record<string, unknown>[]) || [];

  return (
    <DashboardLayout
      role="admin"
      title={String(batch.name)}
      subtitle={t('dashboard.batchDetail.seats', {
        filled: String(batch.seats_filled),
        max: String(batch.max_seats),
      })}
      onLogout={logout}
      actions={
        <Link href="/dashboard/admin" className="link-brand">
          ← {t('common.nav.back')}
        </Link>
      }
    >
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <StatCard
          label={t('dashboard.batchDetail.coordinator', {
            name: String(batch.admin_name || t('dashboard.superAdmin.unassigned')),
          })}
          value={`${batch.seats_filled}/${batch.max_seats}`}
          accent="sky"
          icon={Users}
        />
        <StatCard
          label={t('dashboard.batchDetail.roster')}
          value={students.length}
          accent="orange"
          icon={Users}
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <SectionHeader title={t('dashboard.batchDetail.roster')} />
        {students.length > 0 ? (
          <ExportCsvButton
            label={t('dashboard.batchDetail.exportCsv')}
            onClick={() => {
              exportBatchRosterToCSV(
                students.map((s) => ({
                  name: String(s.name || ''),
                  email: String(s.email || ''),
                  phone: s.phone ? String(s.phone) : undefined,
                  access_status: s.access_status ? String(s.access_status) : undefined,
                })),
                String(batch.name),
              );
              toast.success(t('dashboard.batchDetail.exportSuccess'));
            }}
          />
        ) : null}
      </div>
      {students.length === 0 ? (
        <EmptyState message={t('dashboard.batchDetail.rosterEmpty')} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line-default bg-white shadow-lg">
          <div className="hidden border-b border-line-default bg-surface-muted px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted sm:grid sm:grid-cols-3">
            <span>{t('dashboard.batchDetail.columns.name')}</span>
            <span>{t('dashboard.batchDetail.columns.email')}</span>
            <span>{t('dashboard.batchDetail.columns.status')}</span>
          </div>
          <div>
            {students.map((s, index) => (
              <div
                key={String(s.student_id)}
                className={`border-b border-line-default px-4 py-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 ${alternatingRowClass(index)}`}
              >
                <div className="flex items-center gap-3">
                  <StudentAvatar name={String(s.name)} />
                  <p className="font-medium text-ink-primary">{String(s.name)}</p>
                </div>
                <p className="mt-2 text-sm text-ink-muted sm:mt-0">{String(s.email)}</p>
                <div className="mt-2 sm:mt-0">
                  <Badge tone={accessBadgeTone(String(s.access_status))}>
                    {String(s.access_status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
