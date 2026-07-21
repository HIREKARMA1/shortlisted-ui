'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Briefcase, ClipboardList, Shield, Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useStudentActiveGate } from '@/hooks/useStudentActiveGate';
import { api } from '@/lib/api';
import { applicationBadgeTone } from '@/lib/status';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

export function StudentDashboardView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  useStudentActiveGate();
  const [data, setData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('access_token')) return;
    let cancelled = false;
    api
      .getDashboard()
      .then((dashboard) => {
        if (cancelled) return;
        const status = String((dashboard.student as { access_status?: string })?.access_status || '');
        localStorage.setItem('access_status', status);
        if (status !== 'active') {
          router.push('/subscribe');
          return;
        }
        setData(dashboard);
      })
      .catch((err) => {
        if (cancelled) return;
        // 401 is handled by the API interceptor (refresh or force logout).
        if (axios.isAxiosError(err) && err.response?.status === 401) return;
        router.push('/subscribe');
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (!data) return <LoadingState />;

  const student = data.student as Record<string, unknown>;
  const batch = data.batch as Record<string, unknown> | null;
  const jobs = (data.recent_jobs as Record<string, unknown>[]) || [];
  const apps = (data.active_applications as Record<string, unknown>[]) || [];

  return (
    <DashboardLayout
      role="student"
      title={t('dashboard.student.title')}
      subtitle={t('dashboard.student.welcome', { name: String(student.name) })}
      onLogout={logout}
    >
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard
          label={t('dashboard.student.stats.access')}
          value={<span className="capitalize">{String(student.access_status)}</span>}
          accent="green"
          icon={Shield}
        />
        <StatCard
          label={t('dashboard.student.stats.batch')}
          value={batch ? String(batch.name) : t('dashboard.student.stats.batchAdminPending')}
          hint={
            batch
              ? batch.admin_name
                ? `${t('dashboard.student.stats.batchAdmin')}: ${String(batch.admin_name)}`
                : t('dashboard.student.stats.batchAdminPending')
              : undefined
          }
          accent="sky"
          icon={Users}
        />
        <StatCard
          label={t('dashboard.student.stats.applications')}
          value={String(data.applications_count ?? 0)}
          accent="orange"
          icon={ClipboardList}
        />
      </div>

      <div className="card-surface mb-8 flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="font-medium text-ink-primary">{t('dashboard.student.quickActions.title')}</p>
          <p className="text-sm text-ink-muted">{t('dashboard.student.quickActions.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/student/jobs">
            <Button variant="secondary">
              <Briefcase className="mr-2 h-4 w-4" />
              {t('dashboard.student.quickActions.browseJobs')}
            </Button>
          </Link>
          <Link href="/dashboard/student/applications">
            <Button variant="ghost">{t('dashboard.student.quickActions.viewApplications')}</Button>
          </Link>
        </div>
      </div>

      <section className="mb-8">
        <SectionHeader
          title={t('dashboard.student.sections.jobs')}
          action={
            jobs.length > 0 ? (
              <Link href="/dashboard/student/jobs" className="link-brand">
                {t('common.actions.viewAll')} →
              </Link>
            ) : undefined
          }
        />
        {jobs.length === 0 ? (
          <EmptyState message={t('dashboard.student.empty.jobs')} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <div key={String(job.id)} className="card-surface p-5 transition-shadow hover:shadow-elevated">
                <h3 className="font-semibold text-brand-blue">{String(job.title)}</h3>
                <p className="mt-1 text-sm text-ink-muted">
                  {String(job.company_name || job.location || '')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionHeader
          title={t('dashboard.student.sections.applications')}
          action={
            apps.length > 0 ? (
              <Link href="/dashboard/student/applications" className="link-brand">
                {t('common.actions.viewAll')} →
              </Link>
            ) : undefined
          }
        />
        {apps.length === 0 ? (
          <EmptyState message={t('dashboard.student.empty.applications')} />
        ) : (
          <div className="space-y-2">
            {apps.map((app) => (
              <div
                key={String(app.id)}
                className="flex items-center justify-between rounded-xl border border-line-default bg-white px-4 py-3"
              >
                <span className="font-medium">{String(app.job_title)}</span>
                <Badge tone={applicationBadgeTone(String(app.status))}>{String(app.status)}</Badge>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
