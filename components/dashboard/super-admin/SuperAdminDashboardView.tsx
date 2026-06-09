'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { DashboardShell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { LoadingState } from '@/components/ui/LoadingState';

const ADMIN_FIELDS = ['name', 'email', 'password', 'phone'] as const;

export function SuperAdminDashboardView() {
  const router = useRouter();
  const { t } = useTranslation();
  const { logout } = useAuth();
  const [batches, setBatches] = useState<Record<string, unknown>[]>([]);
  const [students, setStudents] = useState<Record<string, unknown>[]>([]);
  const [adminForm, setAdminForm] = useState<Record<string, string>>(
    Object.fromEntries(ADMIN_FIELDS.map((k) => [k, '']))
  );
  const [ready, setReady] = useState(false);

  const load = () =>
    Promise.all([api.listAllBatches(), api.listStudents()])
      .then(([b, s]) => {
        setBatches(b);
        setStudents(s);
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

  if (!ready) return <LoadingState />;

  return (
    <DashboardShell
      title={t('dashboard.superAdmin.title')}
      actions={
        <Button variant="ghost" onClick={logout}>
          {t('common.nav.logout')}
        </Button>
      }
    >
      <Card className="mb-10">
        <h2 className="mb-4 font-semibold">{t('dashboard.superAdmin.createAdmin')}</h2>
        <form onSubmit={createAdmin} className="grid gap-3 md:grid-cols-2">
          {ADMIN_FIELDS.map((field) => (
            <Input
              key={field}
              name={field}
              label={t(`dashboard.superAdmin.fields.${field}`)}
              type={field === 'password' ? 'password' : 'text'}
              value={adminForm[field]}
              onChange={(e) => setAdminForm({ ...adminForm, [field]: e.target.value })}
              required={field !== 'phone'}
            />
          ))}
          <Button type="submit" className="md:col-span-2">
            {t('common.actions.createAdmin')}
          </Button>
        </form>
      </Card>

      <section className="mb-10">
        <h2 className="mb-4 font-semibold">{t('dashboard.superAdmin.sections.batches', { count: batches.length })}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {batches.map((b) => (
            <Card key={String(b.id)}>
              <p className="font-medium">{String(b.name)}</p>
              <p className="text-sm text-ink-muted">
                {t('dashboard.superAdmin.batchMeta', {
                  filled: String(b.seats_filled),
                  max: String(b.max_seats),
                  admin: String(b.admin_name || t('dashboard.superAdmin.unassigned')),
                })}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 font-semibold">{t('dashboard.superAdmin.sections.students')}</h2>
        <div className="space-y-2">
          {students.map((s) => (
            <div key={String(s.id)} className="flex items-center justify-between rounded-lg border border-line-default bg-white px-4 py-3">
              <div>
                <p className="font-medium">{String(s.name)}</p>
                <p className="text-sm text-ink-muted">
                  {String(s.email)} · {String(s.access_status)}
                </p>
              </div>
              {String(s.access_status) !== 'active' && (
                <Button onClick={() => grant(String(s.id))}>{t('common.actions.grantAccess')}</Button>
              )}
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
