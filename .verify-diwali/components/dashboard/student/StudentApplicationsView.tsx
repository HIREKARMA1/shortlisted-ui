'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { normalizeApplication, normalizeJob } from '@/lib/jobUtils';
import type { StudentApplication } from '@/lib/types/studentJobs';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';
import { StudentApplicationTable } from '@/components/dashboard/student/applications/StudentApplicationTable';

export function StudentApplicationsView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [apps, setApps] = useState<StudentApplication[]>([]);
  const [ready, setReady] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await api.getApplications();
      setApps((data as Record<string, unknown>[]).map((row) => normalizeApplication(row)));
    } catch {
      toast.error(t('common.errors.network'));
    } finally {
      setReady(true);
    }
  }, [t]);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      router.push('/auth/login');
      return;
    }
    load();
  }, [router, load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((app) => {
      const company = (app.company_name || app.corporate_name || '').toLowerCase();
      return (
        (app.job_title || '').toLowerCase().includes(q) ||
        company.includes(q) ||
        app.status.toLowerCase().includes(q)
      );
    });
  }, [apps, search]);

  const stats = useMemo(() => {
    const total = apps.length;
    const active = apps.filter((a) => !['rejected', 'selected'].includes(a.status.toLowerCase())).length;
    const selected = apps.filter((a) => a.status.toLowerCase() === 'selected').length;
    return { total, active, selected };
  }, [apps]);

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.applications.title')}
      subtitle={t('dashboard.applications.subtitle')}
      onLogout={logout}
    >
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: t('dashboard.applications.stats.total'), value: stats.total, tone: 'border-brand-blue text-brand-blue' },
          { label: t('dashboard.applications.stats.active'), value: stats.active, tone: 'border-brand-sky text-brand-sky' },
          { label: t('dashboard.applications.stats.selected'), value: stats.selected, tone: 'border-brand-green text-brand-green' },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl border bg-white p-4 shadow-card ${item.tone.split(' ')[0]}`}
          >
            <p className="text-sm text-ink-muted">{item.label}</p>
            <p className={`mt-1 text-2xl font-bold ${item.tone.split(' ')[1]}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('dashboard.applications.searchPlaceholder')}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState message={t('dashboard.applications.empty')} />
      ) : (
        <StudentApplicationTable applications={filtered} />
      )}
    </DashboardLayout>
  );
}
