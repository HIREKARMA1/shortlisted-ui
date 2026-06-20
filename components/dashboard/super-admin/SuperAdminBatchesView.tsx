'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Users } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { Badge } from '@/components/ui/Badge';

type BatchRow = Record<string, unknown>;
type Coordinator = Record<string, unknown>;

export function SuperAdminBatchesView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('super_admin');
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [ready, setReady] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [maxSeats, setMaxSeats] = useState('12');
  const [coordinatorId, setCoordinatorId] = useState('');

  const loadBatches = useCallback(() => {
    api
      .listAllBatches()
      .then(setBatches)
      .catch(() => toast.error(t('common.errors.network')));
  }, [t]);

  useEffect(() => {
    Promise.all([api.listAllBatches(), api.listCoordinators()])
      .then(([batchData, coordData]) => {
        setBatches(batchData);
        setCoordinators(coordData);
      })
      .catch(() => toast.error(t('common.errors.network')))
      .finally(() => setReady(true));
  }, [t]);

  const coordinatorOptions = useMemo(
    () => [
      { value: '', label: t('dashboard.superAdminBatches.autoCoordinator') },
      ...coordinators.map((c) => ({
        value: String(c.id),
        label: String(c.name),
      })),
    ],
    [coordinators, t],
  );

  const createBatch = async () => {
    const seats = Number(maxSeats);
    if (!seats || seats < 1) {
      toast.error(t('dashboard.superAdminBatches.invalidSeats'));
      return;
    }
    setCreating(true);
    try {
      await api.createBatch({
        name: name.trim() || undefined,
        max_seats: seats,
        admin_id: coordinatorId || undefined,
      });
      toast.success(t('dashboard.superAdminBatches.createSuccess'));
      setName('');
      setMaxSeats('12');
      setCoordinatorId('');
      loadBatches();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setCreating(false);
    }
  };

  if (!ready) return <LoadingState />;

  return (
    <DashboardLayout
      role="super_admin"
      title={t('dashboard.superAdminBatches.title')}
      subtitle={t('dashboard.superAdminBatches.subtitle')}
      onLogout={logout}
    >
      <div className="mb-8 rounded-xl border border-line-default bg-white p-6">
        <h3 className="mb-4 font-semibold text-ink-primary">
          {t('dashboard.superAdminBatches.createTitle')}
        </h3>
        <div className="grid gap-4 md:grid-cols-4">
          <Input
            label={t('dashboard.superAdminBatches.name')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('dashboard.superAdminBatches.namePlaceholder')}
          />
          <Input
            label={t('dashboard.superAdminBatches.maxSeats')}
            type="number"
            min={1}
            value={maxSeats}
            onChange={(e) => setMaxSeats(e.target.value)}
          />
          <Select
            label={t('dashboard.superAdminBatches.coordinator')}
            value={coordinatorId}
            onChange={(e) => setCoordinatorId(e.target.value)}
            options={coordinatorOptions}
          />
          <div className="flex items-end">
            <Button variant="accent" fullWidth onClick={createBatch} disabled={creating}>
              {creating ? t('common.actions.loading') : t('dashboard.superAdminBatches.createCta')}
            </Button>
          </div>
        </div>
      </div>

      {batches.length === 0 ? (
        <EmptyState message={t('dashboard.superAdminBatches.empty')} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line-default bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line-default bg-surface-muted text-xs font-semibold uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.name')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.seats')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.status')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.coordinator')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.disha')}</th>
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.created')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-default">
              {batches.map((batch) => (
                <tr key={String(batch.id)}>
                  <td className="px-4 py-3 font-medium text-brand-blue">{String(batch.name)}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-ink-muted" />
                      {String(batch.seats_filled)}/{String(batch.max_seats)}
                    </span>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    <Badge tone={String(batch.status) === 'full' ? 'warning' : 'success'}>
                      {String(batch.status)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {String(batch.admin_name || '—')}
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-muted">
                    {String(batch.disha_batch_registered)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                    {batch.created_at
                      ? new Date(String(batch.created_at)).toLocaleString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
