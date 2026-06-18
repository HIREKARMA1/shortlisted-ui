'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/context';
import { useAuth } from '@/hooks/useAuth';
import { useRoleGuard } from '@/hooks/useRoleGuard';
import type { DashboardRole } from '@/lib/dashboard-nav';
import { api } from '@/lib/api';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { LoadingState } from '@/components/ui/LoadingState';

type SuccessStory = {
  id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  is_active: boolean;
};

const EMPTY_FORM = {
  title: '',
};

export function SuccessStoriesManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { ready } = useRoleGuard(role);
  const [rows, setRows] = useState<SuccessStory[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    api
      .listSuccessStories()
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
      data.append('title', form.title);
      if (thumbnailFile) data.append('thumbnail', thumbnailFile);
      if (videoFile) data.append('video', videoFile);
      await api.createSuccessStory(data);
      toast.success(t('dashboard.successStories.createSuccess'));
      setForm(EMPTY_FORM);
      setThumbnailFile(null);
      setVideoFile(null);
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const onStatusChange = async (id: string, nextStatus: boolean) => {
    try {
      await api.updateSuccessStoryStatus(id, nextStatus);
      toast.success(t('dashboard.successStories.statusUpdated'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.deleteSuccessStory(id);
      toast.success(t('dashboard.successStories.deleteSuccess'));
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
      role={role}
      title={t('dashboard.successStories.title')}
      subtitle={t('dashboard.successStories.subtitle')}
      onLogout={logout}
    >
      <section className="card-surface mb-8 p-6">
        <h2 className="font-display text-xl font-bold text-ink-primary">{t('dashboard.successStories.createTitle')}</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Input
              name="title"
              label={t('dashboard.successStories.fields.title')}
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-ink-primary">
              {t('dashboard.successStories.fields.thumbnail')} <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-ink-primary">
              {t('dashboard.successStories.fields.video')} <span className="text-ink-muted">(optional)</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600"
            />
          </div>
          <Button type="submit" variant="accent" className="md:col-span-2" disabled={submitting}>
            {submitting ? t('common.actions.loading') : t('dashboard.successStories.create')}
          </Button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink-primary">{t('dashboard.successStories.listTitle')}</h2>
          <div className="w-44">
            <Select
              label={t('dashboard.successStories.filterStatus')}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              options={[
                { value: 'all', label: t('dashboard.successStories.filters.all') },
                { value: 'active', label: t('dashboard.successStories.filters.active') },
                { value: 'inactive', label: t('dashboard.successStories.filters.inactive') },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((row) => (
            <article key={row.id} className="card-surface overflow-hidden">
              <div className="relative aspect-video bg-ink-primary/5">
                {row.thumbnail_url ? (
                  <img src={row.thumbnail_url} alt={row.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-ink-muted">No thumbnail</div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-ink-primary">{row.title}</h3>
                  <button
                    type="button"
                    className="rounded-md p-2 text-ink-muted hover:bg-surface-muted hover:text-brand-red"
                    onClick={() => onDelete(row.id)}
                    aria-label="Delete success story"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {row.video_url ? (
                  <a href={row.video_url} target="_blank" rel="noopener noreferrer" className="link-brand mt-2 inline-block text-sm">
                    {t('dashboard.successStories.viewVideo')}
                  </a>
                ) : (
                  <p className="mt-2 text-sm text-ink-muted">No video uploaded</p>
                )}
                <div className="mt-4">
                  <Select
                    label={t('dashboard.successStories.statusLabel')}
                    value={row.is_active ? 'active' : 'inactive'}
                    onChange={(e) => onStatusChange(row.id, e.target.value === 'active')}
                    options={[
                      { value: 'active', label: t('dashboard.successStories.filters.active') },
                      { value: 'inactive', label: t('dashboard.successStories.filters.inactive') },
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
