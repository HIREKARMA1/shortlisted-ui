'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';

const CREATE_FIELDS = ['name', 'email', 'password', 'phone'] as const;

type Coordinator = Record<string, unknown>;
type Batch = Record<string, unknown>;

export function SuperAdminCoordinatorsView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('super_admin');
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [ready, setReady] = useState(false);
  const [createForm, setCreateForm] = useState<Record<string, string>>(
    Object.fromEntries(CREATE_FIELDS.map((k) => [k, ''])),
  );
  const [editing, setEditing] = useState<Coordinator | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const load = () =>
    Promise.all([api.listCoordinators(), api.listAllBatches()])
      .then(([c, b]) => {
        setCoordinators(c);
        setBatches(b);
      })
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));

  useEffect(() => {
    load();
  }, [t]);

  const createCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAdmin(createForm);
      toast.success(t('dashboard.superAdmin.createSuccess'));
      setCreateForm(Object.fromEntries(CREATE_FIELDS.map((k) => [k, ''])));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const startEdit = (coordinator: Coordinator) => {
    setEditing(coordinator);
    setEditForm({
      name: String(coordinator.name),
      email: String(coordinator.email),
      phone: String(coordinator.phone || ''),
      password: '',
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.updateAdmin(String(editing.id), {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || undefined,
        ...(editForm.password ? { password: editForm.password } : {}),
      });
      toast.success(t('dashboard.superAdmin.coordinators.updateSuccess'));
      setEditing(null);
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const deactivate = async (id: string) => {
    try {
      await api.deactivateAdmin(id);
      toast.success(t('dashboard.superAdmin.coordinators.deactivateSuccess'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const assignBatch = async (batchId: string, coordinatorId: string) => {
    try {
      if (coordinatorId) {
        await api.assignBatchAdmin(batchId, coordinatorId);
      } else {
        await api.updateBatch(batchId, { admin_id: null });
      }
      toast.success(t('dashboard.superAdmin.assignSuccess'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  if (!ready) return <LoadingState />;

  const coordinatorOptions = coordinators.map((c) => ({
    value: String(c.id),
    label: String(c.name),
  }));

  return (
    <DashboardLayout
      role="super_admin"
      title={t('dashboard.superAdmin.coordinators.title')}
      subtitle={t('dashboard.superAdmin.coordinators.subtitle')}
      onLogout={logout}
    >
      <div className="card-surface mb-8 p-6">
        <SectionHeader title={t('dashboard.superAdmin.createAdmin')} className="mb-4" />
        <form onSubmit={createCoordinator} className="grid gap-4 md:grid-cols-2">
          {CREATE_FIELDS.map((field) => (
            <Input
              key={field}
              label={t(`dashboard.superAdmin.fields.${field}`)}
              type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
              value={createForm[field]}
              onChange={(e) => setCreateForm({ ...createForm, [field]: e.target.value })}
              required={field !== 'phone'}
            />
          ))}
          <Button type="submit" variant="accent" className="md:col-span-2">
            {t('common.actions.createAdmin')}
          </Button>
        </form>
      </div>

      {coordinators.length === 0 ? (
        <EmptyState message={t('dashboard.superAdmin.coordinators.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">{t('dashboard.superAdmin.coordinators.columns.name')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdmin.coordinators.columns.email')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdmin.coordinators.columns.password')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdmin.coordinators.columns.batches')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdmin.coordinators.columns.status')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdmin.coordinators.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-default">
              {coordinators.map((coordinator) => {
                const assignedBatches = (coordinator.batches as Batch[]) || [];
                return (
                  <tr key={String(coordinator.id)} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-medium">{String(coordinator.name)}</p>
                      {coordinator.phone ? (
                        <p className="text-xs text-ink-muted">{String(coordinator.phone)}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{String(coordinator.email)}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {String(coordinator.password || '—')}
                    </td>
                    <td className="px-4 py-3">
                      {assignedBatches.length === 0 ? (
                        <span className="text-ink-muted">{t('dashboard.superAdmin.unassigned')}</span>
                      ) : (
                        <div className="space-y-2">
                          {assignedBatches.map((batch) => (
                            <div key={String(batch.id)} className="flex flex-wrap items-center gap-2">
                              <span className="font-medium text-brand-blue">{String(batch.name)}</span>
                              <Select
                                value={String(coordinator.id)}
                                onChange={(e) => assignBatch(String(batch.id), e.target.value)}
                                options={[
                                  { value: String(coordinator.id), label: String(coordinator.name) },
                                  { value: '', label: t('dashboard.superAdmin.unassigned') },
                                  ...coordinatorOptions.filter((o) => o.value !== String(coordinator.id)),
                                ]}
                                className="min-w-[140px] text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 max-w-xs">
                        <Select
                          label={t('dashboard.superAdmin.coordinators.assignBatch')}
                          value=""
                          onChange={(e) => {
                            if (e.target.value) assignBatch(e.target.value, String(coordinator.id));
                          }}
                          options={[
                            { value: '', label: t('dashboard.superAdmin.coordinators.pickBatch') },
                            ...batches
                              .filter((b) => String(b.admin_id || '') !== String(coordinator.id))
                              .map((b) => ({ value: String(b.id), label: String(b.name) })),
                          ]}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={coordinator.is_active ? 'success' : 'neutral'}>
                        {coordinator.is_active
                          ? t('dashboard.superAdmin.coordinators.active')
                          : t('dashboard.superAdmin.coordinators.inactive')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" className="px-2 py-1" onClick={() => startEdit(coordinator)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {coordinator.is_active ? (
                          <Button
                            variant="ghost"
                            className="px-2 py-1 text-brand-red"
                            onClick={() => deactivate(String(coordinator.id))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-elevated">
            <h3 className="mb-4 font-semibold">{t('dashboard.superAdmin.coordinators.editTitle')}</h3>
            <div className="space-y-3">
              <Input
                label={t('dashboard.superAdmin.fields.name')}
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
              <Input
                label={t('dashboard.superAdmin.fields.email')}
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
              <Input
                label={t('dashboard.superAdmin.fields.phone')}
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
              <Input
                label={t('dashboard.superAdmin.coordinators.newPassword')}
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                {t('common.actions.cancel')}
              </Button>
              <Button variant="accent" onClick={saveEdit}>
                {t('common.actions.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
