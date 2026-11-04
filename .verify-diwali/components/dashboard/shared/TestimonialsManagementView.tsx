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

type Testimonial = {
  id: string;
  name: string;
  batch_name: string;
  feedback: string;
  image_url: string;
  is_active: boolean;
};

const MAX_FEEDBACK_LENGTH = 1000;

const EMPTY_FORM = {
  name: '',
  batch_name: '',
  feedback: '',
};

export function TestimonialsManagementView({ role }: { role: DashboardRole }) {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const { ready } = useRoleGuard(role);
  const [rows, setRows] = useState<Testimonial[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    api
      .listTestimonials()
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
      data.append('name', form.name);
      data.append('batch_name', form.batch_name);
      data.append('feedback', form.feedback);
      if (imageFile) {
        data.append('image', imageFile);
      }
      await api.createTestimonial(data);
      toast.success(t('dashboard.testimonials.createSuccess'));
      setForm(EMPTY_FORM);
      setImageFile(null);
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    } finally {
      setSubmitting(false);
    }
  };

  const onStatusChange = async (id: string, nextStatus: boolean) => {
    try {
      await api.updateTestimonialStatus(id, nextStatus);
      toast.success(t('dashboard.testimonials.statusUpdated'));
      load();
    } catch {
      toast.error(t('common.errors.generic'));
    }
  };

  const onDelete = async (id: string) => {
    try {
      await api.deleteTestimonial(id);
      toast.success(t('dashboard.testimonials.deleteSuccess'));
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
      title={t('dashboard.testimonials.title')}
      subtitle={t('dashboard.testimonials.subtitle')}
      onLogout={logout}
    >
      <section className="card-surface mb-8 p-6">
        <h2 className="font-display text-xl font-bold text-ink-primary">{t('dashboard.testimonials.createTitle')}</h2>
        <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            name="name"
            label={t('dashboard.testimonials.fields.name')}
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <Input
            name="batch_name"
            label={t('dashboard.testimonials.fields.batchName')}
            value={form.batch_name}
            onChange={(e) => setForm((prev) => ({ ...prev, batch_name: e.target.value }))}
            required
          />
          <div className="md:col-span-2">
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium text-ink-primary">
                {t('dashboard.testimonials.fields.feedback')}
              </label>
              <span className="text-xs text-ink-muted">
                {form.feedback.length} / {MAX_FEEDBACK_LENGTH}
              </span>
            </div>
            <textarea
              value={form.feedback}
              onChange={(e) => setForm((prev) => ({ ...prev, feedback: e.target.value }))}
              rows={4}
              maxLength={MAX_FEEDBACK_LENGTH}
              className="w-full rounded-lg border border-line-default px-3 py-2 text-sm outline-none ring-brand-sky/40 focus:ring-2"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-ink-primary">
              {t('dashboard.testimonials.fields.image')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-ink-secondary file:mr-3 file:rounded-lg file:border-0 file:bg-brand-blue file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-600"
            />
          </div>
          <Button type="submit" variant="accent" className="md:col-span-2" disabled={submitting}>
            {submitting ? t('common.actions.loading') : t('dashboard.testimonials.create')}
          </Button>
        </form>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink-primary">{t('dashboard.testimonials.listTitle')}</h2>
          <div className="w-44">
            <Select
              label={t('dashboard.testimonials.filterStatus')}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              options={[
                { value: 'all', label: t('dashboard.testimonials.filters.all') },
                { value: 'active', label: t('dashboard.testimonials.filters.active') },
                { value: 'inactive', label: t('dashboard.testimonials.filters.inactive') },
              ]}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((row) => (
            <article key={row.id} className="card-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  {row.image_url ? (
                    <img src={row.image_url} alt={row.name} className="h-12 w-12 rounded-full border border-line-default object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line-default bg-brand-blue/10 text-sm font-bold text-brand-blue">
                      {row.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-ink-primary">{row.name}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">{row.batch_name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-md p-2 text-ink-muted hover:bg-surface-muted hover:text-brand-red"
                  onClick={() => onDelete(row.id)}
                  aria-label="Delete testimonial"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm text-ink-secondary">{row.feedback}</p>
              <div className="mt-4">
                <Select
                  label={t('dashboard.testimonials.statusLabel')}
                  value={row.is_active ? 'active' : 'inactive'}
                  onChange={(e) => onStatusChange(row.id, e.target.value === 'active')}
                  options={[
                    { value: 'active', label: t('dashboard.testimonials.filters.active') },
                    { value: 'inactive', label: t('dashboard.testimonials.filters.inactive') },
                  ]}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
