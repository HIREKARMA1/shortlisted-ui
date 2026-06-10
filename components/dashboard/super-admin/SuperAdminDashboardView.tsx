'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Users, Layers, UserCheck } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { accessBadgeTone } from '@/lib/status';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { LoadingState } from '@/components/ui/LoadingState';

const ADMIN_FIELDS = ['name', 'email', 'password', 'phone'] as const;

export function SuperAdminDashboardView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [batches, setBatches] = useState<Record<string, unknown>[]>([]);
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [coordinators, setCoordinators] = useState<Record<string, unknown>[]>([]);
  const [assigningBatchId, setAssigningBatchId] = useState<string | null>(null);
  const [adminForm, setAdminForm] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_FIELDS.map((k) => [k, '']))
  );
  const [ready, setReady] = useState(false);

  const load = () =>
    Promise.all([api.listAllBatches(), api.listStudents(), api.listAdmins()])
      .then(([b, s, a]) => {
        setBatches(b);
        setStudents(s);
        setCoordinators(a);
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setReady(true));

  useEffect(() => {
    if (!localStorage.getItem('access_token')) router.push('/auth/login');
    load();
  }, [router]);

  const createAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdmin(adminForm);
      toast.success(t('dashboard.superAdmin.createSuccess'));
      setAdminForm(Object.fromEntries(ADMIN_FIELDS.map((k) => [k, ''])));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const grant = async (studentId: string) => {
    try {
      await api.manualGrant(studentId);
      toast.success(t('dashboard.superAdmin.grantSuccess'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const syncBatchToDisha = async (batchId: string) => {
    try {
      await api.syncBatchToDisha(batchId);
      toast.success(t('dashboard.superAdmin.syncSuccess'));
      load();
    } catch {
      toast.error(t('dashboard.superAdmin.syncFailed'));
    }
  };

  const assignCoordinator = async (batchId: string, adminId: string) => {
    if (!adminId) return;
    setAssigningBatchId(batchId);
    try {
      await api.assignBatchAdmin(batchId, adminId);
      toast.success(t('dashboard.superAdmin.assignSuccess'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setAssigningBatchId(null);
    }
  };

  const syncAllToDisha = async () => {
    try {
      const result = await api.syncPendingBatchesToDisha();
      toast.success(result.message || t('dashboard.superAdmin.syncSuccess'));
      load();
    } catch {
      toast.error(t('dashboard.superAdmin.syncFailed'));
    }
  };

  if (!ready) return <LoadingState />;

  const activeStudents = students.filter((s) => String(s.access_status) === 'active').length;

  return (
    <DashboardLayout
      role="super_admin"
      title={t('dashboard.superAdmin.title')}
      subtitle={t('dashboard.superAdmin.subtitle')}
      onLogout={logout}
    >
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard
          label={t('dashboard.superAdmin.stats.batches')}
          value={batches.length}
          accent="blue"
          icon={Layers}
        />
        <StatCard
          label={t('dashboard.superAdmin.stats.students')}
          value={students.length}
          accent="sky"
          icon={Users}
        />
        <StatCard
          label={t('dashboard.superAdmin.stats.active')}
          value={activeStudents}
          accent="green"
          icon={UserCheck}
        />
      </div>

      <div className="card-surface mb-10 p-6">
        <SectionHeader title={t('dashboard.superAdmin.createAdmin')} className="mb-4" />
        <form onSubmit={createAdmin} className="grid gap-4 md:grid-cols-2">
          {ADMIN_FIELDS.map((field) => (
            <Input
              key={field}
              name={field}
              label={t(`dashboard.superAdmin.fields.${field}`)}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={adminForm[field]}
              onChange={(e) => setAdminForm({ ...adminForm, [field]: e.target.value })}
              required={field !== 'phone'}
            />
          ))}
          <Button type="submit" variant="accent" className="md:col-span-2">
            {t('common.actions.createAdmin')}
          </Button>
        </form>
      </div>

      <section className="mb-10">
        <SectionHeader
          title={t('dashboard.superAdmin.sections.batches', { count: batches.length })}
          action={
            <Button variant="secondary" onClick={syncAllToDisha}>
              {t('dashboard.superAdmin.syncAllDisha')}
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {batches.map((b) => {
            const dishaStatus = String(b.disha_batch_registered || 'pending');
            return (
              <div key={String(b.id)} className="card-surface border-l-4 border-l-brand-blue p-5">
                <p className="font-semibold text-brand-blue">{String(b.name)}</p>
                <p className="mt-2 text-sm text-ink-muted">
                  {t('dashboard.superAdmin.batchMeta', {
                    filled: String(b.seats_filled),
                    max: String(b.max_seats),
                    admin: String(b.admin_name || t('dashboard.superAdmin.unassigned')),
                  })}
                </p>
                <p className="mt-2 text-xs text-ink-muted">
                  DISHA:{' '}
                  <span
                    className={
                      dishaStatus === 'registered'
                        ? 'font-medium text-brand-green'
                        : dishaStatus === 'failed'
                          ? 'font-medium text-brand-red'
                          : 'font-medium text-brand-orange'
                    }
                  >
                    {dishaStatus}
                  </span>
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-brand-blue"
                    style={{
                      width: `${Math.round((Number(b.seats_filled) / Number(b.max_seats || 1)) * 100)}%`,
                    }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <Select
                    label={t('dashboard.superAdmin.assignCoordinator')}
                    value={String(b.admin_id || '')}
                    onChange={(e) => assignCoordinator(String(b.id), e.target.value)}
                    disabled={assigningBatchId === String(b.id)}
                    options={[
                      { value: '', label: t('dashboard.superAdmin.unassigned') },
                      ...coordinators.map((c) => ({
                        value: String(c.id),
                        label: String(c.name),
                      })),
                    ]}
                  />
                  {dishaStatus !== 'registered' && (
                    <Button
                      className="w-full"
                      variant="accent"
                      onClick={() => syncBatchToDisha(String(b.id))}
                    >
                      {t('dashboard.superAdmin.syncDisha')}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeader
          title={t('dashboard.superAdmin.sections.students', { count: students.length })}
        />
        <div className="overflow-hidden rounded-xl border border-line-default bg-white">
          <div className="divide-y divide-line-default">
            {students.map((s) => (
              <div
                key={String(s.id)}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
              >
                <div>
                  <p className="font-medium">{String(s.name)}</p>
                  <p className="text-sm text-ink-muted">{String(s.email)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={accessBadgeTone(String(s.access_status))}>
                    {String(s.access_status)}
                  </Badge>
                  {String(s.access_status) !== 'active' && (
                    <Button className="px-3 py-1.5 text-xs" onClick={() => grant(String(s.id))}>
                      {t('common.actions.grantAccess')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
