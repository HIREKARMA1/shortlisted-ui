'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/i18n/context';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { useGuestOnly, useSession } from '@/hooks/useSession';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const PERSONAL_FIELDS = ['name', 'email', 'password', 'phone'] as const;
const ACADEMIC_FIELDS = ['branch', 'college', 'graduation_year'] as const;
const PREF_FIELDS = ['skills', 'preferred_roles'] as const;

type FieldKey = (typeof PERSONAL_FIELDS)[number] | (typeof ACADEMIC_FIELDS)[number] | (typeof PREF_FIELDS)[number];
const ALL_FIELDS = [...PERSONAL_FIELDS, ...ACADEMIC_FIELDS, ...PREF_FIELDS] as const;

export function RegisterFormView() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { session, ready } = useSession();
  useGuestOnly();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<FieldKey, string>>(
    Object.fromEntries(ALL_FIELDS.map((k) => [k, ''])) as Record<FieldKey, string>
  );

  if (!ready || session) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register({
        ...form,
        graduation_year: form.graduation_year ? Number(form.graduation_year) : undefined,
      });
      toast.success(t('auth.register.success'));
      await login(form.email, form.password, 'student');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        t('common.errors.generic');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderFields = (fields: readonly FieldKey[]) =>
    fields.map((field) => (
      <Input
        key={field}
        name={field}
        label={t(`auth.register.fields.${field}`)}
        type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
        required={['name', 'email', 'password'].includes(field)}
        value={form[field]}
        onChange={(e) => setForm({ ...form, [field]: e.target.value })}
      />
    ));

  return (
    <AuthLayout
      title={t('auth.register.title')}
      subtitle={t('auth.register.subtitle')}
      footer={
        <>
          {t('auth.register.footer')}{' '}
          <Link href="/auth/login" className="link-brand font-medium">
            {t('auth.register.footerLink')}
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-blue">
            {t('auth.register.sections.personal')}
          </p>
          <div className="space-y-3">{renderFields(PERSONAL_FIELDS)}</div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-sky">
            {t('auth.register.sections.academic')}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">{renderFields(ACADEMIC_FIELDS)}</div>
        </div>
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-brand-orange">
            {t('auth.register.sections.preferences')}
          </p>
          <div className="space-y-3">{renderFields(PREF_FIELDS)}</div>
        </div>
        <p className="text-xs text-ink-muted">{t('auth.register.terms')}</p>
        <Button type="submit" fullWidth variant="accent" disabled={loading}>
          {loading ? t('auth.register.submitting') : t('auth.register.submit')}
        </Button>
      </form>
    </AuthLayout>
  );
}
