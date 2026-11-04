'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/ui/LoadingState';

type CommunityPhoto = {
  id: string;
  image_url: string;
  photo_type: 'collage' | 'gallery';
  display_order: number;
  is_active: boolean;
};

export function CommunityManagementView() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { ready } = useRoleGuard('super_admin');
  const [rows, setRows] = useState<CommunityPhoto[]>([]);
  const [photoType, setPhotoType] = useState<'collage' | 'gallery'>('gallery');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const load = () =>
    api
      .listCommunityPhotos()
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .catch(() => toast.error(t('common.errors.generic')));

  useEffect(() => {
    if (ready) load();
  }, [ready]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('photo_type', photoType);
      data.append('display_order', String(displayOrder));
      if (imageFile) data.append('image', imageFile);
      await api.createCommunityPhoto(data);
      toast.success(t('dashboard.community.createSuccess'));
      setImageFile(null);
      setDisplayOrder(0);
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const onStatusChange = async (id: string, nextStatus: boolean) => {
    try {
      await api.updateCommunityPhotoStatus(id, nextStatus);
      toast.success(t('dashboard.community.statusUpdated'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.deleteCommunityPhoto(id);
      toast.success(t('dashboard.community.deleteSuccess'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  if (!ready) return <LoadingState />;

  const filtered = rows.filter((row) => {
    if (statusFilter === 'all') return true;
    return statusFilter === 'active' ? row.is_active : !row.is_active;
  });

  return (
    <DashboardLayout
      role="super_admin"
      title={t('dashboard.community.title')}
      subtitle={t('dashboard.community.subtitle')}
      onLogout={logout}
    >
      <section className="card-surface mb-8 p-6">
        <h2 className="font-display text-xl font-bold text-ink-primary">{t('dashboard.community.createTitle')}</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <Select
            label={t('dashboard.community.fields.type')}
            value={photoType}
            onChange={(e) => setPhotoType(e.target.value as 'collage' | 'gallery')}
            options={[
              { value: 'gallery', label: t('dashboard.community.types.gallery') },
              { value: 'collage', label: t('dashboard.community.types.collage') },
            ]}
          />
          <Input
            name="display_order"
            type="number"
            label={t('dashboard.community.fields.displayOrder')}
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            min={0}
          />
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-ink-primary">
              {t('dashboard.community.fields.image')} <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600"
            />
            <p className="mt-2 text-xs text-ink-muted">{t('dashboard.community.collageHint')}</p>
          </div>
          <Button type="submit" variant="accent" className="md:col-span-2" disabled={submitting}>
            {submitting ? t('common.actions.loading') : t('dashboard.community.create')}
          </Button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink-primary">{t('dashboard.community.listTitle')}</h2>
          <div className="w-44">
            <Select
              label={t('dashboard.community.filterStatus')}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              options={[
                { value: 'all', label: t('dashboard.community.filters.all') },
                { value: 'active', label: t('dashboard.community.filters.active') },
                { value: 'inactive', label: t('dashboard.community.filters.inactive') },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((row) => (
            <article key={row.id} className="card-surface overflow-hidden">
              <div className="relative aspect-[4/3] bg-ink-primary/5">
                {row.image_url ? (
                  <img src={row.image_url} alt={row.photo_type} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink-muted">No image</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">
                      {row.photo_type === 'collage'
                        ? t('dashboard.community.types.collage')
                        : t('dashboard.community.types.gallery')}
                    </p>
                    <p className="mt-1 text-sm text-ink-muted">
                      {t('dashboard.community.fields.displayOrder')}: {row.display_order}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-md p-2 text-ink-muted hover:bg-surface-muted hover:text-brand-red"
                    onClick={() => onDelete(row.id)}
                    aria-label="Delete community photo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <Select
                    label={t('dashboard.community.statusLabel')}
                    value={row.is_active ? 'active' : 'inactive'}
                    onChange={(e) => onStatusChange(row.id, e.target.value === 'active')}
                    options={[
                      { value: 'active', label: t('dashboard.community.filters.active') },
                      { value: 'inactive', label: t('dashboard.community.filters.inactive') },
                    ]}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
