'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { RefreshCw, Trash2, Users } from 'lucide-react';
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

function dishaTone(status: string): 'success' | 'error' | 'warning' {
  if (status === 'registered') return 'success';
  if (status === 'failed') return 'error';
  return 'warning';
}

export function SuperAdminBatchesView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  useRoleGuard('super_admin');
  const [batches, setBatches] = useState<BatchRow[]>([]);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [ready, setReady] = useState(false);
  const [creating, setCreating] = useState(false);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingBatchId, setSyncingBatchId] = useState<string | null>(null);
  const [deletingBatchId, setDeletingBatchId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<BatchRow | null>(null);
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

  const pendingDishaCount = useMemo(
    () =>
      batches.filter((b) => String(b.disha_batch_registered) !== 'registered').length,
    [batches],
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

  const syncBatchToDisha = async (batchId: string, force = false) => {
    setSyncingBatchId(batchId);
    try {
      await api.syncBatchToDisha(batchId, force);
      toast.success(t('dashboard.superAdminBatches.syncSuccess'));
      loadBatches();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('dashboard.superAdminBatches.syncFailed');
      toast.error(String(msg));
    } finally {
      setSyncingBatchId(null);
    }
  };

  const syncAllToDisha = async () => {
    setSyncingAll(true);
    try {
      const result = await api.syncPendingBatchesToDisha();
      toast.success(result.message || t('dashboard.superAdminBatches.syncSuccess'));
      loadBatches();
    } catch {
      toast.error(t('dashboard.superAdminBatches.syncFailed'));
    } finally {
      setSyncingAll(false);
    }
  };

  const deleteBatch = async () => {
    if (!confirmDelete) return;
    const batchId = String(confirmDelete.id);
    setDeletingBatchId(batchId);
    try {
      const result = await api.deleteBatch(batchId);
      let msg = t('dashboard.superAdminBatches.deleteSuccess', {
        reassigned: String(result.students_reassigned),
      });
      if (Number(result.new_batches_created) > 0) {
        msg += ` ${t('dashboard.superAdminBatches.deleteNewBatches', {
          created: String(result.new_batches_created),
        })}`;
      }
      toast.success(msg);
      setConfirmDelete(null);
      loadBatches();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(String(msg));
    } finally {
      setDeletingBatchId(null);
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

      {batches.length > 0 ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line-default bg-surface-muted px-4 py-3">
          <div>
            <p className="text-sm font-medium text-ink-primary">
              {t('dashboard.superAdminBatches.dishaSyncTitle')}
            </p>
            <p className="text-xs text-ink-muted">
              {pendingDishaCount > 0
                ? t('dashboard.superAdminBatches.pendingDisha', { count: pendingDishaCount })
                : t('dashboard.superAdminBatches.syncAllHint')}
            </p>
          </div>
          <Button variant="secondary" onClick={syncAllToDisha} disabled={syncingAll}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncingAll ? 'animate-spin' : ''}`} />
            {syncingAll
              ? t('dashboard.superAdminBatches.syncingAll')
              : t('dashboard.superAdminBatches.syncAll')}
          </Button>
        </div>
      ) : null}

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
                <th className="px-4 py-3">{t('dashboard.superAdminBatches.columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-default">
              {batches.map((batch) => {
                const dishaStatus = String(batch.disha_batch_registered || 'pending');
                const batchId = String(batch.id);
                const isSyncing = syncingBatchId === batchId;
                const isDeleting = deletingBatchId === batchId;
                return (
                  <tr key={batchId}>
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
                      {String(batch.admin_name || '-')}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <Badge tone={dishaTone(dishaStatus)}>{dishaStatus}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                      {batch.created_at
                        ? new Date(String(batch.created_at)).toLocaleString()
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="secondary"
                          className="text-xs"
                          disabled={isSyncing || isDeleting}
                          onClick={() =>
                            syncBatchToDisha(batchId, dishaStatus === 'registered')
                          }
                        >
                          <RefreshCw className={`mr-1 h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing
                            ? t('dashboard.superAdminBatches.syncing')
                            : t('dashboard.superAdminBatches.sync')}
                        </Button>
                        <Button
                          variant="secondary"
                          className="text-xs text-brand-red hover:text-brand-red"
                          disabled={isSyncing || isDeleting}
                          onClick={() => setConfirmDelete(batch)}
                        >
                          <Trash2 className="mr-1 h-3.5 w-3.5" />
                          {t('dashboard.superAdminBatches.delete')}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-ink-primary">
              {t('dashboard.superAdminBatches.deleteTitle')}
            </h3>
            <p className="mt-2 text-sm text-ink-muted">
              {t('dashboard.superAdminBatches.deleteConfirm', {
                name: String(confirmDelete.name),
                count: String(confirmDelete.seats_filled),
              })}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmDelete(null)}
                disabled={deletingBatchId !== null}
              >
                {t('common.actions.cancel')}
              </Button>
              <Button
                variant="accent"
                onClick={deleteBatch}
                disabled={deletingBatchId !== null}
              >
                {deletingBatchId
                  ? t('common.actions.loading')
                  : t('dashboard.superAdminBatches.deleteConfirmCta')}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardLayout>
  );
}
